import React, { useState } from 'react';
import { GeopoliticalEvent } from '../types/index';
import {
  Radio,
  Sparkles,
  ShieldAlert,
  Clock,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Building,
  ArrowRight,
} from 'lucide-react';
import { apiService } from '../services/apiService';

interface EventFeedProps {
  events: GeopoliticalEvent[];
  onTriggerScenarioFromEvent?: (corridor: string) => void;
}

export const EventFeed: React.FC<EventFeedProps> = ({ events = [], onTriggerScenarioFromEvent }) => {
  const [analyzingEventId, setAnalyzingEventId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [activeEvent, setActiveEvent] = useState<GeopoliticalEvent | null>(events[0] || null);

  const handleAnalyze = async (event: GeopoliticalEvent) => {
    setAnalyzingEventId(event.id);
    setActiveEvent(event);
    try {
      const result = await apiService.analyzeRiskEvent(event);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingEventId(null);
    }
  };

  const getSeverity = (event: GeopoliticalEvent) => {
    return event.severity || (event as any).riskLevel || (event.estimatedRiskScore >= 75 ? 'CRITICAL' : event.estimatedRiskScore >= 45 ? 'HIGH' : 'LOW');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Banner */}
      <div className="enterprise-card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
              Geopolitical & Maritime Risk Intelligence Feed
            </h2>
            <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/30 uppercase tracking-wider font-mono">
              Real-time Surveillance
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
            Surveillance of shipping chokepoints, naval advisories, tanker insurance war risk premiums,
            and crude embargo threats with automated RAG semantic risk extraction.
          </p>
        </div>

        <span className="text-xs font-mono font-medium text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-lg border border-blue-500/30 self-start md:self-auto flex items-center shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
          ACTIVE INTEL STREAM
        </span>
      </div>

      {/* Grid: Events Feed List & AI Agent Analysis Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events Feed List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block font-mono">
            Maritime Intelligence Dispatches ({events.length})
          </span>

          <div className="space-y-3">
            {events.map((event) => {
              const isSelected = activeEvent?.id === event.id;
              const severity = getSeverity(event);
              const formattedTime = (() => {
                try {
                  return new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                } catch {
                  return event.timestamp || 'Recent';
                }
              })();

              return (
                <div
                  key={event.id}
                  id={`event-card-${event.id}`}
                  onClick={() => setActiveEvent(event)}
                  className={`p-4 rounded-xl border transition cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-blue-600/10 border-blue-500 ring-1 ring-blue-500/40'
                      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0 text-[var(--text-secondary)]">
                        <ShieldAlert
                          className={`w-4 h-4 ${
                            severity === 'CRITICAL'
                              ? 'text-red-500'
                              : severity === 'HIGH'
                              ? 'text-orange-500'
                              : 'text-blue-500'
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-[var(--text-primary)] text-sm leading-snug">
                          {event.title}
                        </h4>
                        <div className="flex items-center space-x-3 text-[11px] text-[var(--text-muted)] mt-1 font-mono">
                          <span className="font-semibold text-[var(--text-secondary)]">{event.source}</span>
                          <span>·</span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formattedTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        severity === 'CRITICAL'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : severity === 'HIGH'
                          ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                          : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {severity}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] mt-2.5 line-clamp-2 leading-relaxed">
                    {event.summary}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[var(--border-subtle)] text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-[var(--text-muted)]">Corridor:</span>
                      <span className="bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] px-2 py-0.5 rounded text-[10.5px] font-mono font-medium border border-[var(--border-subtle)]">
                        {event.corridor || (Array.isArray((event as any).affectedCorridors) ? (event as any).affectedCorridors.join(', ') : 'Middle East')}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAnalyze(event);
                      }}
                      disabled={analyzingEventId === event.id}
                      className="text-xs font-semibold text-blue-500 hover:underline flex items-center"
                    >
                      {analyzingEventId === event.id ? (
                        <span>Analyzing Event...</span>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 mr-1" />
                          <span>AI Assessment</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Event Details & AI Agent Assessment */}
        <div className="enterprise-card p-5 space-y-4 h-fit">
          {activeEvent ? (
            <>
              {(() => {
                const activeSeverity = getSeverity(activeEvent);
                const estimatedImpact = (activeEvent as any).estimatedSupplyImpactMbpd ?? 
                  (activeEvent.estimatedRiskScore ? (activeEvent.estimatedRiskScore * 0.022).toFixed(2) : '1.50');
                const corridorName = activeEvent.corridor || (Array.isArray((activeEvent as any).affectedCorridors) ? (activeEvent as any).affectedCorridors.join(', ') : 'Strait of Hormuz');
                const supplierNames = Array.isArray(activeEvent.affectedSuppliers) ? activeEvent.affectedSuppliers.join(', ') : 'Saudi Arabia, Iraq';

                return (
                  <>
                    <div className="border-b border-[var(--border-subtle)] pb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">
                          Intelligence Analysis Dossier
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10.5px] font-bold font-mono ${
                            activeSeverity === 'CRITICAL'
                              ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                              : activeSeverity === 'HIGH'
                              ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                              : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {activeSeverity} RISK EVENT
                        </span>
                      </div>
                      <h3 className="font-bold text-[var(--text-primary)] text-base mt-2 leading-snug">
                        {activeEvent.title}
                      </h3>
                    </div>

                    <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                      <div className="bg-[var(--bg-surface-subtle)] p-3.5 rounded-lg border border-[var(--border-subtle)]">
                        <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase block mb-1 font-mono">
                          Event Overview
                        </span>
                        <p className="leading-relaxed text-[var(--text-secondary)]">{activeEvent.summary}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[var(--bg-surface-subtle)] p-3 rounded-lg border border-[var(--border-subtle)]">
                          <span className="text-[10.5px] text-[var(--text-muted)] block font-medium">Estimated Inbound Impact</span>
                          <span className="text-sm font-bold text-red-500 font-mono mt-0.5 block">
                            -{estimatedImpact} MBPD
                          </span>
                        </div>

                        <div className="bg-[var(--bg-surface-subtle)] p-3 rounded-lg border border-[var(--border-subtle)]">
                          <span className="text-[10.5px] text-[var(--text-muted)] block font-medium">Affected Corridor / Suppliers</span>
                          <span className="text-xs font-semibold text-[var(--text-primary)] mt-0.5 block">
                            {corridorName} ({supplierNames})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RAG Extracted Assessment */}
                    <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/30 space-y-2 text-xs">
                      <div className="flex items-center space-x-1.5 text-blue-400 font-bold text-xs uppercase tracking-wider font-mono">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Strategic Energy Action Protocol</span>
                      </div>
                      <p className="text-[var(--text-primary)] leading-relaxed">
                        {analysisResult?.mitigationAdvice ||
                          activeEvent.recommendedAction ||
                          'Immediate recommendation: Trigger supply contingency protocol, activate Cape of Good Hope rerouting bypass, and prepare ISPRL cavern injection sequence.'}
                      </p>
                    </div>

                    {onTriggerScenarioFromEvent && (
                      <button
                        onClick={() => {
                          const targetCorridor = corridorName.toLowerCase().includes('red') 
                            ? 'cor_redsea' 
                            : corridorName.toLowerCase().includes('malacca') 
                            ? 'cor_malacca' 
                            : 'cor_hormuz';
                          onTriggerScenarioFromEvent(targetCorridor);
                        }}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center space-x-1 shadow-md"
                      >
                        <span>Simulate This Disruption in What-If Engine</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    )}
                  </>
                );
              })()}
            </>
          ) : (
            <div className="text-center py-12 text-[var(--text-muted)] text-xs">
              Select an event to inspect its intelligence profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

