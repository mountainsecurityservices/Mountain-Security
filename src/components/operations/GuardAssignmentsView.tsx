/**
 * Mountain Security Services (MSS) - ERP Platform
 * GuardAssignmentsView.tsx (Phase 4 - Deployments & Post Scheduling)
 */

import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Search,
  Users,
  Clock,
  Shield,
  CheckCircle2,
  Calendar,
  X,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { GuardAssignment } from '../../types';

export const GuardAssignmentsView: React.FC = () => {
  const { guards, securitySites, guardAssignments, createGuardAssignment } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<GuardAssignment>>({
    guardId: guards[0]?.id || '',
    siteId: securitySites[0]?.id || '',
    shift: 'DAY',
    postDesignation: 'Main Security Gate #1',
    startDate: '2026-09-01',
    status: 'ACTIVE',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedGuard = guards.find((g) => g.id === formData.guardId) || guards[0];
    const selectedSite = securitySites.find((s) => s.id === formData.siteId) || securitySites[0];

    createGuardAssignment({
      guardId: selectedGuard.id,
      guardName: selectedGuard.fullName,
      employeeId: selectedGuard.id,
      employeeCode: (selectedGuard as any).employeeCode || (selectedGuard as any).guardCode || 'MSS-001',
      employeeName: selectedGuard.fullName,
      employeeType: 'Security Guard',
      clientId: selectedSite?.clientId || 'cli-001',
      clientName: selectedSite?.clientName || 'General Client',
      siteId: selectedSite.id,
      siteName: selectedSite.name,
      shiftId: formData.shift || 'DAY',
      shiftName: formData.shift === 'NIGHT' ? 'Night Shift (12h)' : 'Day Shift (12h)',
      shift: formData.shift || 'DAY',
      supervisorName: 'Command Area Supervisor',
      postDesignation: formData.postDesignation || 'Main Post',
      startDate: formData.startDate || '2026-09-01',
      status: 'ACTIVE',
    } as any);

    setIsModalOpen(false);
  };

  const filteredAssignments = guardAssignments.filter((a) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    const guardName = (a.guardName || a.employeeName || '').toLowerCase();
    const siteName = (a.siteName || '').toLowerCase();
    const post = (a.postDesignation || '').toLowerCase();
    return (
      guardName.includes(q) ||
      siteName.includes(q) ||
      post.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Guard Post Deployments & Shift Rosters
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active physical postings, shift assignments (Day/Night/24H), and post designations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Deploy Guard to Site</span>
          </button>
        </div>
      </div>

      {/* Deployments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Guard Personnel</th>
                <th className="px-4 py-3.5">Assigned Security Site</th>
                <th className="px-4 py-3.5">Shift Duty</th>
                <th className="px-4 py-3.5">Post Designation</th>
                <th className="px-4 py-3.5">Effective Date</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssignments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-slate-900">{a.guardName || a.employeeName}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">{a.siteName}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      (a.shift || a.shiftName || 'DAY').includes('DAY') || a.shift === 'DAY' ? 'bg-amber-100 text-amber-800' :
                      (a.shift || a.shiftName || '').includes('NIGHT') || a.shift === 'NIGHT' ? 'bg-slate-800 text-white' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {a.shift || a.shiftName || 'DAY'} SHIFT
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 font-medium">{a.postDesignation || a.employeeType || 'General Post'}</td>
                  <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">{a.startDate}</td>
                  <td className="px-6 py-3.5 text-center">
                    <span className="px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deploy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base tracking-tight font-['Space_Grotesk']">
                Deploy Security Guard to Site Post
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Guard Personnel *</label>
                <select
                  value={formData.guardId}
                  onChange={(e) => setFormData({ ...formData, guardId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  {guards.map((guard) => (
                    <option key={guard.id} value={guard.id}>
                      {guard.guardCode || guard.employeeCode} - {guard.fullName} ({guard.rank || guard.designation || guard.employeeType}) {guard.isArmedAuthorized ? '★ ARMED' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Protected Site Location *</label>
                <select
                  value={formData.siteId}
                  onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  {securitySites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.code} - {site.name} ({site.clientName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shift Duty</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="DAY">DAY SHIFT (08:00 - 20:00)</option>
                    <option value="NIGHT">NIGHT SHIFT (20:00 - 08:00)</option>
                    <option value="24_HOUR">24-HOUR CONTINUOUS POST</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Effective Deployment Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Specific Post Designation</label>
                <input
                  type="text"
                  value={formData.postDesignation}
                  onChange={(e) => setFormData({ ...formData, postDesignation: e.target.value })}
                  placeholder="e.g. Main Entrance Gate / Cash Vault Security"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-all"
                >
                  Confirm Deployment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
