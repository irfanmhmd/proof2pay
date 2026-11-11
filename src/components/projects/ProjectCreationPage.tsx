import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MilestoneCriteria, Milestone } from '../../types';
import {
  FolderPlus,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MOCK_USERS } from '../../data/mockData';

export const ProjectCreationPage: React.FC = () => {
  const { currentUser, createProject, navigateTo, openPayPalFundingModal } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Backend & Fintech');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('2026-12-15');
  const [selectedFreelancerId, setSelectedFreelancerId] = useState(MOCK_USERS[1].id);

  // Dynamic Milestones
  const [milestones, setMilestones] = useState<
    Array<{
      title: string;
      description: string;
      amount: number;
      dueDate: string;
      criteria: MilestoneCriteria[];
    }>
  >([
    {
      title: 'Architecture RFC, Database Schema & Auth Engine',
      description: 'PostgreSQL relational migrations with JWT authentication middleware and OpenAPI 3.1 documentation.',
      amount: 2500,
      dueDate: '2026-11-20',
      criteria: [
        { id: 'c1', description: 'PostgreSQL schema with idempotency tables', category: 'code', weight: 40 },
        { id: 'c2', description: 'JWT authentication with RBAC role guards', category: 'api', weight: 30 },
        { id: 'c3', description: 'Automated test suite passing with >= 85% coverage', category: 'testing', weight: 30 },
      ],
    },
    {
      title: 'Core Business Logic & Webhook Pipeline',
      description: 'Webhook queue consumers with exponential backoff and PayPal IPN signature verifiers.',
      amount: 2500,
      dueDate: '2026-12-05',
      criteria: [
        { id: 'c4', description: 'HMAC SHA256 cryptographic signature validation', category: 'security', weight: 50 },
        { id: 'c5', description: 'Staging deployment returning 200 OK under 100ms', category: 'api', weight: 50 },
      ],
    },
  ]);

  const totalBudget = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      {
        title: `Milestone ${milestones.length + 1}: Implementation`,
        description: 'Provide deliverable description and verification criteria.',
        amount: 1500,
        dueDate: '2026-12-20',
        criteria: [
          { id: `c_${Date.now()}`, description: 'Live staging endpoint verified', category: 'api', weight: 50 },
          { id: `c_${Date.now() + 1}`, description: 'Clean git commits with test suite passing', category: 'testing', weight: 50 },
        ],
      },
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleUpdateMilestone = (index: number, field: string, value: any) => {
    setMilestones(
      milestones.map((m, i) => {
        if (i !== index) return m;
        return { ...m, [field]: value };
      })
    );
  };

  const handleAddCriteria = (milestoneIndex: number) => {
    const newCriteria: MilestoneCriteria = {
      id: `crit_${Date.now()}`,
      description: 'New deliverable check',
      category: 'code',
      weight: 25,
    };

    setMilestones(
      milestones.map((m, i) => {
        if (i !== milestoneIndex) return m;
        return { ...m, criteria: [...m.criteria, newCriteria] };
      })
    );
  };

  const handleRemoveCriteria = (milestoneIndex: number, criteriaId: string) => {
    setMilestones(
      milestones.map((m, i) => {
        if (i !== milestoneIndex) return m;
        return { ...m, criteria: m.criteria.filter(c => c.id !== criteriaId) };
      })
    );
  };

  const handleFinalSubmit = (fundFirstImmediately: boolean = false) => {
    const freelancer = MOCK_USERS.find(u => u.id === selectedFreelancerId) || MOCK_USERS[1];

    const formattedMilestones: Milestone[] = milestones.map((m, idx) => ({
      id: `ms_gen_${Date.now()}_${idx}`,
      projectId: '', // will be set
      title: m.title,
      description: m.description,
      amount: Number(m.amount),
      currency: 'USD',
      dueDate: m.dueDate,
      status: idx === 0 && fundFirstImmediately ? 'pending_funding' : 'draft',
      criteria: m.criteria,
    }));

    const created = createProject({
      title: title || 'Fullstack Cloud API & Realtime Dashboard',
      description: description || 'Engineered with TypeScript, PostgreSQL, and automated ProofGraph verification checks.',
      category,
      status: 'active',
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientAvatar: currentUser.avatar,
      clientCompany: currentUser.company || 'TechCorp Ventures',
      freelancerId: freelancer.id,
      freelancerName: freelancer.name,
      freelancerAvatar: freelancer.avatar,
      freelancerTitle: freelancer.title || 'Senior Software Engineer',
      totalBudget,
      currency: 'USD',
      deadline,
      milestones: formattedMilestones,
    });

    if (fundFirstImmediately && created.milestones[0]) {
      openPayPalFundingModal(created.id, created.milestones[0].id);
    }

    navigateTo('project-details', { projectId: created.id });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create Milestone Contract
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Define verifiable milestones with automated ProofGraph™ heuristics and PayPal escrow.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigateTo('client-dashboard')}>
          Back to Dashboard
        </Button>
      </div>

      {/* Wizard Steps indicator */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setStep(1)}
          className={`py-2 px-3 rounded-lg text-center transition-colors ${
            step === 1 ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
          }`}
        >
          1. Contract Basics
        </button>
        <button
          onClick={() => setStep(2)}
          className={`py-2 px-3 rounded-lg text-center transition-colors ${
            step === 2 ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
          }`}
        >
          2. Milestones & Heuristics
        </button>
        <button
          onClick={() => setStep(3)}
          className={`py-2 px-3 rounded-lg text-center transition-colors ${
            step === 3 ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
          }`}
        >
          3. PayPal Escrow Setup
        </button>
      </div>

      {/* STEP 1: Basic Information */}
      {step === 1 && (
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Contract Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Distributed Payment Gateway & Webhook Infrastructure"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Backend & Fintech">Backend & Fintech</option>
                  <option value="Frontend & UI/UX">Frontend & UI/UX</option>
                  <option value="Fullstack & Realtime">Fullstack & Realtime</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Mobile Development">Mobile Development</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Overall Completion Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Assign Specialized Freelancer
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOCK_USERS.filter(u => u.role === 'freelancer').map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFreelancerId(f.id)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-colors ${
                      selectedFreelancerId === f.id
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={f.avatar}
                      alt={f.name}
                      className="w-9 h-9 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{f.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{f.title}</p>
                      <span className="text-[10px] text-emerald-600 font-medium">Verified {f.trustScore}% Score</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Scope & Requirements Specification
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Detail technical stack, SLA, repository conventions, and communication expectations..."
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="primary"
              size="md"
              onClick={() => setStep(2)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Configure Milestones
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Milestones & Criteria Builder */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Milestone Deliverables & Acceptance Criteria
              </h3>
              <p className="text-xs text-slate-500">
                ProofGraph AI evaluates evidence against these criteria before authorizing payout.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddMilestone}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Milestone
            </Button>
          </div>

          <div className="space-y-4">
            {milestones.map((milestone, mIndex) => (
              <Card key={mIndex} className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                        Milestone {mIndex + 1}
                      </span>
                      <input
                        type="text"
                        value={milestone.title}
                        onChange={e => handleUpdateMilestone(mIndex, 'title', e.target.value)}
                        placeholder="Milestone Title"
                        className="flex-1 px-3 py-1.5 text-sm font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={milestone.description}
                      onChange={e => handleUpdateMilestone(mIndex, 'description', e.target.value)}
                      placeholder="Deliverable description..."
                      className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-medium text-slate-500 block mb-1">
                          Milestone Budget (USD)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-xs text-slate-400 font-mono">$</span>
                          <input
                            type="number"
                            value={milestone.amount}
                            onChange={e => handleUpdateMilestone(mIndex, 'amount', Number(e.target.value))}
                            className="w-full pl-7 pr-3 py-1.5 text-xs font-mono rounded-md border border-slate-200 dark:border-slate-700 bg-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-slate-500 block mb-1">
                          Target Due Date
                        </label>
                        <input
                          type="date"
                          value={milestone.dueDate}
                          onChange={e => handleUpdateMilestone(mIndex, 'dueDate', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-transparent"
                        />
                      </div>
                    </div>

                    {/* Criteria List */}
                    <div className="pt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          ProofGraph Acceptance Heuristics
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddCriteria(mIndex)}
                          className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
                        >
                          + Add Criteria
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {milestone.criteria.map(c => (
                          <div
                            key={c.id}
                            className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs"
                          >
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 uppercase">
                              {c.category}
                            </span>
                            <span className="flex-1 font-medium text-slate-800 dark:text-slate-200">
                              {c.description}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCriteria(mIndex, c.id)}
                              className="text-slate-400 hover:text-rose-500 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(mIndex)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setStep(3)} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Proceed to Escrow Setup
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: PayPal Escrow Funding Configuration */}
      {step === 3 && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              PayPal Milestone Escrow Summary
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Review your budget allocations and configure initial escrow deposit.
            </p>
          </div>

          {/* Financial Overview */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-slate-300">Total Contract Value</span>
              <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                ${totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Proof2Pay Escrow Protection Fee (2.5%)</span>
              <span className="font-mono">${(totalBudget * 0.025).toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
              <span>Initial Milestone 1 Escrow Deposit</span>
              <span className="font-mono text-base">
                ${(milestones[0]?.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Escrow Guarantee */}
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>PayPal Milestone Escrow Protections</span>
            </div>
            <p className="leading-relaxed">
              Deposits are held safely in PayPal escrow. Funds cannot be released until ProofGraph AI verifies the deliverables with confidence ≥ 85% or you explicitly authorize release.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setStep(2)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Milestones
            </Button>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => handleFinalSubmit(false)}>
                Save as Draft
              </Button>
              <Button
                variant="paypal"
                size="lg"
                onClick={() => handleFinalSubmit(true)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create & Fund Milestone 1 via PayPal
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
