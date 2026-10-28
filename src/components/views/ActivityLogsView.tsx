import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Download 
} from 'lucide-react';
import { ActivityLog } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface ActivityLogsViewProps {
  logs: ActivityLog[];
}

export const ActivityLogsView: React.FC<ActivityLogsViewProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActionType, setSelectedActionType] = useState<string>('All');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.applicationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.evidenceHash.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = selectedActionType === 'All' || log.actionType === selectedActionType;
    return matchesSearch && matchesAction;
  });

  const handleExportCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'Actor', 'Action Type', 'Application ID', 'Institution', 'Details', 'Evidence Hash', 'Status'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      l.actor,
      l.actionType,
      l.applicationId,
      `"${l.institutionName.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      l.evidenceHash,
      l.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AICTE_VerifyAI_Audit_Trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto transition-colors duration-200">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
            <History className="w-4 h-4" />
            <span>Cryptographic Ledger & Non-Repudiation Audit Trail</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Scrutiny Activity Logs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Immutable log of all automated OCR inferences, APH rule evaluations, discrepancy flags, and committee overrides.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 flex items-center gap-2 transition-colors self-start md:self-auto min-h-[40px] cursor-pointer"
        >
          <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by hash, institution, application ID, or actor..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium">Action Type:</span>
          <select
            value={selectedActionType}
            onChange={(e) => setSelectedActionType(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Audit Events</option>
            <option value="AI_OCR_EXTRACTION">AI OCR Extraction</option>
            <option value="APH_NORM_EVALUATION">APH Norm Evaluation</option>
            <option value="DISCREPANCY_FLAGGED">Discrepancy Flagged</option>
            <option value="MANUAL_REVIEW_OVERRIDE">Manual Review Override</option>
            <option value="REPORT_GENERATED">Report Generated</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto -mx-5 sm:mx-0">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] bg-slate-50 dark:bg-slate-900/60">
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Actor / Engine</th>
                <th className="py-3 px-4 font-semibold">Application Reference</th>
                <th className="py-3 px-4 font-semibold">Event Particulars</th>
                <th className="py-3 px-4 font-semibold">SHA-256 Hash</th>
                <th className="py-3 px-4 font-semibold text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="py-3 px-4 font-sans text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    <span className="font-semibold text-cyan-700 dark:text-cyan-300 block">{log.actor}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{log.actionType}</span>
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    <span className="text-slate-900 dark:text-white block font-sans font-medium">{log.institutionName}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{log.applicationId}</span>
                  </td>

                  <td className="py-3 px-4 font-sans text-slate-700 dark:text-slate-300 min-w-[280px]">
                    {log.details}
                  </td>

                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    <span className="bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded text-[10px] text-cyan-700 dark:text-cyan-400 font-medium">
                      {log.evidenceHash}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <StatusBadge status={log.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
