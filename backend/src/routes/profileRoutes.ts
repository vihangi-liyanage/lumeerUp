import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { prisma } from '../config/db';

export const profileRouter = Router();

// GET user profile
profileRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.userId;

    const profile = await prisma.userProfile.findFirst({
      where: { fk_user_id: userId },
      orderBy: { pk_profile_id: 'desc' },
    });

    if (!profile) {
      // If no profile exists, return a 404
      res.status(404).json({ error: 'Profile not found. Please upload a resume or complete onboarding.' });
      return;
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error fetching profile' });
  }
});

// PUT update user profile
profileRouter.put('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.userId;
    const {
      skills_matrix,
      education_background,
      current_study_level,
      interests,
      career_goals,
      preferred_industries,
    } = req.body;

    let profile = await prisma.userProfile.findFirst({
      where: { fk_user_id: userId },
      orderBy: { pk_profile_id: 'desc' },
    });

    if (!profile) {
      // If no profile exists, initialize a new profile shell
      profile = await prisma.userProfile.create({
        data: {
          fk_user_id: userId,
          skills_matrix: skills_matrix || { languages: [], frameworks: [], tools: [] },
          resume_url: '',
          education_background,
          current_study_level,
          interests,
          career_goals,
          preferred_industries,
        },
      });
    } else {
      // Update existing profile
      profile = await prisma.userProfile.update({
        where: { pk_profile_id: profile.pk_profile_id },
        data: {
          skills_matrix: skills_matrix !== undefined ? skills_matrix : profile.skills_matrix,
          education_background: education_background !== undefined ? education_background : profile.education_background,
          current_study_level: current_study_level !== undefined ? current_study_level : profile.current_study_level,
          interests: interests !== undefined ? interests : profile.interests,
          career_goals: career_goals !== undefined ? career_goals : profile.career_goals,
          preferred_industries: preferred_industries !== undefined ? preferred_industries : profile.preferred_industries,
        },
      });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error updating profile' });
  }
});
