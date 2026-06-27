"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  MessageSquare,
  ClipboardCheck,
  Compass,
  Route,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Briefcase,
} from "lucide-react";

// ============================================================
// LUMEERUP — Authenticated App Shell Layout
// Premium sidebar navigation with glassmorphism design
// ============================================================

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "My Profile", icon: UserCircle },
  { href: "/assessment", label: "Assessment", icon: ClipboardCheck },
  { href: "/careers", label: "Career Paths", icon: Compass },
  { href: "/roadmap", label: "Roadmap", icon: Route },
  { href: "/internships", label: "Internships", icon: Briefcase },
  { href: "/chat", label: "AI Advisor", icon: MessageSquare, badge: "AI" },
];

function SidebarLink({
  item,
  isActive,
  isCollapsed,
}: {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link href={item.href} className="block">
      <motion.div
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
          transition-all duration-200 group
          ${
            isActive
              ? "bg-brand-cyan/10 text-white shadow-[inset_0_0_0_1px_rgba(32,217,148,0.2)]"
              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
          }
          ${isCollapsed ? "justify-center px-2.5" : ""}
        `}
      >
        {/* Active indicator bar */}
        {isActive && (
          <motion.div
            layoutId="sidebar-active-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-brand-cyan"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}

        <Icon
          className={`w-[18px] h-[18px] shrink-0 transition-colors ${
            isActive ? "text-brand-cyan" : "text-slate-500 group-hover:text-slate-300"
          }`}
        />

        {!isCollapsed && (
          <span className="truncate">{item.label}</span>
        )}

        {/* Badge */}
        {!isCollapsed && item.badge && (
          <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-gradient-to-r from-brand-cyan to-brand-blue text-white uppercase tracking-wider">
            {item.badge}
          </span>
        )}

        {/* Collapsed tooltip */}
        {isCollapsed && (
          <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-surface-overlay border border-white/10 text-xs text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 shadow-xl">
            {item.label}
            {item.badge && (
              <span className="ml-1.5 px-1 py-0.5 text-[9px] font-bold rounded bg-brand-cyan/20 text-brand-cyan">
                {item.badge}
              </span>
            )}
          </div>
        )}
      </motion.div>
    </Link>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Show nothing while auth is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan via-brand-blue to-brand-purple flex items-center justify-center animate-pulse">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 rounded-full bg-brand-purple animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, the auth-context will redirect.
  // Render children in a simple wrapper while redirecting.
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan via-brand-blue to-brand-purple flex items-center justify-center animate-pulse">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <p className="text-slate-500 text-sm">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* ---- Mobile Overlay ---- */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ---- Sidebar ---- */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          flex flex-col
          bg-[#0a0f1e]/95 backdrop-blur-xl
          border-r border-white/[0.06]
          sidebar-transition
          ${isCollapsed ? "w-[72px]" : "w-[260px]"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo section */}
        <div className={`flex items-center gap-3 px-4 h-16 border-b border-white/[0.06] shrink-0 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan via-brand-blue to-brand-purple rounded-lg rotate-6 opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-bl from-brand-purple via-brand-blue to-brand-cyan rounded-lg -rotate-6 opacity-60 mix-blend-overlay" />
            <span className="relative font-bold text-white text-sm z-10">L</span>
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-sm tracking-[0.2em] text-white uppercase"
            >
              LUMEERUP
            </motion.span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className={`mb-4 ${isCollapsed ? "hidden" : ""}`}>
            <p className="px-3 text-[10px] uppercase tracking-[0.25em] text-slate-600 font-semibold">
              Navigation
            </p>
          </div>

          {NAV_ITEMS.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* Bottom section — user + collapse */}
        <div className="border-t border-white/[0.06] p-3 space-y-2 shrink-0">
          {/* User card */}
          <div
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] ${
              isCollapsed ? "justify-center px-2" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple/30 to-brand-blue/30 border border-white/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">
                  {user?.email || "User"}
                </p>
                <p className="text-[10px] text-slate-500">Free Plan</p>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] transition-all"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ---- Main Content ---- */}
      <main
        className={`flex-1 min-h-screen transition-all duration-300 ${
          isCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        }`}
      >
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-white/[0.06] bg-background/95 backdrop-blur-xl sticky top-0 z-30">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan via-brand-blue to-brand-purple rounded-md rotate-6 opacity-90" />
              <span className="relative font-bold text-white text-[10px] z-10">L</span>
            </div>
            <span className="font-bold text-xs tracking-[0.2em] text-white">LUMEERUP</span>
          </div>

          <button
            onClick={() => setIsMobileOpen(false)}
            className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all ${
              isMobileOpen ? "" : "invisible"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Page content */}
        <div className="relative">
          {/* Ambient background glow */}
          <div className="fixed top-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-brand-cyan/[0.06] blur-[120px] pointer-events-none" />
          <div className="fixed bottom-[-15%] left-[10%] w-[40%] h-[40%] rounded-full bg-brand-purple/[0.06] blur-[120px] pointer-events-none" />

          {children}
        </div>
      </main>
    </div>
  );
}
