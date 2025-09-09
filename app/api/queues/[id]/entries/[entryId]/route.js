import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, entryId } = await params;
    const body = await request.json();
    const { action } = body; // 'serve' or 'skip'

    // Check if user owns the queue
    const queue = await prisma.queue.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!queue || queue.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const entry = await prisma.queueEntry.findUnique({
      where: { id: entryId },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    // Get user data for notifications
    const userData = entry.userData || {};
    const userName = userData.name || entry.user?.name || "Anonymous";
    const userEmail = userData.email || entry.user?.email;

    if (action === "serve") {
      // Mark as served
      await prisma.queueEntry.update({
        where: { id: entryId },
        data: {
          status: "SERVED",
          servedAt: new Date(),
        },
      });

      // Update positions of remaining entries
      await prisma.queueEntry.updateMany({
        where: {
          queueId: id,
          status: "WAITING",
          position: { gt: entry.position },
        },
        data: {
          position: { decrement: 1 },
        },
      });

      // Send notification if email is available
      if (userEmail) {
        try {
          const { emailService } = await import("@/lib/email");
          await emailService.sendYourTurnEmail({
            to: userEmail,
            queueName: "Queue Service",
            checkInCode: `QG${id}${entry.position}`,
          });
        } catch (emailError) {
          console.error("Email notification failed:", emailError);
        }
      }
    } else if (action === "skip") {
      // Move to end of queue
      const lastEntry = await prisma.queueEntry.findFirst({
        where: {
          queueId: id,
          status: "WAITING",
        },
        orderBy: { position: "desc" },
      });

      const newPosition = (lastEntry?.position || 0) + 1;

      await prisma.queueEntry.update({
        where: { id: entryId },
        data: { position: newPosition },
      });

      // Update positions of entries that were after this one
      await prisma.queueEntry.updateMany({
        where: {
          queueId: id,
          status: "WAITING",
          position: { gt: entry.position },
          id: { not: entryId },
        },
        data: {
          position: { decrement: 1 },
        },
      });
    }

    return NextResponse.json({
      message: "Entry updated successfully",
      userName,
      action,
    });
  } catch (error) {
    console.error("Error updating queue entry:", error);
    return NextResponse.json(
      { error: "Failed to update queue entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, entryId } = params;

    // Check if entry exists and get its details
    const entry = await prisma.queueEntry.findUnique({
      where: { id: entryId },
      include: {
        queue: {
          select: { ownerId: true },
        },
      },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    // Check if user owns the queue or is the entry owner
    const canDelete =
      entry.queue.ownerId === user.id || entry.userId === user.id;

    if (!canDelete) {
      return NextResponse.json(
        { error: "You don't have permission to leave this queue" },
        { status: 403 }
      );
    }

    // Mark as left and update positions
    await prisma.$transaction([
      // Mark the entry as LEFT
      prisma.queueEntry.update({
        where: { id: entryId },
        data: { status: "LEFT" },
      }),
      // Update positions of remaining entries
      prisma.queueEntry.updateMany({
        where: {
          queueId: id,
          status: "WAITING",
          position: { gt: entry.position },
        },
        data: {
          position: { decrement: 1 },
        },
      }),
    ]);

    return NextResponse.json({ message: "Successfully left the queue" });
  } catch (error) {
    console.error("Error leaving queue:", error);
    return NextResponse.json(
      { error: "Failed to leave queue. Please try again." },
      { status: 500 }
    );
  }
}
