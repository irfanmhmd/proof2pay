/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { PayPalModal } from './components/common/PayPalModal';
import { ReceiptModal } from './components/common/ReceiptModal';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { ClientDashboard } from './components/dashboard/ClientDashboard';
import { FreelancerDashboard } from './components/dashboard/FreelancerDashboard';
import { ProjectCreationPage } from './components/projects/ProjectCreationPage';
import { ProjectDetailsPage } from './components/projects/ProjectDetailsPage';
import { EvidenceSubmissionPage } from './components/evidence/EvidenceSubmissionPage';
import { ProofGraphReportPage } from './components/proofgraph/ProofGraphReportPage';
import { PaymentHistoryPage } from './components/payments/PaymentHistoryPage';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  const isStandalonePage = currentPage === 'landing' || currentPage === 'auth';

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'auth':
        return <AuthPage />;
      case 'client-dashboard':
        return <ClientDashboard />;
      case 'freelancer-dashboard':
        return <FreelancerDashboard />;
      case 'create-project':
        return <ProjectCreationPage />;
      case 'project-details':
        return <ProjectDetailsPage />;
      case 'evidence-submission':
        return <EvidenceSubmissionPage />;
      case 'proofgraph-report':
        return <ProofGraphReportPage />;
      case 'payment-history':
        return <PaymentHistoryPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <Navbar />

      {isStandalonePage ? (
        <main className="flex-1">
          {renderCurrentPage()}
        </main>
      ) : (
        <div className="flex-1 flex max-w-[1540px] w-full mx-auto">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-7xl">
            {renderCurrentPage()}
          </main>
        </div>
      )}

      <Footer />
      <PayPalModal />
      <ReceiptModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
