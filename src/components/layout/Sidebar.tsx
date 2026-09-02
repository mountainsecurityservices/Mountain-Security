/**
 * Mountain Security Services (MSS) - ERP Platform
 * Sidebar.tsx (Master ERP Navigation Bar)
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  Shield,
  Lock,
  FileText,
  Settings,
  ChevronRight,
  ChevronDown,
  Sparkles,
  LogOut,
  Wallet,
  Receipt,
  FileCheck2,
  BookOpen,
  MapPin,
  Clock,
  Shirt,
  Crosshair,
  TrendingUp,
  BarChart3,
  CreditCard,
  UserCheck,
} from 'lucide-react';
import { MSSLogo } from '../branding/MSSLogo';
import { useERP } from '../../context/ERPContext';
import { ActiveTab } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    currentUser,
    currentRole,
    activeTab,
    selectedFutureModule,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    hasPermission,
    isSuperAdmin,
    futureModules,
    logout,
  } = useERP();

  const [accountsOpen, setAccountsOpen] = useState(true);
  const [clientsOpen, setClientsOpen] = useState(true);
  const [opsOpen, setOpsOpen] = useState(true);
  const [payrollOpen, setPayrollOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);
  const [futureModulesOpen, setFutureModulesOpen] = useState(false);

  interface NavItem {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    permission?: string;
  }

  const canViewItem = (item: NavItem) => {
    if (!item.permission) return true;
    return isSuperAdmin() || hasPermission(item.permission);
  };

  const handleNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }
  };

  const renderNavButton = (item: NavItem) => {
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleNavClick(item.id)}
        title={sidebarCollapsed ? item.label : undefined}
        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
          isActive
            ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
        }`}
      >
        <span className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
          {item.icon}
        </span>
        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop for Sidebar Drawer */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:relative inset-y-0 left-0 z-40 md:z-30 shrink-0 flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out border-r border-slate-800 select-none no-print ${
          sidebarCollapsed ? 'hidden md:flex md:w-20' : 'flex w-64 sm:w-72 shadow-2xl md:shadow-none'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800 bg-slate-950">
          <MSSLogo
            mode={sidebarCollapsed ? 'collapsed' : 'compact'}
            light
            onClick={() => handleNavClick('dashboard')}
            className="cursor-pointer"
          />
        </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
        {/* 1. Core Overview */}
        <div className="space-y-1">
          {renderNavButton({
            id: 'dashboard',
            label: 'Executive Dashboard',
            icon: <LayoutDashboard className="w-4 h-4" />,
          })}
          {renderNavButton({
            id: 'company-profile',
            label: 'Company Profile',
            icon: <Building2 className="w-4 h-4" />,
            permission: 'company.view',
          })}
        </div>

        {/* 2. Accounts & Finance (Phase 2) */}
        <div>
          {!sidebarCollapsed ? (
            <div>
              <button
                type="button"
                onClick={() => setAccountsOpen(!accountsOpen)}
                className="flex w-full items-center justify-between px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 hover:text-slate-200 font-mono"
              >
                <span className="flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  Accounts & Finance
                </span>
                {accountsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
              {accountsOpen && (
                <nav className="space-y-0.5 pl-1">
                  {renderNavButton({ id: 'accounts', label: 'Finance Command Center', icon: <Wallet className="w-3.5 h-3.5" /> })}
                  {renderNavButton({ id: 'vouchers', label: 'Voucher Management (GL)', icon: <Receipt className="w-3.5 h-3.5" /> })}
                  {renderNavButton({ id: 'chart-of-accounts', label: 'Chart of Accounts', icon: <BookOpen className="w-3.5 h-3.5" /> })}
                  {renderNavButton({ id: 'general-ledger', label: 'General Ledger Statements', icon: <FileText className="w-3.5 h-3.5" /> })}
                  {renderNavButton({ id: 'cash-bank', label: 'Treasury & Bank Books', icon: <CreditCard className="w-3.5 h-3.5" /> })}
                  {renderNavButton({ id: 'financial-reports', label: 'Trial Balance, P&L & BS', icon: <TrendingUp className="w-3.5 h-3.5" /> })}
                </nav>
              )}
            </div>
          ) : (
            renderNavButton({ id: 'accounts', label: 'Accounts', icon: <Wallet className="w-4 h-4" /> })
          )}
        </div>

        {/* 3. Clients & Contracts (Phase 3) */}
        <div>
          {!sidebarCollapsed ? (
            <div>
              <button
                type="button"
                onClick={() => setClientsOpen(!clientsOpen)}
                className="flex w-full items-center justify-between px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 hover:text-slate-200 font-mono"
              >
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  Clients & Contracts
                </span>
                {clientsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
              {clientsOpen && (
                <nav className="space-y-0.5 pl-1">
                  {renderNavButton({ id: 'clients-dashboard', label: 'Client Accounts Hub', icon: <Building2 className="w-3.5 h-3.5" /> })}
                  {renderNavButton({ id: 'clients-list', label: 'Client Directory', icon: <Users className="w-3.5 h-3.5" /> })}
                  {renderNavButton({ id: 'contracts-list', label: 'Security SLAs & Contracts', icon: <FileCheck2 className="w-3.5 h-3.5" /> })}
                  {renderNavButton({ id: 'security-sites', label: 'Protected Physical Sites', icon: <MapPin className="w-3.5 h-3.5" /> })}
                  {renderNavButton({ id: 'client-invoices', label: 'Client Invoices & Receipts', icon: <Receipt className="w-3.5 h-3.5" /> })}
                </nav>
              )}
            </div>
          ) : (
            renderNavButton({ id: 'clients-dashboard', label: 'Clients Hub', icon: <Building2 className="w-4 h-4" /> })
          )}
        </div>

        {/* 4. Operations & Guards Force (Phase 4) */}
        <div>
          {!sidebarCollapsed ? (
            <div>
              <button
                type="button"
                onClick={() => setOpsOpen(!opsOpen)}
                className="flex w-full items-center justify-between px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 hover:text-slate-200 font-mono"
              >
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-red-400" />
                  Operations & Force
                </span>
                {opsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
              {opsOpen && (
                <nav className="space-y-0.5 pl-1">
                  {renderNavButton({ id: 'operations', label: 'Operations Command Center', icon: <Shield className="w-3.5 h-3.5" /> })}
                  {renderNavButton({ id: 'guards-roster', label: 'Guards Personnel Master', icon: <Users className="w-3.5 h-3.5" /> })}
                  {renderNavButton({ id: 'guard-assignments', label: 'Guard Post Deployments', icon: <MapPin className="w-3.5 h-3.5" /> })}
                  {renderNavButton({ id: 'attendance', label: 'Attendance & Roll Call', icon: <UserCheck className="w-3.5 h-3.5" /> })}
                  {renderNavButton({ id: 'overtime', label: 'Overtime & Double Shifts', icon: <Clock className="w-3.5 h-3.5" /> })}
                </nav>
              )}
            </div>
          ) : (
            renderNavButton({ id: 'operations', label: 'Operations', icon: <Shield className="w-4 h-4" /> })
          )}
        </div>

        {/* 5. Payroll & Advances (Phase 5) */}
        <div>
          {!sidebarCollapsed ? (
            <div>
              <button
                type="button"
                onClick={() => setPayrollOpen(!payrollOpen)}
                className="flex w-full items-center justify-between px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 hover:text-slate-200 font-mono"
              >
                <span className="flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                  Payroll & Salaries
                </span>
                {payrollOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
              {payrollOpen && (
                <nav className="space-y-0.5 pl-1">
                  {renderNavButton({ id: 'payroll', label: 'Payroll Center', icon: <Receipt className="w-3.5 h-3.5" /> })}
                  {renderNavButton({ id: 'payroll-processing', label: 'Monthly Payslip Run', icon: <FileText className="w-3.5 h-3.5" /> })}
                  {renderNavButton({ id: 'employee-advances', label: 'Guard Advances & Loans', icon: <CreditCard className="w-3.5 h-3.5" /> })}
                </nav>
              )}
            </div>
          ) : (
            renderNavButton({ id: 'payroll', label: 'Payroll', icon: <Receipt className="w-4 h-4" /> })
          )}
        </div>

        {/* 6. Armory & Inventory (Phase 6) */}
        <div>
          {!sidebarCollapsed ? (
            <div>
              <button
                type="button"
                onClick={() => setInventoryOpen(!inventoryOpen)}
                className="flex w-full items-center justify-between px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 hover:text-slate-200 font-mono"
              >
                <span className="flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-purple-400" />
                  Armory & Logistics
                </span>
                {inventoryOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
              {inventoryOpen && (
                <nav className="space-y-0.5 pl-1">
                  {renderNavButton({ id: 'inventory', label: 'Armory & Gear Hub', icon: <Crosshair className="w-3.5 h-3.5" /> })}
                  {renderNavButton({ id: 'weapons-ledger', label: 'Firearms Vault & Custody', icon: <Crosshair className="w-3.5 h-3.5" /> })}
                  {renderNavButton({ id: 'uniforms-stock', label: 'Uniforms & Equipment Stock', icon: <Shirt className="w-3.5 h-3.5" /> })}
                </nav>
              )}
            </div>
          ) : (
            renderNavButton({ id: 'inventory', label: 'Armory', icon: <Crosshair className="w-4 h-4" /> })
          )}
        </div>

        {/* 7. Executive Reports (Phase 7) & Audit */}
        <div className="space-y-1">
          {renderNavButton({
            id: 'executive-reports',
            label: 'Executive Reports & BI',
            icon: <BarChart3 className="w-4 h-4 text-cyan-400" />,
          })}
          {renderNavButton({
            id: 'audit-logs',
            label: 'Audit & Security Logs',
            icon: <FileText className="w-4 h-4 text-slate-400" />,
            permission: 'audit.view',
          })}
        </div>

        {/* 8. Governance & System Admin */}
        <div>
          {!sidebarCollapsed ? (
            <div>
              <button
                type="button"
                onClick={() => setAdminOpen(!adminOpen)}
                className="flex w-full items-center justify-between px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 hover:text-slate-200 font-mono"
              >
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  System Governance
                </span>
                {adminOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
              {adminOpen && (
                <nav className="space-y-0.5 pl-1">
                  {renderNavButton({ id: 'users', label: 'User Management', icon: <Users className="w-3.5 h-3.5" />, permission: 'users.view' })}
                  {renderNavButton({ id: 'roles', label: 'Role Management', icon: <Shield className="w-3.5 h-3.5" />, permission: 'roles.view' })}
                  {renderNavButton({ id: 'permissions', label: 'Permissions Matrix', icon: <Lock className="w-3.5 h-3.5" />, permission: 'permissions.view' })}
                  {renderNavButton({ id: 'settings', label: 'System Settings', icon: <Settings className="w-3.5 h-3.5" />, permission: 'settings.view' })}
                </nav>
              )}
            </div>
          ) : (
            renderNavButton({ id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> })
          )}
        </div>

        {/* 9. ERP Roadmap Archive */}
        <div>
          {!sidebarCollapsed ? (
            <div>
              <button
                type="button"
                onClick={() => setFutureModulesOpen(!futureModulesOpen)}
                className="flex w-full items-center justify-between px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 hover:text-slate-200 font-mono"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  ERP Module Roadmap ({futureModules.length})
                </span>
                {futureModulesOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {futureModulesOpen && (
                <div className="space-y-1 pl-2 border-l border-slate-800 ml-3">
                  {futureModules.slice(0, 10).map((mod) => {
                    const isSelected = activeTab === 'future-module' && selectedFutureModule?.id === mod.id;
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => setActiveTab('future-module', mod.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          isSelected ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-200'
                        }`}
                      >
                        <span className="truncate">{mod.name}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                          {mod.phase}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* User Footer Profile & Sign Out */}
      <div className="p-3 border-t border-slate-800 bg-slate-950">
        {!sidebarCollapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white font-bold text-xs shrink-0 font-['Space_Grotesk']">
                {currentUser
                  ? currentUser.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                  : 'MS'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate font-['Space_Grotesk']">
                  {currentUser?.fullName}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {currentRole?.name || 'Staff User'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={logout}
            title="Sign Out"
            className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
    </>
  );
};
