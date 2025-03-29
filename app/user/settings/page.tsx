"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, User, Bell, Shield, Mail } from "lucide-react"
import Link from "next/link"
import { EmailTemplates } from "@/components/email-templates"

interface Settings {
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
  timezone: string;
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<Settings>({
    emailNotifications: true,
    darkMode: true,
    language: 'English',
    timezone: 'UTC-5',
  });

  const handleToggle = (key: keyof Settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleInputChange = (key: keyof Settings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="mls">
              <Building className="h-4 w-4 mr-2" />
              MLS Integration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input type="tel" placeholder="Enter your phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input placeholder="Enter your company name" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={() => toast({
                      title: "Success",
                      description: "Profile updated successfully",
                    })}
                  >
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
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
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" placeholder="Enter your current password" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="Enter your new password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input type="password" placeholder="Confirm your new password" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={() => toast({
                      title: "Success",
                      description: "Password updated successfully",
                    })}
                  >
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mls" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>MLS Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>MLS Connection Status</Label>
                    <p className="text-sm text-gray-500">Connect your MLS account to access property listings</p>
                  </div>
                  <Button>Connect MLS</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Sync Properties</Label>
                    <p className="text-sm text-gray-500">Automatically sync new properties from MLS</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Property Updates</Label>
                    <p className="text-sm text-gray-500">Receive notifications for MLS property updates</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={() => toast({
                      title: "Success",
                      description: "MLS settings updated successfully",
                    })}
                  >
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <EmailTemplates />

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">MLS Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/user/settings/mls">
              <Button className="w-full flex items-center justify-start gap-2">
                <Building className="h-4 w-4" />
                Configure MLS Settings
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-100">Dark Mode</Label>
                <p className="text-sm text-gray-400">Toggle dark mode theme</p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={() => handleToggle('darkMode')}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label className="text-gray-100">Language</Label>
                <Input
                  value={settings.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-100">Timezone</Label>
                <Input
                  value={settings.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-red-500 hover:bg-red-600">
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
} 