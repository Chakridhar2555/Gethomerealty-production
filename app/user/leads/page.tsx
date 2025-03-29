"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Edit2, Trash2, Phone, Mail, MapPin, Eye, Filter, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DashboardLayout } from "@/components/layout";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  leadStatus: string;
  leadType: 'Pre construction' | 'resale' | 'seller' | 'buyer';
  source: string;
  notes: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  leadResponse: string;
  clientType: string;
}

type LeadFormData = Omit<Lead, '_id' | 'createdAt' | 'updatedAt'>;

const leadStatuses = [
  { value: "cold", label: "Cold" },
  { value: "warm", label: "Warm" },
  { value: "hot", label: "Hot" },
  { value: "mild", label: "Mild" },
];

const leadResponses = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "not answering", label: "Not Answering" },
  { value: "not actively answering", label: "Not Actively Answering" },
  { value: "always responding", label: "Always Responding" },
];

const leadSources = [
  { value: "google ads", label: "Google Ads" },
  { value: "meta", label: "Meta" },
  { value: "refferal", label: "Referral" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
];

const leadTypes = [
  { value: "Pre construction", label: "Pre Construction" },
  { value: "resale", label: "Resale" },
  { value: "seller", label: "Seller" },
  { value: "buyer", label: "Buyer" },
];

const clientTypes = [
  { value: "Investor", label: "Investor" },
  { value: "custom buyer", label: "Custom Buyer" },
  { value: "first home buyer", label: "First Home Buyer" },
  { value: "seasonal investor", label: "Seasonal Investor" },
  { value: "commercial buyer", label: "Commercial Buyer" },
];

const defaultLead: LeadFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  leadStatus: "cold",
  leadType: "buyer",
  source: "",
  notes: "",
  assignedTo: "",
  leadResponse: "",
  clientType: "",
};

// Add motion table row
const MotionTableRow = motion(TableRow);

export default function LeadsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isNewLeadDialogOpen, setIsNewLeadDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState(defaultLead);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    leadStatus: "",
    leadType: "",
    leadSource: "",
    leadResponse: "",
    clientType: "",
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      // Get current user from localStorage
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }
      const user = JSON.parse(userData);

      const response = await fetch(`/api/leads?assignedTo=${user._id}`);
      const data = await response.json();
      
      // Only set leads that are assigned to the current user
      setLeads(data.filter((lead: Lead) => lead.assignedTo === user._id));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch leads",
      });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = "/api/leads";
      const method = editingLead ? "PUT" : "POST";
      const body = editingLead
        ? { _id: editingLead._id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: `Lead ${editingLead ? "updated" : "created"} successfully`,
      });

      setIsNewLeadDialogOpen(false);
      setEditingLead(null);
      setFormData(defaultLead);
      fetchLeads();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${editingLead ? "update" : "create"} lead`,
      });
    }
  };

  const handleDelete = async (lead: Lead) => {
    try {
      const response = await fetch(`/api/leads/${lead._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Lead deleted successfully",
      });
      
      fetchLeads();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete lead",
      });
    } finally {
      setLeadToDelete(null);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "text-gray-400 bg-gray-400/10";
    
    switch (status.toLowerCase()) {
      case "cold":
        return "text-blue-400 bg-blue-400/10";
      case "warm":
        return "text-yellow-400 bg-yellow-400/10";
      case "hot":
        return "text-red-400 bg-red-400/10";
      case "mild":
        return "text-green-400 bg-green-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const getLeadTypeColor = (type: string | undefined) => {
    switch (type) {
      case "Pre construction":
        return "text-purple-500 bg-purple-500/10";
      case "resale":
        return "text-indigo-500 bg-indigo-500/10";
      case "seller":
        return "text-pink-500 bg-pink-500/10";
      case "buyer":
      default:
        return "text-orange-500 bg-orange-500/10";
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchQuery === "" || 
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.address?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters = 
      (filters.leadStatus === "" || lead.leadStatus === filters.leadStatus) &&
      (filters.leadType === "" || lead.leadType === filters.leadType) &&
      (filters.leadSource === "" || lead.source === filters.leadSource) &&
      (filters.leadResponse === "" || lead.leadResponse === filters.leadResponse) &&
      (filters.clientType === "" || lead.clientType === filters.clientType);

    return matchesSearch && matchesFilters;
  });

  if (isLoading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-800 rounded mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <Card>
          <CardHeader>
            <CardTitle>Lead Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No leads found</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 