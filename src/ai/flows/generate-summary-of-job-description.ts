'use server';
/**
 * @fileOverview Summarizes a job description to identify key qualifications and requirements.
 *
 * - generateSummary - A function that takes a job description and returns a summary.
 * - JobDescriptionInput - The input type for the generateSummary function.
 * - JobDescriptionOutput - The return type for the generateSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobDescriptionInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The full text of the job description.'),
});
export type JobDescriptionInput = z.infer<typeof JobDescriptionInputSchema>;

const JobDescriptionOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the key qualifications, skills, and experience required by the job description.'
    ),
});
export type JobDescriptionOutput = z.infer<typeof JobDescriptionOutputSchema>;

export async function generateSummary(
  input: JobDescriptionInput
): Promise<JobDescriptionOutput> {
  return generateSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobDescriptionSummaryPrompt',
  input: {schema: JobDescriptionInputSchema},
  output: {schema: JobDescriptionOutputSchema},
  prompt: `You are an expert recruiter summarizing job descriptions to identify the most important qualifications.

  Based on the following job description, provide a concise summary (no more than 150 words) of the key skills, experience, and qualifications required for the role.

  Job Description: {{{jobDescription}}}`,
});

const generateSummaryFlow = ai.defineFlow(
  {
    name: 'generateSummaryFlow',
    inputSchema: JobDescriptionInputSchema,
    outputSchema: JobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
