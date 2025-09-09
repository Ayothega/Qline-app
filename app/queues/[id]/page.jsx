"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Clock,
  Users,
  MapPin,
  Info,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { notify } from "@/lib/notifications";

export default function QueueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queueId = params.id;

  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);

  useEffect(() => {
    fetchQueueData();
  }, [queueId]);

  const fetchQueueData = async () => {
    try {
      const response = await fetch(`/api/queues/${queueId}`);
      if (!response.ok) {
        throw new Error("Queue not found");
      }
      const data = await response.json();
      setQueueData(data);
    } catch (error) {
      console.error("Error fetching queue:", error);
      router.push("/queues");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/queues/${queueId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to join queue");
      }

      const result = await response.json();
      setJoinSuccess(true);
      setQueuePosition(result.position);

      // Add notification
      notify.queueJoined(queueData.name, result.position);

      // Store queue info in localStorage for the my-queue page
      const queueInfo = {
        id: queueId,
        name: queueData.name,
        position: result.position,
        waitTime: result.estimatedWaitTime,
        joinedAt: result.joinedAt,
        userData: formData,
      };
      localStorage.setItem("currentQueue", JSON.stringify(queueInfo));
    } catch (error) {
      console.error("Error joining queue:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
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
              Loading queue details...
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
            <Button onClick={() => router.push("/queues")}>
              Back to Queues
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/queues" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Back to queues
              </Link>
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">
                        {queueData.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {queueData.location}
                      </CardDescription>
                    </div>
                    <Badge className="py-1 px-2 bg-gray">
                      {queueData.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Current wait time
                        </div>
                        <div className="font-semibold">
                          {queueData.waitTime}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          People in queue
                        </div>
                        <div className="font-semibold">
                          {queueData.peopleInQueue}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Info className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Your position if you join now
                        </div>
                        <div className="font-semibold">
                          #{queueData.peopleInQueue + 1}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium mb-2">About this queue</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {queueData.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {!joinSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Join the Queue</CardTitle>
                  <CardDescription>
                    Fill out the required information to secure your spot in
                    line.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      {queueData.requiredFields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <Label htmlFor={field.id}>
                            {field.label}{" "}
                            {field.required && (
                              <span className="text-red-500">*</span>
                            )}
                          </Label>

                          {field.type === "textarea" ? (
                            <Textarea
                              id={field.id}
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              required={field.required}
                              value={formData[field.id] || ""}
                              onChange={(e) =>
                                handleInputChange(field.id, e.target.value)
                              }
                            />
                          ) : (
                            <Input
                              id={field.id}
                              type={field.type}
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              required={field.required}
                              value={formData[field.id] || ""}
                              onChange={(e) =>
                                handleInputChange(field.id, e.target.value)
                              }
                            />
                          )}
                        </div>
                      ))}

                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                          id="terms"
                          checked={agreeToTerms}
                          onCheckedChange={(checked) =>
                            setAgreeToTerms(checked)
                          }
                          required
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to receive notifications about my queue status
                        </label>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        disabled={isSubmitting || !agreeToTerms}
                      >
                        {isSubmitting ? "Joining Queue..." : "Join Queue"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-green-200 dark:border-green-900">
                <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900/50">
                  <CardTitle className="text-green-700 dark:text-green-400 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Successfully Joined Queue!
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-3xl font-bold mb-4">
                      #{queuePosition}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Your position in line
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Estimated wait time:{" "}
                      <span className="font-medium">
                        ~{queuePosition * 2} minutes
                      </span>
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                    <h4 className="font-medium mb-2 flex items-center gap-1">
                      <Info className="h-4 w-4" /> Queue Information
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <span className="font-medium">{queueData.name}</span> -{" "}
                      {queueData.location}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-orange-500" />
                        <span>Wait: {queueData.waitTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-blue-500" />
                        <span>In queue: {queueData.peopleInQueue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Mail className="h-5 w-5 text-purple-500" />
                      <div>
                        <div className="text-sm">Queue updates sent to:</div>
                        <div className="font-medium">{formData.email}</div>
                      </div>
                    </div>

                    {formData.phone && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Phone className="h-5 w-5 text-purple-500" />
                        <div>
                          <div className="text-sm">SMS notifications:</div>
                          <div className="font-medium">{formData.phone}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => {
                      localStorage.removeItem("currentQueue");
                      router.push("/queues");
                    }}
                  >
                    Leave Queue
                  </Button>
                  <Button
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={() => router.push("/my-queue")}
                  >
                    View My Queue Status
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
