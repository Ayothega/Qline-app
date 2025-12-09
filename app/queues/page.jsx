"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Users,
  Clock,
  MapPin,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function QueuesPage() {
  const [queuesData, setQueuesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("waitTime");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  useEffect(() => {
    fetchQueues();
  }, []);

  const fetchQueues = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      params.append("sortBy", sortBy);

      const res = await fetch(`/api/queues?${params}`);
      const data = await res.json();
      setQueuesData(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(queuesData.map((q) => q.category)));

  const filteredQueues = queuesData.filter((q) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      q.name.toLowerCase().includes(search) ||
      q.location.toLowerCase().includes(search);
    const matchesCategory = selectedCategory
      ? q.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const sortedQueues = [...filteredQueues].sort((a, b) => {
    if (sortBy === "waitTime") {
      const aTime = parseInt(a.waitTime);
      const bTime = parseInt(b.waitTime);
      return aTime - bTime;
    } else {
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return b.peopleInQueue - a.peopleInQueue;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center space-y-4">
            <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto" />
            <p className="text-gray-600 dark:text-gray-300">
              Loading queues...
            </p>
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
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-2">Browse Queues</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Discover and join queues near you. See wait times and your live
              position.
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            className="mb-8 flex flex-col md:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or location"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setFilterMenuOpen((prev) => !prev)}
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>

                <AnimatePresence>
                  {filterMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute z-30 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg"
                    >
                      <div className="p-2">
                        <div className="font-medium text-sm px-3 py-1">
                          Categories
                        </div>
                        {["All", ...categories].map((cat) => (
                          <button
                            key={cat}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
                              (cat === "All" && selectedCategory === null) || cat === selectedCategory
                                ? "font-semibold"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedCategory(cat === "All" ? null : cat);
                              setFilterMenuOpen(false);
                            }}
                          >
                            {cat} {(cat === "All" && selectedCategory === null) || cat === selectedCategory ? "✓" : ""}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() =>
                  setSortBy(sortBy === "waitTime" ? "popularity" : "waitTime")
                }
              >
                <ArrowUpDown className="w-4 h-4" />
                Sort: {sortBy === "waitTime" ? "Wait Time" : "Popularity"}
              </Button>
            </div>
          </motion.div>

          {/* Queue Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {sortedQueues.map((queue, i) => (
                <motion.div
                  key={queue.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="flex flex-col h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{queue.name}</CardTitle>
                        {queue.isPopular && (
                          <Badge className="bg-purple-600 text-white py-1 px-2">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-1 text-sm mt-1 text-gray-500 dark:text-gray-400">
                        <MapPin className="w-3 h-3" /> {queue.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1 text-orange-500">
                          <Clock className="w-4 h-4" />
                          Wait:{" "}
                          <span className="font-medium text-black dark:text-white">
                            {queue.waitTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-500">
                          <Users className="w-4 h-4" />
                          {queue.peopleInQueue} in queue
                        </div>
                      </div>
                      <Badge className="py-1 px-2" variant="outline">
                        {queue.category}
                      </Badge>
                    </CardContent>
                    <CardFooter>
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                      >
                        <Link href={`/queues/${queue.id}`}>Join Queue</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* No Queues */}
          {sortedQueues.length === 0 && (
            <div className="text-center mt-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No queues found.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
