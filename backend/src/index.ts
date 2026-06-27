import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { env } from './config/env';
import { errorHandler } from './middleware/error-handler';
import { authRouter } from './routes/authRoutes';
import { resumeRouter } from './routes/resumeRoutes';
import { analyticsRouter } from './routes/analyticsRoutes';
import { assessmentRouter } from './routes/assessmentRoutes';
import { profileRouter } from './routes/profileRoutes';

const app = express();
const PORT = parseInt(env.PORT, 10) || 4000;

// Security middleware
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Body parsing with size limit
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Serve local uploads statically in development mode
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/resume', resumeRouter);
app.use('/api/v1/profile', analyticsRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/assessment', assessmentRouter);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[LumeerUp Backend] Server running on port ${PORT}`);
});

export default app;
