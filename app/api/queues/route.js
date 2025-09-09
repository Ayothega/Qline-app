import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const sortBy = searchParams.get("sortBy") || "createdAt"

    const where = {
      isPublic: true,
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category && { category }),
    }

    const orderBy = sortBy === "waitTime" ? { entries: { _count: "asc" } } : { createdAt: "desc" }

    const queues = await prisma.queue.findMany({
      where,
      orderBy,
      include: {
        entries: {
          where: { status: "WAITING" },
          orderBy: { position: "asc" },
        },
        _count: {
          select: { entries: { where: { status: "WAITING" } } },
        },
      },
    })

    // Calculate wait times and format response
    const formattedQueues = queues.map((queue) => {
      const waitingCount = queue._count.entries
      const avgWaitTime = Math.max(waitingCount * 2, 5) // 2 min per person, min 5 min

      return {
        id: queue.id,
        name: queue.name,
        location: queue.location,
        category: queue.category,
        description: queue.description,
        waitTime: `${avgWaitTime} min`,
        peopleInQueue: waitingCount,
        isPopular: waitingCount > 10,
        createdAt: queue.createdAt,
      }
    })

    return NextResponse.json(formattedQueues)
  } catch (error) {
    console.error("Error fetching queues:", error)
    return NextResponse.json({ error: "Failed to fetch queues" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, location, category, description, isPublic, customFields } = body

    const queue = await prisma.queue.create({
      data: {
        name,
        location,
        category,
        description,
        isPublic: isPublic ?? true,
        ownerId: user.id,
        customFields: {
          create:
            customFields?.map((field, index) => ({
              label: field.label,
              type: field.type.toUpperCase(),
              required: field.required,
              options: field.options,
              order: index,
            })) || [],
        },
      },
      include: {
        customFields: true,
      },
    })

    return NextResponse.json(queue, { status: 201 })
  } catch (error) {
    console.error("Error creating queue:", error)
    return NextResponse.json({ error: "Failed to create queue" }, { status: 500 })
  }
}
