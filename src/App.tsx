import React, { useState, useEffect } from 'react';
import {
  NetworkGraph,
  ScenarioParameter,
  SimulationResult,
  ProcurementOptimizationResult,
  StrategicReserveAnalysis,
  GeopoliticalEvent,
  AIExplanation,
} from './types/index';
import { apiService } from './services/apiService';
import { INITIAL_NETWORK_GRAPH, INITIAL_EVENTS } from '../server/data/supplyChainData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { DigitalTwinMap } from './components/DigitalTwinMap';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { ProcurementOptimizerView } from './components/ProcurementOptimizerView';
import { StrategicReserveView } from './components/StrategicReserveView';
import { RiskIntelligencePanel } from './components/RiskIntelligencePanel';
import { EventFeed } from './components/EventFeed';
import { RAGKnowledgeView } from './components/RAGKnowledgeView';
import { AIExplanationModal } from './components/AIExplanationModal';
import { DemoWalkthrough } from './components/DemoWalkthrough';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('energyshield_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  const [graph, setGraph] = useState<NetworkGraph>(INITIAL_NETWORK_GRAPH);
  const [events, setEvents] = useState<GeopoliticalEvent[]>(INITIAL_EVENTS);
  const [activeSimulation, setActiveSimulation] = useState<SimulationResult | null>(null);
  const [procurementResult, setProcurementResult] = useState<ProcurementOptimizationResult | null>(null);
  const [reserveAnalysis, setReserveAnalysis] = useState<StrategicReserveAnalysis | null>(null);
  const [aiExplanation, setAiExplanation] = useState<AIExplanation | null>(null);

  const [isLoadingSimulation, setIsLoadingSimulation] = useState(false);
  const [isLoadingOptimization, setIsLoadingOptimization] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [isDemoWalkthroughOpen, setIsDemoWalkthroughOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync Theme with DOM Document Element & LocalStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('energyshield_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Initial data load
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [net, evt, resv] = await Promise.all([
          apiService.getNetwork(),
          apiService.getEvents(),
          apiService.getReserves(null),
        ]);
        setGraph(net);
        setEvents(evt);
        setReserveAnalysis(resv);
      } catch (err) {
        console.error('Initialization error:', err);
      }
    }
    loadInitialData();
  }, []);

  // Run Disruption Simulation Handler
  const handleRunSimulation = async (scenario: ScenarioParameter) => {
    setIsLoadingSimulation(true);
    try {
      const sim = await apiService.simulateDisruption(scenario);
      setActiveSimulation(sim);

      // Auto-run procurement optimization & reserve planning for this simulation
      const [proc, resv] = await Promise.all([
        apiService.optimizeProcurement(sim),
        apiService.getReserves(sim),
      ]);
      setProcurementResult(proc);
      setReserveAnalysis(resv);
    } catch (err) {
      console.error('Simulation execution failed:', err);
    } finally {
      setIsLoadingSimulation(false);
    }
  };

  // Re-run Optimization with custom weights
  const handleReOptimize = async (weights: {
    costWeight: number;
    riskWeight: number;
    delayWeight: number;
    diversificationWeight: number;
  }) => {
    if (!activeSimulation) return;
    setIsLoadingOptimization(true);
    try {
      const proc = await apiService.optimizeProcurement(activeSimulation, weights);
      setProcurementResult(proc);
    } catch (err) {
      console.error('Optimization failed:', err);
    } finally {
      setIsLoadingOptimization(false);
    }
  };

  // Open AI Explanation Modal
  const handleOpenExplanation = async () => {
    setIsExplanationOpen(true);
    if (!aiExplanation && activeSimulation && procurementResult) {
      setIsLoadingExplanation(true);
      try {
        const exp = await apiService.explainProcurement(activeSimulation, procurementResult);
        setAiExplanation(exp);
      } catch (err) {
        console.error('Failed to get explanation:', err);
      } finally {
        setIsLoadingExplanation(false);
      }
    }
  };

  // Reset to nominal baseline
  const handleResetToBaseline = async () => {
    setActiveSimulation(null);
    setProcurementResult(null);
    setAiExplanation(null);
    const resv = await apiService.getReserves(null);
    setReserveAnalysis(resv);
  };

  // Apply full demo results from guided walkthrough
  const handleApplyDemoResults = (sim: SimulationResult, proc: ProcurementOptimizationResult) => {
    setActiveSimulation(sim);
    setProcurementResult(proc);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-row font-sans selection:bg-blue-500/20 selection:text-blue-400 antialiased transition-colors duration-200">
      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Enterprise Navigation Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 transform ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } transition-transform duration-200 ease-in-out`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          activeSimulation={activeSimulation}
          onOpenDemoWalkthrough={() => setIsDemoWalkthroughOpen(true)}
        />
      </div>

      {/* Main Content Area (Header + Scrollable Main View) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Enterprise Top Header Bar */}
        <Header
          activeTab={activeTab}
          activeSimulation={activeSimulation}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onResetToBaseline={handleResetToBaseline}
          onOpenDemoWalkthrough={() => setIsDemoWalkthroughOpen(true)}
          onLaunchSimulator={() => setActiveTab('scenarios')}
          onSearchSelect={(term) => {
            const t = term.toLowerCase();
            if (t.includes('hormuz') || t.includes('red sea') || t.includes('blockade')) setActiveTab('scenarios');
            else if (t.includes('reserve') || t.includes('spr') || t.includes('cavern') || t.includes('isprl')) setActiveTab('reserves');
            else if (t.includes('procurement') || t.includes('supplier') || t.includes('barrel') || t.includes('cost')) setActiveTab('procurement');
            else if (t.includes('map') || t.includes('route') || t.includes('vessel') || t.includes('tanker')) setActiveTab('network');
            else if (t.includes('event') || t.includes('advisory') || t.includes('news')) setActiveTab('events');
          }}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Dynamic Route View */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              graph={graph}
              simulationResult={activeSimulation}
              procurementResult={procurementResult}
              reserveAnalysis={reserveAnalysis}
              events={events}
              theme={theme}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onOpenExplanation={handleOpenExplanation}
            />
          )}

          {activeTab === 'network' && (
            <div className="space-y-4">
              <div className="enterprise-card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-[var(--text-primary)]">
                    Digital Twin Global Maritime Topology & Infrastructure Grid
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Interactive open-source spatial network connecting crude producers, maritime chokepoints, Indian SPM deepwater ports, refineries, and ISPRL caverns.
                  </p>
                </div>
              </div>
              <DigitalTwinMap
                graph={graph}
                simulationResult={activeSimulation}
                theme={theme}
                onOpenScenarioSimulator={() => setActiveTab('scenarios')}
              />
            </div>
          )}

          {activeTab === 'scenarios' && (
            <ScenarioSimulator
              onRunSimulation={handleRunSimulation}
              simulationResult={activeSimulation}
              onReset={handleResetToBaseline}
              onNavigateToProcurement={() => setActiveTab('procurement')}
              onNavigateToReserves={() => setActiveTab('reserves')}
              onOpenExplanation={handleOpenExplanation}
              isLoading={isLoadingSimulation}
            />
          )}

          {activeTab === 'procurement' && (
            <ProcurementOptimizerView
              procurementResult={procurementResult}
              simulationResult={activeSimulation}
              onReOptimize={handleReOptimize}
              onOpenExplanation={handleOpenExplanation}
              isLoading={isLoadingOptimization}
            />
          )}

          {activeTab === 'reserves' && (
            <StrategicReserveView
              reserveAnalysis={reserveAnalysis}
              simulationResult={activeSimulation}
            />
          )}

          {activeTab === 'risks' && <RiskIntelligencePanel />}

          {activeTab === 'events' && (
            <EventFeed
              events={events}
              onTriggerScenarioFromEvent={() => setActiveTab('scenarios')}
            />
          )}

          {activeTab === 'rag' && <RAGKnowledgeView />}
        </main>

        {/* Enterprise System Footer */}
        <footer className="h-10 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] flex items-center justify-between px-6 shrink-0 text-[11px] text-[var(--text-muted)] transition-colors">
          <div className="font-mono tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-medium text-[var(--text-secondary)]">ENERGYSHIELD AI v2.0 • MARITIME SUPPLY CHAIN RESILIENCE</span>
          </div>
          <div className="flex gap-4 font-mono font-medium items-center">
            <span className="flex items-center gap-1.5 text-emerald-500">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> SOLVER READY
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-[var(--text-muted)]">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> TOPOLOGY SYNCED (5.10 MBD)
            </span>
          </div>
        </footer>
      </div>

      {/* AI Explanation Inspector Modal */}
      <AIExplanationModal
        isOpen={isExplanationOpen}
        onClose={() => setIsExplanationOpen(false)}
        explanation={aiExplanation}
        isLoading={isLoadingExplanation}
      />

      {/* 5-Step Guided Walkthrough Modal */}
      <DemoWalkthrough
        isOpen={isDemoWalkthroughOpen}
        onClose={() => setIsDemoWalkthroughOpen(false)}
        onApplyDemoResults={handleApplyDemoResults}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
          setIsDemoWalkthroughOpen(false);
        }}
      />
    </div>
  );
}

export default App;

