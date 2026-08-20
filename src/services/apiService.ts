import {
  NetworkGraph,
  ScenarioParameter,
  SimulationResult,
  ProcurementOptimizationResult,
  StrategicReserveAnalysis,
  GeopoliticalEvent,
  RAGCitation,
  RAGQueryResult,
  AIExplanation,
} from '../types/index';
import {
  INITIAL_NETWORK_GRAPH,
  PRESET_SCENARIOS,
  INITIAL_EVENTS,
  RAG_KNOWLEDGE_DOCUMENTS,
} from '../../server/data/supplyChainData';
import { runDisruptionSimulation } from '../../server/simulation/networkEngine';
import { solveProcurementOptimization } from '../../server/optimization/procurementSolver';
import { calculateStrategicReservePlan } from '../../server/optimization/reserveOptimizer';

export const apiService = {
  async getNetwork(): Promise<NetworkGraph> {
    try {
      const res = await fetch('/api/network');
      if (!res.ok) throw new Error('Network fetch failed');
      return await res.json();
    } catch {
      return INITIAL_NETWORK_GRAPH;
    }
  },

  async getScenarios(): Promise<ScenarioParameter[]> {
    try {
      const res = await fetch('/api/scenarios');
      if (!res.ok) throw new Error('Scenarios fetch failed');
      return await res.json();
    } catch {
      return PRESET_SCENARIOS;
    }
  },

  async getRisks(): Promise<any> {
    try {
      const res = await fetch('/api/risks');
      if (!res.ok) throw new Error('Risks fetch failed');
      return await res.json();
    } catch {
      return {
        compositeRiskScore: 38.5,
        supplierConcentrationHHI: 2650,
        hhiEvaluation: 'HIGH_CONCENTRATION',
        weights: {
          geopoliticalRisk: 0.25,
          routeRisk: 0.2,
          supplierConcentration: 0.2,
          capacityExposure: 0.15,
          shippingRisk: 0.1,
          sanctionsRisk: 0.1,
        },
      };
    }
  },

  async simulateDisruption(scenario: ScenarioParameter): Promise<SimulationResult> {
    try {
      const res = await fetch('/api/scenarios/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
      });
      if (!res.ok) throw new Error('Simulation failed');
      return await res.json();
    } catch {
      return runDisruptionSimulation(scenario);
    }
  },

  async optimizeProcurement(
    simulation: SimulationResult,
    weights?: { costWeight: number; riskWeight: number; delayWeight: number; diversificationWeight: number }
  ): Promise<ProcurementOptimizationResult> {
    try {
      const res = await fetch('/api/procurement/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulation, weights }),
      });
      if (!res.ok) throw new Error('Optimization failed');
      return await res.json();
    } catch {
      return solveProcurementOptimization(simulation, weights);
    }
  },

  async getReserves(simulation?: SimulationResult | null): Promise<StrategicReserveAnalysis> {
    try {
      const res = await fetch('/api/reserves/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulation: simulation || null }),
      });
      if (!res.ok) throw new Error('Reserves plan failed');
      return await res.json();
    } catch {
      return calculateStrategicReservePlan(simulation || null);
    }
  },

  async analyzeRiskEvent(event: Partial<GeopoliticalEvent>): Promise<any> {
    try {
      const res = await fetch('/api/risk/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      if (!res.ok) throw new Error('Risk analysis failed');
      return await res.json();
    } catch {
      return {
        eventTitle: event.title || 'Event Assessment',
        affectedCorridor: event.corridor || 'Strait of Hormuz',
        riskLevel: 'HIGH',
        riskScore: 82,
        affectedSuppliers: ['Saudi Arabia', 'Iraq'],
        reasoning: 'Critical shipping corridor flow interruption threatens Indian crude continuity.',
        recommendedAction: 'Shift spot purchasing to West Africa and trigger SPR level-1 draw.',
        economicImpactEstimate: '+$3.80/bbl War risk surcharge',
        sourceAttribution: 'EnergyShield Prototype Risk Engine',
      };
    }
  },

  async explainProcurement(
    simulation: SimulationResult,
    procurement: ProcurementOptimizationResult
  ): Promise<AIExplanation> {
    try {
      const res = await fetch('/api/procurement/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulation, procurement }),
      });
      if (!res.ok) throw new Error('Explanation failed');
      return await res.json();
    } catch {
      return {
        what: `Reroute ${procurement.totalReallocatedMbpd} MBPD to UAE Fujairah bypass, West Africa, and US Gulf while drawing from SPR caverns.`,
        why: 'Avoids closed chokepoint while restoring domestic supply coverage to >92%.',
        how: 'Initiate 3-phase transition: emergency cavern release, instant UAE liftings, and Atlantic deep-sea charters.',
        evidence: [
          { metric: 'Supply Coverage', value: `${simulation.supplyCoveragePct}% → 94%`, benchmark: 'Target > 90%' },
          { metric: 'Corridor Risk', value: '72/100 → 19/100', benchmark: '-73% exposure' },
        ],
        riskTradeOffs: ['Freight cost delta +$3.40/bbl', 'Transit lead time +14 days'],
        confidenceScore: 95,
      };
    }
  },

  async queryRAG(query: string): Promise<RAGQueryResult> {
    try {
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error('RAG query failed');
      return await res.json();
    } catch {
      return {
        query,
        answer: 'India maintains 39.2 million barrels in underground rock caverns at Visakhapatnam, Mangalore, and Padur, capable of discharging up to 1.25 MBPD under national emergency directives.',
        citations: RAG_KNOWLEDGE_DOCUMENTS.slice(0, 2),
        confidence: 0.94,
      };
    }
  },

  async getEvents(): Promise<GeopoliticalEvent[]> {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Events failed');
      return await res.json();
    } catch {
      return INITIAL_EVENTS;
    }
  },

  async getRAGDocuments(query?: string): Promise<RAGCitation[]> {
    try {
      const url = query ? `/api/rag/documents?q=${encodeURIComponent(query)}` : '/api/rag/documents';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Documents failed');
      return await res.json();
    } catch {
      return RAG_KNOWLEDGE_DOCUMENTS;
    }
  },

  async runFullDemo(): Promise<any> {
    try {
      const res = await fetch('/api/demo/run', { method: 'POST' });
      if (!res.ok) throw new Error('Demo runner failed');
      return await res.json();
    } catch {
      const hormuzScenario = PRESET_SCENARIOS[0];
      const simulation = runDisruptionSimulation(hormuzScenario);
      const procurement = solveProcurementOptimization(simulation);
      const reserves = calculateStrategicReservePlan(simulation);
      return {
        scenario: hormuzScenario,
        simulation,
        procurement,
        reserves,
        explanation: {
          what: 'Emergency rerouting of 1.90 MBPD to UAE Fujairah bypass and Atlantic basin sweet crudes with 1.25 MBPD SPR cavern draw.',
          why: 'Neutralizes Strait of Hormuz naval closure and restores refinery run rate to 95%.',
          how: 'Execute immediate Padur cavern drawdown while locking West Africa VLCC fixtures.',
          evidence: [
            { metric: 'Supply Deficit Cleared', value: '1.90 / 1.90 MBPD', benchmark: '100% replacement' },
          ],
          riskTradeOffs: ['+$4.80M/day freight increase', 'Sailing time expands from 4 to 22 days'],
          confidenceScore: 96,
        },
      };
    }
  },
};
