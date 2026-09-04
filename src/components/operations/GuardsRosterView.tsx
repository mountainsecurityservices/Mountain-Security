/**
 * Mountain Security Services (MSS) - ERP Platform
 * GuardsRosterView.tsx (Phase 4 - Guards Personnel Master Directory)
 */

import React, { useState } from 'react';
import {
  Shield,
  Plus,
  Search,
  Filter,
  Phone,
  CreditCard,
  Award,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Guard } from '../../types';
import { RowActionButtons } from '../common/RowActionButtons';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
import { RecordDetailModal } from '../common/RecordDetailModal';

export const GuardsRosterView: React.FC = () => {
  const { guards, createGuard, updateGuard, deleteGuard, hasPermission, addToast } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArmed, setFilterArmed] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuard, setEditingGuard] = useState<Guard | null>(null);
  const [deletingGuard, setDeletingGuard] = useState<Guard | null>(null);
  const [detailGuard, setDetailGuard] = useState<Guard | null>(null);

  const canEdit = hasPermission('GUARDS_EDIT') || hasPermission('OPERATIONS_MANAGE') || hasPermission('ALL_ACCESS');
  const canDelete = hasPermission('GUARDS_DELETE') || hasPermission('OPERATIONS_MANAGE') || hasPermission('ALL_ACCESS');

  const [formData, setFormData] = useState<Partial<Guard>>({
    fullName: '',
    cnic: '',
    phone: '',
    emergencyContact: '',
    rank: 'Security Guard',
    isArmedAuthorized: false,
    weaponLicenseNumber: '',
    monthlyBasicSalary: 32000,
    allowances: 3000,
    status: 'ACTIVE',
  });

  const handleOpenCreate = () => {
    setEditingGuard(null);
    setFormData({
      fullName: '',
      cnic: '',
      phone: '',
      emergencyContact: '',
      rank: 'Security Guard',
      isArmedAuthorized: false,
      weaponLicenseNumber: '',
      monthlyBasicSalary: 32000,
      allowances: 3000,
      status: 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (guard: Guard) => {
    setEditingGuard(guard);
    setFormData({
      fullName: guard.fullName,
      cnic: guard.cnic || guard.cnicOrNationalId || '',
      phone: guard.phone || '',
      emergencyContact: guard.emergencyContact || '',
      rank: guard.rank || guard.designation || guard.employeeType || 'Security Guard',
      isArmedAuthorized: guard.isArmedAuthorized || false,
      weaponLicenseNumber: guard.weaponLicenseNumber || guard.gunLicenseNumber || '',
      monthlyBasicSalary: guard.monthlyBasicSalary || 32000,
      allowances: guard.allowances || 0,
      status: guard.status || 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.cnic) return;

    if (editingGuard) {
      updateGuard(editingGuard.id, {
        fullName: formData.fullName,
        cnicOrNationalId: formData.cnic,
        phone: formData.phone,
        emergencyContact: formData.emergencyContact,
        designation: formData.rank,
        isArmedAuthorized: formData.isArmedAuthorized,
        gunLicenseNumber: formData.weaponLicenseNumber,
        monthlyBasicSalary: Number(formData.monthlyBasicSalary) || 32000,
        allowances: Number(formData.allowances) || 0,
        status: formData.status as any || 'ACTIVE',
      });
      addToast(`Guard '${formData.fullName}' updated successfully`, 'success');
    } else {
      const count = guards.length + 1;
      const guardCode = `MSS-G-${String(count).padStart(3, '0')}`;

      createGuard({
        guardCode,
        fullName: formData.fullName || '',
        cnic: formData.cnic || '',
        phone: formData.phone || '',
        emergencyContact: formData.emergencyContact || '',
        rank: formData.rank || 'Security Guard',
        joinDate: new Date().toISOString().substring(0, 10),
        isArmedAuthorized: formData.isArmedAuthorized || false,
        weaponLicenseNumber: formData.weaponLicenseNumber || '',
        monthlyBasicSalary: Number(formData.monthlyBasicSalary) || 32000,
        allowances: Number(formData.allowances) || 0,
        status: 'ACTIVE',
      });
      addToast(`Guard personnel '${formData.fullName}' enlisted successfully`, 'success');
    }

    setIsModalOpen(false);
    setEditingGuard(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingGuard) return;
    const res = deleteGuard(deletingGuard.id, true); // Archive
    if (res.success) {
      setDeletingGuard(null);
    } else {
      addToast(res.error || 'Failed to archive guard', 'error');
    }
  };

  const filteredGuards = guards.filter((g) => {
    if (filterArmed === 'ARMED' && !g.isArmedAuthorized) return false;
    if (filterArmed === 'UNARMED' && g.isArmedAuthorized) return false;
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    const guardCode = (g.guardCode || g.employeeCode || '').toLowerCase();
    const cnic = (g.cnic || g.cnicOrNationalId || '');
    const rank = (g.rank || g.designation || g.employeeType || '').toLowerCase();
    return (
      g.fullName.toLowerCase().includes(q) ||
      guardCode.includes(q) ||
      cnic.includes(q) ||
      rank.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Security Force Roster & Personnel Master
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered security officers, ex-servicemen credentials, CNIC verification, and firearm authorizations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Enlist New Guard</span>
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
              placeholder="Search guards by name, code, CNIC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-72 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white"
            />
          </div>

          <select
            value={filterArmed}
            onChange={(e) => setFilterArmed(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Guard Types</option>
            <option value="ARMED">Armed Weapons Authorized</option>
            <option value="UNARMED">Unarmed Standard</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-mono">
          Showing <strong>{filteredGuards.length}</strong> of {guards.length} guards
        </span>
      </div>

      {/* Guard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuards.map((guard) => (
          <div
            key={guard.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center font-mono">
                  {guard.guardCode.replace('MSS-G-', '')}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{guard.fullName}</h3>
                  <p className="text-xs font-semibold text-slate-500">{guard.rank || guard.designation || guard.employeeType}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {guard.isArmedAuthorized ? (
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-red-100 text-red-800">
                    ARMED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-100 text-slate-700">
                    UNARMED
                  </span>
                )}
                <RowActionButtons
                  size="sm"
                  canEdit={canEdit}
                  canDelete={canDelete}
                  onView={() => setDetailGuard(guard)}
                  onEdit={() => handleOpenEdit(guard)}
                  onDelete={() => setDeletingGuard(guard)}
                  viewTooltip={`View ${guard.fullName} credentials`}
                  editTooltip={`Edit ${guard.fullName}`}
                  deleteTooltip={`Archive ${guard.fullName}`}
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">CNIC Number:</span>
                <span className="font-mono font-bold text-slate-800">{guard.cnic || guard.cnicOrNationalId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contact Phone:</span>
                <span className="font-mono">{guard.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Join Date:</span>
                <span className="font-mono">{guard.joinDate || guard.joiningDate}</span>
              </div>
              {guard.isArmedAuthorized && (
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>Weapon License:</span>
                  <span className="font-mono">{guard.weaponLicenseNumber || guard.gunLicenseNumber || 'LIC-AUTH'}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Basic Monthly:</span>
              <span className="font-bold text-slate-900">
                PKR {(guard.monthlyBasicSalary || 32000).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Enlist / Edit Guard Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base tracking-tight font-['Space_Grotesk']">
                {editingGuard ? `Edit Guard (${editingGuard.guardCode || editingGuard.employeeCode})` : 'Enlist New Security Guard Personnel'}
              </h3>
              <button onClick={() => { setIsModalOpen(false); setEditingGuard(null); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Havaldar Muhammad Ashraf"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CNIC Number (with dashes) *</label>
                  <input
                    type="text"
                    required
                    value={formData.cnic}
                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                    placeholder="37405-1234567-1"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rank / Designation</label>
                  <select
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Security Guard">Security Guard</option>
                    <option value="Armed Guard">Armed Guard</option>
                    <option value="Head Guard">Head Guard</option>
                    <option value="Shift Supervisor">Shift Supervisor</option>
                    <option value="Patrol Officer">Patrol Officer</option>
                    <option value="Ex-Serviceman Bodyguard">Ex-Serviceman Bodyguard</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 300 9876543"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="armed_auth"
                    checked={formData.isArmedAuthorized}
                    onChange={(e) => setFormData({ ...formData, isArmedAuthorized: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300"
                  />
                  <label htmlFor="armed_auth" className="font-bold text-slate-800 cursor-pointer">
                    Armed Weapon Qualification Authorized
                  </label>
                </div>

                {formData.isArmedAuthorized && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Weapons License Number</label>
                    <input
                      type="text"
                      value={formData.weaponLicenseNumber}
                      onChange={(e) => setFormData({ ...formData, weaponLicenseNumber: e.target.value })}
                      placeholder="LIC-PAK-2025-9988"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Basic Monthly Salary (PKR)</label>
                  <input
                    type="number"
                    value={formData.monthlyBasicSalary}
                    onChange={(e) => setFormData({ ...formData, monthlyBasicSalary: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Allowances (PKR)</label>
                  <input
                    type="number"
                    value={formData.allowances}
                    onChange={(e) => setFormData({ ...formData, allowances: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingGuard(null); }}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-all"
                >
                  {editingGuard ? 'Save Changes' : 'Enlist Guard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Archive / Delete Guard Modal */}
      {deletingGuard && (
        <DeleteConfirmationModal
          isOpen={!!deletingGuard}
          onClose={() => setDeletingGuard(null)}
          onConfirm={handleConfirmDelete}
          recordTitle={`${deletingGuard.fullName} (${deletingGuard.guardCode || deletingGuard.employeeCode})`}
          recordId={deletingGuard.guardCode || deletingGuard.employeeCode}
          moduleName="Guards Roster"
          warningMessage="Archiving this guard will mark them as INACTIVE and retain their historic payroll, attendance, and deployment logs."
        />
      )}

      {/* Record Detail Modal */}
      {detailGuard && (
        <RecordDetailModal
          isOpen={!!detailGuard}
          onClose={() => setDetailGuard(null)}
          title={detailGuard.fullName}
          subtitle={`Personnel Code: ${detailGuard.guardCode || detailGuard.employeeCode} | ${detailGuard.rank || detailGuard.designation || 'Security Officer'}`}
          badge={{
            text: detailGuard.isArmedAuthorized ? 'ARMED AUTHORIZED' : 'UNARMED STANDARD',
            variant: detailGuard.isArmedAuthorized ? 'red' : 'slate',
          }}
          onEdit={() => {
            const g = detailGuard;
            setDetailGuard(null);
            handleOpenEdit(g);
          }}
          onDelete={() => {
            const g = detailGuard;
            setDetailGuard(null);
            setDeletingGuard(g);
          }}
          canEdit={canEdit}
          canDelete={canDelete}
          fields={[
            { label: 'Personnel Code', value: detailGuard.guardCode || detailGuard.employeeCode, isMono: true },
            { label: 'Full Name', value: detailGuard.fullName },
            { label: 'CNIC / National ID', value: detailGuard.cnic || detailGuard.cnicOrNationalId || 'N/A', isMono: true },
            { label: 'Rank / Designation', value: detailGuard.rank || detailGuard.designation || detailGuard.employeeType || 'Security Guard' },
            { label: 'Contact Phone', value: detailGuard.phone || 'N/A', isMono: true },
            { label: 'Emergency Contact', value: detailGuard.emergencyContact || 'N/A' },
            { label: 'Enlistment / Join Date', value: detailGuard.joinDate || detailGuard.joiningDate || '2026-01-01', isMono: true },
            { label: 'Firearm Authorization', value: detailGuard.isArmedAuthorized ? 'Authorized (Armed Duty)' : 'Unarmed Standard' },
            { label: 'Gun License #', value: detailGuard.weaponLicenseNumber || detailGuard.gunLicenseNumber || 'N/A', isMono: true },
            { label: 'Basic Monthly Salary', value: `PKR ${(detailGuard.monthlyBasicSalary || 32000).toLocaleString()}`, isMono: true },
            { label: 'Monthly Allowances', value: `PKR ${(detailGuard.allowances || 0).toLocaleString()}`, isMono: true },
            { label: 'Active Deployment Status', value: detailGuard.status || 'ACTIVE' },
          ]}
        />
      )}
    </div>
  );
};
