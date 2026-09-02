/**
 * Mountain Security Services (MSS) - ERP Platform
 * ClientsDashboard.tsx (Phase 3 - Clients & Contracts Command Center)
 */

import React from 'react';
import {
  Users,
  Building2,
  FileCheck2,
  MapPin,
  Receipt,
  Plus,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const ClientsDashboard: React.FC = () => {
  const {
    company,
    clients,
    contracts,
    securitySites,
    clientInvoices,
    setActiveTab,
  } = useERP();

  const activeClientsCount = clients.filter((c) => c.status === 'ACTIVE').length;
  const activeContracts = contracts.filter((c) => c.status === 'ACTIVE');
  const totalMonthlyContractValue = activeContracts.reduce((sum, c) => sum + c.totalMonthlyValue, 0);

  const activeSitesCount = securitySites.filter((s) => s.status === 'ACTIVE').length;
  const totalRequiredGuards = securitySites.reduce(
    (sum, s) => sum + (s.dayGuardsRequired + s.nightGuardsRequired + s.armedGuardsRequired),
    0
  );

  const unpaidInvoices = clientInvoices.filter((inv) => inv.status !== 'PAID');
  const totalReceivable = unpaidInvoices.reduce((sum, inv) => sum + (inv.totalAmount - inv.paidAmount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
              Phase 3 • Client Operations & Contracts
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight mt-1">
            Clients, Contracts & Protected Sites
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Client portfolio, guard posts, SLA requirements, recurring billing, and collection receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('clients-list')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-blue-400" />
            <span>Manage All Clients ({clients.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Active Client Accounts
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {activeClientsCount} Clients
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {clients.length} total registered accounts
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Monthly Recurring Billing
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {company.currencySymbol} {totalMonthlyContractValue.toLocaleString()}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              Across {activeContracts.length} active SLA contracts
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Protected Security Sites
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {activeSitesCount} Active Posts
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Deploying {totalRequiredGuards} guard posts daily
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Unpaid Client Invoices
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {company.currencySymbol} {totalReceivable.toLocaleString()}
            </h3>
            <p className="text-xs text-amber-600 font-semibold mt-1">
              {unpaidInvoices.length} invoices awaiting collection
            </p>
          </div>
        </div>
      </div>

      {/* Module Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'clients-list', label: 'Clients Master Directory', desc: 'Corporate profiles & billing contacts', icon: <Users className="w-5 h-5" /> },
          { id: 'contracts-list', label: 'Security Contracts & SLAs', desc: 'Active agreements, terms & guard rates', icon: <FileCheck2 className="w-5 h-5" /> },
          { id: 'security-sites', label: 'Protected Physical Sites', desc: 'Locations, post orders & requirements', icon: <MapPin className="w-5 h-5" /> },
          { id: 'client-invoices', label: 'Billing & Invoicing', desc: 'Monthly auto-invoices & receipt vouchers', icon: <Receipt className="w-5 h-5" /> },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-xs text-left transition-all group space-y-2"
          >
            <div className="p-2.5 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 rounded-xl w-fit transition-colors">
              {item.icon}
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">{item.label}</h4>
            <p className="text-xs text-slate-500">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Active Clients List Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Key Client Accounts</h3>
          <button
            type="button"
            onClick={() => setActiveTab('clients-list')}
            className="text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            View Complete Client Directory →
          </button>
        </div>
        <div className="divide-y divide-slate-100 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Client Code</th>
                <th className="px-4 py-3">Company / Client Name</th>
                <th className="px-4 py-3">Industry Category</th>
                <th className="px-4 py-3">Primary Contact</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">City</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 font-mono font-bold text-slate-900">{client.code}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{client.name}</td>
                  <td className="px-4 py-3 text-slate-600">{client.category}</td>
                  <td className="px-4 py-3 text-slate-700">{client.contactPerson}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{client.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{client.city}</td>
                  <td className="px-6 py-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      {client.status}
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
