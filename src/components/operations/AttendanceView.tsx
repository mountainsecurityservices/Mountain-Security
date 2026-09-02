/**
 * Mountain Security Services (MSS) - ERP Platform
 * AttendanceView.tsx (Phase 4 - Attendance & Roll Call Logs)
 */

import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Shield,
  X,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { AttendanceRecord } from '../../types';

export const AttendanceView: React.FC = () => {
  const { guards, securitySites, attendanceRecords, recordAttendance } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    guardId: guards[0]?.id || '',
    siteId: securitySites[0]?.id || '',
    date: new Date().toISOString().substring(0, 10),
    shift: 'DAY',
    status: 'PRESENT' as const,
    checkInTime: '08:00',
    checkOutTime: '20:00',
    notes: 'Regular on-time reporting.',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedGuard = guards.find((g) => g.id === formData.guardId) || guards[0];
    const selectedSite = securitySites.find((s) => s.id === formData.siteId) || securitySites[0];

    recordAttendance({
      employeeId: selectedGuard.id,
      employeeCode: (selectedGuard as any).employeeCode || (selectedGuard as any).guardCode || 'MSS-001',
      employeeName: selectedGuard.fullName,
      employeeType: 'Security Guard',
      guardId: selectedGuard.id,
      guardName: selectedGuard.fullName,
      siteId: selectedSite.id,
      siteName: selectedSite.name,
      shiftId: formData.shift,
      shiftName: formData.shift === 'DAY' ? 'Day Shift (12h)' : 'Night Shift (12h)',
      scheduledStart: formData.checkInTime,
      scheduledEnd: formData.checkOutTime,
      date: formData.date,
      shift: formData.shift as any,
      status: formData.status as any,
      checkInTime: formData.checkInTime,
      checkOutTime: formData.checkOutTime,
      verifiedBySupervisor: true,
      supervisorName: 'Command Centre Incharge',
      source: 'MANUAL_ENTRY',
      notes: formData.notes,
    });

    setIsModalOpen(false);
  };

  const filteredAttendance = attendanceRecords.filter((a) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    const guardName = (a.guardName || a.employeeName || '').toLowerCase();
    const siteName = (a.siteName || '').toLowerCase();
    return (
      guardName.includes(q) ||
      siteName.includes(q) ||
      a.date.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Guard Attendance & Shift Roll Call
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily site check-ins, biometric time records, late tracking, and excused leaves.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Mark Guard Attendance</span>
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Guard Personnel</th>
                <th className="px-4 py-3.5">Security Site</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Shift</th>
                <th className="px-4 py-3.5">Check-In / Out</th>
                <th className="px-4 py-3.5">Remarks</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-slate-900">{rec.guardName || rec.employeeName}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">{rec.siteName}</td>
                  <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">{rec.date}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-100 text-slate-800">
                      {rec.shift || rec.shiftName || 'Day Shift'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-600">
                    {rec.checkInTime || '—'} - {rec.checkOutTime || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{rec.notes || '—'}</td>
                  <td className="px-6 py-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                      rec.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' :
                      rec.status === 'LATE' ? 'bg-amber-100 text-amber-800' :
                      rec.status === 'ON LEAVE' || (rec.status as string) === 'LEAVE' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Attendance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base tracking-tight font-['Space_Grotesk']">
                Record Guard Site Attendance
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
                <label className="block font-bold text-slate-700 mb-1">Protected Site Location *</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Attendance Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value="PRESENT">PRESENT (On Duty)</option>
                    <option value="LATE">LATE REPORTING</option>
                    <option value="ABSENT">UNEXCUSED ABSENCE</option>
                    <option value="LEAVE">AUTHORIZED LEAVE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Check-In Time</label>
                  <input
                    type="time"
                    value={formData.checkInTime}
                    onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Check-Out Time</label>
                  <input
                    type="time"
                    value={formData.checkOutTime}
                    onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Supervisor Notes / Remarks</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Relieved Guard Subedar Riaz on time"
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
                  Submit Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
