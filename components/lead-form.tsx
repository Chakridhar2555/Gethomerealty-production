"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from 'uuid'
import type { Lead } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const leadStatuses = [
  { value: 'cold', label: 'Cold' },
  { value: 'warm', label: 'Warm' },
  { value: 'hot', label: 'Hot' },
  { value: 'mild', label: 'Mild' },
];

const leadTypes = [
  { value: 'Pre construction', label: 'Pre Construction' },
  { value: 'resale', label: 'Resale' },
  { value: 'seller', label: 'Seller' },
  { value: 'buyer', label: 'Buyer' },
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

interface LeadStrategy {
  lastUpdated: string;
  tasks: any[];
  notes: string;
}

interface ExtendedLead extends Lead {
  strategy?: LeadStrategy;
}

type LeadStatus = 'cold' | 'warm' | 'hot' | 'mild';
type LeadType = 'Pre construction' | 'resale' | 'seller' | 'buyer';

// Add locations constant
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

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  leadStatus: LeadStatus;
  leadType: LeadType;
  property: string;
  notes: string;
  assignedTo: string;
  location: string;
  conversion: string;
  age: number;
  language: string;
  gender: string;
  religion: string;
  realtorAssociation: string;
  salesHistory: {
    closedSales: number;
    lastClosedDate: string;
  };
}

interface LeadFormProps {
  open: boolean;
  onClose?: () => void;
  lead?: ExtendedLead;
}

export function LeadForm({ open, onClose, lead }: LeadFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<{ _id: string; name: string }[]>([])
  const [leadData, setLeadData] = useState<LeadFormData>({
    name: lead?.name ?? "",
    email: lead?.email ?? "",
    phone: lead?.phone ?? "",
    leadStatus: (lead?.leadStatus as LeadStatus) ?? "cold",
    leadType: (lead?.leadType as LeadType) ?? "buyer",
    property: lead?.property ?? "",
    notes: lead?.notes ?? "",
    assignedTo: lead?.assignedTo ?? "unassigned",
    location: lead?.location ?? "",
    conversion: lead?.conversion ?? "initial_contact",
    age: lead?.age ?? 0,
    language: lead?.language ?? "english",
    gender: lead?.gender ?? "",
    religion: lead?.religion ?? "",
    realtorAssociation: lead?.realtorAssociation ?? "",
    salesHistory: lead?.salesHistory ?? {
      closedSales: 0,
      lastClosedDate: new Date().toISOString(),
    },
  })

  useEffect(() => {
    fetchUsers()
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const newLead: Partial<ExtendedLead> = {
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        leadStatus: leadData.leadStatus,
        leadType: leadData.leadType,
        property: leadData.property,
        notes: leadData.notes,
        assignedTo: leadData.assignedTo === "unassigned" ? undefined : leadData.assignedTo,
        date: new Date().toISOString(),
        callHistory: [],
        tasks: [],
        propertyPreferences: {
          budget: {
            min: 0,
            max: 0
          },
          propertyType: [],
          bedrooms: 0,
          bathrooms: 0,
          locations: [],
          features: []
        },
        leadResponse: "inactive",
        leadSource: "google ads",
        clientType: "custom buyer",
        location: leadData.location,
        conversion: leadData.conversion,
        age: leadData.age,
        language: leadData.language,
        gender: leadData.gender,
        religion: leadData.religion,
        realtorAssociation: leadData.realtorAssociation,
        salesHistory: leadData.salesHistory,
      }

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLead),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create lead')
      }

      toast({
        title: "Success",
        description: "Lead added successfully.",
      })

      // Reset form
      setLeadData({
        name: "",
        email: "",
        phone: "",
        leadStatus: "cold",
        leadType: "buyer",
        property: "",
        notes: "",
        assignedTo: "unassigned",
        location: "",
        conversion: "initial_contact",
        age: 0,
        language: "english",
        gender: "",
        religion: "",
        realtorAssociation: "",
        salesHistory: {
          closedSales: 0,
          lastClosedDate: new Date().toISOString(),
        },
      })

      // Close dialog and refresh the leads
      onClose?.()
      window.location.reload()
    } catch (error) {
      console.error('Error creating lead:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add lead. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{lead ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              required
              value={leadData.name}
              onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={leadData.email}
                onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                required
                value={leadData.phone}
                onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={leadData.leadStatus}
                onValueChange={(value) => setLeadData({ ...leadData, leadStatus: value as LeadStatus })}
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
              <Label htmlFor="type">Lead Type</Label>
              <Select
                value={leadData.leadType}
                onValueChange={(value) => setLeadData({ ...leadData, leadType: value as LeadType })}
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
          </div>

          <div className="space-y-2">
            <Label>Assigned To</Label>
            <Select
              value={leadData.assignedTo}
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
            <Label htmlFor="property">Property</Label>
            <Input
              id="property"
              required
              value={leadData.property}
              onChange={(e) => setLeadData({ ...leadData, property: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={leadData.notes}
              onChange={(e) => setLeadData({ ...leadData, notes: e.target.value })}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Lead Conversion</Label>
              <Select
                value={leadData.conversion}
                onValueChange={(value) => setLeadData({ ...leadData, conversion: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select conversion stage" />
                </SelectTrigger>
                <SelectContent>
                  {leadConversions.map((conversion) => (
                    <SelectItem key={conversion.value} value={conversion.value}>
                      {conversion.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Realtor Association</Label>
              <Input
                value={leadData.realtorAssociation}
                onChange={(e) => setLeadData({ ...leadData, realtorAssociation: e.target.value })}
                placeholder="Enter realtor association"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Age</Label>
              <Input
                type="number"
                value={leadData.age}
                onChange={(e) => setLeadData({ ...leadData, age: parseInt(e.target.value) })}
                placeholder="Enter age"
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={leadData.gender}
                onValueChange={(value) => setLeadData({ ...leadData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={leadData.language}
                onValueChange={(value) => setLeadData({ ...leadData, language: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Religion</Label>
              <Select
                value={leadData.religion}
                onValueChange={(value) => setLeadData({ ...leadData, religion: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
                <SelectContent>
                  {religions.map((religion) => (
                    <SelectItem key={religion.value} value={religion.value}>
                      {religion.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Closed Sales</Label>
              <Input
                type="number"
                value={leadData.salesHistory.closedSales}
                onChange={(e) => setLeadData({
                  ...leadData,
                  salesHistory: {
                    ...leadData.salesHistory,
                    closedSales: parseInt(e.target.value)
                  }
                })}
                placeholder="Number of closed sales"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Closed Date</Label>
              <Input
                type="date"
                value={leadData.salesHistory.lastClosedDate.split('T')[0]}
                onChange={(e) => setLeadData({
                  ...leadData,
                  salesHistory: {
                    ...leadData.salesHistory,
                    lastClosedDate: new Date(e.target.value).toISOString()
                  }
                })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 