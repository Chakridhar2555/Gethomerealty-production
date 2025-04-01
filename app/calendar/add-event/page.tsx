"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarEvent } from "@/lib/types"
import { DashboardLayout } from "@/components/layout"

function AddEventForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultDate = searchParams?.get("date") ? new Date(searchParams.get("date")!) : new Date()

  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    title: "",
    start: defaultDate,
    end: defaultDate,
    type: "viewing",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/calendar/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create event")
      }

      router.push("/calendar")
    } catch (error) {
      console.error("Error creating event:", error)
    }
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl md:text-2xl">Add New Event</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm sm:text-base">Event Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm sm:text-base">Event Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewing">Property Viewing</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="open-house">Open House</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start" className="text-sm sm:text-base">Start Date & Time</Label>
              <Input
                id="start"
                type="datetime-local"
                value={formData.start ? new Date(formData.start).toISOString().slice(0, 16) : ""}
                onChange={(e) => setFormData({ ...formData, start: new Date(e.target.value) })}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end" className="text-sm sm:text-base">End Date & Time</Label>
              <Input
                id="end"
                type="datetime-local"
                value={formData.end ? new Date(formData.end).toISOString().slice(0, 16) : ""}
                onChange={(e) => setFormData({ ...formData, end: new Date(e.target.value) })}
                required
                className="text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button type="submit" className="w-full sm:w-auto text-sm sm:text-base">
              Create Event
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/calendar")}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default function AddEventPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-2 sm:p-4 md:p-6">
        <Suspense fallback={<div>Loading...</div>}>
          <AddEventForm />
        </Suspense>
      </div>
    </DashboardLayout>
  )
} 