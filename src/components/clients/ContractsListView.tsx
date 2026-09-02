/**
 * Mountain Security Services (MSS) - ERP Platform
 * ContractsListView.tsx (Phase 3 - Security SLAs & Contracts)
 */

import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Search,
  Building2,
  Calendar,
  DollarSign,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Contract } from '../../types';
import { RowActionButtons } from '../common/RowActionButtons';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
import { RecordDetailModal } from '../common/RecordDetailModal';

export const ContractsListView: React.FC = () => {
  const { company, contracts, clients, createContract, updateContract, deleteContract, hasPermission, addToast } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [deletingContract, setDeletingContract] = useState<Contract | null>(null);
  const [detailContract, setDetailContract] = useState<Contract | null>(null);

  const canEdit = hasPermission('CONTRACTS_EDIT') || hasPermission('CLIENTS_MANAGE') || hasPermission('ALL_ACCESS');
  const canDelete = hasPermission('CONTRACTS_DELETE') || hasPermission('CLIENTS_MANAGE') || hasPermission('ALL_ACCESS');

  const [formData, setFormData] = useState<Partial<Contract>>({
    clientId: clients[0]?.id || '',
    startDate: '2026-09-01',
    endDate: '2027-08-31',
    unarmedGuardsCount: 10,
    armedGuardsCount: 2,
    unarmedRatePerGuard: 35000,
    armedRatePerGuard: 48000,
    billingFrequency: 'MONTHLY',
    status: 'ACTIVE',
  });

  const totalMonthlyValue =
    (Number(formData.unarmedGuardsCount) || 0) * (Number(formData.unarmedRatePerGuard) || 0) +
    (Number(formData.armedGuardsCount) || 0) * (Number(formData.armedRatePerGuard) || 0);

  const handleOpenCreate = () => {
    setEditingContract(null);
    setFormData({
      clientId: clients[0]?.id || '',
      startDate: '2026-09-01',
      endDate: '2027-08-31',
      unarmedGuardsCount: 10,
      armedGuardsCount: 2,
      unarmedRatePerGuard: 35000,
      armedRatePerGuard: 48000,
      billingFrequency: 'MONTHLY',
      status: 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Contract) => {
    setEditingContract(c);
    setFormData({
      clientId: c.clientId,
      startDate: c.startDate,
      endDate: c.endDate,
      unarmedGuardsCount: c.unarmedGuardsCount || 0,
      armedGuardsCount: c.armedGuardsCount || 0,
      unarmedRatePerGuard: c.unarmedRatePerGuard || 35000,
      armedRatePerGuard: c.armedRatePerGuard || 48000,
      billingFrequency: c.billingFrequency || 'MONTHLY',
      status: c.status || 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find((c) => c.id === formData.clientId) || clients[0];

    if (editingContract) {
      updateContract(editingContract.id, {
        clientId: selectedClient.id,
        clientName: selectedClient.displayName || selectedClient.legalName || selectedClient.name || 'Client',
        startDate: formData.startDate || editingContract.startDate,
        endDate: formData.endDate || editingContract.endDate,
        unarmedGuardsCount: Number(formData.unarmedGuardsCount) || 0,
        armedGuardsCount: Number(formData.armedGuardsCount) || 0,
        unarmedRatePerGuard: Number(formData.unarmedRatePerGuard) || 0,
        armedRatePerGuard: Number(formData.armedRatePerGuard) || 0,
        monthlyRate: totalMonthlyValue,
        contractValue: totalMonthlyValue * 12,
        totalMonthlyValue,
        status: formData.status as any || 'ACTIVE',
      });
      addToast(`Contract ${editingContract.contractNumber} updated successfully`, 'success');
    } else {
      const count = contracts.length + 1;
      const contractNumber = `CNT-MSS-2026-${String(count).padStart(3, '0')}`;

      createContract({
        contractNumber,
        title: `${selectedClient.displayName || selectedClient.legalName || selectedClient.name || 'Client'} Security SLA`,
        clientId: selectedClient.id,
        clientName: selectedClient.displayName || selectedClient.legalName || selectedClient.name || 'Client',
        type: 'Monthly Security Services',
        startDate: formData.startDate || '2026-09-01',
        endDate: formData.endDate || '2027-08-31',
        unarmedGuardsCount: Number(formData.unarmedGuardsCount) || 0,
        armedGuardsCount: Number(formData.armedGuardsCount) || 0,
        unarmedRatePerGuard: Number(formData.unarmedRatePerGuard) || 0,
        armedRatePerGuard: Number(formData.armedRatePerGuard) || 0,
        monthlyRate: totalMonthlyValue,
        contractValue: totalMonthlyValue * 12,
        totalMonthlyValue,
        billingMethod: 'Per Guard Billing',
        billingFrequency: 'Monthly',
        noticePeriodDays: 30,
        autoRenewal: true,
        status: 'ACTIVE',
      } as any);
      addToast(`Contract ${contractNumber} drafted successfully`, 'success');
    }

    setIsModalOpen(false);
    setEditingContract(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingContract) return;
    const res = deleteContract(deletingContract.id);
    if (res.success) {
      addToast(`Contract ${deletingContract.contractNumber} deleted successfully`, 'success');
      setDeletingContract(null);
    } else {
      addToast(res.error || 'Failed to delete contract', 'error');
    }
  };

  const filteredContracts = contracts.filter((c) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.contractNumber.toLowerCase().includes(q) ||
      c.clientName.toLowerCase().includes(q) ||
      (c.status && c.status.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Security Service Level Agreements (SLAs) & Contracts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active guard deployment agreements, hourly/monthly billing rates, and renewal timelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Draft New Contract</span>
          </button>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Contract #</th>
                <th className="px-4 py-3.5">Client Name</th>
                <th className="px-4 py-3.5">Contract Period</th>
                <th className="px-4 py-3.5 text-center">Unarmed Guards</th>
                <th className="px-4 py-3.5 text-center">Armed Guards</th>
                <th className="px-4 py-3.5 text-right">Monthly Billing</th>
                <th className="px-6 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-right font-mono font-bold text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContracts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-mono font-bold text-slate-900">{c.contractNumber}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">{c.clientName}</td>
                  <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                    {c.startDate} to {c.endDate}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="font-bold text-slate-900">{c.unarmedGuardsCount || 0}</span>{' '}
                    <span className="text-slate-400 text-[10px]">(@ {company.currencySymbol}{(c.unarmedRatePerGuard || 35000).toLocaleString()})</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="font-bold text-slate-900">{c.armedGuardsCount || 0}</span>{' '}
                    <span className="text-slate-400 text-[10px]">(@ {company.currencySymbol}{(c.armedRatePerGuard || 48000).toLocaleString()})</span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">
                    {company.currencySymbol} {(c.totalMonthlyValue || c.monthlyRate || c.contractValue || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <span className="px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <RowActionButtons
                      size="sm"
                      canEdit={canEdit}
                      canDelete={canDelete}
                      onView={() => setDetailContract(c)}
                      onEdit={() => handleOpenEdit(c)}
                      onDelete={() => setDeletingContract(c)}
                      viewTooltip={`View ${c.contractNumber} details`}
                      editTooltip={`Edit ${c.contractNumber}`}
                      deleteTooltip={`Delete ${c.contractNumber}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Contract Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base tracking-tight font-['Space_Grotesk']">
                {editingContract ? `Edit Security Contract (${editingContract.contractNumber})` : 'Draft Security Contract Agreement'}
              </h3>
              <button onClick={() => { setIsModalOpen(false); setEditingContract(null); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Contracting Client *</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Effective Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry / Renewal Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unarmed Guards Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.unarmedGuardsCount}
                    onChange={(e) => setFormData({ ...formData, unarmedGuardsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unarmed Rate / Guard ({company.currencySymbol})</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.unarmedRatePerGuard}
                    onChange={(e) => setFormData({ ...formData, unarmedRatePerGuard: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Armed Guards Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.armedGuardsCount}
                    onChange={(e) => setFormData({ ...formData, armedGuardsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Armed Rate / Guard ({company.currencySymbol})</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.armedRatePerGuard}
                    onChange={(e) => setFormData({ ...formData, armedRatePerGuard: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-slate-700">Computed Monthly Billing:</span>
                <span className="text-base font-black font-mono text-emerald-700">
                  {company.currencySymbol} {totalMonthlyValue.toLocaleString()} / mo
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingContract(null); }}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-all"
                >
                  {editingContract ? 'Save Changes' : 'Draft Contract'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingContract && (
        <DeleteConfirmationModal
          isOpen={!!deletingContract}
          onClose={() => setDeletingContract(null)}
          onConfirm={handleConfirmDelete}
          recordTitle={`${deletingContract.contractNumber} (${deletingContract.clientName})`}
          recordId={deletingContract.contractNumber}
          moduleName="Contracts & SLAs"
          warningMessage="Deleting this contract agreement will permanently remove the SLA terms and scheduled monthly billing amount. Linked historical invoices will remain intact."
        />
      )}

      {/* View Details Modal */}
      {detailContract && (
        <RecordDetailModal
          isOpen={!!detailContract}
          onClose={() => setDetailContract(null)}
          title={detailContract.contractNumber}
          subtitle={`Client: ${detailContract.clientName}`}
          badge={{
            text: detailContract.status || 'ACTIVE',
            variant: detailContract.status === 'ACTIVE' ? 'emerald' : 'slate',
          }}
          onEdit={() => {
            const c = detailContract;
            setDetailContract(null);
            handleOpenEdit(c);
          }}
          onDelete={() => {
            const c = detailContract;
            setDetailContract(null);
            setDeletingContract(c);
          }}
          canEdit={canEdit}
          canDelete={canDelete}
          fields={[
            { label: 'Contract Number', value: detailContract.contractNumber, isMono: true },
            { label: 'Client Name', value: detailContract.clientName },
            { label: 'Start Date', value: detailContract.startDate, isMono: true },
            { label: 'Renewal / End Date', value: detailContract.endDate, isMono: true },
            { label: 'Unarmed Guards Required', value: `${detailContract.unarmedGuardsCount || 0} guards @ ${company.currencySymbol}${(detailContract.unarmedRatePerGuard || 0).toLocaleString()}` },
            { label: 'Armed Guards Required', value: `${detailContract.armedGuardsCount || 0} guards @ ${company.currencySymbol}${(detailContract.armedRatePerGuard || 0).toLocaleString()}` },
            { label: 'Monthly Billing Value', value: `${company.currencySymbol} ${(detailContract.totalMonthlyValue || detailContract.monthlyRate || 0).toLocaleString()}`, isMono: true },
            { label: 'Annual Value', value: `${company.currencySymbol} ${(detailContract.contractValue || 0).toLocaleString()}`, isMono: true },
          ]}
        />
      )}
    </div>
  );
};
