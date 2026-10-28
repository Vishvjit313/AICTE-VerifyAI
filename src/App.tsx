/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar, NavTab } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { DashboardView } from './components/views/DashboardView';
import { ApplicationsView } from './components/views/ApplicationsView';
import { DocumentVerificationView } from './components/views/DocumentVerificationView';
import { ComplianceCheckerView } from './components/views/ComplianceCheckerView';
import { ReportsView } from './components/views/ReportsView';
import { ActivityLogsView } from './components/views/ActivityLogsView';
import { SettingsView } from './components/views/SettingsView';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { 
  INITIAL_APPLICATIONS, 
  INITIAL_COMPLIANCE_RULES, 
  INITIAL_ACTIVITY_LOGS 
} from './data/mockData';
import { InstitutionApplication, ComplianceRule, ActivityLog, VerificationStatus, ScrutinyDocument } from './types';
import { ShieldCheck } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, isLoading, activeScreen, user } = useAuth();

  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [applications, setApplications] = useState<InstitutionApplication[]>(INITIAL_APPLICATIONS);
  const [selectedApp, setSelectedApp] = useState<InstitutionApplication | null>(null);
  const [activeVerificationApp, setActiveVerificationApp] = useState<InstitutionApplication | undefined>(INITIAL_APPLICATIONS[0]);
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>(INITIAL_COMPLIANCE_RULES);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [lastVerifiedDocId, setLastVerifiedDocId] = useState<string | undefined>(undefined);

  // Handle switching to document verification for a specific application
  const handleScrutinizeDocument = (app: InstitutionApplication) => {
    setActiveVerificationApp(app);
    setCurrentTab('document-verification');
  };

  // Handle live verification completion of a document
  const handleDocumentVerified = (doc: ScrutinyDocument) => {
    setLastVerifiedDocId(doc.id);

    setApplications(prev => prev.map(app => {
      const isTarget = app.id === (activeVerificationApp?.id || prev[0].id);
      if (isTarget) {
        const existingIdx = app.documents.findIndex(d => d.id === doc.id || d.name === doc.name);
        const updatedDocs = existingIdx >= 0 
          ? app.documents.map((d, i) => i === existingIdx ? doc : d)
          : [doc, ...app.documents];
        
        const hasFailed = updatedDocs.some(d => d.status === 'FAILED CHECK');
        const hasWarning = updatedDocs.some(d => d.status === 'WARNING');
        const newStatus: VerificationStatus = hasFailed ? 'FAILED CHECK' : (hasWarning ? 'WARNING' : 'PASS');

        const updatedApp = {
          ...app,
          institutionName: doc.analysis?.institutionNameExtracted || app.institutionName,
          documents: updatedDocs,
          documentsSubmittedCount: updatedDocs.length,
          status: newStatus,
          lastUpdated: 'Just Now',
        };

        if (activeVerificationApp?.id === app.id) {
          setActiveVerificationApp(updatedApp);
        }

        return updatedApp;
      }
      return app;
    }));

    // Record audit trail entry with real authenticated officer name
    const newLog: ActivityLog = {
      id: `LOG-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: user?.fullName ? `${user.fullName} (${user.role})` : 'VerifyAI Document Scrutiny Core',
      actionType: 'AI_OCR_EXTRACTION',
      applicationId: activeVerificationApp?.applicationNumber || 'AICTE/SCRUT/2026/INP',
      institutionName: doc.analysis?.institutionNameExtracted || activeVerificationApp?.institutionName || 'Technical Institution',
      details: `Document "${doc.name}" verified (${doc.analysis?.textExtractionMethod || 'OCR'}). Status: ${doc.status}.`,
      evidenceHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      status: doc.status,
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Handle updating a compliance rule status
  const handleUpdateRuleStatus = (ruleId: string, newStatus: VerificationStatus, note?: string) => {
    setComplianceRules(prev => prev.map(rule => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          status: newStatus,
          actionRequired: note || rule.actionRequired,
        };
      }
      return rule;
    }));

    const newLog: ActivityLog = {
      id: `LOG-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: user?.fullName ? `${user.fullName} (${user.role})` : 'Scrutiny Officer',
      actionType: 'MANUAL_REVIEW_OVERRIDE',
      applicationId: activeVerificationApp?.applicationNumber || 'AICTE/SCRUT/2026/APH',
      institutionName: activeVerificationApp?.institutionName || 'Council Scrutiny Matrix',
      details: `Compliance rule "${ruleId}" status updated to ${newStatus}. ${note ? `Note: ${note}` : ''}`,
      evidenceHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      status: newStatus,
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const handleStartVerification = () => {
    setActiveVerificationApp(applications[0]);
    setCurrentTab('document-verification');
  };

  // 1. Loading State (Session verification on initial boot)
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-[#F8FAFC] p-4 transition-colors duration-200">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-100 dark:bg-[#0b1736] p-1 shadow-xl mb-4 flex items-center justify-center">
          <img 
            src="/src/assets/images/aicte_emblem_seal_1793170320069.jpg" 
            alt="AICTE Seal" 
            className="w-full h-full object-cover rounded-xl"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3.5 h-3.5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            AICTE VerifyAI
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Verifying cryptographic session & regulatory norms...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated Routes (Login, Sign Up, Forgot Password)
  if (!isAuthenticated) {
    if (activeScreen === 'signup') {
      return <SignupPage />;
    }
    if (activeScreen === 'forgot-password' || activeScreen === 'reset-password') {
      return <ForgotPasswordPage />;
    }
    return <LoginPage />;
  }

  // 3. Protected Dashboard Workspace (Authenticated)
  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-[#F8FAFC] font-sans selection:bg-cyan-500/30 selection:text-cyan-800 dark:selection:text-cyan-200 transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        pendingReviewCount={applications.filter(a => a.status === 'WARNING' || a.status === 'FAILED CHECK').length}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Sticky Top Bar Contract Header */}
        <Header
          currentTab={currentTab}
          onOpenMobileNav={() => setIsOpenMobile(true)}
          onStartVerification={handleStartVerification}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectTab={setCurrentTab}
        />

        {/* Scrollable Viewport Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] dark:bg-[#0B1120] bg-tech-grid transition-colors duration-200">
          {currentTab === 'overview' && (
            <DashboardView
              applications={applications}
              onSelectApplication={(app) => {
                setSelectedApp(app);
                setCurrentTab('applications');
              }}
              onNavigateTab={setCurrentTab}
              onStartVerification={handleStartVerification}
            />
          )}

          {currentTab === 'applications' && (
            <ApplicationsView
              applications={applications}
              selectedApp={selectedApp}
              onSelectApplication={setSelectedApp}
              onNavigateTab={setCurrentTab}
              onScrutinizeDocument={handleScrutinizeDocument}
            />
          )}

          {currentTab === 'document-verification' && (
            <DocumentVerificationView
              currentApplication={activeVerificationApp}
              onDocumentVerified={handleDocumentVerified}
              onNavigateToReports={() => setCurrentTab('verification-reports')}
            />
          )}

          {currentTab === 'compliance-checker' && (
            <ComplianceCheckerView
              rules={complianceRules}
              onUpdateRuleStatus={handleUpdateRuleStatus}
            />
          )}

          {currentTab === 'verification-reports' && (
            <ReportsView
              applications={applications}
              complianceRules={complianceRules}
              activeDocumentId={lastVerifiedDocId}
            />
          )}

          {currentTab === 'activity-logs' && (
            <ActivityLogsView
              logs={activityLogs}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
