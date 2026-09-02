/**
 * Mountain Security Services (MSS) - ERP Platform
 * ClientsListView.tsx (Phase 3 - Client Directory & Management)
 */

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  X,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Client } from '../../types';
import { RowActionButtons } from '../common/RowActionButtons';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
import { RecordDetailModal } from '../common/RecordDetailModal';

export const ClientsListView: React.FC = () => {
  const { clients, createClient, updateClient, deleteClient, hasPermission, addToast } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [detailClient, setDetailClient] = useState<Client | null>(null);

  const canEdit = hasPermission('CLIENTS_EDIT') || hasPermission('CLIENTS_MANAGE') || hasPermission('ALL_ACCESS');
  const canDelete = hasPermission('CLIENTS_DELETE') || hasPermission('CLIENTS_MANAGE') || hasPermission('ALL_ACCESS');

  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    category: 'Commercial Bank',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: 'Denver',
    paymentTermsDays: 30,
    status: 'ACTIVE',
  });

  const handleOpenCreate = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      category: 'Commercial Bank',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: 'Denver',
      paymentTermsDays: 30,
      status: 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || client.displayName || '',
      category: client.category || 'Commercial Bank',
      contactPerson: client.contactPerson || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      city: client.city || 'Denver',
      paymentTermsDays: client.paymentTermsDays || 30,
      status: client.status || 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingClient) {
      updateClient(editingClient.id, {
        name: formData.name,
        displayName: formData.name,
        category: formData.category,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        paymentTermsDays: Number(formData.paymentTermsDays) || 30,
        status: formData.status,
      });
      addToast(`Client '${formData.name}' updated successfully`, 'success');
    } else {
      const count = clients.length + 1;
      const code = `CLT-${String(count).padStart(3, '0')}`;

      createClient({
        code,
        name: formData.name || '',
        category: formData.category || 'Corporate',
        contactPerson: formData.contactPerson || '',
        email: formData.email || '',
        phone: formData.phone || '',
        address: formData.address || '',
        city: formData.city || 'Denver',
        glReceivableCode: '1130',
        paymentTermsDays: Number(formData.paymentTermsDays) || 30,
        status: 'ACTIVE',
      });
      addToast(`Client '${formData.name}' created successfully`, 'success');
    }

    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingClient) return;
    const res = deleteClient(deletingClient.id);
    if (res.success) {
      addToast(`Client '${deletingClient.name}' archived successfully`, 'success');
      setDeletingClient(null);
    } else {
      addToast(res.error || 'Failed to archive client', 'error');
    }
  };

  const filteredClients = clients.filter((c) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.contactPerson.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Client Directory & Corporate Accounts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enterprise clients, primary liaisons, billing terms, and linked receivable subledgers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clients by name, code, contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-72 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white"
          />
        </div>
        <span className="text-xs text-slate-500 font-mono">
          <strong>{filteredClients.length}</strong> Registered Clients
        </span>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  {client.code} • {client.category}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">{client.name}</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800">
                  {client.status}
                </span>
                <RowActionButtons
                  size="sm"
                  canEdit={canEdit}
                  canDelete={canDelete}
                  onView={() => setDetailClient(client)}
                  onEdit={() => handleOpenEdit(client)}
                  onDelete={() => setDeletingClient(client)}
                  viewTooltip={`View ${client.name} profile`}
                  editTooltip={`Edit ${client.name} details`}
                  deleteTooltip={`Archive ${client.name}`}
                />
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium">{client.contactPerson} (Primary POC)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{client.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{client.address}, {client.city}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Payment Terms:</span>
              <span className="font-bold text-slate-900">{client.paymentTermsDays} Days Net</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base tracking-tight font-['Space_Grotesk']">
                {editingClient ? 'Edit Client Account' : 'Register New Client Account'}
              </h3>
              <button onClick={() => { setIsModalOpen(false); setEditingClient(null); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Client Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Apex Industrial Logistics Ltd."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Industry Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Commercial Bank">Commercial Bank</option>
                    <option value="Industrial Facility">Industrial Facility</option>
                    <option value="Healthcare / Hospital">Healthcare / Hospital</option>
                    <option value="Retail Mall">Retail Mall</option>
                    <option value="Diplomatic & NGO">Diplomatic & NGO</option>
                    <option value="Residential Gated">Residential Gated</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Person (POC)</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 51 9876543"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Billing Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="billing@client.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Headquarters City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Terms (Days)</label>
                  <input
                    type="number"
                    value={formData.paymentTermsDays}
                    onChange={(e) => setFormData({ ...formData, paymentTermsDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Plot 44, Industrial Area..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingClient(null); }}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-all"
                >
                  {editingClient ? 'Save Changes' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingClient && (
        <DeleteConfirmationModal
          isOpen={!!deletingClient}
          onClose={() => setDeletingClient(null)}
          onConfirm={handleConfirmDelete}
          recordTitle={deletingClient.name}
          recordId={deletingClient.code}
          moduleName="Clients"
          isArchive={true}
          warningMessage="Archiving this client will prevent new contracts or invoices from being drafted. Existing SLA historical contracts and financial vouchers remain securely linked."
        />
      )}

      {/* View Details Modal */}
      {detailClient && (
        <RecordDetailModal
          isOpen={!!detailClient}
          onClose={() => setDetailClient(null)}
          title={detailClient.name}
          subtitle={`Client Account Code: ${detailClient.code}`}
          badge={{
            text: detailClient.status || 'ACTIVE',
            variant: detailClient.status === 'ACTIVE' ? 'emerald' : 'slate',
          }}
          onEdit={() => {
            const c = detailClient;
            setDetailClient(null);
            handleOpenEdit(c);
          }}
          onDelete={() => {
            const c = detailClient;
            setDetailClient(null);
            setDeletingClient(c);
          }}
          canEdit={canEdit}
          canDelete={canDelete}
          fields={[
            { label: 'Client Code', value: detailClient.code, isMono: true },
            { label: 'Category', value: detailClient.category },
            { label: 'Primary Contact Person', value: detailClient.contactPerson },
            { label: 'Official Phone', value: detailClient.phone, isMono: true },
            { label: 'Billing Email', value: detailClient.email },
            { label: 'Headquarters City', value: detailClient.city },
            { label: 'Payment Terms', value: `${detailClient.paymentTermsDays || 30} Days Net`, isMono: true },
            { label: 'GL Receivable Code', value: detailClient.glReceivableCode || '1130', isMono: true },
            { label: 'Street Address', value: detailClient.address, fullWidth: true },
          ]}
        />
      )}
    </div>
  );
};
