/**
 * Mountain Security Services (MSS) - ERP Platform
 * PayrollDashboard.tsx (Phase 5 - Guard & Staff Payroll Command Center)
 */

import React from 'react';
import {
  DollarSign,
  Users,
  CreditCard,
  TrendingUp,
  Receipt,
  FileCheck,
  Clock,
  Printer,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const PayrollDashboard: React.FC = () => {
  const {
    company,
    guards,
    payrollRecords,
    guardAdvances,
    overtimeRecords,
    setActiveTab,
  } = useERP();

  const totalPayrollGross = payrollRecords.reduce((sum, p) => sum + (p.grossSalary || p.grossEarned || 0), 0);
  const totalPayrollNet = payrollRecords.reduce((sum, p) => sum + (p.netPayable || p.netDisbursed || 0), 0);
  const totalAdvancesOutstanding = guardAdvances
    .filter((a) => a.status === 'APPROVED')
    .reduce((sum, a) => {
      const amt = a.amount || a.advanceAmount || 0;
      const rec = a.recoveredAmount || a.repaidAmount || 0;
      return sum + (amt - rec);
    }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              Phase 5 • Salary & Deductions Processing
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight mt-1">
            Payroll, Advances & Wage Disbursements
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated monthly guard salary engine, salary advances, uniform deductions, and direct bank transfers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('payroll-processing')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span>Process Monthly Payroll</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Total Net Salary Disbursement
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {company.currencySymbol} {totalPayrollNet.toLocaleString()}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              For {payrollRecords.length} Guard & Field Staff Personnel
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Outstanding Guard Advances
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {company.currencySymbol} {totalAdvancesOutstanding.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Recoverable via salary deductions
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Total Overtime Earned
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {company.currencySymbol}{' '}
              {payrollRecords.reduce((sum, p) => sum + p.overtimeAmount, 0).toLocaleString()}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Double-shift and emergency guard coverage
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Statutory EOBI / Social Sec.
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {company.currencySymbol}{' '}
              {payrollRecords.reduce((sum, p) => sum + (p.eobiDeduction || p.eobi || 0), 0).toLocaleString()}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Compliance contribution deductions
            </p>
          </div>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setActiveTab('payroll-processing')}
          className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-xs text-left flex items-start gap-4 transition-all group"
        >
          <div className="p-3 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white text-emerald-600 rounded-xl transition-colors">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Monthly Payroll Run & Payslips</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Calculate basic wages, overtime, advance deductions, and print individual salary slips.
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('employee-advances')}
          className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-xs text-left flex items-start gap-4 transition-all group"
        >
          <div className="p-3 bg-amber-50 group-hover:bg-amber-600 group-hover:text-white text-amber-600 rounded-xl transition-colors">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Guard Advances & Loans</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Disburse emergency salary advances, schedule installments, and track repayment ledger.
            </p>
          </div>
        </button>
      </div>

      {/* Payroll Snapshot Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Current Month Payroll Summary (September 2026)</h3>
          <button
            type="button"
            onClick={() => setActiveTab('payroll-processing')}
            className="text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            Manage All Payslips →
          </button>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Guard Name</th>
                <th className="px-4 py-3 text-right">Basic Wage</th>
                <th className="px-4 py-3 text-right">Overtime</th>
                <th className="px-4 py-3 text-right">Gross Salary</th>
                <th className="px-4 py-3 text-right">Advance Ded.</th>
                <th className="px-4 py-3 text-right">Net Payable</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payrollRecords.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 font-bold text-slate-900">{p.employeeName || p.guardName}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-700">
                    {company.currencySymbol} {(p.basicSalary || p.monthlyBasicSalary || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-600 font-semibold">
                    +{company.currencySymbol} {(p.overtimeAmount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                    {company.currencySymbol} {(p.grossSalary || p.grossEarned || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-rose-600 font-semibold">
                    -{company.currencySymbol} {(p.advanceDeduction || p.advanceRecovery || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-black text-emerald-700">
                    {company.currencySymbol} {(p.netPayable || p.netDisbursed || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      {p.status}
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
