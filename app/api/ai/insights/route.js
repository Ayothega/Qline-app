import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { aiService } from "@/lib/ai"

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { queueId, type = "general" } = await request.json()

    // Verify user owns the queue
    const queue = await prisma.queue.findUnique({
      where: { id: queueId },
      include: {
        entries: {
          where: { status: "WAITING" },
        },
        _count: {
          select: {
            entries: {
              where: { status: "SERVED", servedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
            },
          },
        },
      },
    })

    if (!queue || queue.ownerId !== user.id) {
      return NextResponse.json({ error: "Queue not found or access denied" }, { status: 403 })
    }

    // Prepare queue data for AI analysis
    const queueData = {
      name: queue.name,
      category: queue.category,
      peopleWaiting: queue.entries.length,
      avgWaitTime: `${Math.max(queue.entries.length * 2, 5)} min`,
      servedToday: queue._count.entries,
      abandonmentRate: "8.5%", // This would come from actual analytics
      capacity: queue.capacity,
      peakHours: "2-4 PM", // This would come from analytics
    }

    let insights
    switch (type) {
      case "optimization":
        insights = await aiService.generateWaitTimeOptimization(queueData)
        break
      case "customer":
        insights = await aiService.generateCustomerExperienceInsights(queueData)
        break
      case "staffing":
        insights = await aiService.generateStaffingRecommendations(queueData)
        break
      default:
        insights = await aiService.generateQueueInsights(queueData)
    }

    return NextResponse.json({
      insights,
      queueData,
      type,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI insights error:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}
