import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  FileText, 
  Check, 
  Flag, 
  XCircle, 
  Sliders, 
  AlertTriangle 
} from 'lucide-react';
import { ComplianceRule, VerificationStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface ComplianceCheckerViewProps {
  rules: ComplianceRule[];
  onUpdateRuleStatus: (ruleId: string, newStatus: VerificationStatus, note?: string) => void;
}

export const ComplianceCheckerView: React.FC<ComplianceCheckerViewProps> = ({
  rules,
  onUpdateRuleStatus,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRuleActionId, setActiveRuleActionId] = useState<string | null>(null);
  const [actionNote, setActionNote] = useState('');

  const categories = [
    'All',
    'Land & Infrastructure',
    'Safety & Environment',
    'Faculty & Cadre',
    'Legal & Governance',
    'Academic Affiliation',
  ];

  // Calculate progress
  const completedChecks = rules.filter(r => r.status === 'PASS').length;
  const warningChecks = rules.filter(r => r.status === 'WARNING').length;
  const failedChecks = rules.filter(r => r.status === 'FAILED CHECK').length;
  const progressPercent = Math.round((completedChecks / rules.length) * 100);

  const filteredRules = rules.filter(r => {
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
    const matchesQuery = 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.aphClause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesQuery;
  });

  const handleApplyAction = (status: VerificationStatus) => {
    if (activeRuleActionId) {
      onUpdateRuleStatus(activeRuleActionId, status, actionNote);
      setActiveRuleActionId(null);
      setActionNote('');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto transition-colors duration-200">
      {/* Header & APH Progress Overview */}
      <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>AICTE Approval Process Handbook (APH 2026-27 Norms)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Regulatory Compliance Workspace
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Configurable compliance rules evaluating institutional eligibility, infrastructure sufficiency, and safety norms.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 text-xs font-mono shrink-0">
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-center min-w-[70px]">
              <span className="block text-base font-bold tabular-nums">{completedChecks}</span>
              <span className="text-[10px]">Compliant</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-center min-w-[70px]">
              <span className="block text-base font-bold tabular-nums">{warningChecks}</span>
              <span className="text-[10px]">Warnings</span>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/50 text-rose-800 dark:text-rose-300 text-center min-w-[70px]">
              <span className="block text-base font-bold tabular-nums">{failedChecks}</span>
              <span className="text-[10px]">Deficiencies</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Regulatory Scrutiny Progress</span>
            <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{progressPercent}% Completed</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden flex border border-slate-200 dark:border-slate-800">
            <div 
              style={{ width: `${(completedChecks / rules.length) * 100}%` }}
              className="bg-emerald-500 transition-all duration-500"
            />
            <div 
              style={{ width: `${(warningChecks / rules.length) * 100}%` }}
              className="bg-amber-500 transition-all duration-500"
            />
            <div 
              style={{ width: `${(failedChecks / rules.length) * 100}%` }}
              className="bg-rose-500 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Filter and Category Pills */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search compliance mandate, APH clause or keyword..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Result:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Verification Results</option>
              <option value="PASS">PASS</option>
              <option value="WARNING">WARNING</option>
              <option value="FAILED CHECK">FAILED CHECK</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-3.5">
        {filteredRules.map((rule) => {
          const isActionOpen = activeRuleActionId === rule.id;

          return (
            <div
              key={rule.id}
              className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80 shadow-xs transition-all space-y-4"
            >
              {/* Rule Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={rule.status} size="sm" />
                    <span className="text-xs font-mono text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/40 px-2 py-0.5 rounded font-medium">
                      {rule.aphClause}
                    </span>
                    <span className="text-[11px] text-slate-400">·</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{rule.category}</span>
                    {rule.mandatory && (
                      <span className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900/40">
                        Mandatory
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                    {rule.name}
                  </h3>
                </div>

                {/* Reviewer Action Trigger */}
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    onClick={() => setActiveRuleActionId(isActionOpen ? null : rule.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 flex items-center gap-1.5 transition-colors min-h-[36px] cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>Reviewer Action</span>
                  </button>
                </div>
              </div>

              {/* Requirement Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {rule.description}
              </p>

              {/* Evidence-Linked Findings */}
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Audit Evidence from Submitted Institutional Records:</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 italic font-mono pl-5">
                  "{rule.evidence}"
                </p>
              </div>

              {/* Action Required Directive (if present) */}
              {rule.actionRequired && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-800 dark:text-amber-300">Prescribed Remedial Action: </strong>
                    {rule.actionRequired}
                  </div>
                </div>
              )}

              {/* Reviewer Action Panel (Expanded) */}
              {isActionOpen && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-cyan-200 dark:border-cyan-800/50 space-y-3 pt-3">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                    Reviewer Scrutiny Action & Resolution
                  </span>

                  <div>
                    <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">
                      Scrutiny Committee Justification / Note:
                    </label>
                    <input
                      type="text"
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                      placeholder="e.g. Verified supplementary revenue mutation copy dated 12-Oct-2026."
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => handleApplyAction('PASS')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800/50 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Compliance (PASS)</span>
                    </button>
                    <button
                      onClick={() => handleApplyAction('WARNING')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800/50 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Request Clarification (WARNING)</span>
                    </button>
                    <button
                      onClick={() => handleApplyAction('FAILED CHECK')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-800/50 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Record Deficiency (FAILED)</span>
                    </button>
                    <button
                      onClick={() => setActiveRuleActionId(null)}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white ml-auto cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
