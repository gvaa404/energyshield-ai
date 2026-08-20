import React, { useState } from 'react';
import {
  FileText,
  Search,
  BookOpen,
  Sparkles,
  ExternalLink,
  CheckCircle,
  Clock,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { RAG_KNOWLEDGE_DOCUMENTS } from '../../server/data/supplyChainData';
import { RAGQueryResult } from '../types/index';
import { apiService } from '../services/apiService';

export const RAGKnowledgeView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [qaQuery, setQaQuery] = useState('');
  const [qaResult, setQaResult] = useState<RAGQueryResult | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const sampleQuestions = [
    'What is India maximum sustainable SPR drawdown rate and cavern capacity?',
    'What percentage of India crude imports transit through Strait of Hormuz?',
    'What is the freight cost and transit delay impact of rerouting via Cape of Good Hope?',
    'How do Indian refineries adjust crude diet for sweet vs sour crude?',
  ];

  const handleAsk = async (queryText: string) => {
    setQaQuery(queryText);
    setIsQuerying(true);
    try {
      const result = await apiService.queryRAG(queryText);
      setQaResult(result);
    } catch (err) {
      console.error('RAG query failed:', err);
    } finally {
      setIsQuerying(false);
    }
  };

  const filteredDocs = RAG_KNOWLEDGE_DOCUMENTS.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Banner */}
      <div className="enterprise-card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
              RAG Energy Security Knowledge Base & Verified Citations
            </h2>
            <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/30 uppercase tracking-wider font-mono">
              Grounded Retrieval
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
            Semantic search and retrieval-augmented generation grounded in official MoPNG, ISPRL, IEA, and Platts energy security benchmarks.
          </p>
        </div>

        <span className="text-xs font-mono font-medium text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-lg border border-blue-500/30 self-start md:self-auto flex items-center shadow-xs">
          <Shield className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
          5 VERIFIED REGULATORY REPOSITORIES
        </span>
      </div>

      {/* Natural Language RAG Q&A Assistant */}
      <div className="enterprise-card p-5 space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono">
            Ask RAG Energy Intelligence Engine
          </h3>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask about SPR discharge rates, Hormuz bypass pipelines, refinery crude diets, freight metrics..."
            value={qaQuery}
            onChange={(e) => setQaQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && qaQuery && handleAsk(qaQuery)}
            className="flex-1 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 transition"
          />
          <button
            id="btn-ask-rag"
            onClick={() => qaQuery && handleAsk(qaQuery)}
            disabled={isQuerying || !qaQuery}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition disabled:opacity-50 flex items-center shadow-md"
          >
            {isQuerying ? 'Retrieving...' : 'Ask Engine'}
          </button>
        </div>

        {/* Sample Question Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-[var(--text-muted)] mr-1 font-mono">Suggested inquiries:</span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              className="text-[11px] text-[var(--text-secondary)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] px-2.5 py-1 rounded-md transition text-left"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Query Result Card */}
        {qaResult && (
          <div className="mt-4 p-4.5 bg-blue-500/10 border border-blue-500/30 rounded-xl space-y-3 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
              <span className="font-bold text-blue-400 uppercase tracking-wider text-[11px] flex items-center font-mono">
                <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                RAG Synthesized Response
              </span>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                Retrieved {qaResult.sources.length} citations
              </span>
            </div>

            <p className="text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-line font-normal">
              {qaResult.answer}
            </p>

            <div className="pt-2 border-t border-blue-500/20">
              <span className="text-[10.5px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5 font-mono">
                Verified Document Grounding:
              </span>
              <div className="flex flex-wrap gap-2">
                {qaResult.sources.map((src, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-[var(--bg-surface)] text-blue-400 border border-blue-500/30 text-[10.5px] font-mono font-medium shadow-xs"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grounding Documents Repository */}
      <div className="enterprise-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
              Indexed Benchmark Corpus & Energy Security Reports
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Full text embeddings indexed for semantic retrieval and supply chain optimization grounding.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Filter indexed documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl hover:border-[var(--border-medium)] transition space-y-2"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                  {doc.source}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">{doc.id}</span>
              </div>

              <h4 className="font-bold text-xs text-[var(--text-primary)] leading-snug">
                {doc.title}
              </h4>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                {doc.excerpt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
