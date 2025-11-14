'use client';

import { useState } from 'react';
import { FilePenLine } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ResumeTailorForm, type TailorFormData } from '@/components/resume-tailor-form';
import { TailoredDocuments } from '@/components/tailored-documents';
import { handleTailoring } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

type TailoredDocs = {
  tailoredResume: string;
  tailoredCoverLetter: string;
};

export default function Home() {
  const [results, setResults] = useState<TailoredDocs | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onTailor = async (data: TailorFormData) => {
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

      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Create Your Application</CardTitle>
        </CardHeader>
        <CardContent>
          <ResumeTailorForm onSubmit={onTailor} isLoading={isLoading} />
        </CardContent>
      </Card>

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
