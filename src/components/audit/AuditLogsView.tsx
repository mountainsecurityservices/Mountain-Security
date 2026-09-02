/**
 * Mountain Security Services (MSS) - ERP Platform
 * AuditLogsView.tsx (Phase 8 - Immutable Audit Logs & Security Trails)
 */

import React, { useState } from 'react';
import {
  FileText,
  Search,
  ShieldCheck,
  Clock,
  User,
  Activity,
  Filter,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (moduleFilter !== 'ALL' && log.module !== moduleFilter) return false;
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.userName.toLowerCase().includes(q) ||
      log.module.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono">
              Phase 8 • Immutable Security Logs
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight mt-1">
            System Audit Trail & Compliance Activity
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable chronologically timestamped log of financial vouchers, guard postings, weapons custody, and security events.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-72 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white"
            />
          </div>

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Modules</option>
            <option value="ACCOUNTS">ACCOUNTS & GL</option>
            <option value="CLIENTS">CLIENTS & CONTRACTS</option>
            <option value="OPERATIONS">OPERATIONS & GUARDS</option>
            <option value="PAYROLL">PAYROLL & ADVANCES</option>
            <option value="INVENTORY">ARMORY & INVENTORY</option>
            <option value="SYSTEM">SYSTEM & RESET</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-mono">
          <strong>{filteredLogs.length}</strong> Audit Events Recorded
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Timestamp (UTC)</th>
                <th className="px-4 py-3.5">User / Operator</th>
                <th className="px-4 py-3.5">Module</th>
                <th className="px-4 py-3.5">Action Executed</th>
                <th className="px-6 py-3.5">Audit Trail Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 text-slate-500 text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 font-sans font-bold text-slate-900">
                    {log.userName}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      log.module === 'ACCOUNTS' ? 'bg-emerald-100 text-emerald-800' :
                      log.module === 'OPERATIONS' ? 'bg-blue-100 text-blue-800' :
                      log.module === 'INVENTORY' ? 'bg-purple-100 text-purple-800' :
                      log.module === 'PAYROLL' ? 'bg-amber-100 text-amber-800' :
                      log.module === 'SYSTEM' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {log.module}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">{log.action}</td>
                  <td className="px-6 py-3.5 font-sans text-slate-600 text-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
