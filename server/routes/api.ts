import { Router, Request, Response } from 'express';
import {
  INITIAL_NETWORK_GRAPH,
  PRESET_SCENARIOS,
  INITIAL_EVENTS,
  RAG_KNOWLEDGE_DOCUMENTS,
} from '../data/supplyChainData';
import { runDisruptionSimulation } from '../simulation/networkEngine';
import { solveProcurementOptimization } from '../optimization/procurementSolver';
import { calculateStrategicReservePlan } from '../optimization/reserveOptimizer';
import { analyzeGeopoliticalEvent } from '../agents/riskAgent';
import { generateAIExplanation } from '../agents/explainAgent';
import { queryRAGKnowledge, searchRAGDocuments } from '../rag/knowledgeBase';
import { ScenarioParameter } from '../../src/types/index';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OPERATIONAL',
    system: 'EnergyShield AI Decision Support Platform',
    version: '1.0.0-hackathon',
    aiAvailable: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// 1. Digital Twin Network
apiRouter.get('/network', (req: Request, res: Response) => {
  res.json(INITIAL_NETWORK_GRAPH);
});

// 2. Suppliers
apiRouter.get('/suppliers', (req: Request, res: Response) => {
  const suppliers = INITIAL_NETWORK_GRAPH.nodes.filter((n) => n.type === 'SUPPLIER');
  res.json(suppliers);
});

// 3. Shipping Corridors & Routes
apiRouter.get('/routes', (req: Request, res: Response) => {
  const corridors = INITIAL_NETWORK_GRAPH.nodes.filter((n) => n.type === 'CORRIDOR');
  res.json({
    corridors,
    edges: INITIAL_NETWORK_GRAPH.edges,
  });
});

// 4. Preset Scenarios
apiRouter.get('/scenarios', (req: Request, res: Response) => {
  res.json(PRESET_SCENARIOS);
});

// 5. Risk Intelligence & Metrics
apiRouter.get('/risks', (req: Request, res: Response) => {
  const nodes = INITIAL_NETWORK_GRAPH.nodes;
  const suppliers = nodes.filter((n) => n.type === 'SUPPLIER');
  const corridors = nodes.filter((n) => n.type === 'CORRIDOR');

  // Supplier concentration (Herfindahl-Hirschman Index - HHI)
  const totalFlow = suppliers.reduce((acc, s) => acc + s.currentFlowMbpd, 0);
  const hhi = Math.round(
    suppliers.reduce((acc, s) => {
      const sharePct = (s.currentFlowMbpd / (totalFlow || 1)) * 100;
      return acc + sharePct * sharePct;
    }, 0)
  );

  res.json({
    compositeRiskScore: INITIAL_NETWORK_GRAPH.summary.avgSupplyRiskScore,
    supplierConcentrationHHI: hhi,
    hhiEvaluation: hhi > 2500 ? 'HIGH_CONCENTRATION' : hhi > 1500 ? 'MODERATE_CONCENTRATION' : 'DIVERSIFIED',
    topVulnerableCorridors: corridors.map((c) => ({
      id: c.id,
      name: c.name,
      riskScore: c.riskScore,
      riskLevel: c.riskLevel,
      flowMbpd: c.currentFlowMbpd,
      shareOfNationalImportsPct: Math.round((c.currentFlowMbpd / 5.0) * 100),
    })),
    weights: {
      geopoliticalRisk: 0.25,
      routeRisk: 0.2,
      supplierConcentration: 0.2,
      capacityExposure: 0.15,
      shippingRisk: 0.1,
      sanctionsRisk: 0.1,
    },
  });
});

// 6. Deterministic Disruption Simulation Engine
apiRouter.post('/scenarios/simulate', (req: Request, res: Response) => {
  const scenarioInput: ScenarioParameter = req.body.scenario;
  
  if (!scenarioInput) {
    return res.status(400).json({ error: 'Missing scenario parameters in request body.' });
  }

  const result = runDisruptionSimulation(scenarioInput);
  res.json(result);
});

// 7. Multi-Objective Procurement Optimization
apiRouter.post('/procurement/optimize', (req: Request, res: Response) => {
  const simulation = req.body.simulation;
  const weights = req.body.weights;

  if (!simulation) {
    return res.status(400).json({ error: 'Missing simulation results to optimize procurement against.' });
  }

  const result = solveProcurementOptimization(simulation, weights);
  res.json(result);
});

// 8. Strategic Petroleum Reserve Analysis
apiRouter.get('/reserves', (req: Request, res: Response) => {
  const analysis = calculateStrategicReservePlan(null);
  res.json(analysis);
});

apiRouter.post('/reserves/plan', (req: Request, res: Response) => {
  const simulation = req.body.simulation;
  const analysis = calculateStrategicReservePlan(simulation || null);
  res.json(analysis);
});

// 9. AI Risk Intelligence Agent
apiRouter.post('/risk/analyze', async (req: Request, res: Response) => {
  try {
    const eventData = req.body;
    const analysis = await analyzeGeopoliticalEvent(eventData);
    res.json(analysis);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to analyze risk event.' });
  }
});

// 10. AI Explainability Engine
apiRouter.post('/procurement/explain', async (req: Request, res: Response) => {
  try {
    const { simulation, procurement } = req.body;
    if (!simulation || !procurement) {
      return res.status(400).json({ error: 'Missing simulation or procurement payload.' });
    }
    const explanation = await generateAIExplanation(simulation, procurement);
    res.json(explanation);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate explanation.' });
  }
});

// 11. RAG Knowledge Query & Citations
apiRouter.post('/rag/query', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required.' });
    }
    const result = await queryRAGKnowledge(query);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'RAG query failed.' });
  }
});

apiRouter.get('/rag/documents', (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  if (query) {
    return res.json(searchRAGDocuments(query));
  }
  res.json(RAG_KNOWLEDGE_DOCUMENTS);
});

// 12. Geopolitical Event Feed
apiRouter.get('/events', (req: Request, res: Response) => {
  res.json(INITIAL_EVENTS);
});

// 13. One-Click Hackathon Full-Pipeline Demo
apiRouter.post('/demo/run', async (req: Request, res: Response) => {
  try {
    const hormuzScenario = PRESET_SCENARIOS[0]; // Strait of Hormuz closure
    const simulation = runDisruptionSimulation(hormuzScenario);
    const procurement = solveProcurementOptimization(simulation);
    const reserves = calculateStrategicReservePlan(simulation);
    const explanation = await generateAIExplanation(simulation, procurement);

    res.json({
      scenario: hormuzScenario,
      simulation,
      procurement,
      reserves,
      explanation,
      meta: {
        mode: 'DEMO / SIMULATED DATA',
        disclaimer: 'Prototype mathematical model calibrated for India Energy Supply Chain Hackathon decision support.',
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Demo execution failed.' });
  }
});
