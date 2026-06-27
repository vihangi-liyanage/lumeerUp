"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  GraduationCap,
  Wrench,
  Compass,
  Plus,
  X,
  Save,
  Loader2,
  CheckCircle,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

// ============================================================
// LUMEERUP — Profile Completion & Skills Matrix Manager
// Premium multi-section configuration panel
// ============================================================

interface ProfileData {
  education_background: string;
  current_study_level: string;
  interests: string;
  career_goals: string;
  preferred_industries: string;
  skills_matrix: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    expertise_level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  };
}

const STUDY_LEVELS = [
  "High School",
  "Undergraduate Student",
  "Postgraduate Student",
  "Bootcamp Graduate",
  "Self-Taught / Professional",
];

const EXPERTISE_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

type TabType = "general" | "skills" | "aspirations";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    education_background: "",
    current_study_level: "Undergraduate Student",
    interests: "",
    career_goals: "",
    preferred_industries: "",
    skills_matrix: {
      languages: [],
      frameworks: [],
      tools: [],
      expertise_level: "Intermediate",
    },
  });

  // Inputs for adding skills
  const [newLanguage, setNewLanguage] = useState("");
  const [newFramework, setNewFramework] = useState("");
  const [newTool, setNewTool] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await apiFetch<{ profile: any }>("/api/v1/profile");
        if (response?.profile) {
          const p = response.profile;
          setProfile({
            education_background: p.education_background || "",
            current_study_level: p.current_study_level || "Undergraduate Student",
            interests: p.interests || "",
            career_goals: p.career_goals || "",
            preferred_industries: p.preferred_industries || "",
            skills_matrix: p.skills_matrix || {
              languages: [],
              frameworks: [],
              tools: [],
              expertise_level: "Intermediate",
            },
          });
        }
      } catch (err: any) {
        console.warn("No profile found or failed to load. Initiating blank setup.");
        // Non-blocking, they can configure it anew
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await apiFetch("/api/v1/profile", {
        method: "PUT",
        body: JSON.stringify(profile),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile. Please check credentials.");
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = (type: "languages" | "frameworks" | "tools", value: string) => {
    if (!value.trim()) return;
    const clean = value.trim();
    if (profile.skills_matrix[type].includes(clean)) return;

    setProfile({
      ...profile,
      skills_matrix: {
        ...profile.skills_matrix,
        [type]: [...profile.skills_matrix[type], clean],
      },
    });

    if (type === "languages") setNewLanguage("");
    if (type === "frameworks") setNewFramework("");
    if (type === "tools") setNewTool("");
  };

  const removeSkill = (type: "languages" | "frameworks" | "tools", index: number) => {
    const list = [...profile.skills_matrix[type]];
    list.splice(index, 1);
    setProfile({
      ...profile,
      skills_matrix: {
        ...profile.skills_matrix,
        [type]: list,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
          <span className="text-slate-400 text-sm">Loading your professional profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10 text-white bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">Profile Settings</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Provide context for AI career advisory engines to perform accurate compatibility maps.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue hover:opacity-90 transition-all font-semibold text-slate-950 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : success ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Saving..." : success ? "Profile Saved!" : "Save Changes"}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl border border-brand-rose/20 bg-brand-rose/10 text-brand-rose text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 space-x-6 text-sm">
          {[
            { id: "general", label: "Academic Info", icon: GraduationCap },
            { id: "skills", label: "Skills Matrix", icon: Wrench },
            { id: "aspirations", label: "Goals & Industries", icon: Compass },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`relative pb-4 flex items-center gap-2 font-medium transition-colors ${
                  isTabActive ? "text-brand-cyan" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {isTabActive && (
                  <motion.div
                    layoutId="profile-tab-bar"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-cyan"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Configuration Forms */}
        <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {activeTab === "general" && (
              <motion.div
                key="general"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Current Study Level
                    </label>
                    <select
                      value={profile.current_study_level}
                      onChange={(e) =>
                        setProfile({ ...profile, current_study_level: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-surface text-white focus:outline-none focus:border-brand-cyan/50 text-sm transition-all"
                    >
                      {STUDY_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Skills Expertise Base
                    </label>
                    <select
                      value={profile.skills_matrix.expertise_level}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          skills_matrix: {
                            ...profile.skills_matrix,
                            expertise_level: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-surface text-white focus:outline-none focus:border-brand-cyan/50 text-sm transition-all"
                    >
                      {EXPERTISE_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Educational Background
                  </label>
                  <textarea
                    value={profile.education_background}
                    onChange={(e) =>
                      setProfile({ ...profile, education_background: e.target.value })
                    }
                    placeholder="List your degree, major, institution, and graduation year (e.g. BS in Computer Science, Lumeer University, Class of 2026)."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-surface text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan/50 text-sm transition-all resize-none"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === "skills" && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Languages Section */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Programming Languages
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="e.g. TypeScript, Python, Rust"
                      onKeyDown={(e) => e.key === "Enter" && addSkill("languages", newLanguage)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-surface text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan/50 text-sm transition-all"
                    />
                    <button
                      onClick={() => addSkill("languages", newLanguage)}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-brand-cyan transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {profile.skills_matrix.languages.map((lang, i) => (
                      <span
                        key={lang}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/35"
                      >
                        {lang}
                        <button onClick={() => removeSkill("languages", i)}>
                          <X className="w-3.5 h-3.5 hover:text-white" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Frameworks Section */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Frameworks / Libraries
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFramework}
                      onChange={(e) => setNewFramework(e.target.value)}
                      placeholder="e.g. Next.js, Express, PyTorch"
                      onKeyDown={(e) => e.key === "Enter" && addSkill("frameworks", newFramework)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-surface text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan/50 text-sm transition-all"
                    />
                    <button
                      onClick={() => addSkill("frameworks", newFramework)}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-brand-blue transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {profile.skills_matrix.frameworks.map((fw, i) => (
                      <span
                        key={fw}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-blue/15 text-brand-blue border border-brand-blue/35"
                      >
                        {fw}
                        <button onClick={() => removeSkill("frameworks", i)}>
                          <X className="w-3.5 h-3.5 hover:text-white" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tools Section */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Developer Tools / Platforms
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTool}
                      onChange={(e) => setNewTool(e.target.value)}
                      placeholder="e.g. Docker, PostgreSQL, AWS"
                      onKeyDown={(e) => e.key === "Enter" && addSkill("tools", newTool)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-surface text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan/50 text-sm transition-all"
                    />
                    <button
                      onClick={() => addSkill("tools", newTool)}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-brand-purple transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {profile.skills_matrix.tools.map((t, i) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-purple/15 text-brand-purple border border-brand-purple/35"
                      >
                        {t}
                        <button onClick={() => removeSkill("tools", i)}>
                          <X className="w-3.5 h-3.5 hover:text-white" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "aspirations" && (
              <motion.div
                key="aspirations"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Career Goals
                  </label>
                  <textarea
                    value={profile.career_goals}
                    onChange={(e) =>
                      setProfile({ ...profile, career_goals: e.target.value })
                    }
                    placeholder="Describe your long-term career aspirations, e.g., Senior Full Stack Engineer, Engineering Manager, AI Researcher..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-surface text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan/50 text-sm transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Interests & Passions
                  </label>
                  <textarea
                    value={profile.interests}
                    onChange={(e) =>
                      setProfile({ ...profile, interests: e.target.value })
                    }
                    placeholder="List topics or domains you are passionate about, e.g., open source, machine learning, decentralized networks, UX design..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-surface text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan/50 text-sm transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Preferred Industries
                  </label>
                  <input
                    type="text"
                    value={profile.preferred_industries}
                    onChange={(e) =>
                      setProfile({ ...profile, preferred_industries: e.target.value })
                    }
                    placeholder="e.g. FinTech, HealthTech, EdTech, SaaS (comma separated)"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-surface text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan/50 text-sm transition-all"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
