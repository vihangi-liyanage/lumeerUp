import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { env } from '../config/env';

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// Zod schema for structured output
const skillsMatrixSchema = z.object({
  languages: z.array(z.string()),
  frameworks: z.array(z.string()),
  tools: z.array(z.string()),
  expertise_level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
});

const profileExtractionSchema = z.object({
  skills_matrix: skillsMatrixSchema,
  communication_score: z.number().min(0).max(100).describe('Score based on grammar, clarity, and vocabulary in the resume.'),
  behavioral_score: z.number().min(0).max(100).describe('Estimated behavioral score based on tone and described accomplishments.'),
});

export const aiService = {
  /**
   * Processes the raw extracted resume text and returns the structured skills matrix
   * and initial communication/behavioral scores.
   */
  async processResumeText(rawText: string) {
    // @ts-ignore
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: profileExtractionSchema as any,
      prompt: `
        Analyze the following resume text and extract the candidate's technical skills, 
        tools, and frameworks into the skills_matrix.
        Also evaluate the candidate's communication score (0-100) based on how well the 
        resume is written (grammar, structure, clarity) and provide an estimated behavioral 
        score (0-100) based on described accomplishments.

        Resume Text:
        """
        ${rawText}
        """
      `,
    });

    return object;
  },

  /**
   * Generates a career roadmap based on the current skills matrix and a target role.
   */
  async generateCareerRoadmap(skillsMatrix: any, targetRole: string) {
    // @ts-ignore
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        skill_gap_analysis: z.object({
          missing_skills: z.array(z.string()),
          learning_path: z.array(z.object({
            topic: z.string(),
            description: z.string(),
            estimated_weeks: z.number()
          }))
        })
      }) as any,
      prompt: `
        The candidate has the following skills: ${JSON.stringify(skillsMatrix)}.
        They want to achieve the target role: "${targetRole}".
        Generate a detailed skill gap analysis and a learning path to bridge the gap.
      `
    });

    return object;
  }
};
