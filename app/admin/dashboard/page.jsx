"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Clock, CheckCircle, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { notify } from "@/lib/notifications"

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard")
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
        notify.success("Dashboard loaded successfully")
      } else {
        throw new Error("Failed to load dashboard")
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      notify.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <h1 className="text-2xl lg:text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                You don't have any queues yet. Create your first queue to get started!
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3"
              >
                <Link href="/admin/create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Your First Queue</span>
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 lg:mb-8"
          >
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Queue Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base">
                Manage your queues and monitor real-time activity
              </p>
            </div>

            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 w-full sm:w-auto"
            >
              <Link href="/admin/create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Create New Queue</span>
              </Link>
            </Button>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs lg:text-sm">Active Queues</CardDescription>
                  <CardTitle className="text-xl lg:text-2xl">{dashboardData.activeQueues}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3 lg:h-4 lg:w-4 mr-1 text-green-500" />
                    <span>All queues operational</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs lg:text-sm">People Waiting</CardDescription>
                  <CardTitle className="text-xl lg:text-2xl">{dashboardData.totalPeopleWaiting}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                    <Users className="h-3 w-3 lg:h-4 lg:w-4 mr-1 text-blue-500" />
                    <span>Across all queues</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs lg:text-sm">Average Wait Time</CardDescription>
                  <CardTitle className="text-xl lg:text-2xl">{dashboardData.averageWaitTime}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                    <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 mr-1 text-orange-500" />
                    <span>5% faster than yesterday</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs lg:text-sm">Served Today</CardDescription>
                  <CardTitle className="text-xl lg:text-2xl">{dashboardData.servedToday}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 mr-1 text-green-500" />
                    <span>
                      {dashboardData.servedToday > 0 ? "12 more than yesterday" : "Start serving customers today"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Queues List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">Your Queues</CardTitle>
                <CardDescription className="text-sm">Overview of all your active queues</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.queues.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No queues yet</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm lg:text-base">
                      Create your first queue to start managing customer flow
                    </p>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3"
                    >
                      <Link href="/admin/create">Create Queue</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.queues.map((queue, index) => (
                      <motion.div
                        key={queue.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 lg:p-6 border rounded-lg border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                          <div>
                            <h3 className="font-medium text-base lg:text-lg">{queue.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{queue.location}</p>
                          </div>
                          <Badge
                            className={
                              queue.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 px-3 py-1"
                            }
                          >
                            {queue.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm mb-4 gap-2">
                          <span>
                            People waiting: <span className="font-medium">{queue.peopleWaiting}</span>
                          </span>
                          <span>
                            Avg wait: <span className="font-medium">{queue.averageWaitTime}</span>
                          </span>
                        </div>

                        {/* Progress bar for capacity */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Capacity</span>
                            <span>
                              {queue.peopleWaiting}/{queue.capacity}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min((queue.peopleWaiting / queue.capacity) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button size="sm" variant="outline" asChild className="px-4 py-2">
                            <Link href={`/admin/manage/${queue.id}`}>Manage Queue</Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild className="px-4 py-2">
                            <Link href={`/queues/${queue.id}`}>View Public Page</Link>
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
