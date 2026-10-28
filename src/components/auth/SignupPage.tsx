import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  Building, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from './AuthLayout';
import { TermsModal } from './TermsModal';
import { UserRole } from '../../types';

export const SignupPage: React.FC = () => {
  const { signup, error, clearError, setActiveScreen } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Accreditation Inspector');
  const [organization, setOrganization] = useState('AICTE Empanelled Scrutiny Board');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Real-time password criteria
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const criteriaCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthLabel = criteriaCount <= 2 ? 'Weak' : criteriaCount <= 4 ? 'Moderate' : 'Strong';
  const strengthColor = criteriaCount <= 2 ? 'bg-rose-500' : criteriaCount <= 4 ? 'bg-amber-500' : 'bg-emerald-500';

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full legal name (minimum 2 characters).';
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please provide a valid official or institutional email.';
    }

    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      errors.password = 'Password does not meet the regulatory complexity requirements.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!termsAccepted) {
      errors.terms = 'You must accept the AICTE Regulatory Undertaking to register.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await signup({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        role,
        organization: organization.trim(),
        termsAccepted,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create Officer / Auditor Account"
      subtitle="Register an empanelled account for technical scrutiny and accreditation"
    >
      {/* Error Alert */}
      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-200 flex items-start gap-3 text-xs leading-relaxed animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Registration Error</span>
            <span>{error}</span>
          </div>
          <button onClick={clearError} className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200">
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Full Name (with Honorific/Designation)
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (validationErrors.fullName) setValidationErrors(prev => ({ ...prev, fullName: '' }));
              }}
              placeholder="e.g. Dr. Rajesh Kumar, Ph.D."
              className={`w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/80 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-colors ${
                validationErrors.fullName ? 'border-rose-400 dark:border-rose-600' : 'border-slate-300 dark:border-slate-700'
              }`}
            />
          </div>
          {validationErrors.fullName && (
            <p className="mt-1 text-[11px] text-rose-500">{validationErrors.fullName}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Official / Institutional Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: '' }));
              }}
              placeholder="e.g. rajesh.kumar@aicte.gov.in"
              autoComplete="email"
              className={`w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/80 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-colors ${
                validationErrors.email ? 'border-rose-400 dark:border-rose-600' : 'border-slate-300 dark:border-slate-700'
              }`}
            />
          </div>
          {validationErrors.email && (
            <p className="mt-1 text-[11px] text-rose-500">{validationErrors.email}</p>
          )}
        </div>

        {/* Role & Bureau */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Designation / Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-colors"
            >
              <option value="Senior Scrutiny Officer">Senior Scrutiny Officer</option>
              <option value="Accreditation Inspector">Accreditation Inspector</option>
              <option value="Regional Director">Regional Director</option>
              <option value="Institutional Registrar">Institutional Registrar</option>
              <option value="Auditor">Compliance Auditor</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Regional Office / Board
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="AICTE Regional Board"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Master Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: '' }));
              }}
              placeholder="Min. 8 chars with uppercase, number & symbol"
              className={`w-full pl-10 pr-10 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/80 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-colors ${
                validationErrors.password ? 'border-rose-400 dark:border-rose-600' : 'border-slate-300 dark:border-slate-700'
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

          {/* Password Strength Meter */}
          {password.length > 0 && (
            <div className="mt-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Security Strength:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{strengthLabel}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strengthColor}`}
                  style={{ width: `${(criteriaCount / 5) * 100}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                <span className={hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}>
                  ✓ 8+ Characters
                </span>
                <span className={hasUppercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}>
                  ✓ Uppercase (A-Z)
                </span>
                <span className={hasLowercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}>
                  ✓ Lowercase (a-z)
                </span>
                <span className={(hasNumber && hasSpecial) ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}>
                  ✓ Number & Symbol
                </span>
              </div>
            </div>
          )}
          {validationErrors.password && (
            <p className="mt-1 text-[11px] text-rose-500">{validationErrors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (validationErrors.confirmPassword) setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
              }}
              placeholder="Re-enter your master password"
              className={`w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/80 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-colors ${
                validationErrors.confirmPassword ? 'border-rose-400 dark:border-rose-600' : 'border-slate-300 dark:border-slate-700'
              }`}
            />
          </div>
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-[11px] text-rose-500">{validationErrors.confirmPassword}</p>
          )}
        </div>

        {/* Terms & Conditions */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => {
                setTermsAccepted(e.target.checked);
                if (validationErrors.terms) setValidationErrors(prev => ({ ...prev, terms: '' }));
              }}
              className="w-4 h-4 mt-0.5 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shrink-0"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
              I agree to the{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTermsModal(true);
                }}
                className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
              >
                AICTE Regulatory Compliance & Verification Terms
              </button>{' '}
              and certify that I am an authorized scrutiny personnel.
            </span>
          </label>
          {validationErrors.terms && (
            <p className="mt-1 text-[11px] text-rose-500">{validationErrors.terms}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-3 py-2.5 sm:py-3 px-4 flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:from-cyan-700 active:to-blue-700 disabled:opacity-60 shadow-md shadow-cyan-950/20 transition-all cursor-pointer min-h-[44px]"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Registering Officer Profile...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Create Account & Enter Portal</span>
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-5 text-center text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800">
        <span>Already have an authorized account? </span>
        <button
          type="button"
          onClick={() => setActiveScreen('login')}
          className="font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
        >
          <span>Sign In</span>
          <ArrowLeft className="w-3 h-3 rotate-180" />
        </button>
      </div>

      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </AuthLayout>
  );
};
