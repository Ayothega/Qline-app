import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entry = await prisma.queueEntry.findFirst({
      where: {
        userId: user.id,
        status: "WAITING",
      },
      include: {
        queue: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    if (!entry) {
      return NextResponse.json({ entry: null });
    }

    const response = {
      id: entry.queue.id,
      name: entry.queue.name,
      location: entry.queue.location,
      position: entry.position,
      waitTime: `${entry.position * 2} min`,
      joinedAt: entry.joinedAt.toISOString(),
      userData: entry.userData,
      entryId: entry.id,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching user queue status:", error);
    return NextResponse.json(
      { error: "Failed to fetch queue status" },
      { status: 500 }
    );
  }
}
