'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, UploadCloud } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

const formSchema = z.object({
  resume: z
    .any()
    .refine((files) => files?.length === 1, 'Resume is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      '.pdf, .doc, .docx, and .txt files are accepted.'
    ),
  coverLetter: z
    .any()
    .refine((files) => files?.length === 1, 'Cover letter is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      '.pdf, .doc, .docx, and .txt files are accepted.'
    ),
  jobDescription: z.string().min(100, {
    message: 'Job description must be at least 100 characters.',
  }),
});

export type TailorFormData = z.infer<typeof formSchema>;

interface ResumeTailorFormProps {
  onSubmit: (data: TailorFormData) => void;
  isLoading: boolean;
}

export function ResumeTailorForm({ onSubmit, isLoading }: ResumeTailorFormProps) {
  const form = useForm<TailorFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: '',
    },
  });

  const resumeFileRef = form.register('resume');
  const coverLetterFileRef = form.register('coverLetter');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="resume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Resume</FormLabel>
                <FormControl>
                  <div className="relative">
                    <UploadCloud className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="file" className="pl-10" {...resumeFileRef} disabled={isLoading} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coverLetter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Cover Letter</FormLabel>
                <FormControl>
                  <div className="relative">
                    <UploadCloud className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="file" className="pl-10" {...coverLetterFileRef} disabled={isLoading} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="jobDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste the full job description here..."
                  className="min-h-[200px] resize-y"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Tailoring...
            </>
          ) : (
            'Tailor My Documents'
          )}
        </Button>
      </form>
    </Form>
  );
}
