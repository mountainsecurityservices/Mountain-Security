/**
 * Mountain Security Services (MSS) - ERP Platform
 * AccountsDashboard.tsx (Phase 2 - Financial Command Center)
 */

import React from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  BookOpen,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const AccountsDashboard: React.FC = () => {
  const {
    company,
    chartOfAccounts,
    vouchers,
    journalEntries,
    cashAccounts,
    bankAccounts,
    setActiveTab,
  } = useERP();

  const totalBankBalance = bankAccounts.reduce((sum, b) => sum + b.currentBalance, 0);
  const totalCashBalance = cashAccounts.reduce((sum, c) => sum + c.currentBalance, 0);
  const totalLiquidity = totalBankBalance + totalCashBalance;

  const totalReceivables = chartOfAccounts.find((a) => a.code === '1130')?.balance || 1840000;
  const totalPayables = chartOfAccounts.find((a) => a.code === '2110')?.balance || 420000;

  const postedVouchersCount = vouchers.filter((v) => v.status === 'POSTED').length;
  const draftVouchersCount = vouchers.filter((v) => v.status === 'DRAFT' || v.status === 'APPROVED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              Phase 2 • Double-Entry Accounts
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight mt-1">
            Accounts & Financial Command Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Double-entry General Ledger, Cash/Bank books, Voucher posting, and financial statements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('vouchers')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span>Manage Vouchers (PV/RV/JV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Total Liquidity (Cash + Bank)
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {company.currencySymbol} {totalLiquidity.toLocaleString()}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{bankAccounts.length} Bank & {cashAccounts.length} Cash Accounts</span>
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Accounts Receivable (AR)
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {company.currencySymbol} {totalReceivables.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Outstanding client guarding invoices
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Accounts Payable (AP)
            </span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {company.currencySymbol} {totalPayables.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Uniform & tactical gear suppliers
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              GL Entries & Vouchers
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {journalEntries.length} Posted
            </h3>
            <p className="text-xs text-amber-600 font-semibold flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{draftVouchersCount} pending approval / post</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { id: 'chart-of-accounts', label: 'Chart of Accounts', icon: <Building2 className="w-4 h-4" /> },
          { id: 'vouchers', label: 'Voucher Engine', icon: <Receipt className="w-4 h-4" /> },
          { id: 'general-ledger', label: 'General Ledger', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'cash-management', label: 'Cash Management', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'bank-management', label: 'Bank Accounts', icon: <CreditCard className="w-4 h-4" /> },
          { id: 'financial-reports', label: 'Financial Reports', icon: <FileSpreadsheet className="w-4 h-4" /> },
        ].map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => setActiveTab(btn.id)}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-xs text-left transition-all group"
          >
            <div className="p-2.5 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 rounded-xl w-fit transition-colors">
              {btn.icon}
            </div>
            <p className="text-xs font-bold text-slate-900 mt-3">{btn.label}</p>
          </button>
        ))}
      </div>

      {/* Recent Posted Vouchers */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-slate-600" />
            <h3 className="font-bold text-sm text-slate-900">Recent Accounting Vouchers</h3>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('vouchers')}
            className="text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            View All Vouchers →
          </button>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              <tr>
                <th className="px-6 py-3">Voucher #</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Payee / Narration</th>
                <th className="px-4 py-3 text-right">Debit</th>
                <th className="px-4 py-3 text-right">Credit</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vouchers.slice(0, 5).map((vch) => (
                <tr key={vch.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-3 font-mono font-bold text-slate-900">{vch.voucherNumber}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      vch.type === 'PV' ? 'bg-rose-100 text-rose-800' :
                      vch.type === 'RV' ? 'bg-emerald-100 text-emerald-800' :
                      vch.type === 'JV' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {vch.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{vch.date}</td>
                  <td className="px-4 py-3 max-w-xs truncate text-slate-700 font-medium">
                    {vch.payeePayer ? <span className="font-bold">{vch.payeePayer}: </span> : null}
                    {vch.narration}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                    {company.currencySymbol} {vch.totalDebit.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                    {company.currencySymbol} {vch.totalCredit.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      vch.status === 'POSTED' ? 'bg-emerald-100 text-emerald-800' :
                      vch.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                      vch.status === 'REVERSED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {vch.status}
                    </span>
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
