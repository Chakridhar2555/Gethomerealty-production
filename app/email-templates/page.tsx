"use client"

import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function EmailTemplatesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Email Templates</h1>
          <Button>Create Template</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Available Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No email templates found</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 