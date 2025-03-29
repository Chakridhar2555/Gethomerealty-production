"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"

interface MLSSettings {
  mlsConnected: boolean
  autoSync: boolean
  notifications: boolean
  lastSync: string | null
  provider: string | null
  error?: string
}

export default function MLSSettingsPage() {
  const [settings, setSettings] = useState<MLSSettings>({
    mlsConnected: false,
    autoSync: false,
    notifications: false,
    lastSync: null,
    provider: null
  })
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchMLSSettings()
  }, [])

  const fetchMLSSettings = async () => {
    try {
      const response = await axios.get('/api/mls/settings')
      setSettings(response.data)
    } catch (error) {
      console.error('Error fetching MLS settings:', error)
      toast({
        title: "Error",
        description: "Failed to fetch MLS settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConnectMLS = async () => {
    setConnecting(true)
    try {
      // In a real implementation, this would open a modal or redirect to MLS OAuth
      const response = await axios.post('/api/mls/settings', {
        mlsToken: 'test-token', // Replace with actual token from MLS OAuth
        mlsProvider: 'test-provider' // Replace with actual provider
      })
      
      if (response.data.error) {
        toast({
          title: "Connection Failed",
          description: response.data.error,
          variant: "destructive"
        })
        return
      }

      toast({
        title: "Success",
        description: "Successfully connected to MLS"
      })
      fetchMLSSettings()
    } catch (error) {
      console.error('Error connecting to MLS:', error)
      toast({
        title: "Error",
        description: "Failed to connect to MLS. Please try again.",
        variant: "destructive"
      })
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnectMLS = async () => {
    try {
      await axios.delete('/api/mls/settings')
      toast({
        title: "Success",
        description: "Successfully disconnected from MLS"
      })
      fetchMLSSettings()
    } catch (error) {
      console.error('Error disconnecting from MLS:', error)
      toast({
        title: "Error",
        description: "Failed to disconnect from MLS. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleSettingChange = async (setting: 'autoSync' | 'notifications', value: boolean) => {
    try {
      await axios.patch('/api/mls/settings', {
        [setting]: value
      })
      
      setSettings(prev => ({
        ...prev,
        [setting]: value
      }))

      toast({
        title: "Success",
        description: `MLS ${setting} ${value ? 'enabled' : 'disabled'}`
      })
    } catch (error) {
      console.error(`Error updating MLS ${setting}:`, error)
      toast({
        title: "Error",
        description: `Failed to update MLS ${setting}. Please try again.`,
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">MLS Integration Settings</h1>
        
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {settings.mlsConnected ? (
                      <>
                        Connected to {settings.provider || 'MLS'}
                        {settings.lastSync && (
                          <span className="block text-xs text-gray-500">
                            Last sync: {new Date(settings.lastSync).toLocaleString()}
                          </span>
                        )}
                      </>
                    ) : (
                      'Not connected'
                    )}
                  </p>
                  {settings.error && (
                    <p className="text-sm text-red-500 mt-1">{settings.error}</p>
                  )}
                </div>
                {settings.mlsConnected ? (
                  <Button
                    variant="destructive"
                    onClick={handleDisconnectMLS}
                    disabled={connecting}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    onClick={handleConnectMLS}
                    disabled={connecting}
                  >
                    {connecting ? 'Connecting...' : 'Connect to MLS'}
                  </Button>
                )}
              </div>
            </div>

            {settings.mlsConnected && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoSync">Auto-sync Properties</Label>
                    <p className="text-sm text-gray-600">
                      Automatically sync MLS properties to your account
                    </p>
                  </div>
                  <Switch
                    id="autoSync"
                    checked={settings.autoSync}
                    onCheckedChange={(checked) => handleSettingChange('autoSync', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">MLS Updates</Label>
                    <p className="text-sm text-gray-600">
                      Receive notifications for new MLS listings and updates
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                  />
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
} 