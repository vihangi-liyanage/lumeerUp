"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Sparkles,
  FileText,
  TrendingUp,
  Map,
  Loader2,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  {
    icon: <FileText className="w-4 h-4" />,
    label: "Analyze my skills gap",
    prompt: "Based on my resume, what are the key skill gaps I need to address for senior roles?",
  },
  {
    icon: <TrendingUp className="w-4 h-4" />,
    label: "Career path advice",
    prompt: "What career path would you recommend for someone with my background to reach a Director-level position?",
  },
  {
    icon: <Map className="w-4 h-4" />,
    label: "Build my roadmap",
    prompt: "Create a 12-month personalized career roadmap with milestones and actionable steps for me.",
  },
];

const INITIAL_MESSAGE: Message = {
  id: "initial",
  role: "assistant",
  content:
    "Hello! I'm your **LUMEERUP AI Career Advisor** — powered by semantic intelligence to guide your career journey.\n\nI've analyzed your profile and I'm ready to provide personalized insights on:\n- 🎯 **Skill gap analysis** against target roles\n- 📈 **Strategic career path mapping**\n- 🗺️ **Personalized growth roadmaps**\n- 💼 **Personal branding advice**\n\nWhat would you like to explore today?",
  timestamp: new Date(),
};

// Mock AI responses for demo
const DEMO_RESPONSES = [
  "Based on your resume analysis, I've identified **3 critical skill gaps** for senior engineering roles:\n\n1. **System Design** — Your experience lacks large-scale distributed systems design. I recommend working through 'Designing Data-Intensive Applications' and contributing to open-source infrastructure projects.\n\n2. **Leadership Indicators** — While you have technical depth, your resume doesn't showcase team leadership. Consider leading a cross-functional project or mentoring junior engineers.\n\n3. **Cloud Architecture (AWS/GCP)** — Adding cloud certifications (AWS Solutions Architect) would dramatically increase your marketability.\n\nWould you like a detailed 90-day plan to close these gaps?",
  "Excellent question! Based on your holistic profile score of **78/100**, here's your recommended career trajectory:\n\n**Phase 1 (0–6 months):** Transition to a Tech Lead role at your current company. Focus on:\n- Owning 2+ major technical decisions\n- Conducting code reviews and mentoring\n\n**Phase 2 (6–18 months):** Move to a Senior Engineer / Staff Engineer role at a growth-stage startup. This will accelerate your leadership exposure.\n\n**Phase 3 (18–36 months):** Target Director of Engineering positions. By this point, you'll have the technical credibility + team leadership experience needed.\n\nYour strongest assets are your **communication score (92/100)** and **problem-solving consistency**. Leverage those!",
  "Here's your **12-Month Career Roadmap** 🚀\n\n**Q1 (Months 1–3): Foundation**\n- Complete AWS Solutions Architect certification\n- Contribute to 2 open-source projects\n- Start a technical blog documenting your work\n\n**Q2 (Months 4–6): Visibility**\n- Speak at a local tech meetup\n- Lead an internal hackathon or innovation sprint\n- Build a portfolio project showcasing system design skills\n\n**Q3 (Months 7–9): Positioning**\n- Update LinkedIn with keyword-optimized content\n- Request a formal Tech Lead designation or begin job search\n- Network with 3 senior engineers monthly\n\n**Q4 (Months 10–12): Action**\n- Apply to 10 targeted senior/staff roles\n- Negotiate 30–40% compensation increase\n- Establish mentoring relationships\n\n**Projected Outcome:** Senior/Staff Engineer role with 35% salary increase. Confidence Level: **87%**",
];

