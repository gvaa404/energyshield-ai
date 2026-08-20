import {
  StrategicReserveAnalysis,
  ReserveDrawdownTimelinePoint,
  SimulationResult,
} from '../../src/types/index';

export function calculateStrategicReservePlan(
  simulation: SimulationResult | null
): StrategicReserveAnalysis {
  const totalCapacityMillionBarrels = 39.2;
  const currentStockMillionBarrels = 37.8; // ~96.4% filled
  const fillPercentage = Math.round((currentStockMillionBarrels / totalCapacityMillionBarrels) * 100);
  const baselineDailyDemandMbpd = 5.1;
  const normalDaysOfCover = Number((currentStockMillionBarrels / baselineDailyDemandMbpd).toFixed(1));

  const dailyDeficitMbpd = simulation ? simulation.supplyGapMbpd : 0.0;
  const maxSustainableDrawMbpd = 1.25;
  const recommendedDailyDrawMbpd = Number(Math.min(dailyDeficitMbpd, maxSustainableDrawMbpd).toFixed(2));

  const underDisruptionDaysOfCover = recommendedDailyDrawMbpd > 0
    ? Number((currentStockMillionBarrels / recommendedDailyDrawMbpd).toFixed(1))
    : normalDaysOfCover;

  // Facilities breakdown
  const facilities = [
    {
      id: 'spr_padur',
      name: 'ISPRL Padur Cavern Storage',
      location: 'Udupi, Karnataka (West Coast)',
      capacityMillionBarrels: 18.43,
      currentStockMillionBarrels: 17.8,
      maxDischargeRateMbpd: 0.5,
      recommendedDailyDrawMbpd: Number((recommendedDailyDrawMbpd * 0.48).toFixed(2)),
      connectedRefineries: ['BPCL Kochi', 'IOCL Koyali', 'RIL Jamnagar'],
    },
    {
      id: 'spr_mangalore',
      name: 'ISPRL Mangalore Underground Caverns',
      location: 'Mangalore, Karnataka (West Coast)',
      capacityMillionBarrels: 11.0,
      currentStockMillionBarrels: 10.6,
      maxDischargeRateMbpd: 0.4,
      recommendedDailyDrawMbpd: Number((recommendedDailyDrawMbpd * 0.32).toFixed(2)),
      connectedRefineries: ['MRPL Mangalore', 'Nayara Vadinar'],
    },
    {
      id: 'spr_visakhapatnam',
      name: 'ISPRL Visakhapatnam Cavern',
      location: 'Visakhapatnam, Andhra Pradesh (East Coast)',
      capacityMillionBarrels: 9.77,
      currentStockMillionBarrels: 9.4,
      maxDischargeRateMbpd: 0.35,
      recommendedDailyDrawMbpd: Number((recommendedDailyDrawMbpd * 0.2).toFixed(2)),
      connectedRefineries: ['IOCL Paradip', 'HPCL Visakh', 'IOCL Haldia'],
    },
  ];

  // Generate 60-day projected drawdown timeline
  const timeline: ReserveDrawdownTimelinePoint[] = [];
  let simulatedStock = currentStockMillionBarrels;
  const duration = simulation ? simulation.scenario.durationDays : 30;

  for (let day = 0; day <= 60; day += 2) {
    let drawRate = 0;
    let refillRate = 0;

    if (day > 0 && day <= duration) {
      drawRate = recommendedDailyDrawMbpd;
      simulatedStock = Math.max(0, simulatedStock - drawRate * 2);
    } else if (day > duration) {
      // Disruption over, begin phased replenishment at 0.45 MBPD
      refillRate = 0.45;
      simulatedStock = Math.min(currentStockMillionBarrels, simulatedStock + refillRate * 2);
    }

    timeline.push({
      day,
      baselineStockMillionBarrels: currentStockMillionBarrels,
      projectedStockWithDrawdown: Number(simulatedStock.toFixed(2)),
      drawdownRateMbpd: drawRate,
      refillRateMbpd: refillRate,
      daysOfCoverRemaining: drawRate > 0 ? Number((simulatedStock / drawRate).toFixed(1)) : 99,
    });
  }

  let policyAction: 'NORMAL_HOLD' | 'PROACTIVE_DRAW' | 'EMERGENCY_RELEASE' | 'AGGRESSIVE_REFILL' = 'NORMAL_HOLD';
  let triggerCondition = 'Standard baseline operating readiness.';
  let rationale = 'Commercial crude inventories and inbound transit pipelines are operating within nominal thresholds (65 days commercial + 9.5 days SPR).';

  if (dailyDeficitMbpd > 1.0) {
    policyAction = 'EMERGENCY_RELEASE';
    triggerCondition = `National supply deficit exceeds 1.0 MBPD (${dailyDeficitMbpd.toFixed(2)} MBPD active gap).`;
    rationale = `Authorize Phase-1 emergency discharge of ${recommendedDailyDrawMbpd} MBPD across Padur, Mangalore, and Visakhapatnam caverns to prevent refinery crude distillation starvation during maritime chokepoint transit disruption.`;
  } else if (dailyDeficitMbpd > 0.3) {
    policyAction = 'PROACTIVE_DRAW';
    triggerCondition = `Moderate supply deficit of ${dailyDeficitMbpd.toFixed(2)} MBPD with >7 days estimated transit lag.`;
    rationale = `Execute calibrated buffer drawdown of ${recommendedDailyDrawMbpd} MBPD to smooth refinery run rates while rerouted Atlantic basin cargoes transit Cape of Good Hope.`;
  }

  return {
    totalCapacityMillionBarrels,
    currentStockMillionBarrels,
    fillPercentage,
    baselineDailyDemandMbpd,
    normalDaysOfCover,
    underDisruptionDaysOfCover,
    facilities,
    timeline,
    policyRecommendation: {
      action: policyAction,
      dailyDrawTargetMbpd: recommendedDailyDrawMbpd,
      triggerCondition,
      rationale,
    },
  };
}
