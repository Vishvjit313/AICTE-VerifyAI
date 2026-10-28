import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  FileCheck2, 
  ShieldCheck, 
  FileText, 
  History, 
  SlidersHorizontal,
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export type NavTab = 
  | 'overview' 
  | 'applications' 
  | 'document-verification' 
  | 'compliance-checker' 
  | 'verification-reports' 
  | 'activity-logs' 
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  pendingReviewCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  pendingReviewCount = 0,
}) => {
  const { user, logout } = useAuth();

  const userInitials = user?.avatarInitials || (user?.fullName 
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() 
    : 'AU');

  const navItems = [
    {
      id: 'overview' as NavTab,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'applications' as NavTab,
      label: 'Applications',
      icon: Building2,
      badge: null,
    },
    {
      id: 'document-verification' as NavTab,
      label: 'Document Verification',
      icon: FileCheck2,
      badge: null,
      highlight: true,
    },
    {
      id: 'compliance-checker' as NavTab,
      label: 'Compliance Checker',
      icon: ShieldCheck,
      badge: pendingReviewCount > 0 ? `${pendingReviewCount}` : null,
      badgeColor: 'amber',
    },
    {
      id: 'verification-reports' as NavTab,
      label: 'Verification Reports',
      icon: FileText,
      badge: null,
    },
    {
      id: 'activity-logs' as NavTab,
      label: 'Activity Logs',
      icon: History,
      badge: null,
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings',
      icon: SlidersHorizontal,
      badge: null,
    },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    if (isOpenMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-700/80 flex flex-col transition-all duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Lockup */}
        <div className="h-18 px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/70 shrink-0">
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
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                  AICTE VerifyAI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                Regulatory Scrutiny Core
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="lg:hidden">
              <ThemeToggle compact />
            </div>
            <button
              onClick={onCloseMobile}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group min-h-[44px] text-left cursor-pointer ${
                  isActive
                    ? 'bg-cyan-50 dark:bg-gradient-to-r dark:from-cyan-950/60 dark:to-blue-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-md ${
                      item.badgeColor === 'amber'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Quick Logout Footer in Sidebar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 shrink-0 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs border border-cyan-400/40 shrink-0 shadow-sm">
              {userInitials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate leading-tight">
                {user?.fullName || 'Authenticated User'}
              </p>
              <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium truncate">
                {user?.role || 'Scrutiny Officer'}
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