function formatMessage(content: string) {
  // Simple markdown-like formatting
  const lines = content.split("\n");
  return lines.map((line, i) => {
    // Bold text
    const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Bullet points
    if (line.startsWith("- ")) {
      return (
        <li
          key={i}
          className="ml-4 text-slate-300 text-sm"
          dangerouslySetInnerHTML={{ __html: "• " + formatted.slice(2) }}
        />
      );
    }
    if (line.trim() === "") return <div key={i} className="h-2" />;
    return (
      <p
        key={i}
        className="text-sm text-slate-300 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    );
  });
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [responseIndex, setResponseIndex] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, scrollToBottom]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const simulateStreaming = useCallback(
    async (text: string) => {
      setIsStreaming(true);
      setStreamingText("");
      const words = text.split(" ");
      for (let i = 0; i < words.length; i++) {
        await new Promise((r) => setTimeout(r, 30 + Math.random() * 20));
        setStreamingText((prev) => (prev ? prev + " " + words[i] : words[i]));
      }
      setIsStreaming(false);
      setStreamingText("");
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    },
    []
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      // Simulate API delay then stream response
      await new Promise((r) => setTimeout(r, 600));
      const response = DEMO_RESPONSES[responseIndex % DEMO_RESPONSES.length];
      setResponseIndex((prev) => prev + 1);
      await simulateStreaming(response);
    },
    [isStreaming, responseIndex, simulateStreaming]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-resize
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="relative h-screen overflow-hidden bg-background flex flex-col">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-purple/10 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-cyan/10 blur-[120px] mix-blend-screen pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-white/[0.02] backdrop-blur-xl shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            id="chat-back-link"
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-cyan via-brand-blue to-brand-purple flex items-center justify-center shadow-[0_0_15px_-3px_rgba(32,217,148,0.5)]">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-brand-cyan rounded-full border-2 border-background" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">LUMEERUP Advisor</p>
              <p className="text-xs text-brand-cyan">AI-Powered · Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="chat-new-conversation"
            onClick={() => {
              setMessages([INITIAL_MESSAGE]);
              setResponseIndex(0);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-white/8"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            New Chat
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-white/8"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Analytics
          </Link>
        </div>
      </header>

      {/* Messages area */}
      <div
        ref={chatContainerRef}
        id="chat-messages-container"
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div className="shrink-0">
                  {msg.role === "assistant" ? (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-purple flex items-center justify-center shadow-[0_0_10px_-2px_rgba(32,217,148,0.4)]">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`flex flex-col gap-1 max-w-[80%] ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-brand-blue/30 to-brand-purple/30 border border-brand-blue/20 rounded-tr-sm"
                        : "bg-white/[0.04] border border-white/8 rounded-tl-sm"
                    }`}
                  >
                    <div className="space-y-1">{formatMessage(msg.content)}</div>
                  </div>
                  <span className="text-[10px] text-slate-600 px-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Streaming message */}
            {isStreaming && (
              <motion.div
                key="streaming"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-purple flex items-center justify-center shrink-0 shadow-[0_0_10px_-2px_rgba(32,217,148,0.4)]">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/8 rounded-tl-sm">
                  {streamingText ? (
                    <div className="space-y-1">
                      {formatMessage(streamingText)}
                      <span className="inline-block w-1.5 h-4 bg-brand-cyan animate-pulse ml-1 rounded-full align-middle" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 py-1">
                      <span className="w-2 h-2 rounded-full bg-brand-cyan animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 rounded-full bg-brand-purple animate-bounce [animation-delay:300ms]" />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToBottom}
            id="scroll-to-bottom-btn"
            className="absolute bottom-24 right-6 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all backdrop-blur-md z-10"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Suggested prompts (show when few messages) */}
      {messages.length <= 1 && !isStreaming && (
        <div className="px-4 pb-3 max-w-3xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SUGGESTED_PROMPTS.map((p) => (
              <button
                key={p.label}
                id={`suggested-prompt-${p.label.replace(/\s+/g, "-").toLowerCase()}`}
                onClick={() => sendMessage(p.prompt)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/8 text-left hover:bg-white/[0.07] hover:border-white/15 transition-all group"
              >
                <span className="text-brand-cyan group-hover:scale-110 transition-transform">
                  {p.icon}
                </span>
                <span className="text-xs text-slate-400 group-hover:text-white transition-colors">
                  {p.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-4 pb-4 shrink-0 z-10">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 p-2 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)] focus-within:border-white/20 transition-colors">
            <div className="flex items-center px-2 pb-1.5 shrink-0">
              <Sparkles className="w-4 h-4 text-brand-cyan" />
            </div>
            <textarea
              ref={textareaRef}
              id="chat-input"
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask your AI career advisor anything..."
              rows={1}
              disabled={isStreaming}
              className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-600 resize-none focus:outline-none py-2 max-h-[150px] disabled:opacity-50"
            />
            <button
              id="chat-send-btn"
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isStreaming}
              className="shrink-0 w-9 h-9 mb-0.5 rounded-xl flex items-center justify-center bg-gradient-to-br from-brand-cyan to-brand-purple disabled:opacity-30 hover:scale-110 transition-all active:scale-95 shadow-[0_0_15px_-4px_rgba(32,217,148,0.6)]"
            >
              {isStreaming ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-600 mt-2">
            LUMEERUP AI may produce inaccurate information. Always verify career decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
