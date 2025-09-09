"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Brain } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function HeroSection() {
  const { isSignedIn } = useUser();

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 -z-10" />

      {/* Animated background shapes */}
      <div className="absolute inset-0 -z-5">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-200 dark:bg-purple-900/20 blur-3xl opacity-40"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 15,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-blue-200 dark:bg-blue-900/20 blur-3xl opacity-40"
          animate={{
            x: [0, -40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 18,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-center text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-normal bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              AI Powered Queue Management App
            </h1>
            <p className="text-center text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Streamline your waiting lines, enhance customer experience and
              gain valuable insights with our intelligent queue management
              system.
            </p>
          </motion.div>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="text-sm font-medium">Qline Dashboard</div>
                <div className="w-16" />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Queue Management</h3>
                  <div className="flex items-center space-x-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3" />
                    <span>Live</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <motion.div
                    className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg flex items-center justify-between"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        1
                      </div>
                      <div>
                        <div className="font-medium">First Customer</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Ready to serve
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="h-8">
                        Skip
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 bg-green-600 hover:bg-green-700"
                      >
                        Serve
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div
                    className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg flex items-center justify-between"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        2
                      </div>
                      <div>
                        <div className="font-medium">Waiting Customer</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          5 min wait
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="h-8">
                        Skip
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 bg-green-600 hover:bg-green-700"
                      >
                        Serve
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div
                    className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg flex items-center justify-between"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        3
                      </div>
                      <div>
                        <div className="font-medium">Next Customer</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          8 min wait
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="h-8">
                        Skip
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 bg-green-600 hover:bg-green-700"
                      >
                        Serve
                      </Button>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  className="p-4 rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400 font-medium mb-2">
                    <Brain className="h-4 w-4" />
                    <span>AI Insight</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Optimize your queue flow with AI-powered insights and
                    real-time analytics to improve customer satisfaction.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
