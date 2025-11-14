'use server';

/**
 * @fileOverview This file defines a Genkit flow that tailors a resume and cover letter to a specific job description.
 *
 * - tailorResumeAndCoverLetter - A function that takes a resume, cover letter, and job description, and returns tailored versions of the resume and cover letter.
 * - TailorResumeAndCoverLetterInput - The input type for the tailorResumeAndCoverLetter function.
 * - TailorResumeAndCoverLetterOutput - The return type for the tailorResumeAndCoverLetter function.
 */

import {ai as defaultAi} from '@/ai/genkit';
import type {AIFunction, AIFunctionOptions} from 'genkit';
import {z} from 'genkit';

const TailorResumeAndCoverLetterInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      'The resume as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  coverLetterDataUri: z
    .string()
    .describe(
      'The cover letter as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  jobDescription: z.string().describe('The job description to tailor the resume and cover letter to.'),
});
export type TailorResumeAndCoverLetterInput = z.infer<typeof TailorResumeAndCoverLetterInputSchema>;

const TailorResumeAndCoverLetterOutputSchema = z.object({
  tailoredResume: z.string().describe('The tailored resume.'),
  tailoredCoverLetter: z.string().describe('The tailored cover letter.'),
});
export type TailorResumeAndCoverLetterOutput = z.infer<typeof TailorResumeAndCoverLetterOutputSchema>;

export async function tailorResumeAndCoverLetter(
  input: TailorResumeAndCoverLetterInput,
  options?: AIFunctionOptions
): Promise<TailorResumeAndCoverLetterOutput> {
  const ai = options?.ai ?? defaultAi;

  const tailorResumeAndCoverLetterPrompt = ai.definePrompt({
    name: 'tailorResumeAndCoverLetterPrompt',
    input: {schema: TailorResumeAndCoverLetterInputSchema},
    output: {schema: TailorResumeAndCoverLetterOutputSchema},
    prompt: `You are an expert resume and cover letter tailor.

You will be provided with a resume, a cover letter, and a job description.
Your goal is to tailor the resume and cover letter to match the job requirements described in the job description.

Here is the resume:
{{{resumeDataUri}}}

Here is the cover letter:
{{{coverLetterDataUri}}}

Here is the job description:
{{{jobDescription}}}

Please provide a tailored resume and cover letter that are well-suited for the job description.
Ensure the tailored resume and cover letter highlight the qualifications and experiences that are most relevant to the job description.

Tailored Resume:
{{tailoredResume}}

Tailored Cover Letter:
{{tailoredCoverLetter}}`,
  });

  const tailorResumeAndCoverLetterFlow = ai.defineFlow(
    {
      name: 'tailorResumeAndCoverLetterFlow',
      inputSchema: TailorResumeAndCoverLetterInputSchema,
      outputSchema: TailorResumeAndCoverLetterOutputSchema,
    },
    async input => {
      const {output} = await tailorResumeAndCoverLetterPrompt(input);
      return output!;
    }
  ) as AIFunction<typeof TailorResumeAndCoverLetterInputSchema, typeof TailorResumeAndCoverLetterOutputSchema>;

  return tailorResumeAndCoverLetterFlow(input);
}
