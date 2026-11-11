export type UserRole = 'client' | 'freelancer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  company?: string;
  title?: string;
  paypalEmail: string;
  paypalVerified: boolean;
  trustScore?: number;
}

export type ProjectStatus = 'active' | 'completed' | 'in_dispute' | 'draft';

export type MilestoneStatus =
  | 'draft'
  | 'pending_funding'
  | 'funded'
  | 'in_progress'
  | 'evidence_submitted'
  | 'ai_verified'
  | 'released'
  | 'disputed';

export interface MilestoneCriteria {
  id: string;
  description: string;
  category: 'code' | 'api' | 'ui' | 'testing' | 'documentation' | 'security';
  weight: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: MilestoneStatus;
  criteria: MilestoneCriteria[];
  evidenceId?: string;
  proofGraphId?: string;
  paypalTransactionId?: string;
  fundedAt?: string;
  releasedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ProjectStatus;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  clientCompany: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  freelancerTitle: string;
  totalBudget: number;
  escrowBalance: number;
  currency: string;
  createdAt: string;
  deadline: string;
  milestones: Milestone[];
}

export interface EvidenceSubmission {
  id: string;
  milestoneId: string;
  projectId: string;
  submittedBy: string;
  submittedAt: string;
  githubRepoUrl: string;
  commitSha: string;
  branchName: string;
  stagingUrl: string;
  videoDemoUrl?: string;
  testSuiteOutput?: string;
  notes?: string;
  attachments?: { name: string; size: string; type: string }[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'requirement' | 'evidence' | 'analysis' | 'verdict';
  status: 'pass' | 'warning' | 'fail' | 'neutral';
  confidence: number; // 0 - 100
  detail: string;
  category?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  label?: string;
  strength?: number;
}

export interface VerificationCheck {
  id: string;
  name: string;
  category: 'code_integrity' | 'acceptance_criteria' | 'endpoint_health' | 'test_coverage' | 'security';
  status: 'pass' | 'warning' | 'fail';
  score: number;
  summary: string;
  details: string;
  evidenceRef: string;
}

export interface ProofGraphReport {
  id: string;
  milestoneId: string;
  projectId: string;
  evidenceId: string;
  generatedAt: string;
  overallScore: number; // 0 - 100
  verdict: 'approved' | 'review_required' | 'flagged';
  verdictReason: string;
  metrics: {
    codeIntegrity: number;
    requirementsMatch: number;
    executionHealth: number;
    testPassRate: number;
  };
  checks: VerificationCheck[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  forensics: {
    commitsAnalyzed: number;
    linesChanged: { added: number; deleted: number };
    gitSignatureValid: boolean;
    stagingStatus: number;
    stagingLatencyMs: number;
    sslValid: boolean;
    testsTotal: number;
    testsPassed: number;
    demoVideoTranscribed: boolean;
  };
  recommendedAction: 'release_payment' | 'request_revision' | 'escalate_dispute';
  suggestedRevisions?: string[];
}

export type TransactionStatus = 'in_escrow' | 'released' | 'refunded' | 'pending';

export interface PaymentTransaction {
  id: string;
  invoiceNumber: string;
  projectId: string;
  projectName: string;
  milestoneId: string;
  milestoneTitle: string;
  amount: number;
  currency: string;
  platformFee: number;
  netAmount: number;
  status: TransactionStatus;
  paypalOrderId: string;
  paypalCaptureId?: string;
  payerName: string;
  payerEmail: string;
  payeeName: string;
  payeeEmail: string;
  createdAt: string;
  settledAt?: string;
}
