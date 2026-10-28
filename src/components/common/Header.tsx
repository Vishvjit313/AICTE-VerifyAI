import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  FileCheck2, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronDown,
  User as UserIcon,
  LogOut,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentTab: NavTab;
  onOpenMobileNav: () => void;
  onStartVerification: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectTab: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileNav,
  onStartVerification,
  searchQuery,
  onSearchChange,
  onSelectTab,
}) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getPageTitle = (tab: NavTab) => {
    switch (tab) {
      case 'overview':
        return 'Executive Overview';
      case 'applications':
        return 'Institutional Applications';
      case 'document-verification':
        return 'Document Verification Workspace';
      case 'compliance-checker':
        return 'Regulatory Compliance Matrix';
      case 'verification-reports':
        return 'Official Scrutiny Reports';
      case 'activity-logs':
        return 'Audit & Verification Trail';
      case 'settings':
        return 'System & Norms Configuration';
      default:
        return 'Verification Operations';
    }
  };

  const notifications = [
    {
      id: 'N-1',
      title: 'Statutory Fire NOC Expired',
      institution: 'Coromandel College of Engg (SRO)',
      time: '15m ago',
      urgent: true,
      tab: 'document-verification' as NavTab,
    },
    {
      id: 'N-2',
      title: 'Land Area Discrepancy (0.28 Acres)',
      institution: 'Apex Institute of Technology (NRO)',
      time: '42m ago',
      urgent: false,
      tab: 'compliance-checker' as NavTab,
    },
    {
      id: 'N-3',
      title: 'Scrutiny Committee Approval Ready',
      institution: 'Aryavart Institute of Advanced Engg (WRO)',
      time: '1h ago',
      urgent: false,
      tab: 'verification-reports' as NavTab,
    },
  ];

  return (
    <header className="h-18 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-4 transition-colors duration-200">
      {/* Zone 1: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
            {getPageTitle(currentTab)}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
            Council Scrutiny Portal · 2026-27 Approval Cycle
          </p>
        </div>
      </div>

      {/* Zone 2: Universal Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search institution, application ID, or Khasra plot..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Zone 3: Actions, Theme Switcher & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Primary Action Button (Shown globally except on document-verification or overview if handled in dashboard) */}
        {currentTab !== 'overview' && currentTab !== 'document-verification' && (
          <button
            onClick={onStartVerification}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:from-cyan-700 active:to-blue-700 rounded-lg shadow-sm shadow-cyan-950/40 transition-all min-h-[40px] whitespace-nowrap cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4" />
            <span className="hidden sm:inline">Start Verification</span>
            <span className="sm:hidden">Verify</span>
          </button>
        )}

        {/* Theme Switcher Toggle */}
        <ThemeToggle />

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 sm:p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 min-w-[40px] min-h-[40px] flex items-center justify-center relative transition-colors"
            aria-label="View alerts and notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  Verification Alerts
                </span>
                <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono">Real-time Feed</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 mt-1 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onSelectTab(n.tab);
                      setShowNotifications(false);
                    }}
                    className="py-3 px-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      {n.urgent ? (
                        <ShieldAlert className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{n.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{n.institution}</p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 inline-block">{n.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2.5 mt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => {
                    onSelectTab('compliance-checker');
                    setShowNotifications(false);
                  }}
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium"
                >
                  View All Review Cases →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Authenticated User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            aria-label="User profile menu"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs border border-cyan-400/40 shadow-sm">
              {user?.avatarInitials || (user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AU')}
            </div>
            <div className="hidden xl:block text-left text-xs">
              <span className="block font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {user?.fullName || 'Authenticated User'}
              </span>
              <span className="block text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">
                {user?.role || 'Scrutiny Officer'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hidden xl:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in">
              <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {user?.fullName || 'Authenticated User'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.email || 'user@aicte.gov.in'}
                </p>
                <p className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 mt-1">
                  {user?.organization || 'Scrutiny Portal'}
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onSelectTab('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors text-left"
                >
                  <Sliders className="w-4 h-4 text-slate-400" />
                  <span>Audit Strictness & Norms</span>
                </button>
                <button
                  onClick={() => {
                    onSelectTab('activity-logs');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors text-left"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>My Signature Audit Trail</span>
                </button>
              </div>

              {/* Working Logout Action */}
              <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={async () => {
                    setShowProfileMenu(false);
                    await logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors text-left font-medium cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out (Revoke Session)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
