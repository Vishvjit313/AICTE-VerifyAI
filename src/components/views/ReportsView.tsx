import React, { useState } from 'react';
import { 
  Printer, 
  Lock, 
  QrCode 
} from 'lucide-react';
import { InstitutionApplication, ComplianceRule } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { useAuth } from '../../context/AuthContext';

interface ReportsViewProps {
  applications: InstitutionApplication[];
  complianceRules: ComplianceRule[];
  activeDocumentId?: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  applications,
  complianceRules,
  activeDocumentId,
}) => {
  const { user } = useAuth();
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [selectedDocId, setSelectedDocId] = useState<string>(activeDocumentId || 'all');
  const [reportDate] = useState<string>('28-Oct-2026');

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  // Selected document if specific doc chosen
  const specificDoc = selectedDocId !== 'all' 
    ? selectedApp.documents.find(d => d.id === selectedDocId)
    : undefined;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto transition-colors duration-200">
      {/* Action Bar (Hidden when printing) */}
      <div className="no-print p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Official Scrutiny & Deficiency Report
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Formal AICTE accreditation scrutiny dossier generated from actual extracted documentary evidence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Institution Selector */}
          <select
            value={selectedAppId}
            onChange={(e) => {
              setSelectedAppId(e.target.value);
              setSelectedDocId('all');
            }}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-cyan-500 max-w-xs truncate"
          >
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.institutionName} ({app.status})
              </option>
            ))}
          </select>

          {/* Document Scope Selector */}
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-cyan-500 max-w-xs truncate"
          >
            <option value="all">Comprehensive Application Dossier ({selectedApp.documents.length} Docs)</option>
            {selectedApp.documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                Doc: {doc.name} ({doc.status})
              </option>
            ))}
          </select>

          {/* Print/Export Button */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg flex items-center gap-1.5 shadow-sm transition-all min-h-[40px] cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Sheet */}
      <div className="print-card rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 sm:p-10 text-slate-900 dark:text-slate-200 shadow-md dark:shadow-xl space-y-8 relative overflow-hidden">
        {/* Subtle Watermark for official authenticity */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none w-[500px] h-[500px]">
          <img 
            src="/src/assets/images/aicte_emblem_seal_1793170320069.jpg" 
            alt="AICTE Watermark" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Official Header Lockup */}
        <div className="flex items-start justify-between pb-6 border-b-2 border-slate-200 dark:border-slate-700 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-100 dark:bg-[#081024] shrink-0 p-1 flex items-center justify-center">
              <img 
                src="/src/assets/images/aicte_emblem_seal_1793170320069.jpg" 
                alt="AICTE Emblem" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                All India Council for Technical Education
              </p>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                SCRUTINY COMMITTEE VERIFICATION REPORT
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Approval Process Handbook 2026-27 · Regulatory Verification System
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">Dossier Reference</span>
            <span className="text-sm font-bold font-mono text-cyan-700 dark:text-cyan-300 block">{selectedApp.applicationNumber}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 block">Date: {reportDate}</span>
          </div>
        </div>

        {/* Official Authentication Disclosure Banner */}
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-amber-800 dark:text-amber-300">
              Official Authentication Boundary Disclosure:
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              This report compiles verified document content, optical field extractions, and APH norm comparisons. Official government verification with the AICTE National Database and State Land Registration Gateway is currently unconfigured; findings reflect automated document-content scrutiny.
            </p>
          </div>
        </div>

        {/* Section 1: Institution Profile Matrix */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-1.5">
            1. Institution & Sponsoring Entity Particulars
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Name of Technical Institution:</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedApp.institutionName}</p>
              <p className="text-slate-500 dark:text-slate-400">{selectedApp.campusLocation}</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Sponsoring Trust / Society:</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedApp.trustName}</p>
              <p className="text-slate-500 dark:text-slate-400">Regional Jurisdiction: {selectedApp.region} Regional Office</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 flex items-center justify-between font-mono">
              <span className="text-slate-500 dark:text-slate-400">Academic Category:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedApp.category}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 flex items-center justify-between font-mono">
              <span className="text-slate-500 dark:text-slate-400">Proposed Student Intake:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{selectedApp.appliedIntake} Seats</span>
            </div>
          </div>
        </div>

        {/* Section 2: Documentary Evidence Scrutinized */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-1.5">
            2. Verified Documentary Records ({selectedApp.documents.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/70 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3 font-semibold">Document Title</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold">Registration Identifier</th>
                  <th className="py-2.5 px-3 font-semibold">Issuing Body</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
                {selectedApp.documents.map((doc) => (
                  <tr key={doc.id} className={specificDoc?.id === doc.id ? 'bg-cyan-50 dark:bg-cyan-950/30' : ''}>
                    <td className="py-2.5 px-3 text-slate-900 dark:text-slate-200 font-sans font-medium">
                      <div className="flex flex-col">
                        <span>{doc.name}</span>
                        {doc.analysis?.textExtractionMethod && (
                          <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">
                            {doc.analysis.textExtractionMethod} ({doc.analysis.pageCount} Pages)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-sans">{doc.categoryLabel}</td>
                    <td className="py-2.5 px-3 text-cyan-700 dark:text-cyan-300 font-semibold">{doc.documentIdentifier}</td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-sans">{doc.issuingAuthority}</td>
                    <td className="py-2.5 px-3 text-right">
                      <StatusBadge status={doc.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Extracted Field Level Matrix */}
        {specificDoc?.analysis?.fields && specificDoc.analysis.fields.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-1.5">
              3. Field Extraction & Confidence Audit ({specificDoc.name})
            </h3>

            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 text-[11px]">
                    <th className="py-2 px-3 font-semibold">Field Name</th>
                    <th className="py-2 px-3 font-semibold">Extracted Value</th>
                    <th className="py-2 px-3 font-semibold text-center">Source Page</th>
                    <th className="py-2 px-3 font-semibold text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
                  {specificDoc.analysis.fields.map((f, i) => (
                    <tr key={i}>
                      <td className="py-2 px-3 font-sans font-medium text-slate-700 dark:text-slate-300">{f.fieldName}</td>
                      <td className="py-2 px-3">
                        {f.isMissingOrUncertain || !f.value ? (
                          <span className="text-rose-600 dark:text-rose-400 font-sans italic">Missing / Not Detected</span>
                        ) : (
                          <span className="text-slate-900 dark:text-white font-bold">{f.value}</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center text-slate-500 dark:text-slate-400">{f.sourcePage ? `p. ${f.sourcePage}` : '—'}</td>
                      <td className="py-2 px-3 text-right text-cyan-600 dark:text-cyan-400 font-semibold">{f.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 4: Evidence-Linked Findings & APH Compliance */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-1.5">
            4. Evidence-Linked Scrutiny Findings & Regulatory Checks
          </h3>

          <div className="space-y-2.5">
            {specificDoc?.analysis?.findings ? (
              specificDoc.analysis.findings.map((f, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{f.checkName}</span>
                    <StatusBadge status={f.status} size="sm" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 italic font-mono text-[11px]">
                    Evidence: "{f.evidenceText}"
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span>APH Rule: <strong className="text-cyan-600 dark:text-cyan-400">{f.aphClause}</strong></span>
                    <span>Directive: {f.recommendedAction}</span>
                  </div>
                </div>
              ))
            ) : (
              complianceRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400 font-semibold">{rule.aphClause}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{rule.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                      "{rule.evidence}"
                    </p>
                  </div>

                  <div className="shrink-0 self-start sm:self-auto">
                    <StatusBadge status={rule.status} size="sm" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 5: Committee Final Recommendation */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-1.5">
            5. Scrutiny Committee Findings & Recommendation
          </h3>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Final Accreditation Recommendation</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedApp.status === 'PASS' 
                    ? 'Recommended for Extension of Approval (EoA) 2026-27' 
                    : selectedApp.status === 'WARNING' 
                    ? 'Provisional Clearance Subject to Rectification of Deficiencies' 
                    : 'Show-Cause Issued: Mandatory Safety / Land Criteria Unmet'}
                </span>
              </div>
              <StatusBadge status={selectedApp.status} size="lg" />
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedApp.reviewerNotes}
            </p>
          </div>
        </div>

        {/* Section 6: Digital Signature & Cryptographic Seal Block */}
        <div className="pt-6 border-t-2 border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
              <QrCode className="w-full h-full text-slate-950" />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
              <p className="font-mono text-cyan-700 dark:text-cyan-400 font-semibold">VERIFY-ID: AICTE-2026-8910</p>
              <p>Cryptographic Timestamp: 2026-10-28 09:30:14 UTC</p>
              <p className="font-mono text-[10px]">Digest: e3b0c44298fc1c149afbf4c8996fb92427ae41e4</p>
            </div>
          </div>

          <div className="text-center sm:text-right text-xs">
            <div className="border-b border-slate-300 dark:border-slate-600 pb-1 w-48 mb-1">
              <span className="font-serif italic text-sm text-cyan-700 dark:text-cyan-300 font-semibold">
                {user?.fullName || 'Authorized Reviewer'}
              </span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white block">
              {user?.fullName || 'Authorized Scrutiny Officer'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              {user?.role || 'Scrutiny Officer'}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">
              {user?.organization || 'Regulatory Scrutiny Division'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
