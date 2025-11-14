'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TailoredDocumentsProps {
  resume: string;
  coverLetter: string;
}

export function TailoredDocuments({ resume, coverLetter }: TailoredDocumentsProps) {
  
  const downloadFile = (content: string, filename: string, type: string = 'text/plain;charset=utf-8') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Your Tailored Documents</CardTitle>
        <CardDescription>Review and download your AI-generated resume and cover letter.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="resume" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resume">Tailored Resume</TabsTrigger>
            <TabsTrigger value="cover-letter">Tailored Cover Letter</TabsTrigger>
          </TabsList>
          <TabsContent value="resume" className="mt-4">
            <div className="space-y-4">
                <Textarea value={resume} readOnly className="min-h-[400px] bg-muted/40 resize-y" />
                <Button onClick={() => downloadFile(resume, 'tailored-resume.txt')}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Resume
                </Button>
            </div>
          </TabsContent>
          <TabsContent value="cover-letter" className="mt-4">
            <div className="space-y-4">
                <Textarea value={coverLetter} readOnly className="min-h-[400px] bg-muted/40 resize-y" />
                <Button onClick={() => downloadFile(coverLetter, 'tailored-cover-letter.txt')}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Cover Letter
                </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
