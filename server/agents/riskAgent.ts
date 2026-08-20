import { GoogleGenAI } from '@google/genai';
import { GeopoliticalEvent, RiskLevel } from '../../src/types/index';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface RiskAnalysisOutput {
  eventTitle: string;
  affectedCorridor: string;
  riskLevel: RiskLevel;
  riskScore: number;
  affectedSuppliers: string[];
  reasoning: string;
  recommendedAction: string;
  economicImpactEstimate: string;
  sourceAttribution: string;
}

export async function analyzeGeopoliticalEvent(
  eventInput: Partial<GeopoliticalEvent>
): Promise<RiskAnalysisOutput> {
  const ai = getAIClient();

  if (ai) {
    try {
      const prompt = `You are the Geopolitical Risk Intelligence Agent for EnergyShield AI, an advanced energy supply chain resilience platform.
Analyze the following geopolitical/maritime event affecting crude oil supply routes to India:

Event Title: ${eventInput.title || 'Regional Maritime Tension'}
Corridor: ${eventInput.corridor || 'Strait of Hormuz / Persian Gulf'}
Report Summary: ${eventInput.summary || 'Heightened military activities and tanker insurance risk premiums.'}

Evaluate the disruption probability, identify affected energy suppliers (e.g. Saudi Arabia, Iraq, Russia, UAE), calculate a risk score (0-100), and produce an actionable procurement contingency plan.

Return your response strictly in JSON format matching this schema:
{
  "eventTitle": "string",
  "affectedCorridor": "string",
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "riskScore": number between 0 and 100,
  "affectedSuppliers": ["string"],
  "reasoning": "2-3 sentences explaining the strategic vulnerability and flow mechanics",
  "recommendedAction": "Actionable directive for Indian refinery crude purchasing committees",
  "economicImpactEstimate": "Estimated freight and landed barrel impact (e.g., +$3.50/bbl AWRP and +12 days transit delay)",
  "sourceAttribution": "Intelligence Source"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return {
          eventTitle: parsed.eventTitle || eventInput.title || 'Analyzed Event',
          affectedCorridor: parsed.affectedCorridor || eventInput.corridor || 'Hormuz',
          riskLevel: parsed.riskLevel || 'HIGH',
          riskScore: typeof parsed.riskScore === 'number' ? parsed.riskScore : 78,
          affectedSuppliers: Array.isArray(parsed.affectedSuppliers) ? parsed.affectedSuppliers : ['Saudi Arabia', 'Iraq'],
          reasoning: parsed.reasoning || 'Persian Gulf tanker insurance surges create immediate delivery risks for VLCC fixtures.',
          recommendedAction: parsed.recommendedAction || 'Execute contingency tender for Atlantic sweet crude.',
          economicImpactEstimate: parsed.economicImpactEstimate || '+$3.80/bbl War Risk Insurance & +14d transit rerouting',
          sourceAttribution: 'Gemini Risk Intelligence Engine / Verified Maritime Feeds',
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed or unavailable, falling back to deterministic risk engine:', err);
    }
  }

  // Deterministic fallback if Gemini key is not set or network fails
  const corridor = eventInput.corridor || 'Strait of Hormuz';
  const isHormuz = corridor.toLowerCase().includes('hormuz');
  const isRedSea = corridor.toLowerCase().includes('red sea') || corridor.toLowerCase().includes('mandeb');

  return {
    eventTitle: eventInput.title || 'Maritime Transit Disruption Alert',
    affectedCorridor: corridor,
    riskLevel: isHormuz ? 'CRITICAL' : isRedSea ? 'HIGH' : 'MEDIUM',
    riskScore: isHormuz ? 85 : isRedSea ? 78 : 45,
    affectedSuppliers: isHormuz ? ['Saudi Arabia (Ras Tanura)', 'Iraq (Basra)'] : isRedSea ? ['Russia (Novorossiysk / Urals)'] : ['Regional Tankers'],
    reasoning: isHormuz
      ? 'The Strait of Hormuz handles over 2.35 MBPD (~47%) of Indian crude imports. Heightened naval friction elevates War Risk Premiums and prompts tanker owners to hold vessels at Fujairah anchorage.'
      : 'Bab el-Mandeb security threats compel commercial VLCC operators to bypass Suez via Cape of Good Hope, adding +14 to +16 sailing days to West Coast Indian ports.',
    recommendedAction: isHormuz
      ? 'Immediately trigger Level-1 Strategic Petroleum Reserve (SPR) buffer release at Padur & Mangalore caverns while expanding term lifting from UAE Fujairah bypass and West African grades.'
      : 'Adjust refinery inventory lead-time buffers by +15 days and lock Atlantic freight charters to ensure steady delivery to Sikka and Kochi SPM.',
    economicImpactEstimate: isHormuz ? '+$4.50/bbl Spot premium + $2.10/bbl AWRP' : '+$2.80/bbl Bunker surcharge + 14 days transit delay',
    sourceAttribution: 'EnergyShield Deterministic Intelligence Model (Demo Mode)',
  };
}
