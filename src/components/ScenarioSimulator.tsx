import React, { useState } from 'react';
import {
  ScenarioParameter,
  SimulationResult,
  SupplyChainNode,
} from '../types/index';
import { PRESET_SCENARIOS } from '../../server/data/supplyChainData';
import {
  Sliders,
  Play,
  RotateCcw,
  ShieldAlert,
  TrendingDown,
  Clock,
  DollarSign,
  Factory,
  Database,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface ScenarioSimulatorProps {
  onRunSimulation: (scenario: ScenarioParameter) => Promise<void>;
  simulationResult: SimulationResult | null;
  onReset: () => void;
  onNavigateToProcurement: () => void;
  onNavigateToReserves: () => void;
  onOpenExplanation: () => void;
  isLoading: boolean;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  onRunSimulation,
  simulationResult,
  onReset,
  onNavigateToProcurement,
  onNavigateToReserves,
  onOpenExplanation,
  isLoading,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<ScenarioParameter>(PRESET_SCENARIOS[0]);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  // Custom scenario editable state
  const [customName, setCustomName] = useState('Custom Strait & Supplier Disruption');
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [durationDays, setDurationDays] = useState(30);
  const [capacityReductionPct, setCapacityReductionPct] = useState(70);
  const [selectedCorridors, setSelectedCorridors] = useState<string[]>(['cor_hormuz']);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>(['sup_saudi', 'sup_iraq']);

  const handleSelectPreset = (preset: ScenarioParameter) => {
    setSelectedPreset(preset);
    setIsCustom(false);
    setSeverity(preset.severity);
    setDurationDays(preset.durationDays);
    setCapacityReductionPct(preset.capacityReductionPct);
    setSelectedCorridors(preset.affectedCorridorIds);
    setSelectedSuppliers(preset.affectedSupplierIds);
  };

  const handleExecute = () => {
    const scenario: ScenarioParameter = isCustom
      ? {
          id: `custom_${Date.now()}`,
          name: customName,
          category: 'CUSTOM',
          affectedCorridorIds: selectedCorridors,
          affectedSupplierIds: selectedSuppliers,
          severity,
          capacityReductionPct,
          durationDays,
          description: `Custom simulation affecting ${(selectedCorridors || []).join(', ')} with ${capacityReductionPct}% reduction for ${durationDays} days.`,
        }
      : selectedPreset;

    onRunSimulation(scenario);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Banner */}
      <div className="enterprise-card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
              What-If Disruption Scenario Simulator
            </h2>
            <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/30 uppercase tracking-wider font-mono">
              Deterministic Engine
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
            Simulate real-time maritime chokepoint blockades, supplier embargoes, or sanctions.
            Calculates exact supply lost, refinery throughput deficits, transit delay propagation, and strategic reserve draw requirements.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {simulationResult && (
            <button
              onClick={onReset}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] transition flex items-center shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-[var(--text-secondary)]" />
              Reset Baseline
            </button>
          )}

          <button
            id="btn-run-simulation"
            onClick={handleExecute}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md flex items-center transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                <span>Simulating Network Propagation...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 mr-1.5 fill-white text-white" />
                <span>Run Disruption Simulation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Steps Indicator */}
      {isLoading && (
        <div className="enterprise-card p-4 bg-blue-500/10 border-blue-500/30 animate-pulse flex items-center justify-between text-xs text-blue-400 font-medium">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span>Analyzing network topology... Simulating disruption... Calculating supply gap... Optimizing alternatives...</span>
          </div>
          <span className="font-mono font-semibold">MoPNG Calibration Matrix</span>
        </div>
      )}

      {/* Scenario Configurator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preset Scenarios List */}
        <div className="lg:col-span-1 enterprise-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)]">
            <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono">
              1. Choose Scenario Preset
            </span>
            <button
              onClick={() => setIsCustom(!isCustom)}
              className="text-[11.5px] text-blue-500 hover:underline font-semibold"
            >
              {isCustom ? '← View Presets' : '+ Custom Scenario'}
            </button>
          </div>

          {!isCustom ? (
            <div className="space-y-2.5">
              {PRESET_SCENARIOS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <div
                    key={preset.id}
                    id={`preset-${preset.id}`}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-sm ring-1 ring-blue-500/40'
                        : 'bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-semibold text-xs text-[var(--text-primary)] leading-tight">
                        {preset.name}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold font-mono ${
                          preset.severity === 'CRITICAL'
                            ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {preset.severity}
                      </span>
                    </div>

                    <p className="text-[11.5px] text-[var(--text-secondary)] mt-1.5 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>

                    <div className="flex items-center space-x-3 mt-2.5 text-[10.5px] text-[var(--text-muted)] font-mono">
                      <span>Capacity Loss: -{preset.capacityReductionPct}%</span>
                      <span>Duration: {preset.durationDays}d</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Custom Scenario Form */
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-[var(--text-secondary)] font-medium block mb-1 text-[11.5px]">Scenario Title</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="text-[var(--text-secondary)] font-medium block mb-1 text-[11.5px]">Severity Rating</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition font-medium"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div className="bg-[var(--bg-surface-subtle)] p-3 rounded-lg border border-[var(--border-subtle)]">
                <div className="flex justify-between text-[var(--text-secondary)] font-medium mb-1.5 text-xs">
                  <span>Capacity Reduction</span>
                  <span className="font-bold text-blue-500 font-mono">{capacityReductionPct}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={capacityReductionPct}
                  onChange={(e) => setCapacityReductionPct(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="bg-[var(--bg-surface-subtle)] p-3 rounded-lg border border-[var(--border-subtle)]">
                <div className="flex justify-between text-[var(--text-secondary)] font-medium mb-1.5 text-xs">
                  <span>Disruption Duration</span>
                  <span className="font-bold text-blue-500 font-mono">{durationDays} Days</span>
                </div>
                <input
                  type="range"
                  min="7"
                  max="90"
                  step="1"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Selected Parameters & Corridor Matrix */}
        <div className="lg:col-span-2 enterprise-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div>
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
                2. Disruption Parameters & Impact Vectors
              </span>
              <h3 className="font-bold text-[var(--text-primary)] text-base mt-0.5 tracking-tight">
                {isCustom ? customName : selectedPreset.name}
              </h3>
            </div>
            <span
              className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                (isCustom ? severity : selectedPreset.severity) === 'CRITICAL'
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }`}
            >
              {(isCustom ? severity : selectedPreset.severity)} SEVERITY
            </span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-surface-subtle)] p-3.5 rounded-lg border border-[var(--border-subtle)]">
            {isCustom
              ? `Simulating an unmitigated supply disruption with ${capacityReductionPct}% reduction across selected corridor vectors for ${durationDays} days.`
              : selectedPreset.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[var(--bg-surface-subtle)] p-3.5 rounded-lg border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] block text-[11px]">Baseline Inflow</span>
              <span className="font-bold text-[var(--text-primary)] text-base mt-0.5 block font-mono">5.00 MBPD</span>
              <span className="text-[10px] text-[var(--text-muted)]">Total Import Run Rate</span>
            </div>

            <div className="bg-[var(--bg-surface-subtle)] p-3.5 rounded-lg border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] block text-[11px]">Flow Reduction</span>
              <span className="font-bold text-red-500 text-base mt-0.5 block font-mono">
                -{isCustom ? capacityReductionPct : selectedPreset.capacityReductionPct}%
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">Throughput Loss</span>
            </div>

            <div className="bg-[var(--bg-surface-subtle)] p-3.5 rounded-lg border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] block text-[11px]">Disruption Horizon</span>
              <span className="font-bold text-blue-500 text-base mt-0.5 block font-mono">
                {isCustom ? durationDays : selectedPreset.durationDays} Days
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">Time Window</span>
            </div>

            <div className="bg-[var(--bg-surface-subtle)] p-3.5 rounded-lg border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] block text-[11px]">National Demand</span>
              <span className="font-bold text-[var(--text-primary)] text-base mt-0.5 block font-mono">5.10 MBPD</span>
              <span className="text-[10px] text-[var(--text-muted)]">Domestic Distillation</span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2 font-mono">
              Chokepoints & Supply Origins Subject to Stress:
            </span>
            <div className="flex flex-wrap gap-2">
              {(isCustom ? selectedCorridors : selectedPreset.affectedCorridorIds).map((cid) => (
                <span
                  key={cid}
                  className="px-2.5 py-1 rounded bg-red-500/15 text-red-400 border border-red-500/30 text-xs font-mono font-semibold flex items-center shadow-xs"
                >
                  <ShieldAlert className="w-3.5 h-3.5 mr-1 text-red-400" />
                  {cid === 'cor_hormuz' ? 'Strait of Hormuz (82 Risk)' : cid === 'cor_redsea' ? 'Bab el-Mandeb / Red Sea (78 Risk)' : cid}
                </span>
              ))}
              {(isCustom ? selectedSuppliers : selectedPreset.affectedSupplierIds).map((sid) => (
                <span
                  key={sid}
                  className="px-2.5 py-1 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-mono font-semibold"
                >
                  Origin: {sid === 'sup_saudi' ? 'Saudi Arabia (1.45 MBD)' : sid === 'sup_iraq' ? 'Iraq (1.00 MBD)' : sid === 'sup_russia' ? 'Russia (1.75 MBD)' : sid}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SIMULATION RESULT OUTPUT                                     */}
      {/* ============================================================ */}
      {simulationResult && (
        <div className="enterprise-card p-5 space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-[var(--text-primary)] text-base tracking-tight">
                  SIMULATION RESULT: Disruption Impact Matrix
                </h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Computed propagation through shipping lanes, SPM ports, refineries, and SPR drawdown hydraulics.
              </p>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                id="btn-explain-scenario"
                onClick={onOpenExplanation}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] transition flex items-center shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                AI Explanation
              </button>

              <button
                id="btn-go-to-procurement"
                onClick={onNavigateToProcurement}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center shadow-xs"
              >
                <span>Optimize Procurement</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </button>
            </div>
          </div>

          {/* 4 Structured Impact Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[var(--bg-surface-subtle)] p-4 rounded-xl border border-[var(--border-subtle)] shadow-xs">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block font-mono">Supply Gap</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-red-500 tracking-tight font-mono">
                  {simulationResult.supplyGapMbpd.toFixed(2)}
                </span>
                <span className="text-xs font-medium text-[var(--text-muted)] font-mono">MBPD</span>
              </div>
              <span className="text-[11px] text-red-400 mt-1 block font-medium">
                Coverage drops to {simulationResult.supplyCoveragePct}%
              </span>
            </div>

            <div className="bg-[var(--bg-surface-subtle)] p-4 rounded-xl border border-[var(--border-subtle)] shadow-xs">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block font-mono">Cost Impact</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-amber-500 tracking-tight font-mono">
                  +${simulationResult.estimatedCostImpactMillionUsdDay.toFixed(1)}M
                </span>
                <span className="text-xs font-medium text-[var(--text-muted)] font-mono">/ day</span>
              </div>
              <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                Freight & War Risk premiums
              </span>
            </div>

            <div className="bg-[var(--bg-surface-subtle)] p-4 rounded-xl border border-[var(--border-subtle)] shadow-xs">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block font-mono">Expected Delay</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-amber-500 tracking-tight font-mono">
                  12–18
                </span>
                <span className="text-xs font-medium text-[var(--text-muted)] font-mono">Days</span>
              </div>
              <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                Cape bypass rerouting transit
              </span>
            </div>

            <div className="bg-[var(--bg-surface-subtle)] p-4 rounded-xl border border-[var(--border-subtle)] shadow-xs">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block font-mono">Critical Nodes</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[var(--text-primary)] tracking-tight font-mono">
                  7
                </span>
                <span className="text-xs font-medium text-red-400 font-bold font-mono">DISRUPTED</span>
              </div>
              <span className="text-[11px] text-emerald-500 mt-1 block font-medium cursor-pointer hover:underline" onClick={onNavigateToReserves}>
                SPR Draw: {simulationResult.reserveRequirement.dailyDrawRequiredMbpd.toFixed(2)} MBD →
              </span>
            </div>
          </div>

          {/* Breakdown Tables: Affected Refineries & Strategic Reserve Action */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Refinery Utilization Stress */}
            <div className="bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Factory className="w-3.5 h-3.5 text-blue-500" />
                  Refinery Distillation Shortfalls
                </span>
                <span className="text-[11px] text-[var(--text-muted)] font-mono">5 Facilities</span>
              </div>

              <div className="space-y-2.5 text-xs">
                {simulationResult.affectedRefineries.map((ref) => (
                  <div
                    key={ref.refineryId}
                    className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-[var(--text-primary)] block">{ref.refineryName}</span>
                      <span className="text-[10.5px] text-[var(--text-muted)]">
                        Feedstock Inflow: {ref.currentThroughputMbpd.toFixed(2)} / {ref.nominalCapacityMbpd.toFixed(2)} MBPD
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-red-500 block font-mono">
                        -{ref.capacityDeficitMbpd.toFixed(2)} MBPD
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">{ref.daysOfCrudeStockRemaining}d crude stock</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Reserve Guidance */}
            <div className="bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center font-mono">
                    <Database className="w-4 h-4 mr-1.5 text-emerald-500" />
                    ISPRL Strategic Reserve Guidance
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    EMERGENCY BUFFER
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  To prevent refinery secondary distillation shutdown, ISPRL caverns at Padur, Mangalore, and Visakhapatnam must initiate immediate pipeline discharge.
                </p>

                <div className="grid grid-cols-2 gap-3 mt-3 text-xs font-mono">
                  <div className="bg-[var(--bg-surface)] p-3 rounded-lg border border-[var(--border-subtle)]">
                    <span className="text-[10.5px] text-[var(--text-muted)] block font-sans">Recommended Daily Draw</span>
                    <span className="text-lg font-bold text-emerald-500">
                      {simulationResult.reserveRequirement.dailyDrawRequiredMbpd.toFixed(2)} MBPD
                    </span>
                  </div>
                  <div className="bg-[var(--bg-surface)] p-3 rounded-lg border border-[var(--border-subtle)]">
                    <span className="text-[10.5px] text-[var(--text-muted)] block font-sans">Cavern Autonomy</span>
                    <span className="text-lg font-bold text-[var(--text-primary)]">
                      {simulationResult.reserveRequirement.sprCapacityDepletionDays} Days
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onNavigateToReserves}
                className="mt-4 w-full py-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center space-x-1 shadow-xs"
              >
                <span>Inspect ISPRL Cavern Drawdown Hydraulics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

