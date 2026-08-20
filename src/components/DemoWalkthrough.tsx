import React, { useState } from 'react';
import {
  Sparkles,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Globe2,
  ShieldAlert,
  Sliders,
  TrendingUp,
  Database,
  Play,
  RotateCcw,
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { SimulationResult, ProcurementOptimizationResult } from '../types/index';

interface DemoWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDemoResults: (sim: SimulationResult, proc: ProcurementOptimizationResult) => void;
  onNavigateToTab: (tab: string) => void;
}

export const DemoWalkthrough: React.FC<DemoWalkthroughProps> = ({
  isOpen,
  onClose,
  onApplyDemoResults,
  onNavigateToTab,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isExecutingDemo, setIsExecutingDemo] = useState(false);
  const [demoPayload, setDemoPayload] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleRunFullDemo = async () => {
    setIsExecutingDemo(true);
    try {
      const data = await apiService.runFullDemo();
      setDemoPayload(data);
      if (data.simulation && data.procurement) {
        onApplyDemoResults(data.simulation, data.procurement);
      }
    } catch (err) {
      console.error('Failed to run demo:', err);
    } finally {
      setIsExecutingDemo(false);
    }
  };

  const steps = [
    {
      step: 1,
      title: 'Baseline Digital Twin Initialization',
      subtitle: 'Modeling India Import Dependency & Network Nodes',
      icon: Globe2,
      content: (
        <div className="space-y-3">
          <p className="text-[var(--text-secondary)] leading-relaxed">
            India consumes <strong className="text-[var(--text-primary)]">5.10 MBPD</strong> of crude oil, relying on imports for ~87.8% of domestic needs.
            The digital twin maps <strong className="text-[var(--text-primary)]">7 global suppliers</strong>, <strong className="text-[var(--text-primary)]">4 critical maritime chokepoints</strong>, <strong className="text-[var(--text-primary)]">6 deep-water SPM import ports</strong>, <strong className="text-[var(--text-primary)]">5 mega refineries</strong>, and <strong className="text-[var(--text-primary)]">3 ISPRL rock caverns</strong>.
          </p>
          <div className="grid grid-cols-3 gap-2.5 bg-[var(--bg-surface-subtle)] p-3.5 rounded-xl border border-[var(--border-subtle)] text-center font-mono">
            <div>
              <span className="text-[var(--text-muted)] text-[10px] block font-medium font-sans">Import Flow</span>
              <span className="text-[var(--text-primary)] font-bold text-sm">5.00 MBPD</span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] text-[10px] block font-medium font-sans">Hormuz Share</span>
              <span className="text-amber-500 font-bold text-sm">47.0%</span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] text-[10px] block font-medium font-sans">Strategic Cover</span>
              <span className="text-emerald-500 font-bold text-sm">37.8 MMBbl</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      step: 2,
      title: 'Geopolitical Maritime Disruption Alert',
      subtitle: 'Simulating Strait of Hormuz Blockade / Escalation',
      icon: ShieldAlert,
      content: (
        <div className="space-y-3">
          <p className="text-[var(--text-secondary)] leading-relaxed">
            A sudden regional security event triggers an immediate <strong className="text-red-500">90% flow reduction</strong> through the Strait of Hormuz for a 30-day window. War Risk Insurance premiums surge, stranding tanker fixtures in the Persian Gulf.
          </p>
          <div className="bg-red-500/10 p-3.5 rounded-xl border border-red-500/30 text-red-400">
            <span className="font-bold text-xs block font-mono">Critical Corridor Impact:</span>
            <span className="text-xs leading-relaxed text-[var(--text-primary)] block mt-1">
              Strait of Hormuz flow collapses from 2.35 MBPD → 0.23 MBPD. Ras Tanura (Saudi) and Basra (Iraq) deliveries to Gujarat SPMs are severely constrained.
            </span>
          </div>
        </div>
      ),
    },
    {
      step: 3,
      title: 'Deterministic Disruption Simulation Engine',
      subtitle: 'Calculating Flow Degradation & Economic Losses',
      icon: Sliders,
      content: (
        <div className="space-y-3">
          <p className="text-[var(--text-secondary)] leading-relaxed">
            The deterministic network solver propagates the disruption down the graph, calculating exact refinery deficits without hallucination.
          </p>
          <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
            <div className="bg-[var(--bg-surface-subtle)] p-3 rounded-xl border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] block text-[11px] font-sans">Supply Capacity Lost:</span>
              <span className="text-red-500 font-bold text-base">-1.90 MBPD</span>
            </div>
            <div className="bg-[var(--bg-surface-subtle)] p-3 rounded-xl border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] block text-[11px] font-sans">National Supply Gap:</span>
              <span className="text-amber-500 font-bold text-base">1.90 MBPD (62% Cover)</span>
            </div>
            <div className="bg-[var(--bg-surface-subtle)] p-3 rounded-xl border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] block text-[11px] font-sans">Cost Shock:</span>
              <span className="text-[var(--text-primary)] font-bold text-base">+$24.2M / day</span>
            </div>
            <div className="bg-[var(--bg-surface-subtle)] p-3 rounded-xl border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] block text-[11px] font-sans">Refineries Stressed:</span>
              <span className="text-blue-500 font-bold text-base">5 Refineries</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      step: 4,
      title: 'Multi-Objective Adaptive Procurement Solver',
      subtitle: 'Finding Optimal Rerouting & Supplier Alternatives',
      icon: TrendingUp,
      content: (
        <div className="space-y-3">
          <p className="text-[var(--text-secondary)] leading-relaxed">
            The optimization solver calculates an optimal allocation across alternative origins, balancing Landed Cost, Route Risk, and Transit Lead Times.
          </p>
          <div className="space-y-2 text-xs bg-[var(--bg-surface-subtle)] p-3.5 rounded-xl border border-[var(--border-subtle)] font-mono">
            <div className="flex justify-between text-emerald-500 font-semibold">
              <span>1. UAE (Habshan-Fujairah Bypass)</span>
              <span>+0.35 MBPD (3.5d transit)</span>
            </div>
            <div className="flex justify-between text-blue-500 font-semibold">
              <span>2. West Africa (Nigeria Bonny Light)</span>
              <span>+0.45 MBPD (22d transit)</span>
            </div>
            <div className="flex justify-between text-[var(--text-primary)] font-semibold">
              <span>3. US Gulf Coast (WTI Midland)</span>
              <span>+0.50 MBPD (32d transit)</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      step: 5,
      title: 'Strategic Reserve Plan & AI Explanation',
      subtitle: 'Synchronizing SPR Draw with Transparent Evidence',
      icon: Database,
      content: (
        <div className="space-y-3">
          <p className="text-[var(--text-secondary)] leading-relaxed">
            An emergency <strong className="text-emerald-500">1.25 MBPD draw</strong> is triggered from Padur and Mangalore caverns to bridge the 14-day Atlantic transit delay, restoring national supply coverage to <strong className="text-emerald-500">94%</strong>.
          </p>
          <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/30 text-[var(--text-primary)] text-xs">
            <span className="font-bold block text-emerald-500 font-mono">AI Decision Synthesis:</span>
            <span className="leading-relaxed text-[var(--text-secondary)] block mt-1">
              Decision is backed by verified citations from ISPRL operational manuals and MoPNG security guidelines with transparent trade-off metrics.
            </span>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep - 1];
  const StepIcon = currentStepData.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-[var(--text-primary)] text-base tracking-tight">
                EnergyShield AI — Operational Decision Walkthrough
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                End-to-End Resilience Decision Pipeline Demonstration
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

        {/* Step Navigation Dots */}
        <div className="px-6 pt-3 pb-2.5 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
          {steps.map((s) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1 rounded-lg transition font-mono ${
                currentStep === s.step
                  ? 'bg-blue-600 text-white shadow-xs'
                  : currentStep > s.step
                  ? 'text-emerald-500 hover:text-emerald-400'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>{s.step}.</span>
              <span className="hidden sm:inline font-sans">{s.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 flex-1 text-xs">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] flex items-center justify-center text-blue-400 flex-shrink-0">
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider block font-mono">
                Step {currentStep} of 5
              </span>
              <h3 className="font-bold text-[var(--text-primary)] text-base leading-tight tracking-tight">
                {currentStepData.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{currentStepData.subtitle}</p>
            </div>
          </div>

          <div className="pt-2">{currentStepData.content}</div>

          {currentStep === 5 && (
            <div className="pt-3">
              <button
                id="btn-execute-full-pipeline"
                onClick={handleRunFullDemo}
                disabled={isExecutingDemo}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-md flex items-center justify-center space-x-2"
              >
                {isExecutingDemo ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Running Full Resilience Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Apply Complete Contingency Solution to Dashboard</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] transition disabled:opacity-40 flex items-center shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Previous
          </button>

          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep((s) => Math.min(5, s + 1))}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center shadow-md"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onNavigateToTab('procurement');
              }}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-md"
            >
              Explore Live System →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
