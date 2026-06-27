// ============================================================
// LUMEERUP — Centralized API Client
// ============================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lumeerup_token");
}

function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new ApiError(
      response.status,
      body.error || body.message || "Request failed",
      body.code
    );
  }
  return response.json();
}

// ---- Auth ----

export async function registerUser(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<{ user: { id: string; email: string }; token: string }>(res);
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<{ user: { id: string; email: string }; token: string }>(res);
}

// ---- Resume ----

export async function uploadResume(file: File) {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`${API_BASE}/api/v1/resume/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  return handleResponse<{ profile: Record<string, unknown> }>(res);
}

// ---- Profile / Analytics ----

export async function getProfileAnalytics() {
  const res = await fetch(`${API_BASE}/api/v1/profile/analytics`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<{
    personal_brand_equation: {
      total: number;
      breakdown: {
        skills: number;
        behavior: number;
        communication: number;
      };
    };
    skills_matrix: {
      languages?: string[];
      frameworks?: string[];
      tools?: string[];
      expertise_level?: string;
    };
  }>(res);
}

// ---- Assessment ----

export async function submitAssessment(answers: number[]) {
  const res = await fetch(`${API_BASE}/api/v1/assessment/submit`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ answers }),
  });
  return handleResponse<{ updatedProfile: Record<string, unknown> }>(res);
}

// ---- Roadmap ----

export async function generateRoadmap(targetRole: string) {
  const res = await fetch(
    `${API_BASE}/api/v1/assessment/roadmap/stream?targetRole=${encodeURIComponent(targetRole)}`,
    { headers: getAuthHeaders() }
  );
  return handleResponse<{
    roadmap: {
      skill_gap_analysis: {
        missing_skills: string[];
        learning_path: Array<{
          topic: string;
          description: string;
          estimated_weeks: number;
        }>;
      };
    };
  }>(res);
}

// ---- Generic fetcher ----

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });
  return handleResponse<T>(res);
}
