"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Send, Trash2, Star, StarOff, Archive, ArchiveRestore } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Email {
  id: string
  from: string
  subject: string
  body: string
  date: string
  isRead: boolean
  isStarred: boolean
  isArchived: boolean
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export default function InboxPage() {
  const { toast } = useToast()
  const [emails, setEmails] = useState<Email[]>([])
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [composeEmail, setComposeEmail] = useState({
    to: "",
    subject: "",
    body: ""
  })
  const [isComposing, setIsComposing] = useState(false)

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Here you would typically send the email through your email service
      toast({
        title: "Success",
        description: "Email sent successfully",
      })

      setIsComposing(false)
      setComposeEmail({
        to: "",
        subject: "",
        body: ""
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send email",
      })
    }
  }

  const handleDeleteEmail = (emailId: string) => {
    try {
      const updatedEmails = emails.filter(email => email.id !== emailId)
      setEmails(updatedEmails)
      localStorage.setItem('emails', JSON.stringify(updatedEmails))
      
      toast({
        title: "Success",
        description: "Email deleted successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete email",
      })
    }
  }

  const handleToggleStar = (emailId: string) => {
    try {
      const updatedEmails = emails.map(email =>
        email.id === emailId
          ? { ...email, isStarred: !email.isStarred }
          : email
      )
      setEmails(updatedEmails)
      localStorage.setItem('emails', JSON.stringify(updatedEmails))
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update email",
      })
    }
  }

  const handleToggleArchive = (emailId: string) => {
    try {
      const updatedEmails = emails.map(email =>
        email.id === emailId
          ? { ...email, isArchived: !email.isArchived }
          : email
      )
      setEmails(updatedEmails)
      localStorage.setItem('emails', JSON.stringify(updatedEmails))
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update email",
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Inbox</h1>
          <Button
            onClick={() => setIsComposing(true)}
            className="bg-red-500 hover:bg-red-600"
          >
            <Mail className="h-4 w-4 mr-2" />
            Compose
          </Button>
        </div>

        <Tabs defaultValue="inbox" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value="inbox">
            <Card>
              <CardHeader>
                <CardTitle>Inbox</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emails.filter(email => !email.isArchived).length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No emails found</p>
                  ) : (
                    emails
                      .filter(email => !email.isArchived)
                      .map((email) => (
                        <div
                          key={email.id}
                          className={`p-4 rounded-lg border ${
                            selectedEmail?.id === email.id
                              ? 'border-red-500 bg-red-500/10'
                              : 'border-gray-700'
                          } ${!email.isRead ? 'bg-gray-800' : ''}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleStar(email.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  {email.isStarred ? (
                                    <Star className="h-4 w-4 text-yellow-500" />
                                  ) : (
                                    <StarOff className="h-4 w-4 text-gray-500" />
                                  )}
                                </Button>
                                <h3 className="font-medium">{email.subject}</h3>
                                <span className="text-sm text-gray-500">from {email.from}</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{email.date}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleArchive(email.id)}
                                className="h-8 w-8 p-0"
                              >
                                {email.isArchived ? (
                                  <ArchiveRestore className="h-4 w-4" />
                                ) : (
                                  <Archive className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEmail(email.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
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
          </TabsContent>

          <TabsContent value="starred">
            <Card>
              <CardHeader>
                <CardTitle>Starred</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emails.filter(email => email.isStarred && !email.isArchived).length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No starred emails</p>
                  ) : (
                    emails
                      .filter(email => email.isStarred && !email.isArchived)
                      .map((email) => (
                        <div
                          key={email.id}
                          className={`p-4 rounded-lg border ${
                            selectedEmail?.id === email.id
                              ? 'border-red-500 bg-red-500/10'
                              : 'border-gray-700'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{email.subject}</h3>
                              <p className="text-sm text-gray-500">from {email.from}</p>
                              <p className="text-sm text-gray-500 mt-1">{email.date}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleStar(email.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Star className="h-4 w-4 text-yellow-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEmail(email.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
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
          </TabsContent>

          <TabsContent value="archived">
            <Card>
              <CardHeader>
                <CardTitle>Archived</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emails.filter(email => email.isArchived).length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No archived emails</p>
                  ) : (
                    emails
                      .filter(email => email.isArchived)
                      .map((email) => (
                        <div
                          key={email.id}
                          className={`p-4 rounded-lg border ${
                            selectedEmail?.id === email.id
                              ? 'border-red-500 bg-red-500/10'
                              : 'border-gray-700'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{email.subject}</h3>
                              <p className="text-sm text-gray-500">from {email.from}</p>
                              <p className="text-sm text-gray-500 mt-1">{email.date}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleArchive(email.id)}
                                className="h-8 w-8 p-0"
                              >
                                <ArchiveRestore className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEmail(email.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
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
          </TabsContent>
        </Tabs>

        {isComposing && (
          <Card className="fixed bottom-4 right-4 w-96">
            <CardHeader>
              <CardTitle>Compose Email</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    value={composeEmail.to}
                    onChange={(e) => setComposeEmail({ ...composeEmail, to: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={composeEmail.subject}
                    onChange={(e) => setComposeEmail({ ...composeEmail, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body">Message</Label>
                  <Textarea
                    id="body"
                    value={composeEmail.body}
                    onChange={(e) => setComposeEmail({ ...composeEmail, body: e.target.value })}
                    required
                    rows={5}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsComposing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-red-500 hover:bg-red-600">
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
} 