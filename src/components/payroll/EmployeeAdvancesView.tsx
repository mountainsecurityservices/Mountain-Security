/**
 * Mountain Security Services (MSS) - ERP Platform
 * EmployeeAdvancesView.tsx (Phase 5 - Guard Loans & Advance Ledger)
 */

import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Calendar,
  X,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { GuardAdvance } from '../../types';

export const EmployeeAdvancesView: React.FC = () => {
  const { company, guards, guardAdvances, createGuardAdvance } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    guardId: guards[0]?.id || '',
    amount: 15000,
    requestDate: new Date().toISOString().substring(0, 10),
    monthlyRecoveryAmount: 5000,
    purpose: 'Medical emergency / Family support',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedGuard = guards.find((g) => g.id === formData.guardId) || guards[0];

    createGuardAdvance({
      guardId: selectedGuard.id,
      guardCode: selectedGuard.guardCode || selectedGuard.employeeCode || 'MSS-GRD-0001',
      guardName: selectedGuard.fullName,
      amount: Number(formData.amount),
      advanceAmount: Number(formData.amount),
      requestDate: formData.requestDate,
      monthlyRecoveryAmount: Number(formData.monthlyRecoveryAmount),
      monthlyDeduction: Number(formData.monthlyRecoveryAmount),
      recoveredAmount: 0,
      repaidAmount: 0,
      remainingBalance: Number(formData.amount),
      outstandingBalance: Number(formData.amount),
      purpose: formData.purpose,
      reason: formData.purpose,
      status: 'APPROVED',
    });

    setIsModalOpen(false);
  };

  const filteredAdvances = guardAdvances.filter((a) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    const guardName = (a.guardName || a.employeeName || '').toLowerCase();
    const purpose = (a.purpose || a.reason || '').toLowerCase();
    return guardName.includes(q) || purpose.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Guard Salary Advances & Loan Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Disburse emergency salary advances, setup monthly recovery schedules, and track remaining balances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Salary Advance</span>
          </button>
        </div>
      </div>

      {/* Advances Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Guard Personnel</th>
                <th className="px-4 py-3.5">Disbursement Date</th>
                <th className="px-4 py-3.5 text-right">Advance Amount</th>
                <th className="px-4 py-3.5 text-right">Monthly Recovery</th>
                <th className="px-4 py-3.5 text-right">Recovered So Far</th>
                <th className="px-4 py-3.5 text-right">Remaining Balance</th>
                <th className="px-4 py-3.5">Purpose</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAdvances.map((adv) => {
                const advAmount = adv.amount || adv.advanceAmount || 0;
                const recovered = adv.recoveredAmount || adv.repaidAmount || 0;
                const monthlyRecovery = adv.monthlyRecoveryAmount || adv.monthlyDeductionAmount || 0;
                const remaining = advAmount - recovered;
                return (
                  <tr key={adv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-900">{adv.guardName || adv.employeeName}</td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">{adv.requestDate || adv.sanctionDate}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">
                      {company.currencySymbol} {advAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-slate-600">
                      {company.currencySymbol} {monthlyRecovery.toLocaleString()} / mo
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-emerald-700 font-semibold">
                      {company.currencySymbol} {recovered.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-black text-rose-600">
                      {company.currencySymbol} {remaining.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs truncate text-slate-600">{adv.purpose || adv.reason || 'Emergency Advance'}</td>
                    <td className="px-6 py-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                        remaining === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {remaining === 0 ? 'CLEARED' : 'RECOVERING'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Advance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base tracking-tight font-['Space_Grotesk']">
                Issue Guard Salary Advance
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
                      {guard.guardCode} - {guard.fullName} (Basic: {company.currencySymbol}{guard.monthlyBasicSalary.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Disbursement Date</label>
                  <input
                    type="date"
                    value={formData.requestDate}
                    onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Advance Principal Amount ({company.currencySymbol})</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Monthly Salary Deduction Recovery ({company.currencySymbol})</label>
                <input
                  type="number"
                  value={formData.monthlyRecoveryAmount}
                  onChange={(e) => setFormData({ ...formData, monthlyRecoveryAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Will be automatically deducted in {Math.ceil(formData.amount / (formData.monthlyRecoveryAmount || 1))} monthly installments.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Advance Purpose / Justification</label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="e.g. Medical emergency / Home repair"
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
                  Approve & Disburse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
