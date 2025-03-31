"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Phone, Plus, Save } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { CallHistory } from "@/components/call-history"
import type { Lead, Task } from "@/lib/types"
import { ShowingCalendar } from "@/components/showing-calendar"
import { TaskManager } from "@/components/task-manager"

interface CallPoint {
  text: string;
  timestamp?: string;
}

interface Showing {
  id: string;
  date: string;
  time: string;
  property: string;
  notes?: string;
}

const leadStatuses = [
  { value: 'cold', label: 'Cold' },
  { value: 'warm', label: 'Warm' },
  { value: 'hot', label: 'Hot' },
  { value: 'mild', label: 'Mild' },
];

const leadResponses = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'not answering', label: 'Not Answering' },
  { value: 'not actively answering', label: 'Not Actively Answering' },
  { value: 'always responding', label: 'Always Responding' },
];

const leadSources = [
  { value: 'google ads', label: 'Google Ads' },
  { value: 'meta', label: 'Meta' },
  { value: 'refferal', label: 'Refferal' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
];

const leadTypes = [
  { value: 'Pre construction', label: 'Pre Construction' },
  { value: 'resale', label: 'Resale' },
  { value: 'seller', label: 'Seller' },
  { value: 'buyer', label: 'Buyer' },
];

const clientTypes = [
  { value: 'Investor', label: 'Investor' },
  { value: 'custom buyer', label: 'Custom Buyer' },
  { value: 'first home buyer', label: 'First Home Buyer' },
  { value: 'seasonal investor', label: 'Seasonal Investor' },
  { value: 'commercial buyer', label: 'Commercial Buyer' },
];

const locations = [
  { value: 'downtown', label: 'Downtown' },
  { value: 'north_york', label: 'North York' },
  { value: 'scarborough', label: 'Scarborough' },
  { value: 'etobicoke', label: 'Etobicoke' },
  { value: 'mississauga', label: 'Mississauga' },
  { value: 'brampton', label: 'Brampton' },
  { value: 'markham', label: 'Markham' },
  { value: 'vaughan', label: 'Vaughan' },
];

export default function LeadDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [leadData, setLeadData] = useState<Lead | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [users, setUsers] = useState<{ _id: string; name: string }[]>([])

  useEffect(() => {
    if (params?.leadId) {
      fetchLead()
      fetchUsers()
    }
  }, [params?.leadId])

  const fetchLead = async () => {
    try {
      if (!params?.leadId) return
      const leadId = params.leadId as string
      if (!leadId) return

      console.log('Fetching lead with ID:', leadId)
      const response = await fetch(`/api/leads/${leadId}`)
      const data = await response.json()

      if (!response.ok) {
        console.error('Error response:', data)
        throw new Error(data.error || "Failed to fetch lead")
      }

      console.log('Fetched lead data:', data)
      setLeadData(data)
    } catch (error) {
      console.error("Fetch lead error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch lead details",
      })
      // Redirect back to leads page on error
      router.push('/lead')
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users",
      })
    }
  }

  const handleSubmit = async () => {
    if (!leadData || !params?.leadId) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/leads/${params.leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      })

      if (!response.ok) {
        throw new Error("Failed to update lead")
      }

      // Dispatch custom event to notify lead update
      window.dispatchEvent(new Event('leadUpdated'))

      toast({
        title: "Success",
        description: "Lead updated successfully",
      })
    } catch (error) {
      console.error("Update lead error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update lead",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCall = () => {
    if (!leadData?.phone) return
    // Implement call functionality using Twilio
    const timestamp = new Date().toISOString()
    const newCall = {
      date: timestamp,
      duration: 0,
      recording: undefined,
      points: [] // Add points array to store communication points
    }
    
    const updatedCallHistory = [...(leadData.callHistory || []), newCall]
    setLeadData({ ...leadData, callHistory: updatedCallHistory })
    
    toast({
      title: "Calling",
      description: `Initiating call to ${leadData.phone}`
    })
  }

  const addCallPoint = async (callIndex: number, point: string) => {
    if (!leadData || !params?.leadId) return

    try {
      const updatedCallHistory = [...(leadData.callHistory || [])]
      if (!updatedCallHistory[callIndex].points) {
        updatedCallHistory[callIndex].points = []
      }
      updatedCallHistory[callIndex].points.push({
        text: point,
        timestamp: new Date().toISOString()
      })

      const updatedData = { ...leadData, callHistory: updatedCallHistory }
      setLeadData(updatedData)

      const response = await fetch(`/api/leads/${params.leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callHistory: updatedCallHistory })
      })

      if (!response.ok) {
        throw new Error("Failed to save call point")
      }

      toast({
        title: "Success",
        description: "Call point added successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add call point",
      })
    }
  }

  const addNote = async () => {
    if (!newNote.trim() || !leadData || !params?.leadId) return

    try {
      console.log('Adding note for lead:', params.leadId);
      const timestamp = new Date().toISOString()
      const updatedNotes = leadData.notes 
        ? `${leadData.notes}\n\n${timestamp}: ${newNote}`
        : `${timestamp}: ${newNote}`

      // Only send the necessary update data
      const updateData = {
        notes: updatedNotes
      }

      const response = await fetch(`/api/leads/${params.leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()
      console.log('Response from server:', data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to save note")
      }

      // Update the local state with the complete updated lead data
      setLeadData(data)
      setNewNote("")

      toast({
        title: "Success",
        description: "Note added successfully",
      })
    } catch (error) {
      console.error("Save note error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save note",
      })
    }
  }

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    if (!leadData || !params?.leadId) return;
    
    const updatedTasks = leadData.tasks?.map(task =>
      task.id === taskId ? {
        ...task, 
        ...updates,
        date: updates.date ? new Date(updates.date).toISOString() : task.date
      } : task
    ) || [];
    
    const updatedData = { ...leadData, tasks: updatedTasks };
    setLeadData(updatedData);

    try {
      const response = await fetch(`/api/leads/${params.leadId}/tasks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: updatedTasks })
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      // Trigger a refresh of the leads list to update metrics
      window.dispatchEvent(new Event('storage'));

      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task",
      });
    }
  };

  if (!leadData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Loading lead details...</h2>
            <p className="text-gray-500">Please wait while we fetch the information.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="border-black text-black hover:bg-black hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="bg-[#ef4444] hover:bg-[#dc2626] text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={leadData.name}
                    onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={leadData.email}
                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={leadData.phone}
                    onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Assigned To</Label>
                  <Select
                    value={leadData.assignedTo || 'unassigned'}
                    onValueChange={(value) => setLeadData({ ...leadData, assignedTo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Property</Label>
                  <Input
                    value={leadData.property}
                    onChange={(e) => setLeadData({ ...leadData, property: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select
                    value={leadData.location || ""}
                    onValueChange={(value) => setLeadData({ ...leadData, location: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Created Date</Label>
                  <div className="text-sm text-gray-500">
                    {formatDate(leadData.date)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Lead Status</Label>
                    <Select
                      value={leadData.leadStatus as "cold" | "warm" | "hot" | "mild"}
                      onValueChange={(value: "cold" | "warm" | "hot" | "mild") => setLeadData({ ...leadData, leadStatus: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select lead status" />
                      </SelectTrigger>
                      <SelectContent>
                        {leadStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Lead Response</Label>
                    <Select
                      value={leadData.leadResponse as "active" | "inactive" | "not answering" | "not actively answering" | "always responding"}
                      onValueChange={(value: "active" | "inactive" | "not answering" | "not actively answering" | "always responding") => 
                        setLeadData({ ...leadData, leadResponse: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select lead response" />
                      </SelectTrigger>
                      <SelectContent>
                        {leadResponses.map((response) => (
                          <SelectItem key={response.value} value={response.value}>
                            {response.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Lead Source</Label>
                    <Select
                      value={leadData.leadSource as "website" | "google ads" | "meta" | "refferal" | "linkedin" | "youtube"}
                      onValueChange={(value: "website" | "google ads" | "meta" | "refferal" | "linkedin" | "youtube") => 
                        setLeadData({ ...leadData, leadSource: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select lead source" />
                      </SelectTrigger>
                      <SelectContent>
                        {leadSources.map((source) => (
                          <SelectItem key={source.value} value={source.value}>
                            {source.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Lead Type</Label>
                    <Select
                      value={leadData.leadType as "Pre construction" | "resale" | "seller" | "buyer"}
                      onValueChange={(value: "Pre construction" | "resale" | "seller" | "buyer") => 
                        setLeadData({ ...leadData, leadType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select lead type" />
                      </SelectTrigger>
                      <SelectContent>
                        {leadTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Client Type</Label>
                    <Select
                      value={leadData.clientType as "Investor" | "custom buyer" | "first home buyer" | "seasonal investor" | "commercial buyer"}
                      onValueChange={(value: "Investor" | "custom buyer" | "first home buyer" | "seasonal investor" | "commercial buyer") => 
                        setLeadData({ ...leadData, clientType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select client type" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" onClick={handleCall}>
                  <Phone className="h-4 w-4 mr-2" />
                  Make Call
                </Button>
                <div className="space-y-4">
                  {(leadData.callHistory || []).map((call, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">
                            Call on {formatDate(call.date)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Duration: {call.duration} minutes
                          </div>
                        </div>
                        {call.recording && (
                          <Button variant="outline" size="sm">
                            Play Recording
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add key points from the call..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                                addCallPoint(index, (e.target as HTMLInputElement).value.trim())
                                ;(e.target as HTMLInputElement).value = ''
                              }
                            }}
                          />
                          <Button 
                            variant="outline"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement
                              if (input.value.trim()) {
                                addCallPoint(index, input.value.trim())
                                input.value = ''
                              }
                            }}
                          >
                            Add Point
                          </Button>
                        </div>
                        
                        {call.points && call.points.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Key Points:</Label>
                            <ul className="space-y-1">
                              {call.points.map((point: CallPoint, pointIndex: number) => (
                                <li key={pointIndex} className="text-sm flex items-start gap-2">
                                  <span className="mt-1">•</span>
                                  <span>{point.text}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <CallHistory calls={leadData.callHistory || []} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a new note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={addNote}
                      className="self-start"
                      disabled={!newNote.trim() || isLoading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {leadData?.notes?.split('\n\n').map((note: string, index: number) => (
                      <div key={index} className="text-sm border-b pb-2">
                        {note}
                      </div>
                    ))}
                    {!leadData?.notes && (
                      <p className="text-sm text-gray-500">No notes yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Budget Range</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={leadData.propertyPreferences?.budget?.min || ''}
                          onChange={(e) => setLeadData({
                            ...leadData,
                            propertyPreferences: {
                              propertyType: leadData.propertyPreferences?.propertyType || [],
                              bedrooms: leadData.propertyPreferences?.bedrooms || 0,
                              bathrooms: leadData.propertyPreferences?.bathrooms || 0,
                              locations: leadData.propertyPreferences?.locations || [],
                              features: leadData.propertyPreferences?.features || [],
                              budget: {
                                min: Number(e.target.value),
                                max: leadData.propertyPreferences?.budget?.max || 0
                              }
                            }
                          })}
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={leadData.propertyPreferences?.budget?.max || ''}
                          onChange={(e) => setLeadData({
                            ...leadData,
                            propertyPreferences: {
                              propertyType: leadData.propertyPreferences?.propertyType || [],
                              bedrooms: leadData.propertyPreferences?.bedrooms || 0,
                              bathrooms: leadData.propertyPreferences?.bathrooms || 0,
                              locations: leadData.propertyPreferences?.locations || [],
                              features: leadData.propertyPreferences?.features || [],
                              budget: {
                                min: leadData.propertyPreferences?.budget?.min || 0,
                                max: Number(e.target.value)
                              }
                            }
                          })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Property Type</Label>
                      <Select
                        value={leadData.propertyPreferences?.propertyType?.[0] || ''}
                        onValueChange={(value) => setLeadData({
                          ...leadData,
                          propertyPreferences: {
                            propertyType: [value],
                            bedrooms: leadData.propertyPreferences?.bedrooms || 0,
                            bathrooms: leadData.propertyPreferences?.bathrooms || 0,
                            locations: leadData.propertyPreferences?.locations || [],
                            features: leadData.propertyPreferences?.features || [],
                            budget: {
                              min: leadData.propertyPreferences?.budget?.min || 0,
                              max: leadData.propertyPreferences?.budget?.max || 0
                            }
                          }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="detached">Detached</SelectItem>
                          <SelectItem value="semi-detached">Semi-Detached</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                          <SelectItem value="condo">Condo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <ShowingCalendar 
                    showings={leadData.showings || []}
                    onAddShowing={async (showing) => {
                      if (!params?.leadId) return;
                      const updatedShowings = [...(leadData.showings || []), {...showing, id: showing.id || ''}];
                      const updatedData = { ...leadData, showings: updatedShowings };
                      setLeadData(updatedData as Lead);
                      
                      try {
                        const response = await fetch(`/api/leads/${params.leadId}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ showings: updatedShowings })
                        });

                        if (!response.ok) {
                          throw new Error("Failed to update showings");
                        }

                        toast({
                          title: "Success",
                          description: "Showing scheduled successfully",
                        });
                      } catch (error) {
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: "Failed to schedule showing",
                        });
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskManager
                  tasks={leadData.tasks || []}
                  onAddTask={async (task) => {
                    if (!params?.leadId) return;
                    const updatedTasks = [...(leadData.tasks || []), task];
                    const updatedData = { ...leadData, tasks: updatedTasks };
                    setLeadData(updatedData as Lead);
                    
                    try {
                      const response = await fetch(`/api/leads/${params.leadId}/tasks`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ tasks: updatedTasks })
                      });

                      if (!response.ok) {
                        throw new Error("Failed to add task");
                      }

                      toast({
                        title: "Success",
                        description: "Task added successfully",
                      });
                    } catch (error) {
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to add task",
                      });
                    }
                  }}
                  onUpdateTask={async (taskId: string, updates: Partial<Task>) => {
                    if (!params?.leadId) return;
                    try {
                      const processedUpdates = {
                        ...updates,
                        date: updates.date ? new Date(updates.date).toISOString() : undefined
                      };
                      const response = await fetch(`/api/leads/${params.leadId}/tasks/${taskId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(processedUpdates)
                      });

                      if (!response.ok) {
                        throw new Error("Failed to update task");
                      }

                      const updatedTasks = leadData.tasks?.map(task => 
                        task.id === taskId ? { ...task, ...updates } : task
                      ) || [];

                      setLeadData({ ...leadData, tasks: updatedTasks } as Lead);

                      toast({
                        title: "Success",
                        description: "Task updated successfully"
                      });
                    } catch (error) {
                      toast({
                        variant: "destructive",
                        title: "Error", 
                        description: "Failed to update task"
                      });
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 