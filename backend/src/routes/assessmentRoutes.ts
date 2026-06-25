import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { prisma } from '../config/db';
import { aiService } from '../services/aiService';

export const assessmentRouter = Router();

assessmentRouter.post('/submit', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { answers } = req.body;

    // Dummy behavior calculation based on answers array length
    const newBehavioralScore = Math.min(100, 60 + (answers?.length || 0) * 5);

    const profile = await prisma.userProfile.findFirst({
      where: { fk_user_id: userId },
      orderBy: { pk_profile_id: 'desc' }
    });

    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    const updatedProfile = await prisma.userProfile.update({
      where: { pk_profile_id: profile.pk_profile_id },
      data: { behavioral_score: newBehavioralScore }
    });

    res.status(200).json({ updatedProfile });
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
