"use client"

import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function MLSPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">MLS Integration</h1>
          <Button>Connect MLS</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>MLS Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">MLS integration not connected</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 