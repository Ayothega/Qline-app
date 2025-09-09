"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, TrendingUp, Clock, Users, Download, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

export function QueueInsights() {
  const params = useParams()
  const queueId = params?.id
  const [timeRange, setTimeRange] = useState("7d")
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (queueId) {
      fetchAnalytics()
    }
  }, [queueId, timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/queues/${queueId}/analytics?timeRange=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Queue Analytics</CardTitle>
            <CardDescription>Insights and statistics about your queue performance</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="wait-times">Wait Times</TabsTrigger>
            <TabsTrigger value="traffic">Traffic Patterns</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Served</h3>
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold">{analyticsData?.totalServed || 0}</p>
                <div className="flex items-center mt-2 text-xs text-green-600 dark:text-green-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>12% increase from last period</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Wait Time</h3>
                  <Clock className="h-4 w-4 text-orange-500" />
                </div>
                <p className="text-2xl font-bold">{analyticsData?.avgWaitTime || "0 min"}</p>
                <div className="flex items-center mt-2 text-xs text-green-600 dark:text-green-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>5% faster than average</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Abandonment Rate</h3>
                  <BarChart3 className="h-4 w-4 text-red-500" />
                </div>
                <p className="text-2xl font-bold">{analyticsData?.abandonmentRate || "0%"}</p>
                <div className="flex items-center mt-2 text-xs text-red-600 dark:text-red-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>2% increase from average</span>
                </div>
              </motion.div>
            </div>

            {/* Daily Traffic Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="mb-6"
            >
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-4">Daily Traffic</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {analyticsData?.dailyTraffic?.length > 0 ? (
                    analyticsData.dailyTraffic.map((day, index) => {
                      const maxCount = Math.max(...analyticsData.dailyTraffic.map((d) => d.count))
                      const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0
                      return (
                        <div key={index} className="relative flex-1">
                          <div
                            className="bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-sm transition-all duration-500"
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">
                            {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                          </div>
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-300">
                            {day.count}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="w-full text-center text-gray-500 dark:text-gray-400">
                      No traffic data available for this period
                    </div>
                  )}
                </div>
                <div className="mt-8 text-xs text-gray-500 dark:text-gray-400 text-center">Days</div>
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900/50">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-medium text-purple-700 dark:text-purple-400">AI Insight</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Based on your traffic patterns, your busiest times are between 2-4 PM. Consider increasing staff
                  during these periods to reduce wait times by an estimated 35%. Your current abandonment rate is{" "}
                  {analyticsData?.abandonmentRate || "low"}, which is{" "}
                  {analyticsData?.abandonmentRate === "0%" ? "excellent" : "within normal range"}.
                </p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    Apply Recommendations
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="wait-times">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-4">Wait Time Distribution</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Wait time distribution chart</p>
                    <p className="text-sm">Data visualization coming soon</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-4">Peak Hours</h3>
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Peak hours analysis</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-4">Wait Time Trends</h3>
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Trend analysis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="traffic">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-4">Traffic Patterns</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Traffic patterns visualization</p>
                    <p className="text-sm">Advanced analytics coming soon</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-4">Busiest Days</h3>
                  <div className="space-y-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                      (day, index) => {
                        const isActive = index < 3 // Mock data - first 3 days are busiest
                        return (
                          <div key={day} className="flex items-center justify-between">
                            <span className="text-sm">{day}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    isActive ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
                                  }`}
                                  style={{ width: `${isActive ? (3 - index) * 30 + 40 : 20}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {isActive ? `${(3 - index) * 10 + 20}` : "5"}
                              </span>
                            </div>
                          </div>
                        )
                      },
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-4">Customer Satisfaction</h3>
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Satisfaction metrics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
