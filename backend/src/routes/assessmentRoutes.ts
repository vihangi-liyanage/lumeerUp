import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { prisma } from '../config/db';
import { aiService } from '../services/aiService';

export const assessmentRouter = Router();

assessmentRouter.post('/submit', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      res.status(400).json({ error: 'Answers array is required and must not be empty' });
      return;
    }

    // Dynamic scoring formula: choice 0 maps to 100, 1 maps to 80, 2 maps to 60, 3 maps to 40
    const totalPoints = answers.reduce((sum: number, choice: number) => {
      const choiceVal = typeof choice === 'number' ? choice : 0;
      return sum + Math.max(20, 100 - choiceVal * 20);
    }, 0);
    const newBehavioralScore = Math.round(totalPoints / answers.length);

    let profile = await prisma.userProfile.findFirst({
      where: { fk_user_id: userId },
      orderBy: { pk_profile_id: 'desc' }
    });

    if (!profile) {
      // Create user profile if it doesn't exist yet
      profile = await prisma.userProfile.create({
        data: {
          fk_user_id: userId,
          skills_matrix: { languages: [], frameworks: [], tools: [] },
          behavioral_score: newBehavioralScore,
          communication_score: 70, // default baseline
          resume_url: '',
        }
      });
    } else {
      // Update existing profile
      profile = await prisma.userProfile.update({
        where: { pk_profile_id: profile.pk_profile_id },
        data: { behavioral_score: newBehavioralScore }
      });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error('Assessment submit error:', error);
    res.status(500).json({ error: 'Internal server error submitting assessment' });
  }
});

assessmentRouter.get('/roadmap/stream', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { targetRole } = req.query;

    if (!targetRole || typeof targetRole !== 'string') {
      res.status(400).json({ error: 'targetRole query parameter is required' });
      return;
    }

    const profile = await prisma.userProfile.findFirst({
      where: { fk_user_id: userId },
      orderBy: { pk_profile_id: 'desc' }
    });

    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    // In a full implementation, we'd use streamText or streamObject from Vercel AI SDK here.
    // For now, generating the object and returning it.
    const roadmap = await aiService.generateCareerRoadmap(profile.skills_matrix, targetRole) as any;

    await prisma.careerRoadmap.create({
      data: {
        fk_profile_id: profile.pk_profile_id,
        target_role: targetRole,
        skill_gap_analysis: roadmap.skill_gap_analysis as any
      }
    });

    res.status(200).json({ roadmap });
  } catch (error) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({ error: 'Internal server error generating roadmap' });
  }
});
