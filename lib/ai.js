import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

// Initialize Groq client (free AI provider)
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || "gsk_dummy_key_12345",
})

export class AIService {
  constructor() {
    this.model = groq("llama3-8b-8192") // Free Groq model
  }

  async generateQueueInsights(queueData) {
    try {
      const prompt = `
        Analyze this queue data and provide actionable insights:
        
        Queue: ${queueData.name}
        Current waiting: ${queueData.peopleWaiting} people
        Average wait time: ${queueData.avgWaitTime}
        Served today: ${queueData.servedToday}
        Abandonment rate: ${queueData.abandonmentRate}
        Peak hours: ${queueData.peakHours || "Not available"}
        
        Provide 2-3 specific, actionable recommendations to improve efficiency and customer satisfaction. 
        Keep it concise and business-focused. Format as bullet points.
      `

      const { text } = await generateText({
        model: this.model,
        prompt,
        maxTokens: 300,
        temperature: 0.7,
      })

      return text
    } catch (error) {
      console.error("AI insight generation failed:", error)
      return this.getFallbackInsights(queueData)
    }
  }

  async generateWaitTimeOptimization(queueData) {
    try {
      const prompt = `
        Based on this queue performance data, suggest wait time optimization strategies:
        
        Current metrics:
        - Average wait: ${queueData.avgWaitTime}
        - People waiting: ${queueData.peopleWaiting}
        - Capacity: ${queueData.capacity}
        - Service rate: ${queueData.serviceRate || "Unknown"}
        
        Provide specific strategies to reduce wait times. Be practical and implementable.
      `

      const { text } = await generateText({
        model: this.model,
        prompt,
        maxTokens: 250,
        temperature: 0.6,
      })

      return text
    } catch (error) {
      console.error("Wait time optimization failed:", error)
      return this.getFallbackOptimization(queueData)
    }
  }

  async generateCustomerExperienceInsights(queueData) {
    try {
      const prompt = `
        Analyze customer experience for this queue and suggest improvements:
        
        Queue: ${queueData.name}
        Category: ${queueData.category}
        Abandonment rate: ${queueData.abandonmentRate}
        Average wait: ${queueData.avgWaitTime}
        
        Focus on customer satisfaction and retention strategies. Provide actionable recommendations.
      `

      const { text } = await generateText({
        model: this.model,
        prompt,
        maxTokens: 200,
        temperature: 0.7,
      })

      return text
    } catch (error) {
      console.error("Customer experience analysis failed:", error)
      return this.getFallbackCustomerInsights(queueData)
    }
  }

  async generateStaffingRecommendations(queueData) {
    try {
      const prompt = `
        Based on queue performance, recommend optimal staffing:
        
        Current situation:
        - ${queueData.peopleWaiting} people waiting
        - ${queueData.avgWaitTime} average wait
        - Peak times: ${queueData.peakHours || "Various"}
        - Service type: ${queueData.category}
        
        Suggest staffing adjustments to optimize service delivery.
      `

      const { text } = await generateText({
        model: this.model,
        prompt,
        maxTokens: 200,
        temperature: 0.6,
      })

      return text
    } catch (error) {
      console.error("Staffing recommendations failed:", error)
      return this.getFallbackStaffingAdvice(queueData)
    }
  }

  // Fallback insights when AI is unavailable
  getFallbackInsights(queueData) {
    const insights = []

    if (Number.parseInt(queueData.avgWaitTime) > 15) {
      insights.push("• Consider adding more service points during peak hours to reduce wait times")
    }

    if (Number.parseFloat(queueData.abandonmentRate) > 10) {
      insights.push(
        "• High abandonment rate detected - implement queue position notifications and estimated wait times",
      )
    }

    if (queueData.peopleWaiting > queueData.capacity * 0.8) {
      insights.push("• Queue approaching capacity - consider implementing a virtual waiting system")
    }

    return insights.length > 0 ? insights.join("\n") : "• Queue performance is within normal parameters"
  }

  getFallbackOptimization(queueData) {
    if (Number.parseInt(queueData.avgWaitTime) > 20) {
      return "• Implement express lanes for quick services\n• Add self-service options where possible\n• Consider appointment scheduling for non-urgent services"
    }
    return "• Current wait times are acceptable\n• Monitor peak hours for potential optimization"
  }

  getFallbackCustomerInsights(queueData) {
    return "• Provide regular position updates to customers\n• Offer amenities during wait time\n• Implement feedback collection system"
  }

  getFallbackStaffingAdvice(queueData) {
    if (queueData.peopleWaiting > 10) {
      return "• Consider adding temporary staff during peak periods\n• Cross-train employees for flexibility"
    }
    return "• Current staffing appears adequate\n• Monitor for seasonal variations"
  }
}

export const aiService = new AIService()
