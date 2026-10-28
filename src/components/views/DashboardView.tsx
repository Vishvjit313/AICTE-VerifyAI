import React from 'react';
import { 
  Building2, 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ChevronRight, 
  TrendingUp, 
  ShieldCheck,
  Upload,
  ArrowRight
} from 'lucide-react';
import { InstitutionApplication } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { NavTab } from '../common/Sidebar';

interface DashboardViewProps {
  applications: InstitutionApplication[];
  onSelectApplication: (app: InstitutionApplication) => void;
  onNavigateTab: (tab: NavTab) => void;
  onStartVerification: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  applications,
  onSelectApplication,
  onNavigateTab,
  onStartVerification,
}) => {
  // Compute genuine statistics from actual application and document data
  const totalApplications = applications.length;
  const totalDocuments = applications.reduce((acc, app) => acc + (app.documents?.length || 0), 0);
  const passCount = applications.filter(a => a.status === 'PASS').length;
  const warningCount = applications.filter(a => a.status === 'WARNING').length;
  const failedCount = applications.filter(a => a.status === 'FAILED CHECK').length;
  const pendingReviewCount = warningCount + failedCount;

  // Collect real findings from uploaded documents
  const realDocumentFindings = applications.flatMap(app => 
    (app.documents || []).flatMap(doc => 
      (doc.findings || []).map(f => ({
        ...f,
        institutionName: app.institutionName,
        docName: doc.name,
      }))
    )
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto transition-colors duration-200">
      {/* Simplified, Professional Hero Banner */}
      <div className="p-6 sm:p-7 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 dark:from-[#0F172A] dark:via-[#111827] dark:to-[#0B1528] border border-slate-700/60 dark:border-slate-800 text-white relative shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Institutional Regulatory Scrutiny</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              AICTE Document Verification Workspace
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Verify land titles, building sanction plans, fire safety certificates, and regulatory compliance documents against Approval Process Handbook norms.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Single Prominent, Functional Start Verification Button */}
            <button
              onClick={onStartVerification}
              className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-sm transition-all flex items-center gap-2 min-h-[42px] cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Start Verification</span>
            </button>
            <button
              onClick={() => onNavigateTab('compliance-checker')}
              className="px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-slate-200 bg-white/10 hover:bg-white/20 border border-white/15 flex items-center gap-1.5 transition-colors min-h-[42px] cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-cyan-300" />
              <span>Compliance Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* Genuine Statistics Derived From Current Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applications */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Applications in Queue</span>
            <Building2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
              {totalApplications}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {totalApplications === 1 ? '1 file' : `${totalApplications} files`}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Institutional records staged for scrutiny
          </p>
        </div>

        {/* Documents Uploaded & Analyzed */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Documents Processed</span>
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
              {totalDocuments}
            </span>
            <span className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">
              OCR & AI
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Land deeds, plans, and certificates
          </p>
        </div>

        {/* Flagged / Requiring Attention */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-amber-200 dark:border-amber-900/40 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Requires Clarification</span>
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-amber-700 dark:text-amber-300 tabular-nums">
              {pendingReviewCount}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-mono">
              {failedCount > 0 ? `${failedCount} deficient` : 'Action required'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Discrepancies identified during scrutiny
          </p>
        </div>

        {/* Compliant Evaluated */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-emerald-200 dark:border-emerald-900/40 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Compliant Evaluations</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-emerald-700 dark:text-emerald-300 tabular-nums">
              {passCount}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
              {totalApplications > 0 ? `${Math.round((passCount / totalApplications) * 100)}% passing` : 'Ready'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Satisfying AICTE regulatory requirements
          </p>
        </div>
      </div>

      {/* Mid Section: Real Verification Summary & Automated Scrutiny Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Status Breakdown */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Current Verification Status Overview
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Evaluation results across applications currently loaded in the system
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('document-verification')}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Upload & Scrutinize Documents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {totalApplications === 0 ? (
            <div className="p-8 text-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No verification activity yet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Upload institutional regulatory documents to start the verification workflow.
              </p>
              <button
                onClick={onStartVerification}
                className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg cursor-pointer"
              >
                Upload First Document
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Genuine Status Distribution */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Regulatory Clearance Distribution</span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono">
                    {totalApplications} Total Cases
                  </span>
                </div>
                
                {/* Visual Ratio Bar */}
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  {passCount > 0 && (
                    <div 
                      style={{ width: `${(passCount / totalApplications) * 100}%` }}
                      className="bg-emerald-500 transition-all"
                      title={`Compliant: ${passCount}`}
                    />
                  )}
                  {warningCount > 0 && (
                    <div 
                      style={{ width: `${(warningCount / totalApplications) * 100}%` }}
                      className="bg-amber-500 transition-all"
                      title={`Warning: ${warningCount}`}
                    />
                  )}
                  {failedCount > 0 && (
                    <div 
                      style={{ width: `${(failedCount / totalApplications) * 100}%` }}
                      className="bg-rose-500 transition-all"
                      title={`Deficiency / Failed: ${failedCount}`}
                    />
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-center">
                  <div className="p-2 rounded bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-base block">{passCount}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Compliant</span>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
                    <span className="text-amber-600 dark:text-amber-400 font-bold font-mono text-base block">{warningCount}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Needs Review</span>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
                    <span className="text-rose-600 dark:text-rose-400 font-bold font-mono text-base block">{failedCount}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Deficient</span>
                  </div>
                </div>
              </div>

              {/* Real findings summary if present */}
              {realDocumentFindings.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Recent Document Findings ({realDocumentFindings.slice(0, 3).length})
                  </h4>
                  <div className="space-y-2">
                    {realDocumentFindings.slice(0, 3).map((f, idx) => (
                      <div 
                        key={idx}
                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs flex items-start justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{f.checkName}</span>
                            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">({f.aphClause})</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-[11px]">{f.evidenceText}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">Source: {f.docName}</p>
                        </div>
                        <StatusBadge status={f.status} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  No automated findings recorded yet. Upload a document in Document Verification to analyze compliance.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Regulatory Scrutiny Standards Panel */}
        <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Mandatory Regulatory Norms
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Automated document verification performs deterministic checks across key regulatory requirements:
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                  Land Contiguity & Title Ownership
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                  Verifies registered deeds, survey plot numbers, acreage requirements, and uninterrupted title in favor of the applicant trust.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                  Municipal Building Sanction Plans
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                  Cross-checks approved carpet and built-up area against the prescribed intake norms and structural safety certificates.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                  Statutory Fire Safety NOC
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                  Validates current validity dates, issuing municipal fire authority credentials, and National Building Code compliance.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800/80">
            <button
              onClick={() => onNavigateTab('compliance-checker')}
              className="w-full flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium py-1 cursor-pointer"
            >
              <span>View Full Regulatory Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Applications Under Scrutiny Table */}
      <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Applications Under Scrutiny
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Institutional files active in the verification pipeline
            </p>
          </div>

          {totalApplications > 0 && (
            <button
              onClick={() => onNavigateTab('applications')}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>View All Applications ({totalApplications})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {totalApplications === 0 ? (
          <div className="p-8 text-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No applications under scrutiny yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Click 'Start Verification' to upload and scrutinize institutional documents.
            </p>
            <button
              onClick={onStartVerification}
              className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg cursor-pointer"
            >
              Start Verification
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs">
                <thead>
                  <tr className="text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] bg-slate-50 dark:bg-slate-900/60">
                    <th scope="col" className="py-3 px-4 font-semibold">Institution Name</th>
                    <th scope="col" className="py-3 px-4 font-semibold">Application Reference</th>
                    <th scope="col" className="py-3 px-4 font-semibold text-center">Documents</th>
                    <th scope="col" className="py-3 px-4 font-semibold">Verification Status</th>
                    <th scope="col" className="py-3 px-4 font-semibold">Last Updated</th>
                    <th scope="col" className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {applications.slice(0, 5).map((app) => (
                    <tr 
                      key={app.id} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      onClick={() => onSelectApplication(app)}
                    >
                      <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-200">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                            {app.institutionName}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {app.campusLocation} · {app.category}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 text-[11px]">
                        {app.applicationNumber}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono text-slate-700 dark:text-slate-300">
                          {app.documentsSubmittedCount} / {app.totalDocumentsRequired}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={app.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {app.lastUpdated}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectApplication(app);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-cyan-700 dark:text-cyan-400 hover:text-white hover:bg-cyan-600 bg-cyan-50 dark:bg-slate-800/80 dark:hover:bg-cyan-950 border border-cyan-200 dark:border-slate-700/80 rounded-md transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500">
          Scrutiny status reflects automated cross-referencing against regulatory guidelines. Formal approval decisions are determined by authorized Council committees.
        </div>
      </div>
    </div>
  );
};
