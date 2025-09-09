import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    const id = params.id;
    const body = await request.json();
    const user = await getCurrentUser();

    // Check if queue exists and is active
    const queue = await prisma.queue.findUnique({
      where: { id },
      include: {
        entries: {
          where: { status: "WAITING" },
          orderBy: { position: "desc" },
          take: 1,
        },
      },
    });

    if (!queue || !queue.isActive) {
      return NextResponse.json(
        { error: "Queue not found or inactive" },
        { status: 404 }
      );
    }

    // Check if user is already in queue
    if (user) {
      const existingEntry = await prisma.queueEntry.findFirst({
        where: {
          queueId: id,
          userId: user.id,
          status: "WAITING",
        },
      });

      if (existingEntry) {
        return NextResponse.json(
          { error: "Already in queue" },
          { status: 400 }
        );
      }
    }

    const lastPosition = queue.entries[0]?.position || 0;
    const nextPosition = lastPosition + 1;

    const entry = await prisma.queueEntry.create({
      data: {
        queueId: id,
        userId: user?.id,
        position: nextPosition,
        userData: body,
      },
    });

    return NextResponse.json(
      {
        id: entry.id,
        position: entry.position,
        queueId: id,
        joinedAt: entry.joinedAt,
        estimatedWaitTime: `${nextPosition * 2} min`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error joining queue:", error);
    return NextResponse.json(
      { error: "Failed to join queue" },
      { status: 500 }
    );
  }
}
