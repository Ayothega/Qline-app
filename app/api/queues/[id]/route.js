import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request, { params }) {
  try {
    const { id } = await params

    const queue = await prisma.queue.findUnique({
      where: { id },
      include: {
        customFields: {
          orderBy: { order: "asc" },
        },
        entries: {
          where: { status: "WAITING" },
          orderBy: { position: "asc" },
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
        owner: {
          select: { name: true, email: true },
        },
        _count: {
          select: {
            entries: { where: { status: "WAITING" } },
          },
        },
      },
    })

    if (!queue) {
      return NextResponse.json({ error: "Queue not found" }, { status: 404 })
    }

    // Calculate wait time
    const waitingCount = queue._count.entries
    const avgWaitTime = Math.max(waitingCount * 2, 5)

    const response = {
      ...queue,
      waitTime: `${avgWaitTime} min`,
      peopleInQueue: waitingCount,
      requiredFields: queue.customFields.map((field) => ({
        id: field.id,
        label: field.label,
        type: field.type.toLowerCase(),
        required: field.required,
        options: field.options,
      })),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching queue:", error)
    return NextResponse.json({ error: "Failed to fetch queue" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Check if user owns the queue
    const existingQueue = await prisma.queue.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!existingQueue || existingQueue.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const queue = await prisma.queue.update({
      where: { id },
      data: body,
      include: {
        customFields: true,
        entries: {
          where: { status: "WAITING" },
          orderBy: { position: "asc" },
        },
      },
    })

    return NextResponse.json(queue)
  } catch (error) {
    console.error("Error updating queue:", error)
    return NextResponse.json({ error: "Failed to update queue" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if user owns the queue
    const existingQueue = await prisma.queue.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!existingQueue || existingQueue.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.queue.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Queue deleted successfully" })
  } catch (error) {
    console.error("Error deleting queue:", error)
    return NextResponse.json({ error: "Failed to delete queue" }, { status: 500 })
  }
}
