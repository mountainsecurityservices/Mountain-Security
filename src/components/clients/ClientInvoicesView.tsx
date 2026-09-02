/**
 * Mountain Security Services (MSS) - ERP Platform
 * ClientInvoicesView.tsx (Phase 3 - Invoicing & Payment Collection Engine)
 */

import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  DollarSign,
  Printer,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  X,
  CreditCard,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { ClientInvoice } from '../../types';

export const ClientInvoicesView: React.FC = () => {
  const {
    company,
    clientInvoices,
    clients,
    contracts,
    createClientInvoice,
    recordInvoicePayment,
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<ClientInvoice | null>(null);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<ClientInvoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('Bank Transfer');

  const [formData, setFormData] = useState({
    clientId: clients[0]?.id || '',
    contractId: contracts[0]?.id || '',
    invoiceDate: '2026-09-01',
    dueDate: '2026-09-30',
    billingMonth: 'September 2026',
    subtotal: 516000,
    taxRate: 5,
  });

  const taxAmount = (formData.subtotal * formData.taxRate) / 100;
  const totalAmount = formData.subtotal + taxAmount;

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const count = clientInvoices.length + 1;
    const invoiceNumber = `INV-MSS-2026-${String(count).padStart(3, '0')}`;
    const selectedClient = clients.find((c) => c.id === formData.clientId) || clients[0];

    createClientInvoice({
      invoiceNumber,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      contractId: formData.contractId,
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate,
      billingMonth: formData.billingMonth,
      subtotal: formData.subtotal,
      taxAmount,
      totalAmount,
      status: 'ISSUED',
      items: [
        {
          id: '1',
          description: `Guard Deployment Services for ${formData.billingMonth}`,
          quantity: 1,
          unitPrice: formData.subtotal,
          totalPrice: formData.subtotal,
        },
      ],
    });

    setIsCreateModalOpen(false);
  };

  const handleConfirmPayment = () => {
    if (!paymentModalInvoice || paymentAmount <= 0) return;
    recordInvoicePayment(paymentModalInvoice.id, paymentAmount, paymentMethod);
    setPaymentModalInvoice(null);
  };

  const filteredInvoices = clientInvoices.filter((inv) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.clientName.toLowerCase().includes(q) ||
      inv.billingMonth.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Client Invoicing & Collection Receipts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue monthly SLA guarding invoices, record customer payments, and track outstanding receivables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Client Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Invoice #</th>
                <th className="px-4 py-3.5">Client</th>
                <th className="px-4 py-3.5">Billing Month</th>
                <th className="px-4 py-3.5">Due Date</th>
                <th className="px-4 py-3.5 text-right">Subtotal</th>
                <th className="px-4 py-3.5 text-right">Total ({company.currencySymbol})</th>
                <th className="px-4 py-3.5 text-right">Paid Amount</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">{inv.clientName}</td>
                  <td className="px-4 py-3.5 text-slate-600 font-medium">{inv.billingMonth}</td>
                  <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">{inv.dueDate}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-600">
                    {company.currencySymbol} {inv.subtotal.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">
                    {company.currencySymbol} {inv.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-700">
                    {inv.paidAmount > 0 ? `${company.currencySymbol} ${inv.paidAmount.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                      inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                      inv.status === 'PARTIAL' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceForPrint(inv)}
                        title="Print Invoice"
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      {inv.status !== 'PAID' && (
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentModalInvoice(inv);
                            setPaymentAmount(inv.totalAmount - inv.paidAmount);
                          }}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[11px]"
                        >
                          Receive Payment
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

      {/* Generate Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base tracking-tight font-['Space_Grotesk']">
                Generate Monthly Client Invoice
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInvoice} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Client *</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.code} - {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Billing Month</label>
                  <input
                    type="text"
                    value={formData.billingMonth}
                    onChange={(e) => setFormData({ ...formData, billingMonth: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Amount ({company.currencySymbol})</label>
                  <input
                    type="number"
                    value={formData.subtotal}
                    onChange={(e) => setFormData({ ...formData, subtotal: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sales Tax / GST Rate (%)</label>
                  <input
                    type="number"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 font-mono text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>{company.currencySymbol} {formData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST / Tax ({formData.taxRate}%):</span>
                  <span>{company.currencySymbol} {taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-sm">
                  <span>Total Payable:</span>
                  <span className="text-red-600">{company.currencySymbol} {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-all"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Receipt Modal */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-extrabold text-base text-slate-900 font-['Space_Grotesk']">
              Record Client Payment Collection
            </h3>
            <p className="text-xs text-slate-600">
              For Invoice <strong className="font-mono">{paymentModalInvoice.invoiceNumber}</strong> ({paymentModalInvoice.clientName})
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Received Amount ({company.currencySymbol})</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="Bank Transfer">Bank Wire Transfer (Direct Deposit)</option>
                  <option value="Cheque">Crossed Corporate Cheque</option>
                  <option value="Cash">Cash at Regional Dispatch Desk</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setPaymentModalInvoice(null)}
                className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all text-xs"
              >
                Post Collection & Update GL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Print Layout */}
      {selectedInvoiceForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 font-['Space_Grotesk']">
                  {company.officialName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  TAX INVOICE FOR SECURITY SERVICES
                </p>
              </div>
              <button
                onClick={() => setSelectedInvoiceForPrint(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-mono">BILLED TO</p>
                <p className="font-extrabold text-slate-900 text-sm">{selectedInvoiceForPrint.clientName}</p>
                <p className="text-slate-500">{selectedInvoiceForPrint.billingMonth}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 font-mono">INVOICE NUMBER</p>
                <p className="font-extrabold text-slate-900 font-mono text-sm">{selectedInvoiceForPrint.invoiceNumber}</p>
                <p className="text-slate-500">Date: {selectedInvoiceForPrint.invoiceDate} • Due: {selectedInvoiceForPrint.dueDate}</p>
              </div>
            </div>

            <div className="overflow-x-auto max-w-full border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead className="bg-slate-100 text-[10px] font-bold uppercase font-mono text-slate-600">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoiceForPrint.items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-3 font-semibold text-slate-900">{item.description}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right font-mono">{company.currencySymbol} {item.unitPrice.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold">{company.currencySymbol} {item.totalPrice.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold font-mono">
                  <tr>
                    <td colSpan={3} className="p-3 text-right">Subtotal:</td>
                    <td className="p-3 text-right">{company.currencySymbol} {selectedInvoiceForPrint.subtotal.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="p-3 text-right">Sales Tax / GST:</td>
                    <td className="p-3 text-right">{company.currencySymbol} {selectedInvoiceForPrint.taxAmount.toLocaleString()}</td>
                  </tr>
                  <tr className="text-sm text-slate-900">
                    <td colSpan={3} className="p-3 text-right font-black">Net Total Payable:</td>
                    <td className="p-3 text-right text-red-600 font-black">{company.currencySymbol} {selectedInvoiceForPrint.totalAmount.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Payment Status: <strong>{selectedInvoiceForPrint.status}</strong></span>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-bold"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
