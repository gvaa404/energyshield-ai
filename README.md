<<<<<<< HEAD
=======
# 🛡️ EnergyShield AI

**AI-Driven Energy Supply Chain Resilience for Import-Dependent Economies**

Built for: *Problem Statement 1 — Supply Chain Intelligence, Energy Security and Geopolitical Risk*

EnergyShield AI is a decision-support platform for India's crude oil procurement planners. It continuously models geopolitical and logistics risk across import corridors (Strait of Hormuz, Bab el-Mandeb/Red Sea, Cape of Good Hope), simulates disruption scenarios, and generates ranked, executable rerouting and reserve-drawdown recommendations — grounded with citations via a RAG knowledge base and explained in plain language by an AI agent.

---

## The Problem

- India imports **~88% of its crude oil**; **40–45%** of that transits the Strait of Hormuz.
- Strategic petroleum reserves cover only **~9.5 days** of national consumption.
- Recent shocks (US–Iran tensions, Iran sanctions, Red Sea shipping attacks) show that existing planning tools can't model geopolitical risk in real time or coordinate a response across refiners, logistics providers, and reserves.

## What EnergyShield AI Does

| Module | Function |
|---|---|
| **Digital Twin Map** | Geospatial simulation of India's crude supply network — suppliers, shipping corridors, refineries, and ports — for continuous what-if analysis. |
| **Geopolitical Risk Intelligence Agent** (`server/agents/riskAgent.ts`) | Uses Gemini to analyze a geopolitical/maritime event and produce a live disruption-probability score, affected suppliers, and a recommended contingency action. |
| **Disruption Scenario Simulator** (`server/simulation/networkEngine.ts`) | Simulates events like a Hormuz closure or Red Sea suspension and propagates their cascading impact on supply coverage, prices, and flows. |
| **Adaptive Procurement Optimizer** (`server/optimization/procurementSolver.ts`) | Ranks alternative crude sources and reroutes to cover a supply gap, with cost and transit-time trade-offs. |
| **Strategic Reserve Optimizer** (`server/optimization/reserveOptimizer.ts`) | Models optimal SPR drawdown schedules against forecast supply gaps. |
| **RAG Knowledge Base** (`server/rag/knowledgeBase.ts`) | Grounds AI answers in a curated set of supply-chain / policy documents, with source attribution. |
| **AI Explanation Agent** (`server/agents/explainAgent.ts`) | Translates a simulation + optimization result into a plain-language brief for a national procurement committee. |
| **Risk Intelligence Panel / Event Feed** | Live-style feed of geopolitical events and a composite risk score (incl. supplier concentration via HHI). |

## Tech Stack

- **Frontend:** React 19 + TypeScript, Vite, Tailwind CSS, Recharts, Framer Motion (`motion`)
- **Backend:** Express + TypeScript (`tsx` dev server, bundled with `esbuild` for production)
- **AI:** Google Gemini API (`@google/genai`) for the risk, explanation, and RAG agents
- **Data:** Curated synthetic dataset calibrated against public energy statistics (`server/data/supplyChainData.ts`)

## Architecture at a Glance

```
Browser (React SPA)
   │  fetch via src/services/apiService.ts
   ▼
Express server (server.ts) ──► server/routes/api.ts
   │
   ├─► server/simulation/networkEngine.ts        (disruption simulation)
   ├─► server/optimization/procurementSolver.ts  (rerouting optimizer)
   ├─► server/optimization/reserveOptimizer.ts   (SPR drawdown planner)
   ├─► server/agents/riskAgent.ts                (Gemini: risk scoring)
   ├─► server/agents/explainAgent.ts             (Gemini: plain-language brief)
   └─► server/rag/knowledgeBase.ts               (Gemini + document grounding)
```

The app degrades gracefully without a Gemini key: `aiAvailable` is reported by `/api/health`, and agents fall back to deterministic logic when `GEMINI_API_KEY` isn't set — useful for judges who want to run the UI without provisioning a key first.

## Run Locally

**Prerequisites:** Node.js 18+ (or Bun, since a `bun.lock` is included)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure your Gemini API key:
   ```bash
   cp .env.example .env.local
   # then edit .env.local and set GEMINI_API_KEY=your_key_here
   ```
3. Start the app:
   ```bash
   npm run dev
   ```
4. Open the printed local URL (Vite + Express dev server).

### Production build

```bash
npm run build   # builds the SPA and bundles the Express server to dist/server.cjs
npm start       # runs the bundled server
```

### Type-check / lint

```bash
npm run lint    # tsc --noEmit
```

## Project Structure

```
energyshield-ai/
├── server/
│   ├── agents/          # Gemini-powered risk & explanation agents
│   ├── data/            # Supply chain dataset (suppliers, corridors, scenarios)
│   ├── optimization/    # Procurement & reserve solvers
│   ├── rag/             # RAG knowledge base
│   ├── routes/api.ts    # REST API surface
│   └── simulation/      # Disruption simulation engine
├── src/
│   ├── components/      # Dashboard, Digital Twin Map, Simulator, Optimizer, etc.
│   ├── services/        # apiService.ts (frontend → backend client)
│   └── types/           # Shared TypeScript types
├── server.ts             # Express entry point
├── metadata.json         # App metadata
└── .env.example           # Required environment variables
```

## Demo Flow (suggested walkthrough for judges)

1. **Dashboard** — see the composite risk score and national supply posture at a glance.
2. **Digital Twin Map** — explore suppliers, corridors, and current flows.
3. **Event Feed / Risk Intelligence Panel** — trigger or inspect a geopolitical event (e.g. "Strait of Hormuz tension") and watch the Risk Agent score it live.
4. **Scenario Simulator** — run a preset disruption (e.g. Hormuz closure) and see the cascading impact on supply coverage.
5. **Procurement Optimizer** — view ranked alternative sourcing/rerouting recommendations to close the gap.
6. **Strategic Reserve View** — see the optimal SPR drawdown plan.
7. **AI Explanation Modal** — read the plain-language brief tying the simulation + optimization together.
8. **RAG Knowledge View** — ask a grounded question and see cited sources.

There's also a built-in `DemoWalkthrough.tsx` component that can guide this tour inside the app itself.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes (for full AI features) | Google Gemini API key used by the risk, explanation, and RAG agents. |
| `APP_URL` | No (auto-injected on AI Studio / Cloud Run) | Base URL of the deployed app, used for self-referential links. |

## Notes for Judges

- This project targets **Problem Statement 1: AI-Driven Energy Supply Chain Resilience for Import-Dependent Economies**.
- All supplier/corridor figures are **synthetic but calibrated** against public energy statistics (~88% import dependence, ~9.5 days SPR cover, Strait of Hormuz / Red Sea corridor shares) — this is a decision-support simulation, not live production data.
- No proprietary or confidential data is used.

## License / Attribution

Add your team's license of choice here before submission (e.g. MIT), and credit any third-party datasets or assets used.

>>>>>>> 3d82e543a5939255f1cf0580971603088d43f523
