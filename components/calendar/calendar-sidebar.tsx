"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarEvent } from "@/lib/types"
import { format } from "date-fns"
import { Clock, MapPin, Users } from "lucide-react"

interface CalendarSidebarProps {
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

export function CalendarSidebar({ events, onEventClick }: CalendarSidebarProps) {
  const upcomingEvents = events
    .filter((event) => new Date(event.start) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base sm:text-lg">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{event.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{format(new Date(event.start), "MMM d, h:mm a")}</span>
                      </div>
                      {event.type && (
                        <div className="mt-1">
                          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
                            {event.type}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">
                No upcoming events
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base sm:text-lg">Quick Filters</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              Viewings
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              Meetings
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              Open Houses
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              Follow-ups
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              Calls
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 