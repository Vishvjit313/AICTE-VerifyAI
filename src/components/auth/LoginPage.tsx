import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from './AuthLayout';

export const LoginPage: React.FC = () => {
  const { login, error, clearError, setActiveScreen } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email format.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(email.trim(), password, rememberMe);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    clearError();
    setFieldErrors({});
  };

  return (
    <AuthLayout
      title="Council Scrutiny Portal Sign In"
      subtitle="Authorized access for AICTE Scrutiny Officers & Technical Evaluators"
    >
      {/* Error Alert */}
      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-200 flex items-start gap-3 text-xs leading-relaxed animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Authentication Warning</span>
            <span>{error}</span>
          </div>
          <button
            onClick={clearError}
            className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
              }}
              placeholder="officer@aicte.gov.in"
              autoComplete="email"
              className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/80 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-colors ${
                fieldErrors.email ? 'border-rose-400 dark:border-rose-600' : 'border-slate-300 dark:border-slate-700'
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-1 text-[11px] text-rose-500">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <button
              type="button"
              onClick={() => setActiveScreen('forgot-password')}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
              }}
              placeholder="••••••••••••"
              autoComplete="current-password"
              className={`w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/80 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-colors ${
                fieldErrors.password ? 'border-rose-400 dark:border-rose-600' : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1 text-[11px] text-rose-500">{fieldErrors.password}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Remember me on this workstation (30 days)
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-2.5 sm:py-3 px-4 flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:from-cyan-700 active:to-blue-700 disabled:opacity-60 shadow-md shadow-cyan-950/20 transition-all cursor-pointer min-h-[44px]"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying Credentials & Session...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In to VerifyAI Workspace</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Test Login Credentials */}
      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-cyan-500" />
          <span>Quick Evaluation Logins</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleUseDemoAccount('officer@aicte.gov.in', 'AicteVerify@2026')}
            className="p-2.5 rounded-lg text-left border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-cyan-500">
                Scrutiny Officer
              </span>
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">HQ Desk</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              officer@aicte.gov.in
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleUseDemoAccount('ananya.sen@aicte.edu.in', 'NewSecure@2027')}
            className="p-2.5 rounded-lg text-left border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-cyan-500">
                Accreditation Inspector
              </span>
              <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">Regional</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              ananya.sen@aicte.edu.in
            </p>
          </button>
        </div>
      </div>

      {/* Switch to Signup */}
      <div className="mt-5 text-center text-xs text-slate-600 dark:text-slate-400">
        <span>Need officer accreditation access? </span>
        <button
          type="button"
          onClick={() => setActiveScreen('signup')}
          className="font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
        >
          <span>Create an Account</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </AuthLayout>
  );
};
