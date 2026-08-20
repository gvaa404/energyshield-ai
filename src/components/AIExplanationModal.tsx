import React from 'react';
import { AIExplanation } from '../types/index';
import {
  Sparkles,
  X,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Layers,
} from 'lucide-react';

interface AIExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  explanation: AIExplanation | null;
  isLoading: boolean;
}

export const AIExplanationModal: React.FC<AIExplanationModalProps> = ({
  isOpen,
  onClose,
  explanation,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between sticky top-0 bg-[var(--bg-surface)] z-10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-[var(--text-primary)] text-base tracking-tight">
                AI Decision Explainability & Rationale Dossier
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Mathematical Optimization Solver + Grounded Energy Security Protocol
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1.5 rounded-lg hover:bg-[var(--bg-surface-subtle)] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 flex-1 text-xs">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
              <p className="text-[var(--text-primary)] font-medium">Synthesizing Decision Rationales & Trade-offs...</p>
            </div>
          ) : explanation ? (
            <>
              {/* Confidence & Verification Badge */}
              <div className="flex items-center justify-between bg-[var(--bg-surface-subtle)] p-3.5 rounded-xl border border-[var(--border-subtle)]">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-[var(--text-primary)] font-mono">
                    Decision Confidence Index: {explanation.confidenceScore}%
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10.5px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider font-mono">
                  Mathematically Verified
                </span>
              </div>

              {/* 1. WHAT */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center space-x-2 text-blue-400 font-bold uppercase tracking-wider text-[11px] font-mono">
                  <HelpCircle className="w-4 h-4" />
                  <span>1. WHAT Action is Recommended?</span>
                </div>
                <p className="text-[var(--text-primary)] leading-relaxed font-medium text-xs pt-0.5">
                  {explanation.what}
                </p>
              </div>

              {/* 2. WHY */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center space-x-2 text-amber-400 font-bold uppercase tracking-wider text-[11px] font-mono">
                  <TrendingUp className="w-4 h-4" />
                  <span>2. WHY is this the Optimal Contingency Allocation?</span>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed pt-0.5">
                  {explanation.why}
                </p>
              </div>

              {/* 3. HOW */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px] font-mono">
                  <ArrowRight className="w-4 h-4" />
                  <span>3. HOW to Execute Across Indian Refineries & SPM Ports?</span>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed pt-0.5">
                  {explanation.how}
                </p>
              </div>

              {/* Evidence Benchmarks */}
              <div>
                <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-2 font-mono">
                  Quantitative Evidence & Benchmarks:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {explanation.evidence.map((ev, idx) => (
                    <div
                      key={idx}
                      className="bg-[var(--bg-surface-subtle)] p-3.5 rounded-xl border border-[var(--border-subtle)] space-y-1 shadow-xs"
                    >
                      <span className="text-[var(--text-muted)] block text-[11px]">{ev.metric}</span>
                      <span className="text-[var(--text-primary)] font-bold text-sm block font-mono">{ev.value}</span>
                      <span className="text-emerald-500 text-[10.5px] font-mono font-medium block">
                        {ev.benchmark}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Trade-Offs */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-red-400 font-bold uppercase tracking-wider text-[11px] font-mono">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>Identified Risk Trade-Offs & Mitigation Safeguards:</span>
                </div>
                <ul className="space-y-1.5 text-[var(--text-secondary)] pt-1">
                  {explanation.riskTradeOffs.map((t, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="text-[var(--text-muted)] text-center py-12">No active explanation available.</p>
          )}
        </div>
      </div>
    </div>
  );
};
