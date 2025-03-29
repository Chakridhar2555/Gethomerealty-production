"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Save, Trash2 } from "lucide-react"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: 'welcome' | 'follow-up' | 'showing' | 'offer' | 'custom'
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export default function EmailTemplatesPage() {
  const { toast } = useToast()
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
    type: "custom" as EmailTemplate['type']
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (isEditing && selectedTemplate) {
        // Update existing template
        const updatedTemplates = templates.map(template =>
          template.id === selectedTemplate.id ? { ...formData, id: template.id } : template
        )
        setTemplates(updatedTemplates)
        localStorage.setItem('emailTemplates', JSON.stringify(updatedTemplates))
      } else {
        // Create new template
        const newTemplate = {
          ...formData,
          id: Date.now().toString()
        }
        const updatedTemplates = [...templates, newTemplate]
        setTemplates(updatedTemplates)
        localStorage.setItem('emailTemplates', JSON.stringify(updatedTemplates))
      }

      toast({
        title: "Success",
        description: `Template ${isEditing ? 'updated' : 'created'} successfully`,
      })

      setIsEditing(false)
      setSelectedTemplate(null)
      setFormData({
        name: "",
        subject: "",
        body: "",
        type: "custom"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} template`,
      })
    }
  }

  const handleDelete = (templateId: string) => {
    try {
      const updatedTemplates = templates.filter(template => template.id !== templateId)
      setTemplates(updatedTemplates)
      localStorage.setItem('emailTemplates', JSON.stringify(updatedTemplates))
      
      toast({
        title: "Success",
        description: "Template deleted successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete template",
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Email Templates</h1>
          <Button
            onClick={() => {
              setIsEditing(false)
              setSelectedTemplate(null)
              setFormData({
                name: "",
                subject: "",
                body: "",
                type: "custom"
              })
            }}
            className="bg-red-500 hover:bg-red-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Template List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No templates found</p>
                ) : (
                  templates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 rounded-lg border ${
                        selectedTemplate?.id === template.id
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-gray-500">{template.subject}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTemplate(template)
                              setIsEditing(true)
                              setFormData({
                                name: template.name,
                                subject: template.subject,
                                body: template.body,
                                type: template.type
                              })
                            }}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(template.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {isEditing ? "Edit Template" : "Create Template"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Template Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as EmailTemplate['type'] })}
                    className="w-full p-2 rounded-md border border-gray-700 bg-gray-800"
                  >
                    <option value="welcome">Welcome Email</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="showing">Showing Confirmation</option>
                    <option value="offer">Offer Response</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body">Email Body</Label>
                  <Textarea
                    id="body"
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    required
                    rows={10}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {isEditing ? "Update Template" : "Create Template"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
} 