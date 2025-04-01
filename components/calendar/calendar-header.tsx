"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function CalendarHeader() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleAddEvent = () => {
    router.push("/calendar/add-event")
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
        <h1 className="text-xl sm:text-2xl font-semibold">Calendar</h1>
        <Button variant="default" className="bg-red-500 hover:bg-red-600 w-full sm:w-auto" onClick={handleAddEvent}>
          + Add New Event
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
        <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())} className="w-full sm:w-auto">
          Today
        </Button>
        <div className="flex items-center space-x-1 w-full sm:w-auto">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="flex-none">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-base sm:text-lg font-medium px-2 sm:px-4 flex-1 text-center">
            {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </h2>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="flex-none">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center rounded-lg border bg-white w-full sm:w-auto">
          <Button variant="ghost" size="sm" className="flex-1 sm:flex-none rounded-none">
            Day
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 sm:flex-none rounded-none">
            Week
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 sm:flex-none rounded-none bg-red-500 text-white hover:bg-red-600">
            Month
          </Button>
        </div>
      </div>
    </div>
  )
}

