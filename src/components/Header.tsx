import React, { useState } from 'react';
import {
  Search,
  Bell,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  User,
  Sliders,
  Menu,
  Sun,
  Moon,
  Zap,
} from 'lucide-react';
import { SimulationResult } from '../types/index';

interface HeaderProps {
  activeTab: string;
  activeSimulation: SimulationResult | null;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onResetToBaseline: () => void;
  onOpenDemoWalkthrough: () => void;
  onLaunchSimulator?: () => void;
  onSearchSelect?: (term: string) => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  activeSimulation,
  theme,
  onToggleTheme,
  onResetToBaseline,
  onOpenDemoWalkthrough,
  onLaunchSimulator,
  onSearchSelect,
  onToggleMobileSidebar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isDisrupted = !!activeSimulation;

  const pageMeta: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Energy Supply Chain Control Dashboard',
      subtitle: 'Real-time maritime sea route intelligence, import vulnerability & SPR buffer analytics',
    },
    network: {
      title: 'Digital Twin Maritime Topology',
      subtitle: 'Global maritime routes, crude producer terminals, Indian SPMs & pipeline matrix',
    },
    scenarios: {
      title: 'What-If Disruption Simulator',
      subtitle: 'Maritime chokepoint blockade, geopolitical embargo & refinery shortfall engine',
    },
    procurement: {
      title: 'Adaptive Procurement Optimizer',
      subtitle: 'Multi-objective supplier re-allocation & landed cost optimization solver',
    },
    reserves: {
      title: 'Strategic Petroleum Reserves (ISPRL)',
      subtitle: 'Underground rock cavern discharge hydraulics & buffer coverage timeline',
    },
    risks: {
      title: 'Risk Intelligence Matrix',
      subtitle: 'Chokepoint vulnerability index, war risk surcharges & geopolitical indicators',
    },
    events: {
      title: 'Geopolitical & Maritime Event Feed',
      subtitle: 'Live naval alerts, shadow fleet tracking, embargo threats & transit advisories',
    },
    rag: {
      title: 'Energy Security Knowledge & Citations',
      subtitle: 'Verified regulatory intelligence from MoPNG, ISPRL, IEA & S&P Platts',
    },
  };

  const meta = pageMeta[activeTab] || {
    title: 'EnergyShield AI Control',
    subtitle: 'Mission-Critical Energy Security Analytics',
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() && onSearchSelect) {
      onSearchSelect(searchQuery.trim());
    }
  };

  return (
    <header className="h-16 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-6 flex items-center justify-between sticky top-0 z-20 shrink-0 transition-colors">
      {/* Left: Mobile Drawer Button + Page Header */}
      <div className="flex items-center space-x-3.5">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)]"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight leading-none">
              {meta.title}
            </h1>
            {isDisrupted && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-semibold bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse">
                <ShieldAlert className="w-3 h-3 mr-1 text-red-400" />
                Active Disruption
              </span>
            )}
          </div>
          <p className="text-[11.5px] text-[var(--text-secondary)] leading-none mt-1 hidden sm:block">
            {meta.subtitle}
          </p>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search sea routes, port SPMs, crude suppliers, caverns..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (onSearchSelect) onSearchSelect(e.target.value);
            }}
            onKeyDown={handleSearchKeyDown}
            className="w-full pl-9 pr-8 py-1.5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-surface)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">
            /
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Primary Action Button & Theme Toggle */}
      <div className="flex items-center space-x-3">
        {/* Scenario State Pill */}
        {isDisrupted ? (
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-[11px] font-medium text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping mr-1.5"></span>
              <span className="max-w-[130px] truncate">{activeSimulation.scenario.name}</span>
            </div>
            <button
              id="btn-reset-baseline-header"
              onClick={onResetToBaseline}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] transition flex items-center shadow-xs"
              title="Reset to nominal 5.10 MBD baseline"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1 text-[var(--text-secondary)]" />
              <span className="hidden sm:inline">Reset Baseline</span>
            </button>
          </div>
        ) : (
          <div className="hidden sm:flex items-center px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-medium text-emerald-500">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
            <span>Nominal (5.10 MBD)</span>
          </div>
        )}

        {/* Primary Action Button */}
        {onLaunchSimulator && (
          <button
            onClick={onLaunchSimulator}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Disruption</span>
          </button>
        )}

        {/* Light / Dark Mode Toggle Switch (REQ-04) */}
        <div className="flex items-center bg-[var(--bg-surface-subtle)] p-0.5 rounded-lg border border-[var(--border-subtle)]">
          <button
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all ${
              theme === 'dark'
                ? 'bg-slate-800 text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Dark Mode"
            aria-label="Toggle Dark Mode"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden md:inline font-mono">Dark</span>
          </button>
          <button
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all ${
              theme === 'light'
                ? 'bg-white text-blue-600 shadow-xs font-semibold'
                : 'text-slate-400 hover:text-slate-100'
            }`}
            title="Light Mode"
            aria-label="Toggle Light Mode"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden md:inline font-mono">Light</span>
          </button>
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] hover:text-[var(--text-primary)] transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-[var(--bg-surface)]"></span>
          </button>
        </div>

        {/* User / Station Badge */}
        <div className="flex items-center pl-2 border-l border-[var(--border-subtle)] space-x-2">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono shadow-xs">
            OP
          </div>
          <div className="hidden xl:block text-left">
            <span className="text-[12px] font-semibold text-[var(--text-primary)] block leading-none">Ops Chief</span>
            <span className="text-[10px] text-[var(--text-muted)] block leading-none mt-0.5 font-mono">SEC-DEL-04</span>
          </div>
        </div>
      </div>
    </header>
  );
};

