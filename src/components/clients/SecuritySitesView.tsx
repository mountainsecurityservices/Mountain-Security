/**
 * Mountain Security Services (MSS) - ERP Platform
 * SecuritySitesView.tsx (Phase 3 - Protected Physical Sites & Post Orders)
 */

import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Search,
  Shield,
  Clock,
  Phone,
  UserCheck,
  Building2,
  X,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { SecuritySite } from '../../types';

export const SecuritySitesView: React.FC = () => {
  const { securitySites, clients, createSecuritySite } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<SecuritySite>>({
    clientId: clients[0]?.id || '',
    name: '',
    code: '',
    address: '',
    city: 'Denver',
    siteInchargeName: '',
    siteInchargePhone: '',
    dayGuardsRequired: 4,
    nightGuardsRequired: 4,
    armedGuardsRequired: 1,
    specialInstructions: 'Strict access control and visitor badge logging required at main reception gate.',
    status: 'ACTIVE',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const count = securitySites.length + 1;
    const siteCode = `STE-${String(count).padStart(3, '0')}`;
    const selectedClient = clients.find((c) => c.id === formData.clientId) || clients[0];

    createSecuritySite({
      code: siteCode,
      name: formData.name || '',
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      address: formData.address || '',
      city: formData.city || 'Denver',
      siteInchargeName: formData.siteInchargeName || 'Captain In-Charge',
      siteInchargePhone: formData.siteInchargePhone || '+92 300 1234567',
      dayGuardsRequired: Number(formData.dayGuardsRequired) || 0,
      nightGuardsRequired: Number(formData.nightGuardsRequired) || 0,
      armedGuardsRequired: Number(formData.armedGuardsRequired) || 0,
      specialInstructions: formData.specialInstructions || '',
      status: 'ACTIVE',
    });

    setIsModalOpen(false);
  };

  const filteredSites = securitySites.filter((s) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.clientName.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Security Sites & Protected Locations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Physical deployment sites, required guard rosters, post orders, and emergency instructions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Site</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sites by name, client, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-72 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white"
          />
        </div>
        <span className="text-xs text-slate-500 font-mono">
          <strong>{filteredSites.length}</strong> Protected Sites Active
        </span>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSites.map((site) => (
          <div
            key={site.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  {site.code} • {site.city}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">{site.name}</h3>
                <p className="text-xs font-semibold text-slate-600">{site.clientName}</p>
              </div>
              <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800">
                {site.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Day Shift</span>
                <p className="text-sm font-black text-slate-900">{site.dayGuardsRequired}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Night Shift</span>
                <p className="text-sm font-black text-slate-900">{site.nightGuardsRequired}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Armed Post</span>
                <p className="text-sm font-black text-red-600">{site.armedGuardsRequired}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Site In-Charge: <strong>{site.siteInchargeName}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{site.siteInchargePhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{site.address}</span>
              </div>
            </div>

            {site.specialInstructions && (
              <div className="p-2.5 bg-amber-50/70 border border-amber-200/70 rounded-xl text-[11px] text-amber-900">
                <span className="font-bold">Post Orders: </span>
                {site.specialInstructions}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Site Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base tracking-tight font-['Space_Grotesk']">
                Register Protected Site Location
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Parent Client *</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Site / Facility Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Islamabad Industrial Complex - Gate 1 & 2"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Day Guards</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.dayGuardsRequired}
                    onChange={(e) => setFormData({ ...formData, dayGuardsRequired: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Night Guards</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.nightGuardsRequired}
                    onChange={(e) => setFormData({ ...formData, nightGuardsRequired: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Armed Post</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.armedGuardsRequired}
                    onChange={(e) => setFormData({ ...formData, armedGuardsRequired: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Site In-Charge / Supervisor</label>
                  <input
                    type="text"
                    value={formData.siteInchargeName}
                    onChange={(e) => setFormData({ ...formData, siteInchargeName: e.target.value })}
                    placeholder="e.g. Subedar Riaz Ahmed"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">In-Charge Contact</label>
                  <input
                    type="text"
                    value={formData.siteInchargePhone}
                    onChange={(e) => setFormData({ ...formData, siteInchargePhone: e.target.value })}
                    placeholder="+92 301 5554433"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Physical Address & City</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Plot 101, Sector I-9..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Special Post Orders</label>
                <textarea
                  rows={2}
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
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
                  Save Security Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
