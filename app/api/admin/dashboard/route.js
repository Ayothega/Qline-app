import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's queues with stats
    const queues = await prisma.queue.findMany({
      where: { ownerId: user.id },
      include: {
        entries: {
          where: { status: "WAITING" },
          orderBy: { position: "asc" },
        },
        _count: {
          select: {
            entries: {
              where: { status: "WAITING" },
            },
          },
        },
      },
    })

    // Calculate dashboard stats
    const activeQueues = queues.filter((q) => q.isActive).length
    const totalPeopleWaiting = queues.reduce((sum, q) => sum + q._count.entries, 0)
    const avgWaitTime = totalPeopleWaiting > 0 ? Math.round((totalPeopleWaiting * 2) / queues.length) : 0

    // Get served today count
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const servedToday = await prisma.queueEntry.count({
      where: {
        queue: { ownerId: user.id },
        status: "SERVED",
        servedAt: { gte: today },
      },
    })

    const formattedQueues = queues.map((queue) => ({
      id: queue.id,
      name: queue.name,
      location: queue.location,
      status: queue.isActive ? "active" : "inactive",
      peopleWaiting: queue._count.entries,
      averageWaitTime: `${Math.max(queue._count.entries * 2, 5)} min`,
      capacity: queue.capacity,
    }))

    return NextResponse.json({
      activeQueues,
      totalPeopleWaiting,
      averageWaitTime: `${avgWaitTime} min`,
      servedToday,
      queues: formattedQueues,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
