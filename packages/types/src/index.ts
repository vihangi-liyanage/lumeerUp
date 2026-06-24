// ============================================================
// LUMEERUP - Shared Type Definitions
// ============================================================

// ---- User & Auth ----
export interface User {
  pk_user_id: string;
  email: string;
  password_hash: string | null;
  created_at: Date;
}

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password_hash'>;
}

// ---- Profile ----
export interface SkillMatrix {
  skill: string;
  category: string;
  proficiency: number; // 0-100
  marketDemand: number; // 0-100
}

export interface UserProfile {
  pk_profile_id: string;
  fk_user_id: string;
  skills_matrix: SkillMatrix[];
  behavioral_score: number;
  communication_score: number;
  resume_url: string;
}

export interface PersonalBrandEquation {
  skills: number;
  behavior: number;
  communication: number;
  overall: number;
}

// ---- Career Roadmap ----
export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: 'low' | 'medium' | 'high';
}

export interface CareerRoadmap {
  pk_roadmap_id: string;
  fk_profile_id: string;
  target_role: string;
  skill_gap_analysis: SkillGap[];
  generated_date: Date;
}

// ---- Assessment ----
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  category: 'behavioral' | 'technical' | 'situational';
}

export interface QuizSubmission {
  answers: Record<string, number>; // questionId -> selectedOptionIndex
}

export interface AssessmentResult {
  behavioral_score: number;
  breakdown: Record<string, number>;
}

// ---- Resume ----
export interface ParsedResume {
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  raw_text: string;
}

export interface ResumeUploadResponse {
  url: string;
  parsed: ParsedResume;
}

// ---- Chat ----
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
}

// ---- API Responses ----
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

export interface HealthCheckResponse {
  status: 'ok';
  timestamp: string;
}

// ---- API Route Types ----
export namespace Routes {
  export type AuthRegister = `/api/v1/auth/register`;
  export type ResumeUpload = `/api/v1/resume/upload`;
  export type ProfileAnalytics = `/api/v1/profile/analytics`;
  export type AssessmentSubmit = `/api/v1/assessment/submit`;
  export type RoadmapStream = `/api/v1/roadmap/stream`;
  export type ChatAdvisor = `/api/v1/chat/advisor`;
}
