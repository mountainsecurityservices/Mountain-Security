/**
 * Mountain Security Services (MSS) - ERP Platform
 * ChartOfAccountsView.tsx (Phase 2 - Chart of Accounts Tree & Master)
 */

import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Folder,
  FileCode,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { AccountType, ChartOfAccount } from '../../types';

export const ChartOfAccountsView: React.FC = () => {
  const { company, chartOfAccounts } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredAccounts = chartOfAccounts.filter((acc) => {
    if (selectedType !== 'ALL' && acc.type !== selectedType) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return acc.code.toLowerCase().includes(q) || acc.name.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Chart of Accounts Master Hierarchy
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            5-tier standard accounting tree (Assets, Liabilities, Equity, Revenue, Expenses).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold font-mono">
            {chartOfAccounts.length} Total Accounts
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search account code or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-64 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {['ALL', 'ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedType === t
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Account Code</th>
                <th className="px-4 py-3.5">Account Title</th>
                <th className="px-4 py-3.5">Account Type</th>
                <th className="px-4 py-3.5 text-center">Postable</th>
                <th className="px-4 py-3.5">Level</th>
                <th className="px-6 py-3.5 text-right">Current Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.map((acc) => (
                <tr
                  key={acc.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    !acc.isPostable ? 'bg-slate-50/40 font-bold' : ''
                  }`}
                >
                  <td className="px-6 py-3 font-mono font-bold text-slate-900">
                    <span style={{ marginLeft: `${(acc.level - 1) * 16}px` }} className="inline-flex items-center gap-1.5">
                      {!acc.isPostable ? (
                        <Folder className="w-3.5 h-3.5 text-amber-500" />
                      ) : (
                        <FileCode className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      {acc.code}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-900">{acc.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      acc.type === 'ASSET' ? 'bg-blue-100 text-blue-800' :
                      acc.type === 'LIABILITY' ? 'bg-rose-100 text-rose-800' :
                      acc.type === 'EQUITY' ? 'bg-purple-100 text-purple-800' :
                      acc.type === 'REVENUE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {acc.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {acc.isPostable ? (
                      <span className="text-emerald-600 font-bold text-[10px]">YES</span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">HEADER</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">Level {acc.level}</td>
                  <td className="px-6 py-3 text-right font-mono font-bold text-slate-900">
                    {company.currencySymbol} {acc.balance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
