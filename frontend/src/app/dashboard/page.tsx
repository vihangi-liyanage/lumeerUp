"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Activity, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AnalyticsDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const stats = [
    { label: "Active Opportunities", value: "12,450", trend: "+14%", icon: BriefcaseIcon },
    { label: "Avg. Match Rate", value: "86%", trend: "+5%", icon: Activity },
    { label: "Skills Validated", value: "450k+", trend: "+22%", icon: Zap },
    { label: "Talent Pool", value: "89,200", trend: "+12%", icon: Users },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-white p-6 md:p-12 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-brand-cyan/10 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none" />

      <nav className="flex items-center justify-between mb-12 relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan via-brand-blue to-brand-purple rounded-md rotate-12 opacity-80" />
            <span className="relative font-bold text-white z-10">L</span>
          </div>
        </Link>
        <Link href="/assessment">
          <button className="px-5 py-2 text-sm font-semibold rounded-full bg-white text-black hover:scale-105 transition-transform shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
            Take Assessment
          </button>
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Market Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">Analytics</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl"
          >
            Explore real-time industry trends and discover how the Personal Brand Equation is shifting the hiring landscape.
          </motion.p>
        </header>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-white/5 text-slate-300">
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-brand-green text-sm font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Dashboard Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md min-h-[400px] flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-semibold">Demand by Skill Cluster</h3>
              <button className="text-sm text-brand-cyan hover:text-white transition-colors flex items-center gap-1">
                Detailed Report <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 flex items-end justify-between gap-2 md:gap-6 pt-10">
              {[60, 85, 45, 90, 75, 50, 100].map((height, i) => (
                <div key={i} className="relative flex-1 group">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className="w-full bg-gradient-to-t from-brand-purple/20 to-brand-cyan rounded-t-md opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-slate-500 border-t border-white/10 pt-4">
              <span>Frontend</span>
              <span>Backend</span>
              <span>DevOps</span>
              <span>AI/ML</span>
              <span>Data</span>
              <span>Mobile</span>
              <span>Cloud</span>
            </div>
          </motion.div>

          {/* Personal Brand Equation Highlight */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-brand-purple/10 to-brand-blue/10 border border-brand-blue/20 backdrop-blur-md flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">The Personal Brand Equation</h3>
              <p className="text-sm text-slate-400 mb-6">Discover where you stand in the market by evaluating the three core pillars of professional value.</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Technical Skills</span>
                  <span className="text-sm font-bold text-brand-cyan">40% Impact</span>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-cyan w-[40%]" />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-slate-300">Behavioral Persona</span>
                  <span className="text-sm font-bold text-brand-blue">30% Impact</span>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-blue w-[30%]" />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-slate-300">Communication</span>
                  <span className="text-sm font-bold text-brand-purple">30% Impact</span>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-purple w-[30%]" />
                </div>
              </div>
            </div>

            <Link href="/assessment" className="mt-8">
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white font-medium transition-all flex justify-center items-center gap-2">
                Evaluate Your Brand <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// Simple fallback icon for the top grid
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BriefcaseIcon(props: any) {
  return (
    <svg
      {...props}
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
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
