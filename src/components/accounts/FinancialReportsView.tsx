/**
 * Mountain Security Services (MSS) - ERP Platform
 * FinancialReportsView.tsx (Phase 2 - Financial Statements Engine)
 */

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  Building2,
  TrendingUp,
  Scale,
  DollarSign,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const FinancialReportsView: React.FC = () => {
  const { company, chartOfAccounts } = useERP();
  const [reportType, setReportType] = useState<'TRIAL_BALANCE' | 'PROFIT_LOSS' | 'BALANCE_SHEET'>('TRIAL_BALANCE');

  // Compute Assets, Liabilities, Equity, Revenue, Expense totals
  const assets = chartOfAccounts.filter((a) => a.type === 'ASSET');
  const liabilities = chartOfAccounts.filter((a) => a.type === 'LIABILITY');
  const equity = chartOfAccounts.filter((a) => a.type === 'EQUITY');
  const revenue = chartOfAccounts.filter((a) => a.type === 'REVENUE');
  const expenses = chartOfAccounts.filter((a) => a.type === 'EXPENSE');

  const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0);
  const totalEquity = equity.reduce((sum, a) => sum + a.balance, 0);
  const totalRevenue = revenue.reduce((sum, a) => sum + a.balance, 0);
  const totalExpenses = expenses.reduce((sum, a) => sum + a.balance, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Financial Statements & Reporting Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-ready Trial Balance, Income Statement (P&L), and Balance Sheet.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex bg-slate-200/70 p-1.5 rounded-2xl w-fit gap-1">
        <button
          type="button"
          onClick={() => setReportType('TRIAL_BALANCE')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            reportType === 'TRIAL_BALANCE'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Trial Balance
        </button>
        <button
          type="button"
          onClick={() => setReportType('PROFIT_LOSS')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            reportType === 'PROFIT_LOSS'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Profit & Loss Statement (P&L)
        </button>
        <button
          type="button"
          onClick={() => setReportType('BALANCE_SHEET')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            reportType === 'BALANCE_SHEET'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Balance Sheet
        </button>
      </div>

      {/* REPORT CONTENT */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="text-center border-b border-slate-200 pb-5">
          <h3 className="text-lg font-black text-slate-900 font-['Space_Grotesk']">
            {company.officialName}
          </h3>
          <p className="text-xs font-bold uppercase tracking-wider text-red-600 font-mono mt-0.5">
            {reportType === 'TRIAL_BALANCE' && 'General Ledger Trial Balance'}
            {reportType === 'PROFIT_LOSS' && 'Statement of Comprehensive Income (Profit & Loss)'}
            {reportType === 'BALANCE_SHEET' && 'Statement of Financial Position (Balance Sheet)'}
          </p>
          <p className="text-xs text-slate-500 font-mono mt-1">
            As of September 2026 • Currency: {company.currency} ({company.currencySymbol})
          </p>
        </div>

        {/* 1. TRIAL BALANCE */}
        {reportType === 'TRIAL_BALANCE' && (
          <div className="space-y-4">
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Account Code</th>
                    <th className="px-4 py-3">Account Title</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3 text-right">Debit Balance ({company.currencySymbol})</th>
                    <th className="px-4 py-3 text-right">Credit Balance ({company.currencySymbol})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {chartOfAccounts
                    .filter((a) => a.balance > 0)
                    .map((acc) => {
                      const isDebit = acc.type === 'ASSET' || acc.type === 'EXPENSE';
                      return (
                        <tr key={acc.code} className="hover:bg-slate-50">
                          <td className="px-4 py-2.5 font-mono font-bold text-slate-900">{acc.code}</td>
                          <td className="px-4 py-2.5 text-slate-900">{acc.name}</td>
                          <td className="px-4 py-2.5">
                            <span className="font-mono text-[10px] text-slate-500">{acc.type}</span>
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono font-bold">
                            {isDebit ? acc.balance.toLocaleString() : '—'}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono font-bold">
                            {!isDebit ? acc.balance.toLocaleString() : '—'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
                <tfoot className="bg-slate-900 text-white font-mono font-bold text-xs">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 uppercase tracking-wider">
                      Total Trial Balance:
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-black">
                      {company.currencySymbol} {(totalAssets + totalExpenses).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-black">
                      {company.currencySymbol} {(totalLiabilities + totalEquity + totalRevenue).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* 2. PROFIT & LOSS */}
        {reportType === 'PROFIT_LOSS' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Operating Revenue */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center justify-between border-b border-slate-200 pb-1">
                <span>Operating Revenue</span>
                <span>Amount ({company.currencySymbol})</span>
              </h4>
              <div className="space-y-1.5 text-xs">
                {revenue.map((r) => (
                  <div key={r.code} className="flex items-center justify-between py-1 hover:bg-slate-50 px-2 rounded">
                    <span className="text-slate-800">{r.code} - {r.name}</span>
                    <span className="font-mono font-bold">{r.balance.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between font-bold text-sm pt-2 border-t border-slate-200 px-2">
                  <span>Total Operating Revenue:</span>
                  <span className="font-mono text-emerald-700">{company.currencySymbol} {totalRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Operating Expenses */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center justify-between border-b border-slate-200 pb-1">
                <span>Operating & Guarding Expenses</span>
                <span>Amount ({company.currencySymbol})</span>
              </h4>
              <div className="space-y-1.5 text-xs">
                {expenses.map((e) => (
                  <div key={e.code} className="flex items-center justify-between py-1 hover:bg-slate-50 px-2 rounded">
                    <span className="text-slate-800">{e.code} - {e.name}</span>
                    <span className="font-mono font-bold">{e.balance.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between font-bold text-sm pt-2 border-t border-slate-200 px-2">
                  <span>Total Operating Expenses:</span>
                  <span className="font-mono text-rose-700">{company.currencySymbol} {totalExpenses.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Net Income Summary Card */}
            <div className="p-5 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Net Operating Profit / (Loss)
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Revenue minus direct & overhead costs
                </p>
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                {company.currencySymbol} {netProfit.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* 3. BALANCE SHEET */}
        {reportType === 'BALANCE_SHEET' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Assets */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center justify-between border-b border-slate-200 pb-1">
                <span>Current & Fixed Assets</span>
                <span>Amount ({company.currencySymbol})</span>
              </h4>
              <div className="space-y-1.5 text-xs">
                {assets.map((a) => (
                  <div key={a.code} className="flex items-center justify-between py-1 hover:bg-slate-50 px-2 rounded">
                    <span className="text-slate-800">{a.code} - {a.name}</span>
                    <span className="font-mono font-bold">{a.balance.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between font-bold text-sm pt-2 border-t border-slate-200 px-2">
                  <span>Total Assets:</span>
                  <span className="font-mono text-slate-900">{company.currencySymbol} {totalAssets.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Liabilities & Equity */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center justify-between border-b border-slate-200 pb-1">
                <span>Liabilities & Shareholder Equity</span>
                <span>Amount ({company.currencySymbol})</span>
              </h4>
              <div className="space-y-1.5 text-xs">
                {liabilities.map((l) => (
                  <div key={l.code} className="flex items-center justify-between py-1 hover:bg-slate-50 px-2 rounded">
                    <span className="text-slate-800">{l.code} - {l.name}</span>
                    <span className="font-mono font-bold">{l.balance.toLocaleString()}</span>
                  </div>
                ))}
                {equity.map((eq) => (
                  <div key={eq.code} className="flex items-center justify-between py-1 hover:bg-slate-50 px-2 rounded">
                    <span className="text-slate-800">{eq.code} - {eq.name}</span>
                    <span className="font-mono font-bold">{eq.balance.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between font-bold text-sm pt-2 border-t border-slate-200 px-2">
                  <span>Total Liabilities & Equity:</span>
                  <span className="font-mono text-slate-900">{company.currencySymbol} {(totalLiabilities + totalEquity).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
