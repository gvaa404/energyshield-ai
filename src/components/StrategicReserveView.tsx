import React from 'react';
import {
  StrategicReserveAnalysis,
  SimulationResult,
} from '../types/index';
import {
  Database,
  ShieldCheck,
  TrendingDown,
  AlertOctagon,
  CheckCircle,
  Activity,
  Layers,
  ArrowDownRight,
  RefreshCw,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface StrategicReserveViewProps {
  reserveAnalysis: StrategicReserveAnalysis | null;
  simulationResult: SimulationResult | null;
  theme?: 'dark' | 'light';
}

export const StrategicReserveView: React.FC<StrategicReserveViewProps> = ({
  reserveAnalysis,
  simulationResult,
  theme = 'dark',
}) => {
  if (!reserveAnalysis) {
    return (
      <div className="enterprise-card p-12 text-center text-[var(--text-muted)]">
        Loading Strategic Reserve Data...
      </div>
    );
  }

  const { policyRecommendation } = reserveAnalysis;

  // Chart data: Baseline vs Unmitigated Drawdown vs Optimized Strategy
  const chartData = [
    { day: 'Day 0', baseline: 37.8, unmitigated: 37.8, optimized: 37.8 },
    { day: 'Day 5', baseline: 37.8, unmitigated: 28.3, optimized: 33.1 },
    { day: 'Day 10', baseline: 37.8, unmitigated: 18.8, optimized: 28.3 },
    { day: 'Day 15', baseline: 37.8, unmitigated: 9.3, optimized: 23.6 },
    { day: 'Day 20', baseline: 37.8, unmitigated: 0.0, optimized: 18.9 },
    { day: 'Day 25', baseline: 37.8, unmitigated: 0.0, optimized: 14.2 },
    { day: 'Day 30', baseline: 37.8, unmitigated: 0.0, optimized: 9.5 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Banner */}
      <div className="enterprise-card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
              Strategic Petroleum Reserve (SPR) Optimization
            </h2>
            <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 uppercase tracking-wider font-mono">
              ISPRL Cavern Network
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
            Simulates emergency crude discharge hydraulics across Indian underground rock caverns (Padur, Mangalore, Visakhapatnam)
            to buffer refinery crude distillation during maritime transit blockades.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-[var(--text-secondary)]">Policy Trigger:</span>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold font-mono ${
              policyRecommendation.action === 'EMERGENCY_RELEASE'
                ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                : policyRecommendation.action === 'PROACTIVE_DRAW'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {policyRecommendation.action.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {/* Card 1: Current Reserve */}
        <div className="enterprise-card p-4">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
            Current Reserve
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[var(--text-primary)] font-mono">
              {reserveAnalysis.currentStockMillionBarrels}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">MMBbl</span>
          </div>
          <div className="w-full bg-[var(--bg-surface-subtle)] h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${reserveAnalysis.fillPercentage}%` }}
            />
          </div>
          <span className="text-[10.5px] text-[var(--text-muted)] mt-1 block">
            {reserveAnalysis.fillPercentage}% of {reserveAnalysis.totalCapacityMillionBarrels} MMBbl
          </span>
        </div>

        {/* Card 2: Days of Coverage */}
        <div className="enterprise-card p-4">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
            Days of Coverage
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-500 font-mono">
              {reserveAnalysis.daysOfCoverAtNominalDemand}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">Days</span>
          </div>
          <span className="text-[10.5px] text-emerald-500 mt-1 block font-medium">
            At 5.10 MBD baseline demand
          </span>
        </div>

        {/* Card 3: Target Stock */}
        <div className="enterprise-card p-4">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
            Phase-2 Target
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[var(--text-primary)] font-mono">
              74.0
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">MMBbl</span>
          </div>
          <span className="text-[10.5px] text-[var(--text-muted)] mt-1 block">
            Chandikhol & Padur expansion
          </span>
        </div>

        {/* Card 4: Projected Drawdown */}
        <div className="enterprise-card p-4">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
            Projected Drawdown
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-red-500 font-mono">
              {simulationResult ? simulationResult.reserveRequirement.dailyDrawRequiredMbpd.toFixed(2) : '0.00'}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">MBPD</span>
          </div>
          <span className="text-[10.5px] text-red-400 mt-1 block font-medium">
            {simulationResult ? `${simulationResult.reserveRequirement.sprCapacityDepletionDays}d autonomy` : 'No drawdown'}
          </span>
        </div>

        {/* Card 5: Recovery Period */}
        <div className="enterprise-card p-4">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
            Recovery Period
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-500 font-mono">
              45–60
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">Days</span>
          </div>
          <span className="text-[10.5px] text-[var(--text-muted)] mt-1 block">
            Post-disruption refill window
          </span>
        </div>
      </div>

      {/* Caverns Breakdown Grid & Drawdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (5 cols): ISPRL Underground Rock Caverns */}
        <div className="lg:col-span-5 enterprise-card p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)]">
            <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
              ISPRL Cavern Inventory & Discharge Rates
            </h3>
            <span className="text-xs text-[var(--text-muted)] font-mono font-medium">3 Active Sites</span>
          </div>

          <div className="space-y-3">
            {reserveAnalysis.caverns.map((cav) => (
              <div
                key={cav.id}
                className="p-3.5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-semibold text-xs text-[var(--text-primary)] block">{cav.name}</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">{cav.location} · {cav.crudeType}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-purple-400">
                    {cav.currentStockMillionBarrels} / {cav.capacityMillionBarrels} MMBbl
                  </span>
                </div>

                <div className="w-full bg-[var(--bg-surface)] h-2 rounded-full overflow-hidden border border-[var(--border-subtle)]">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(cav.currentStockMillionBarrels / cav.capacityMillionBarrels) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10.5px] text-[var(--text-muted)] font-mono pt-1">
                  <span>Max Discharge: {cav.maxDischargeRateMbpd} MBD</span>
                  <span className="text-emerald-500 font-semibold">Ready for Injection</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (7 cols): Drawdown Simulation Projection Chart */}
        <div className="lg:col-span-7 enterprise-card p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)]">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
                30-Day Reserve Depletion Horizon
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Comparison between unmitigated shock vs optimized rerouting + reserve buffer
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded">
              Buffer Active
            </span>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1E293B' : '#E2E8F0'} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: theme === 'dark' ? '#64748B' : '#94A3B8' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: theme === 'dark' ? '#64748B' : '#94A3B8' }} tickLine={false} domain={[0, 45]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                    borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="baseline"
                  stroke="#94A3B8"
                  fill="#94A3B8"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name="Baseline Reserve (MMBbl)"
                />
                <Area
                  type="monotone"
                  dataKey="optimized"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name="Optimized Rerouting Strategy"
                />
                <Area
                  type="monotone"
                  dataKey="unmitigated"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  name="Unmitigated Shock (Rapid Depletion)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

