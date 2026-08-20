import React from 'react';
import {
  NetworkGraph,
  SimulationResult,
  ProcurementOptimizationResult,
  StrategicReserveAnalysis,
  GeopoliticalEvent,
} from '../types/index';
import {
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Database,
  ArrowRight,
  Sparkles,
  Ship,
  Compass,
  DollarSign,
  Activity,
  Layers,
  BarChart3,
  Clock,
  Zap,
  Globe,
  Radio,
  Sliders,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { InteractiveMaritimeMap } from './InteractiveMaritimeMap';

interface DashboardViewProps {
  graph: NetworkGraph;
  simulationResult: SimulationResult | null;
  procurementResult: ProcurementOptimizationResult | null;
  reserveAnalysis: StrategicReserveAnalysis | null;
  events: GeopoliticalEvent[];
  theme?: 'dark' | 'light';
  onNavigateToTab: (tab: string) => void;
  onOpenExplanation: () => void;
}

// 30-day supply gap trend data (historical baseline + scenario projection)
const SUPPLY_GAP_TREND = [
  { day: 'Day -30', actual: 0.0, projected: 0.0 },
  { day: 'Day -25', actual: 0.0, projected: 0.0 },
  { day: 'Day -20', actual: 0.0, projected: 0.0 },
  { day: 'Day -15', actual: 0.1, projected: 0.1 },
  { day: 'Day -10', actual: 0.0, projected: 0.0 },
  { day: 'Day -5', actual: 0.0, projected: 0.0 },
  { day: 'Day 0 (Now)', actual: 0.0, projected: 0.0 },
  { day: 'Day +5', actual: null, projected: 0.8 },
  { day: 'Day +10', actual: null, projected: 1.9 },
  { day: 'Day +15', actual: null, projected: 1.9 },
  { day: 'Day +20', actual: null, projected: 1.4 },
  { day: 'Day +25', actual: null, projected: 0.7 },
  { day: 'Day +30', actual: null, projected: 0.2 },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  graph,
  simulationResult,
  procurementResult,
  reserveAnalysis,
  events,
  theme = 'dark',
  onNavigateToTab,
  onOpenExplanation,
}) => {
  const isDisrupted = !!simulationResult;
  const currentFlow = simulationResult
    ? simulationResult.networkState.summary.currentTotalFlowMbpd
    : graph.summary.currentTotalFlowMbpd;

  const coveragePct = simulationResult ? simulationResult.supplyCoveragePct : 100;
  const gapMbpd = simulationResult ? simulationResult.supplyGapMbpd : 0.0;
  const costImpact = simulationResult ? simulationResult.estimatedCostImpactMillionUsdDay : 0.0;
  const compositeRisk = simulationResult ? 78 : 34;

  const activeEvents = events.slice(0, 3);

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* ============================================================ */}
      {/* ROW 1: 6 HIGH-IMPACT KPI CARDS                                */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* KPI 1: Supply Coverage */}
        <div className="enterprise-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">
              Supply Coverage
            </span>
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                coveragePct < 85 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span
              className={`text-3xl font-bold tracking-tight ${
                coveragePct < 85 ? 'text-red-500' : 'text-[var(--text-primary)]'
              }`}
            >
              {coveragePct}%
            </span>
            <span className="text-[10.5px] font-mono text-[var(--text-muted)]">5.10 MBD Base</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)]">
              {isDisrupted ? `${gapMbpd.toFixed(2)} MBD gap` : 'Full demand met'}
            </span>
            <span
              className={`font-semibold ${
                isDisrupted ? 'text-red-400' : 'text-emerald-500'
              }`}
            >
              {isDisrupted ? '↓ 38.0% shortfall' : 'Optimal'}
            </span>
          </div>
        </div>

        {/* KPI 2: Supply Gap */}
        <div className="enterprise-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">
              Supply Gap
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">Distillation Deficit</span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span
              className={`text-3xl font-bold tracking-tight ${
                gapMbpd > 0 ? 'text-red-500' : 'text-emerald-500'
              }`}
            >
              {gapMbpd.toFixed(2)}
            </span>
            <span className="text-[11px] font-medium text-[var(--text-muted)] font-mono">MBPD</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)]">
              {isDisrupted ? '5 refineries affected' : 'Nominal capacity'}
            </span>
            <span
              className={`font-semibold ${
                gapMbpd > 0 ? 'text-red-400 font-mono' : 'text-emerald-500'
              }`}
            >
              {gapMbpd > 0 ? 'CRITICAL' : 'ZERO DEFICIT'}
            </span>
          </div>
        </div>

        {/* KPI 3: Cost Impact */}
        <div className="enterprise-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">
              Cost Impact
            </span>
            <DollarSign className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span
              className={`text-3xl font-bold tracking-tight ${
                costImpact > 0 ? 'text-amber-500' : 'text-[var(--text-primary)]'
              }`}
            >
              {costImpact > 0 ? `+$${costImpact.toFixed(1)}M` : '$0.00'}
            </span>
            <span className="text-[11px] font-medium text-[var(--text-muted)]">/ day</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)]">Freight & War Risk</span>
            <span className="text-[var(--text-secondary)] font-mono">
              {isDisrupted ? '+$6.20/Bbl avg' : 'Baseline rates'}
            </span>
          </div>
        </div>

        {/* KPI 4: Global Risk Index */}
        <div className="enterprise-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">
              Global Risk
            </span>
            <Activity className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span
              className={`text-3xl font-bold tracking-tight ${
                compositeRisk > 60 ? 'text-red-500' : 'text-[var(--text-primary)]'
              }`}
            >
              {compositeRisk}
            </span>
            <span className="text-[11px] font-medium text-[var(--text-muted)] font-mono">/ 100</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)]">Chokepoint Index</span>
            <span
              className={`font-semibold px-1.5 py-0.2 rounded text-[10px] ${
                compositeRisk > 60
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }`}
            >
              {compositeRisk > 60 ? 'HIGH EXPOSURE' : 'MODERATE'}
            </span>
          </div>
        </div>

        {/* KPI 5: Strategic Reserves */}
        <div className="enterprise-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">
              Strategic Reserves
            </span>
            <Database className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {reserveAnalysis ? reserveAnalysis.currentStockMillionBarrels.toFixed(1) : '39.2'}
            </span>
            <span className="text-[11px] font-medium text-[var(--text-muted)] font-mono">MMBbl</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)]">ISPRL Caverns</span>
            <span className="font-semibold text-emerald-500 font-mono">
              {reserveAnalysis ? `${reserveAnalysis.normalDaysOfCover}d Cover` : '9.5d Cover'}
            </span>
          </div>
        </div>

        {/* KPI 6: Active Alerts */}
        <div className="enterprise-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">
              Active Alerts
            </span>
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">3</span>
            <span className="text-[10px] font-bold text-red-400 bg-red-500/15 border border-red-500/30 px-1.5 py-0.5 rounded font-mono">
              1 Critical
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)]">Naval Advisories</span>
            <span
              className="text-blue-500 font-semibold cursor-pointer hover:underline"
              onClick={() => onNavigateToTab('events')}
            >
              View Feed →
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ROW 2: PROMINENT INTERACTIVE MARITIME MAP & RISK FEED         */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left (8 cols): Interactive Maritime Sea Routes Map */}
        <div className="xl:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
                <span>Operational Maritime Supply Chain Network & Sea Routes</span>
                <span className="text-[11px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  Open Map AIS
                </span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Real-time nautical routing from 7 global crude producers through 4 chokepoints to 6 Indian port SPMs & ISPRL caverns
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('network')}
              className="text-xs font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1 transition"
            >
              Full Screen Map <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Prominent Open Map Component */}
          <InteractiveMaritimeMap
            graph={graph}
            simulationResult={simulationResult}
            theme={theme}
            onOpenScenarioSimulator={() => onNavigateToTab('scenarios')}
            compactMode={true}
          />
        </div>

        {/* Right (4 cols): Risk Intelligence Live Feed */}
        <div className="xl:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
                Risk Intelligence Feed
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">Live maritime advisories & war risk notices</p>
            </div>
            <button
              onClick={() => onNavigateToTab('events')}
              className="text-xs font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1"
            >
              All Events ({events.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="enterprise-card divide-y divide-[var(--border-subtle)] overflow-hidden">
            {activeEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onNavigateToTab('events')}
                className="p-4 hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      evt.severity === 'CRITICAL'
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                        : evt.severity === 'HIGH'
                        ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {evt.severity} RISK
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] flex items-center font-mono">
                    <Clock className="w-3 h-3 mr-1" />
                    {(() => {
                      try {
                        return new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      } catch {
                        return evt.timestamp;
                      }
                    })()}
                  </span>
                </div>
                <h4 className="text-[13px] font-semibold text-[var(--text-primary)] leading-snug">
                  {evt.title}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {evt.summary}
                </p>
                <div className="flex items-center justify-between text-[11px] pt-1 text-[var(--text-muted)]">
                  <span className="font-mono text-blue-500 font-medium">{evt.corridor}</span>
                  <span className="font-mono text-[var(--text-secondary)]">Source: {evt.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ROW 3: 4 ANALYTICAL CARDS                                    */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Supply by Source (Horizontal Bars) */}
        <div className="enterprise-card p-4.5 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[13.5px] font-semibold text-[var(--text-primary)]">Supply by Source</h3>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">5.00 MBD Total</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Middle East */}
            <div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="font-medium text-[var(--text-secondary)]">Middle East (Saudi, Iraq, UAE)</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">71.2% (3.56 MBD)</span>
              </div>
              <div className="w-full bg-[var(--bg-surface-subtle)] h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '71.2%' }} />
              </div>
            </div>

            {/* Russia */}
            <div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="font-medium text-[var(--text-secondary)]">Russia (Urals / Shadow Fleet)</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">13.6% (0.68 MBD)</span>
              </div>
              <div className="w-full bg-[var(--bg-surface-subtle)] h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '13.6%' }} />
              </div>
            </div>

            {/* Africa */}
            <div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="font-medium text-[var(--text-secondary)]">West Africa (Nigeria, Angola)</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">8.0% (0.40 MBD)</span>
              </div>
              <div className="w-full bg-[var(--bg-surface-subtle)] h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '8.0%' }} />
              </div>
            </div>

            {/* Americas */}
            <div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="font-medium text-[var(--text-secondary)]">Americas (US Gulf WTI)</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">7.2% (0.36 MBD)</span>
              </div>
              <div className="w-full bg-[var(--bg-surface-subtle)] h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '7.2%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Supply Gap Trend (Time-Series) */}
        <div className="enterprise-card p-4.5 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[13.5px] font-semibold text-[var(--text-primary)]">Supply Gap Projection</h3>
              <p className="text-[11px] text-[var(--text-muted)]">MBD · Last 30 days & Projection</p>
            </div>
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
              isDisrupted ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            }`}>
              {isDisrupted ? 'Disruption Active' : 'Nominal Baseline'}
            </span>
          </div>

          <div className="h-36 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SUPPLY_GAP_TREND} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1E293B' : '#E2E8F0'} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: theme === 'dark' ? '#64748B' : '#94A3B8' }} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: theme === 'dark' ? '#64748B' : '#94A3B8' }} tickLine={false} domain={[0, 2.5]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                    borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="projected"
                  stroke="#EF4444"
                  fill="url(#colorGap)"
                  strokeWidth={2}
                  name="Projected Gap (MBD)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: Risk by Corridor (Horizontal Ranking Bars) */}
        <div className="enterprise-card p-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[13.5px] font-semibold text-[var(--text-primary)]">Corridor Risk Matrix</h3>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">Vulnerability</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[var(--text-secondary)]">Strait of Hormuz</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-red-500">82</span>
                <span className="px-1.5 py-0.2 text-[9.5px] font-bold rounded bg-red-500/15 text-red-400 border border-red-500/30">Critical</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-[var(--text-secondary)]">Red Sea / Bab el-Mandeb</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-orange-500">78</span>
                <span className="px-1.5 py-0.2 text-[9.5px] font-bold rounded bg-orange-500/15 text-orange-400 border border-orange-500/30">High</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-[var(--text-secondary)]">Suez Canal</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-amber-500">48</span>
                <span className="px-1.5 py-0.2 text-[9.5px] font-bold rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">Medium</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-[var(--text-secondary)]">Cape of Good Hope</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-emerald-500">18</span>
                <span className="px-1.5 py-0.2 text-[9.5px] font-bold rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Low</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-[var(--text-secondary)]">Strait of Malacca</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-emerald-500">22</span>
                <span className="px-1.5 py-0.2 text-[9.5px] font-bold rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Low</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Top Recommendation (Analyst-Grade) */}
        <div className="enterprise-card p-4.5 space-y-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-[11px] font-bold text-blue-500 uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Action</span>
            </div>
            <h4 className="text-[13.5px] font-bold text-[var(--text-primary)] mt-1">
              Diversify Imports via West Africa & UAE Bypass
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
              Middle East concentration creates elevated corridor exposure. Surge +0.45 MBD via Nigeria Bonny Light and trigger Fujairah pipeline.
            </p>

            <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-[var(--border-subtle)] text-center font-mono">
              <div className="bg-[var(--bg-surface-subtle)] p-1.5 rounded-lg border border-[var(--border-subtle)]">
                <span className="text-[9px] text-[var(--text-muted)] block">Coverage</span>
                <span className="text-xs font-bold text-emerald-500">+18.7%</span>
              </div>
              <div className="bg-[var(--bg-surface-subtle)] p-1.5 rounded-lg border border-[var(--border-subtle)]">
                <span className="text-[9px] text-[var(--text-muted)] block">Risk</span>
                <span className="text-xs font-bold text-emerald-500">-24.5%</span>
              </div>
              <div className="bg-[var(--bg-surface-subtle)] p-1.5 rounded-lg border border-[var(--border-subtle)]">
                <span className="text-[9px] text-[var(--text-muted)] block">Cost</span>
                <span className="text-xs font-bold text-[var(--text-secondary)]">+$3.2M/d</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('procurement')}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center space-x-1 shadow-xs"
          >
            <span>View Optimizer Solution</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ROW 4: SCENARIO SIMULATOR QUICK TRIGGER & AI EVIDENCE        */}
      {/* ============================================================ */}
      <div className="enterprise-card p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/30 uppercase tracking-wider font-mono">
              Simulation Workspace
            </span>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              What-If Disruption Scenario Solver
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            Test custom maritime blockade parameters, refinery distillation deficits, and reserve discharge hydraulics.
            The solver calculates optimal rerouting solutions within milliseconds.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onOpenExplanation}
            className="px-4 py-2 bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>AI Decision Evidence</span>
          </button>

          <button
            id="btn-dash-open-simulator"
            onClick={() => onNavigateToTab('scenarios')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 shadow-md"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Launch What-If Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

