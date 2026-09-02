/**
 * Mountain Security Services (MSS) - ERP Platform
 * InventoryDashboard.tsx (Phase 6 - Armory, Uniforms & Equipment Command Center)
 */

import React from 'react';
import {
  ShieldAlert,
  Shirt,
  Radio,
  Package,
  Crosshair,
  CheckCircle2,
  AlertTriangle,
  ArrowDownUp,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const InventoryDashboard: React.FC = () => {
  const { weapons, uniformStock, setActiveTab } = useERP();

  const totalWeapons = weapons.length;
  const issuedWeapons = weapons.filter((w) => w.status === 'ISSUED').length;
  const inArmory = weapons.filter((w) => w.status === 'IN_ARMORY').length;
  const totalAmmo = weapons.reduce((sum, w) => sum + w.ammunitionRounds, 0);

  const totalUniformItems = uniformStock.reduce((sum, u) => sum + u.inStockQuantity, 0);
  const reorderUniforms = uniformStock.filter((u) => u.inStockQuantity <= u.reorderLevel).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono">
              Phase 6 • Armory & Logistics Inventory
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight mt-1">
            Armory, Uniforms & Tactical Equipment
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict chain of custody for licensed firearms, ammunition logs, tactical uniforms, and communications gear.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('weapons-ledger')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Crosshair className="w-4 h-4 text-purple-400" />
            <span>Weapons Vault & Custody</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Total Licensed Firearms
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Crosshair className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {totalWeapons} Registered
            </h3>
            <p className="text-xs text-purple-600 font-semibold mt-1">
              {issuedWeapons} Deployed on Active Duty
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Armory Safe Custody
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {inArmory} In Vault
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Secured in MSS HQ armory vault
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Ammunition Inventory
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {totalAmmo} Live Rounds
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              12 Bore / 9mm / 7.62mm calibers
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Uniforms & Gear Stock
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Shirt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {totalUniformItems} Units
            </h3>
            <p className="text-xs text-rose-600 font-semibold mt-1">
              {reorderUniforms} Items below reorder threshold
            </p>
          </div>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setActiveTab('weapons-ledger')}
          className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-xs text-left flex items-start gap-4 transition-all group"
        >
          <div className="p-3 bg-purple-50 group-hover:bg-purple-600 group-hover:text-white text-purple-600 rounded-xl transition-colors">
            <Crosshair className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Weapons & Firearm Custody Ledger</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Track weapon serial numbers, MOI licenses, caliber, issued guard, and site post custody.
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('uniforms-stock')}
          className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-xs text-left flex items-start gap-4 transition-all group"
        >
          <div className="p-3 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white text-blue-600 rounded-xl transition-colors">
            <Shirt className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Uniforms, Badges & Equipment Stock</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage tactical boots, MSS berets, shirts, belts, and issue to newly enlisted guards.
            </p>
          </div>
        </button>
      </div>

      {/* Weapons Snapshot Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Armory Inventory & Deployment Status</h3>
          <button
            type="button"
            onClick={() => setActiveTab('weapons-ledger')}
            className="text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            Manage Firearm Custody →
          </button>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Serial Number</th>
                <th className="px-4 py-3">Weapon Type / Model</th>
                <th className="px-4 py-3">Caliber</th>
                <th className="px-4 py-3">License Number</th>
                <th className="px-4 py-3 text-center">Live Ammo</th>
                <th className="px-4 py-3">Current Custodian</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {weapons.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 font-mono font-bold text-slate-900">{w.serialNumber}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{w.type} - {w.makeModel}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{w.caliber}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{w.licenseNumber}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-amber-700">
                    {w.ammunitionRounds} rds
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {w.assignedGuardName || <span className="text-slate-400">MSS HQ Vault</span>}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                      w.status === 'ISSUED' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
