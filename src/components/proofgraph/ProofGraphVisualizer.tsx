import React, { useState } from 'react';
import { GraphNode, GraphEdge } from '../../types';
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Layers, FileCode, Check, Eye } from 'lucide-react';

interface ProofGraphVisualizerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  overallScore: number;
  verdict: 'approved' | 'review_required' | 'flagged';
}

export const ProofGraphVisualizer: React.FC<ProofGraphVisualizerProps> = ({
  nodes,
  edges,
  overallScore,
  verdict,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[nodes.length - 1]?.id || 'verdict_node');

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Group nodes by type for clear spatial layered layout
  const requirementNodes = nodes.filter(n => n.type === 'requirement');
  const evidenceNodes = nodes.filter(n => n.type === 'evidence');
  const analysisNodes = nodes.filter(n => n.type === 'analysis');
  const verdictNodes = nodes.filter(n => n.type === 'verdict');

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <h4 className="text-base font-semibold text-white tracking-tight">
              ProofGraph™ Neural Heuristics Map
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive multi-dimensional forensic analysis tree. Click any node to inspect telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block">Synthesis Score</span>
            <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
              {overallScore}/100
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            {verdict}
          </span>
        </div>
      </div>

      {/* Main Graph Grid Canvas */}
      <div className="py-8 grid grid-cols-1 md:grid-cols-4 gap-6 relative">
        {/* Column 1: Requirements */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-800/80">
            1. Contract Spec
          </span>
          {requirementNodes.map(node => (
            <button
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`w-full p-3 rounded-xl border text-left transition-all ${
                selectedNodeId === node.id
                  ? 'bg-blue-950/60 border-blue-500 shadow-md shadow-blue-900/20 ring-1 ring-blue-500'
                  : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300 truncate">{node.label}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{node.detail}</p>
            </button>
          ))}
        </div>

        {/* Column 2: Submitted Evidence */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-800/80">
            2. Submitted Evidence
          </span>
          {evidenceNodes.map(node => (
            <button
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`w-full p-3 rounded-xl border text-left transition-all ${
                selectedNodeId === node.id
                  ? 'bg-blue-950/60 border-blue-500 shadow-md shadow-blue-900/20 ring-1 ring-blue-500'
                  : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-200 truncate">{node.label}</span>
                <span className="text-[11px] font-mono text-emerald-400 tabular-nums">
                  {node.confidence}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{node.detail}</p>
            </button>
          ))}
        </div>

        {/* Column 3: AI Heuristic Evaluators */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-800/80">
            3. Verification Heuristics
          </span>
          {analysisNodes.map(node => (
            <button
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`w-full p-3 rounded-xl border text-left transition-all ${
                selectedNodeId === node.id
                  ? 'bg-blue-950/60 border-blue-500 shadow-md shadow-blue-900/20 ring-1 ring-blue-500'
                  : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-200 truncate">{node.label}</span>
                <span className="text-[11px] font-mono text-emerald-400 tabular-nums">
                  {node.confidence}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{node.detail}</p>
            </button>
          ))}
        </div>

        {/* Column 4: Verdict Node */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-800/80">
            4. Synthesized Verdict
          </span>
          {verdictNodes.map(node => (
            <button
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                selectedNodeId === node.id
                  ? 'bg-emerald-950/70 border-emerald-500 shadow-lg shadow-emerald-950 ring-1 ring-emerald-500'
                  : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-300">{node.label}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-300 mt-2 font-medium">{node.detail}</p>
              <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Confidence</span>
                <span className="font-mono text-emerald-400 font-bold">{node.confidence}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Node Telemetry Inspector */}
      {selectedNode && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono text-[10px] uppercase">
                {selectedNode.type}
              </span>
              <span className="font-semibold text-slate-200">{selectedNode.label}</span>
            </div>
            <span className="font-mono text-slate-400">
              Reliability Index: <span className="text-emerald-400 font-bold">{selectedNode.confidence}%</span>
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans">{selectedNode.detail}</p>
        </div>
      )}
    </div>
  );
};
