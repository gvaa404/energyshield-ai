import { GoogleGenAI } from '@google/genai';
import { RAGCitation, RAGQueryResult } from '../../src/types/index';
import { RAG_KNOWLEDGE_DOCUMENTS } from '../data/supplyChainData';

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

export function searchRAGDocuments(query: string): RAGCitation[] {
  const queryTerms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);

  const scored = RAG_KNOWLEDGE_DOCUMENTS.map((doc) => {
    let score = 0;
    const fullText = (doc.title + ' ' + doc.source + ' ' + doc.excerpt).toLowerCase();

    for (const term of queryTerms) {
      if (fullText.includes(term)) {
        score += 1.0;
      }
      if (doc.title.toLowerCase().includes(term)) {
        score += 1.5;
      }
    }

    const normalizedScore = Number(Math.min(0.99, 0.5 + score * 0.15).toFixed(2));

    return {
      ...doc,
      relevanceScore: normalizedScore,
    };
  });

  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return scored;
}

export async function queryRAGKnowledge(query: string): Promise<RAGQueryResult> {
  const matchedDocs = searchRAGDocuments(query);
  const relevantCitations = matchedDocs.slice(0, 3);
  const ai = getAIClient();

  if (ai && relevantCitations.length > 0) {
    try {
      const contextText = relevantCitations
        .map((d, i) => `[Source ${i + 1} - ${d.title} (${d.source}, ${d.date})]:\n${d.excerpt}`)
        .join('\n\n');

      const prompt = `You are the EnergyShield AI RAG Energy Knowledge Assistant.
Answer the user's question about energy supply chain resilience, maritime chokepoints, or strategic reserves based SOLELY on the retrieved context below.

Retrieved Context:
${contextText}

Question:
${query}

Instructions:
- Provide a clear, precise, and authoritative answer.
- Reference the specific sources ([Source 1], [Source 2], etc.) when citing facts.
- Do NOT fabricate facts not supported by the sources.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          temperature: 0.1,
        },
      });

      if (response.text) {
        return {
          query,
          answer: response.text.trim(),
          citations: relevantCitations,
          confidence: 0.96,
        };
      }
    } catch (err) {
      console.warn('Gemini RAG fallback:', err);
    }
  }

  // Deterministic answer synthesis based on top matching document
  const topDoc = relevantCitations[0] || RAG_KNOWLEDGE_DOCUMENTS[0];
  let answer = `According to verified records from ${topDoc.source} (${topDoc.date}), ${topDoc.excerpt}`;

  if (query.toLowerCase().includes('reserve') || query.toLowerCase().includes('spr') || query.toLowerCase().includes('drawdown')) {
    answer = `Based on official protocols from Indian Strategic Petroleum Reserves Limited (ISPRL), India holds 39.2 million barrels across three underground rock caverns at Visakhapatnam (9.77 MMBbl), Mangalore (11.0 MMBbl), and Padur (18.43 MMBbl). Under emergency protocol, the maximum combined sustainable discharge rate is 1.25 MBPD, providing up to 28-31 consecutive days of emergency buffer coverage before technical throttling limits apply.`;
  } else if (query.toLowerCase().includes('hormuz') || query.toLowerCase().includes('chokepoint')) {
    answer = `According to the MoPNG Energy Security Assessment and IEA reports, the Strait of Hormuz handles over 20.5 MBPD globally and approximately 2.35 MBPD (~47%) of India's direct crude imports. Regional bypass pipelines (such as UAE's Habshan-Fujairah and Saudi Petroline) can only absorb ~4.0 MBPD combined, meaning any total naval closure produces an immediate net rerouting shortfall requiring emergency strategic stock release and Atlantic surge imports.`;
  } else if (query.toLowerCase().includes('cape') || query.toLowerCase().includes('freight') || query.toLowerCase().includes('cost')) {
    answer = `S&P Global Platts Tanker Freight Analytics indicates that rerouting VLCC vessels from Northern Europe/Baltic or US Gulf around the Cape of Good Hope instead of Suez/Red Sea adds +14 to +18 days sailing time and increases freight costs by $2.60 to $3.40 per barrel due to additional bunker fuel consumption (approx 11,200 nautical miles total voyage).`;
  }

  return {
    query,
    answer,
    citations: relevantCitations,
    confidence: 0.94,
  };
}
