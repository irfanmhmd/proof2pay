import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Project, Milestone, EvidenceSubmission, ProofGraphReport, PaymentTransaction } from '../types';
import { MOCK_USERS, MOCK_PROJECTS, MOCK_PAYMENTS, MOCK_PROOFGRAPH_REPORTS, MOCK_EVIDENCES } from '../data/mockData';

export type PageRoute =
  | 'landing'
  | 'auth'
  | 'client-dashboard'
  | 'freelancer-dashboard'
  | 'create-project'
  | 'project-details'
  | 'evidence-submission'
  | 'proofgraph-report'
  | 'payment-history';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface PayPalModalData {
  isOpen: boolean;
  type: 'fund' | 'release';
  projectId: string;
  milestoneId: string;
  projectTitle: string;
  milestoneTitle: string;
  amount: number;
  recipientEmail?: string;
  onSuccess?: () => void;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: 'client' | 'freelancer') => void;
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;
  navigateTo: (page: PageRoute, params?: { projectId?: string; milestoneId?: string; reportId?: string }) => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  selectedMilestoneId: string;
  setSelectedMilestoneId: (id: string) => void;
  selectedReportId: string;
  setSelectedReportId: (id: string) => void;
  projects: Project[];
  transactions: PaymentTransaction[];
  proofGraphReports: Record<string, ProofGraphReport>;
  evidences: EvidenceSubmission[];
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  // Modal handlers
  payPalModal: PayPalModalData;
  openPayPalFundingModal: (projectId: string, milestoneId: string) => void;
  openPayPalReleaseModal: (projectId: string, milestoneId: string) => void;
  closePayPalModal: () => void;
  selectedReceipt: PaymentTransaction | null;
  openReceiptModal: (transaction: PaymentTransaction) => void;
  closeReceiptModal: () => void;
  // Core business actions
  createProject: (newProject: Omit<Project, 'id' | 'createdAt' | 'escrowBalance'>) => Project;
  fundMilestone: (projectId: string, milestoneId: string, paypalOrderId: string) => void;
  submitEvidence: (evidence: Omit<EvidenceSubmission, 'id' | 'submittedAt'>) => void;
  runProofGraphAnalysis: (milestoneId: string, evidenceId?: string) => Promise<ProofGraphReport>;
  releaseMilestoneFunds: (projectId: string, milestoneId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); // Default to Client Sarah Jenkins
  const [currentPage, setCurrentPage] = useState<PageRoute>('landing');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj_01');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('ms_01_2');
  const [selectedReportId, setSelectedReportId] = useState<string>('pg_01_2');

  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(MOCK_PAYMENTS);
  const [proofGraphReports, setProofGraphReports] = useState<Record<string, ProofGraphReport>>(MOCK_PROOFGRAPH_REPORTS);
  const [evidences, setEvidences] = useState<EvidenceSubmission[]>(MOCK_EVIDENCES);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modals
  const [payPalModal, setPayPalModal] = useState<PayPalModalData>({
    isOpen: false,
    type: 'fund',
    projectId: '',
    milestoneId: '',
    projectTitle: '',
    milestoneTitle: '',
    amount: 0,
  });

  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const switchRole = (role: 'client' | 'freelancer') => {
    if (role === 'client') {
      setCurrentUser(MOCK_USERS[0]);
      if (currentPage === 'freelancer-dashboard') {
        setCurrentPage('client-dashboard');
      }
      showToast({
        type: 'info',
        title: 'Switched to Client View',
        message: 'You are now viewing Proof2Pay as Sarah Jenkins (TechCorp Ventures).',
      });
    } else {
      setCurrentUser(MOCK_USERS[1]);
      if (currentPage === 'client-dashboard') {
        setCurrentPage('freelancer-dashboard');
      }
      showToast({
        type: 'info',
        title: 'Switched to Freelancer View',
        message: 'You are now viewing Proof2Pay as Alex Chen (Fullstack Architect).',
      });
    }
  };

  const navigateTo = (page: PageRoute, params?: { projectId?: string; milestoneId?: string; reportId?: string }) => {
    if (params?.projectId) setSelectedProjectId(params.projectId);
    if (params?.milestoneId) setSelectedMilestoneId(params.milestoneId);
    if (params?.reportId) setSelectedReportId(params.reportId);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPayPalFundingModal = (projectId: string, milestoneId: string) => {
    const project = projects.find(p => p.id === projectId);
    const milestone = project?.milestones.find(m => m.id === milestoneId);
    if (!project || !milestone) return;

    setPayPalModal({
      isOpen: true,
      type: 'fund',
      projectId,
      milestoneId,
      projectTitle: project.title,
      milestoneTitle: milestone.title,
      amount: milestone.amount,
      recipientEmail: project.freelancerName,
    });
  };

  const openPayPalReleaseModal = (projectId: string, milestoneId: string) => {
    const project = projects.find(p => p.id === projectId);
    const milestone = project?.milestones.find(m => m.id === milestoneId);
    if (!project || !milestone) return;

    setPayPalModal({
      isOpen: true,
      type: 'release',
      projectId,
      milestoneId,
      projectTitle: project.title,
      milestoneTitle: milestone.title,
      amount: milestone.amount,
      recipientEmail: 'alex.payouts@cheneng.io',
    });
  };

  const closePayPalModal = () => {
    setPayPalModal(prev => ({ ...prev, isOpen: false }));
  };

  const openReceiptModal = (transaction: PaymentTransaction) => {
    setSelectedReceipt(transaction);
  };

  const closeReceiptModal = () => {
    setSelectedReceipt(null);
  };

  // Business Action: Create Project
  const createProject = (newProjectData: Omit<Project, 'id' | 'createdAt' | 'escrowBalance'>) => {
    const id = `proj_${Date.now()}`;
    const newProject: Project = {
      ...newProjectData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      escrowBalance: 0,
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientAvatar: currentUser.avatar,
      clientCompany: currentUser.company || 'TechCorp Ventures',
    };

    setProjects(prev => [newProject, ...prev]);
    showToast({
      type: 'success',
      title: 'Project Created',
      message: `"${newProject.title}" initialized with ${newProject.milestones.length} milestones.`,
    });
    return newProject;
  };

  // Business Action: Fund Milestone with PayPal
  const fundMilestone = (projectId: string, milestoneId: string, paypalOrderId: string) => {
    const project = projects.find(p => p.id === projectId);
    const milestone = project?.milestones.find(m => m.id === milestoneId);
    if (!project || !milestone) return;

    const amount = milestone.amount;
    const fee = Number((amount * 0.025).toFixed(2));
    const newTxnId = `txn_pay_${Date.now()}`;

    const newTransaction: PaymentTransaction = {
      id: newTxnId,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      projectId,
      projectName: project.title,
      milestoneId,
      milestoneTitle: milestone.title,
      amount,
      currency: 'USD',
      platformFee: fee,
      netAmount: amount - fee,
      status: 'in_escrow',
      paypalOrderId,
      payerName: currentUser.name,
      payerEmail: currentUser.paypalEmail || 'billing@techcorp.io',
      payeeName: project.freelancerName,
      payeeEmail: 'freelancer.payout@proof2pay.internal',
      createdAt: new Date().toISOString(),
    };

    setTransactions(prev => [newTransaction, ...prev]);

    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        const updatedMilestones = p.milestones.map(m => {
          if (m.id !== milestoneId) return m;
          return {
            ...m,
            status: 'funded' as const,
            fundedAt: new Date().toISOString(),
            paypalTransactionId: newTxnId,
          };
        });
        return {
          ...p,
          escrowBalance: p.escrowBalance + amount,
          milestones: updatedMilestones,
        };
      })
    );

    showToast({
      type: 'success',
      title: 'PayPal Escrow Funded',
      message: `$${amount.toLocaleString()} securely locked in PayPal escrow for "${milestone.title}".`,
    });
    closePayPalModal();
  };

  // Business Action: Submit Evidence
  const submitEvidence = (evidenceData: Omit<EvidenceSubmission, 'id' | 'submittedAt'>) => {
    const newEvidenceId = `ev_${Date.now()}`;
    const newEvidence: EvidenceSubmission = {
      ...evidenceData,
      id: newEvidenceId,
      submittedAt: new Date().toISOString(),
    };

    setEvidences(prev => [newEvidence, ...prev]);

    // Update milestone status to evidence_submitted
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== evidenceData.projectId) return p;
        return {
          ...p,
          milestones: p.milestones.map(m => {
            if (m.id !== evidenceData.milestoneId) return m;
            return {
              ...m,
              status: 'evidence_submitted' as const,
              evidenceId: newEvidenceId,
            };
          }),
        };
      })
    );

    showToast({
      type: 'success',
      title: 'Evidence Submitted',
      message: 'Deliverables and commit artifacts logged to ProofGraph queue.',
    });
  };

  // Business Action: Run ProofGraph AI Analysis
  const runProofGraphAnalysis = async (milestoneId: string, evidenceId?: string): Promise<ProofGraphReport> => {
    const reportId = `pg_${milestoneId}`;
    const existing = proofGraphReports[reportId];
    if (existing) {
      setSelectedReportId(reportId);
      return existing;
    }

    // Generate dynamic high-integrity report
    const newReport: ProofGraphReport = {
      id: reportId,
      milestoneId,
      projectId: selectedProjectId,
      evidenceId: evidenceId || `ev_${Date.now()}`,
      generatedAt: new Date().toISOString(),
      overallScore: 95,
      verdict: 'approved',
      verdictReason: 'AST code static analysis verified deliverable specifications. Staging prober returned 200 OK (76ms latency) with passing integration tests.',
      metrics: {
        codeIntegrity: 98,
        requirementsMatch: 95,
        executionHealth: 96,
        testPassRate: 100,
      },
      forensics: {
        commitsAnalyzed: 16,
        linesChanged: { added: 1120, deleted: 94 },
        gitSignatureValid: true,
        stagingStatus: 200,
        stagingLatencyMs: 76,
        sslValid: true,
        testsTotal: 52,
        testsPassed: 52,
        demoVideoTranscribed: true,
      },
      recommendedAction: 'release_payment',
      checks: [
        {
          id: 'c_auto_1',
          name: 'Git Commit Forensics & Cryptographic Signature',
          category: 'code_integrity',
          status: 'pass',
          score: 99,
          summary: 'Verified GPG signed commits matching authorized freelancer public key.',
          details: 'Commit history exhibits consistent test-driven progression with no foreign rebases.',
          evidenceRef: 'git:gpg_signature_verified',
        },
        {
          id: 'c_auto_2',
          name: 'Acceptance Criteria Contract Match',
          category: 'acceptance_criteria',
          status: 'pass',
          score: 94,
          summary: 'Matched 100% of required functional endpoints and specifications.',
          details: 'ProofGraph semantic parser detected all contract interfaces and response schema formats.',
          evidenceRef: 'spec:criteria_matrix',
        },
        {
          id: 'c_auto_3',
          name: 'Synthetic Staging Health & Latency Probe',
          category: 'endpoint_health',
          status: 'pass',
          score: 96,
          summary: 'Prober verified HTTP 200 OK with 76ms latency and TLS 1.3 encryption.',
          details: 'Endpoint handles concurrent stress pings with zero socket drops.',
          evidenceRef: 'probe:live_staging_url',
        },
        {
          id: 'c_auto_4',
          name: 'Automated Test Assertions & Regression Shield',
          category: 'test_coverage',
          status: 'pass',
          score: 97,
          summary: '52/52 passing tests with 93.8% code coverage.',
          details: 'Edge case assertions verified for token expirations, malformed requests, and network timeouts.',
          evidenceRef: 'logs:test_suite_runner',
        },
      ],
      nodes: [
        { id: 'spec_root', label: 'Milestone Criteria', type: 'requirement', status: 'pass', confidence: 100, detail: 'Contract Requirements' },
        { id: 'repo_node', label: 'Git Commits (GPG)', type: 'evidence', status: 'pass', confidence: 99, detail: '16 signed commits analyzed' },
        { id: 'staging_node', label: 'Staging Endpoint', type: 'evidence', status: 'pass', confidence: 98, detail: 'HTTP 200 (76ms latency)' },
        { id: 'test_node', label: 'Test Report', type: 'evidence', status: 'pass', confidence: 100, detail: '52/52 assertions passed' },
        { id: 'video_node', label: 'Demo Walkthrough', type: 'evidence', status: 'pass', confidence: 92, detail: 'Feature walkthrough verified' },
        { id: 'ast_eval', label: 'AST Heuristics Engine', type: 'analysis', status: 'pass', confidence: 98, detail: 'Clean code & no CVEs' },
        { id: 'probe_eval', label: 'Endpoint Prober', type: 'analysis', status: 'pass', confidence: 96, detail: 'TLS 1.3 & Rate Limiting' },
        { id: 'verdict_final', label: 'ProofGraph Approval', type: 'verdict', status: 'pass', confidence: 95, detail: 'Ready for PayPal Escrow Release' },
      ],
      edges: [
        { from: 'spec_root', to: 'repo_node' },
        { from: 'spec_root', to: 'staging_node' },
        { from: 'spec_root', to: 'test_node' },
        { from: 'repo_node', to: 'ast_eval' },
        { from: 'staging_node', to: 'probe_eval' },
        { from: 'test_node', to: 'ast_eval' },
        { from: 'video_node', to: 'verdict_final' },
        { from: 'ast_eval', to: 'verdict_final' },
        { from: 'probe_eval', to: 'verdict_final' },
      ],
    };

    setProofGraphReports(prev => ({ ...prev, [reportId]: newReport }));

    // Update milestone status to ai_verified
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== selectedProjectId) return p;
        return {
          ...p,
          milestones: p.milestones.map(m => {
            if (m.id !== milestoneId) return m;
            return {
              ...m,
              status: 'ai_verified' as const,
              proofGraphId: reportId,
            };
          }),
        };
      })
    );

    setSelectedReportId(reportId);
    showToast({
      type: 'success',
      title: 'ProofGraph AI Verification Complete',
      message: `Score: ${newReport.overallScore}/100. Verification verdict: ${newReport.verdict.toUpperCase()}`,
    });
    return newReport;
  };

  // Business Action: Release Milestone Funds via PayPal
  const releaseMilestoneFunds = (projectId: string, milestoneId: string) => {
    const project = projects.find(p => p.id === projectId);
    const milestone = project?.milestones.find(m => m.id === milestoneId);
    if (!project || !milestone) return;

    const amount = milestone.amount;
    const fee = Number((amount * 0.025).toFixed(2));
    const captureId = `CAP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Update transaction or create released settlement
    setTransactions(prev => {
      const existing = prev.find(t => t.milestoneId === milestoneId && t.status === 'in_escrow');
      if (existing) {
        return prev.map(t =>
          t.id === existing.id
            ? {
                ...t,
                status: 'released' as const,
                paypalCaptureId: captureId,
                settledAt: new Date().toISOString(),
              }
            : t
        );
      } else {
        const newTx: PaymentTransaction = {
          id: `txn_pay_${Date.now()}`,
          invoiceNumber: `INV-2026-${Math.floor(2000 + Math.random() * 8000)}`,
          projectId,
          projectName: project.title,
          milestoneId,
          milestoneTitle: milestone.title,
          amount,
          currency: 'USD',
          platformFee: fee,
          netAmount: amount - fee,
          status: 'released',
          paypalOrderId: `PAYID-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          paypalCaptureId: captureId,
          payerName: currentUser.name,
          payerEmail: currentUser.paypalEmail || 'billing@techcorp.io',
          payeeName: project.freelancerName,
          payeeEmail: 'alex.payouts@cheneng.io',
          createdAt: new Date().toISOString(),
          settledAt: new Date().toISOString(),
        };
        return [newTx, ...prev];
      }
    });

    // Update Project milestones
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        const newBalance = Math.max(0, p.escrowBalance - amount);
        const updatedMilestones = p.milestones.map(m => {
          if (m.id !== milestoneId) return m;
          return {
            ...m,
            status: 'released' as const,
            releasedAt: new Date().toISOString(),
          };
        });
        return {
          ...p,
          escrowBalance: newBalance,
          milestones: updatedMilestones,
        };
      })
    );

    showToast({
      type: 'success',
      title: 'PayPal Payout Released!',
      message: `$${amount.toLocaleString()} successfully transferred to ${project.freelancerName} via PayPal.`,
    });
    closePayPalModal();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        currentPage,
        setCurrentPage,
        navigateTo,
        selectedProjectId,
        setSelectedProjectId,
        selectedMilestoneId,
        setSelectedMilestoneId,
        selectedReportId,
        setSelectedReportId,
        projects,
        transactions,
        proofGraphReports,
        evidences,
        toasts,
        showToast,
        removeToast,
        payPalModal,
        openPayPalFundingModal,
        openPayPalReleaseModal,
        closePayPalModal,
        selectedReceipt,
        openReceiptModal,
        closeReceiptModal,
        createProject,
        fundMilestone,
        submitEvidence,
        runProofGraphAnalysis,
        releaseMilestoneFunds,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
