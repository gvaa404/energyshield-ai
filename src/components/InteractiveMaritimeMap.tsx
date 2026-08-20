import React, { useEffect, useRef, useState, useMemo } from 'react';
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
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Ship,
  Navigation,
  Compass,
  Flame,
  Factory,
  Database,
  Zap,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles,
  Search,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Info,
  Radio,
} from 'lucide-react';

declare global {
  interface Window {
    L: any;
  }
}

interface InteractiveMaritimeMapProps {
  graph: NetworkGraph;
  simulationResult: SimulationResult | null;
  theme?: 'dark' | 'light';
  onSelectNode?: (node: SupplyChainNode) => void;
  onOpenScenarioSimulator?: () => void;
  compactMode?: boolean;
}

// Realistic Maritime Waypoints and Sea Corridors
export interface MaritimeRoute {
  id: string;
  name: string;
  originName: string;
  originCoords: [number, number]; // [lat, lng]
  destName: string;
  destCoords: [number, number];
  corridor: string;
  path: [number, number][]; // LatLng waypoints following navigable oceans
  flowMbpd: number;
  transitDays: number;
  costUsd: number;
  riskScore: number;
  status: 'NORMAL' | 'DELAYED' | 'DISRUPTED' | 'ALTERNATIVE';
  vessels: {
    name: string;
    type: 'VLCC' | 'Suezmax' | 'Aframax';
    cargoMbbl: number;
    speedKnots: number;
    currentCoords: [number, number];
    heading: number; // degrees
    eta: string;
    flag: string;
  }[];
}

