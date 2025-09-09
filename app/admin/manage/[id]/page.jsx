"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Trash2,
  Settings,
  Clock,
  Brain,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { motion } from "framer-motion";
import { QueueManagement } from "@/components/Management";
import { QueueInsights } from "@/components/Insight";
import { notify } from "@/lib/notifications";
import { useRouter } from "next/navigation";
export default function QueueDetailPage() {
  const params = useParams();
  const queueId = params.id;
  const router = useRouter();
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (queueId) {
      fetchQueueData();
      generateAIInsights();
    }
  }, [queueId]);

  const fetchQueueData = async () => {
    try {
      const response = await fetch(`/api/queues/${queueId}`);
      if (response.ok) {
        const data = await response.json();
        setQueueData(data);
      } else {
        throw new Error("Failed to fetch queue data");
      }
    } catch (error) {
      console.error("Error fetching queue data:", error);
      notify.error("Failed to load queue data");
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async (type = "general") => {
    setLoadingInsights(true);
    try {
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queueId, type }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiInsights(data);
        notify.success("AI insights generated successfully!");
      } else {
        throw new Error("Failed to generate insights");
      }
    } catch (error) {
      notify.error("Failed to generate AI insights");
      console.error("AI insights error:", error);
    } finally {
      setLoadingInsights(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Loading queue data...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!queueData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Queue Not Found</h1>
            <Button asChild>
              <Link href="/admin/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleDeleteQueue = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/queues/${queueId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete queue");
      }

      // Redirect to dashboard after successful deletion
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error deleting queue:", error);
      alert("Failed to delete queue. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const toggleQueueStatus = async () => {
    try {
      const response = await fetch(`/api/queues/${queueId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !queueData.isActive,
        }),
      });

      if (response.ok) {
        const updatedQueue = await response.json();
        setQueueData(updatedQueue);
      }
    } catch (error) {
      console.error("Error updating queue status:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to dashboard</span>
              </Link>
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold">
                    {queueData.name}
                  </h1>
                  <Badge
                    className={
                      queueData.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 px-3 py-1"
                    }
                  >
                    {queueData.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base">
                  {queueData.location} • Created on{" "}
                  {new Date(queueData.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  asChild
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <Link href={`/admin/manage/${queueId}/settings`}>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-2"
                  asChild
                >
                  <Link href={`/queues/${queueId}`}>View Public Page</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(true)}
                  className="border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs lg:text-sm">
                    People Waiting
                  </CardDescription>
                  <CardTitle className="text-xl lg:text-2xl">
                    {queueData.peopleInQueue}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3 lg:h-4 lg:w-4 mr-1 text-blue-500" />
                    <span>
                      Current capacity: {queueData.peopleInQueue}/
                      {queueData.capacity}
                    </span>
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
                  <CardDescription className="text-xs lg:text-sm">
                    Average Wait Time
                  </CardDescription>
                  <CardTitle className="text-xl lg:text-2xl">
                    {queueData.waitTime}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3 lg:h-4 lg:w-4 mr-1 text-orange-500" />
                    <span>Based on current queue</span>
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
                  <CardDescription className="text-xs lg:text-sm">
                    Served Today
                  </CardDescription>
                  <CardTitle className="text-xl lg:text-2xl">0</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3 lg:h-4 lg:w-4 mr-1 text-green-500" />
                    <span>Start serving customers</span>
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
                  <CardDescription className="text-xs lg:text-sm">
                    Queue Status
                  </CardDescription>
                  <CardTitle className="text-xl lg:text-2xl">
                    {queueData.isPublic ? "Public" : "Private"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3 lg:h-4 lg:w-4 mr-1 text-purple-500" />
                    <span>
                      {queueData.isPublic ? "Visible to all" : "Invite only"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* AI Insights Card */}
          {aiInsights && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-6 lg:mb-8"
            >
              <Card className="border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <CardTitle className="text-lg lg:text-xl">
                        AI Insights
                      </CardTitle>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateAIInsights("optimization")}
                        disabled={loadingInsights}
                        className="text-xs px-3 py-1"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Optimization
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateAIInsights("customer")}
                        disabled={loadingInsights}
                        className="text-xs px-3 py-1"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Customer Experience
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateAIInsights("staffing")}
                        disabled={loadingInsights}
                        className="text-xs px-3 py-1"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Staffing
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans">
                      {loadingInsights
                        ? "Generating insights..."
                        : aiInsights.insights}
                    </pre>
                  </div>
                  <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    Generated at{" "}
                    {new Date(aiInsights.timestamp).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <Tabs defaultValue="queue" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex mb-4 lg:mb-6">
              <TabsTrigger value="queue" className="text-sm px-4 py-2">
                Queue Management
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-sm px-4 py-2">
                Analytics & Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="queue">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <QueueManagement />
              </motion.div>
            </TabsContent>

            <TabsContent value="insights">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <QueueInsights />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Queue
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{queueData?.name}"? This action
              cannot be undone. All queue entries and data will be permanently
              removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteQueue}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Queue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
