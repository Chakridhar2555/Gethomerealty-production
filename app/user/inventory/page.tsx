"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Home, Plus, Edit2, Trash2, Search, Eye, Share2, Heart, HeartOff, Loader2, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import type { jsPDF } from 'jspdf'
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/layout"

interface InventoryItem {
  _id: string
  address: string
  description: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  price: number
  status: string
  area: number
  yearBuilt: number
  features: string[]
  lastUpdated: string
  updatedAt: string
  mainImage?: string
  images?: string[]
  image360?: string[]
  isFavorite?: boolean
}

const defaultItem: {
  address: string;
  description: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  status: string;
  area: number;
  yearBuilt: number;
  features: string[];
  mainImage?: string;
  images?: string[];
  image360?: string[];
} = {
  address: "",
  description: "",
  propertyType: "",
  bedrooms: 0,
  bathrooms: 0,
  price: 0,
  status: "available",
  area: 0,
  yearBuilt: new Date().getFullYear(),
  features: [],
  images: [],
  image360: []
}

const propertyTypes = [
  { value: "single-family", label: "Single Family Home" },
  { value: "condo", label: "Condominium" },
  { value: "townhouse", label: "Townhouse" },
  { value: "multi-family", label: "Multi-Family" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" }
]

const propertyStatuses = [
  { value: "available", label: "Available" },
  { value: "under-contract", label: "Under Contract" },
  { value: "sold", label: "Sold" },
  { value: "off-market", label: "Off Market" }
]

// Add motion table row
const MotionTableRow = motion(TableRow)

// This ensures the jsPDF import is only loaded on the client side
let JsPDF: typeof jsPDF
if (typeof window !== 'undefined') {
  import('jspdf').then((module) => {
    JsPDF = module.default
  })
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export default function InventoryPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <Card>
          <CardHeader>
            <CardTitle>Property Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No properties in inventory</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 