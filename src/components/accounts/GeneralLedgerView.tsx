/**
 * Mountain Security Services (MSS) - ERP Platform
 * GeneralLedgerView.tsx (Phase 2 - General Ledger & Subledgers)
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Filter,
  Search,
  Printer,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const GeneralLedgerView: React.FC = () => {
  const { company, journalEntries, chartOfAccounts } = useERP();
  const [selectedAccountCode, setSelectedAccountCode] = useState<string>('1121');
  const [fromDate, setFromDate] = useState<string>('2026-09-01');
  const [toDate, setToDate] = useState<string>('2026-09-30');

  const selectedAccount = chartOfAccounts.find((a) => a.code === selectedAccountCode);

  // Filter entries for this account
  const accountEntries = journalEntries
    .flatMap((je) =>
      je.lines
        .filter((line) => line.accountCode === selectedAccountCode)
        .map((line) => ({
          id: `${je.id}-${line.id}`,
          entryNumber: je.entryNumber,
          voucherNumber: je.voucherNumber,
          date: je.date,
          narration: line.description || je.narration,
          debit: line.debit,
          credit: line.credit,
        }))
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let runningBalance = selectedAccount?.balance || 0;
  // Calculate running balances
  let running = 0;
  const ledgerRows = accountEntries.map((row) => {
    if (selectedAccount?.type === 'ASSET' || selectedAccount?.type === 'EXPENSE') {
      running += row.debit - row.credit;
    } else {
      running += row.credit - row.debit;
    }
    return {
      ...row,
      balance: running,
    };
  });

  const totalDebits = accountEntries.reduce((sum, r) => sum + r.debit, 0);
  const totalCredits = accountEntries.reduce((sum, r) => sum + r.credit, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            General Ledger & Account Statements
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-ready statement of accounts with running balance tracking and voucher cross-references.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Account Statement</span>
          </button>
        </div>
      </div>

      {/* Account Selector & Date Range Filter */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Select General Ledger Account</label>
          <select
            value={selectedAccountCode}
            onChange={(e) => setSelectedAccountCode(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
          >
            {chartOfAccounts
              .filter((a) => a.isPostable)
              .map((acc) => (
                <option key={acc.code} value={acc.code}>
                  {acc.code} - {acc.name} ({acc.type})
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Statement Header Card */}
      <div className="p-5 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
            ACCOUNT CODE: {selectedAccount?.code} ({selectedAccount?.type})
          </span>
          <h3 className="text-lg font-black font-['Space_Grotesk'] mt-0.5">
            {selectedAccount?.name}
          </h3>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Total Debits</p>
            <p className="text-base font-bold font-mono text-emerald-400">
              {company.currencySymbol} {totalDebits.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Total Credits</p>
            <p className="text-base font-bold font-mono text-rose-400">
              {company.currencySymbol} {totalCredits.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Net Ending Balance</p>
            <p className="text-lg font-black font-mono text-white">
              {company.currencySymbol} {running.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-4 py-3.5">Voucher #</th>
                <th className="px-4 py-3.5">GL Entry #</th>
                <th className="px-4 py-3.5">Particulars / Narration</th>
                <th className="px-4 py-3.5 text-right">Debit ({company.currencySymbol})</th>
                <th className="px-4 py-3.5 text-right">Credit ({company.currencySymbol})</th>
                <th className="px-6 py-3.5 text-right">Running Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ledgerRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No posted journal transactions recorded for this account in the selected period.
                  </td>
                </tr>
              ) : (
                ledgerRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3.5 text-slate-500 font-mono">{row.date}</td>
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{row.voucherNumber || '—'}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-500">{row.entryNumber}</td>
                    <td className="px-4 py-3.5 text-slate-800 font-medium">{row.narration}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">
                      {row.debit > 0 ? row.debit.toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">
                      {row.credit > 0 ? row.credit.toLocaleString() : '—'}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-black text-slate-900">
                      {company.currencySymbol} {row.balance.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
