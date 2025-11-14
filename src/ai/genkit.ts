import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// This global AI instance is now a fallback for dev environment if no key is provided.
// In production, the key will be passed per-request.
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
