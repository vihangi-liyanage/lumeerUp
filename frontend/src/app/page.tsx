"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain, Briefcase, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-purple/20 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-cyan/20 blur-[120px] mix-blend-screen pointer-events-none" />

      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-2">
          {/* Logo Mark representation */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan via-brand-blue to-brand-purple rounded-md rotate-12 opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-bl from-brand-purple via-brand-blue to-brand-cyan rounded-md -rotate-12 opacity-80 mix-blend-overlay" />
            <span className="relative font-bold text-white z-10">L</span>
          </div>
          <span className="text-xl font-bold tracking-widest text-white ml-2">LUMEERUP</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Analytics
          </Link>
          <Link href="/onboarding" className="text-sm font-medium px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-white backdrop-blur-md">
            Sign In
          </Link>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-brand-cyan animate-pulse" />
          <span className="text-xs font-medium text-slate-300">v1.0.0 Platform Live</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 mb-6"
        >
          Your Career Path, <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">
            Algorithmically Decoded.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed"
        >
          Go beyond keyword matching. LUMEERUP uses semantic vectors and deep AI analysis to map your holistic personal brand and align you with the perfect industry opportunities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <Link href="/onboarding">
            <button className="group relative flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto bg-white text-black font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              Analyze My Resume
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="/assessment">
            <button className="flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold rounded-full transition-all duration-300 backdrop-blur-md">
              Quick Assessment
            </button>
          </Link>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full"
        >
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-brand-blue/20 flex items-center justify-center mb-4 text-brand-blue">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Semantic AI Parsing</h3>
            <p className="text-sm text-slate-400">Contextual evaluation of your skills, overriding basic rigid keywords.</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center mb-4 text-brand-purple">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Holistic Matrix</h3>
            <p className="text-sm text-slate-400">We evaluate the perfect mix of hard skills, behavior, and communication.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-brand-cyan/20 flex items-center justify-center mb-4 text-brand-cyan">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Dynamic Roadmaps</h3>
            <p className="text-sm text-slate-400">Receive algorithmic steps to bridge the gap to your target role instantly.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
