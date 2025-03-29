"use client"

import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FavoritesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Favorites</h1>
        <Card>
          <CardHeader>
            <CardTitle>Favorite Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No favorite properties yet</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 