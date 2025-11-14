'use client';

import { useState, useEffect } from 'react';
import { FilePenLine, KeyRound } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ResumeTailorForm, type TailorFormData } from '@/components/resume-tailor-form';
import { TailoredDocuments } from '@/components/tailored-documents';
import { handleTailoring } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type TailoredDocs = {
  tailoredResume: string;
  tailoredCoverLetter: string;
};

export default function Home() {
  const [results, setResults] = useState<TailoredDocs | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isApiDialogOpen, setIsApiDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setIsApiDialogOpen(true);
    }
  }, []);

  const handleApiKeySave = () => {
    if (apiKeyInput) {
      localStorage.setItem('gemini_api_key', apiKeyInput);
      setApiKey(apiKeyInput);
      setIsApiDialogOpen(false);
      toast({
        title: 'Success',
        description: 'API key saved successfully!',
      });
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onTailor = async (data: TailorFormData) => {
    if (!apiKey) {
      setError('API Key is not set. Please add it using the key icon in the header.');
      setIsApiDialogOpen(true);
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const [resumeDataUri, coverLetterDataUri] = await Promise.all([
        fileToDataUri(data.resume[0]),
        fileToDataUri(data.coverLetter[0]),
      ]);

      const response = await handleTailoring({
        resumeDataUri,
        coverLetterDataUri,
        jobDescription: data.jobDescription,
        apiKey,
      });

      if (response.success && response.data) {
        setResults(response.data);
      } else {
        setError(response.error || 'An unknown error occurred.');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error || 'An unknown error occurred.',
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred during file processing.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <FilePenLine className="w-16 h-16 text-primary" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          Resume Tailor AI
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Upload your documents and paste the job description to get an AI-powered, tailored application in seconds.
        </p>
      </div>

      <Dialog open={isApiDialogOpen} onOpenChange={setIsApiDialogOpen}>
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-headline">Create Your Application</CardTitle>
              <CardDescription>
                {!apiKey ? 'Please add your API key to get started.' : 'Fill in your details below.'}
              </CardDescription>
            </div>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setIsApiDialogOpen(true)}>
                <KeyRound className="w-6 h-6 text-muted-foreground" />
              </Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent>
            <ResumeTailorForm onSubmit={onTailor} isLoading={isLoading} />
          </CardContent>
        </Card>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Your Gemini API Key</DialogTitle>
            <DialogDescription>
              To use this application, you need to provide your own Gemini API key. You can get one from Google AI Studio.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="api-key-input">Your API Key</Label>
            <Input
              id="api-key-input"
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Enter your API key"
            />
          </div>
          <Button onClick={handleApiKeySave}>Save Key</Button>
        </DialogContent>
      </Dialog>

      {error && (
        <Alert variant="destructive" className="max-w-4xl mx-auto mt-8">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results && (
        <div className="max-w-4xl mx-auto mt-8">
          <TailoredDocuments
            resume={results.tailoredResume}
            coverLetter={results.tailoredCoverLetter}
          />
        </div>
      )}
    </main>
  );
}