const MARITIME_ROUTES: MaritimeRoute[] = [
  {
    id: 'route_saudi_sikka',
    name: 'Ras Tanura → Sikka SPM (Arab Light)',
    originName: 'Ras Tanura Terminal (Saudi Arabia)',
    originCoords: [26.64, 50.15],
    destName: 'Sikka SPM Marine Terminal (Gujarat, India)',
    destCoords: [22.43, 69.83],
    corridor: 'Strait of Hormuz',
    path: [
      [26.64, 50.15],
      [26.75, 52.50],
      [26.56, 56.25], // Hormuz
      [25.00, 58.50], // Gulf of Oman
      [23.50, 62.00], // Arabian Sea North
      [22.80, 66.50],
      [22.43, 69.83], // Sikka SPM
    ],
    flowMbpd: 0.85,
    transitDays: 4.5,
    costUsd: 0.85,
    riskScore: 68,
    status: 'NORMAL',
    vessels: [
      {
        name: 'MT Jag Leela',
        type: 'VLCC',
        cargoMbbl: 2.0,
        speedKnots: 13.8,
        currentCoords: [24.1, 60.5],
        heading: 105,
        eta: '+18h (Sikka)',
        flag: 'India',
      },
    ],
  },
  {
    id: 'route_iraq_vadinar',
    name: 'Basra → Vadinar Terminal (Basrah Medium)',
    originName: 'Basra Oil Terminal (Iraq)',
    originCoords: [29.80, 48.58],
    destName: 'Vadinar Deepwater Terminal (Gujarat, India)',
    destCoords: [22.45, 69.71],
    corridor: 'Strait of Hormuz',
    path: [
      [29.80, 48.58],
      [28.20, 50.80],
      [26.80, 53.00],
      [26.56, 56.25], // Hormuz
      [24.80, 58.90],
      [22.20, 63.50],
      [22.45, 69.71], // Vadinar
    ],
    flowMbpd: 1.05,
    transitDays: 5.2,
    costUsd: 0.95,
    riskScore: 72,
    status: 'NORMAL',
    vessels: [
      {
        name: 'MT Front Arden',
        type: 'VLCC',
        cargoMbbl: 1.9,
        speedKnots: 14.1,
        currentCoords: [27.4, 52.1],
        heading: 120,
        eta: '+1.6 days (Vadinar)',
        flag: 'Liberia',
      },
    ],
  },
  {
    id: 'route_russia_redsea',
    name: 'Novorossiysk → Sikka via Suez & Red Sea (Urals)',
    originName: 'Novorossiysk Terminal (Russia / Black Sea)',
    originCoords: [44.72, 37.78],
    destName: 'Sikka SPM Port (Gujarat, India)',
    destCoords: [22.43, 69.83],
    corridor: 'Bab el-Mandeb / Red Sea',
    path: [
      [44.72, 37.78],
      [41.50, 29.20], // Bosphorus
      [38.50, 25.50], // Aegean
      [34.00, 28.00], // Mediterranean
      [31.25, 32.30], // Port Said (Suez entrance)
      [29.95, 32.55], // Suez Exit
      [27.50, 34.50], // Northern Red Sea
      [22.50, 38.00], // Central Red Sea
      [15.50, 41.80], // Southern Red Sea
      [12.58, 43.33], // Bab el-Mandeb
      [12.20, 48.00], // Gulf of Aden
      [14.50, 58.00], // Arabian Sea
      [20.50, 65.00],
      [22.43, 69.83],
    ],
    flowMbpd: 0.95,
    transitDays: 18.0,
    costUsd: 4.20,
    riskScore: 78,
    status: 'DISRUPTED',
    vessels: [
      {
        name: 'MT Desh Shanti',
        type: 'Suezmax',
        cargoMbbl: 1.0,
        speedKnots: 11.2,
        currentCoords: [13.2, 44.5],
        heading: 95,
        eta: '+3.4 days (Escorted)',
        flag: 'India',
      },
    ],
  },
  {
    id: 'route_russia_cape',
    name: 'Baltic/Primorsk → Paradip via Cape of Good Hope (Urals)',
    originName: 'Primorsk / Baltic Terminal (Russia)',
    originCoords: [59.90, 28.50],
    destName: 'Paradip SPM Terminal (Odisha, India)',
    destCoords: [20.26, 86.67],
    corridor: 'Cape of Good Hope Bypass',
    path: [
      [59.90, 28.50],
      [57.50, 11.00], // Kattegat
      [56.00, 3.00],  // North Sea
      [50.00, -2.00], // English Channel
      [42.00, -10.00],// Atlantic Off Iberia
      [25.00, -18.00],// Canary Islands
      [5.00, -15.00], // Equatorial Atlantic
      [-15.00, -5.00],
      [-34.35, 18.47],// Cape of Good Hope
      [-35.50, 26.00],// Agulhas
      [-25.00, 45.00],// Southern Madagascar
      [-5.00, 65.00], // Equatorial Indian Ocean
      [8.00, 80.00],  // South of Sri Lanka
      [15.00, 85.00], // Bay of Bengal
      [20.26, 86.67], // Paradip
    ],
    flowMbpd: 0.50,
    transitDays: 32.0,
    costUsd: 6.80,
    riskScore: 18,
    status: 'ALTERNATIVE',
    vessels: [
      {
        name: 'MT Arctic Voyager',
        type: 'VLCC',
        cargoMbbl: 2.1,
        speedKnots: 14.5,
        currentCoords: [-30.5, 32.0],
        heading: 55,
        eta: '+9.5 days (Paradip)',
        flag: 'Panama',
      },
    ],
  },
  {
    id: 'route_uae_kochi',
    name: 'Fujairah → Kochi SPM (Murban Sweet - Hormuz Bypass)',
    originName: 'Fujairah Deepwater Terminal (UAE)',
    originCoords: [25.13, 56.34],
    destName: 'Kochi SPM Marine Terminal (Kerala, India)',
    destCoords: [9.97, 76.22],
    corridor: 'Direct Indian Ocean',
    path: [
      [25.13, 56.34],
      [23.50, 59.50],
      [18.00, 66.00],
      [13.00, 72.00],
      [9.97, 76.22],
    ],
    flowMbpd: 0.45,
    transitDays: 3.2,
    costUsd: 0.78,
    riskScore: 24,
    status: 'NORMAL',
    vessels: [
      {
        name: 'MT Ratna Shradha',
        type: 'Aframax',
        cargoMbbl: 0.75,
        speedKnots: 13.2,
        currentCoords: [19.2, 64.8],
        heading: 140,
        eta: '+1.4 days (Kochi)',
        flag: 'India',
      },
    ],
  },
  {
    id: 'route_westafrica_kochi',
    name: 'Bonny Terminal → Kochi / Mumbai (Bonny Light)',
    originName: 'Bonny Offshore Terminal (Nigeria)',
    originCoords: [4.35, 7.15],
    destName: 'Mumbai / Kochi Port (India)',
    destCoords: [18.95, 72.82],
    corridor: 'Cape of Good Hope / Atlantic Basin',
    path: [
      [4.35, 7.15],
      [-5.00, 5.00],
      [-20.00, 10.00],
      [-34.35, 18.47], // Cape
      [-33.00, 30.00],
      [-18.00, 50.00],
      [2.00, 65.00],
      [14.00, 71.00],
      [18.95, 72.82],
    ],
    flowMbpd: 0.32,
    transitDays: 24.0,
    costUsd: 3.40,
    riskScore: 28,
    status: 'NORMAL',
    vessels: [
      {
        name: 'MT Swarna Mala',
        type: 'Suezmax',
        cargoMbbl: 1.0,
        speedKnots: 13.6,
        currentCoords: [-12.5, 47.0],
        heading: 40,
        eta: '+6.2 days (Mumbai)',
        flag: 'India',
      },
    ],
  },
  {
    id: 'route_usa_mundra',
    name: 'LOOP Louisiana → Mundra Adani SPM (WTI Midland)',
    originName: 'LOOP Louisiana Offshore Oil Port (USA)',
    originCoords: [29.30, -94.79],
    destName: 'Mundra Adani SPM Port (Gujarat, India)',
    destCoords: [22.75, 69.70],
    corridor: 'Atlantic / Cape of Good Hope',
    path: [
      [29.30, -94.79],
      [24.50, -84.00], // Florida Strait
      [22.00, -75.00],
      [15.00, -50.00],
      [0.00, -25.00],  // Mid Atlantic
      [-20.00, -5.00],
      [-34.35, 18.47], // Cape
      [-30.00, 35.00],
      [-10.00, 58.00],
      [10.00, 66.00],
      [22.75, 69.70],
    ],
    flowMbpd: 0.28,
    transitDays: 36.0,
    costUsd: 5.50,
    riskScore: 18,
    status: 'NORMAL',
    vessels: [
      {
        name: 'MT Houston Star',
        type: 'VLCC',
        cargoMbbl: 2.0,
        speedKnots: 14.8,
        currentCoords: [-8.0, 59.2],
        heading: 30,
        eta: '+7.8 days (Mundra)',
        flag: 'Marshall Islands',
      },
    ],
  },
];

