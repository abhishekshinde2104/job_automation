'use server';

/**
 * @fileOverview Detects the language of a given text.
 *
 * - detectLanguage - A function that detects the language of a given text.
 * - DetectLanguageInput - The input type for the detectLanguage function.
 * - DetectLanguageOutput - The return type for the detectLanguage function.
 */

import {ai as defaultAi} from '@/ai/genkit';
import {type FlowOptions} from 'genkit';
import {z} from 'genkit';

const DetectLanguageInputSchema = z.object({
  text: z.string().describe('The text to detect the language of.'),
});
export type DetectLanguageInput = z.infer<typeof DetectLanguageInputSchema>;

const DetectLanguageOutputSchema = z.object({
  languageCode: z.string().describe('The detected language code (e.g., "en", "de").'),
});
export type DetectLanguageOutput = z.infer<typeof DetectLanguageOutputSchema>;

const detectLanguageFlow = defaultAi.defineFlow(
  {
    name: 'detectLanguageFlow',
    inputSchema: DetectLanguageInputSchema,
    outputSchema: DetectLanguageOutputSchema,
  },
  async (input, context) => {
    const prompt = context.ai.definePrompt({
      name: 'detectLanguagePrompt',
      input: {schema: DetectLanguageInputSchema},
      output: {schema: DetectLanguageOutputSchema},
      prompt: `Detect the language of the following text and return the BCP-47 language code.

Text:
{{{text}}}

Respond with only the language code. For example, if the text is in English, respond with "en". If it is German, respond with "de".`,
    });

    const {output} = await prompt(input);
    return output!;
  }
);

export async function detectLanguage(
  input: DetectLanguageInput,
  options?: FlowOptions
): Promise<DetectLanguageOutput> {
  return detectLanguageFlow(input, options);
}
