import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  ShieldCheck, 
  Cpu, 
  Bell, 
  Sliders, 
  Check, 
  Save, 
  RotateCcw,
  Sun,
  Moon,
  User,
  LogOut,
  Lock,
  Award
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const SettingsView: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const [handbookVersion, setHandbookVersion] = useState('APH_2026_27');
  const [scrutinyMode, setScrutinyMode] = useState('standard');
  const [ocrConfidence, setOcrConfidence] = useState(95);
  const [landTolerance, setLandTolerance] = useState(0.05);
  const [notifyFireLapse, setNotifyFireLapse] = useState(true);
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const handleSave = () => {
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
    }, 3000);
  };

  const handleReset = () => {
    setHandbookVersion('APH_2026_27');
    setScrutinyMode('standard');
    setOcrConfidence(95);
    setLandTolerance(0.05);
    setNotifyFireLapse(true);
    setAutoEscalate(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto transition-colors duration-200">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Regulatory Norms & Verification Engine Configuration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            System & Norms Settings
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Configure Council verification parameters, appearance themes, and automated tolerance thresholds.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors min-h-[40px] flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-sm transition-all min-h-[40px] flex items-center gap-1.5 cursor-pointer"
          >
            {showSavedFeedback ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{showSavedFeedback ? 'Saved Successfully!' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-5">
        {/* Section 0: User Profile & Session Security */}
        <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Active Scrutiny Officer Profile
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded font-semibold">
              Authenticated Session
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base border border-cyan-400/40 shadow-sm">
                {user?.avatarInitials || (user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AU')}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {user?.fullName || 'Authenticated User'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.email || 'user@verification.portal'} · <span className="font-semibold text-cyan-700 dark:text-cyan-400">{user?.role || 'Scrutiny Officer'}</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {user?.organization || 'Scrutiny Portal'}
                </p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-white hover:bg-rose-600 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Section 1: Appearance & Theme Mode */}
        <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Sun className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Interface Theme & Appearance
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Switch between daytime administrative clarity (Light Mode) and night-time high-contrast focus (Dark Mode).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Light Mode Card */}
            <div
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                theme === 'light'
                  ? 'bg-cyan-50/70 border-cyan-500 shadow-sm ring-1 ring-cyan-500'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Light Mode</span>
                </div>
                {theme === 'light' && (
                  <span className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950 px-2 py-0.5 rounded border border-cyan-300 font-semibold">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Crisp white and soft ice-blue surfaces with navy text. Optimized for daylight document scrutiny and printing.
              </p>
            </div>

            {/* Dark Mode Card */}
            <div
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'bg-cyan-950/40 border-cyan-500 shadow-sm ring-1 ring-cyan-500'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Dark Mode</span>
                </div>
                {theme === 'dark' && (
                  <span className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 font-semibold">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Sophisticated midnight blue & obsidian surfaces with electric cyan accents. Reduces eyestrain during prolonged audits.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Regulatory Handbook Edition */}
        <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              1. AICTE Approval Process Handbook (APH) Standards
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div
              onClick={() => setHandbookVersion('APH_2026_27')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                handbookVersion === 'APH_2026_27'
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500/60 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-white">APH Edition 2026-27</span>
                <span className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950 px-2 py-0.5 rounded border border-cyan-300 dark:border-cyan-800 font-semibold">
                  CURRENT / MANDATORY
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Applies latest 1:15 & 1:20 cadre ratio directives, revised National Building Code 2016 safety norms, and Divyangjan ramp guidelines.
              </p>
            </div>

            <div
              onClick={() => setHandbookVersion('APH_2025_26')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                handbookVersion === 'APH_2025_26'
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500/60 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-white">APH Edition 2025-26</span>
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  LEGACY
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Retrospective evaluation mode for pending historical disputes or legacy inspection reports.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Scrutiny Strictness Mode */}
        <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              2. Scrutiny Committee Strictness Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'standard',
                title: 'Standard Regulatory',
                desc: 'Standard APH scrutiny rules with normal grace intervals for provisional renewal receipts.',
              },
              {
                id: 'zero_tolerance',
                title: 'High Risk Zero-Tolerance',
                desc: 'Flags any discrepancy >= 0.01 acre and marks any expired NOC as an immediate blocking deficiency.',
              },
              {
                id: 'fast_track',
                title: 'Fast-Track Renewal',
                desc: 'Streamlined checks for accredited tier-1 institutions with continuous satisfactory history.',
              },
            ].map((mode) => (
              <div
                key={mode.id}
                onClick={() => setScrutinyMode(mode.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  scrutinyMode === mode.id
                    ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500/60 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                <span className="font-bold text-xs text-slate-900 dark:text-white block mb-1">{mode.title}</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{mode.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: OCR Confidence & Discrepancy Tolerance */}
        <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              3. AI OCR & Cross-Document Variance Thresholds
            </h3>
          </div>

          <div className="space-y-4">
            {/* OCR Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Minimum OCR Confidence Cutoff
                </span>
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{ocrConfidence}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="99"
                value={ocrConfidence}
                onChange={(e) => setOcrConfidence(parseInt(e.target.value))}
                className="w-full accent-cyan-600 dark:accent-cyan-400 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Extractions scoring below this confidence are flagged for mandatory human reviewer confirmation.
              </p>
            </div>

            {/* Land Area Tolerance */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Permissible Land Area Cross-Document Variance
                </span>
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{landTolerance} Acres</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.25"
                step="0.01"
                value={landTolerance}
                onChange={(e) => setLandTolerance(parseFloat(e.target.value))}
                className="w-full accent-cyan-600 dark:accent-cyan-400 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Discrepancies exceeding this value between registered deed and municipal sanction trigger a Warning.
              </p>
            </div>
          </div>
        </div>

        {/* Section 5: Engine Architecture Information */}
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">AICTE VerifyAI Neural Core</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Model: gemini-3.8-flash · APH Clause Rule Engine v2026.4</p>
            </div>
          </div>

          <span className="font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-1 rounded text-[11px] font-semibold">
            SECURE / ENCRYPTED
          </span>
        </div>
      </div>
    </div>
  );
};
