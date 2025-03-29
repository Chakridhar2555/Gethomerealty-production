'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Save, Wand2, Image as ImageIcon, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'birthday' | 'wedding' | 'seasonal' | 'promotional' | 'referral';
  variables: string[];
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: 'birthday',
    name: 'Birthday Wishes',
    subject: 'Happy Birthday, {name}! 🎉',
    content: `Dear {name},

Wishing you a fantastic birthday filled with joy and celebration! As a valued client, we want to make your special day even more memorable.

{custom_message}

Best wishes,
{agent_name}
{company_name}`,
    type: 'birthday',
    variables: ['name', 'custom_message', 'agent_name', 'company_name']
  },
  {
    id: 'wedding',
    name: 'Wedding Greetings',
    subject: 'Congratulations on Your Wedding, {name}! 💍',
    content: `Dear {name},

Heartfelt congratulations on your wedding! May your new journey be filled with love, happiness, and wonderful memories.

{custom_message}

Best wishes,
{agent_name}
{company_name}`,
    type: 'wedding',
    variables: ['name', 'custom_message', 'agent_name', 'company_name']
  },
  {
    id: 'seasonal-christmas',
    name: 'Christmas Wishes',
    subject: 'Season\'s Greetings! 🎄',
    content: `Dear {name},

Wishing you and your loved ones a joyful holiday season filled with warmth and happiness.

{custom_message}

Happy Holidays!
{agent_name}
{company_name}`,
    type: 'seasonal',
    variables: ['name', 'custom_message', 'agent_name', 'company_name']
  },
  {
    id: 'promotional',
    name: 'Exclusive Offer',
    subject: 'Special Offer Just for You! 🎁',
    content: `Dear {name},

As a valued client, we're excited to offer you an exclusive discount:

{offer_details}

Use code: {promo_code}
Valid until: {expiry_date}

{custom_message}

Best regards,
{agent_name}
{company_name}`,
    type: 'promotional',
    variables: ['name', 'offer_details', 'promo_code', 'expiry_date', 'custom_message', 'agent_name', 'company_name']
  },
  {
    id: 'referral',
    name: 'Referral Program',
    subject: 'Refer a Friend and Earn Rewards! 🤝',
    content: `Dear {name},

Thank you for being a valued client! We'd love to have more amazing clients like you.

Share your unique referral code with friends and family:
{referral_code}

{referral_benefits}

{custom_message}

Best regards,
{agent_name}
{company_name}`,
    type: 'referral',
    variables: ['name', 'referral_code', 'referral_benefits', 'custom_message', 'agent_name', 'company_name']
  }
];

export function EmailTemplates() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      // Initialize preview data with empty values for all variables
      const initialData = template.variables.reduce((acc, variable) => ({
        ...acc,
        [variable]: ''
      }), {});
      setPreviewData(initialData);
    }
  };

  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      // Here you would typically make an API call to save the template
      const updatedTemplates = templates.map(t =>
        t.id === selectedTemplate.id ? selectedTemplate : t
      );
      setTemplates(updatedTemplates);
      
      toast({
        title: "Success",
        description: "Template saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save template",
      });
    }
  };

  const handleGenerateAI = async () => {
    if (!selectedTemplate) return;
    
    setIsGeneratingAI(true);
    try {
      // Here you would typically make an API call to your AI service
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiGeneratedContent = `Dear {name},

I hope this email finds you well! As your dedicated real estate agent, I wanted to reach out with a personalized message.

{custom_message}

Looking forward to continuing our journey together!

Best regards,
{agent_name}
{company_name}`;

      setSelectedTemplate({
        ...selectedTemplate,
        content: aiGeneratedContent
      });

      toast({
        title: "Success",
        description: "AI-generated content ready",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate AI content",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedTemplate) return;

    try {
      // Here you would typically make an API call to send the email
      // Replace variables in the template with actual values
      const processedContent = selectedTemplate.variables.reduce(
        (content, variable) => content.replace(`{${variable}}`, previewData[variable] || `{${variable}}`),
        selectedTemplate.content
      );

      const processedSubject = selectedTemplate.variables.reduce(
        (subject, variable) => subject.replace(`{${variable}}`, previewData[variable] || `{${variable}}`),
        selectedTemplate.subject
      );

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Email sent successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send email",
      });
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-100">Email Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="templates" className="space-y-4">
          <TabsList className="bg-gray-700">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="preview">Preview & Send</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Label className="text-gray-100">Select Template</Label>
                <Select
                  value={selectedTemplate?.id}
                  onValueChange={handleTemplateSelect}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedTemplate && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-gray-100">Subject</Label>
                      <Input
                        value={selectedTemplate.subject}
                        onChange={(e) => setSelectedTemplate({
                          ...selectedTemplate,
                          subject: e.target.value
                        })}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-100">Content</Label>
                      <div className="flex gap-2 mb-2">
                        <Button
                          variant="outline"
                          onClick={handleGenerateAI}
                          disabled={isGeneratingAI}
                          className="border-blue-600 text-blue-500 hover:bg-blue-950"
                        >
                          <Wand2 className="h-4 w-4 mr-2" />
                          {isGeneratingAI ? 'Generating...' : 'Generate with AI'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('image-upload')?.click()}
                          className="border-purple-600 text-purple-500 hover:bg-purple-950"
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Add Image
                        </Button>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setSelectedImage(file);
                          }}
                        />
                      </div>
                      <Textarea
                        value={selectedTemplate.content}
                        onChange={(e) => setSelectedTemplate({
                          ...selectedTemplate,
                          content: e.target.value
                        })}
                        className="min-h-[300px] bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>

                    <Button
                      onClick={handleSaveTemplate}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Template
                    </Button>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-gray-100">Available Variables</Label>
                {selectedTemplate?.variables.map((variable) => (
                  <div key={variable} className="space-y-2">
                    <Label className="text-gray-100">{variable}</Label>
                    <Input
                      value={previewData[variable] || ''}
                      onChange={(e) => setPreviewData({
                        ...previewData,
                        [variable]: e.target.value
                      })}
                      placeholder={`Enter ${variable.replace(/_/g, ' ')}`}
                      className="bg-gray-700 border-gray-600 text-gray-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            {selectedTemplate && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">
                    {selectedTemplate.variables.reduce(
                      (subject, variable) => subject.replace(`{${variable}}`, previewData[variable] || `{${variable}}`),
                      selectedTemplate.subject
                    )}
                  </h3>
                  <div className="text-gray-100 whitespace-pre-wrap">
                    {selectedTemplate.variables.reduce(
                      (content, variable) => content.replace(`{${variable}}`, previewData[variable] || `{${variable}}`),
                      selectedTemplate.content
                    )}
                  </div>
                  {selectedImage && (
                    <div className="mt-4">
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Email attachment"
                        className="max-w-full h-auto rounded"
                      />
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleSendEmail}
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 