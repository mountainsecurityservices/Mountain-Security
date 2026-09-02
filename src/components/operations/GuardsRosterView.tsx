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

export const GuardsRosterView: React.FC = () => {
  const { guards, createGuard } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArmed, setFilterArmed] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.cnic) return;

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

    setIsModalOpen(false);
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
            onClick={() => setIsModalOpen(true)}
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

              {guard.isArmedAuthorized ? (
                <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-red-100 text-red-800">
                  ARMED
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-100 text-slate-700">
                  UNARMED
                </span>
              )}
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

      {/* Enlist Guard Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base tracking-tight font-['Space_Grotesk']">
                Enlist New Security Guard Personnel
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
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
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-all"
                >
                  Enlist Guard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
