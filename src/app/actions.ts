'use server';

import { detectLanguage } from '@/ai/flows/detect-language';
import {
  tailorResumeAndCoverLetter,
  type TailorResumeAndCoverLetterInput,
} from '@/ai/flows/tailor-resume-and-cover-letter';
import { translate } from '@/ai/flows/translate-text';

export async function handleTailoring(data: TailorResumeAndCoverLetterInput) {
  try {
    const { languageCode } = await detectLanguage({ text: data.jobDescription });

    let jobDescription = data.jobDescription;
    if (languageCode.toLowerCase() === 'de') {
      const translationResponse = await translate({
        text: data.jobDescription,
        targetLanguage: 'English',
      });
      jobDescription = translationResponse.translatedText;
    }

    const result = await tailorResumeAndCoverLetter({
      ...data,
      jobDescription,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error tailoring documents:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred in the AI flow.';
    return { success: false, error: `Failed to tailor documents. ${errorMessage}` };
  }
}
