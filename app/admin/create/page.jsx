"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Plus, X } from "lucide-react";

export default function CreateQueuePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
    description: "",
    isPublic: true,
  });
  const [customFields, setCustomFields] = useState([
    { id: 1, label: "Full Name", type: "text", required: true },
    { id: 2, label: "Email Address", type: "email", required: true },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/queues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          customFields: customFields.map(({ id, ...field }) => field),
        }),
      });

      if (res.ok) {
        const queue = await res.json();
        router.push(`/admin/manage/${queue.id}`);
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to create queue");
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldChange = (id, key, value) => {
    setCustomFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  const addNewField = () => {
    const newId = customFields.length
      ? Math.max(...customFields.map((f) => f.id)) + 1
      : 1;
    setCustomFields([
      ...customFields,
      { id: newId, label: "", type: "text", required: false },
    ]);
  };

  const removeField = (id) => {
    if (customFields.length > 1) {
      setCustomFields(customFields.filter((field) => field.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/40 dark:bg-background">
        <div className="container mx-auto px-4 py-10">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          {/* Page Title */}
          <div className="mb-8 space-y-1">
            <h1 className="text-3xl font-bold">Create New Queue</h1>
            <p className="text-muted-foreground">
              Set up a queue for your business or event
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="details" className="space-y-6">
              <TabsList className="w-full md:w-auto grid grid-cols-2 md:inline-flex">
                <TabsTrigger value="details">Queue Details</TabsTrigger>
                <TabsTrigger value="fields">Custom Fields</TabsTrigger>
              </TabsList>

              {/* Queue Details Tab */}
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Queue Information</CardTitle>
                    <CardDescription>Enter basic queue details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      ["name", "Queue Name", "e.g. Coffee Shop Service", true],
                      ["location", "Location", "e.g. 123 Main St, City", true],
                    ].map(([id, label, placeholder, required]) => (
                      <div className="space-y-2" key={id}>
                        <Label htmlFor={id}>
                          {label}{" "}
                          {required && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                          id={id}
                          required={required}
                          value={formData[id]}
                          placeholder={placeholder}
                          onChange={(e) =>
                            handleInputChange(id, e.target.value)
                          }
                        />
                      </div>
                    ))}

                    {/* Category Select */}
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(val) =>
                          handleInputChange("category", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Food & Drink",
                            "Healthcare",
                            "Government",
                            "Retail",
                            "Financial",
                            "Transportation",
                            "Other",
                          ].map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        rows={4}
                        placeholder="Describe this queue and any instructions"
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                      />
                    </div>

                    {/* Public Toggle */}
                    <div className="flex items-center gap-2 pt-2">
                      <Switch
                        id="public"
                        checked={formData.isPublic}
                        onCheckedChange={(val) =>
                          handleInputChange("isPublic", val)
                        }
                      />
                      <Label htmlFor="public">
                        Make this queue publicly visible
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Custom Fields Tab */}
              <TabsContent value="fields">
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Fields</CardTitle>
                    <CardDescription>
                      Define the information needed from users
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {customFields.map((field, i) => (
                      <div
                        key={field.id}
                        className="p-4 border rounded-lg space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Field #{i + 1}</h4>
                          {customFields.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeField(field.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`label-${field.id}`}>
                              Field Label
                            </Label>
                            <Input
                              id={`label-${field.id}`}
                              placeholder="e.g., Phone Number"
                              value={field.label}
                              required
                              onChange={(e) =>
                                handleFieldChange(
                                  field.id,
                                  "label",
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`type-${field.id}`}>
                              Field Type
                            </Label>
                            <Select
                              value={field.type}
                              onValueChange={(val) =>
                                handleFieldChange(field.id, "type", val)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select field type" />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "text",
                                  "email",
                                  "tel",
                                  "number",
                                  "date",
                                  "textarea",
                                ].map((t) => (
                                  <SelectItem key={t} value={t}>
                                    {t}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Switch
                            id={`required-${field.id}`}
                            checked={field.required}
                            onCheckedChange={(val) =>
                              handleFieldChange(field.id, "required", val)
                            }
                          />
                          <Label htmlFor={`required-${field.id}`}>
                            Required
                          </Label>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={addNewField}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Field
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Footer Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/admin/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Creating..." : "Create Queue"}
                </Button>
              </div>
            </Tabs>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
