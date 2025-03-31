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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
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

const leadConversions = [
  { value: 'initial_contact', label: 'Initial Contact' },
  { value: 'property_viewing', label: 'Property Viewing' },
  { value: 'offer_made', label: 'Offer Made' },
  { value: 'offer_accepted', label: 'Offer Accepted' },
  { value: 'deal_closed', label: 'Deal Closed' },
  { value: 'deal_lost', label: 'Deal Lost' },
];

const languages = [
  { value: 'english', label: 'English' },
  { value: 'french', label: 'French' },
  { value: 'mandarin', label: 'Mandarin' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'punjabi', label: 'Punjabi' },
];

const religions = [
  { value: 'christianity', label: 'Christianity' },
  { value: 'islam', label: 'Islam' },
  { value: 'hinduism', label: 'Hinduism' },
  { value: 'sikhism', label: 'Sikhism' },
  { value: 'buddhism', label: 'Buddhism' },
  { value: 'jainism', label: 'Jainism' },
  { value: 'other', label: 'Other' },
];

interface LeadFilters {
  status: string;
  type: string;
  assignedTo: string;
  search: string;
  conversion: string;
  ageRange: {
    min: number;
    max: number;
  };
  language: string;
  gender: string;
  religion: string;
  realtorAssociation: string;
  salesRange: {
    min: number;
    max: number;
  };
  lastClosedDateRange: {
    start: string;
    end: string;
  };
}

interface Conversion {
  value: string;
  label: string;
}

interface Language {
  value: string;
  label: string;
}

interface Religion {
  value: string;
  label: string;
}

interface LeadStatus {
  [key: string]: string;
}

interface LeadType {
  [key: string]: string;
}

interface LeadSource {
  [key: string]: string;
}

interface CallPoint {
  text: string;
  timestamp: string;
}

// Add type definitions for color mappings
type LeadStatusColors = {
  [K in Lead['leadStatus']]: string;
} & {
  [key: string]: string;
};

type LeadTypeColors = {
  [K in Lead['leadType']]: string;
} & {
  [key: string]: string;
};

type LeadSourceColors = {
  [K in Lead['leadSource']]: string;
} & {
  [key: string]: string;
};

const statusColors: LeadStatusColors = {
  cold: "bg-gray-100 text-gray-800",
  warm: "bg-yellow-100 text-yellow-800",
  hot: "bg-red-100 text-red-800",
  mild: "bg-blue-100 text-blue-800",
};

const typeColors: LeadTypeColors = {
  'Pre construction': "bg-purple-100 text-purple-800",
  resale: "bg-indigo-100 text-indigo-800",
  seller: "bg-pink-100 text-pink-800",
  buyer: "bg-orange-100 text-orange-800"
};

