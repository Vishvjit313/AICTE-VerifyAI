import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  X, 
  FileCheck2, 
  FileText, 
  ChevronRight 
} from 'lucide-react';
import { InstitutionApplication } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { NavTab } from '../common/Sidebar';

interface ApplicationsViewProps {
  applications: InstitutionApplication[];
  selectedApp: InstitutionApplication | null;
  onSelectApplication: (app: InstitutionApplication | null) => void;
  onNavigateTab: (tab: NavTab) => void;
  onScrutinizeDocument: (app: InstitutionApplication, docId?: string) => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  selectedApp,
  onSelectApplication,
  onNavigateTab,
  onScrutinizeDocument,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch = 
      app.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.campusLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.trustName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion = selectedRegion === 'All' || app.region === selectedRegion;
    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;

    return matchesSearch && matchesRegion && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto transition-colors duration-200">
      {/* Top Filter Bar */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by institution name, application ID, trust, or location..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-lg text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Stats count */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <span>Showing</span>
            <span className="font-mono font-bold text-cyan-600 dark:text-cyan-300">{filteredApps.length}</span>
            <span>of {applications.length} applications</span>
          </div>
        </div>

        {/* Filter Badges & Selectors */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-xs">
          {/* Region */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-2.5 py-1.5 rounded-lg text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Regions (6)</option>
              <option value="Northern">Northern (NRO)</option>
              <option value="Southern">Southern (SRO)</option>
              <option value="Western">Western (WRO)</option>
              <option value="Eastern">Eastern (ERO)</option>
              <option value="Central">Central (CRO)</option>
              <option value="North-Western">North-Western (NWRO)</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Scrutiny Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-2.5 py-1.5 rounded-lg text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Statuses</option>
              <option value="PASS">PASS (Compliant)</option>
              <option value="WARNING">WARNING (Review Needed)</option>
              <option value="FAILED CHECK">FAILED CHECK (Deficient)</option>
              <option value="NOT CHECKED">NOT CHECKED (Pending)</option>
            </select>
          </div>

          {/* Category */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Discipline:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-2.5 py-1.5 rounded-lg text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Disciplines</option>
              <option value="Engineering & Tech">Engineering & Tech</option>
              <option value="Management">Management (PGDM/MBA)</option>
              <option value="Polytechnic">Polytechnic / Diploma</option>
            </select>
          </div>

          {(selectedRegion !== 'All' || selectedStatus !== 'All' || selectedCategory !== 'All' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedRegion('All');
                setSelectedStatus('All');
                setSelectedCategory('All');
                setSearchTerm('');
              }}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline ml-auto font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Applications Grid / Table */}
      <div className="grid grid-cols-1 gap-4">
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-300">No applications match your filter</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try relaxing the search criteria or changing regions.</p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              onClick={() => onSelectApplication(app)}
              className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 hover:border-cyan-400 dark:hover:border-cyan-500/40 hover:bg-slate-50/70 dark:hover:bg-[#0c1836] shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Institution Details */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={app.status} size="sm" />
                    <span className="text-[11px] font-mono text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/40 px-2 py-0.5 rounded font-medium">
                      {app.region} Region
                    </span>
                    <span className="text-[11px] text-slate-400">·</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{app.category}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors truncate">
                    {app.institutionName}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{app.campusLocation}</span>
                    <span>·</span>
                    <span>Sponsoring Trust: {app.trustName}</span>
                  </p>
                </div>

                {/* Right side metrics and actions */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200 dark:border-slate-800/80 shrink-0">
                  {/* Compliance Score */}
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Compliance Score</span>
                    <div className="flex items-baseline justify-end gap-1">
                      <span className={`text-xl font-bold font-mono tabular-nums ${
                        app.complianceScore >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                        app.complianceScore >= 70 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {app.complianceScore}%
                      </span>
                    </div>
                  </div>

                  {/* Documents count */}
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Documents</span>
                    <span className="text-sm font-semibold font-mono text-slate-800 dark:text-slate-200">
                      {app.documentsSubmittedCount}/{app.totalDocumentsRequired} Submitted
                    </span>
                  </div>

                  {/* Applied Intake */}
                  <div className="text-right hidden sm:block">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Applied Intake</span>
                    <span className="text-sm font-semibold font-mono text-slate-800 dark:text-slate-200">
                      {app.appliedIntake} Seats
                    </span>
                  </div>

                  {/* Action button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onScrutinizeDocument(app);
                      }}
                      className="px-3 py-2 rounded-lg text-xs font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 border border-cyan-200 dark:border-cyan-800/50 flex items-center gap-1.5 transition-colors min-h-[40px] cursor-pointer"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Verify Docs</span>
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => onSelectApplication(null)}
        >
          <div 
            className="w-full max-w-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedApp.status} size="md" />
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{selectedApp.applicationNumber}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedApp.institutionName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedApp.campusLocation} · {selectedApp.region} Region · {selectedApp.category}
                </p>
              </div>

              <button
                onClick={() => onSelectApplication(null)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Compliance Index</span>
                <span className="text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400 tabular-nums">
                  {selectedApp.complianceScore}%
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Proposed Intake</span>
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {selectedApp.appliedIntake}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Documents Lodged</span>
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {selectedApp.documentsSubmittedCount}/{selectedApp.totalDocumentsRequired}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Sponsoring Trust</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate block mt-1" title={selectedApp.trustName}>
                  {selectedApp.trustName}
                </span>
              </div>
            </div>

            {/* Reviewer Notes */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Scrutiny Officer Observations
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedApp.reviewerNotes || 'No reviewer annotations recorded. Proceed with automated document verification.'}
              </p>
            </div>

            {/* Scrutiny Documents List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Submitted Documents Under Scrutiny ({selectedApp.documents.length})
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400">APH Mandate Checklist</span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedApp.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3 hover:bg-slate-100/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{doc.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {doc.categoryLabel} · ID: {doc.documentIdentifier} · {doc.size}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={doc.status} size="sm" />
                      <button
                        onClick={() => {
                          onSelectApplication(null);
                          onScrutinizeDocument(selectedApp, doc.id);
                        }}
                        className="text-xs text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-semibold px-2 py-1 rounded hover:bg-cyan-50 dark:hover:bg-cyan-950/60 cursor-pointer"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => onSelectApplication(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors min-h-[40px] cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelectApplication(null);
                  onNavigateTab('verification-reports');
                }}
                className="px-4 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors min-h-[40px] cursor-pointer"
              >
                View Full Deficiency Report
              </button>
              <button
                onClick={() => {
                  onSelectApplication(null);
                  onScrutinizeDocument(selectedApp);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg shadow-sm transition-all min-h-[40px] flex items-center gap-1.5 cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Open Verification Workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
