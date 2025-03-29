"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Phone, Mail, MapPin, Calendar, History, FileText, MessageSquare, MoreVertical, Edit, Trash, Plus, Check, X } from "lucide-react"
import { CallHistory } from "@/components/call-history"
import { ShowingCalendar } from "@/components/showing-calendar"
import { TaskManager } from "@/components/task-manager"
import type { Lead, Task, Showing } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/layout"

interface ExtendedLead extends Lead {
  source?: string;
  address?: string;
  createdAt?: string;
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
  { value: 'north-york', label: 'North York' },
  { value: 'scarborough', label: 'Scarborough' },
  { value: 'etobicoke', label: 'Etobicoke' },
  { value: 'mississauga', label: 'Mississauga' },
  { value: 'markham', label: 'Markham' },
  { value: 'vaughan', label: 'Vaughan' },
];

const propertyTypes = [
  { value: 'detached', label: 'Detached' },
  { value: 'semi-detached', label: 'Semi-Detached' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'condo', label: 'Condo' },
  { value: 'commercial', label: 'Commercial' },
];

export default function LeadDetailsPage({ params }: { params: { leadId: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [lead, setLead] = useState<Lead | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLead()
  }, [params.leadId])

  const fetchLead = async () => {
    try {
      const response = await fetch(`/api/leads/${params.leadId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch lead')
      }
      const data = await response.json()
      setLead(data)
    } catch (error) {
      console.error('Error fetching lead:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch lead details",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold">Loading...</h1>
        </div>
      </DashboardLayout>
    )
  }

  if (!lead) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold">Lead not found</h1>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Lead Details</h1>
        <Card>
          <CardHeader>
            <CardTitle>Lead Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <p className="text-gray-500">{lead.name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-gray-500">{lead.email}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p className="text-gray-500">{lead.phone}</p>
              </div>
              <div>
                <Label>Status</Label>
                <p className="text-gray-500">{lead.leadStatus}</p>
              </div>
              <div>
                <Label>Type</Label>
                <p className="text-gray-500">{lead.leadType}</p>
              </div>
              <div>
                <Label>Source</Label>
                <p className="text-gray-500">{lead.leadSource}</p>
              </div>
              <div>
                <Label>Created Date</Label>
                <p className="text-gray-500">{formatDate(lead.date)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 