// Strategic Chokepoints / Risk Zones
const RISK_ZONES = [
  {
    id: 'rz_hormuz',
    name: 'Strait of Hormuz High Risk Zone',
    coords: [26.56, 56.25] as [number, number],
    radiusKm: 180,
    severity: 'HIGH',
    riskScore: 82,
    threat: 'Naval interception risk, GPS spoofing, mine alerts',
  },
  {
    id: 'rz_redsea',
    name: 'Southern Red Sea & Bab el-Mandeb Blockade Zone',
    coords: [13.20, 43.10] as [number, number],
    radiusKm: 280,
    severity: 'CRITICAL',
    riskScore: 88,
    threat: 'Active drone / anti-ship missile danger zone. War risk insurance surcharge +1.2%',
  },
  {
    id: 'rz_blacksea',
    name: 'Black Sea War Risk Transit Corridor',
    coords: [43.50, 34.00] as [number, number],
    radiusKm: 240,
    severity: 'HIGH',
    riskScore: 76,
    threat: 'Drifting naval mines & electronic jamming',
  },
];

export const InteractiveMaritimeMap: React.FC<InteractiveMaritimeMapProps> = ({
  graph,
  simulationResult,
  theme = 'dark',
  onSelectNode,
  onOpenScenarioSimulator,
  compactMode = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersGroupRef = useRef<{ [key: string]: any }>({});
  const polylinesRef = useRef<{ [key: string]: any }>({});

  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapStyle, setMapStyle] = useState<'dark' | 'light' | 'voyager'>('dark');

  // Layer Visibility Toggles
  const [layerVisibility, setLayerVisibility] = useState({
    suppliers: true,
    ports: true,
    refineries: true,
    reserves: true,
    demand: true,
    corridors: true,
    routes: true,
    vessels: true,
    riskZones: true,
    flowAnimation: true,
  });

  // Filter States
  const [regionFilter, setRegionFilter] = useState<'ALL' | 'MIDDLE_EAST' | 'RUSSIA' | 'AFRICA' | 'AMERICAS'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NORMAL' | 'DISRUPTED' | 'ALTERNATIVE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync map style with current theme if not manually overridden
  useEffect(() => {
    setMapStyle(theme === 'light' ? 'light' : 'dark');
  }, [theme]);

  // Determine current graph nodes (from simulation or baseline)
  const currentGraph = simulationResult ? simulationResult.networkState : graph;

  // Filtered maritime routes
  const filteredRoutes = useMemo(() => {
    return MARITIME_ROUTES.map((r) => {
      let status = r.status;
      let flow = r.flowMbpd;
      let risk = r.riskScore;

      // Adjust based on simulation
      if (simulationResult) {
        if (r.corridor === 'Strait of Hormuz' && simulationResult.scenario.affectedCorridorIds.includes('cor_hormuz')) {
          status = 'DISRUPTED';
          flow = flow * (1 - simulationResult.scenario.capacityReductionPct / 100);
          risk = 92;
        } else if (r.corridor === 'Bab el-Mandeb / Red Sea' && simulationResult.scenario.affectedCorridorIds.includes('cor_redsea')) {
          status = 'DISRUPTED';
          flow = flow * (1 - simulationResult.scenario.capacityReductionPct / 100);
          risk = 95;
        } else if (r.status === 'ALTERNATIVE') {
          // Surge on alternative route
          flow = flow + 0.45;
        }
      }

      return {
        ...r,
        status,
        flowMbpd: Number(flow.toFixed(2)),
        riskScore: risk,
      };
    }).filter((r) => {
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (regionFilter === 'MIDDLE_EAST' && !r.id.includes('saudi') && !r.id.includes('iraq') && !r.id.includes('uae')) return false;
      if (regionFilter === 'RUSSIA' && !r.id.includes('russia')) return false;
      if (regionFilter === 'AFRICA' && !r.id.includes('westafrica')) return false;
      if (regionFilter === 'AMERICAS' && !r.id.includes('usa')) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return r.name.toLowerCase().includes(q) || r.originName.toLowerCase().includes(q) || r.destName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [simulationResult, statusFilter, regionFilter, searchQuery]);

  // Leaflet Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const L = window.L;
    if (!L) {
      console.warn('Leaflet L is not loaded yet');
      return;
    }

    if (!mapInstanceRef.current) {
      // Create Map
      const map = L.map(mapContainerRef.current, {
        center: [22.0, 58.0], // Centered over Arabian Sea / Indian Ocean trade corridor
        zoom: compactMode ? 3 : 4,
        minZoom: 2,
        maxZoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Layer groups for clean toggling
      layersGroupRef.current = {
        tiles: L.layerGroup().addTo(map),
        routes: L.layerGroup().addTo(map),
        riskZones: L.layerGroup().addTo(map),
        nodes: L.layerGroup().addTo(map),
        vessels: L.layerGroup().addTo(map),
      };
    }

    const map = mapInstanceRef.current;

    // Update Basemap Tiles
    layersGroupRef.current.tiles.clearLayers();

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    let subdomains = 'abcd';

    if (mapStyle === 'light') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    } else if (mapStyle === 'voyager') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png';
    }

    const tileLayer = L.tileLayer(tileUrl, {
      subdomains,
      maxZoom: 19,
    });
    tileLayer.addTo(layersGroupRef.current.tiles);

    return () => {
      // cleanup is handled on unmount
    };
  }, [mapStyle, compactMode]);

  // Render & Update Map Layers (Routes, Nodes, Vessels, Risk Zones)
  useEffect(() => {
    const L = window.L;
    const map = mapInstanceRef.current;
    if (!L || !map || !layersGroupRef.current.routes) return;

    const { routes: routesLayer, riskZones: riskLayer, nodes: nodesLayer, vessels: vesselsLayer } = layersGroupRef.current;

    // Clear previous items
    routesLayer.clearLayers();
    riskLayer.clearLayers();
    nodesLayer.clearLayers();
    vesselsLayer.clearLayers();
    polylinesRef.current = {};

    // 1. RENDER RISK ZONES
    if (layerVisibility.riskZones) {
      RISK_ZONES.forEach((rz) => {
        const isCritical = rz.severity === 'CRITICAL';
        const color = isCritical ? '#EF4444' : '#F59E0B';

        const circle = L.circle(rz.coords, {
          radius: rz.radiusKm * 1000,
          color: color,
          weight: 1.5,
          opacity: 0.6,
          fillColor: color,
          fillOpacity: 0.12,
          dashArray: '4, 6',
        });

        circle.bindTooltip(
          `<div class="p-2 text-xs font-sans">
            <div class="flex items-center gap-1 font-bold text-red-400 mb-0.5">
              <span>⚠️ ${rz.name}</span>
            </div>
            <div class="text-[11px] text-slate-300">${rz.threat}</div>
            <div class="text-[10px] text-slate-400 mt-1 font-mono">Risk Index: ${rz.riskScore}/100</div>
          </div>`,
          { className: 'leaflet-custom-tooltip', sticky: true }
        );

        circle.addTo(riskLayer);
      });
    }

    // 2. RENDER MARITIME ROUTES (Animated Polylines)
    if (layerVisibility.routes) {
      filteredRoutes.forEach((route) => {
        const isSelected = selectedRouteId === route.id;
        const isDisrupted = route.status === 'DISRUPTED';
        const isAlternative = route.status === 'ALTERNATIVE';

        const strokeColor = isDisrupted
          ? '#EF4444'
          : isAlternative
          ? '#10B981'
          : route.riskScore > 65
          ? '#F59E0B'
          : '#3B82F6';

        const strokeWidth = isSelected ? 4.5 : Math.max(2.2, Math.min(4.5, route.flowMbpd * 2.8));

        // Background glow line
        L.polyline(route.path, {
          color: strokeColor,
          weight: strokeWidth + (isSelected ? 6 : 4),
          opacity: isSelected ? 0.4 : isDisrupted ? 0.25 : 0.15,
          lineCap: 'round',
        }).addTo(routesLayer);

        // Foreground maritime polyline
        const polyline = L.polyline(route.path, {
          color: strokeColor,
          weight: strokeWidth,
          opacity: 0.9,
          dashArray: isDisrupted ? '6, 8' : isAlternative ? '8, 6' : layerVisibility.flowAnimation ? '10, 10' : undefined,
          className: isDisrupted
            ? 'animate-maritime-flow-critical'
            : isAlternative
            ? 'animate-maritime-flow-fast'
            : layerVisibility.flowAnimation
            ? 'animate-maritime-flow'
            : '',
        });

        polyline.on('click', () => {
          setSelectedRouteId(route.id);
          setSelectedEntity({ type: 'ROUTE', data: route });
          map.fitBounds(polyline.getBounds(), { padding: [60, 60], maxZoom: 6 });
        });

        polyline.bindTooltip(
          `<div class="p-2 font-sans text-xs">
            <div class="font-bold text-slate-100 mb-0.5">${route.name}</div>
            <div class="text-[11px] text-slate-300 font-mono">Flow: ${route.flowMbpd} MBPD · Transit: ${route.transitDays}d</div>
            <div class="flex items-center justify-between text-[10px] mt-1">
              <span class="font-semibold text-${isDisrupted ? 'red-400' : 'blue-400'}">${route.status}</span>
              <span class="text-slate-400 font-mono">$${route.costUsd.toFixed(2)}/Bbl</span>
            </div>
          </div>`,
          { sticky: true }
        );

        polyline.addTo(routesLayer);
        polylinesRef.current[route.id] = polyline;

        // 3. RENDER ACTIVE VESSELS ALONG ROUTE
        if (layerVisibility.vessels && route.vessels) {
          route.vessels.forEach((vessel) => {
            const vesselIcon = L.divIcon({
              className: 'custom-vessel-marker',
              html: `
                <div class="relative cursor-pointer group flex items-center justify-center">
                  <div class="w-7 h-7 rounded-full bg-slate-900 border-2 ${
                    isDisrupted ? 'border-red-500' : 'border-blue-400'
                  } shadow-lg flex items-center justify-center text-white transform hover:scale-125 transition-transform">
                    <svg class="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                      <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
                      <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
                      <path d="M12 10v4" />
                      <path d="M12 2v3" />
                    </svg>
                  </div>
                  <div class="absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                    isDisrupted ? 'bg-red-500 animate-ping' : 'bg-emerald-400'
                  }"></div>
                </div>
              `,
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            });

            const vesselMarker = L.marker(vessel.currentCoords, { icon: vesselIcon });
            vesselMarker.on('click', () => {
              setSelectedEntity({ type: 'VESSEL', data: vessel, route });
            });

            vesselMarker.bindTooltip(
              `<div class="p-2 font-sans text-xs">
                <div class="font-bold text-slate-100 flex items-center gap-1.5">
                  <span>🚢 ${vessel.name}</span>
                  <span class="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">${vessel.type}</span>
                </div>
                <div class="text-[11px] text-slate-300 mt-1">Cargo: <b class="text-white">${vessel.cargoMbbl} MMBbl</b> · Speed: <b class="text-white">${vessel.speedKnots} kts</b></div>
                <div class="text-[10px] text-emerald-400 mt-0.5 font-mono">ETA: ${vessel.eta}</div>
              </div>`,
              { sticky: true }
            );

            vesselMarker.addTo(vesselsLayer);
          });
        }
      });
    }

    // 4. RENDER SUPPLY CHAIN NODES (Suppliers, Ports, Refineries, SPRs, Demand)
    currentGraph.nodes.forEach((node) => {
      // Layer filtering
      if (node.type === 'SUPPLIER' && !layerVisibility.suppliers) return;
      if (node.type === 'PORT' && !layerVisibility.ports) return;
      if (node.type === 'REFINERY' && !layerVisibility.refineries) return;
      if (node.type === 'SPR' && !layerVisibility.reserves) return;
      if (node.type === 'DEMAND' && !layerVisibility.demand) return;
      if (node.type === 'CORRIDOR' && !layerVisibility.corridors) return;

      const isDisrupted = node.status === 'DISRUPTED';
      const isDegraded = node.status === 'DEGRADED';

      let bgClass = 'bg-blue-600';
      let borderClass = 'border-white';
      let symbol = '●';

      if (node.type === 'SUPPLIER') {
        bgClass = 'bg-indigo-600';
        symbol = '🛢️';
      } else if (node.type === 'PORT') {
        bgClass = 'bg-orange-500';
        symbol = '⚓';
      } else if (node.type === 'REFINERY') {
        bgClass = 'bg-emerald-600';
        symbol = '🏭';
      } else if (node.type === 'SPR') {
        bgClass = 'bg-purple-600';
        symbol = '🪨';
      } else if (node.type === 'DEMAND') {
        bgClass = 'bg-sky-500';
        symbol = '⚡';
      } else if (node.type === 'CORRIDOR') {
        bgClass = node.riskScore > 65 ? 'bg-red-600' : 'bg-amber-600';
        symbol = '🧭';
      }

      if (isDisrupted) {
        bgClass = 'bg-red-600';
        borderClass = 'border-red-300 animate-pulse';
      }

      const nodeIcon = L.divIcon({
        className: 'custom-node-pin',
        html: `
          <div class="relative flex flex-col items-center group cursor-pointer">
            ${
              isDisrupted || isDegraded || node.riskScore > 70
                ? '<div class="absolute -inset-1.5 rounded-full bg-red-500/30 animate-pulse-halo pointer-events-none"></div>'
                : ''
            }
            <div class="w-6 h-6 rounded-full ${bgClass} border-2 ${borderClass} shadow-md flex items-center justify-center text-[10px] text-white font-bold group-hover:scale-125 transition-transform duration-150">
              <span>${symbol}</span>
            </div>
            <div class="mt-1 px-1.5 py-0.5 rounded bg-slate-900/90 text-slate-200 border border-slate-700/80 text-[9.5px] font-medium tracking-tight whitespace-nowrap shadow-sm opacity-90 group-hover:opacity-100 group-hover:bg-slate-950 transition-opacity">
              ${node.name.split('(')[0].trim()}
            </div>
          </div>
        `,
        iconSize: [30, 42],
        iconAnchor: [15, 20],
      });

      const marker = L.marker([node.lat, node.lng], { icon: nodeIcon });

      marker.on('click', () => {
        setSelectedEntity({ type: 'NODE', data: node });
        if (onSelectNode) onSelectNode(node);
        map.setView([node.lat, node.lng], Math.max(map.getZoom(), 6), { animate: true });
      });

      marker.bindTooltip(
        `<div class="p-2 font-sans text-xs">
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="text-[9.5px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800">${node.type}</span>
            <span class="text-[10px] font-mono ${node.riskScore > 65 ? 'text-red-400' : 'text-emerald-400'}">Risk: ${node.riskScore}/100</span>
          </div>
          <div class="font-bold text-slate-100">${node.name}</div>
          <div class="text-[11px] text-slate-400">${node.country}</div>
          <div class="text-[11px] text-slate-300 mt-1.5 font-mono">
            ${node.type === 'SPR' ? 'Strategic Stock: ' + (node.details.storageMillionBarrels || 10) + ' MMBbl' : 'Current Flow: ' + node.currentFlowMbpd.toFixed(2) + ' MBPD'}
          </div>
        </div>`,
        { sticky: true }
      );

      marker.addTo(nodesLayer);
    });
  }, [filteredRoutes, currentGraph, layerVisibility, selectedRouteId, mapStyle]);

  // Reset to global view
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      setSelectedRouteId(null);
      setSelectedEntity(null);
      mapInstanceRef.current.setView([22.0, 58.0], compactMode ? 3 : 4, { animate: true });
    }
  };

  const toggleLayer = (layerKey: keyof typeof layerVisibility) => {
    setLayerVisibility((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className={`relative enterprise-card overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[580px]'}`}>
      {/* Top Map Action Toolbar */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex flex-wrap items-center justify-between gap-3 text-xs z-10">
        {/* Left: Region & Status Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 font-semibold text-[var(--text-secondary)] pr-1">
            <Compass className="w-4 h-4 text-blue-500" />
            <span className="text-[12px]">Maritime Routes:</span>
          </div>

          <div className="flex items-center gap-1 bg-[var(--bg-surface-subtle)] p-0.5 rounded-lg border border-[var(--border-subtle)]">
            {(['ALL', 'MIDDLE_EAST', 'RUSSIA', 'AFRICA', 'AMERICAS'] as const).map((reg) => (
              <button
                key={reg}
                onClick={() => setRegionFilter(reg)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  regionFilter === reg
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                {reg === 'ALL' ? 'Global' : reg === 'MIDDLE_EAST' ? 'Persian Gulf' : reg === 'RUSSIA' ? 'Russian/Baltic' : reg === 'AFRICA' ? 'W. Africa' : 'Americas'}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-[var(--bg-surface-subtle)] p-0.5 rounded-lg border border-[var(--border-subtle)]">
            {(['ALL', 'NORMAL', 'DISRUPTED', 'ALTERNATIVE'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  statusFilter === st
                    ? st === 'DISRUPTED'
                      ? 'bg-red-600 text-white font-semibold'
                      : st === 'ALTERNATIVE'
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-blue-600 text-white font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                {st === 'ALL' ? 'All Lanes' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Map Style Switcher, Layer Menu, Zoom & Fullscreen Controls */}
        <div className="flex items-center space-x-2">
          {/* Style Switcher */}
          <div className="flex items-center bg-[var(--bg-surface-subtle)] p-0.5 rounded-lg border border-[var(--border-subtle)]">
            <button
              onClick={() => setMapStyle('dark')}
              className={`p-1 rounded text-xs ${mapStyle === 'dark' ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-400'}`}
              title="Dark Matter Map"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMapStyle('light')}
              className={`p-1 rounded text-xs ${mapStyle === 'light' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-slate-400'}`}
              title="Light Voyager Map"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Flow Animation Toggle */}
          <button
            onClick={() => toggleLayer('flowAnimation')}
            className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors flex items-center gap-1 ${
              layerVisibility.flowAnimation
                ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                : 'bg-transparent text-[var(--text-muted)] border-[var(--border-subtle)]'
            }`}
            title="Toggle Animated Sea Flows"
          >
            <Radio className={`w-3 h-3 ${layerVisibility.flowAnimation ? 'animate-pulse' : ''}`} />
            <span className="hidden md:inline">Flow Motion</span>
          </button>

          {/* Zoom & Reset Controls */}
          <div className="flex items-center space-x-0.5 border-l border-[var(--border-subtle)] pl-2">
            <button
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="p-1.5 rounded-md hover:bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="p-1.5 rounded-md hover:bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 rounded-md hover:bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] transition-colors"
              title="Reset to Global View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-md hover:bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Layer Visibility Pills Sub-bar */}
      <div className="px-3 py-1.5 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] flex items-center justify-between text-[11px] overflow-x-auto no-scrollbar gap-3 shrink-0">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-semibold text-[var(--text-muted)] text-[10.5px] uppercase tracking-wider">Layers:</span>
          
          <button
            onClick={() => toggleLayer('routes')}
            className={`px-2 py-0.5 rounded text-[10.5px] font-medium transition ${
              layerVisibility.routes ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sea Routes ({filteredRoutes.length})
          </button>

          <button
            onClick={() => toggleLayer('vessels')}
            className={`px-2 py-0.5 rounded text-[10.5px] font-medium transition ${
              layerVisibility.vessels ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Tankers (5)
          </button>

          <button
            onClick={() => toggleLayer('riskZones')}
            className={`px-2 py-0.5 rounded text-[10.5px] font-medium transition ${
              layerVisibility.riskZones ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Risk Corridors (3)
          </button>

          <button
            onClick={() => toggleLayer('ports')}
            className={`px-2 py-0.5 rounded text-[10.5px] font-medium transition ${
              layerVisibility.ports ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Indian Port SPMs
          </button>

          <button
            onClick={() => toggleLayer('refineries')}
            className={`px-2 py-0.5 rounded text-[10.5px] font-medium transition ${
              layerVisibility.refineries ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Refineries
          </button>

          <button
            onClick={() => toggleLayer('reserves')}
            className={`px-2 py-0.5 rounded text-[10.5px] font-medium transition ${
              layerVisibility.reserves ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            SPR Caverns
          </button>
        </div>

        <div className="hidden lg:flex items-center text-[10.5px] text-[var(--text-muted)] font-mono shrink-0">
          <span>Active Sea Flow: <b className="text-[var(--text-primary)]">4.40 MBD</b></span>
          <span className="mx-2">·</span>
          <span>SPM Throughput: <b className="text-[var(--text-primary)]">5.10 MBD</b></span>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative flex-1 w-full min-h-[380px] bg-[#090D16]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Global Floating Map Legend (Bottom-Left) */}
        <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-xs text-slate-300 shadow-xl z-20 hidden md:block max-w-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Ship className="w-3.5 h-3.5 text-blue-400" /> Maritime Supply Chain Map
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-1 bg-blue-500 rounded-full" />
              <span>Normal Route</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-1 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 font-semibold">Disrupted Corridor</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-1 bg-emerald-500 rounded-full" />
              <span>Alternative Reroute</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-slate-900" />
              <span>VLCC/Suezmax Tanker</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>SPM Port Terminal</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>Strategic Rock SPR</span>
            </div>
          </div>
        </div>

        {/* Selected Entity Inspector Panel (Top-Right Drawer) */}
        {selectedEntity && (
          <div className="absolute top-4 right-4 w-88 bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl p-4 space-y-3.5 z-20 animate-fadeIn text-slate-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                  {selectedEntity.type}
                </span>
                <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                  {selectedEntity.type === 'NODE'
                    ? selectedEntity.data.name
                    : selectedEntity.type === 'ROUTE'
                    ? selectedEntity.data.name
                    : `Tanker: ${selectedEntity.data.name}`}
                </h3>
                <span className="text-xs text-slate-400">
                  {selectedEntity.type === 'NODE'
                    ? selectedEntity.data.country
                    : selectedEntity.type === 'ROUTE'
                    ? `Corridor: ${selectedEntity.data.corridor}`
                    : `Flag: ${selectedEntity.data.flag}`}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedEntity(null);
                  setSelectedRouteId(null);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ROUTE DETAIL VIEW */}
            {selectedEntity.type === 'ROUTE' && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Origin</span>
                  <span className="font-medium text-white text-right max-w-[180px] truncate">{selectedEntity.data.originName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Destination</span>
                  <span className="font-medium text-white text-right max-w-[180px] truncate">{selectedEntity.data.destName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Current Flow</span>
                  <span className="font-mono font-bold text-white">{selectedEntity.data.flowMbpd} MBPD</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Transit Duration</span>
                  <span className="font-mono font-medium text-slate-200">{selectedEntity.data.transitDays} Days</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Freight & War Risk</span>
                  <span className="font-mono font-medium text-slate-200">${selectedEntity.data.costUsd.toFixed(2)}/Bbl</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Corridor Risk Score</span>
                  <span className={`font-mono font-bold ${selectedEntity.data.riskScore > 65 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {selectedEntity.data.riskScore} / 100 ({selectedEntity.data.status})
                  </span>
                </div>

                {selectedEntity.data.vessels && selectedEntity.data.vessels.length > 0 && (
                  <div className="pt-1">
                    <span className="text-slate-400 block mb-1 font-semibold">Active Tanker in Transit:</span>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="text-cyan-400">🚢 {selectedEntity.data.vessels[0].name}</span>
                        <span className="text-slate-300 font-mono">{selectedEntity.data.vessels[0].type}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex justify-between font-mono">
                        <span>Speed: {selectedEntity.data.vessels[0].speedKnots} kts</span>
                        <span className="text-emerald-400">ETA: {selectedEntity.data.vessels[0].eta}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* NODE DETAIL VIEW */}
            {selectedEntity.type === 'NODE' && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Operating Capacity</span>
                  <span className="font-mono font-bold text-white">
                    {selectedEntity.data.capacityMbpd} {selectedEntity.data.type === 'SPR' ? 'MBPD discharge' : 'MBPD'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Current Flow / Stock</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {selectedEntity.data.currentFlowMbpd.toFixed(2)} MBPD
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Operational Status</span>
                  <span className={`font-semibold px-2 py-0.5 rounded text-[10.5px] ${
                    selectedEntity.data.status === 'DISRUPTED' ? 'bg-red-950/80 text-red-400 border border-red-800' : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                  }`}>
                    {selectedEntity.data.status}
                  </span>
                </div>
                <div className="py-1">
                  <p className="text-[11.5px] text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    {selectedEntity.data.details?.description || 'Strategic infrastructure node within national energy security network.'}
                  </p>
                </div>
              </div>
            )}

            {/* VESSEL DETAIL VIEW */}
            {selectedEntity.type === 'VESSEL' && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Vessel Class</span>
                  <span className="font-mono font-bold text-white">{selectedEntity.data.type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Crude Cargo</span>
                  <span className="font-mono font-bold text-cyan-400">{selectedEntity.data.cargoMbbl} Million Barrels</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Speed / Heading</span>
                  <span className="font-mono text-slate-200">{selectedEntity.data.speedKnots} Knots · {selectedEntity.data.heading}°</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Assigned Route</span>
                  <span className="font-medium text-white">{selectedEntity.route.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Estimated Arrival</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedEntity.data.eta}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {onOpenScenarioSimulator && (
              <button
                onClick={onOpenScenarioSimulator}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center space-x-1 shadow-md"
              >
                <span>Simulate Blockade / Disruption</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
