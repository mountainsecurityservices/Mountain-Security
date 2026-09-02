/**
 * Mountain Security Services (MSS) - ERP Platform
 * PayrollProcessingView.tsx (Phase 5 - Salary Processing & Payslip Generator)
 */

import React, { useState } from 'react';
import {
  Receipt,
  Printer,
  Search,
  CheckCircle2,
  DollarSign,
  Building2,
  Calendar,
  X,
  CreditCard,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { PayrollRecord } from '../../types';

export const PayrollProcessingView: React.FC = () => {
  const { company, payrollRecords, guards } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);

  const filteredRecords = payrollRecords.filter((p) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    const employeeName = (p.employeeName || p.guardName || '').toLowerCase();
    const month = (p.month || p.period || '').toLowerCase();
    return employeeName.includes(q) || month.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Guard Salary Slips & Monthly Payroll Run
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit monthly guard compensation, allowances, deductions, and generate printable salary payslips.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Master Payroll Sheet</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guard name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-72 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white"
          />
        </div>
        <span className="text-xs text-slate-500 font-mono">
          Month: <strong>September 2026</strong> • {filteredRecords.length} Guard Payslips
        </span>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Guard Personnel</th>
                <th className="px-4 py-3.5 text-right">Basic Wage</th>
                <th className="px-4 py-3.5 text-right">Allowances</th>
                <th className="px-4 py-3.5 text-right">Overtime</th>
                <th className="px-4 py-3.5 text-right">Gross Salary</th>
                <th className="px-4 py-3.5 text-right">Advance Ded.</th>
                <th className="px-4 py-3.5 text-right">EOBI Ded.</th>
                <th className="px-4 py-3.5 text-right">Net Payable</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-slate-900">{p.employeeName || p.guardName}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-700">
                    {company.currencySymbol} {(p.basicSalary || p.monthlyBasicSalary || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-700">
                    {company.currencySymbol} {(p.allowances || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-emerald-600 font-semibold">
                    +{company.currencySymbol} {(p.overtimeAmount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">
                    {company.currencySymbol} {(p.grossSalary || p.grossEarned || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-rose-600 font-semibold">
                    -{company.currencySymbol} {(p.advanceDeduction || p.advanceRecovery || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-rose-600 font-semibold">
                    -{company.currencySymbol} {(p.eobiDeduction || p.eobi || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-black text-emerald-700 text-sm">
                    {company.currencySymbol} {(p.netPayable || p.netDisbursed || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedPayslip(p)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[11px] inline-flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Payslip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Printable Payslip Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 font-['Space_Grotesk']">
                  {company.officialName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  CONFIDENTIAL EMPLOYEE SALARY SLIP • {selectedPayslip.month}
                </p>
              </div>
              <button onClick={() => setSelectedPayslip(null)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl">
              <div>
                <p className="text-slate-400 font-mono">GUARD NAME</p>
                <p className="font-extrabold text-slate-900 text-sm">{selectedPayslip.employeeName || selectedPayslip.guardName}</p>
              </div>
              <div>
                <p className="text-slate-400 font-mono">PAY PERIOD</p>
                <p className="font-bold text-slate-900">{selectedPayslip.month || 'Current Month'}</p>
              </div>
              <div>
                <p className="text-slate-400 font-mono">DAYS WORKED</p>
                <p className="font-bold text-slate-900">{selectedPayslip.daysWorked || selectedPayslip.dutyDays || 30} Days (Full Month)</p>
              </div>
              <div>
                <p className="text-slate-400 font-mono">DISBURSEMENT METHOD</p>
                <p className="font-bold text-emerald-700">{selectedPayslip.paymentMethod || 'Direct Bank Transfer'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-xs">
              {/* Earnings */}
              <div className="space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-200 pb-1">
                  Earnings & Allowances
                </h4>
                <div className="flex justify-between">
                  <span className="text-slate-600">Basic Monthly Wage:</span>
                  <span className="font-mono font-bold">{company.currencySymbol} {(selectedPayslip.basicSalary || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Duty Allowances:</span>
                  <span className="font-mono font-bold">{company.currencySymbol} {(selectedPayslip.allowances || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Overtime Compensation:</span>
                  <span className="font-mono font-bold text-emerald-700">+{company.currencySymbol} {(selectedPayslip.overtimeAmount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-slate-200">
                  <span>Gross Earnings:</span>
                  <span className="font-mono">{company.currencySymbol} {(selectedPayslip.grossSalary || selectedPayslip.grossEarned || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-rose-700 border-b border-rose-200 pb-1">
                  Salary Deductions
                </h4>
                <div className="flex justify-between">
                  <span className="text-slate-600">Advance Recovery:</span>
                  <span className="font-mono font-bold text-rose-600">-{company.currencySymbol} {(selectedPayslip.advanceDeduction || selectedPayslip.advancesDeduction || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">EOBI / Social Security:</span>
                  <span className="font-mono font-bold text-rose-600">-{company.currencySymbol} {(selectedPayslip.eobiDeduction || selectedPayslip.eobi || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Uniform Installment:</span>
                  <span className="font-mono font-bold text-rose-600">-{company.currencySymbol} {(selectedPayslip.uniformDeduction || selectedPayslip.uniformDeductions || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-slate-200">
                  <span>Total Deductions:</span>
                  <span className="font-mono text-rose-700">
                    -{company.currencySymbol}{' '}
                    {((selectedPayslip.advanceDeduction || selectedPayslip.advancesDeduction || 0) + (selectedPayslip.eobiDeduction || selectedPayslip.eobi || 0) + (selectedPayslip.uniformDeduction || selectedPayslip.uniformDeductions || 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Net Amount Box */}
            <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Net Disbursed Take-Home Salary
                </p>
                <p className="text-[11px] text-slate-400">Electronic Bank Transfer Credited</p>
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                {company.currencySymbol} {(selectedPayslip.netPayable || selectedPayslip.netDisbursed || 0).toLocaleString()}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Printed from MSS ERP v2.0</span>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold"
              >
                Print Payslip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
