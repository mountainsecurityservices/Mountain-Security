import React from 'react';
import {
  Users,
  Shield,
  Building2,
  ShieldCheck,
  Activity,
  Radio,
  Clock,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Boxes,
  Lock,
  ArrowRight,
  Sparkles,
  Award,
  Calendar,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useERP } from '../../context/ERPContext';
import { StatusBadge } from '../common/StatusBadge';

// Sample operational trend data for MSS
const manningTrendData = [
  { time: '00:00', nightShift: 142, dayShift: 0, incidents: 0 },
  { time: '04:00', nightShift: 138, dayShift: 0, incidents: 1 },
  { time: '08:00', nightShift: 20, dayShift: 185, incidents: 0 },
  { time: '12:00', nightShift: 0, dayShift: 194, incidents: 0 },
  { time: '16:00', nightShift: 45, dayShift: 160, incidents: 2 },
  { time: '20:00', nightShift: 152, dayShift: 12, incidents: 1 },
];

const moduleActivityData = [
  { name: 'Auth & Access', count: 184, color: '#0f172a' },
  { name: 'Users & Staff', count: 96, color: '#2563eb' },
  { name: 'Security Sites', count: 142, color: '#059669' },
  { name: 'Roles Matrix', count: 38, color: '#9333ea' },
  { name: 'System Config', count: 24, color: '#dc2626' },
];

const complianceBreakdown = [
  { name: 'Active BSIS Guard Cards', value: 348, color: '#059669' },
  { name: 'Firearm Permitted (Armed)', value: 112, color: '#2563eb' },
  { name: 'CPR / First Aid Certified', value: 310, color: '#f59e0b' },
  { name: 'Pending Bi-Annual Renewal', value: 14, color: '#dc2626' },
];

export const ExecutiveDashboard: React.FC = () => {
  const {
    currentUser,
    currentRole,
    company,
    users,
    roles,
    auditLogs,
    notifications,
    setActiveTab,
    hasPermission,
    futureModules,
  } = useERP();

  const activeUsersCount = users.filter((u) => u.status === 'active').length;
  const activeRolesCount = roles.filter((r) => r.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Corporate Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-red-600/20 text-red-400 border border-red-500/30 text-[11px] font-bold uppercase tracking-wider">
                Enterprise Operations Command
              </span>
              <span className="text-xs text-slate-400 font-mono">
                PPO License: {company.licenseNumber}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] tracking-tight">
              Mountain Security Services ERP
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Welcome back, <strong>{currentUser?.fullName}</strong> ({currentRole?.name}). All security operations, access clearance matrices, and audit forensic trails are synchronized.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {hasPermission('users.view') && (
              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-600/30 inline-flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Manage Personnel ({users.length})
              </button>
            )}
            {hasPermission('company.view') && (
              <button
                type="button"
                onClick={() => setActiveTab('company-profile')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all inline-flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Company Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active System Users */}
        <div
          onClick={() => hasPermission('users.view') && setActiveTab('users')}
          className={`p-5 bg-white rounded-xl border border-slate-200 shadow-xs transition-all flex flex-col justify-between ${
            hasPermission('users.view') ? 'cursor-pointer hover:border-slate-400 hover:shadow-sm' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Authorized Users
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {activeUsersCount} <span className="text-xs font-normal text-slate-400">/ {users.length} total</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% MFA & Password Policy Enforced</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Security Clearance Roles */}
        <div
          onClick={() => hasPermission('roles.view') && setActiveTab('roles')}
          className={`p-5 bg-white rounded-xl border border-slate-200 shadow-xs transition-all flex flex-col justify-between ${
            hasPermission('roles.view') ? 'cursor-pointer hover:border-slate-400 hover:shadow-sm' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Security Clearances
            </span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {activeRolesCount} <span className="text-xs font-normal text-slate-400">Roles Configured</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-purple-700 font-semibold mt-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Granular RBAC Matrix Active</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Guard Fleet Deployment */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Duty Manning
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Radio className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              348 <span className="text-xs font-normal text-slate-400">Guards Active</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <Activity className="w-3.5 h-3.5" />
              <span>42 Security Sites 24/7 Monitored</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Forensic Audit Records */}
        <div
          onClick={() => hasPermission('audit.view') && setActiveTab('audit-logs')}
          className={`p-5 bg-white rounded-xl border border-slate-200 shadow-xs transition-all flex flex-col justify-between ${
            hasPermission('audit.view') ? 'cursor-pointer hover:border-slate-400 hover:shadow-sm' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Audit Trail Entries
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {auditLogs.length} <span className="text-xs font-normal text-slate-400">Recorded Events</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Forensic Integrity Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 24/7 Manning & Shift Trend Chart */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
                24/7 Security Deployment & Patrol Manning Cycle
              </h3>
              <p className="text-xs text-slate-500">
                Synchronized Day Patrol vs. Night Guard Deployment across client sites
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-slate-600 font-medium">Day Shift</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-900" />
                <span className="text-slate-600 font-medium">Night Shift</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={manningTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDay" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="dayShift" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorDay)" name="Day Patrol" />
                <Area type="monotone" dataKey="nightShift" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorNight)" name="Night Patrol" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Guard Certifications & Compliance Breakdown */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
                Guard Compliance & Licensing
              </h3>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-slate-500 mb-4">
              State BSIS Guard Card & Firearms certification compliance rate
            </p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complianceBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {complianceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {complianceBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 truncate max-w-[150px]">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Activity & Future Modules Gateway */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Forensic Activity Stream */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
                Recent Security & Administrative Audit Trail
              </h3>
              <p className="text-xs text-slate-500">Live immutable system log of administrative actions</p>
            </div>
            {hasPermission('audit.view') && (
              <button
                type="button"
                onClick={() => setActiveTab('audit-logs')}
                className="text-xs font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
              >
                Full Audit Log <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 text-slate-700 shrink-0 font-mono text-[10px] font-bold">
                    {log.action.toUpperCase().substring(0, 4)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {log.details}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                      <span className="text-slate-600 font-medium">{log.userName}</span>
                      <span>•</span>
                      <span className="font-mono">{log.timestamp}</span>
                      <span>•</span>
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono text-[10px]">
                        {log.module}
                      </span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={log.status} size="sm" showIcon={false} />
              </div>
            ))}
          </div>
        </div>

        {/* Future ERP Modules Quick Launch */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
                ERP Future Modules Registry
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              All 20+ architectural modules registered for future implementation phases.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {futureModules.slice(0, 8).map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setActiveTab('future-module', mod.id)}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 text-left transition-colors flex flex-col justify-between"
                >
                  <span className="text-xs font-bold text-slate-800 truncate font-['Space_Grotesk']">
                    {mod.name}
                  </span>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                    <span className="truncate">{mod.group}</span>
                    <span className="font-mono bg-slate-200 px-1 rounded text-slate-700">
                      {mod.phase}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              type="button"
              onClick={() => setActiveTab('future-module', futureModules[0].id)}
              className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Complete ERP Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
