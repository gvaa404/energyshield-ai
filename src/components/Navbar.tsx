import React from 'react';
import {
  ShieldAlert,
  Activity,
  Globe2,
  Sliders,
  TrendingUp,
  Database,
  FileText,
  Radio,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { SimulationResult } from '../types/index';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeSimulation: SimulationResult | null;
  onResetToBaseline: () => void;
  onOpenDemoWalkthrough: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeSimulation,
  onResetToBaseline,
  onOpenDemoWalkthrough,
}) => {
  const isDisrupted = !!activeSimulation;

  const navItems = [
    { id: 'network', label: 'Digital Twin Map', icon: Globe2 },
    { id: 'scenarios', label: 'What-If Simulator', icon: Sliders },
    { id: 'procurement', label: 'Adaptive Procurement', icon: TrendingUp },
    { id: 'reserves', label: 'Strategic Reserves', icon: Database },
    { id: 'risks', label: 'Risk Intelligence', icon: Activity },
    { id: 'events', label: 'Event Feed', icon: Radio },
    { id: 'rag', label: 'RAG Knowledge', icon: FileText },
  ];

  return (
    <header className="bg-white border-b border-[#E0E2EC] text-[#1F1F1F] sticky top-0 z-50 shadow-xs">
      {/* Top Banner / Material System Bar */}
      <div className="bg-[#F0F4F9] px-4 sm:px-6 py-1.5 border-b border-[#E0E2EC] flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-[#B06000] font-semibold tracking-wide text-[11px] bg-[#FEF7E0] px-2.5 py-0.5 rounded-full border border-[#FDD663]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#B06000] animate-pulse mr-1.5"></span>
            DEMO MODE: HORMUZ DISRUPTION READY
          </span>
          <span className="text-[#DADCE0] hidden md:inline">|</span>
          <span className="text-[#5F6368] text-[11px] hidden md:inline">
            Simulated Twin Calibrated to MoPNG & ISPRL Baselines (5.10 MBPD)
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-3 text-[11px]">
            <span className="text-[#5F6368]">
              System Status: <span className="text-[#137333] font-medium">Operational</span>
            </span>
            <span className="text-[#5F6368]">
              Intelligence: <span className="text-[#1F1F1F] font-medium">Live Stream</span>
            </span>
          </div>

          <div className="flex items-center">
            {isDisrupted ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#FCE8E6] text-[#C5221F] border border-[#F6AEA9]">
                <ShieldAlert className="w-3 h-3 mr-1 text-[#C5221F]" />
                Disruption: {activeSimulation.scenario.name}
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#137333] mr-1.5"></span>
                Baseline Nominal
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Material App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('network')}>
            <div className="w-9 h-9 bg-[#0B57D0] rounded-xl flex items-center justify-center font-bold text-white shadow-sm">
              E
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#1F1F1F] leading-none">
                  ENERGYSHIELD <span className="text-[#0B57D0]">AI</span>
                </h1>
                <span className="hidden sm:inline px-2.5 py-0.5 bg-[#D3E3FD] text-[#041E49] border border-[#A8C7FA] rounded-full text-[10px] font-semibold uppercase tracking-wider">
                  Material Design
                </span>
              </div>
              <p className="text-[11px] text-[#5F6368] mt-0.5 leading-none">
                National Energy Supply Chain Resilience & Digital Twin
              </p>
            </div>
          </div>

          {/* Material Action Buttons */}
          <div className="flex items-center space-x-2.5">
            {isDisrupted && (
              <button
                id="btn-reset-baseline"
                onClick={onResetToBaseline}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-[#F1F3F4] text-[#444746] border border-[#DADCE0] transition flex items-center shadow-xs"
                title="Reset network to nominal baseline"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-[#5F6368]" />
                Reset Baseline
              </button>
            )}

            <button
              id="btn-guided-demo"
              onClick={onOpenDemoWalkthrough}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#0B57D0] hover:bg-[#0842A0] text-white shadow-sm flex items-center transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-white" />
              Guided Hackathon Demo
            </button>
          </div>
        </div>

        {/* Google Material 3 Segmented Navigation Tabs */}
        <nav className="flex space-x-1.5 overflow-x-auto no-scrollbar border-t border-[#E0E2EC] pt-1.5 pb-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#D3E3FD] text-[#041E49] shadow-xs font-semibold'
                    : 'text-[#444746] hover:text-[#1F1F1F] hover:bg-[#F0F4F9]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 mr-1.5 ${isActive ? 'text-[#0B57D0]' : 'text-[#5F6368]'}`} />
                {item.label}
                {item.id === 'scenarios' && isDisrupted && (
                  <span className="ml-1.5 w-2 h-2 rounded-full bg-[#D93025] animate-pulse"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

