import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { prisma } from '../config/db';

export const analyticsRouter = Router();

analyticsRouter.get('/analytics', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.userId;

    const profile = await prisma.userProfile.findFirst({
      where: { fk_user_id: userId },
      orderBy: { pk_profile_id: 'desc' }
    });

    if (!profile) {
      res.status(404).json({ error: 'Profile not found. Please upload a resume first.' });
      return;
    }

    const skillsMatrix = profile.skills_matrix as any;
    
    // Simplistic skill calculation for the prototype
    const skillScore = Math.min(100, 
      ((skillsMatrix?.languages?.length || 0) * 5) + 
      ((skillsMatrix?.frameworks?.length || 0) * 5) +
      ((skillsMatrix?.tools?.length || 0) * 3)
    );

    const personalBrandScore = Math.round(
      (skillScore * 0.4) + 
      (profile.behavioral_score * 0.3) + 
      (profile.communication_score * 0.3)
    );

    res.status(200).json({
      personal_brand_equation: {
        total: personalBrandScore,
        breakdown: {
          skills: skillScore,
          behavior: profile.behavioral_score,
          communication: profile.communication_score
        }
      },
      skills_matrix: skillsMatrix
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error fetching analytics' });
  }
});
