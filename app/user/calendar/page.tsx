"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarGrid } from "@/components/calendar/calendar-grid"
import { CalendarEvent } from "@/lib/types"
import { UserLayout } from "@/components/user-layout"
import { useRouter } from "next/navigation"

export default function UserCalendarPage() {
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
      
      // Redirect if user is an admin
      if (parsedUser.role === "Administrator") {
        router.push('/calendar')
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
    <UserLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Calendar Section */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
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
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
                {events.length === 0 ? (
                  <p className="text-gray-500">No upcoming events</p>
                ) : (
                  <ul className="space-y-2">
                    {events.map((event) => (
                      <li
                        key={event.id}
                        className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => handleEventClick(event)}
                      >
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(event.start).toLocaleDateString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </UserLayout>
  )
} 