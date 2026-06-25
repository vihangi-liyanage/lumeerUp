"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(32,217,148,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),transparent_30%)] pointer-events-none" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6">
        <nav className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="relative h-12 w-12 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_30px_-20px_rgba(255,255,255,0.85)]">
              <Image src="/logo.png" alt="LUMEERUP logo" fill className="object-contain" />
            </Link>
            <span className="text-sm font-semibold uppercase tracking-[0.35em] text-white">LUMEERUP</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 sm:gap-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/onboarding" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10">Login</Link>
          </div>
        </nav>

        <main className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300"
            >
              <Sparkles className="h-4 w-4 text-brand-cyan" />
              AI Powered Career Guidance
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="text-5xl font-extrabold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-300 md:text-6xl xl:text-7xl"
            >
              Unlock Your Potential,
              <br />
              Shape Your Future
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-slate-300"
            >
              Gain personalized career guidance through intelligent analysis of your strengths, interests, and qualifications. Discover careers that align with who you are and where you want to go.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Link href="/onboarding" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-brand-cyan px-8 py-4 text-sm font-semibold text-slate-950 shadow-[0_24px_80px_-30px_rgba(32,217,148,0.85)] transition-all"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Link>

              <Link href="/assessment" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  Take Quick Assessment
                </motion.button>
              </Link>
            </motion.div>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24 }}
              className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300 shadow-[0_0_50px_-25px_rgba(32,217,148,0.25)]"
            >
              <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.35em] text-brand-cyan">How It Works</p>
                <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Your career journey in 5 steps</h2>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {[
                  {
                    title: 'Step 1',
                    heading: 'Create Your Profile',
                    description: 'Register and provide your academic and personal information.',
                  },
                  {
                    title: 'Step 2',
                    heading: 'Complete Assessments',
                    description: 'Evaluate your skills, strengths, and interests.',
                  },
                  {
                    title: 'Step 3',
                    heading: 'Upload Your Resume',
                    description: 'Allow AI to analyze your qualifications and experience.',
                  },
                  {
                    title: 'Step 4',
                    heading: 'Receive Recommendations',
                    description: 'Discover suitable career paths and opportunities.',
                  },
                  {
                    title: 'Step 5',
                    heading: 'Follow Your Roadmap',
                    description: 'Track progress and develop the skills needed for success.',
                  },
                ].map((step) => (
                  <div
                    key={step.title}
                    className="rounded-3xl border border-white/10 bg-slate-950/30 p-6 transition hover:-translate-y-1 hover:border-brand-cyan/30 hover:bg-slate-900/70"
                  >
                    <p className="text-sm uppercase tracking-[0.35em] text-brand-cyan">{step.title}</p>
                    <h3 className="mt-3 text-xl font-semibold text-white">{step.heading}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{step.description}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
        </main>
      </div>
    </div>
  );
}
