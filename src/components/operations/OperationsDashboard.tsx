/**
 * Mountain Security Services (MSS) - ERP Platform
 * OperationsDashboard.tsx (Phase 4 - Operations Command Center)
 */

import React from 'react';
import {
  Shield,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Calendar,
  UserCheck,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const OperationsDashboard: React.FC = () => {
  const {
    guards,
    guardAssignments,
    securitySites,
    attendanceRecords,
    overtimeRecords,
    setActiveTab,
  } = useERP();

  const totalGuards = guards.length;
  const activeGuards = guards.filter((g) => g.status === 'ACTIVE').length;
  const armedGuards = guards.filter((g) => g.isArmedAuthorized).length;
  const deployedGuards = guardAssignments.filter((a) => a.status === 'ACTIVE').length;

  const presentToday = attendanceRecords.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;
  const absentToday = attendanceRecords.filter((a) => a.status === 'ABSENT').length;
  const pendingOvertime = overtimeRecords.filter((o) => o.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-800 font-mono">
              Phase 4 • Operations & Guard Field Force
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight mt-1">
            Operations & Guard Deployment Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Guard personnel master, site posts, biometric attendance, overtime audits, and 24/7 patrol operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('guards-roster')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-red-400" />
            <span>Guards Directory ({totalGuards})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Total Active Personnel
            </span>
            <div className="p-2 bg-slate-100 text-slate-900 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {activeGuards} Guards
            </h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              {armedGuards} Armed Weapon Qualified
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Deployed on Active Posts
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {deployedGuards} Deployed
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Across {securitySites.length} protected client posts
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Present Today (Shift Check-in)
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-emerald-700 font-['Space_Grotesk']">
              {presentToday} Checked In
            </h3>
            <p className="text-xs text-rose-600 font-semibold mt-1">
              {absentToday} Unexcused Absences
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Overtime Hours Claimed
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {overtimeRecords.reduce((sum, o) => sum + (o.hours || o.approvedOvertimeHours || o.eligibleOvertimeHours || 0), 0)} Hours
            </h3>
            <p className="text-xs text-amber-600 font-semibold mt-1">
              {pendingOvertime} claims pending supervisor review
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'guards-roster', label: 'Guards Master Directory', desc: 'Personnel profiles, CNIC, bio-data & weapon status', icon: <Users className="w-5 h-5" /> },
          { id: 'guard-assignments', label: 'Guard Post Deployments', desc: 'Assign guards to sites, shifts & designate posts', icon: <MapPin className="w-5 h-5" /> },
          { id: 'attendance', label: 'Attendance & Time Logs', desc: 'Daily roll call, shift check-ins & relief guards', icon: <UserCheck className="w-5 h-5" /> },
          { id: 'overtime', label: 'Overtime Management', desc: 'Double-shift tracking, overtime audit & approvals', icon: <Clock className="w-5 h-5" /> },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-xs text-left transition-all group space-y-2"
          >
            <div className="p-2.5 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 rounded-xl w-fit transition-colors">
              {item.icon}
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">{item.label}</h4>
            <p className="text-xs text-slate-500">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Guard Master Roster Snapshot */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Active Security Force Roster</h3>
          <button
            type="button"
            onClick={() => setActiveTab('guards-roster')}
            className="text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            View Complete Guards List →
          </button>
        </div>
        <div className="divide-y divide-slate-100 overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Guard Code</th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">CNIC / ID</th>
                <th className="px-4 py-3">Rank / Designation</th>
                <th className="px-4 py-3">Weapon Authorization</th>
                <th className="px-4 py-3">Current Assignment</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {guards.map((guard) => {
                const assignment = guardAssignments.find((a) => (a.guardId === guard.id || a.employeeId === guard.id) && a.status === 'ACTIVE');
                return (
                  <tr key={guard.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-mono font-bold text-slate-900">{guard.guardCode || guard.employeeCode}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{guard.fullName}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{guard.cnic || guard.cnicOrNationalId}</td>
                    <td className="px-4 py-3 text-slate-700 font-semibold">{guard.rank || guard.designation || guard.employeeType}</td>
                    <td className="px-4 py-3">
                      {guard.isArmedAuthorized ? (
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-red-100 text-red-800">
                          ARMED ({guard.weaponLicenseNumber || guard.gunLicenseNumber || 'LIC-OK'})
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[10px]">UNARMED</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {assignment ? assignment.siteName : <span className="text-slate-400">Available / In Reserve</span>}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800">
                        {guard.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
