"use client"

import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function NotificationsSettingsPage() {
  const { toast } = useToast()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Notification Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Leads</Label>
                <p className="text-sm text-gray-500">Receive notifications when new leads are assigned to you</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Property Updates</Label>
                <p className="text-sm text-gray-500">Get notified about updates to properties in your inventory</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Messages</Label>
                <p className="text-sm text-gray-500">Receive notifications for new messages from leads</p>
              </div>
              <Switch />
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={() => toast({
                  title: "Success",
                  description: "Notification settings updated successfully",
                })}
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 