import { Router } from 'express';
import { uploadMiddleware } from '../middleware/upload';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { resumeService } from '../services/resumeService';
import { aiService } from '../services/aiService';
import { prisma } from '../config/db';

export const resumeRouter = Router();

resumeRouter.post('/upload', requireAuth, uploadMiddleware.single('resume'), async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.userId;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'No resume file uploaded' });
      return;
    }

    // 1. Upload to Blob
    const resumeUrl = await resumeService.uploadResumeToBlob(userId, file.buffer, file.originalname);

    // 2. Extract Text
    const rawText = await resumeService.extractTextFromPdf(file.buffer);

    // 3. AI Processing
    const structuredProfile = await aiService.processResumeText(rawText) as any;

    // 4. Save Profile
    const profile = await prisma.userProfile.create({
      data: {
        fk_user_id: userId,
        skills_matrix: structuredProfile.skills_matrix,
        behavioral_score: structuredProfile.behavioral_score,
        communication_score: structuredProfile.communication_score,
        resume_url: resumeUrl,
      }
    });

    res.status(200).json({ profile });
  } catch (error: any) {
    console.error('Resume upload error:', error);
    res.status(500).json({ error: error.message || 'Internal server error during resume upload' });
  }
});
