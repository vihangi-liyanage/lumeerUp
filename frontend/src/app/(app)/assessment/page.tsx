"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const questions = [
  {
    id: 1,
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
    text: "You discover a severe bug in production introduced by a colleague. What is your approach?",
    options: [
      "Fix it quietly to avoid team conflict.",
      "Highlight it in the public channel so everyone is aware.",
      "Collaborate privately with them to resolve and document a post-mortem.",
      "Revert the commit immediately and assign them a bug ticket."
    ]
  }
];

export default function AssessmentPage() {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSelect = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = idx;
    setAnswers(newAnswers);
    
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsCompleted(true);
      }
    }, 400); // Small delay for UX flow
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-background text-white flex flex-col relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-brand-cyan/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] rounded-full bg-brand-purple/10 blur-[120px] pointer-events-none" />

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        {!isCompleted && (
          <div className="w-full max-w-2xl flex justify-between items-center mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Career Assessment</span>
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
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-4">Behavioral Matrix Analyzed</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Your responses have been processed to calculate your baseline communication and behavioral scores. Let's combine this with your technical skills.
              </p>
              <Link href="/onboarding">
                <button className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition-all shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]">
                  Continue to Resume Upload <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
