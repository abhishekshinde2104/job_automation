'use server';

import {
  tailorResumeAndCoverLetter,
  type TailorResumeAndCoverLetterInput,
} from '@/ai/flows/tailor-resume-and-cover-letter';

export async function handleTailoring(data: TailorResumeAndCoverLetterInput) {
  try {
    const result = await tailorResumeAndCoverLetter(data);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error tailoring documents:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred in the AI flow.';
    return { success: false, error: `Failed to tailor documents. ${errorMessage}` };
  }
}
