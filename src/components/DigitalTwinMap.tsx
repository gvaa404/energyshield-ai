import React, { useState, useMemo } from 'react';
import {
  NetworkGraph,
  SupplyChainNode,
  NodeType,
  RiskLevel,
  SimulationResult,
} from '../types/index';
import {
  Globe2,
  Filter,
  Info,
  ShieldAlert,
  Flame,
  Ship,
  Factory,
  Database,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  DollarSign,
  Clock,
  ArrowRight,
  X,
  Layers,
  MapPin,
} from 'lucide-react';
import { InteractiveMaritimeMap } from './InteractiveMaritimeMap';

interface DigitalTwinMapProps {
  graph: NetworkGraph;
  simulationResult: SimulationResult | null;
  theme?: 'dark' | 'light';
  onSelectNode?: (node: SupplyChainNode) => void;
  onOpenScenarioSimulator?: () => void;
  compactMode?: boolean;
}

// Coordinate projection helper converting (lat, lng) to SVG Canvas coordinates (1100 x 620)
function projectCoordinates(lat: number, lng: number): { x: number; y: number } {
  const minLng = -105;
  const maxLng = 105;
  const minLat = -38;
  const maxLat = 52;

  const width = 1100;
  const height = 620;
  const paddingX = 65;
  const paddingY = 50;

  const x = paddingX + ((lng - minLng) / (maxLng - minLng)) * (width - 2 * paddingX);
  const y = height - paddingY - ((lat - minLat) / (maxLat - minLat)) * (height - 2 * paddingY);

  return { x: Math.round(x), y: Math.round(y) };
}

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({
  graph,
  simulationResult,
  theme = 'dark',
  onSelectNode,
  onOpenScenarioSimulator,
  compactMode = false,
}) => {
  const [viewMode, setViewMode] = useState<'maritime_map' | 'schematic'>('maritime_map');
  const [selectedNode, setSelectedNode] = useState<SupplyChainNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<SupplyChainNode | null>(null);
  const [typeFilter, setTypeFilter] = useState<NodeType | 'ALL'>('ALL');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showFlow, setShowFlow] = useState<boolean>(true);
  const [showDisruptions, setShowDisruptions] = useState<boolean>(true);
  const [showRisk, setShowRisk] = useState<boolean>(true);
  const [showKeyLabels, setShowKeyLabels] = useState<boolean>(false);

  // Current network state from simulation or baseline
  const currentGraph = simulationResult ? simulationResult.networkState : graph;

  const filteredNodes = useMemo(() => {
    return currentGraph.nodes.filter((node) => {
      if (typeFilter !== 'ALL' && node.type !== typeFilter) return false;
      if (riskFilter !== 'ALL' && node.riskLevel !== riskFilter) return false;
      return true;
    });
  }, [currentGraph, typeFilter, riskFilter]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, SupplyChainNode>();
    currentGraph.nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [currentGraph]);

  const getNodeColor = (node: SupplyChainNode) => {
    if (node.status === 'DISRUPTED') return '#D92D20'; // Critical Red
    if (node.status === 'DEGRADED') return '#F79009'; // Amber
    switch (node.type) {
      case 'SUPPLIER':
        return '#1E40AF'; // Navy / Blue
      case 'CORRIDOR':
        return node.riskScore > 60 ? '#D92D20' : '#F79009';
      case 'PORT':
        return '#EA580C'; // Orange
      case 'REFINERY':
        return '#16A34A'; // Green Diamond
      case 'SPR':
        return '#7C3AED'; // Purple
      case 'DEMAND':
        return '#0284C7'; // Cyan / Blue
      default:
        return '#667085';
    }
  };

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'SUPPLIER':
        return Flame;
      case 'CORRIDOR':
        return Compass;
      case 'PORT':
        return Ship;
      case 'REFINERY':
        return Factory;
      case 'SPR':
        return Database;
      case 'DEMAND':
        return Zap;
    }
  };

  if (viewMode === 'maritime_map') {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-[var(--text-secondary)]">Map View:</span>
            <div className="flex items-center bg-[var(--bg-surface-subtle)] p-0.5 rounded-lg border border-[var(--border-subtle)]">
              <button
                onClick={() => setViewMode('maritime_map')}
                className="px-3 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white shadow-xs"
              >
                🗺️ Interactive Maritime Sea Routes
              </button>
              <button
                onClick={() => setViewMode('schematic')}
                className="px-3 py-1 rounded-md text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                ⚡ Topological Schematic
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center text-xs text-[var(--text-muted)] font-mono">
            <span>ISPRL + SPM Maritime Hubs: Active</span>
          </div>
        </div>

        <InteractiveMaritimeMap
          graph={graph}
          simulationResult={simulationResult}
          theme={theme}
          onSelectNode={onSelectNode}
          onOpenScenarioSimulator={onOpenScenarioSimulator}
          compactMode={compactMode}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* Top Switcher Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-[var(--text-secondary)]">Map View:</span>
          <div className="flex items-center bg-[var(--bg-surface-subtle)] p-0.5 rounded-lg border border-[var(--border-subtle)]">
            <button
              onClick={() => setViewMode('maritime_map')}
              className="px-3 py-1 rounded-md text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              🗺️ Interactive Maritime Sea Routes
            </button>
            <button
              onClick={() => setViewMode('schematic')}
              className="px-3 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white shadow-xs"
            >
              ⚡ Topological Schematic
            </button>
          </div>
        </div>
      </div>

      {/* Controls Header Bar */}
      <div className="enterprise-card p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Node Type & Risk Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1 text-[var(--text-secondary)] font-medium pr-1">
            <Filter className="w-3.5 h-3.5 text-blue-500" />
            <span>Type:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-[var(--bg-surface-subtle)] p-0.5 rounded-lg border border-[var(--border-subtle)]">
            {(['ALL', 'SUPPLIER', 'PORT', 'CORRIDOR', 'REFINERY', 'SPR', 'DEMAND'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  typeFilter === t
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                {t === 'ALL' ? 'All' : t === 'SUPPLIER' ? 'Suppliers' : t === 'PORT' ? 'Ports' : t === 'CORRIDOR' ? 'Corridors' : t === 'REFINERY' ? 'Refineries' : t === 'SPR' ? 'Reserves' : 'Demand'}
              </button>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-1 bg-[var(--bg-surface-subtle)] p-0.5 rounded-lg border border-[var(--border-subtle)] ml-1">
            {(['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  riskFilter === r
                    ? r === 'CRITICAL'
                      ? 'bg-[#D92D20] text-white font-semibold'
                      : r === 'HIGH'
                      ? 'bg-[#F79009] text-white font-semibold'
                      : 'bg-[#1E40AF] text-white font-semibold'
                    : 'text-[#475467] hover:text-[#172033] hover:bg-white'
                }`}
              >
                {r === 'ALL' ? 'All Risk' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Display Toggles & Zoom */}
        <div className="flex items-center space-x-3 text-xs">
          <label className="hidden md:flex items-center text-[#475467] cursor-pointer select-none text-[11.5px]">
            <input
              type="checkbox"
              checked={showFlow}
              onChange={(e) => setShowFlow(e.target.checked)}
              className="mr-1.5 rounded border-[#D0D5DD] text-[#1E40AF] focus:ring-0"
            />
            Show Flow
          </label>

          <label className="hidden md:flex items-center text-[#475467] cursor-pointer select-none text-[11.5px]">
            <input
              type="checkbox"
              checked={showKeyLabels}
              onChange={(e) => setShowKeyLabels(e.target.checked)}
              className="mr-1.5 rounded border-[#D0D5DD] text-[#1E40AF] focus:ring-0"
            />
            Show Labels
          </label>

          {/* Zoom Buttons */}
          <div className="flex items-center space-x-1 border-l border-[#E4E7EC] pl-2.5">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.5, Number((z + 0.1).toFixed(1))))}
              className="p-1.5 rounded-md hover:bg-[#F2F4F7] text-[#475467] transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, Number((z - 0.1).toFixed(1))))}
              className="p-1.5 rounded-md hover:bg-[#F2F4F7] text-[#475467] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-md hover:bg-[#F2F4F7] text-[#475467] transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Visualization Canvas */}
      <div className="relative bg-[#FFFFFF] border border-[#E4E7EC] rounded-xl overflow-hidden shadow-xs min-h-[540px]">
        {/* Subtle Map Grid Coordinate Guidelines */}
        <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:20px_20px] opacity-80 pointer-events-none" />

        {/* Global Geographical Region Markers */}
        <div className="absolute top-3 left-5 pointer-events-none text-[#94A3B8] text-[10px] font-mono tracking-wider select-none uppercase font-semibold">
          AMERICAS & ATLANTIC
        </div>
        <div className="absolute top-3 left-[35%] pointer-events-none text-[#94A3B8] text-[10px] font-mono tracking-wider select-none uppercase font-semibold">
          BALTIC / BLACK SEA
        </div>
        <div className="absolute top-[34%] left-[42%] pointer-events-none text-[#94A3B8] text-[10px] font-mono tracking-wider select-none uppercase font-semibold">
          PERSIAN GULF & ARABIAN SEA
        </div>
        <div className="absolute top-[32%] left-[76%] pointer-events-none text-[#1E40AF]/60 text-[10.5px] font-mono tracking-wider select-none uppercase font-bold">
          INDIA ENERGY IMPORT GRID (5.10 MBD)
        </div>
        <div className="absolute bottom-4 left-[46%] pointer-events-none text-[#94A3B8] text-[10px] font-mono tracking-wider select-none uppercase font-semibold">
          CAPE OF GOOD HOPE (OPEN OCEAN ALTERNATIVE)
        </div>

        {/* Interactive SVG Network Map */}
        <div className="w-full overflow-hidden">
          <svg
            viewBox="0 0 1100 620"
            className="w-full h-auto max-h-[620px] select-none transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >
            <defs>
              <marker
                id="arrow-edge-active"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#1E40AF" />
              </marker>

              <marker
                id="arrow-edge-disrupted"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#D92D20" />
              </marker>

              <marker
                id="arrow-edge-rerouted"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#16A34A" />
              </marker>
            </defs>

            {/* RENDER EDGES (Shipping Corridors & Pipelines) */}
            {currentGraph.edges.map((edge) => {
              const fromNode = nodeMap.get(edge.fromNodeId);
              const toNode = nodeMap.get(edge.toNodeId);
              if (!fromNode || !toNode) return null;

              const fromPos = projectCoordinates(fromNode.lat, fromNode.lng);
              const toPos = projectCoordinates(toNode.lat, toNode.lng);

              const isDisrupted = edge.status === 'DISRUPTED' || edge.status === 'CONGESTED';
              const isAlternative = edge.isAlternative;

              // Arc curvature
              const midX = (fromPos.x + toPos.x) / 2;
              const midY = (fromPos.y + toPos.y) / 2 - (fromPos.x > 500 && toPos.x > 700 ? 12 : 24);
              const pathD = `M ${fromPos.x} ${fromPos.y} Q ${midX} ${midY} ${toPos.x} ${toPos.y}`;

              const strokeColor = isDisrupted
                ? '#D92D20'
                : isAlternative
                ? '#16A34A'
                : edge.riskScore > 60
                ? '#F79009'
                : '#1E40AF';

              const strokeWidth = Math.max(1.8, Math.min(4.8, edge.currentFlowMbpd * 2.8));

              return (
                <g key={edge.id} className="cursor-pointer group">
                  {/* Subtle Background Glow Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth + 3}
                    strokeOpacity={isDisrupted ? 0.2 : 0.08}
                  />

                  {/* Primary Transit Lane Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={isDisrupted ? '5,5' : undefined}
                    markerEnd={
                      isDisrupted
                        ? 'url(#arrow-edge-disrupted)'
                        : isAlternative
                        ? 'url(#arrow-edge-rerouted)'
                        : 'url(#arrow-edge-active)'
                    }
                  />

                  {/* Flow Badge along edge if enabled and active */}
                  {showFlow && edge.currentFlowMbpd > 0 && (
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-20"
                        y="-8"
                        width="40"
                        height="16"
                        rx="4"
                        fill="#FFFFFF"
                        stroke={strokeColor}
                        strokeWidth="1"
                        className="shadow-xs"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fill="#172033"
                        fontSize="9"
                        fontFamily="'Inter', monospace"
                        fontWeight="600"
                      >
                        {edge.currentFlowMbpd.toFixed(2)}M
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* RENDER NODES WITH RESTRAINED ENTERPRISE SYMBOLS */}
            {filteredNodes.map((node) => {
              const pos = projectCoordinates(node.lat, node.lng);
              const color = getNodeColor(node);
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode?.id === node.id;
              const isDisrupted = node.status === 'DISRUPTED';
              const isDegraded = node.status === 'DEGRADED';

              const radius = node.type === 'CORRIDOR' ? 12 : node.type === 'PORT' ? 10 : 8.5;

              return (
                <g
                  key={node.id}
                  id={`node-${node.id}`}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedNode(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer"
                >
                  {/* Subtle Disruption / Risk Warning Ripple */}
                  {(isDisrupted || isDegraded || (showRisk && node.riskScore > 65)) && (
                    <circle
                      r={radius + 6}
                      fill={color}
                      opacity={0.25}
                      className="animate-ping"
                    />
                  )}

                  {/* Base Marker Circle / Diamond */}
                  {node.type === 'REFINERY' ? (
                    // Green Diamond for Refinery
                    <rect
                      x={-radius}
                      y={-radius}
                      width={radius * 2}
                      height={radius * 2}
                      transform="rotate(45)"
                      fill="#FFFFFF"
                      stroke={color}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-transform duration-150 hover:scale-125 shadow-sm"
                    />
                  ) : (
                    <circle
                      r={radius}
                      fill="#FFFFFF"
                      stroke={color}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-transform duration-150 hover:scale-125 shadow-sm"
                    />
                  )}

                  {/* Inner Fill */}
                  {isDisrupted ? (
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill="#D92D20"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      ✕
                    </text>
                  ) : (
                    <circle r={radius - 3.5} fill={color} />
                  )}

                  {/* SMART LABELS: Only render if Selected, Hovered, or Key Labels Toggle is ON */}
                  {(isSelected || isHovered || (showKeyLabels && ['cor_hormuz', 'cor_redsea', 'sup_saudi', 'sup_russia', 'port_vadinar'].includes(node.id))) && (
                    <g transform={`translate(0, ${radius + 12})`} className="pointer-events-none">
                      <rect
                        x={-(node.name.length * 3.2 + 8)}
                        y="-8"
                        width={node.name.length * 6.4 + 16}
                        height="16"
                        rx="4"
                        fill={isSelected ? '#0F2942' : '#FFFFFF'}
                        stroke={isSelected ? '#0F2942' : '#E4E7EC'}
                        strokeWidth="1"
                        className="shadow-xs"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fill={isSelected ? '#FFFFFF' : '#172033'}
                        fontSize="9.5"
                        fontFamily="'Inter', sans-serif"
                        fontWeight="600"
                      >
                        {node.name.split('(')[0].trim()}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Legend */}
        <div className="absolute bottom-3 left-4 bg-white/95 border border-[#E4E7EC] rounded-lg p-2.5 text-xs text-[#475467] shadow-xs hidden md:block">
          <span className="font-semibold text-[#172033] block text-[10.5px] mb-1 uppercase tracking-wider">
            Network Elements
          </span>
          <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E40AF]" />
              <span>Supplier</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
              <span>Port SPM</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rotate-45 bg-[#16A34A]" />
              <span>Refinery</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
              <span>SPR Reserve</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D92D20]" />
              <span>Disrupted</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
              <span>Demand Hub</span>
            </div>
          </div>
        </div>

        {/* Selected Node Right-Side Detail Panel */}
        {selectedNode && (
          <div className="absolute top-3 right-3 w-80 bg-white border border-[#E4E7EC] rounded-xl shadow-lg p-4 space-y-3.5 animate-fadeIn z-20">
            <div className="flex items-start justify-between border-b border-[#E4E7EC] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E40AF] bg-[#EFF4FE] px-2 py-0.5 rounded">
                  {selectedNode.type}
                </span>
                <h3 className="text-sm font-bold text-[#172033] mt-1">{selectedNode.name}</h3>
                <span className="text-xs text-[#667085]">{selectedNode.country}</span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-md text-[#98A2B3] hover:text-[#172033] hover:bg-[#F2F4F7]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Current Flow / Stock</span>
                <span className="font-mono font-semibold text-[#172033]">
                  {selectedNode.currentFlowMbpd.toFixed(2)} {selectedNode.type === 'SPR' ? 'MMBbl' : 'MBPD'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Operating Status</span>
                <span
                  className={`font-semibold px-1.5 py-0.2 rounded text-[10.5px] ${
                    selectedNode.status === 'DISRUPTED'
                      ? 'bg-[#FEE4E2] text-[#B42318]'
                      : selectedNode.status === 'DEGRADED'
                      ? 'bg-[#FEF0C7] text-[#B54708]'
                      : 'bg-[#ECFDF3] text-[#027A48]'
                  }`}
                >
                  {selectedNode.status}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Risk Score</span>
                <span
                  className={`font-mono font-bold ${
                    selectedNode.riskScore > 65
                      ? 'text-[#B42318]'
                      : selectedNode.riskScore > 40
                      ? 'text-[#B54708]'
                      : 'text-[#027A48]'
                  }`}
                >
                  {selectedNode.riskScore} / 100 ({selectedNode.riskLevel})
                </span>
              </div>

              {selectedNode.connectedCorridors && selectedNode.connectedCorridors.length > 0 && (
                <div className="py-1">
                  <span className="text-[#667085] block mb-1">Connected Corridors</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.connectedCorridors.map((c) => (
                      <span key={c} className="bg-[#F2F4F7] text-[#344054] px-1.5 py-0.5 rounded text-[10px] font-mono">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {onOpenScenarioSimulator && (
              <button
                onClick={onOpenScenarioSimulator}
                className="w-full py-2 bg-[#0F2942] hover:bg-[#1A365D] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center space-x-1 shadow-xs"
              >
                <span>Simulate Node Disruption</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
