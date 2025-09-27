'use server';
/**
 * @fileOverview A Genkit flow for generating personalized photo captions for a birthday gallery.
 *
 * This flow takes a photo and the relationship of the person in the photo to the father (e.g., "Wife", "Daughter", "Son")
 * and generates a heartfelt caption from their perspective.
 *
 * @exports {
 *   generatePhotoCaption - The main function to call the caption generation flow.
 *   GeneratePhotoCaptionInput - The input type for the generatePhotoCaption function.
 *   GeneratePhotoCaptionOutput - The output type for the generatePhotoCaption function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the caption generation flow.
const GeneratePhotoCaptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the father, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  relationship: z
    .string()
    .describe(
      'The relationship of the other person in the photo to the father (e.g., "Wife", "Daughter", "Son", "Family", "Just him").'
    ),
});

// Define the output schema for the caption generation flow.
const GeneratePhotoCaptionOutputSchema = z.object({
  caption: z.string().describe('The generated heartfelt caption for the photo.'),
});

// Define the TypeScript types for the input and output schemas.
export type GeneratePhotoCaptionInput = z.infer<typeof GeneratePhotoCaptionInputSchema>;
export type GeneratePhotoCaptionOutput = z.infer<typeof GeneratePhotoCaptionOutputSchema>;

// Define the main function to call the caption generation flow.
export async function generatePhotoCaption(
  input: GeneratePhotoCaptionInput
): Promise<GeneratePhotoCaptionOutput> {
  return generatePhotoCaptionFlow(input);
}

// Define the prompt for the caption generation flow.
const captionGenerationPrompt = ai.definePrompt({
  name: 'captionGenerationPrompt',
  input: {schema: GeneratePhotoCaptionInputSchema},
  output: {schema: GeneratePhotoCaptionOutputSchema},
  prompt: `
    You are an AI assistant who writes short, heartfelt, and personal photo captions for a father's birthday celebration.
    The photo is for his birthday gallery. The caption should be from the perspective of the person in the photo with him.
    It should be one or two sentences, full of love and warmth.

    Analyze the provided photo.
    Photo: {{media url=photoDataUri}}

    The other person in the photo is his: {{{relationship}}}.

    Based on the photo and the relationship, write a caption.

    - If the relationship is 'Wife', write from a wife to her husband.
    - If the relationship is 'Daughter', write from a daughter to her father.
    - If the relationship is 'Son', write from a son to his father.
    - If the relationship is 'Family', write a caption that captures a beautiful family moment.
    - If the relationship is 'Just him', write a caption that appreciates him as a person.

    Do not describe what is literally in the photo. Instead, evoke the emotion and memory behind it.
    For example, instead of "A father and son smiling," write "With my hero, then and now. So many great memories."
  `,
});

// Define the Genkit flow for caption generation.
const generatePhotoCaptionFlow = ai.defineFlow(
  {
    name: 'generatePhotoCaptionFlow',
    inputSchema: GeneratePhotoCaptionInputSchema,
    outputSchema: GeneratePhotoCaptionOutputSchema,
  },
  async input => {
    const {output} = await captionGenerationPrompt(input);
    return output!;
  }
);
