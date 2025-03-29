"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CallHistory } from "@/components/call-history"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, Home, Calendar, ClipboardList, PlusCircle, Plus, Upload, Info, History, Search, Filter } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StrategyPlanner } from "@/components/strategy-planner"
import { format } from "date-fns"
import type { Lead, Task } from "@/lib/types"
import { useRouter } from "next/navigation"
import { formatDate } from "@/lib/utils"
import { parseExcelLeads } from "@/lib/excel-utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TaskManager } from "@/components/task-manager"
import { LeadForm } from "@/components/lead-form"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

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
  { value: 'website', label: 'Website Enquiry' },
  { value: 'google ads', label: 'Google Ads' },
  { value: 'meta', label: 'Meta' },
  { value: 'refferal', label: 'Referral' },
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

export function LeadListing() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [mounted, setMounted] = useState(false)
  const [status, setStatus] = useState("All")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const router = useRouter()
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [users, setUsers] = useState<{ _id: string; name: string }[]>([])
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    leadStatus: "",
    leadType: "",
    leadSource: "",
    leadResponse: "",
    clientType: "",
    assignedTo: "",
    location: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [showNoCallsOnly, setShowNoCallsOnly] = useState(false)
  const [showWebsiteEnquiriesOnly, setShowWebsiteEnquiriesOnly] = useState(false)
  const [selectedTemperature, setSelectedTemperature] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    property: "",
    leadStatus: "",
    leadType: "",
    leadSource: "",
    leadResponse: "",
    clientType: "",
    location: "",
    assignedTo: "",
    notes: "",
    propertyPreferences: {
      budget: {
        min: 0,
        max: 0
      },
      propertyType: ""
    }
  })
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchLeads()
    fetchUsers()
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchLeads()
      
      // Listen for storage changes
      const handleStorageChange = () => {
        const updatedLeads = JSON.parse(localStorage.getItem('leads') || '[]')
        setLeads(updatedLeads)
      }

      window.addEventListener('storage', handleStorageChange)
      return () => {
        window.removeEventListener('storage', handleStorageChange)
      }
    }
  }, [mounted])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      
      // Fetch leads from MongoDB
      const response = await fetch("/api/leads")
      if (!response.ok) {
        throw new Error("Failed to fetch leads")
      }
      
      const leads = await response.json()
      
      // Update both state and localStorage
      setLeads(leads)
      localStorage.setItem('leads', JSON.stringify(leads))
      
    } catch (error) {
      console.error("Fetch leads error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch leads. Please try again.",
      })
      
      // Fallback to localStorage if API fails
      const storedLeads = JSON.parse(localStorage.getItem('leads') || '[]')
      setLeads(storedLeads)
    } finally {
      setLoading(false)
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

  const getUserName = (userId: string) => {
    const user = users.find(u => u._id === userId)
    return user ? user.name : 'Unassigned'
  }

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      toast({
        title: "Success",
        description: "Lead status updated successfully",
      })
      fetchLeads()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update lead status",
      })
    }
  }

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      new: "bg-blue-100 text-blue-800",
      contacted: "bg-yellow-100 text-yellow-800",
      qualified: "bg-green-100 text-green-800",
      proposal: "bg-purple-100 text-purple-800",
      negotiation: "bg-orange-100 text-orange-800",
      closed: "bg-gray-100 text-gray-800"
    }
    return statusColors[status] || statusColors.new
  }

  const handleCall = async (leadId: string, phoneNumber: string) => {
    try {
      const response = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, phoneNumber }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate call")
      }

      toast({
        title: "Call Initiated",
        description: "Connecting your call...",
      })
      
      // Refresh leads to show updated call history
      fetchLeads()
    } catch (error) {
      console.error("Call error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to initiate call. Please try again.",
      })
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Parse Excel file
      const importedLeads = await parseExcelLeads(file);
      
      // Save to MongoDB
      const response = await fetch("/api/leads/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: importedLeads }),
      });

      if (!response.ok) {
        throw new Error("Failed to save leads to database");
      }

      // Get existing leads from localStorage
      const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
      
      // Merge new leads with existing ones
      const updatedLeads = [...existingLeads, ...importedLeads];
      
      // Save to localStorage
      localStorage.setItem('leads', JSON.stringify(updatedLeads));
      
      // Refresh leads display
      fetchLeads();
      
      toast({
        title: "Success",
        description: `${importedLeads.length} leads imported successfully`,
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: "Failed to import leads. Please check the file format and try again.",
      });
    } finally {
      // Clear the file input
      event.target.value = '';
    }
  };

  const handleTaskUpdate = async (leadId: string, tasks: Task[]) => {
    try {
      const response = await fetch(`/api/leads/${leadId}/tasks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks })
      });

      if (!response.ok) {
        throw new Error("Failed to update tasks");
      }

      // Update local state
      setLeads(leads.map(lead => 
        lead._id === leadId ? { ...lead, tasks } : lead
      ));

      toast({
        title: "Success",
        description: "Tasks updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update tasks",
      });
    }
  };

  const getLeadStatusColor = (status: Lead['leadStatus']) => {
    const colors = {
      cold: "bg-blue-100 text-blue-800",
      warm: "bg-yellow-100 text-yellow-800",
      hot: "bg-red-100 text-red-800",
      mild: "bg-green-100 text-green-800"
    }
    return colors[status] || colors.cold;
  }

  const getLeadTypeColor = (type: Lead['leadType']) => {
    const colors = {
      'Pre construction': "bg-purple-100 text-purple-800",
      'resale': "bg-indigo-100 text-indigo-800",
      'seller': "bg-pink-100 text-pink-800",
      'buyer': "bg-orange-100 text-orange-800"
    }
    return colors[type] || "bg-gray-100 text-gray-800";
  }

  const getSourceColor = (source: Lead['leadSource']) => {
    const colors = {
      'website': "bg-green-100 text-green-800",
      'google ads': "bg-blue-100 text-blue-800",
      'meta': "bg-purple-100 text-purple-800",
      'refferal': "bg-yellow-100 text-yellow-800",
      'linkedin': "bg-sky-100 text-sky-800",
      'youtube': "bg-red-100 text-red-800"
    }
    return colors[source] || "bg-gray-100 text-gray-800"
  }

  const getFilteredLeads = () => {
    let filteredLeads = [...leads]

    // Enhanced search filter - search across all properties including dropdown values
    if (searchQuery) {
      const searchTerm = searchQuery.toLowerCase()
      filteredLeads = filteredLeads.filter(lead => {
        // Basic info
        const basicInfoMatch = 
          lead.name?.toLowerCase().includes(searchTerm) ||
          lead.email?.toLowerCase().includes(searchTerm) ||
          lead.phone?.includes(searchTerm) ||
          lead.property?.toLowerCase().includes(searchTerm)

        // Status and types with their display labels
        const statusMatch = leadStatuses.find(status => 
          status.value === lead.leadStatus)?.label.toLowerCase().includes(searchTerm)
        
        const typeMatch = leadTypes.find(type => 
          type.value === lead.leadType)?.label.toLowerCase().includes(searchTerm)
        
        const sourceMatch = leadSources.find(source => 
          source.value === lead.leadSource)?.label.toLowerCase().includes(searchTerm)
        
        const responseMatch = leadResponses.find(response => 
          response.value === lead.leadResponse)?.label.toLowerCase().includes(searchTerm)
        
        const clientTypeMatch = clientTypes.find(type => 
          type.value === lead.clientType)?.label.toLowerCase().includes(searchTerm)

        // Location with display label
        const locationMatch = locations.find(loc => 
          loc.value === lead.location)?.label.toLowerCase().includes(searchTerm)

        // Assigned user
        const assignedUserMatch = users.find(user => 
          user._id === lead.assignedTo)?.name.toLowerCase().includes(searchTerm)

        // Notes
        const notesMatch = lead.notes?.toLowerCase().includes(searchTerm)

        // Property preferences
        const preferencesMatch = 
          lead.propertyPreferences?.propertyType?.some(type => 
            type.toLowerCase().includes(searchTerm)
          ) ||
          lead.propertyPreferences?.locations?.some(location => 
            location.toLowerCase().includes(searchTerm)
          ) ||
          lead.propertyPreferences?.features?.some(feature => 
            feature.toLowerCase().includes(searchTerm)
          )

        // Call history points
        const callPointsMatch = lead.callHistory?.some(call =>
          call.points?.some(point =>
            point.text.toLowerCase().includes(searchTerm)
          )
        )

        // Get display values for the current lead
        const displayValues = [
          // Basic info
          lead.name,
          lead.email,
          lead.phone,
          lead.property,
          // Status and types with their display labels
          leadStatuses.find(s => s.value === lead.leadStatus)?.label,
          leadTypes.find(t => t.value === lead.leadType)?.label,
          leadSources.find(s => s.value === lead.leadSource)?.label,
          leadResponses.find(r => r.value === lead.leadResponse)?.label,
          clientTypes.find(t => t.value === lead.clientType)?.label,
          // Location
          locations.find(l => l.value === lead.location)?.label,
          // Assigned user
          users.find(u => u._id === lead.assignedTo)?.name,
          // Notes
          lead.notes
        ].filter(Boolean).join(' ').toLowerCase()

        return (
          displayValues.includes(searchTerm) ||
          basicInfoMatch ||
          statusMatch ||
          typeMatch ||
          sourceMatch ||
          responseMatch ||
          clientTypeMatch ||
          locationMatch ||
          assignedUserMatch ||
          notesMatch ||
          preferencesMatch ||
          callPointsMatch
        )
      })
    }

    // Apply status filter
    if (status !== "All") {
      filteredLeads = filteredLeads.filter(lead => lead.leadStatus === status)
    }

    // Apply no calls filter
    if (showNoCallsOnly) {
      filteredLeads = filteredLeads.filter(lead => 
        !lead.callHistory || lead.callHistory.length === 0
      )
    }

    // Apply website enquiries filter
    if (showWebsiteEnquiriesOnly) {
      filteredLeads = filteredLeads.filter(lead => 
        lead.leadSource === 'website'
      )
    }

    // Apply other filters
    if (filters.leadStatus) {
      filteredLeads = filteredLeads.filter(lead => lead.leadStatus === filters.leadStatus)
    }
    if (filters.leadType) {
      filteredLeads = filteredLeads.filter(lead => lead.leadType === filters.leadType)
    }
    if (filters.leadSource) {
      filteredLeads = filteredLeads.filter(lead => lead.leadSource === filters.leadSource)
    }
    if (filters.leadResponse) {
      filteredLeads = filteredLeads.filter(lead => lead.leadResponse === filters.leadResponse)
    }
    if (filters.clientType) {
      filteredLeads = filteredLeads.filter(lead => lead.clientType === filters.clientType)
    }
    if (filters.assignedTo) {
      filteredLeads = filteredLeads.filter(lead => lead.assignedTo === filters.assignedTo)
    }
    if (filters.location) {
      filteredLeads = filteredLeads.filter(lead => lead.location === filters.location)
    }

    return filteredLeads
  }

  const getLeadsByTemperature = (temperature?: string) => {
    const filtered = getFilteredLeads()
    if (!temperature || temperature === 'all') return filtered
    return filtered.filter(lead => lead.leadStatus === temperature)
  }

  const getLeadsByLocation = (location?: string) => {
    const filtered = getFilteredLeads()
    if (!location || location === 'all') return filtered
    return filtered.filter(lead => 
      lead.location?.toLowerCase() === location.toLowerCase() ||
      lead.propertyPreferences?.locations?.some(loc => 
        loc.toLowerCase() === location.toLowerCase()
      )
    )
  }

  const resetNewLead = () => {
    setNewLead({
      name: "",
      email: "",
      phone: "",
      property: "",
      leadStatus: "",
      leadType: "",
      leadSource: "",
      leadResponse: "",
      clientType: "",
      location: "",
      assignedTo: "",
      notes: "",
      propertyPreferences: {
        budget: {
          min: 0,
          max: 0
        },
        propertyType: ""
      }
    })
  }

  const handleAddLead = async () => {
    try {
      // Validate required fields
      if (!newLead.name || !newLead.email || !newLead.phone) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields (Name, Email, Phone)",
        })
        return
      }

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newLead,
          date: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add lead")
      }

      // Refresh leads list
      fetchLeads()
      
      // Reset form and close dialog
      resetNewLead()
      setIsAddLeadOpen(false)

      toast({
        title: "Success",
        description: "Lead added successfully",
      })
    } catch (error) {
      console.error("Add lead error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add lead. Please try again.",
      })
    }
  }

  // Only render table content after mounting
  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Leads</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody />
          </Table>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Lead Management</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={showNoCallsOnly ? "default" : "outline"}
              onClick={() => setShowNoCallsOnly(!showNoCallsOnly)}
              className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200"
            >
              <Phone className="h-4 w-4 mr-2" />
              No Calls ({leads.filter(l => !l.callHistory || l.callHistory.length === 0).length})
            </Button>
            <Button
              variant={showWebsiteEnquiriesOnly ? "default" : "outline"}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border-blue-200"
              onClick={() => setShowWebsiteEnquiriesOnly(!showWebsiteEnquiriesOnly)}
            >
              <Home className="h-4 w-4 mr-2" />
              Website Enquiries ({leads.filter(l => l.leadSource === 'website').length})
            </Button>
            <Button 
              onClick={() => setIsAddLeadOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
            <div className="relative">
              <Input
                type="file"
                id="excel-upload"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
              />
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('excel-upload')?.click()}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Leads
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 border-b">
          <div className="flex space-x-2">
            <Button
              variant={selectedTemperature === "all" ? "default" : "ghost"}
              onClick={() => setSelectedTemperature("all")}
              className="relative rounded-none border-b-2 border-transparent px-4"
            >
              All Leads ({getFilteredLeads().length})
            </Button>
            <Button
              variant={selectedTemperature === "hot" ? "default" : "ghost"}
              onClick={() => setSelectedTemperature("hot")}
              className="relative rounded-none border-b-2 border-transparent px-4 text-red-600 hover:text-red-700"
            >
              Hot Leads ({getLeadsByTemperature("hot").length})
            </Button>
            <Button
              variant={selectedTemperature === "warm" ? "default" : "ghost"}
              onClick={() => setSelectedTemperature("warm")}
              className="relative rounded-none border-b-2 border-transparent px-4 text-yellow-600 hover:text-yellow-700"
            >
              Warm Leads ({getLeadsByTemperature("warm").length})
            </Button>
            <Button
              variant={selectedTemperature === "cold" ? "default" : "ghost"}
              onClick={() => setSelectedTemperature("cold")}
              className="relative rounded-none border-b-2 border-transparent px-4 text-blue-600 hover:text-blue-700"
            >
              Cold Leads ({getLeadsByTemperature("cold").length})
            </Button>
            <Button
              variant={selectedTemperature === "mild" ? "default" : "ghost"}
              onClick={() => setSelectedTemperature("mild")}
              className="relative rounded-none border-b-2 border-transparent px-4 text-green-600 hover:text-green-700"
            >
              Mild Leads ({getLeadsByTemperature("mild").length})
            </Button>
          </div>
        </div>

        <div className="mt-4 border-b">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <Button
              variant={selectedLocation === "all" ? "default" : "ghost"}
              onClick={() => setSelectedLocation("all")}
              className="relative rounded-none border-b-2 border-transparent px-4 whitespace-nowrap"
            >
              All Locations ({getFilteredLeads().length})
            </Button>
            {locations.map(location => (
              <Button
                key={location.value}
                variant={selectedLocation === location.value ? "default" : "ghost"}
                onClick={() => setSelectedLocation(location.value)}
                className="relative rounded-none border-b-2 border-transparent px-4 whitespace-nowrap"
              >
                {location.label} ({getLeadsByLocation(location.value).length})
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by any field (name, email, phone, status, location, etc.)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className={Object.values(filters).some(v => v !== "") ? 
                    "bg-blue-50 text-blue-600 border-blue-200" : ""}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters {Object.values(filters).filter(v => v !== "").length > 0 && 
                    `(${Object.values(filters).filter(v => v !== "").length})`}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Filter Leads</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Lead Status</Label>
                    <Select
                      value={filters.leadStatus}
                      onValueChange={(value) => setFilters({ ...filters, leadStatus: value === "all" ? "" : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {leadStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Lead Type</Label>
                    <Select
                      value={filters.leadType}
                      onValueChange={(value) => setFilters({ ...filters, leadType: value === "all" ? "" : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {leadTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Lead Source</Label>
                    <Select
                      value={filters.leadSource}
                      onValueChange={(value) => setFilters({ ...filters, leadSource: value === "all" ? "" : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {leadSources.map((source) => (
                          <SelectItem key={source.value} value={source.value}>
                            {source.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Lead Response</Label>
                    <Select
                      value={filters.leadResponse}
                      onValueChange={(value) => setFilters({ ...filters, leadResponse: value === "all" ? "" : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select response" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {leadResponses.map((response) => (
                          <SelectItem key={response.value} value={response.value}>
                            {response.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Client Type</Label>
                    <Select
                      value={filters.clientType}
                      onValueChange={(value) => setFilters({ ...filters, clientType: value === "all" ? "" : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select client type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {clientTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Select
                      value={filters.location}
                      onValueChange={(value) => setFilters({ ...filters, location: value === "all" ? "" : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map((location) => (
                          <SelectItem key={location.value} value={location.value}>
                            {location.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Assigned To</Label>
                    <Select
                      value={filters.assignedTo}
                      onValueChange={(value) => setFilters({ ...filters, assignedTo: value === "all" ? "" : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilters({
                          leadStatus: "",
                          leadType: "",
                          leadSource: "",
                          leadResponse: "",
                          clientType: "",
                          assignedTo: "",
                          location: "",
                        })
                      }}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Reset Filters
                    </Button>
                    <Button 
                      onClick={() => setIsFilterDialogOpen(false)}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getLeadsByLocation(selectedLocation)
              .filter(lead => selectedTemperature === 'all' || lead.leadStatus === selectedTemperature)
              .map((lead: Lead) => (
              <TableRow key={lead._id}>
                <TableCell>
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal text-black hover:text-gray-700"
                    onClick={() => router.push(`/lead/${lead._id}`)}
                  >
                    {lead.name}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-black">
                    <div>{lead.email}</div>
                    <div className="text-gray-600">{lead.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getLeadStatusColor(lead.leadStatus || 'cold')}>
                    {(lead.leadStatus || 'cold').charAt(0).toUpperCase() + (lead.leadStatus || 'cold').slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getLeadTypeColor(lead.leadType)}>
                    {(lead.leadType || 'buyer').charAt(0).toUpperCase() + (lead.leadType || 'buyer').slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getSourceColor(lead.leadSource as 'meta' | 'website' | 'google ads' | 'refferal' | 'linkedin' | 'youtube')}>
                    {lead.leadSource?.charAt(0).toUpperCase() + lead.leadSource?.slice(1) || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {lead.location || 'Not specified'}
                  </Badge>
                </TableCell>
                <TableCell>{lead.property}</TableCell>
                <TableCell>
                  {formatDate(lead.date)}
                </TableCell>
                <TableCell>
                  {lead.assignedTo ? getUserName(lead.assignedTo) : 'Unassigned'}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-black text-black hover:bg-black hover:text-white" 
                        onClick={() => handleCall(lead._id, lead.phone)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-black text-black hover:bg-black hover:text-white"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setSelectedLead(lead)
                                setIsDetailsOpen(true)
                              }}
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View full details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-black text-black hover:bg-black hover:text-white w-full"
                      onClick={() => setIsHistoryOpen(true)}
                    >
                      <History className="h-4 w-4 mr-2" />
                      View Call History
                    </Button>
                    <div className="mt-2 space-y-1">
                      <div className="text-sm text-gray-600">
                        Tasks: {lead.tasks?.length || 0}
                        {lead.tasks && lead.tasks.length > 0 && (
                          <span className="ml-2 text-gray-500">
                            ({lead.tasks.filter(t => t.status === 'pending').length} pending)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Add Lead Dialog */}
      <Dialog 
        open={isAddLeadOpen} 
        onOpenChange={(open) => {
          setIsAddLeadOpen(open)
          if (!open) resetNewLead()
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input 
                placeholder="Enter lead name" 
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input 
                type="email" 
                placeholder="Enter email address" 
                value={newLead.email}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input 
                placeholder="Enter phone number" 
                value={newLead.phone}
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Property</Label>
              <Input 
                placeholder="Enter property details" 
                value={newLead.property}
                onChange={(e) => setNewLead({ ...newLead, property: e.target.value })}
              />
            </div>

            {/* Lead Details */}
            <div className="space-y-2">
              <Label>Lead Status</Label>
              <Select
                value={newLead.leadStatus}
                onValueChange={(value) => setNewLead({ ...newLead, leadStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
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
              <Label>Lead Type</Label>
              <Select
                value={newLead.leadType}
                onValueChange={(value) => setNewLead({ ...newLead, leadType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
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
              <Label>Lead Source</Label>
              <Select
                value={newLead.leadSource}
                onValueChange={(value) => setNewLead({ ...newLead, leadSource: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
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
              <Label>Lead Response</Label>
              <Select
                value={newLead.leadResponse}
                onValueChange={(value) => setNewLead({ ...newLead, leadResponse: value as 'active' | 'inactive' | 'not answering' | 'not actively answering' | 'always responding' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select response" />
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
              <Label>Client Type</Label>
              <Select
                value={newLead.clientType}
                onValueChange={(value) => setNewLead({ ...newLead, clientType: value })}
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

            <div className="space-y-2">
              <Label>Location</Label>
              <Select
                value={newLead.location}
                onValueChange={(value) => setNewLead({ ...newLead, location: value })}
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
              <Label>Assigned To</Label>
              <Select
                value={newLead.assignedTo}
                onValueChange={(value) => setNewLead({ ...newLead, assignedTo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
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

            {/* Property Preferences */}
            <div className="col-span-2 space-y-2">
              <Label>Property Preferences</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Budget Range</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      placeholder="Min" 
                      value={newLead.propertyPreferences.budget.min}
                      onChange={(e) => setNewLead({
                        ...newLead,
                        propertyPreferences: {
                          ...newLead.propertyPreferences,
                          budget: {
                            ...newLead.propertyPreferences.budget,
                            min: parseInt(e.target.value) || 0
                          }
                        }
                      })}
                    />
                    <Input 
                      type="number" 
                      placeholder="Max" 
                      value={newLead.propertyPreferences.budget.max}
                      onChange={(e) => setNewLead({
                        ...newLead,
                        propertyPreferences: {
                          ...newLead.propertyPreferences,
                          budget: {
                            ...newLead.propertyPreferences.budget,
                            max: parseInt(e.target.value) || 0
                          }
                        }
                      })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select
                    value={newLead.propertyPreferences.propertyType}
                    onValueChange={(value) => setNewLead({
                      ...newLead,
                      propertyPreferences: {
                        ...newLead.propertyPreferences,
                        propertyType: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
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
            </div>

            {/* Notes */}
            <div className="col-span-2 space-y-2">
              <Label>Notes</Label>
              <Textarea 
                placeholder="Enter any additional notes about the lead" 
                className="min-h-[100px]"
                value={newLead.notes}
                onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
              />
            </div>

            {/* Action Buttons */}
            <div className="col-span-2 flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddLeadOpen(false)
                  resetNewLead()
                }}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddLead}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Add Lead
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lead Details Dialog */}
      <Dialog 
        open={isDetailsOpen} 
        onOpenChange={(open) => {
          setIsDetailsOpen(open)
          if (!open) {
            setSelectedLead(null)
            setIsEditing(false)
          }
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Lead Details</DialogTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Edit Lead
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      if (!selectedLead) return

                      try {
                        const response = await fetch(`/api/leads/${selectedLead._id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(selectedLead),
                        })

                        if (!response.ok) {
                          throw new Error("Failed to update lead")
                        }

                        toast({
                          title: "Success",
                          description: "Lead updated successfully",
                        })

                        setIsEditing(false)
                        fetchLeads()
                      } catch (error) {
                        console.error("Update lead error:", error)
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: "Failed to update lead. Please try again.",
                        })
                      }
                    }}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </DialogHeader>

          {selectedLead && (
            <div className="mt-4">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="preferences">Property Preferences</TabsTrigger>
                  <TabsTrigger value="history">Call History</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      {isEditing ? (
                        <Input
                          value={selectedLead.name}
                          onChange={(e) => setSelectedLead({
                            ...selectedLead,
                            name: e.target.value
                          })}
                        />
                      ) : (
                        <div className="p-2 border rounded-md">{selectedLead.name}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={selectedLead.email}
                          onChange={(e) => setSelectedLead({
                            ...selectedLead,
                            email: e.target.value
                          })}
                        />
                      ) : (
                        <div className="p-2 border rounded-md">{selectedLead.email}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Phone</Label>
                      {isEditing ? (
                        <Input
                          value={selectedLead.phone}
                          onChange={(e) => setSelectedLead({
                            ...selectedLead,
                            phone: e.target.value
                          })}
                        />
                      ) : (
                        <div className="p-2 border rounded-md">{selectedLead.phone}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Property</Label>
                      {isEditing ? (
                        <Input
                          value={selectedLead.property}
                          onChange={(e) => setSelectedLead({
                            ...selectedLead,
                            property: e.target.value
                          })}
                        />
                      ) : (
                        <div className="p-2 border rounded-md">{selectedLead.property || 'Not specified'}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Lead Status</Label>
                      {isEditing ? (
                        <Select
                          value={selectedLead.leadStatus}
                          onValueChange={(value: 'cold' | 'warm' | 'hot' | 'mild') => setSelectedLead({
                            ...selectedLead,
                            leadStatus: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {leadStatuses.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={getLeadStatusColor(selectedLead.leadStatus || 'cold')}>
                          {(selectedLead.leadStatus || 'cold').charAt(0).toUpperCase() + (selectedLead.leadStatus || 'cold').slice(1)}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Lead Type</Label>
                      {isEditing ? (
                        <Select
                          value={selectedLead.leadType}
                          onValueChange={(value) => setSelectedLead({
                            ...selectedLead,
                            leadType: value as 'Pre construction' | 'resale' | 'seller' | 'buyer'
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {leadTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={getLeadTypeColor(selectedLead.leadType)}>
                          {(selectedLead.leadType || 'buyer').charAt(0).toUpperCase() + (selectedLead.leadType || 'buyer').slice(1)}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Lead Source</Label>
                      {isEditing ? (
                        <Select
                          value={selectedLead.leadSource}
                          onValueChange={(value) => setSelectedLead({
                            ...selectedLead,
                            leadSource: value as 'meta' | 'website' | 'google ads' | 'refferal' | 'linkedin' | 'youtube'
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {leadSources.map((source) => (
                              <SelectItem key={source.value} value={source.value}>
                                {source.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={getSourceColor(selectedLead.leadSource as 'meta' | 'website' | 'google ads' | 'refferal' | 'linkedin' | 'youtube')}>
                          {selectedLead.leadSource?.charAt(0).toUpperCase() + selectedLead.leadSource?.slice(1) || 'Unknown'}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Lead Response</Label>
                      {isEditing ? (
                        <Select
                          value={selectedLead.leadResponse}
                          onValueChange={(value) => setSelectedLead({
                            ...selectedLead,
                            leadResponse: value as 'active' | 'inactive' | 'not answering' | 'not actively answering' | 'always responding'
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {leadResponses.map((response) => (
                              <SelectItem key={response.value} value={response.value}>
                                {response.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-2 border rounded-md">
                          {selectedLead.leadResponse || 'Not specified'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Client Type</Label>
                      {isEditing ? (
                        <Select
                          value={selectedLead.clientType}
                          onValueChange={(value) => setSelectedLead({
                            ...selectedLead,
                            clientType: value as 'Investor' | 'custom buyer' | 'first home buyer' | 'seasonal investor' | 'commercial buyer'
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {clientTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-2 border rounded-md">
                          {selectedLead.clientType || 'Not specified'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Location</Label>
                      {isEditing ? (
                        <Select
                          value={selectedLead.location}
                          onValueChange={(value) => setSelectedLead({
                            ...selectedLead,
                            location: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location.value} value={location.value}>
                                {location.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="outline">
                          {selectedLead.location || 'Not specified'}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Assigned To</Label>
                      {isEditing ? (
                        <Select
                          value={selectedLead.assignedTo}
                          onValueChange={(value) => setSelectedLead({
                            ...selectedLead,
                            assignedTo: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
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
                      ) : (
                        <div className="p-2 border rounded-md">
                          {selectedLead.assignedTo ? getUserName(selectedLead.assignedTo) : 'Unassigned'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Created</Label>
                      <div className="p-2 border rounded-md">
                        {formatDate(selectedLead.date)}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Budget Range</Label>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="Min"
                              value={selectedLead.propertyPreferences?.budget?.min}
                              onChange={(e) => setSelectedLead({
                                ...selectedLead,
                                propertyPreferences: {
                                  ...selectedLead.propertyPreferences,
                                  budget: {
                                    min: Number(selectedLead.propertyPreferences?.budget?.min) || 0,
                                    max: Number(selectedLead.propertyPreferences?.budget?.max) || 0
                                  },
                                  propertyType: selectedLead.propertyPreferences?.propertyType || [],
                                  bedrooms: selectedLead.propertyPreferences?.bedrooms || 0,
                                  bathrooms: selectedLead.propertyPreferences?.bathrooms || 0,
                                  locations: selectedLead.propertyPreferences?.locations || [],
                                  features: selectedLead.propertyPreferences?.features || []
                                }
                              })}
                            />
                            <Input
                              type="number"
                              placeholder="Max"
                              value={selectedLead.propertyPreferences?.budget?.max}
                              onChange={(e) => setSelectedLead({
                                ...selectedLead,
                                propertyPreferences: {
                                  ...selectedLead.propertyPreferences,
                                  budget: {
                                    min: selectedLead.propertyPreferences?.budget?.min || 0,
                                    max: parseInt(e.target.value) || 0
                                  },
                                  propertyType: selectedLead.propertyPreferences?.propertyType || [],
                                  bedrooms: selectedLead.propertyPreferences?.bedrooms || 0,
                                  bathrooms: selectedLead.propertyPreferences?.bathrooms || 0,
                                  locations: selectedLead.propertyPreferences?.locations || [],
                                  features: selectedLead.propertyPreferences?.features || []
                                }
                              })}
                            />
                          </div>
                        ) : (
                          <div className="p-2 border rounded-md">
                            {selectedLead.propertyPreferences?.budget?.min && selectedLead.propertyPreferences?.budget?.max
                              ? `$${selectedLead.propertyPreferences.budget.min} - $${selectedLead.propertyPreferences.budget.max}`
                              : 'Not specified'}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Property Type</Label>
                        {isEditing ? (
                          <Select
                            value={selectedLead.propertyPreferences?.propertyType?.[0] ?? ""}
                            onValueChange={(value) => setSelectedLead({
                              ...selectedLead,
                              propertyPreferences: {
                                budget: selectedLead.propertyPreferences?.budget || { min: 0, max: 0 },
                                propertyType: [value],
                                bedrooms: selectedLead.propertyPreferences?.bedrooms || 0,
                                bathrooms: selectedLead.propertyPreferences?.bathrooms || 0,
                                locations: selectedLead.propertyPreferences?.locations || [],
                                features: selectedLead.propertyPreferences?.features || []
                              }
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="detached">Detached</SelectItem>
                              <SelectItem value="semi-detached">Semi-Detached</SelectItem>
                              <SelectItem value="townhouse">Townhouse</SelectItem>
                              <SelectItem value="condo">Condo</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="p-2 border rounded-md">
                            {selectedLead.propertyPreferences?.propertyType || 'Not specified'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  <div className="space-y-4">
                    {selectedLead.callHistory && selectedLead.callHistory.length > 0 ? (
                      selectedLead.callHistory.map((call, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">{formatDate(call.date)}</div>
                              <div className="text-sm text-gray-500">{call.duration} minutes</div>
                            </div>
                          </div>
                          {call.points && call.points.length > 0 && (
                            <div className="mt-2">
                              <div className="font-medium mb-1">Key Points:</div>
                              <ul className="list-disc pl-4 space-y-1">
                                {call.points.map((point, pointIndex) => (
                                  <li key={pointIndex}>{point.text}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        No call history available
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="mt-4">
                  <div className="space-y-4">
                    {selectedLead.tasks && selectedLead.tasks.length > 0 ? (
                      selectedLead.tasks.map((task, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{task.title}</div>
                              <div className="text-sm text-gray-500">{task.description}</div>
                            </div>
                            <Badge variant={task.status === 'completed' ? 'default' : 'outline'}>
                              {task.status}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            Due: {formatDate(task.date)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        No tasks available
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-4">
                  <div className="space-y-4">
                    {isEditing ? (
                      <Textarea
                        placeholder="Enter notes about the lead"
                        className="min-h-[200px]"
                        value={selectedLead.notes}
                        onChange={(e) => setSelectedLead({
                          ...selectedLead,
                          notes: e.target.value
                        })}
                      />
                    ) : (
                      <div className="border rounded-lg p-4 min-h-[200px] whitespace-pre-wrap">
                        {selectedLead.notes || 'No notes available'}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

