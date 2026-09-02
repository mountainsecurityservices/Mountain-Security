/**
 * Mountain Security Services (MSS) - ERP Platform
 * App.tsx (Master Router & Layout Orchestrator)
 */

import React from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { LoginView } from './components/auth/LoginView';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { ToastContainer } from './components/common/ToastContainer';

// Phase 1 - Foundation, Dashboard, Company, Users, Roles, Settings
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { UserManagementView } from './components/users/UserManagementView';
import { RoleManagementView } from './components/roles/RoleManagementView';
import { PermissionsCatalogView } from './components/roles/PermissionsCatalogView';
import { CompanyProfileView } from './components/company/CompanyProfileView';
import { SystemSettingsView } from './components/settings/SystemSettingsView';
import { FutureModulesView } from './components/roadmap/FutureModulesView';

// Phase 2 - Accounts & Finance
import { AccountsDashboard } from './components/accounts/AccountsDashboard';
import { VouchersView } from './components/accounts/VouchersView';
import { ChartOfAccountsView } from './components/accounts/ChartOfAccountsView';
import { GeneralLedgerView } from './components/accounts/GeneralLedgerView';
import { CashAndBankView } from './components/accounts/CashAndBankView';
import { FinancialReportsView } from './components/accounts/FinancialReportsView';

// Phase 3 - Clients & Contracts
import { ClientsDashboard } from './components/clients/ClientsDashboard';
import { ClientsListView } from './components/clients/ClientsListView';
import { ContractsListView } from './components/clients/ContractsListView';
import { SecuritySitesView } from './components/clients/SecuritySitesView';
import { ClientInvoicesView } from './components/clients/ClientInvoicesView';

// Phase 4 - Operations & Guard Deployments
import { OperationsDashboard } from './components/operations/OperationsDashboard';
import { GuardsRosterView } from './components/operations/GuardsRosterView';
import { GuardAssignmentsView } from './components/operations/GuardAssignmentsView';
import { AttendanceView } from './components/operations/AttendanceView';
import { OvertimeManagementView } from './components/operations/OvertimeManagementView';

// Phase 5 - Payroll & Advances
import { PayrollDashboard } from './components/payroll/PayrollDashboard';
import { PayrollProcessingView } from './components/payroll/PayrollProcessingView';
import { EmployeeAdvancesView } from './components/payroll/EmployeeAdvancesView';

// Phase 6 - Armory, Firearms & Uniforms
import { InventoryDashboard } from './components/inventory/InventoryDashboard';
import { WeaponsLedgerView } from './components/inventory/WeaponsLedgerView';
import { UniformsStockView } from './components/inventory/UniformsStockView';

// Phase 7 & 8 - Executive Reports & Audit Logs
import { ExecutiveReportsView } from './components/reports/ExecutiveReportsView';
import { AuditLogsView } from './components/audit/AuditLogsView';

const MainLayout: React.FC = () => {
  const { isAuthenticated, activeTab } = useERP();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      // Phase 1 - Core Overview & Governance
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'company':
      case 'company-profile':
        return <CompanyProfileView />;
      case 'users':
        return <UserManagementView />;
      case 'roles':
        return <RoleManagementView />;
      case 'permissions':
        return <PermissionsCatalogView />;
      case 'settings':
        return <SystemSettingsView />;

      // Phase 2 - Accounts & Financial Modules
      case 'accounts':
        return <AccountsDashboard />;
      case 'vouchers':
        return <VouchersView />;
      case 'chart-of-accounts':
        return <ChartOfAccountsView />;
      case 'general-ledger':
        return <GeneralLedgerView />;
      case 'cash-bank':
        return <CashAndBankView />;
      case 'financial-reports':
        return <FinancialReportsView />;

      // Phase 3 - Clients & Contracts
      case 'clients-dashboard':
        return <ClientsDashboard />;
      case 'clients-list':
        return <ClientsListView />;
      case 'contracts-list':
        return <ContractsListView />;
      case 'security-sites':
        return <SecuritySitesView />;
      case 'client-invoices':
        return <ClientInvoicesView />;

      // Phase 4 - Operations & Guard Deployments
      case 'operations':
        return <OperationsDashboard />;
      case 'guards-roster':
        return <GuardsRosterView />;
      case 'guard-assignments':
        return <GuardAssignmentsView />;
      case 'attendance':
        return <AttendanceView />;
      case 'overtime':
        return <OvertimeManagementView />;

      // Phase 5 - Payroll & Advances
      case 'payroll':
        return <PayrollDashboard />;
      case 'payroll-processing':
        return <PayrollProcessingView />;
      case 'employee-advances':
        return <EmployeeAdvancesView />;

      // Phase 6 - Armory & Logistics
      case 'inventory':
        return <InventoryDashboard />;
      case 'weapons-ledger':
        return <WeaponsLedgerView />;
      case 'uniforms-stock':
        return <UniformsStockView />;

      // Phase 7 & 8 - Executive Reports & Audit Logs
      case 'executive-reports':
        return <ExecutiveReportsView />;
      case 'audit':
      case 'audit-logs':
        return <AuditLogsView />;

      // Phase 9+ Roadmap & Future Modules
      case 'future-modules':
      case 'future-module':
      default:
        return <FutureModulesView />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100/70 text-slate-800 antialiased font-['Plus_Jakarta_Sans'] selection:bg-slate-900 selection:text-white">
      {/* Collapsible Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full h-full overflow-hidden">
        {/* Sticky Header TopNav */}
        <TopNav />

        {/* Dynamic Viewport / Scrollable Content Area */}
        <main className="flex-1 min-w-0 w-full max-w-full overflow-y-auto overflow-x-auto p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto min-w-0">{renderActiveView()}</div>
        </main>
      </div>

      {/* Global Quick Search (Ctrl/Cmd + K) Modal */}
      <GlobalSearchModal />

      {/* Notification Toast Stream */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ERPProvider>
      <MainLayout />
    </ERPProvider>
  );
}
