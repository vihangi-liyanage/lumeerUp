"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  X,
  Shield,
  Sparkles,
} from "lucide-react";

type AuthMode = "signin" | "signup";

export default function OnboardingPage() {
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [step, setStep] = useState<"auth" | "upload">("auth");
  const [showPassword, setShowPassword] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadError(null);
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  }, []);

  const validateAndSetFile = (file: File | undefined) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setUploadError("Only PDF files are accepted. Please upload a valid resume.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be under 5MB.");
      return;
    }
    setUploadedFile(file);
    setUploadError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    const endpoint = authMode === "signup" ? "/register" : "/login";
    try {
      const response = await fetch(`http://localhost:4000/api/v1/auth${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setAuthError(data.error || "Authentication failed. Please try again.");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setAuthSuccess(true);
      setAuthToken(data.token);
      
      // Update global AuthContext
      login(data.token, { id: data.user.id, email: data.user.email });

      setTimeout(() => {
        setStep("upload");
      }, 700);
    } catch (error) {
      console.error(error);
      setAuthError("Unable to connect to the authentication server. Please try again later.");
      setIsLoading(false);
    }
  };

  const handleUploadSubmit = async () => {
    setUploadError(null);
    if (!uploadedFile) {
      setUploadError("Please upload a PDF resume before continuing.");
      return;
    }

    const token = authToken || localStorage.getItem("lumeerup_token");
    if (!token) {
      setUploadError("Authentication token is missing. Please sign in again.");
      return;
    }

    setIsLoading(true);
    const formDataPayload = new FormData();
    formDataPayload.append("resume", uploadedFile);

    try {
      const response = await fetch("http://localhost:4000/api/v1/resume/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataPayload,
      });

      const data = await response.json();
      if (!response.ok) {
        setUploadError(data.error || "Resume upload failed. Please try again.");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      setUploadError("Unable to upload resume. Please try again later.");
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background flex items-center justify-center p-4">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-purple/20 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-cyan/20 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-brand-blue/10 blur-[100px] pointer-events-none" />

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Logo top-center */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan via-brand-blue to-brand-purple rounded-md rotate-12 opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-bl from-brand-purple via-brand-blue to-brand-cyan rounded-md -rotate-12 opacity-80 mix-blend-overlay" />
          <span className="relative font-bold text-white z-10">L</span>
        </div>
        <span className="text-xl font-bold tracking-widest text-white">LUMEERUP</span>
      </div>

      <AnimatePresence mode="wait">
        {step === "auth" ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Auth Card */}
            <div className="relative p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-[0_0_80px_-20px_rgba(59,130,246,0.3)]">
              {/* Decorative top gradient line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-brand-cyan to-transparent" />

              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">
                  {authMode === "signup" ? "Create Your Account" : "Welcome Back"}
                </h1>
                <p className="text-slate-400 text-sm">
                  {authMode === "signup"
                    ? "Start your AI-powered career journey"
                    : "Continue your career analysis"}
                </p>
              </div>

              {/* Auth mode tabs */}
              <div className="flex p-1 mb-6 rounded-xl bg-white/5 border border-white/10">
                {(["signup", "signin"] as AuthMode[]).map((mode) => (
                  <button
                    key={mode}
                    id={`auth-tab-${mode}`}
                    onClick={() => {
                      setAuthMode(mode);
                      setAuthError(null);
                      setAuthSuccess(false);
                    }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                      authMode === mode
                        ? "bg-white/10 text-white shadow-lg"
                        : "text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    {mode === "signup" ? "Sign Up" : "Sign In"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <AnimatePresence>
                  {authMode === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Full Name
                      </label>
                      <input
                        id="onboarding-name"
                        type="text"
                        required={authMode === "signup"}
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan/50 focus:bg-white/8 transition-all text-sm"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="onboarding-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan/50 focus:bg-white/8 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="onboarding-password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan/50 focus:bg-white/8 transition-all text-sm"
                    />
                    <button
                      type="button"
                      id="toggle-password-visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {authError}
                  </div>
                )}

                <button
                  id="auth-submit-btn"
                  type="submit"
                  disabled={isLoading || authSuccess}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple text-white font-semibold hover:opacity-90 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:scale-100 mt-2 shadow-[0_0_30px_-8px_rgba(32,217,148,0.5)]"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : authSuccess ? (
                    <CheckCircle className="w-4 h-4 text-brand-cyan" />
                  ) : null}
                  {isLoading
                    ? "Processing..."
                    : authSuccess
                    ? "Authenticated!"
                    : authMode === "signup"
                    ? "Create Account & Continue"
                    : "Sign In & Continue"}
                </button>
              </form>

              <div className="space-y-3 mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-cyan shrink-0" />
                  <p className="font-medium text-white">Secure resume upload</p>
                </div>
                <p>
                  After signing in, a secure JWT token is stored locally and automatically included when you upload your resume. This ensures the upload request is authenticated and authorized.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg"
          >
            {/* Upload Card */}
            <div className="relative p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-[0_0_80px_-20px_rgba(168,85,247,0.3)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-brand-purple to-transparent" />

              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Upload Your Resume</h1>
                  <p className="text-slate-400 text-sm">
                    Let our AI decode your professional profile
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-cyan/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-cyan" />
                </div>
              </div>

              {/* Progress steps */}
              <div className="flex items-center gap-2 mb-8 mt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-brand-cyan/20 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-brand-cyan" />
                  </div>
                  <span className="text-xs text-brand-cyan font-medium">Account</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-brand-cyan/50 to-brand-purple/50" />
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-brand-purple/30 border border-brand-purple/50 flex items-center justify-center">
                    <span className="text-xs text-brand-purple font-bold">2</span>
                  </div>
                  <span className="text-xs text-brand-purple font-medium">Resume</span>
                </div>
                <div className="flex-1 h-px bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <span className="text-xs text-slate-500 font-bold">3</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Analysis</span>
                </div>
              </div>

              {/* Drop zone */}
              <div
                id="resume-dropzone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !uploadedFile && fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center p-10 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
                  isDragging
                    ? "border-brand-cyan bg-brand-cyan/10 scale-[1.02]"
                    : uploadedFile
                    ? "border-brand-purple/50 bg-brand-purple/5 cursor-default"
                    : "border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
                }`}
              >
                <input
                  ref={fileInputRef}
                  id="resume-file-input"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <AnimatePresence mode="wait">
                  {uploadedFile ? (
                    <motion.div
                      key="file-preview"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-3 w-full"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-brand-purple/20 flex items-center justify-center">
                        <FileText className="w-7 h-7 text-brand-purple" />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-medium text-sm truncate max-w-[250px]">
                          {uploadedFile.name}
                        </p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          {formatFileSize(uploadedFile.size)} • PDF
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30">
                        <CheckCircle className="w-3 h-3 text-brand-cyan" />
                        <span className="text-xs text-brand-cyan font-medium">Ready for analysis</span>
                      </div>
                      <button
                        id="remove-file-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                        }}
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors mt-1"
                      >
                        <X className="w-3 h-3" />
                        Remove file
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="upload-prompt"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-3 text-center"
                    >
                      <motion.div
                        animate={{ y: isDragging ? -8 : 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-cyan/20 to-brand-blue/20 flex items-center justify-center"
                      >
                        <Upload className="w-7 h-7 text-brand-cyan" />
                      </motion.div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {isDragging ? "Drop your PDF here" : "Drag & drop your resume"}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          or <span className="text-brand-cyan">click to browse</span>
                        </p>
                      </div>
                      <p className="text-slate-600 text-xs">
                        PDF only · Max 5MB
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {uploadError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20"
                  >
                    <X className="w-4 h-4 text-red-400 shrink-0" />
                    <p className="text-xs text-red-400">{uploadError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* What happens next */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { label: "Semantic Parse", icon: "🧠" },
                  { label: "Holistic Score", icon: "📊" },
                  { label: "AI Roadmap", icon: "🚀" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs text-slate-500">{item.label}</span>
                  </div>
                ))}
              </div>

              <button
                id="analyze-resume-btn"
                onClick={handleUploadSubmit}
                disabled={!uploadedFile || isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 mt-6 rounded-xl bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple text-white font-semibold hover:opacity-90 hover:scale-[1.02] transition-all duration-300 disabled:opacity-40 disabled:scale-100 shadow-[0_0_30px_-8px_rgba(168,85,247,0.5)]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze My Resume
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
