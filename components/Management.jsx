"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, XCircle, Clock, Search, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { notify } from "@/lib/notifications"

export function QueueManagement() {
  const params = useParams()
  const queueId = params?.id

  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [isAddingPerson, setIsAddingPerson] = useState(false)
  const [newPersonData, setNewPersonData] = useState({
    name: "",
    email: "",
    phone: "",
    groupSize: "1",
    notes: "",
  })

  useEffect(() => {
    if (queueId) {
      fetchQueueEntries()
    }
  }, [queueId])

  const fetchQueueEntries = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/queues/${queueId}/entries`)
      if (response.ok) {
        const data = await response.json()
        setPeople(data)
      } else {
        throw new Error("Failed to fetch entries")
      }
    } catch (error) {
      console.error("Error fetching queue entries:", error)
      notify.error("Failed to load queue entries")
    } finally {
      setLoading(false)
    }
  }

  const handleServe = async (id, person) => {
    const loadingToast = notify.loading("Serving customer...")

    try {
      const response = await fetch(`/api/queues/${queueId}/entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "serve" }),
      })

      if (response.ok) {
        const result = await response.json()
        await fetchQueueEntries()
        notify.success(`${result.userName} has been served!`)
      } else {
        throw new Error("Failed to serve customer")
      }
    } catch (error) {
      console.error("Error serving person:", error)
      notify.error("Failed to serve customer")
    } finally {
      notify.dismiss(loadingToast)
    }
  }

  const handleSkip = async (id, person) => {
    const loadingToast = notify.loading("Moving customer to end of queue...")

    try {
      const response = await fetch(`/api/queues/${queueId}/entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "skip" }),
      })

      if (response.ok) {
        const result = await response.json()
        await fetchQueueEntries()
        notify.info(`${result.userName} moved to end of queue`)
      } else {
        throw new Error("Failed to skip customer")
      }
    } catch (error) {
      console.error("Error skipping person:", error)
      notify.error("Failed to skip customer")
    } finally {
      notify.dismiss(loadingToast)
    }
  }

  const handleAddPerson = async () => {
    const loadingToast = notify.loading("Adding person to queue...")

    try {
      const response = await fetch(`/api/queues/${queueId}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPersonData),
      })

      if (response.ok) {
        await fetchQueueEntries()
        setIsAddingPerson(false)
        setNewPersonData({
          name: "",
          email: "",
          phone: "",
          groupSize: "1",
          notes: "",
        })
        notify.success(`${newPersonData.name} added to queue!`)
      } else {
        throw new Error("Failed to add person")
      }
    } catch (error) {
      console.error("Error adding person:", error)
      notify.error("Failed to add person to queue")
    } finally {
      notify.dismiss(loadingToast)
    }
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading queue entries...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const filteredPeople = people.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (person.phone && person.phone.includes(searchTerm)),
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <CardTitle className="text-lg lg:text-xl">Queue Management</CardTitle>
            <CardDescription className="text-sm">Manage people in your active queue</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search queue..."
                className="pl-10 w-full sm:w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsAddingPerson(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span>Add Person</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AnimatePresence>
            {filteredPeople.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No people in queue</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {searchTerm ? "No people match your search." : "The queue is currently empty."}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setIsAddingPerson(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Person
                  </Button>
                )}
              </div>
            ) : (
              filteredPeople.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`border rounded-lg overflow-hidden ${
                    selectedPerson === person.id
                      ? "border-purple-300 dark:border-purple-700"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div
                    className={`p-4 cursor-pointer ${
                      selectedPerson === person.id
                        ? "bg-purple-50 dark:bg-purple-900/20"
                        : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                    onClick={() => setSelectedPerson(selectedPerson === person.id ? null : person.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-medium text-sm">
                          {person.position}
                        </div>
                        <div>
                          <div className="font-medium text-sm lg:text-base">{person.name || "Anonymous User"}</div>
                          <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                            {person.groupSize > 1 ? `Group of ${person.groupSize}` : "Individual"} • Joined at{" "}
                            {person.joinedAt}
                          </div>
                          {person.email && (
                            <div className="text-xs text-gray-400 dark:text-gray-500">{person.email}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="text-right">
                          <div className="text-xs lg:text-sm font-medium flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-orange-500" />
                            {person.waitTime} wait
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Position #{person.position}</div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSkip(person.id, person)
                            }}
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Skip</span>
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleServe(person.id, person)
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Serve</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedPerson === person.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400">Name:</span>
                                <span>{person.name || "Not provided"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400">Email:</span>
                                <span>{person.email || "Not provided"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                                <span>{person.phone || "Not provided"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400">Group Size:</span>
                                <span>{person.groupSize || 1}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Additional Information</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400">Notes:</span>
                                <span>{person.notes || "No notes provided"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400">Wait Time:</span>
                                <span>{person.waitTime}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400">Joined:</span>
                                <span>{person.joinedAt}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 gap-3">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-4"
                              onClick={() => handleSkip(person.id, person)}
                            >
                              Skip
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 px-4"
                              onClick={() => handleServe(person.id, person)}
                            >
                              Serve Now
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </CardContent>

      <Dialog open={isAddingPerson} onOpenChange={setIsAddingPerson}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Person to Queue</DialogTitle>
            <DialogDescription>Enter the details of the person you want to add to the queue.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newPersonData.name}
                onChange={(e) => setNewPersonData({ ...newPersonData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={newPersonData.email}
                onChange={(e) => setNewPersonData({ ...newPersonData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                value={newPersonData.phone}
                onChange={(e) => setNewPersonData({ ...newPersonData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupSize">Group Size</Label>
              <Input
                id="groupSize"
                type="number"
                min="1"
                placeholder="Enter group size"
                value={newPersonData.groupSize}
                onChange={(e) => setNewPersonData({ ...newPersonData, groupSize: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Enter any special notes"
                value={newPersonData.notes}
                onChange={(e) => setNewPersonData({ ...newPersonData, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingPerson(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddPerson}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Add to Queue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
