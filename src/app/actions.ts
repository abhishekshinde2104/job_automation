'use server';

import { genkit, type GenkitError } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

import { detectLanguage } from '@/ai/flows/detect-language';
import {
  tailorResumeAndCoverLetter,
  type TailorResumeAndCoverLetterInput,
} from '@/ai/flows/tailor-resume-and-cover-letter';
import { translate } from '@/ai/flows/translate-text';

type HandleTailoringInput = TailorResumeAndCoverLetterInput & {
    apiKey: string;
};

export async function handleTailoring(data: HandleTailoringInput) {
  try {
    // Initialize Genkit with the user-provided API key for this request
    const ai = genkit({
      plugins: [googleAI({ apiKey: data.apiKey })],
      model: 'googleai/gemini-2.5-flash',
    });

    const { languageCode } = await detectLanguage({ text: data.jobDescription }, { ai });

    let jobDescription = data.jobDescription;
    if (languageCode.toLowerCase() === 'de') {
      const translationResponse = await translate(
        {
          text: data.jobDescription,
          targetLanguage: 'English',
        },
        { ai }
      );
      jobDescription = translationResponse.translatedText;
    }

    const result = await tailorResumeAndCoverLetter(
      {
        ...data,
        jobDescription,
      },
      { ai }
    );
    return { success: true, data: result };
  } catch (error) {
    console.error('Error tailoring documents:', error);
    let errorMessage = 'An unknown error occurred in the AI flow.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    const genkitError = error as GenkitError;
    if (genkitError.cause) {
        errorMessage = `${genkitError.message}: ${genkitError.cause}`;
    }

    if (errorMessage.includes('API key not valid')) {
        errorMessage = 'Your API key is not valid. Please check it and try again.';
    }

    return { success: false, error: `Failed to tailor documents. ${errorMessage}` };
  }
}