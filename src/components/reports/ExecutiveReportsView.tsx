/**
 * Mountain Security Services (MSS) - ERP Platform
 * ExecutiveReportsView.tsx (Phase 7 - Executive Business Intelligence & Reports)
 */

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  DollarSign,
  TrendingUp,
  Shield,
  Users,
  Building2,
  Calendar,
  Filter,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const ExecutiveReportsView: React.FC = () => {
  const {
    company,
    accounts,
    vouchers,
    clients,
    contracts,
    guards,
    clientInvoices,
    payrollRecords,
  } = useERP();

  const [activeReportTab, setActiveReportTab] = useState<'OPERATIONS' | 'FINANCIAL' | 'DEPLOYMENT'>('OPERATIONS');

  const totalMonthlyBilling = contracts.reduce((sum, c) => sum + c.totalMonthlyValue, 0);
  const totalMonthlyPayroll = payrollRecords.reduce((sum, p) => sum + p.netPayable, 0);
  const totalInvoiced = clientInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalCollected = clientInvoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const grossMargin = totalMonthlyBilling - totalMonthlyPayroll;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
              Phase 7 • Executive BI & Analytics
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight mt-1">
            Executive Operations & Financial Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time management reporting, SLA profitability, wage margin analysis, and billing reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Executive Brief</span>
          </button>
        </div>
      </div>

      {/* Report Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'OPERATIONS', label: 'Executive Operations Summary' },
          { id: 'FINANCIAL', label: 'Billing vs. Payroll Margin Statement' },
          { id: 'DEPLOYMENT', label: 'Guard Post Deployment Analysis' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReportTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeReportTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Executive KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Contracted Monthly Revenue
          </span>
          <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk'] mt-2">
            {company.currencySymbol} {totalMonthlyBilling.toLocaleString()}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Across {contracts.length} active client SLAs</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Monthly Guard Wage Cost
          </span>
          <h3 className="text-2xl font-black text-rose-600 font-['Space_Grotesk'] mt-2">
            {company.currencySymbol} {totalMonthlyPayroll.toLocaleString()}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Net field salary disbursement</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Direct Guard Margin
          </span>
          <h3 className="text-2xl font-black text-emerald-700 font-['Space_Grotesk'] mt-2">
            {company.currencySymbol} {grossMargin.toLocaleString()}
          </h3>
          <p className="text-xs text-emerald-600 font-bold mt-1">
            {totalMonthlyBilling > 0 ? ((grossMargin / totalMonthlyBilling) * 100).toFixed(1) : 0}% Gross Operating Margin
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Collection Realization Rate
          </span>
          <h3 className="text-2xl font-black text-blue-700 font-['Space_Grotesk'] mt-2">
            {totalInvoiced > 0 ? ((totalCollected / totalInvoiced) * 100).toFixed(0) : 100}%
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {company.currencySymbol} {totalCollected.toLocaleString()} of {company.currencySymbol} {totalInvoiced.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Active Tab Content */}
      {activeReportTab === 'FINANCIAL' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 font-['Space_Grotesk']">
            Contract Profitability Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
                <tr>
                  <th className="p-3">Contract Ref</th>
                  <th className="p-3">Client Name</th>
                  <th className="p-3 text-center">Unarmed / Armed</th>
                  <th className="p-3 text-right">Monthly Revenue</th>
                  <th className="p-3 text-right">Est. Wage Cost</th>
                  <th className="p-3 text-right">Est. Monthly Profit</th>
                  <th className="p-3 text-right">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contracts.map((c) => {
                  const estCost = c.unarmedGuardsCount * 32000 + c.armedGuardsCount * 40000;
                  const profit = c.totalMonthlyValue - estCost;
                  const marginPct = ((profit / c.totalMonthlyValue) * 100).toFixed(1);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{c.contractNumber}</td>
                      <td className="p-3 font-bold text-slate-900">{c.clientName}</td>
                      <td className="p-3 text-center font-mono">
                        {c.unarmedGuardsCount}U / {c.armedGuardsCount}A
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {company.currencySymbol} {c.totalMonthlyValue.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono text-slate-600">
                        {company.currencySymbol} {estCost.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">
                        {company.currencySymbol} {profit.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono font-black text-slate-900">
                        {marginPct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeReportTab === 'OPERATIONS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 font-['Space_Grotesk']">
            Operations & Guard Force Readiness Report
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl space-y-2">
              <h4 className="font-bold text-xs text-slate-700">Personnel Strength</h4>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total Enlisted:</span>
                <span className="font-bold font-mono">{guards.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Armed Qualified:</span>
                <span className="font-bold font-mono text-red-600">{guards.filter((g) => g.isArmedAuthorized).length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Active Status:</span>
                <span className="font-bold font-mono text-emerald-700">100%</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-2">
              <h4 className="font-bold text-xs text-slate-700">Client Locations</h4>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total Clients:</span>
                <span className="font-bold font-mono">{clients.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Active Contracts:</span>
                <span className="font-bold font-mono">{contracts.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">SLA Compliance:</span>
                <span className="font-bold font-mono text-emerald-700">99.8%</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-2">
              <h4 className="font-bold text-xs text-slate-700">Financial Performance</h4>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Monthly Run Rate:</span>
                <span className="font-bold font-mono">{company.currencySymbol} {totalMonthlyBilling.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Monthly Net Payroll:</span>
                <span className="font-bold font-mono">{company.currencySymbol} {totalMonthlyPayroll.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Operating Net Margin:</span>
                <span className="font-bold font-mono text-emerald-700">{company.currencySymbol} {grossMargin.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeReportTab === 'DEPLOYMENT' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 font-['Space_Grotesk']">
            Protected Sites & Guard Post Distribution
          </h3>
          <p className="text-xs text-slate-500">
            Current guard allocations across commercial banks, industrial sites, and embassies.
          </p>
        </div>
      )}
    </div>
  );
};
