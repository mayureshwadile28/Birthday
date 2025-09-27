// use server'

/**
 * @fileOverview This file defines a Genkit flow for enhancing user-written birthday greetings with AI-powered sentiment enrichment.
 *
 * The flow takes a user-provided message as input and returns an enhanced version of the message with improved phrasing and sentiment.
 *
 * @exports {
 *   enhanceSentiment - The main function to call the sentiment enrichment flow.
 *   SentimentEnrichmentInput - The input type for the enhanceSentiment function.
 *   SentimentEnrichmentOutput - The output type for the enhanceSentiment function.
 * }
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the sentiment enrichment flow.
const SentimentEnrichmentInputSchema = z.object({
  message: z.string().describe('The user-written birthday message to enhance.'),
});

// Define the output schema for the sentiment enrichment flow.
const SentimentEnrichmentOutputSchema = z.object({
  enhancedMessage: z
    .string()
    .describe('The AI-enhanced birthday message with improved phrasing and sentiment.'),
});

// Define the TypeScript types for the input and output schemas.
export type SentimentEnrichmentInput = z.infer<typeof SentimentEnrichmentInputSchema>;
export type SentimentEnrichmentOutput = z.infer<typeof SentimentEnrichmentOutputSchema>;

// Define the main function to call the sentiment enrichment flow.
export async function enhanceSentiment(input: SentimentEnrichmentInput): Promise<SentimentEnrichmentOutput> {
  return sentimentEnrichmentFlow(input);
}

// Define the prompt for the sentiment enrichment flow.
const sentimentEnrichmentPrompt = ai.definePrompt({
  name: 'sentimentEnrichmentPrompt',
  input: {schema: SentimentEnrichmentInputSchema},
  output: {schema: SentimentEnrichmentOutputSchema},
  prompt: `You are an AI assistant specializing in enhancing heartfelt messages. A user has written a birthday message for their father, and they want you to improve the message's phrasing and sentiment to make it more emotive and personalized to express gratitude. 

Original Message: {{{message}}}

Please provide an enhanced version of the message that is more emotive and personalized:
`,
});

// Define the Genkit flow for sentiment enrichment.
const sentimentEnrichmentFlow = ai.defineFlow(
  {
    name: 'sentimentEnrichmentFlow',
    inputSchema: SentimentEnrichmentInputSchema,
    outputSchema: SentimentEnrichmentOutputSchema,
  },
  async input => {
    const {output} = await sentimentEnrichmentPrompt(input);
    return output!;
  }
);
