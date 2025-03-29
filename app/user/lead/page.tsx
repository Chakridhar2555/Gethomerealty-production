"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus, Edit2, Trash2, Phone, Mail, MapPin, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface Lead {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  leadStatus: string
  leadType: string
  source: string
  notes: string
  assignedTo: string
  createdAt: string
  updatedAt: string
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export default function LeadsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      // Get current user from localStorage
      const userData = localStorage.getItem('user')
      if (!userData) {
        router.push('/login')
        return
      }
      const user = JSON.parse(userData)

      const response = await fetch(`/api/leads?assignedTo=${user._id}`)
      const data = await response.json()
      
      // Only set leads that are assigned to the current user
      setLeads(data.filter((lead: Lead) => lead.assignedTo === user._id))
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching leads:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch leads",
      })
      setIsLoading(false)
    }
  }

  const handleDelete = async (leadId: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error()

      toast({
        title: "Success",
        description: "Lead deleted successfully",
      })
      
      fetchLeads()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete lead",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "cold":
        return "text-blue-400 bg-blue-400/10"
      case "warm":
        return "text-yellow-400 bg-yellow-400/10"
      case "hot":
        return "text-red-400 bg-red-400/10"
      case "mild":
        return "text-green-400 bg-green-400/10"
      default:
        return "text-gray-400 bg-gray-400/10"
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 animate-pulse">
          <div className="h-8 w-48 bg-gray-800 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-100">Leads</h1>
          <Button
            onClick={() => router.push("/user/lead/new")}
            className="bg-red-500 hover:bg-red-600"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Lead
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">All Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-400">Name</TableHead>
                  <TableHead className="text-gray-400">Contact</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Type</TableHead>
                  <TableHead className="text-gray-400">Source</TableHead>
                  <TableHead className="text-gray-400">Created</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-gray-400 py-4"
                    >
                      No leads found
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => (
                    <TableRow key={lead._id} className="border-gray-700">
                      <TableCell className="font-medium text-gray-100">
                        <Button
                          variant="link"
                          className="p-0 h-auto font-medium text-gray-100 hover:text-gray-300"
                          onClick={() => router.push(`/user/lead/${lead._id}`)}
                        >
                          {lead.name}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-gray-300">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {lead.phone}
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            {lead.email}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            {lead.address}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.leadStatus)}`}>
                          {lead.leadStatus.charAt(0).toUpperCase() + lead.leadStatus.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{lead.leadType}</TableCell>
                      <TableCell className="text-gray-300">{lead.source}</TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/user/lead/${lead._id}`)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4 text-gray-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/user/lead/${lead._id}/edit`)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4 text-gray-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(lead._id)}
                            className="h-8 w-8 p-0 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 