const sourceColors: LeadSourceColors = {
  website: "bg-green-100 text-green-800",
  'google ads': "bg-blue-100 text-blue-800",
  meta: "bg-purple-100 text-purple-800",
  refferal: "bg-yellow-100 text-yellow-800",
  linkedin: "bg-sky-100 text-sky-800",
  youtube: "bg-red-100 text-red-800"
};

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
  const [filters, setFilters] = useState<LeadFilters>({
    status: "",
    type: "",
    assignedTo: "",
    search: "",
    conversion: "",
    ageRange: {
      min: 0,
      max: 100,
    },
    language: "",
    gender: "",
    religion: "",
    realtorAssociation: "",
    salesRange: {
      min: 0,
      max: 100,
    },
    lastClosedDateRange: {
      start: "",
      end: "",
    },
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const getLeadStatusColor = (status: Lead['leadStatus'] | undefined) => {
    return status ? statusColors[status] : statusColors.cold;
  }

  const getLeadTypeColor = (type: Lead['leadType'] | undefined) => {
    return type ? typeColors[type] : "bg-gray-100 text-gray-800";
  }

  const getSourceColor = (source: Lead['leadSource'] | undefined) => {
    return source ? sourceColors[source] : "bg-gray-100 text-gray-800";
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
          call.points?.some((point: { text: string }) =>
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
    if (filters.status) {
      filteredLeads = filteredLeads.filter(lead => lead.leadStatus === filters.status)
    }
    if (filters.type) {
      filteredLeads = filteredLeads.filter(lead => lead.leadType === filters.type)
    }
    if (filters.assignedTo) {
      filteredLeads = filteredLeads.filter(lead => lead.assignedTo === filters.assignedTo)
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>Lead Management</CardTitle>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button
              variant={showNoCallsOnly ? "default" : "outline"}
              onClick={() => setShowNoCallsOnly(!showNoCallsOnly)}
              className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200 flex-1 md:flex-none"
            >
              <Phone className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">No Calls</span>
              ({leads.filter(l => !l.callHistory || l.callHistory.length === 0).length})
            </Button>
            <Button
              variant={showWebsiteEnquiriesOnly ? "default" : "outline"}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border-blue-200 flex-1 md:flex-none"
              onClick={() => setShowWebsiteEnquiriesOnly(!showWebsiteEnquiriesOnly)}
            >
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Website Enquiries</span>
              ({leads.filter(l => l.leadSource === 'website').length})
            </Button>
            <Button 
              onClick={() => setIsAddLeadOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white flex-1 md:flex-none"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Lead</span>
            </Button>
            <div className="relative flex-1 md:flex-none">
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
                className="border-green-600 text-green-600 hover:bg-green-50 w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Import Leads</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Temperature filters */}
        <div className="mt-4 border-b overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            <Button
              variant={selectedTemperature === "all" ? "default" : "ghost"}
              onClick={() => setSelectedTemperature("all")}
              className="relative rounded-none border-b-2 border-transparent px-4 whitespace-nowrap"
            >
              All Leads ({getFilteredLeads().length})
            </Button>
            <Button
              variant={selectedTemperature === "hot" ? "default" : "ghost"}
              onClick={() => setSelectedTemperature("hot")}
              className="relative rounded-none border-b-2 border-transparent px-4 text-red-600 hover:text-red-700 whitespace-nowrap"
            >
              Hot Leads ({getLeadsByTemperature("hot").length})
            </Button>
            <Button
              variant={selectedTemperature === "warm" ? "default" : "ghost"}
              onClick={() => setSelectedTemperature("warm")}
              className="relative rounded-none border-b-2 border-transparent px-4 text-yellow-600 hover:text-yellow-700 whitespace-nowrap"
            >
              Warm Leads ({getLeadsByTemperature("warm").length})
            </Button>
            <Button
              variant={selectedTemperature === "cold" ? "default" : "ghost"}
              onClick={() => setSelectedTemperature("cold")}
              className="relative rounded-none border-b-2 border-transparent px-4 text-blue-600 hover:text-blue-700 whitespace-nowrap"
            >
              Cold Leads ({getLeadsByTemperature("cold").length})
            </Button>
            <Button
              variant={selectedTemperature === "mild" ? "default" : "ghost"}
              onClick={() => setSelectedTemperature("mild")}
              className="relative rounded-none border-b-2 border-transparent px-4 text-green-600 hover:text-green-700 whitespace-nowrap"
            >
              Mild Leads ({getLeadsByTemperature("mild").length})
            </Button>
          </div>
        </div>

        {/* Location filters */}
        <div className="mt-4 border-b overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
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

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Filter Leads</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Lead Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters({ ...filters, status: value === "all" ? "" : value })}
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
                    value={filters.type}
                    onValueChange={(value) => setFilters({ ...filters, type: value === "all" ? "" : value })}
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
                        status: "",
                        type: "",
                        assignedTo: "",
                        search: "",
                        conversion: "",
                        ageRange: {
                          min: 0,
                          max: 100,
                        },
                        language: "",
                        gender: "",
                        religion: "",
                        realtorAssociation: "",
                        salesRange: {
                          min: 0,
                          max: 100,
                        },
                        lastClosedDateRange: {
                          start: "",
                          end: "",
                        },
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

        {/* Additional filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="space-y-2">
            <Label>Lead Conversion</Label>
            <Select
              value={filters.conversion}
              onValueChange={(value) => setFilters({ ...filters, conversion: value === "all" ? "" : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All conversions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {leadConversions.map((conversion) => (
                  <SelectItem key={conversion.value} value={conversion.value}>
                    {conversion.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Language</Label>
            <Select
              value={filters.language}
              onValueChange={(value) => setFilters({ ...filters, language: value === "all" ? "" : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <Select
              value={filters.gender}
              onValueChange={(value) => setFilters({ ...filters, gender: value === "all" ? "" : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Religion</Label>
            <Select
              value={filters.religion}
              onValueChange={(value) => setFilters({ ...filters, religion: value === "all" ? "" : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All religions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {religions.map((religion) => (
                  <SelectItem key={religion.value} value={religion.value}>
                    {religion.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Age Range</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.ageRange.min}
                onChange={(e) => setFilters({
                  ...filters,
                  ageRange: { ...filters.ageRange, min: parseInt(e.target.value) }
                })}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.ageRange.max}
                onChange={(e) => setFilters({
                  ...filters,
                  ageRange: { ...filters.ageRange, max: parseInt(e.target.value) }
                })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Realtor Association</Label>
            <Input
              placeholder="Search by realtor association"
              value={filters.realtorAssociation}
              onChange={(e) => setFilters({ ...filters, realtorAssociation: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Sales Range</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min sales"
                value={filters.salesRange.min}
                onChange={(e) => setFilters({
                  ...filters,
                  salesRange: { ...filters.salesRange, min: parseInt(e.target.value) }
                })}
              />
              <Input
                type="number"
                placeholder="Max sales"
                value={filters.salesRange.max}
                onChange={(e) => setFilters({
                  ...filters,
                  salesRange: { ...filters.salesRange, max: parseInt(e.target.value) }
                })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Last Closed Date Range</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={filters.lastClosedDateRange.start}
                onChange={(e) => setFilters({
                  ...filters,
                  lastClosedDateRange: { ...filters.lastClosedDateRange, start: e.target.value }
                })}
              />
              <Input
                type="date"
                value={filters.lastClosedDateRange.end}
                onChange={(e) => setFilters({
                  ...filters,
                  lastClosedDateRange: { ...filters.lastClosedDateRange, end: e.target.value }
                })}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Name</TableHead>
                <TableHead className="min-w-[150px]">Contact</TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
                <TableHead className="min-w-[100px]">Type</TableHead>
                <TableHead className="min-w-[100px]">Source</TableHead>
                <TableHead className="min-w-[100px]">Location</TableHead>
                <TableHead className="min-w-[150px]">Property</TableHead>
                <TableHead className="min-w-[100px]">Created</TableHead>
                <TableHead className="min-w-[120px]">Assigned To</TableHead>
                <TableHead className="min-w-[150px]">Actions</TableHead>
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
                          onClick={() => {
                            if (lead._id && lead.phone) {
                              handleCall(lead._id, lead.phone);
                            }
                          }}
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
        </div>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-4">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-semibold">
                {selectedLead?.name}
              </DialogTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Edit
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
                    Save
                  </Button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className={getLeadStatusColor(selectedLead?.leadStatus || 'cold')}>
                {(selectedLead?.leadStatus || 'cold').charAt(0).toUpperCase() + (selectedLead?.leadStatus || 'cold').slice(1)}
              </Badge>
              <Badge className={getLeadTypeColor(selectedLead?.leadType || 'buyer')}>
                {(selectedLead?.leadType || 'buyer').charAt(0).toUpperCase() + (selectedLead?.leadType || 'buyer').slice(1)}
              </Badge>
              <Badge className={getSourceColor(selectedLead?.leadSource as 'meta' | 'website' | 'google ads' | 'refferal' | 'linkedin' | 'youtube')}>
                {(selectedLead?.leadSource || 'Unknown').charAt(0).toUpperCase() + (selectedLead?.leadSource || 'Unknown').slice(1)}
              </Badge>
            </div>
          </DialogHeader>

          {selectedLead && (
            <div className="mt-4">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full justify-start border-b">
                  <TabsTrigger value="details" className="px-4">Details</TabsTrigger>
                  <TabsTrigger value="preferences" className="px-4">Preferences</TabsTrigger>
                  <TabsTrigger value="history" className="px-4">History</TabsTrigger>
                  <TabsTrigger value="tasks" className="px-4">Tasks</TabsTrigger>
                  <TabsTrigger value="notes" className="px-4">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Contact Information */}
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium">Contact Information</h3>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label className="text-sm text-gray-500">Email</Label>
                          {isEditing ? (
                            <Input
                              value={selectedLead.email}
                              onChange={(e) => setSelectedLead({
                                ...selectedLead,
                                email: e.target.value
                              })}
                              className="h-8"
                            />
                          ) : (
                            <div className="text-sm">{selectedLead.email}</div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-gray-500">Phone</Label>
                          {isEditing ? (
                            <Input
                              value={selectedLead.phone}
                              onChange={(e) => setSelectedLead({
                                ...selectedLead,
                                phone: e.target.value
                              })}
                              className="h-8"
                            />
                          ) : (
                            <div className="text-sm">{selectedLead.phone}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Lead Status */}
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium">Lead Status</h3>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label className="text-sm text-gray-500">Lead Response</Label>
                          {isEditing ? (
                            <Select
                              value={selectedLead.leadResponse}
                              onValueChange={(value) => setSelectedLead({
                                ...selectedLead,
                                leadResponse: value as 'active' | 'inactive' | 'not answering' | 'not actively answering' | 'always responding'
                              })}
                            >
                              <SelectTrigger className="h-8">
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
                            <div className="text-sm">{selectedLead.leadResponse || 'Not specified'}</div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-gray-500">Lead Conversion</Label>
                          {isEditing ? (
                            <Select
                              value={selectedLead.conversion}
                              onValueChange={(value) => setSelectedLead({
                                ...selectedLead,
                                conversion: value
                              })}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {leadConversions.map((conversion) => (
                                  <SelectItem key={conversion.value} value={conversion.value}>
                                    {conversion.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="text-sm">{selectedLead.conversion || 'Not specified'}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Demographics */}
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium">Demographics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-sm text-gray-500">Age</Label>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={selectedLead.age}
                              onChange={(e) => setSelectedLead({
                                ...selectedLead,
                                age: parseInt(e.target.value)
                              })}
                              className="h-8"
                            />
                          ) : (
                            <div className="text-sm">{selectedLead.age || 'Not specified'}</div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-gray-500">Gender</Label>
                          {isEditing ? (
                            <Select
                              value={selectedLead.gender}
                              onValueChange={(value) => setSelectedLead({
                                ...selectedLead,
                                gender: value
                              })}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="text-sm">{selectedLead.gender || 'Not specified'}</div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-gray-500">Language</Label>
                          {isEditing ? (
                            <Select
                              value={selectedLead.language}
                              onValueChange={(value) => setSelectedLead({
                                ...selectedLead,
                                language: value
                              })}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {languages.map((lang) => (
                                  <SelectItem key={lang.value} value={lang.value}>
                                    {lang.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="text-sm">{selectedLead.language || 'Not specified'}</div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-gray-500">Religion</Label>
                          {isEditing ? (
                            <Select
                              value={selectedLead.religion}
                              onValueChange={(value) => setSelectedLead({
                                ...selectedLead,
                                religion: value
                              })}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {religions.map((religion) => (
                                  <SelectItem key={religion.value} value={religion.value}>
                                    {religion.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="text-sm">{selectedLead.religion || 'Not specified'}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sales Information */}
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium">Sales Information</h3>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label className="text-sm text-gray-500">Realtor Association</Label>
                          {isEditing ? (
                            <Input
                              value={selectedLead.realtorAssociation}
                              onChange={(e) => setSelectedLead({
                                ...selectedLead,
                                realtorAssociation: e.target.value
                              })}
                              className="h-8"
                            />
                          ) : (
                            <div className="text-sm">{selectedLead.realtorAssociation || 'Not specified'}</div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-gray-500">Closed Sales</Label>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={selectedLead.salesHistory?.closedSales}
                              onChange={(e) => setSelectedLead({
                                ...selectedLead,
                                salesHistory: {
                                  ...selectedLead.salesHistory,
                                  closedSales: parseInt(e.target.value)
                                }
                              })}
                              className="h-8"
                            />
                          ) : (
                            <div className="text-sm">{selectedLead.salesHistory?.closedSales || '0'}</div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-gray-500">Last Closed Date</Label>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={selectedLead.salesHistory?.lastClosedDate?.split('T')[0]}
                              onChange={(e) => setSelectedLead({
                                ...selectedLead,
                                salesHistory: {
                                  ...selectedLead.salesHistory,
                                  lastClosedDate: new Date(e.target.value).toISOString()
                                }
                              })}
                              className="h-8"
                            />
                          ) : (
                            <div className="text-sm">
                              {selectedLead.salesHistory?.lastClosedDate ? 
                                formatDate(selectedLead.salesHistory.lastClosedDate) : 
                                'Not specified'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Assignment & Property */}
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
                      <h3 className="font-medium">Assignment & Property</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-sm text-gray-500">Assigned To</Label>
                          {isEditing ? (
                            <Select
                              value={selectedLead.assignedTo}
                              onValueChange={(value) => setSelectedLead({
                                ...selectedLead,
                                assignedTo: value
                              })}
                            >
                              <SelectTrigger className="h-8">
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
                            <div className="text-sm">
                              {selectedLead.assignedTo ? getUserName(selectedLead.assignedTo) : 'Unassigned'}
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-gray-500">Location</Label>
                          {isEditing ? (
                            <Select
                              value={selectedLead.location}
                              onValueChange={(value) => setSelectedLead({
                                ...selectedLead,
                                location: value
                              })}
                            >
                              <SelectTrigger className="h-8">
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
                            <div className="text-sm">{selectedLead.location || 'Not specified'}</div>
                          )}
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <Label className="text-sm text-gray-500">Property</Label>
                          {isEditing ? (
                            <Input
                              value={selectedLead.property}
                              onChange={(e) => setSelectedLead({
                                ...selectedLead,
                                property: e.target.value
                              })}
                              className="h-8"
                            />
                          ) : (
                            <div className="text-sm">{selectedLead.property || 'Not specified'}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
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
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                            <span>{new Date(call.date).toLocaleString()}</span>
                            <span>{call.duration} minutes</span>
                          </div>
                          {call.points?.map((point: any, pointIndex: number) => (
                            <div key={pointIndex} className="text-sm">
                              {point.text}
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-4">
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

