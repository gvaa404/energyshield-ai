import React, { useState } from 'react';
import {
  Activity,
  Sliders,
  ShieldAlert,
  AlertTriangle,
  Layers,
  PieChart,
  Percent,
  CheckCircle,
} from 'lucide-react';
import { INITIAL_NETWORK_GRAPH } from '../../server/data/supplyChainData';

export const RiskIntelligencePanel: React.FC = () => {
  const [geoWeight, setGeoWeight] = useState(0.25);
  const [routeWeight, setRouteWeight] = useState(0.20);
  const [concentrationWeight, setConcentrationWeight] = useState(0.20);
  const [capacityWeight, setCapacityWeight] = useState(0.15);
  const [shippingWeight, setShippingWeight] = useState(0.10);
  const [sanctionsWeight, setSanctionsWeight] = useState(0.10);

  const suppliers = INITIAL_NETWORK_GRAPH.nodes.filter((n) => n.type === 'SUPPLIER');
  const corridors = INITIAL_NETWORK_GRAPH.nodes.filter((n) => n.type === 'CORRIDOR');

  // Calculate dynamic composite risk score based on current weights
  const rawComposite =
    35 * geoWeight +
    45 * routeWeight +
    52 * concentrationWeight +
    38 * capacityWeight +
    30 * shippingWeight +
    40 * sanctionsWeight;

  const compositeScore = Math.round(
    rawComposite /
      (geoWeight + routeWeight + concentrationWeight + capacityWeight + shippingWeight + sanctionsWeight)
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Banner */}
      <div className="enterprise-card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
              Composite Risk Intelligence & Vulnerability Index
            </h2>
            <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/30 uppercase tracking-wider font-mono">
              Multi-Vector Model
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
            Synthesizes geopolitical exposure, maritime chokepoint congestion, sanctions velocity, and
            Herfindahl-Hirschman supplier concentration indices.
          </p>
        </div>

        <div className="bg-[var(--bg-surface-subtle)] px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] flex items-center space-x-4 self-start md:self-auto shadow-xs">
          <div>
            <span className="text-[10px] text-[var(--text-muted)] uppercase block font-semibold tracking-wider font-mono">Composite Risk</span>
            <span
              className={`text-xl font-bold tracking-tight font-mono ${
                compositeScore > 50 ? 'text-red-500' : 'text-amber-500'
              }`}
            >
              {compositeScore} <span className="text-xs text-[var(--text-muted)] font-normal">/ 100</span>
            </span>
          </div>
          <span
            className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
              compositeScore > 65
                ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
            }`}
          >
            {compositeScore > 65 ? 'CRITICAL' : compositeScore > 40 ? 'ELEVATED' : 'STABLE'}
          </span>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* HHI Concentration Card */}
        <div className="enterprise-card p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center font-mono">
              <PieChart className="w-4 h-4 mr-1.5 text-blue-500" />
              Supplier Concentration (HHI)
            </span>
            <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
              2,650 HHI
            </span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            The Herfindahl-Hirschman Index exceeds 2,500 due to high import concentration across Russia, Saudi Arabia, and Iraq (~76% combined).
          </p>

          <div className="space-y-1.5 pt-1 text-xs font-mono">
            <div className="flex justify-between text-[11.5px]">
              <span className="text-[var(--text-secondary)]">Russia</span>
              <span className="font-bold text-[var(--text-primary)]">29.0% (1.45 MBD)</span>
            </div>
            <div className="flex justify-between text-[11.5px]">
              <span className="text-[var(--text-secondary)]">Iraq</span>
              <span className="font-bold text-[var(--text-primary)]">21.0% (1.05 MBD)</span>
            </div>
            <div className="flex justify-between text-[11.5px]">
              <span className="text-[var(--text-secondary)]">Saudi Arabia</span>
              <span className="font-bold text-[var(--text-primary)]">17.0% (0.85 MBD)</span>
            </div>
          </div>
        </div>

        {/* Chokepoint Dependency Card */}
        <div className="enterprise-card p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center font-mono">
              <ShieldAlert className="w-4 h-4 mr-1.5 text-red-500" />
              Chokepoint Exposure
            </span>
            <span className="text-xs font-mono font-bold text-red-400 px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30">
              66.0% Bottleneck
            </span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            66.0% of India crude imports transit either the Strait of Hormuz (47.0%) or Bab el-Mandeb (19.0%), creating vulnerability to maritime blockades.
          </p>

          <div className="space-y-1.5 pt-1 text-xs font-mono">
            <div className="flex justify-between text-[11.5px]">
              <span className="text-[var(--text-secondary)]">Strait of Hormuz</span>
              <span className="font-bold text-red-500">2.35 MBD (47.0%)</span>
            </div>
            <div className="flex justify-between text-[11.5px]">
              <span className="text-[var(--text-secondary)]">Bab el-Mandeb / Red Sea</span>
              <span className="font-bold text-orange-500">0.95 MBD (19.0%)</span>
            </div>
            <div className="flex justify-between text-[11.5px]">
              <span className="text-[var(--text-secondary)]">Cape of Good Hope Bypass</span>
              <span className="font-bold text-emerald-500">1.15 MBD (23.0%)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Weight Tuning */}
        <div className="enterprise-card p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center font-mono">
              <Sliders className="w-4 h-4 mr-1.5 text-blue-500" />
              Risk Model Weights
            </span>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">Dynamic Calibration</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-[var(--text-secondary)] font-medium mb-1">
                <span>Geopolitical Exposure</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">{Math.round(geoWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={geoWeight}
                onChange={(e) => setGeoWeight(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[var(--text-secondary)] font-medium mb-1">
                <span>Maritime Route Risk</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">{Math.round(routeWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={routeWeight}
                onChange={(e) => setRouteWeight(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[var(--text-secondary)] font-medium mb-1">
                <span>Supplier Concentration</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">{Math.round(concentrationWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={concentrationWeight}
                onChange={(e) => setConcentrationWeight(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Corridor & Supplier Vulnerability Scores Table */}
      <div className="enterprise-card overflow-hidden">
        <div className="p-4 border-b border-[var(--border-subtle)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
            Corridor & Producer Risk Breakdown Matrix
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Detailed parameter scores evaluated across shipping density, war risk premiums, and political volatility.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] font-semibold border-b border-[var(--border-subtle)] font-mono">
              <tr>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Current Flow</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4 text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {[...corridors, ...suppliers].map((node) => (
                <tr key={node.id} className="hover:bg-[var(--bg-surface-subtle)] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[var(--text-primary)]">{node.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10.5px] font-mono bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                      {node.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[var(--text-primary)]">{node.currentFlowMbpd.toFixed(2)} MBPD</td>
                  <td className="py-3 px-4 font-mono text-[var(--text-muted)]">{node.capacityMbpd.toFixed(2)} MBPD</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        node.riskLevel === 'CRITICAL'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : node.riskLevel === 'HIGH'
                          ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                          : node.riskLevel === 'MEDIUM'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {node.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">
                    <span
                      className={
                        node.riskScore > 65
                          ? 'text-red-500'
                          : node.riskScore > 40
                          ? 'text-amber-500'
                          : 'text-emerald-500'
                      }
                    >
                      {node.riskScore}
                    </span>
                    <span className="text-[var(--text-muted)] text-[10px]"> / 100</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
