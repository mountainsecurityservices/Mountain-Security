/**
 * Mountain Security Services (MSS) - ERP Platform
 * ContractsListView.tsx (Phase 3 - Security SLAs & Contracts)
 */

import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Search,
  Building2,
  Calendar,
  DollarSign,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Contract } from '../../types';

export const ContractsListView: React.FC = () => {
  const { company, contracts, clients, createContract } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Contract>>({
    clientId: clients[0]?.id || '',
    startDate: '2026-09-01',
    endDate: '2027-08-31',
    unarmedGuardsCount: 10,
    armedGuardsCount: 2,
    unarmedRatePerGuard: 35000,
    armedRatePerGuard: 48000,
    billingFrequency: 'MONTHLY',
    status: 'ACTIVE',
  });

  const totalMonthlyValue =
    (Number(formData.unarmedGuardsCount) || 0) * (Number(formData.unarmedRatePerGuard) || 0) +
    (Number(formData.armedGuardsCount) || 0) * (Number(formData.armedRatePerGuard) || 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const count = contracts.length + 1;
    const contractNumber = `CNT-MSS-2026-${String(count).padStart(3, '0')}`;
    const selectedClient = clients.find((c) => c.id === formData.clientId) || clients[0];

    createContract({
      contractNumber,
      title: `${selectedClient.displayName || selectedClient.legalName || selectedClient.name || 'Client'} Security SLA`,
      clientId: selectedClient.id,
      clientName: selectedClient.displayName || selectedClient.legalName || selectedClient.name || 'Client',
      type: 'Monthly Security Services',
      startDate: formData.startDate || '2026-09-01',
      endDate: formData.endDate || '2027-08-31',
      unarmedGuardsCount: Number(formData.unarmedGuardsCount) || 0,
      armedGuardsCount: Number(formData.armedGuardsCount) || 0,
      unarmedRatePerGuard: Number(formData.unarmedRatePerGuard) || 0,
      armedRatePerGuard: Number(formData.armedRatePerGuard) || 0,
      monthlyRate: totalMonthlyValue,
      contractValue: totalMonthlyValue * 12,
      totalMonthlyValue,
      billingMethod: 'Per Guard Billing',
      billingFrequency: 'Monthly',
      noticePeriodDays: 30,
      autoRenewal: true,
      status: 'ACTIVE',
    } as any);

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Security Service Level Agreements (SLAs) & Contracts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active guard deployment agreements, hourly/monthly billing rates, and renewal timelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Draft New Contract</span>
          </button>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Contract #</th>
                <th className="px-4 py-3.5">Client Name</th>
                <th className="px-4 py-3.5">Contract Period</th>
                <th className="px-4 py-3.5 text-center">Unarmed Guards</th>
                <th className="px-4 py-3.5 text-center">Armed Guards</th>
                <th className="px-4 py-3.5 text-right">Monthly Billing</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-mono font-bold text-slate-900">{c.contractNumber}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">{c.clientName}</td>
                  <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                    {c.startDate} to {c.endDate}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="font-bold text-slate-900">{c.unarmedGuardsCount || 0}</span>{' '}
                    <span className="text-slate-400 text-[10px]">(@ {company.currencySymbol}{(c.unarmedRatePerGuard || 35000).toLocaleString()})</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="font-bold text-slate-900">{c.armedGuardsCount || 0}</span>{' '}
                    <span className="text-slate-400 text-[10px]">(@ {company.currencySymbol}{(c.armedRatePerGuard || 48000).toLocaleString()})</span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">
                    {company.currencySymbol} {(c.totalMonthlyValue || c.monthlyRate || c.contractValue || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <span className="px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Contract Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base tracking-tight font-['Space_Grotesk']">
                Draft Security Contract Agreement
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Contracting Client *</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.code} - {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Effective Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry / Renewal Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unarmed Guards Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.unarmedGuardsCount}
                    onChange={(e) => setFormData({ ...formData, unarmedGuardsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unarmed Rate / Guard ({company.currencySymbol})</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.unarmedRatePerGuard}
                    onChange={(e) => setFormData({ ...formData, unarmedRatePerGuard: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Armed Guards Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.armedGuardsCount}
                    onChange={(e) => setFormData({ ...formData, armedGuardsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Armed Rate / Guard ({company.currencySymbol})</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.armedRatePerGuard}
                    onChange={(e) => setFormData({ ...formData, armedRatePerGuard: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-slate-700">Computed Monthly Billing:</span>
                <span className="text-base font-black font-mono text-emerald-700">
                  {company.currencySymbol} {totalMonthlyValue.toLocaleString()} / mo
                </span>
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
                  Save Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
