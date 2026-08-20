import {
  NetworkGraph,
  ScenarioParameter,
  SimulationResult,
  SupplyChainNode,
  SupplyChainEdge,
} from '../../src/types/index';
import { INITIAL_NETWORK_GRAPH } from '../data/supplyChainData';

/**
 * Deterministic Supply Chain Disruption & Network Propagation Engine
 * Strictly deterministic mathematical calculations for graph flow, delay, and capacity degradation.
 */

export function runDisruptionSimulation(
  scenario: ScenarioParameter,
  baseGraph: NetworkGraph = INITIAL_NETWORK_GRAPH
): SimulationResult {
  const reductionFraction = scenario.capacityReductionPct / 100.0;
  
  // Clone nodes and edges
  const nodes: SupplyChainNode[] = JSON.parse(JSON.stringify(baseGraph.nodes));
  const edges: SupplyChainEdge[] = JSON.parse(JSON.stringify(baseGraph.edges));

  const affectedCorridorSet = new Set(scenario.affectedCorridorIds);
  const affectedSupplierSet = new Set(scenario.affectedSupplierIds);

  // 1. Degrade affected Corridors
  const corridorStatusMap: Record<string, { status: 'OPERATIONAL' | 'DEGRADED' | 'BLOCKED'; reductionPct: number }> = {};
  
  for (const node of nodes) {
    if (node.type === 'CORRIDOR' && affectedCorridorSet.has(node.id)) {
      const lostFlow = node.currentFlowMbpd * reductionFraction;
      node.currentFlowMbpd = Math.max(0, node.currentFlowMbpd - lostFlow);
      node.riskScore = Math.min(100, node.riskScore + (scenario.severity === 'CRITICAL' ? 35 : 20));
      node.riskLevel = node.riskScore > 75 ? 'CRITICAL' : node.riskScore > 50 ? 'HIGH' : 'MEDIUM';
      node.status = scenario.capacityReductionPct >= 80 ? 'DISRUPTED' : 'DEGRADED';
      
      corridorStatusMap[node.id] = {
        status: node.status === 'DISRUPTED' ? 'BLOCKED' : 'DEGRADED',
        reductionPct: scenario.capacityReductionPct,
      };
    }
  }

  // 2. Degrade affected Edges (both edges connected to affected suppliers and corridors)
  let totalDisruptedSupplierFlowLost = 0;
  let totalFreightPenalty = 0;
  let totalDelayAccrued = 0;
  let delayEdgeCount = 0;

  for (const edge of edges) {
    const isSupplierAffected = affectedSupplierSet.has(edge.fromNodeId);
    const isCorridorAffected = affectedCorridorSet.has(edge.toNodeId) || affectedCorridorSet.has(edge.fromNodeId);

    if (isSupplierAffected || isCorridorAffected) {
      const flowLost = edge.currentFlowMbpd * reductionFraction;
      edge.currentFlowMbpd = Math.max(0, edge.currentFlowMbpd - flowLost);
      edge.riskScore = Math.min(100, edge.riskScore + 30);
      edge.status = edge.currentFlowMbpd === 0 ? 'DISRUPTED' : 'CONGESTED';

      if (edge.fromNodeId.startsWith('sup_')) {
        totalDisruptedSupplierFlowLost += flowLost;
      }

      // Add route delay penalty for diverted/congested shipping lanes
      const addedDelay = scenario.category === 'CHOKEPOINT' ? 12.0 * reductionFraction : 4.0;
      edge.transitDays += addedDelay;
      totalDelayAccrued += addedDelay;
      delayEdgeCount += 1;

      // Freight increase ($/bbl)
      const addedCost = 2.85 * reductionFraction;
      edge.costPerBarrelUsd += addedCost;
      totalFreightPenalty += edge.currentFlowMbpd * 1_000_000 * addedCost;
    }
  }

  // 3. Propagate to Suppliers
  const affectedSuppliersSummary: {
    id: string;
    name: string;
    originalFlowMbpd: number;
    newFlowMbpd: number;
    lostFlowMbpd: number;
  }[] = [];

  for (const node of nodes) {
    if (node.type === 'SUPPLIER') {
      const originalFlow = node.currentFlowMbpd;
      if (affectedSupplierSet.has(node.id) || (scenario.affectedCorridorIds.includes('cor_hormuz') && (node.id === 'sup_saudi' || node.id === 'sup_iraq'))) {
        const flowLost = originalFlow * reductionFraction;
        node.currentFlowMbpd = Math.max(0, originalFlow - flowLost);
        node.riskScore = Math.min(100, node.riskScore + 25);
        node.riskLevel = node.riskScore > 65 ? 'HIGH' : 'MEDIUM';
        node.status = reductionFraction > 0.7 ? 'DISRUPTED' : 'DEGRADED';

        affectedSuppliersSummary.push({
          id: node.id,
          name: node.name,
          originalFlowMbpd: Number(originalFlow.toFixed(2)),
          newFlowMbpd: Number(node.currentFlowMbpd.toFixed(2)),
          lostFlowMbpd: Number(flowLost.toFixed(2)),
        });
      }
    }
  }

  // If no suppliers explicitly affected but corridors were, compute sum
  if (affectedSuppliersSummary.length === 0 && totalDisruptedSupplierFlowLost > 0) {
    for (const node of nodes) {
      if (node.type === 'SUPPLIER' && (node.id === 'sup_saudi' || node.id === 'sup_iraq')) {
        const flowLost = node.currentFlowMbpd * reductionFraction;
        const originalFlow = node.currentFlowMbpd;
        node.currentFlowMbpd = Math.max(0, originalFlow - flowLost);
        affectedSuppliersSummary.push({
          id: node.id,
          name: node.name,
          originalFlowMbpd: Number(originalFlow.toFixed(2)),
          newFlowMbpd: Number(node.currentFlowMbpd.toFixed(2)),
          lostFlowMbpd: Number(flowLost.toFixed(2)),
        });
      }
    }
  }

  // 4. Calculate Net Supply & Lost Capacity
  const baselineSupplyMbpd = baseGraph.summary.currentTotalFlowMbpd;
  const supplyCapacityLostMbpd = Number(
    affectedSuppliersSummary.reduce((acc, curr) => acc + curr.lostFlowMbpd, 0).toFixed(2)
  ) || Number((baselineSupplyMbpd * reductionFraction * 0.45).toFixed(2));
  
  const disruptedSupplyMbpd = Number((baselineSupplyMbpd - supplyCapacityLostMbpd).toFixed(2));
  const nationalDemandMbpd = baseGraph.summary.nationalDemandMbpd;
  const supplyGapMbpd = Number(Math.max(0, nationalDemandMbpd - disruptedSupplyMbpd).toFixed(2));
  const supplyCoveragePct = Number(((disruptedSupplyMbpd / nationalDemandMbpd) * 100).toFixed(1));

  // 5. Refinery Stress & Utilization Propagation
  const affectedRefineriesSummary: {
    id: string;
    name: string;
    utilizationBeforePct: number;
    utilizationAfterPct: number;
    deficitMbpd: number;
  }[] = [];

  const refineryShareOfDeficit = supplyGapMbpd / 5.0; // Distribute across 5 main refineries

  for (const node of nodes) {
    if (node.type === 'REFINERY') {
      const originalFlow = node.currentFlowMbpd;
      const deficit = Number(Math.min(originalFlow * 0.7, refineryShareOfDeficit * (node.capacityMbpd / 1.0)).toFixed(2));
      const newFlow = Number(Math.max(0.1, originalFlow - deficit).toFixed(2));
      const utilBefore = Math.round((originalFlow / node.capacityMbpd) * 100);
      const utilAfter = Math.round((newFlow / node.capacityMbpd) * 100);

      node.currentFlowMbpd = newFlow;
      node.riskScore = Math.min(100, node.riskScore + Math.round(deficit * 30));
      node.riskLevel = node.riskScore > 60 ? 'HIGH' : 'MEDIUM';

      affectedRefineriesSummary.push({
        id: node.id,
        name: node.name,
        utilizationBeforePct: utilBefore,
        utilizationAfterPct: utilAfter,
        deficitMbpd: deficit,
      });
    }
  }

  // 6. Demand Zone Impact
  const affectedDemandSummary: {
    id: string;
    name: string;
    demandMbpd: number;
    shortfallMbpd: number;
    severity: 'LOW' | 'MODERATE' | 'SEVERE';
  }[] = [];

  for (const node of nodes) {
    if (node.type === 'DEMAND') {
      const demandShare = node.capacityMbpd / 5.15;
      const shortfall = Number((supplyGapMbpd * demandShare).toFixed(2));
      const shortfallRatio = shortfall / node.capacityMbpd;
      const severity = shortfallRatio > 0.25 ? 'SEVERE' : shortfallRatio > 0.1 ? 'MODERATE' : 'LOW';

      node.riskScore = Math.min(100, node.riskScore + Math.round(shortfallRatio * 80));
      node.riskLevel = node.riskScore > 60 ? 'HIGH' : 'MEDIUM';

      affectedDemandSummary.push({
        id: node.id,
        name: node.name,
        demandMbpd: node.capacityMbpd,
        shortfallMbpd: shortfall,
        severity,
      });
    }
  }

  // 7. Cost Impact Calculation (Market price surge + freight penalty + GDP replacement premium)
  // Base crude at $80/bbl. Under disruption, replacement spot crude carries $14/bbl premium + shipping
  const crudeSpotPremiumPerBarrel = scenario.severity === 'CRITICAL' ? 16.5 : scenario.severity === 'HIGH' ? 11.0 : 6.0;
  const spotPurchaseCostDay = supplyCapacityLostMbpd * 1_000_000 * crudeSpotPremiumPerBarrel;
  const dailyTotalCostImpactMillionUsd = Number(
    ((spotPurchaseCostDay + totalFreightPenalty) / 1_000_000).toFixed(2)
  );

  // 8. Strategic Reserve Draw Requirement
  const maxSprDischargeRateMbpd = 1.25; // Technical limit of Indian rock caverns combined
  const dailyDrawRequiredMbpd = Number(Math.min(supplyGapMbpd, maxSprDischargeRateMbpd).toFixed(2));
  const sprTotalMillionBarrels = baseGraph.summary.sprTotalStockMillionBarrels;
  const sprDepletionDays = dailyDrawRequiredMbpd > 0 
    ? Math.round(sprTotalMillionBarrels / dailyDrawRequiredMbpd)
    : 999;

  // 9. Average Transit Delay
  const avgTransitDelayDays = delayEdgeCount > 0 ? Number((totalDelayAccrued / delayEdgeCount).toFixed(1)) : 0;

  // 10. Update graph summary metrics
  const updatedGraph: NetworkGraph = {
    nodes,
    edges,
    lastUpdated: new Date().toISOString(),
    summary: {
      totalImportCapacityMbpd: baseGraph.summary.totalImportCapacityMbpd,
      currentTotalFlowMbpd: disruptedSupplyMbpd,
      nationalDemandMbpd,
      avgSupplyRiskScore: Math.round(
        nodes.reduce((acc, n) => acc + n.riskScore, 0) / nodes.length
      ),
      sprTotalStockMillionBarrels: sprTotalMillionBarrels,
      sprDaysOfCover: Number((sprTotalMillionBarrels / (nationalDemandMbpd - (disruptedSupplyMbpd - dailyDrawRequiredMbpd))).toFixed(1)),
    },
  };

  const affectedCorridorsList = scenario.affectedCorridorIds.map((id) => {
    const node = baseGraph.nodes.find((n) => n.id === id);
    const info = corridorStatusMap[id] || { status: 'DEGRADED' as const, reductionPct: scenario.capacityReductionPct };
    return {
      id,
      name: node ? node.name : id,
      status: info.status,
      throughputReductionPct: info.reductionPct,
    };
  });

  return {
    scenario,
    timestamp: new Date().toISOString(),
    baselineSupplyMbpd,
    disruptedSupplyMbpd,
    supplyCapacityLostMbpd,
    supplyGapMbpd,
    supplyCoveragePct,
    estimatedCostImpactMillionUsdDay: dailyTotalCostImpactMillionUsd,
    avgTransitDelayDays,
    affectedSuppliers: affectedSuppliersSummary,
    affectedCorridors: affectedCorridorsList,
    affectedRefineries: affectedRefineriesSummary,
    affectedDemandZones: affectedDemandSummary,
    reserveRequirement: {
      dailyDrawRequiredMbpd,
      sprCapacityDepletionDays: sprDepletionDays,
      recommendedFacilities: ['spr_padur', 'spr_mangalore', 'spr_visakhapatnam'],
    },
    networkState: updatedGraph,
  };
}
