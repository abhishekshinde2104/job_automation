'use server';
/**
 * @fileOverview Translates text to a specified target language.
 *
 * - translate - A function that translates text to a target language.
 * - TranslateTextInput - The input type for the translate function.
 * - TranslateTextOutput - The return type for the translate function.
 */

import {ai as defaultAi} from '@/ai/genkit';
import {type FlowOptions} from 'genkit';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  targetLanguage: z.string().describe('The target language to translate the text into (e.g., "English").'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;


const translateTextFlow = defaultAi.defineFlow(
    {
      name: 'translateTextFlow',
      inputSchema: TranslateTextInputSchema,
      outputSchema: TranslateTextOutputSchema,
    },
    async (input, context) => {
        const prompt = context.ai.definePrompt({
            name: 'translateTextPrompt',
            input: {schema: TranslateTextInputSchema},
            output: {schema: TranslateTextOutputSchema},
            prompt: `Translate the following text to {{{targetLanguage}}}.

Text:
{{{text}}}`,
        });

      const {output} = await prompt(input);
      return output!;
    }
  );
  
export async function translate(
  input: TranslateTextInput,
  options?: FlowOptions
): Promise<TranslateTextOutput> {
  return translateTextFlow(input, options);
}
