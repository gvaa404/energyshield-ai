import React, { useState } from 'react';
import {
  ProcurementOptimizationResult,
  SimulationResult,
} from '../types/index';
import {
  TrendingUp,
  Sliders,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  Ship,
  Globe2,
  Layers,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';

interface ProcurementOptimizerViewProps {
  procurementResult: ProcurementOptimizationResult | null;
  simulationResult: SimulationResult | null;
  onReOptimize: (weights: {
    costWeight: number;
    riskWeight: number;
    delayWeight: number;
    diversificationWeight: number;
  }) => Promise<void>;
  onOpenExplanation: () => void;
  isLoading: boolean;
}

export const ProcurementOptimizerView: React.FC<ProcurementOptimizerViewProps> = ({
  procurementResult,
  simulationResult,
  onReOptimize,
  onOpenExplanation,
  isLoading,
}) => {
  const [costWeight, setCostWeight] = useState(0.35);
  const [riskWeight, setRiskWeight] = useState(0.35);
  const [delayWeight, setDelayWeight] = useState(0.15);
  const [diversificationWeight, setDiversificationWeight] = useState(0.15);

  const handleApplyWeights = () => {
    const total = costWeight + riskWeight + delayWeight + diversificationWeight;
    onReOptimize({
      costWeight: Number((costWeight / total).toFixed(2)),
      riskWeight: Number((riskWeight / total).toFixed(2)),
      delayWeight: Number((delayWeight / total).toFixed(2)),
      diversificationWeight: Number((diversificationWeight / total).toFixed(2)),
    });
  };

  if (!procurementResult) {
    return (
      <div className="enterprise-card p-12 text-center space-y-4">
        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto text-blue-500 border border-blue-500/20">
          <TrendingUp className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-[var(--text-primary)]">No Active Disruption to Optimize</h3>
        <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
          The Adaptive Procurement Rerouting engine is ready. Launch a scenario from the What-If Simulator or trigger the guided demo to generate an optimal contingency allocation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Banner */}
      <div className="enterprise-card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
              Adaptive Procurement & Route Optimization
            </h2>
            <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/30 uppercase tracking-wider font-mono">
              Multi-Objective Solver
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
            Mathematical optimization minimizing Total Landed Cost + Route Geopolitical Risk + Transit Delays
            subject to supplier surge limits and refinery distillation flexibility.
          </p>
        </div>

        <button
          id="btn-explain-procurement"
          onClick={onOpenExplanation}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md flex items-center transition self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 mr-1.5 text-white" />
          AI Explanation & Evidence
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="enterprise-card p-4">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
            Target Shortfall
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[var(--text-primary)] font-mono">
              {procurementResult.totalRequiredSurgeMbpd.toFixed(2)}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">MBPD</span>
          </div>
          <span className="text-[10.5px] text-[var(--text-muted)] mt-1 block">Volume to replace</span>
        </div>

        <div className="enterprise-card p-4">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
            Total Reallocated
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-500 font-mono">
              {procurementResult.totalReallocatedMbpd.toFixed(2)}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">MBPD</span>
          </div>
          <span className="text-[10.5px] text-emerald-500 mt-1 block font-medium">
            {Math.round((procurementResult.totalReallocatedMbpd / (procurementResult.totalRequiredSurgeMbpd || 1)) * 100)}% Disruption Mitigated
          </span>
        </div>

        <div className="enterprise-card p-4">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
            Net Cost Variance
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-500 font-mono">
              +${procurementResult.netCostIncreaseMillionUsdDay.toFixed(1)}M
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">/ day</span>
          </div>
          <span className="text-[10.5px] text-[var(--text-muted)] mt-1 block font-mono">Landed Freight Premium</span>
        </div>

        <div className="enterprise-card p-4">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
            Diversification (HHI)
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-blue-500 font-mono">1,420</span>
            <span className="text-xs text-[var(--text-muted)] font-mono">HHI</span>
          </div>
          <span className="text-[10.5px] text-emerald-500 mt-1 block font-medium">
            Well-Diversified Supply Base
          </span>
        </div>
      </div>

      {/* Solver Multi-Objective Weights Bar */}
      <div className="enterprise-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono">
              Solver Multi-Objective Weights
            </span>
          </div>
          <button
            onClick={handleApplyWeights}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold border border-blue-500/30 transition shadow-xs"
          >
            Re-solve Optimization
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-[var(--bg-surface-subtle)] p-3 rounded-lg border border-[var(--border-subtle)]">
            <div className="flex justify-between text-[var(--text-secondary)] font-medium mb-1">
              <span>Landed Cost Weight</span>
              <span className="font-bold text-[var(--text-primary)] font-mono">{Math.round(costWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.05"
              value={costWeight}
              onChange={(e) => setCostWeight(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="bg-[var(--bg-surface-subtle)] p-3 rounded-lg border border-[var(--border-subtle)]">
            <div className="flex justify-between text-[var(--text-secondary)] font-medium mb-1">
              <span>Route Risk Weight</span>
              <span className="font-bold text-[var(--text-primary)] font-mono">{Math.round(riskWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.05"
              value={riskWeight}
              onChange={(e) => setRiskWeight(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="bg-[var(--bg-surface-subtle)] p-3 rounded-lg border border-[var(--border-subtle)]">
            <div className="flex justify-between text-[var(--text-secondary)] font-medium mb-1">
              <span>Transit Delay Weight</span>
              <span className="font-bold text-[var(--text-primary)] font-mono">{Math.round(delayWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={delayWeight}
              onChange={(e) => setDelayWeight(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="bg-[var(--bg-surface-subtle)] p-3 rounded-lg border border-[var(--border-subtle)]">
            <div className="flex justify-between text-[var(--text-secondary)] font-medium mb-1">
              <span>Diversification Weight</span>
              <span className="font-bold text-[var(--text-primary)] font-mono">{Math.round(diversificationWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={diversificationWeight}
              onChange={(e) => setDiversificationWeight(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Professional Procurement Comparison Table */}
      <div className="enterprise-card overflow-hidden">
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
              Supplier Comparison & Ranked Allocation Matrix
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Objective solver output evaluating available surge headroom against API crude assay distillation compatibility.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] font-semibold border-b border-[var(--border-subtle)]">
              <tr>
                <th className="py-3 px-4 font-mono">Rank / Supplier</th>
                <th className="py-3 px-4 font-mono">Available Capacity</th>
                <th className="py-3 px-4 font-mono">Route Risk</th>
                <th className="py-3 px-4 font-mono">Estimated Landed Cost</th>
                <th className="py-3 px-4 font-mono">Delivery Time</th>
                <th className="py-3 px-4 font-mono">Risk Score</th>
                <th className="py-3 px-4 font-mono">Recommendation</th>
                <th className="py-3 px-4 text-right font-mono">Allocated Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {procurementResult.alternatives.map((alt) => {
                const isAllocated = alt.recommendedAllocationMbpd > 0;
                return (
                  <tr
                    key={alt.supplierId}
                    className={`hover:bg-[var(--bg-surface-subtle)] transition-colors ${
                      isAllocated ? 'bg-blue-600/5' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] font-mono shadow-xs">
                          {alt.rank}
                        </span>
                        <div>
                          <span className="font-semibold text-[var(--text-primary)] block">{alt.supplierName}</span>
                          <span className="text-[11px] text-[var(--text-muted)] font-mono">{alt.crudeGrade}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-[var(--text-primary)]">
                      {alt.availableSurgeCapacityMbpd.toFixed(2)} MBPD
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          alt.riskLevel === 'LOW'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : alt.riskLevel === 'MEDIUM'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {alt.riskLevel}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-semibold text-[var(--text-primary)]">${alt.landedCostPerBarrelUsd.toFixed(2)}</span>
                      <span className="text-[10.5px] text-[var(--text-muted)]">/bbl</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[var(--text-secondary)]">
                      {alt.transitDays} Days
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold">
                      <span className={alt.riskScore > 50 ? 'text-red-500' : 'text-emerald-500'}>
                        {alt.riskScore}
                      </span>
                      <span className="text-[var(--text-muted)]"> / 100</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {isAllocated ? (
                        <span className="inline-flex items-center text-emerald-500 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                          Recommended
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)] text-[11px]">Secondary Reserve</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isAllocated ? (
                        <span className="font-mono font-bold text-sm text-emerald-500 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                          +{alt.recommendedAllocationMbpd.toFixed(2)} MBPD
                        </span>
                      ) : (
                        <span className="font-mono text-[var(--text-muted)]">0.00 MBPD</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

