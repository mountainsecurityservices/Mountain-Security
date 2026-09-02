/**
 * Mountain Security Services (MSS) - ERP Platform
 * OvertimeManagementView.tsx (Phase 4 - Overtime Claims & Approvals)
 */

import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Shield,
  DollarSign,
  AlertCircle,
  X,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { OvertimeRecord } from '../../types';

export const OvertimeManagementView: React.FC = () => {
  const { guards, securitySites, overtimeRecords, recordOvertime, approveOvertime } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    guardId: guards[0]?.id || '',
    siteId: securitySites[0]?.id || '',
    date: new Date().toISOString().substring(0, 10),
    hours: 4,
    hourlyRate: 200,
    reason: 'Relief guard delay / emergency extended shift coverage.',
  });

  const totalAmount = formData.hours * formData.hourlyRate;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedGuard = guards.find((g) => g.id === formData.guardId) || guards[0];
    const selectedSite = securitySites.find((s) => s.id === formData.siteId) || securitySites[0];

    recordOvertime({
      guardId: selectedGuard.id,
      guardName: selectedGuard.fullName,
      siteId: selectedSite.id,
      siteName: selectedSite.name,
      date: formData.date,
      hours: Number(formData.hours),
      hourlyRate: Number(formData.hourlyRate),
      totalAmount,
      reason: formData.reason,
      status: 'PENDING',
    });

    setIsModalOpen(false);
  };

  const filteredRecords = overtimeRecords.filter((o) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    const guardName = (o.guardName || o.employeeName || '').toLowerCase();
    const siteName = (o.siteName || '').toLowerCase();
    const reason = (o.reason || '').toLowerCase();
    return (
      guardName.includes(q) ||
      siteName.includes(q) ||
      reason.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Overtime Claims & Double-Shift Approvals
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log extended hours, emergency site coverage, supervisor verification, and payroll calculation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Log Overtime Claim</span>
          </button>
        </div>
      </div>

      {/* Overtime Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Guard Personnel</th>
                <th className="px-4 py-3.5">Security Site</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5 text-center">Hours</th>
                <th className="px-4 py-3.5 text-right">Hourly Rate</th>
                <th className="px-4 py-3.5 text-right">Total Amount</th>
                <th className="px-4 py-3.5">Reason</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-slate-900">{rec.guardName || rec.employeeName}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">{rec.siteName}</td>
                  <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">{rec.date}</td>
                  <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-900">{rec.hours || rec.approvedOvertimeHours || rec.eligibleOvertimeHours || 0} hrs</td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-600">PKR {rec.hourlyRate || rec.ratePerHour || 250}</td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">
                    PKR {(rec.totalAmount || rec.overtimeAmount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 max-w-xs truncate text-slate-600">{rec.reason || 'Extra site coverage'}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                      rec.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    {rec.status === 'PENDING' && (
                      <button
                        type="button"
                        onClick={() => approveOvertime(rec.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px]"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base tracking-tight font-['Space_Grotesk']">
                Log Guard Overtime Claim
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Guard Personnel *</label>
                <select
                  value={formData.guardId}
                  onChange={(e) => setFormData({ ...formData, guardId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  {guards.map((guard) => (
                    <option key={guard.id} value={guard.id}>
                      {guard.guardCode} - {guard.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Protected Site *</label>
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

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hours Claimed</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hourly Rate (PKR)</label>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between font-mono">
                <span className="text-slate-600 font-sans">Total Claim Compensation:</span>
                <span className="font-bold text-sm text-slate-900">PKR {totalAmount.toLocaleString()}</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Extended Duty</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g. Relief guard late / VIP event extra guard coverage"
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
                  Log Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
