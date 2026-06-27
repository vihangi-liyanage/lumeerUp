"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";

// ============================================================
// LUMEERUP — Interactive Career Assessment
// Scenario-driven evaluation across technical and behavioral domains
// ============================================================

const questions = [
  {
    id: 1,
    category: "Behavioral Persona",
    text: "When a critical project requirement changes abruptly, what is your immediate response?",
    options: [
      "Analyze the impact and formulate an updated execution plan.",
      "Inform the team and wait for further managerial directives.",
      "Immediately begin coding the new requirements to save time.",
      "Push back on the change to protect the current sprint."
    ]
  },
  {
    id: 2,
    category: "Communication",
    text: "How do you prefer to articulate complex technical concepts to non-technical stakeholders?",
    options: [
      "Use high-level analogies connecting tech to business value.",
      "Provide detailed architecture diagrams and schemas.",
      "Avoid technical deep dives and only share the final output.",
      "Invite them to daily stand-ups to follow the technical progress."
    ]
  },
  {
    id: 3,
    category: "Behavioral Persona",
    text: "You discover a severe bug in production introduced by a colleague. What is your approach?",
    options: [
      "Collaborate privately with them to resolve and document a post-mortem.",
      "Fix it quietly to avoid team conflict.",
      "Highlight it in the public channel so everyone is aware.",
      "Revert the commit immediately and assign them a bug ticket."
    ]
  },
  {
    id: 4,
    category: "Technical Methodology",
    text: "A database query is executing slowly in production. How do you troubleshoot?",
    options: [
      "Analyze query execution plans (EXPLAIN) and check table indexes.",
      "Add a caching layer like Redis without inspecting the query.",
      "Upgrade the database server's CPU and RAM immediately.",
      "Rewrite the query into code logic in the application."
    ]
  },
  {
    id: 5,
    category: "Situational Judgment",
    text: "Your team is divided between two technical architectures for a new service. How is this resolved?",
    options: [
      "Build quick proof-of-concepts for both and compare metrics.",
      "Vote on it as a team and follow the majority rule.",
      "Choose the simpler architecture to save development time.",
      "Ask the lead developer to make a top-down decision."
    ]
  },
  {
    id: 6,
    category: "Behavioral Persona",
    text: "You are given a task with a framework you have never used before. What is your next move?",
    options: [
      "Spend a few hours building a sandbox app and reading docs.",
      "Start writing code immediately and look up errors on the fly.",
      "Ask a senior developer to pair-program the entire task.",
      "Request to be reassigned to a task using a familiar framework."
    ]
  },
  {
    id: 7,
    category: "Communication",
    text: "How do you handle a situation where you realize your task will miss its sprint deadline?",
    options: [
      "Flag it early in daily standup, explaining blockers and options.",
      "Work overnight secretly to finish it before anyone notices.",
      "Push the blame onto dependent APIs or delayed review pipelines.",
      "Wait until the sprint review to explain why it was not completed."
    ]
  },
  {
    id: 8,
    category: "Technical Methodology",
    text: "What is your primary consideration when designing public REST API endpoints?",
    options: [
      "Backward compatibility, structured error codes, and strict validation.",
      "Minimizing database round-trips regardless of payload structures.",
      "Exposing internal database schema directly for convenience.",
      "Encrypting all query parameters and JSON payloads."
    ]
  },
  {
    id: 9,
    category: "Situational Judgment",
    text: "A client reports an issue that you cannot replicate in development. What is your action?",
    options: [
      "Gather logs, inspect production database states, and check environment settings.",
      "Push a debug patch directly to production to inspect variables.",
      "Re-install all dependencies and re-deploy the container.",
      "Inform the client that it works on your machine and close the issue."
    ]
  },
  {
    id: 10,
    category: "Behavioral Persona",
    text: "During a code review, a teammate suggests major changes to your implementation. What is your reaction?",
    options: [
      "Review the feedback objectively and discuss trade-offs in comments.",
      "Accept all changes blindly to avoid delay or argument.",
      "Explain that your code works fine and changes are unnecessary.",
      "Reject the review and ask a different developer to approve your PR."
    ]
  },
  {
    id: 11,
    category: "Technical Methodology",
    text: "When scaling an application to support 10x traffic, which bottleneck is prioritized first?",
    options: [
      "Database connection pooling, read replicas, and query optimization.",
      "Re-writing the backend in a low-level language like C++.",
      "Upgrading client-side JavaScript bundle sizes.",
      "Adding custom CSS animations and static layouts."
    ]
  },
  {
    id: 12,
    category: "Situational Judgment",
    text: "You notice a critical security configuration issue in a third-party dependency. What do you do?",
    options: [
      "Research fixes, check for package updates, and apply patches immediately.",
      "Ignore it as it belongs to an external package.",
      "Delete the dependency and build a custom library from scratch.",
      "Wait for a security audit report next quarter to address it."
    ]
  },
  {
    id: 13,
    category: "Communication",
    text: "Your project manager requests a feature that contradicts good UX design guidelines. What do you do?",
    options: [
      "Show data or design mockups of alternative approaches to discuss usability.",
      "Implement it exactly as requested without voicing concerns.",
      "Implement a hidden toggle to turn the feature off.",
      "Refuse to develop the feature and escalate it to executives."
    ]
  },
  {
    id: 14,
    category: "Technical Methodology",
    text: "What is your testing philosophy when writing code for production applications?",
    options: [
      "Write unit tests for core logical branches and integration tests for critical flows.",
      "Write unit tests only when required by CI/CD coverage thresholds.",
      "Manual browser testing is sufficient; automated tests add too much overhead.",
      "Deploy code to production and let real users report issues."
    ]
  },
  {
    id: 15,
    category: "Situational Judgment",
    text: "You have completed your sprint goals early. What do you do with the remaining time?",
    options: [
      "Clean up technical debt, update documentation, or help blockers.",
      "Pick up a high-complexity card from backlog without informing anyone.",
      "Refactor code that is working fine to look cleaner.",
      "Take a break and log off early since sprint goals are met."
    ]
  }
];

