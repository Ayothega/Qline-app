import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if user owns the queue
    const queue = await prisma.queue.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!queue || queue.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const entries = await prisma.queueEntry.findMany({
      where: {
        queueId: id,
        status: "WAITING",
      },
      orderBy: { position: "asc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    })

    const formattedEntries = entries.map((entry) => {
      // Parse userData JSON to get form data
      const userData = entry.userData || {}

      return {
        id: entry.id,
        name: userData.name || entry.user?.name || "Anonymous",
        email: userData.email || entry.user?.email || "",
        phone: userData.phone || "",
        position: entry.position,
        waitTime: `${entry.position * 2} min`,
        joinedAt: entry.joinedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        notes: userData.notes || userData.specialRequests || "",
        groupSize: userData.groupSize || 1,
        avatar: "/placeholder.svg?height=40&width=40",
        // Include all user data for debugging
        allUserData: userData,
      }
    })

    return NextResponse.json(formattedEntries)
  } catch (error) {
    console.error("Error fetching queue entries:", error)
    return NextResponse.json({ error: "Failed to fetch queue entries" }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Check if user owns the queue
    const queue = await prisma.queue.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!queue || queue.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get next position
    const lastEntry = await prisma.queueEntry.findFirst({
      where: {
        queueId: id,
        status: "WAITING",
      },
      orderBy: { position: "desc" },
    })

    const nextPosition = (lastEntry?.position || 0) + 1

    const entry = await prisma.queueEntry.create({
      data: {
        queueId: id,
        position: nextPosition,
        userData: body,
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error("Error adding person to queue:", error)
    return NextResponse.json({ error: "Failed to add person to queue" }, { status: 500 })
  }
}
