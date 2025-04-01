"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { CalendarGrid } from "@/components/calendar/calendar-grid"
import { CalendarSidebar } from "@/components/calendar/calendar-sidebar"
import { CalendarEvent } from "@/lib/types"
import { DashboardLayout } from "@/components/layout"
import { useRouter } from "next/navigation"

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      // Redirect based on role
      if (parsedUser.role !== "Administrator" && !window.location.pathname.startsWith('/user')) {
        router.push('/user/calendar')
      }
    } else {
      router.push('/login')
    }
  }, [router])

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedDate(new Date(event.start))
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-2 sm:p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Calendar Section */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <CardHeader className="p-4 sm:p-6">
                <CalendarHeader />
              </CardHeader>
              <CardContent className="p-2 sm:p-4 md:p-6">
                <div className="overflow-x-auto">
                  <CalendarGrid
                    events={events}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Sidebar Section */}
          <div className="lg:col-span-1">
            <CalendarSidebar
              events={events}
              onEventClick={handleEventClick}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