export default function AssessmentPage() {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSelect = async (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = idx;
    setAnswers(newAnswers);
    
    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 350);
    } else {
      // Submitting assessment
      setIsSubmitting(true);
      if (isAuthenticated) {
        try {
          await apiFetch("/api/v1/assessment/submit", {
            method: "POST",
            body: JSON.stringify({ answers: newAnswers }),
          });
        } catch (error) {
          console.error("Failed to submit assessment to backend:", error);
        }
      } else {
        // Save locally for guest users, will be uploaded on registration
        localStorage.setItem("lumeerup_pending_assessment", JSON.stringify(newAnswers));
      }
      setIsSubmitting(false);
      setIsCompleted(true);
    }
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-background text-white flex flex-col relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-brand-cyan/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] rounded-full bg-brand-purple/10 blur-[120px] pointer-events-none" />

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        {!isCompleted && (
          <div className="w-full max-w-2xl flex justify-between items-center mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-brand-cyan" />
              {questions[currentStep].category}
            </span>
            <span>Step {currentStep + 1} of {questions.length}</span>
          </div>
        )}
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              <div className="mb-8">
                <button 
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-1 text-sm mb-6 transition-colors ${currentStep === 0 ? 'text-transparent cursor-default' : 'text-slate-400 hover:text-white'}`}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="flex gap-2 mb-6">
                  {questions.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= currentStep ? 'bg-gradient-to-r from-brand-cyan to-brand-blue' : 'bg-white/10'}`} 
                    />
                  ))}
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold leading-tight">
                  {questions[currentStep].text}
                </h2>
              </div>

              <div className="space-y-3">
                {questions[currentStep].options.map((option, idx) => {
                  const isSelected = answers[currentStep] === idx;
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSelect(idx)}
                      className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex justify-between items-center ${
                        isSelected 
                          ? 'bg-brand-blue/10 border-brand-blue text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]' 
                          : 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05] hover:border-white/20'
                      }`}
                    >
                      <span className="text-lg">{option}</span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-blue" />}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="completion"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-xl text-center p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 mx-auto bg-gradient-to-tr from-brand-cyan to-brand-blue rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_-5px_rgba(32,217,148,0.4)]"
              >
                {isSubmitting ? (
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                ) : (
                  <CheckCircle2 className="w-10 h-10 text-white" />
                )}
              </motion.div>
              <h2 className="text-3xl font-bold mb-4">Behavioral Matrix Analyzed</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Your responses have been processed to calculate your baseline communication and behavioral scores. Let's combine this with your technical skills.
              </p>
              <Link href={isAuthenticated ? "/dashboard" : "/onboarding"}>
                <button className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition-all shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]">
                  {isAuthenticated ? "Go to Dashboard" : "Continue to Resume Upload"} <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Simple loader icon
function Loader2({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
