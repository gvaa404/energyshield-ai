import React from 'react';
import {
  LayoutDashboard,
  Globe2,
  Sliders,
  TrendingUp,
  Database,
  Activity,
  Radio,
  FileText,
  ShieldAlert,
  BarChart3,
  DollarSign,
  Compass,
  History,
  FileCheck,
  Bell,
  Settings,
  Circle,
  Sparkles,
  Ship,
  Layers,
  Cpu,
} from 'lucide-react';
import { SimulationResult } from '../types/index';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeSimulation: SimulationResult | null;
  onOpenDemoWalkthrough: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeSimulation,
  onOpenDemoWalkthrough,
}) => {
  const isDisrupted = !!activeSimulation;

  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'network', label: 'Digital Twin', icon: Globe2 },
    { id: 'scenarios', label: 'What-if Simulator', icon: Sliders, badge: isDisrupted ? 'ACTIVE' : null },
    { id: 'procurement', label: 'Procurement', icon: TrendingUp },
    { id: 'reserves', label: 'Strategic Reserves', icon: Database },
    { id: 'risks', label: 'Risk Intelligence', icon: Activity },
    { id: 'events', label: 'Event Feed', icon: Radio, count: '3' },
    { id: 'rag', label: 'RAG Knowledge', icon: FileText },
  ];

  const analyticsNav = [
    { id: 'risks', label: 'Chokepoint Analytics', icon: ShieldAlert },
    { id: 'procurement', label: 'Cost Optimization', icon: DollarSign },
    { id: 'network', label: 'Maritime Flow Analysis', icon: Compass },
    { id: 'scenarios', label: 'Scenario Logs', icon: History },
  ];

  return (
    <aside className="w-[240px] bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex flex-col shrink-0 h-screen sticky top-0 select-none z-30 transition-colors">
      {/* Brand Header */}
      <div className="p-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-md tracking-tight">
            <Ship className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-[14.5px] tracking-tight text-[var(--text-primary)] font-sans">
                ENERGYSHIELD
              </span>
              <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded font-mono border border-blue-500/20">
                AI
              </span>
            </div>
            <p className="text-[10.5px] text-[var(--text-muted)] leading-tight mt-0.5 font-mono">
              Maritime Resilience v2.0
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 no-scrollbar">
        {/* Main Operations Navigation */}
        <div className="space-y-0.5">
          <span className="px-2.5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1 font-mono">
            Core Operations
          </span>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[12.5px] font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-500 font-semibold border border-blue-500/20'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-[var(--text-muted)]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-bold bg-red-500/20 text-red-400 rounded border border-red-500/40 animate-pulse font-mono">
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span className="px-1.5 py-0.2 text-[9.5px] font-semibold bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] rounded-full font-mono">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--border-subtle)]" />

        {/* Analytics Section */}
        <div className="space-y-0.5">
          <span className="px-2.5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1 font-mono">
            Intelligence
          </span>
          {analyticsNav.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(item.id)}
                className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[12px] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Guided Walkthrough Promotion Card */}
      <div className="p-3 border-t border-[var(--border-subtle)]">
        <button
          id="sidebar-btn-guided-demo"
          onClick={onOpenDemoWalkthrough}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl text-left transition-all flex items-center space-x-2.5 shadow-md group"
        >
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[12px] font-semibold block text-white leading-tight">Guided Walkthrough</span>
            <span className="text-[10px] text-blue-100 block leading-tight mt-0.5">5-step interactive tour</span>
          </div>
        </button>
      </div>

      {/* System Status Footer */}
      <div className="p-3 bg-[var(--bg-surface-subtle)] border-t border-[var(--border-subtle)] text-[11px]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-bold text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-mono">
            System Status
          </span>
          <span className="inline-flex items-center text-emerald-500 font-medium text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
            Operational
          </span>
        </div>
        <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px] text-[var(--text-muted)] font-mono">
          <div className="flex items-center justify-between">
            <span>Maritime AIS</span>
            <span className="text-emerald-500 font-bold">LIVE</span>
          </div>
          <div className="flex items-center justify-between">
            <span>AI Solver</span>
            <span className="text-emerald-500 font-bold">READY</span>
          </div>
          <div className="flex items-center justify-between">
            <span>SPM Telemetry</span>
            <span className="text-emerald-500 font-bold">SYNC</span>
          </div>
          <div className="flex items-center justify-between">
            <span>ISPRL Grid</span>
            <span className="text-emerald-500 font-bold">100%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

