"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isValid, isSameMonth, isToday } from 'date-fns'
import { Clock, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { CalendarEvent } from "@/lib/types"

interface Event {
  id: string
  title: string
  date: Date
  description: string
  time: string
  type: 'viewing' | 'meeting' | 'open-house' | 'follow-up' | 'call'
  location?: string
  attendees?: string
  contactPhone?: string
  contactEmail?: string
  propertyDetails?: string
  notes?: string
  aiSuggestions?: string[]
}

interface CalendarGridProps {
  events: CalendarEvent[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export function CalendarGrid({ events, selectedDate, onDateSelect }: CalendarGridProps) {
  const router = useRouter()
  const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
  const startDay = startOfMonth.getDay()
  const daysInMonth = endOfMonth.getDate()

  const days = []
  for (let i = 0; i < startDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i))
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.start), date))
  }

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'viewing': return 'bg-blue-100 text-blue-700'
      case 'meeting': return 'bg-purple-100 text-purple-700'
      case 'open-house': return 'bg-green-100 text-green-700'
      case 'follow-up': return 'bg-yellow-100 text-yellow-700'
      case 'call': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleDayClick = (date: Date) => {
    if (!isValid(date)) return
    router.push(`/calendar/add-event?date=${format(date, 'yyyy-MM-dd')}`)
  }

  const handlePrevMonth = () => {
    const prevMonth = new Date(selectedDate)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    if (isValid(prevMonth) && typeof onDateSelect === 'function') {
      onDateSelect(prevMonth)
    }
  }

  const handleNextMonth = () => {
    const nextMonth = new Date(selectedDate)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    if (isValid(nextMonth) && typeof onDateSelect === 'function') {
      onDateSelect(nextMonth)
    }
  }

  if (!isValid(selectedDate)) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-center items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold px-4">
          {format(selectedDate, 'MMMM yyyy')}
        </h2>
        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 min-w-[640px]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="bg-white p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
        {days.map((date, index) => (
          <div
            key={index}
            className={cn(
              "bg-white p-1 sm:p-2 min-h-[80px] sm:min-h-[100px] md:min-h-[120px]",
              !date && "bg-gray-50",
              date && !isSameMonth(date, selectedDate) && "text-gray-400",
              date && isToday(date) && "bg-red-50"
            )}
          >
            {date && (
              <>
                <div
                  className={cn(
                    "text-xs sm:text-sm font-medium mb-1",
                    isToday(date) && "text-red-500"
                  )}
                >
                  {format(date, "d")}
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  {getEventsForDate(date).map((event) => (
                    <div
                      key={event.id}
                      className="text-[10px] sm:text-xs p-0.5 sm:p-1 rounded bg-red-100 text-red-700 truncate cursor-pointer hover:bg-red-200"
                      onClick={() => onDateSelect(date)}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

