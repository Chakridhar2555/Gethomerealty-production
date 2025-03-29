"use client"

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon, Plus } from "lucide-react"
import type { Showing } from "@/lib/types"

interface ShowingCalendarProps {
  showings: Showing[]
  onAddShowing: (showing: Showing) => void
}

export function ShowingCalendar({ showings, onAddShowing }: ShowingCalendarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [newShowing, setNewShowing] = useState<Partial<Showing>>({
    status: 'scheduled'
  })
  const { toast } = useToast()

  const handleAddShowing = () => {
    if (!selectedDate || !newShowing.time || !newShowing.property) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      })
      return
    }

    const showing: Showing = {
      id: crypto.randomUUID(),
      date: selectedDate,
      time: newShowing.time,
      property: newShowing.property,
      notes: newShowing.notes,
      status: 'scheduled'
    }

    onAddShowing(showing)
    setIsDialogOpen(false)
    setNewShowing({ status: 'scheduled' })
    setSelectedDate(undefined)

    toast({
      title: "Success",
      description: "Showing scheduled successfully",
    })
  }

  const getShowingsForDate = (date: Date) => {
    return showings.filter(showing => {
      const showingDate = new Date(showing.date)
      return showingDate.toDateString() === date.toDateString()
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Showings</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Showing
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule a Showing</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={newShowing.time}
                  onChange={(e) => setNewShowing({ ...newShowing, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Property</Label>
                <Input
                  value={newShowing.property}
                  onChange={(e) => setNewShowing({ ...newShowing, property: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={newShowing.notes}
                  onChange={(e) => setNewShowing({ ...newShowing, notes: e.target.value })}
                />
              </div>
              <Button onClick={handleAddShowing} className="w-full">
                Schedule Showing
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Calendar
        mode="single"
        className="rounded-md border"
        modifiers={{
          hasShowing: (date) => getShowingsForDate(date).length > 0,
        }}
        modifiersStyles={{
          hasShowing: {
            backgroundColor: 'var(--primary)',
            color: 'white',
          },
        }}
      />
    </div>
  )
} 