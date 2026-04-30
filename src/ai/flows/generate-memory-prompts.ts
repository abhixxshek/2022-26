'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating personalized memory prompts.
 *
 * - generateMemoryPrompts - A function that handles the generation of memory prompts.
 * - GenerateMemoryPromptsInput - The input type for the generateMemoryPrompts function.
 * - GenerateMemoryPromptsOutput - The return type for the generateMemoryPrompts function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMemoryPromptsInputSchema = z.object({
  classYear: z
    .string()
    .optional()
    .describe(
      'The specific class year (e.g., "6", "10") for which to generate memory prompts. If not provided, general prompts will be generated.'
    ),
  theme: z
    .string()
    .optional()
    .describe(
      'A general theme or keyword to guide the memory prompts (e.g., "friendships", "sports day", "exam anxiety"). If not provided, a default set of themes will be used.'
    ),
});
export type GenerateMemoryPromptsInput = z.infer<
  typeof GenerateMemoryPromptsInputSchema
>;

const GenerateMemoryPromptsOutputSchema = z.object({
  prompts: z
    .array(z.string())
    .describe('An array of suggested memory prompts.'),
});
export type GenerateMemoryPromptsOutput = z.infer<
  typeof GenerateMemoryPromptsOutputSchema
>;

export async function generateMemoryPrompts(
  input: GenerateMemoryPromptsInput
): Promise<GenerateMemoryPromptsOutput> {
  return generateMemoryPromptsFlow(input);
}

const generateMemoryPromptsPrompt = ai.definePrompt({
  name: 'generateMemoryPromptsPrompt',
  input: { schema: GenerateMemoryPromptsInputSchema },
  output: { schema: GenerateMemoryPromptsOutputSchema },
  prompt: `You are an AI assistant designed to help students recall and articulate their memories from their college years for a digital yearbook platform called 'GEC Idukki Memories'.

Generate 3-5 distinct, personalized, and inspiring memory prompts that will help the student recall specific experiences and feelings. Focus on helping them articulate their unique journey.

Context for prompt generation:
{{#if classYear}}Year: Year {{{classYear}}}. Focus these prompts specifically on memories from this academic year.{{/if}}
{{#if theme}}Theme: {{{theme}}}. Emphasize this theme in the generated prompts.{{else}}Default Themes: friendships, teachers, significant school events, challenges overcome, academic achievements, daily school life, extracurricular activities, personal growth.{{/if}}

Combine the class year and theme (if provided) to make the prompts as specific and relevant as possible.

Return the prompts as a JSON array of strings.

Example Output:
[
  "Describe your most cherished memory with a friend during Year {{classYear}}.",
  "What was a major challenge you faced in Year {{classYear}} and how did you overcome it?",
  "Recount a special event or festival celebrated at GEC Idukki that year, focusing on your feelings and experiences."
]
`,
});

const generateMemoryPromptsFlow = ai.defineFlow(
  {
    name: 'generateMemoryPromptsFlow',
    inputSchema: GenerateMemoryPromptsInputSchema,
    outputSchema: GenerateMemoryPromptsOutputSchema,
  },
  async (input) => {
    const { output } = await generateMemoryPromptsPrompt(input);
    return output!;
  }
);
