import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Boxes,
  Briefcase,
  Users,
  Radio,
  FileSpreadsheet,
  Clock,
  Shirt,
  Shield,
  FolderLock,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { FutureModuleMeta } from '../../types';

export const FutureModulesView: React.FC = () => {
  const { futureModules, selectedFutureModule, setActiveTab } = useERP();

  const [activeGroup, setActiveGroup] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const groups = ['ALL', 'Operations & Guard Force', 'Finance & Payroll', 'Asset & Uniform Inventory', 'Governance, Compliance & Backup'];

  const filteredModules = futureModules.filter((mod) => {
    if (activeGroup !== 'ALL' && mod.group !== activeGroup) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        mod.name.toLowerCase().includes(q) ||
        mod.description.toLowerCase().includes(q) ||
        mod.group.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeModule = selectedFutureModule || filteredModules[0] || futureModules[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MSS ERP Modular Architecture Roadmap</span>
          </div>
          <h2 className="text-2xl font-extrabold font-['Space_Grotesk'] tracking-tight">
            Phase 2+ Future Business Modules Specification
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Phase 1 establishes the rock-solid security, access control, user management, corporate identity, and audit foundation. All {futureModules.length} business modules below are architected to plug directly into this core.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        {/* Groups */}
        <div className="flex flex-wrap items-center gap-1.5">
          {groups.map((grp) => (
            <button
              key={grp}
              type="button"
              onClick={() => setActiveGroup(grp)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeGroup === grp
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {grp === 'ALL' ? `All Modules (${futureModules.length})` : grp}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search module roadmap..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-900"
          />
        </div>
      </div>

      {/* Main Roadmap Grid & Deep-Dive Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Module Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredModules.map((mod) => {
            const isSelected = activeModule?.id === mod.id;
            return (
              <div
                key={mod.id}
                onClick={() => setActiveTab('future-module', mod.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs text-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
                        isSelected
                          ? 'bg-slate-800 text-amber-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {mod.group}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {mod.phase}
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-bold font-['Space_Grotesk'] ${
                      isSelected ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {mod.name}
                  </h3>
                  <p
                    className={`text-xs mt-1 leading-relaxed line-clamp-2 ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {mod.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100/20 flex items-center justify-between text-[11px]">
                  <span
                    className={isSelected ? 'text-slate-400 font-mono' : 'text-slate-400 font-mono'}
                  >
                    {mod.features.length} Planned Capabilities
                  </span>
                  <span
                    className={`font-semibold inline-flex items-center gap-1 ${
                      isSelected ? 'text-amber-400' : 'text-slate-900'
                    }`}
                  >
                    Inspect Blueprint <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Blueprint Dossier of Selected Module */}
        {activeModule && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 h-fit sticky top-20">
            <div className="pb-4 border-b border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Module Architectural Blueprint
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-300">
                  {activeModule.phase}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
                {activeModule.name}
              </h3>
              <p className="text-xs text-slate-500">{activeModule.group}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-1.5">
                Functional Overview
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeModule.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-2">
                Planned Functional Capabilities
              </h4>
              <div className="space-y-1.5">
                {activeModule.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
              <span className="font-bold text-slate-800 block">Foundation Readiness Status:</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                All security clearance tokens, user assignments, navigation routes, and database models for <strong>{activeModule.name}</strong> are initialized in Phase 1.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
