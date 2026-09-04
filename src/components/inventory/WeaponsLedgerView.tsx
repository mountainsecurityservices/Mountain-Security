/**
 * Mountain Security Services (MSS) - ERP Platform
 * WeaponsLedgerView.tsx (Phase 6 - Licensed Firearms & Armory Custody)
 */

import React, { useState } from 'react';
import {
  Crosshair,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Shield,
  UserCheck,
  Building2,
  X,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { WeaponItem } from '../../types';
import { RowActionButtons } from '../common/RowActionButtons';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
import { RecordDetailModal } from '../common/RecordDetailModal';

export const WeaponsLedgerView: React.FC = () => {
  const { weapons, guards, securitySites, createWeapon, updateWeaponItem, deleteWeaponItem, issueWeapon, returnWeapon, hasPermission, addToast } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingWeapon, setEditingWeapon] = useState<WeaponItem | null>(null);
  const [deletingWeapon, setDeletingWeapon] = useState<WeaponItem | null>(null);
  const [detailWeapon, setDetailWeapon] = useState<WeaponItem | null>(null);
  const [issueModalWeapon, setIssueModalWeapon] = useState<WeaponItem | null>(null);

  const canEdit = hasPermission('OPERATIONS_MANAGE') || hasPermission('ALL_ACCESS');
  const canDelete = hasPermission('OPERATIONS_MANAGE') || hasPermission('ALL_ACCESS');

  const [formData, setFormData] = useState<Partial<WeaponItem>>({
    serialNumber: '',
    type: 'Shotgun',
    makeModel: 'Pump Action 12GA',
    caliber: '12 Bore',
    licenseNumber: 'LIC-MOI-2025-1099',
    licenseExpiry: '2027-12-31',
    ammunitionRounds: 25,
    status: 'IN_ARMORY',
  });

  const [selectedGuardId, setSelectedGuardId] = useState(guards[0]?.id || '');
  const [selectedSiteId, setSelectedSiteId] = useState(securitySites[0]?.id || '');

  const handleOpenRegister = () => {
    setEditingWeapon(null);
    setFormData({
      serialNumber: '',
      type: 'Shotgun',
      makeModel: 'Pump Action 12GA',
      caliber: '12 Bore',
      licenseNumber: 'LIC-MOI-2025-1099',
      licenseExpiry: '2027-12-31',
      ammunitionRounds: 25,
      status: 'IN_ARMORY',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (w: WeaponItem) => {
    setEditingWeapon(w);
    setFormData({
      serialNumber: w.serialNumber,
      type: w.type,
      makeModel: w.makeModel,
      caliber: w.caliber,
      licenseNumber: w.licenseNumber,
      licenseExpiry: w.licenseExpiry,
      ammunitionRounds: w.ammunitionRounds,
      status: w.status,
    });
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serialNumber) return;

    if (editingWeapon) {
      const res = updateWeaponItem(editingWeapon.id, {
        serialNumber: formData.serialNumber,
        type: formData.type || 'Shotgun',
        makeModel: formData.makeModel || '12GA Shotgun',
        caliber: formData.caliber || '12 Bore',
        licenseNumber: formData.licenseNumber || 'LIC-2026',
        licenseExpiry: formData.licenseExpiry || '2027-12-31',
        ammunitionRounds: Number(formData.ammunitionRounds) || 20,
        status: formData.status || 'IN_ARMORY',
      });
      if (res.success) {
        addToast(`Firearm ${formData.serialNumber} updated successfully`, 'success');
      } else {
        addToast(res.error || 'Failed to update firearm', 'error');
      }
    } else {
      createWeapon({
        serialNumber: formData.serialNumber,
        type: formData.type || 'Shotgun',
        makeModel: formData.makeModel || '12GA Shotgun',
        caliber: formData.caliber || '12 Bore',
        licenseNumber: formData.licenseNumber || 'LIC-2026',
        licenseExpiry: formData.licenseExpiry || '2027-12-31',
        ammunitionRounds: Number(formData.ammunitionRounds) || 20,
        status: 'IN_ARMORY',
      });
      addToast(`Firearm ${formData.serialNumber} registered into vault`, 'success');
    }

    setIsAddModalOpen(false);
    setEditingWeapon(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingWeapon) return;
    const res = deleteWeaponItem(deletingWeapon.id);
    if (res.success) {
      setDeletingWeapon(null);
    } else {
      addToast(res.error || 'Failed to delete firearm', 'error');
    }
  };

  const handleConfirmIssue = () => {
    if (!issueModalWeapon) return;
    const selectedGuard = guards.find((g) => g.id === selectedGuardId) || guards[0];
    const selectedSite = securitySites.find((s) => s.id === selectedSiteId) || securitySites[0];

    issueWeapon(issueModalWeapon.id, selectedGuard.id, selectedSite.id);
    setIssueModalWeapon(null);
  };

  const filteredWeapons = weapons.filter((w) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      w.serialNumber.toLowerCase().includes(q) ||
      w.makeModel.toLowerCase().includes(q) ||
      w.licenseNumber.toLowerCase().includes(q) ||
      (w.assignedGuardName && w.assignedGuardName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Firearms Vault & Chain of Custody Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ministry of Interior (MOI) verified weapon serials, ammunition logs, and active guard post issue/return tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenRegister}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Register Firearm</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search firearm serial, model, custodian..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-72 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white"
          />
        </div>
        <span className="text-xs text-slate-500 font-mono">
          <strong>{filteredWeapons.length}</strong> Firearms in Ledger
        </span>
      </div>

      {/* Weapons Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs min-w-[800px]">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Serial #</th>
                <th className="px-4 py-3.5">Type & Model</th>
                <th className="px-4 py-3.5">Caliber</th>
                <th className="px-4 py-3.5">MOI License</th>
                <th className="px-4 py-3.5 text-center">Live Ammo</th>
                <th className="px-4 py-3.5">Current Custodian / Site</th>
                <th className="px-4 py-3.5 text-center">Vault Status</th>
                <th className="px-6 py-3.5 text-right">Chain of Custody & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWeapons.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-mono font-bold text-slate-900">{w.serialNumber}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    {w.type} • <span className="text-slate-600 font-normal">{w.makeModel}</span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-600">{w.caliber}</td>
                  <td className="px-4 py-3.5 font-mono text-slate-500">{w.licenseNumber}</td>
                  <td className="px-4 py-3.5 text-center font-mono font-bold text-amber-700">
                    {w.ammunitionRounds} rds
                  </td>
                  <td className="px-4 py-3.5">
                    {w.assignedGuardName ? (
                      <div>
                        <p className="font-bold text-slate-900">{w.assignedGuardName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{w.assignedSiteName}</p>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Locked in HQ Armory Vault</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                      w.status === 'ISSUED' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {w.status === 'IN_ARMORY' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIssueModalWeapon(w);
                            setSelectedGuardId(guards[0]?.id || '');
                          }}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg text-[11px]"
                        >
                          Issue to Guard
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => returnWeapon(w.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px]"
                        >
                          Return to Vault
                        </button>
                      )}
                      <RowActionButtons
                        size="sm"
                        canEdit={canEdit}
                        canDelete={canDelete && w.status !== 'ISSUED'}
                        onView={() => setDetailWeapon(w)}
                        onEdit={() => handleOpenEdit(w)}
                        onDelete={() => setDeletingWeapon(w)}
                        viewTooltip="View weapon dossier"
                        editTooltip="Edit firearm specs"
                        deleteTooltip={w.status === 'ISSUED' ? 'Cannot delete issued firearm' : 'Delete firearm from armory'}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Firearm Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base tracking-tight font-['Space_Grotesk']">
                {editingWeapon ? `Edit Firearm (${editingWeapon.serialNumber})` : 'Register New Firearm into Armory'}
              </h3>
              <button onClick={() => { setIsAddModalOpen(false); setEditingWeapon(null); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weapon Serial Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    placeholder="e.g. MSS-WPN-1049"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weapon Category</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Shotgun">12GA Shotgun (Pump Action)</option>
                    <option value="Pistol">9mm Semi-Automatic Pistol</option>
                    <option value="Rifle">7.62x39mm Semi-Auto Rifle</option>
                    <option value="Revolver">.38 Special Revolver</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Make & Model</label>
                  <input
                    type="text"
                    value={formData.makeModel}
                    onChange={(e) => setFormData({ ...formData, makeModel: e.target.value })}
                    placeholder="e.g. Maverick 88 12GA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Caliber</label>
                  <input
                    type="text"
                    value={formData.caliber}
                    onChange={(e) => setFormData({ ...formData, caliber: e.target.value })}
                    placeholder="12 Bore / 9mm"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">MOI License Number</label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    placeholder="LIC-MOI-2025-1099"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Live Ammunition Rounds</label>
                  <input
                    type="number"
                    value={formData.ammunitionRounds}
                    onChange={(e) => setFormData({ ...formData, ammunitionRounds: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingWeapon(null); }}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-all"
                >
                  {editingWeapon ? 'Save Changes' : 'Save to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Modal */}
      {issueModalWeapon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-extrabold text-base text-slate-900 font-['Space_Grotesk']">
              Issue Firearm Custody to Guard
            </h3>
            <p className="text-xs text-slate-600">
              Firearm: <strong className="font-mono">{issueModalWeapon.serialNumber}</strong> ({issueModalWeapon.makeModel})
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Armed Authorized Guard *</label>
                <select
                  value={selectedGuardId}
                  onChange={(e) => setSelectedGuardId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  {guards
                    .filter((g) => g.isArmedAuthorized)
                    .map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.guardCode} - {g.fullName} (Lic: {g.weaponLicenseNumber})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Deployment Site *</label>
                <select
                  value={selectedSiteId}
                  onChange={(e) => setSelectedSiteId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  {securitySites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name} ({s.clientName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIssueModalWeapon(null)}
                className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmIssue}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs transition-all text-xs"
              >
                Sign Out Weapon Custody
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Weapon Confirmation Modal */}
      {deletingWeapon && (
        <DeleteConfirmationModal
          isOpen={!!deletingWeapon}
          onClose={() => setDeletingWeapon(null)}
          onConfirm={handleConfirmDelete}
          recordTitle={`${deletingWeapon.serialNumber} (${deletingWeapon.makeModel})`}
          recordId={deletingWeapon.serialNumber}
          moduleName="Firearms Ledger"
          warningMessage="Deleting this firearm permanently removes it from the inventory ledger. This action is audited and cannot be undone."
        />
      )}

      {/* Record Detail Modal */}
      {detailWeapon && (
        <RecordDetailModal
          isOpen={!!detailWeapon}
          onClose={() => setDetailWeapon(null)}
          title={detailWeapon.serialNumber}
          subtitle={`${detailWeapon.type} • ${detailWeapon.makeModel}`}
          badge={{
            text: detailWeapon.status,
            variant: detailWeapon.status === 'IN_ARMORY' ? 'emerald' : 'purple',
          }}
          onEdit={() => {
            const w = detailWeapon;
            setDetailWeapon(null);
            handleOpenEdit(w);
          }}
          onDelete={() => {
            const w = detailWeapon;
            setDetailWeapon(null);
            setDeletingWeapon(w);
          }}
          canEdit={canEdit}
          canDelete={canDelete && detailWeapon.status !== 'ISSUED'}
          fields={[
            { label: 'Serial Number', value: detailWeapon.serialNumber, isMono: true },
            { label: 'Weapon Classification', value: detailWeapon.type },
            { label: 'Make & Model', value: detailWeapon.makeModel },
            { label: 'Bore / Caliber', value: detailWeapon.caliber, isMono: true },
            { label: 'MOI License Number', value: detailWeapon.licenseNumber, isMono: true },
            { label: 'MOI License Expiry', value: detailWeapon.licenseExpiry, isMono: true },
            { label: 'Live Ammunition Stock', value: `${detailWeapon.ammunitionRounds} Live Rounds`, isMono: true },
            { label: 'Vault Custody Status', value: detailWeapon.status },
            { label: 'Issued Guard Custodian', value: detailWeapon.assignedGuardName || 'None (Vault Protected)' },
            { label: 'Assigned Protected Post', value: detailWeapon.assignedSiteName || 'Central Armory Depot' },
          ]}
        />
      )}
    </div>
  );
};
