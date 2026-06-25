"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, BarChart3, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden px-6 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(32,217,148,0.18),transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),transparent_20%)] pointer-events-none" />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-brand-cyan/30 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-[0_0_80px_-40px_rgba(32,217,148,0.25)]"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-cyan">About Us</p>
              <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
                Intelligent career guidance designed to move with you.
              </h1>
            </div>
            <div className="rounded-3xl bg-slate-950/40 p-6 text-sm text-slate-300 shadow-[0_0_40px_-20px_rgba(255,255,255,0.12)]">
              <p className="font-medium text-white">Why LUMEERUP matters</p>
              <p className="mt-3 leading-7">
                We combine resume understanding, behavior assessment, and AI-driven roadmaps so you can discover career paths aligned with your skills and goals.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Smart analysis",
                description: "We parse your resume and assessment data to produce personalized career suggestions.",
                icon: <Sparkles className="w-5 h-5 text-brand-cyan" />,
              },
              {
                title: "Secure workflow",
                description: "Every file upload is authenticated with JWT and protected by secure backend validation.",
                icon: <ShieldCheck className="w-5 h-5 text-brand-blue" />,
              },
              {
                title: "Actionable roadmap",
                description: "You get clear next steps and milestones so progress feels tangible every week.",
                icon: <BarChart3 className="w-5 h-5 text-brand-purple" />,
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="rounded-3xl border border-white/10 bg-slate-950/30 p-6"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/5 text-brand-cyan">
                  {feature.icon}
                </div>
                <h2 className="mt-5 text-xl font-semibold text-white">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
