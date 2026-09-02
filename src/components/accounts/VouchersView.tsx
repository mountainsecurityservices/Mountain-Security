/**
 * Mountain Security Services (MSS) - ERP Platform
 * VouchersView.tsx (Phase 2 - Vouchers Management Engine)
 */

import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  RotateCcw,
  Printer,
  Trash2,
  AlertCircle,
  Building2,
  X,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Voucher, VoucherType, VoucherLine } from '../../types';

export const VouchersView: React.FC = () => {
  const {
    company,
    vouchers,
    chartOfAccounts,
    cashAccounts,
    bankAccounts,
    suppliers,
    clients,
    createVoucher,
    approveVoucher,
    postVoucher,
    reverseVoucher,
    hasPermission,
  } = useERP();

  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedVoucherForPrint, setSelectedVoucherForPrint] = useState<Voucher | null>(null);
  const [reversalModalVoucher, setReversalModalVoucher] = useState<Voucher | null>(null);
  const [reversalReason, setReversalReason] = useState<string>('');

  // New Voucher Form State
  const [voucherType, setVoucherType] = useState<VoucherType>('PV');
  const [voucherDate, setVoucherDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [branch, setBranch] = useState<string>('Head Office');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [payeePayer, setPayeePayer] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'Cheque' | 'Online'>('Bank Transfer');
  const [cashOrBankAccountId, setCashOrBankAccountId] = useState<string>(bankAccounts[0]?.id || '');
  const [narration, setNarration] = useState<string>('');

  const [lines, setLines] = useState<VoucherLine[]>([
    { id: '1', accountCode: '2110', accountName: 'Accounts Payable (Suppliers)', subledgerType: 'Supplier', subledgerId: suppliers[0]?.id, subledgerName: suppliers[0]?.name, description: 'Payment line', debit: 50000, credit: 0 },
    { id: '2', accountCode: '1121', accountName: 'HBL Primary Corporate Account #9948-2', description: 'Bank disbursement', debit: 0, credit: 50000 },
  ]);

  const totalDebit = lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const isBalanced = totalDebit > 0 && totalDebit === totalCredit;

  const handleAddLine = () => {
    const postableAccounts = chartOfAccounts.filter((a) => a.isPostable);
    const defaultAcc = postableAccounts[0] || chartOfAccounts[0];
    const newLine: VoucherLine = {
      id: String(Date.now()),
      accountCode: defaultAcc.code,
      accountName: defaultAcc.name,
      description: narration || 'Transaction line',
      debit: 0,
      credit: 0,
    };
    setLines([...lines, newLine]);
  };

  const handleRemoveLine = (id: string) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((l) => l.id !== id));
  };

  const handleLineChange = (id: string, field: keyof VoucherLine, value: any) => {
    setLines(
      lines.map((l) => {
        if (l.id === id) {
          if (field === 'accountCode') {
            const acc = chartOfAccounts.find((a) => a.code === value);
            return { ...l, accountCode: value, accountName: acc ? acc.name : l.accountName };
          }
          return { ...l, [field]: value };
        }
        return l;
      })
    );
  };

  const handleSaveVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) return;

    const count = vouchers.length + 1;
    const voucherNumber = `${voucherType}-2026-${String(count).padStart(4, '0')}`;

    createVoucher({
      voucherNumber,
      type: voucherType,
      date: voucherDate,
      periodId: 'prd-2026-09',
      branch,
      referenceNumber,
      payeePayer,
      paymentMethod,
      cashOrBankAccountId,
      narration,
      lines,
      totalDebit,
      totalCredit,
    });

    setIsCreateModalOpen(false);
    // Reset defaults
    setNarration('');
    setReferenceNumber('');
    setPayeePayer('');
  };

  const handleExecuteReversal = () => {
    if (!reversalModalVoucher || !reversalReason.trim()) return;
    reverseVoucher(reversalModalVoucher.id, reversalReason);
    setReversalModalVoucher(null);
    setReversalReason('');
  };

  const filteredVouchers = vouchers.filter((v) => {
    if (filterType !== 'ALL' && v.type !== filterType) return false;
    if (filterStatus !== 'ALL' && v.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        v.voucherNumber.toLowerCase().includes(q) ||
        (v.narration && v.narration.toLowerCase().includes(q)) ||
        (v.payeePayer && v.payeePayer.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Voucher Management Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, validate, approve, post, and reverse double-entry financial vouchers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Voucher</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search voucher #, payee, narration..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-64 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Voucher Types</option>
            <option value="PV">PV - Payment Voucher</option>
            <option value="RV">RV - Receipt Voucher</option>
            <option value="JV">JV - Journal Voucher</option>
            <option value="CV">CV - Contra Voucher</option>
            <option value="GV">GV - General Voucher</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">DRAFT</option>
            <option value="APPROVED">APPROVED</option>
            <option value="POSTED">POSTED</option>
            <option value="REVERSED">REVERSED</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Showing <strong>{filteredVouchers.length}</strong> of {vouchers.length} vouchers
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Voucher Number</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Payee / Payer</th>
                <th className="px-4 py-3.5">Narration</th>
                <th className="px-4 py-3.5 text-right">Amount</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVouchers.map((vch) => (
                <tr key={vch.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-3.5 font-mono font-bold text-slate-900">{vch.voucherNumber}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      vch.type === 'PV' ? 'bg-rose-100 text-rose-800' :
                      vch.type === 'RV' ? 'bg-emerald-100 text-emerald-800' :
                      vch.type === 'JV' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {vch.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 font-mono">{vch.date}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">{vch.payeePayer || '—'}</td>
                  <td className="px-4 py-3.5 max-w-xs truncate text-slate-600">{vch.narration}</td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">
                    {company.currencySymbol} {vch.totalDebit.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      vch.status === 'POSTED' ? 'bg-emerald-100 text-emerald-800' :
                      vch.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                      vch.status === 'REVERSED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {vch.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedVoucherForPrint(vch)}
                        title="Print / View Voucher"
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {vch.status === 'DRAFT' && (
                        <button
                          type="button"
                          onClick={() => approveVoucher(vch.id)}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold text-[11px]"
                        >
                          Approve
                        </button>
                      )}

                      {vch.status === 'APPROVED' && (
                        <button
                          type="button"
                          onClick={() => postVoucher(vch.id)}
                          className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-bold text-[11px]"
                        >
                          Post to GL
                        </button>
                      )}

                      {vch.status === 'POSTED' && (
                        <button
                          type="button"
                          onClick={() => setReversalModalVoucher(vch)}
                          title="Generate Reversing Voucher"
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Voucher Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-red-400" />
                <h3 className="font-extrabold text-base tracking-tight font-['Space_Grotesk']">
                  Draft New Accounting Voucher
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVoucher} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Header Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Voucher Type</label>
                  <select
                    value={voucherType}
                    onChange={(e) => setVoucherType(e.target.value as VoucherType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value="PV">PV - Payment Voucher</option>
                    <option value="RV">RV - Receipt Voucher</option>
                    <option value="JV">JV - Journal Voucher</option>
                    <option value="CV">CV - Contra Voucher</option>
                    <option value="GV">GV - General Voucher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Transaction Date</label>
                  <input
                    type="date"
                    value={voucherDate}
                    onChange={(e) => setVoucherDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Operating Branch</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payee / Payer Name</label>
                  <input
                    type="text"
                    value={payeePayer}
                    onChange={(e) => setPayeePayer(e.target.value)}
                    placeholder="e.g. Al-Hadeed Uniforms / Sitara Chemical"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                  >
                    <option value="Bank Transfer">Bank Transfer (IBFT/Wire)</option>
                    <option value="Cash">Cash on Hand</option>
                    <option value="Cheque">Crossed Cheque</option>
                    <option value="Online">Online Portal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reference / Cheque #</label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="e.g. CHK-991823"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Main Voucher Narration / Memo</label>
                <input
                  type="text"
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  placeholder="Detailed description of transaction purpose..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              {/* Double Entry Lines Builder */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 font-mono">
                    Double-Entry Account Line Items
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Line</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 font-bold uppercase text-[10px] text-slate-500 font-mono border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2.5">Account Code & Name</th>
                        <th className="px-3 py-2.5">Line Description</th>
                        <th className="px-3 py-2.5 text-right w-32">Debit ({company.currencySymbol})</th>
                        <th className="px-3 py-2.5 text-right w-32">Credit ({company.currencySymbol})</th>
                        <th className="px-2 py-2.5 text-center w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lines.map((line) => (
                        <tr key={line.id}>
                          <td className="p-2">
                            <select
                              value={line.accountCode}
                              onChange={(e) => handleLineChange(line.id, 'accountCode', e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                            >
                              {chartOfAccounts
                                .filter((a) => a.isPostable)
                                .map((a) => (
                                  <option key={a.code} value={a.code}>
                                    {a.code} - {a.name} ({a.type})
                                  </option>
                                ))}
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={line.description}
                              onChange={(e) => handleLineChange(line.id, 'description', e.target.value)}
                              placeholder="Memo line..."
                              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={line.debit || ''}
                              onChange={(e) => handleLineChange(line.id, 'debit', Number(e.target.value))}
                              placeholder="0"
                              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-right font-mono font-bold"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={line.credit || ''}
                              onChange={(e) => handleLineChange(line.id, 'credit', Number(e.target.value))}
                              placeholder="0"
                              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-right font-mono font-bold"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveLine(line.id)}
                              disabled={lines.length <= 2}
                              className="text-slate-400 hover:text-rose-600 disabled:opacity-30 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 border-t border-slate-200 font-mono font-bold">
                      <tr>
                        <td colSpan={2} className="px-3 py-2.5 text-right text-slate-700">
                          Total Balancing Sum:
                        </td>
                        <td className="px-3 py-2.5 text-right text-slate-900 font-black">
                          {company.currencySymbol} {totalDebit.toLocaleString()}
                        </td>
                        <td className="px-3 py-2.5 text-right text-slate-900 font-black">
                          {company.currencySymbol} {totalCredit.toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Balance validation alert */}
                {!isBalanced ? (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>
                      Debits ({company.currencySymbol} {totalDebit.toLocaleString()}) must equal Credits ({company.currencySymbol} {totalCredit.toLocaleString()}). Difference: {company.currencySymbol} {Math.abs(totalDebit - totalCredit).toLocaleString()}.
                    </span>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Double-Entry Balance Verified (Debits = Credits). Ready for submission.</span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isBalanced}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  Save Draft Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reversal Confirmation Modal */}
      {reversalModalVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-rose-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <RotateCcw className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">
                Reverse Voucher {reversalModalVoucher.voucherNumber}
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              This will generate an official reversing accounting voucher in the General Ledger and invert all debit/credit balances.
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Reversal *</label>
              <input
                type="text"
                placeholder="e.g. Duplicate posting / incorrect amount"
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReversalModalVoucher(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteReversal}
                disabled={!reversalReason.trim()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Execute Reversal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voucher Printable Layout Modal */}
      {selectedVoucherForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 font-['Space_Grotesk']">
                  {company.officialName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  OFFICIAL ACCOUNTING VOUCHER • {selectedVoucherForPrint.type}
                </p>
              </div>
              <button
                onClick={() => setSelectedVoucherForPrint(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-mono">VOUCHER NUMBER</p>
                <p className="font-extrabold text-slate-900 font-mono text-sm">{selectedVoucherForPrint.voucherNumber}</p>
              </div>
              <div>
                <p className="text-slate-400 font-mono">DATE</p>
                <p className="font-bold text-slate-900">{selectedVoucherForPrint.date}</p>
              </div>
              <div>
                <p className="text-slate-400 font-mono">PAYEE / PAYER</p>
                <p className="font-bold text-slate-900">{selectedVoucherForPrint.payeePayer || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 font-mono">STATUS</p>
                <p className="font-bold text-emerald-600">{selectedVoucherForPrint.status}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
              <span className="font-bold text-slate-900">Narration: </span>
              {selectedVoucherForPrint.narration}
            </div>

            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-[10px] font-bold uppercase font-mono text-slate-600">
                <tr>
                  <th className="p-2.5">Account</th>
                  <th className="p-2.5">Description</th>
                  <th className="p-2.5 text-right">Debit</th>
                  <th className="p-2.5 text-right">Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedVoucherForPrint.lines.map((l) => (
                  <tr key={l.id}>
                    <td className="p-2.5 font-semibold text-slate-900">{l.accountCode} - {l.accountName}</td>
                    <td className="p-2.5 text-slate-600">{l.description}</td>
                    <td className="p-2.5 text-right font-mono">{l.debit > 0 ? `${company.currencySymbol} ${l.debit.toLocaleString()}` : '—'}</td>
                    <td className="p-2.5 text-right font-mono">{l.credit > 0 ? `${company.currencySymbol} ${l.credit.toLocaleString()}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold font-mono">
                <tr>
                  <td colSpan={2} className="p-2.5 text-right">Total:</td>
                  <td className="p-2.5 text-right">{company.currencySymbol} {selectedVoucherForPrint.totalDebit.toLocaleString()}</td>
                  <td className="p-2.5 text-right">{company.currencySymbol} {selectedVoucherForPrint.totalCredit.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>

            <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-4 text-center text-[10px] text-slate-500 font-mono">
              <div className="border-t border-slate-300 pt-1">Prepared By: {selectedVoucherForPrint.createdBy}</div>
              <div className="border-t border-slate-300 pt-1">Verified / Approved By</div>
              <div className="border-t border-slate-300 pt-1">Managing Director / Sign</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
