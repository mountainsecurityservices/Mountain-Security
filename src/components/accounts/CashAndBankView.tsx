/**
 * Mountain Security Services (MSS) - ERP Platform
 * CashAndBankView.tsx (Phase 2 - Cash & Bank Management)
 */

import React from 'react';
import {
  CreditCard,
  DollarSign,
  Building2,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const CashAndBankView: React.FC = () => {
  const { company, bankAccounts, cashAccounts, setActiveTab } = useERP();

  const totalBankBalance = bankAccounts.reduce((sum, b) => sum + b.currentBalance, 0);
  const totalCashBalance = cashAccounts.reduce((sum, c) => sum + c.currentBalance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Cash & Bank Treasury Accounts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage corporate bank accounts, branch petty cash drawers, and cash book ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('vouchers')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Post Cash/Bank Voucher</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Corporate Bank Accounts ({bankAccounts.length})
            </span>
            <CreditCard className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <h3 className="text-3xl font-black font-['Space_Grotesk']">
              {company.currencySymbol} {totalBankBalance.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Live reconciled bank balance across all operating branches
            </p>
          </div>
        </div>

        <div className="p-6 bg-linear-to-br from-emerald-900 to-slate-900 text-white rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
              Branch Petty Cash Accounts ({cashAccounts.length})
            </span>
            <DollarSign className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-3xl font-black font-['Space_Grotesk']">
              {company.currencySymbol} {totalCashBalance.toLocaleString()}
            </h3>
            <p className="text-xs text-emerald-200/80 mt-1">
              Petty cash floats for dispatch operations & field guard emergencies
            </p>
          </div>
        </div>
      </div>

      {/* Bank Accounts Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 font-['Space_Grotesk'] uppercase tracking-wider">
          Bank Accounts Detail
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bankAccounts.map((bank) => (
            <div
              key={bank.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{bank.bankName}</h4>
                  <p className="text-xs font-semibold text-slate-600">{bank.accountTitle}</p>
                </div>
                <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800">
                  ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono">Account #</span>
                  <p className="font-mono font-bold text-slate-800">{bank.accountNumber}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono">IBAN / Swift</span>
                  <p className="font-mono font-medium text-slate-700">{bank.iban || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono">Branch</span>
                  <p className="font-medium text-slate-700">{bank.branchName}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono">GL Linked Code</span>
                  <p className="font-mono font-bold text-slate-900">{bank.glAccountCode}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Reconciled Balance:</span>
                <span className="text-lg font-black font-mono text-slate-900">
                  {company.currencySymbol} {bank.currentBalance.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cash Drawers Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 font-['Space_Grotesk'] uppercase tracking-wider">
          Branch Cash Drawers Detail
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cashAccounts.map((cash) => (
            <div
              key={cash.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{cash.name}</h4>
                  <p className="text-xs text-slate-500">{cash.branch}</p>
                </div>
                <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-100 text-blue-800">
                  GL {cash.glAccountCode}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Custodian In-Charge:</span>
                <span className="font-bold text-slate-900">{cash.custodianName}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Cash in Hand:</span>
                <span className="text-lg font-black font-mono text-emerald-700">
                  {company.currencySymbol} {cash.currentBalance.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
