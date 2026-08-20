export type NodeType = 'SUPPLIER' | 'CORRIDOR' | 'PORT' | 'REFINERY' | 'SPR' | 'DEMAND';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SupplyChainNode {
  id: string;
  name: string;
  type: NodeType;
  country: string;
  lat: number;
  lng: number;
  capacityMbpd: number; // Million Barrels Per Day or equivalent capacity
  currentFlowMbpd: number;
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  status: 'OPERATIONAL' | 'DEGRADED' | 'DISRUPTED';
  details: {
    operator?: string;
    crudeGrade?: string;
    storageMillionBarrels?: number;
    daysOfInventory?: number;
    description: string;
  };
}

export interface SupplyChainEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  name: string;
  corridorName: string;
  capacityMbpd: number;
  currentFlowMbpd: number;
  transitDays: number;
  costPerBarrelUsd: number; // Shipping & handling cost
  riskScore: number; // 0 to 100
  status: 'ACTIVE' | 'DISRUPTED' | 'REROUTED' | 'CONGESTED';
  isAlternative?: boolean;
}

export interface NetworkGraph {
  nodes: SupplyChainNode[];
  edges: SupplyChainEdge[];
  lastUpdated: string;
  summary: {
    totalImportCapacityMbpd: number;
    currentTotalFlowMbpd: number;
    nationalDemandMbpd: number;
    avgSupplyRiskScore: number;
    sprTotalStockMillionBarrels: number;
    sprDaysOfCover: number;
  };
}

export interface ScenarioParameter {
  id: string;
  name: string;
  category: 'CHOKEPOINT' | 'GEOPOLITICAL' | 'SANCTIONS' | 'WEATHER' | 'CUSTOM';
  affectedCorridorIds: string[];
  affectedSupplierIds: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  capacityReductionPct: number; // 0 to 100
  durationDays: number;
  description: string;
}

export interface SimulationResult {
  scenario: ScenarioParameter;
  timestamp: string;
  baselineSupplyMbpd: number;
  disruptedSupplyMbpd: number;
  supplyCapacityLostMbpd: number;
  supplyGapMbpd: number;
  supplyCoveragePct: number;
  estimatedCostImpactMillionUsdDay: number;
  avgTransitDelayDays: number;
  affectedSuppliers: {
    id: string;
    name: string;
    originalFlowMbpd: number;
    newFlowMbpd: number;
    lostFlowMbpd: number;
  }[];
  affectedCorridors: {
    id: string;
    name: string;
    status: 'OPERATIONAL' | 'DEGRADED' | 'BLOCKED';
    throughputReductionPct: number;
  }[];
  affectedRefineries: {
    id: string;
    name: string;
    utilizationBeforePct: number;
    utilizationAfterPct: number;
    deficitMbpd: number;
  }[];
  affectedDemandZones: {
    id: string;
    name: string;
    demandMbpd: number;
    shortfallMbpd: number;
    severity: 'LOW' | 'MODERATE' | 'SEVERE';
  }[];
  reserveRequirement: {
    dailyDrawRequiredMbpd: number;
    sprCapacityDepletionDays: number;
    recommendedFacilities: string[];
  };
  networkState: NetworkGraph;
}

export interface ProcurementAlternative {
  rank: number;
  supplierId: string;
  supplierName: string;
  country: string;
  crudeType: string;
  availableSurgeCapacityMbpd: number;
  recommendedAllocationMbpd: number;
  routeId: string;
  routeName: string;
  transitDays: number;
  delayDeltaDays: number;
  fobPriceUsd: number;
  shippingCostUsd: number;
  totalLandedCostUsd: number;
  routeRiskScore: number;
  supplierRiskScore: number;
  compositeScore: number; // Lower or higher based on optimizer
  feasibility: 'HIGH' | 'MEDIUM' | 'CONDITIONAL';
  justification: string;
  tradeOffs: string[];
}

export interface ProcurementOptimizationResult {
  scenarioId: string;
  totalRequiredSurgeMbpd: number;
  totalReallocatedMbpd: number;
  unmetDeficitMbpd: number;
  netCostIncreaseMillionUsdDay: number;
  avgDiversificationHHI: number; // Herfindahl-Hirschman Index
  alternatives: ProcurementAlternative[];
  optimizationCriteria: {
    costWeight: number;
    riskWeight: number;
    delayWeight: number;
    diversificationWeight: number;
  };
  explanation: {
    summary: string;
    why: string;
    keyTradeOffs: string[];
  };
}

export interface ReserveDrawdownTimelinePoint {
  day: number;
  baselineStockMillionBarrels: number;
  projectedStockWithDrawdown: number;
  drawdownRateMbpd: number;
  refillRateMbpd: number;
  daysOfCoverRemaining: number;
}

export interface StrategicReserveAnalysis {
  totalCapacityMillionBarrels: number;
  currentStockMillionBarrels: number;
  fillPercentage: number;
  baselineDailyDemandMbpd: number;
  normalDaysOfCover: number;
  underDisruptionDaysOfCover: number;
  facilities: {
    id: string;
    name: string;
    location: string;
    capacityMillionBarrels: number;
    currentStockMillionBarrels: number;
    maxDischargeRateMbpd: number;
    recommendedDailyDrawMbpd: number;
    connectedRefineries: string[];
  }[];
  timeline: ReserveDrawdownTimelinePoint[];
  policyRecommendation: {
    action: 'NORMAL_HOLD' | 'PROACTIVE_DRAW' | 'EMERGENCY_RELEASE' | 'AGGRESSIVE_REFILL';
    dailyDrawTargetMbpd: number;
    triggerCondition: string;
    rationale: string;
  };
}

export interface GeopoliticalEvent {
  id: string;
  timestamp: string;
  title: string;
  corridor: string;
  severity: RiskLevel;
  source: string;
  verified: boolean;
  summary: string;
  estimatedRiskScore: number;
  affectedSuppliers: string[];
  recommendedAction: string;
}

export interface RAGCitation {
  id: string;
  title: string;
  source: string;
  date: string;
  excerpt: string;
  relevanceScore: number;
}

export interface RAGQueryResult {
  query: string;
  answer: string;
  citations: RAGCitation[];
  confidence: number;
}

export interface AIExplanation {
  what: string;
  why: string;
  how: string;
  evidence: {
    metric: string;
    value: string | number;
    benchmark: string;
  }[];
  riskTradeOffs: string[];
  confidenceScore: number;
}
