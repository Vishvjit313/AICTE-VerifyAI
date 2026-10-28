import React from 'react';
import { ShieldCheck, Lock, Award, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#F8FAFC] dark:bg-[#0B1120] bg-tech-grid text-[#0F172A] dark:text-[#F8FAFC] selection:bg-cyan-500/30 selection:text-cyan-800 dark:selection:text-cyan-200 transition-colors duration-200">
      {/* Top Utility Bar */}
      <header className="w-full px-4 sm:px-8 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-cyan-500/40 bg-slate-100 dark:bg-[#0b1736] shrink-0 shadow-sm flex items-center justify-center">
            <img 
              src="/src/assets/images/aicte_emblem_seal_1793170320069.jpg" 
              alt="AICTE Seal" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                AICTE VerifyAI
              </span>
              <span className="font-mono text-[10px] text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-800/60 px-2 py-0.5 rounded-full font-medium">
                APH 2026-27
              </span>
            </div>
            <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
              National Technical Education Accreditation & Regulatory Intelligence Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>256-bit Encrypted Session</span>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Main Form Center Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          {/* Card Frame */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-cyan-950/20 p-6 sm:p-8 transition-colors duration-200 relative overflow-hidden">
            {/* Ambient subtle glow at top */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600" />

            {/* Header Titles */}
            <div className="mb-6 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            </div>

            {children}
          </div>

          {/* Security Compliance Guarantee Footnote */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-center text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Cryptographic Scrypt Hashing</span>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Official Regulatory Scrutiny Standards</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-3 px-6 border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-[#111827]/50 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>All India Council for Technical Education · AICTE VerifyAI Intelligence Portal</p>
        <p className="font-mono text-[11px] text-slate-400 dark:text-slate-500">Security Standard ISO/IEC 27001</p>
      </footer>
    </div>
  );
};
