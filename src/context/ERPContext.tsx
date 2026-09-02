/**
 * Mountain Security Services (MSS) - ERP Platform
 * Central State Engine (ERPContext.tsx)
 * Manages full lifecycle state, double-entry ledger, operations, payroll,
 * weapons registry, backups, and the multi-step Danger Zone reset workflow.
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Company,
  Permission,
  Role,
  User,
  UserStatus,
  RoleStatus,
  AuditLog,
  NotificationItem,
  NotificationType,
  SystemSettings,
  ChartOfAccount,
  AccountingPeriod,
  Voucher,
  JournalEntry,
  CashAccount,
  BankAccount,
  Supplier,
  Client,
  SecurityContract,
  SecuritySite,
  GuardRequirement,
  ClientInvoice,
  ClientReceipt,
  GuardPersonnel,
  SecurityShift,
  GuardAssignment,
  DailyDeployment,
  AttendanceRecord,
  OvertimeRecord,
  SupervisorMonitoring,
  SalaryComponent,
  SalaryStructure,
  EmployeeSalarySetup,
  PayrollPeriod,
  EmployeeAdvance,
  EmployeeDeduction,
  PayrollEmployeeLine,
  SalaryPayment,
  ItemCategory,
  InventoryItem,
  Warehouse,
  StockMovement,
  UniformIssueRecord,
  EquipmentRecord,
  FixedAsset,
  ControlledItem,
  AuthorizedPersonnelRecord,
  ControlledCustodyMovement,
  ControlledIncident,
  SavedReport,
  ExportHistoryRecord,
  BackupPackage,
  ResetAllDataOptions,
  FutureModuleMeta,
  GuardAdvance,
  PayrollRecord,
  UniformItem,
  WeaponItem,
  ToastNotification,
} from '../types';

import {
  defaultCompany,
  defaultPermissions,
  defaultRoles,
  defaultUsers,
  defaultChartOfAccounts,
  defaultAccountingPeriods,
  defaultCashAccounts,
  defaultBankAccounts,
  defaultSuppliers,
  defaultVouchers,
  defaultJournalEntries,
  defaultClients,
  defaultContracts,
  defaultSecuritySites,
  defaultGuardRequirements,
  defaultClientInvoices,
  defaultClientReceipts,
  defaultShifts,
  defaultGuards,
  defaultGuardAssignments,
  defaultDailyDeployments,
  defaultAttendanceRecords,
  defaultOvertimeRecords,
  defaultSupervisorMonitoring,
  defaultSalaryComponents,
  defaultSalaryStructures,
  defaultEmployeeSalarySetups,
  defaultPayrollPeriods,
  defaultEmployeeAdvances,
  defaultEmployeeDeductions,
  defaultPayrollLines,
  defaultSalaryPayments,
  defaultItemCategories,
  defaultWarehouses,
  defaultInventoryItems,
  defaultStockMovements,
  defaultUniformIssues,
  defaultEquipmentRecords,
  defaultFixedAssets,
  defaultControlledItems,
  defaultAuthorizedPersonnel,
  defaultControlledMovements,
  defaultControlledIncidents,
  defaultSystemSettings,
  defaultAuditLogs,
  defaultNotifications,
  defaultExportHistory,
  defaultBackups,
  futureModulesRegistry,
} from '../data/seedData';

export interface ERPContextType {
  // Current user / auth
  isAuthenticated: boolean;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  currentUserRole: Role | undefined;
  currentRole: Role | undefined;
  hasPermission: (permissionCode: string) => boolean;
  isSuperAdmin: () => boolean;
  logout: () => void;

  // Active navigation & UI
  activeTab: string;
  setActiveTab: (tab: string, moduleId?: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (c: boolean) => void;
  futureModules: FutureModuleMeta[];
  selectedFutureModule: FutureModuleMeta | null;

  // Foundation State & Users/Roles
  company: Company;
  updateCompany: (data: Partial<Company>) => void;
  updateCompanyProfile: (data: Partial<Company>) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  login: (usernameOrEmail: string, pass: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPasswordWithToken: (arg1: string, arg2: string, arg3?: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  createUser: (userData: Partial<User>) => { success: boolean; error?: string };
  updateUser: (id: string, userData: Partial<User>) => { success: boolean; error?: string };
  deleteUser: (id: string) => { success: boolean; error?: string };
  setUserStatus: (id: string, status: UserStatus, reason?: string) => { success: boolean; error?: string };
  adminResetPassword: (id: string, pass: string) => { success: boolean; error?: string };
  getUserPermissions: (user: User) => string[];
  quickSwitchUser: (userId: string) => void;

  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  createRole: (roleData: Partial<Role>) => { success: boolean; error?: string };
  updateRole: (id: string, roleData: Partial<Role>) => { success: boolean; error?: string };
  deleteRole: (id: string) => { success: boolean; error?: string };
  setRoleStatus: (id: string, status: RoleStatus) => void;
  updateRolePermissions: (id: string, permissions: string[]) => void;

  permissions: Permission[];
  settings: SystemSettings;
  systemSettings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  updateSystemSettings: (newSettings: Partial<SystemSettings>) => void;

  auditLogs: AuditLog[];
  logAuditEvent: (event: Omit<AuditLog, 'id' | 'timestamp' | 'ipAddress'>) => void;
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => void;
  addToast: (msg: string, type?: NotificationType, title?: string) => void;
  toasts: ToastNotification[];
  removeToast: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;

  // Accounts State (Phase 2)
  accounts: ChartOfAccount[];
  chartOfAccounts: ChartOfAccount[];
  accountingPeriods: AccountingPeriod[];
  vouchers: Voucher[];
  journalEntries: JournalEntry[];
  cashAccounts: CashAccount[];
  bankAccounts: BankAccount[];
  suppliers: Supplier[];
  createVoucher: (voucher: Omit<Voucher, 'id' | 'createdAt' | 'createdBy' | 'status'>) => Voucher;
  updateVoucher: (id: string, voucherData: Partial<Voucher>) => { success: boolean; error?: string };
  deleteVoucher: (id: string) => { success: boolean; error?: string };
  approveVoucher: (id: string) => void;
  postVoucher: (id: string) => void;
  reverseVoucher: (id: string, reason: string) => void;
  createAccount: (account: Omit<ChartOfAccount, 'id' | 'balance'>) => void;
  updateAccount: (id: string, data: Partial<ChartOfAccount>) => void;
  deleteAccount: (id: string) => { success: boolean; error?: string };
  createBankAccount: (bank: Omit<BankAccount, 'id'>) => void;
  updateBankAccount: (id: string, data: Partial<BankAccount>) => void;
  deleteBankAccount: (id: string) => { success: boolean; error?: string };
  createCashAccount: (cash: Omit<CashAccount, 'id'>) => void;
  updateCashAccount: (id: string, data: Partial<CashAccount>) => void;
  deleteCashAccount: (id: string) => { success: boolean; error?: string };

  // Clients & Sites (Phase 3)
  clients: Client[];
  contracts: SecurityContract[];
  securitySites: SecuritySite[];
  guardRequirements: GuardRequirement[];
  clientInvoices: ClientInvoice[];
  clientReceipts: ClientReceipt[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'createdBy' | 'totalOutstanding'>) => Client;
  createClient: (client: any) => Client;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string, isArchive?: boolean) => { success: boolean; error?: string };
  restoreClient: (id: string) => void;
  addContract: (contract: Omit<SecurityContract, 'id' | 'createdAt'>) => SecurityContract;
  createContract: (contract: any) => SecurityContract;
  updateContract: (id: string, data: Partial<SecurityContract>) => void;
  deleteContract: (id: string) => { success: boolean; error?: string };
  addSecuritySite: (site: Omit<SecuritySite, 'id' | 'createdAt'>) => SecuritySite;
  createSecuritySite: (site: any) => SecuritySite;
  updateSecuritySite: (id: string, data: Partial<SecuritySite>) => void;
  deleteSecuritySite: (id: string) => { success: boolean; error?: string };
  createClientInvoice: (invoice: Omit<ClientInvoice, 'id' | 'createdAt' | 'paidAmount' | 'outstandingAmount'>) => ClientInvoice;
  updateClientInvoice: (id: string, data: Partial<ClientInvoice>) => { success: boolean; error?: string };
  deleteClientInvoice: (id: string) => { success: boolean; error?: string };
  recordClientReceipt: (receipt: Omit<ClientReceipt, 'id' | 'createdAt' | 'status'>) => ClientReceipt;
  deleteClientReceipt: (id: string) => { success: boolean; error?: string };
  recordInvoicePayment: (invoiceId: string, amount: number, paymentMethod?: string) => void;

  // Guards & Operations (Phase 4)
  guards: GuardPersonnel[];
  shifts: SecurityShift[];
  guardAssignments: GuardAssignment[];
  dailyDeployments: DailyDeployment[];
  attendanceRecords: AttendanceRecord[];
  overtimeRecords: OvertimeRecord[];
  supervisorMonitoring: SupervisorMonitoring[];
  addGuard: (guard: Omit<GuardPersonnel, 'id' | 'createdAt'>) => GuardPersonnel;
  createGuard: (guard: any) => GuardPersonnel;
  updateGuard: (id: string, data: Partial<GuardPersonnel>) => void;
  deleteGuard: (id: string, isArchive?: boolean) => { success: boolean; error?: string };
  restoreGuard: (id: string) => void;
  addGuardAssignment: (asg: Omit<GuardAssignment, 'id' | 'createdAt'>) => GuardAssignment;
  createGuardAssignment: (asg: any) => GuardAssignment;
  updateGuardAssignment: (id: string, data: Partial<GuardAssignment>) => { success: boolean; error?: string };
  deleteGuardAssignment: (id: string) => { success: boolean; error?: string };
  recordDailyDeployment: (dep: Omit<DailyDeployment, 'id' | 'createdAt'>) => DailyDeployment;
  recordAttendance: (att: Omit<AttendanceRecord, 'id'>) => void;
  updateAttendance: (id: string, data: Partial<AttendanceRecord>) => { success: boolean; error?: string };
  deleteAttendance: (id: string) => { success: boolean; error?: string };
  recordOvertime: (ot: any) => void;
  updateOvertime: (id: string, data: Partial<OvertimeRecord>) => { success: boolean; error?: string };
  deleteOvertime: (id: string) => { success: boolean; error?: string };
  approveOvertime: (id: string) => void;
  rejectOvertime: (id: string) => void;

  // Payroll & Advances (Phase 5)
  salaryComponents: SalaryComponent[];
  salaryStructures: SalaryStructure[];
  employeeSalarySetups: EmployeeSalarySetup[];
  payrollPeriods: PayrollPeriod[];
  employeeAdvances: EmployeeAdvance[];
  guardAdvances: GuardAdvance[];
  createGuardAdvance: (adv: Omit<GuardAdvance, 'id'>) => void;
  employeeDeductions: EmployeeDeduction[];
  payrollLines: PayrollEmployeeLine[];
  payrollRecords: PayrollRecord[];
  salaryPayments: SalaryPayment[];
  requestAdvance: (adv: Omit<EmployeeAdvance, 'id' | 'createdAt' | 'paidAmount' | 'recoveredAmount' | 'outstandingBalance' | 'status'>) => void;
  updateAdvance: (id: string, data: Partial<EmployeeAdvance>) => { success: boolean; error?: string };
  deleteAdvance: (id: string) => { success: boolean; error?: string };
  approveAdvance: (id: string) => void;
  processPayrollPeriod: (periodId: string) => void;
  approvePayrollPeriod: (periodId: string) => void;
  updatePayrollRecord: (id: string, data: Partial<PayrollRecord>) => { success: boolean; error?: string };
  deletePayrollRecord: (id: string) => { success: boolean; error?: string };
  disburseSalaryPayment: (payment: Omit<SalaryPayment, 'id' | 'createdAt' | 'status'>) => void;

  // Inventory, Armory & Uniforms (Phase 6)
  itemCategories: ItemCategory[];
  inventoryItems: InventoryItem[];
  uniformStock: UniformItem[];
  createUniformItem: (item: Omit<UniformItem, 'id'>) => void;
  updateUniformItem: (id: string, data: Partial<UniformItem>) => { success: boolean; error?: string };
  deleteUniformItem: (id: string) => { success: boolean; error?: string };
  weapons: WeaponItem[];
  weaponsStock: WeaponItem[];
  createWeapon: (item: any) => void;
  createWeaponItem: (item: Omit<WeaponItem, 'id'>) => void;
  updateWeaponItem: (id: string, data: Partial<WeaponItem>) => { success: boolean; error?: string };
  deleteWeaponItem: (id: string) => { success: boolean; error?: string };
  issueWeapon: (weaponId: string, guardId?: string, notes?: string) => void;
  issueWeaponToGuard: (weaponId: string, guardId: string) => void;
  returnWeapon: (weaponId: string, notes?: string) => void;
  warehouses: Warehouse[];
  stockMovements: StockMovement[];
  uniformIssues: UniformIssueRecord[];
  equipmentRecords: EquipmentRecord[];
  fixedAssets: FixedAsset[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'totalQuantity' | 'availableQuantity' | 'issuedQuantity'>) => void;
  updateInventoryItem: (id: string, data: Partial<InventoryItem>) => { success: boolean; error?: string };
  deleteInventoryItem: (id: string) => { success: boolean; error?: string };
  recordStockMovement: (movement: Omit<StockMovement, 'id' | 'createdAt' | 'status'>) => void;
  issueUniformToGuard: (itemIdOrRecord: string | Omit<UniformIssueRecord, 'id' | 'status'>, guardId?: string, qty?: number) => void;
  returnUniformFromGuard: (id: string, returnCondition: any) => void;

  // Controlled Equipment (Phase 7 - High Security)
  controlledItems: ControlledItem[];
  authorizedPersonnel: AuthorizedPersonnelRecord[];
  controlledMovements: ControlledCustodyMovement[];
  controlledIncidents: ControlledIncident[];
  registerControlledItem: (item: Omit<ControlledItem, 'id' | 'recordNumber' | 'registrationDate'>) => ControlledItem;
  updateControlledItem: (id: string, data: Partial<ControlledItem>) => void;
  deleteControlledItem: (id: string) => { success: boolean; error?: string };
  recordControlledMovement: (mov: Omit<ControlledCustodyMovement, 'id' | 'movementNumber'>) => void;
  reportControlledIncident: (inc: Omit<ControlledIncident, 'id' | 'incidentNumber' | 'dateReported' | 'status'>) => void;

  // Reports & Export History (Phase 8)
  savedReports: SavedReport[];
  exportHistory: ExportHistoryRecord[];
  recordExportAction: (exp: Omit<ExportHistoryRecord, 'id' | 'timestamp' | 'userName' | 'userRole'>) => void;

  // System Control & Danger Zone (Phase 9)
  backups: BackupPackage[];
  createBackupSnapshot: (name: string, type: BackupPackage['type']) => BackupPackage;
  restoreFromBackup: (backupId: string) => boolean;
  executeResetAllData: (options: ResetAllDataOptions) => { success: boolean; safetyBackupId: string; summary: string[] };
  resetToFactoryDefaults: () => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'mss_erp_v2_data_store';

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or use initial fixtures
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load saved ERP state:', e);
    }
    return null;
  };

  const initial = loadInitialState();

  // Foundation
  const [currentUser, setCurrentUser] = useState<User>(initial?.currentUser || defaultUsers[0]);
  const [activeTab, setActiveTabRaw] = useState<string>('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const [company, setCompany] = useState<Company>(initial?.company || defaultCompany);
  const [users, setUsers] = useState<User[]>(initial?.users || defaultUsers);
  const [roles, setRoles] = useState<Role[]>(initial?.roles || defaultRoles);
  const [permissions] = useState<Permission[]>(defaultPermissions);
  const [settings, setSettings] = useState<SystemSettings>(initial?.settings || defaultSystemSettings);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initial?.auditLogs || defaultAuditLogs);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initial?.notifications || defaultNotifications);

  // Accounts
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>(initial?.chartOfAccounts || defaultChartOfAccounts);
  const [accountingPeriods, setAccountingPeriods] = useState<AccountingPeriod[]>(initial?.accountingPeriods || defaultAccountingPeriods);
  const [vouchers, setVouchers] = useState<Voucher[]>(initial?.vouchers || defaultVouchers);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(initial?.journalEntries || defaultJournalEntries);
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>(initial?.cashAccounts || defaultCashAccounts);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initial?.bankAccounts || defaultBankAccounts);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initial?.suppliers || defaultSuppliers);

  // Clients & Sites
  const [clients, setClients] = useState<Client[]>(() => {
    const rawClients = initial?.clients || defaultClients;
    return rawClients.map((c: any) => ({
      ...c,
      contractsCount: c.contractsCount ?? 1,
      guardedSitesCount: c.guardedSitesCount ?? 2,
      activeGuardsCount: c.activeGuardsCount ?? 6,
    }));
  });

  const [contracts, setContracts] = useState<SecurityContract[]>(() => {
    const rawContracts = initial?.contracts || defaultContracts;
    return rawContracts.map((c: any) => ({
      ...c,
      totalMonthlyValue: c.totalMonthlyValue ?? c.monthlyRate ?? c.contractValue ?? 250000,
      unarmedGuardsCount: c.unarmedGuardsCount ?? 4,
      armedGuardsCount: c.armedGuardsCount ?? 2,
    }));
  });

  const [securitySites, setSecuritySites] = useState<SecuritySite[]>(() => {
    const rawSites = initial?.securitySites || defaultSecuritySites;
    return rawSites.map((s: any) => ({
      ...s,
      code: s.code || s.siteCode || 'SIT-001',
    }));
  });

  const [guardRequirements, setGuardRequirements] = useState<GuardRequirement[]>(initial?.guardRequirements || defaultGuardRequirements);
  const [clientInvoices, setClientInvoices] = useState<ClientInvoice[]>(() => {
    const rawInvoices = initial?.clientInvoices || defaultClientInvoices;
    return rawInvoices.map((inv: any) => ({
      ...inv,
      totalAmount: inv.totalAmount ?? inv.grandTotal ?? 350000,
    }));
  });
  const [clientReceipts, setClientReceipts] = useState<ClientReceipt[]>(initial?.clientReceipts || defaultClientReceipts);

  // Guards & Operations
  const [guards, setGuards] = useState<GuardPersonnel[]>(() => {
    const rawGuards = initial?.guards || defaultGuards;
    return rawGuards.map((g: any) => ({
      ...g,
      guardCode: g.guardCode || g.employeeCode || 'MSS-001',
      monthlyBasicSalary: g.monthlyBasicSalary || 32000,
      isArmedAuthorized: g.isArmedAuthorized ?? g.isArmedCertified ?? false,
    }));
  });
  const [shifts, setShifts] = useState<SecurityShift[]>(initial?.shifts || defaultShifts);
  const [guardAssignments, setGuardAssignments] = useState<GuardAssignment[]>(initial?.guardAssignments || defaultGuardAssignments);
  const [dailyDeployments, setDailyDeployments] = useState<DailyDeployment[]>(initial?.dailyDeployments || defaultDailyDeployments);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initial?.attendanceRecords || defaultAttendanceRecords);
  const [overtimeRecords, setOvertimeRecords] = useState<OvertimeRecord[]>(() => {
    const rawOT = initial?.overtimeRecords || defaultOvertimeRecords;
    return rawOT.map((ot: any) => ({
      ...ot,
      hourlyRate: ot.hourlyRate || ot.ratePerHour || 250,
      totalAmount: ot.totalAmount || ot.overtimeAmount || (ot.approvedOvertimeHours || 4) * 250,
    }));
  });
  const [supervisorMonitoring, setSupervisorMonitoring] = useState<SupervisorMonitoring[]>(initial?.supervisorMonitoring || defaultSupervisorMonitoring);

  // Payroll
  const [salaryComponents, setSalaryComponents] = useState<SalaryComponent[]>(initial?.salaryComponents || defaultSalaryComponents);
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>(initial?.salaryStructures || defaultSalaryStructures);
  const [employeeSalarySetups, setEmployeeSalarySetups] = useState<EmployeeSalarySetup[]>(initial?.employeeSalarySetups || defaultEmployeeSalarySetups);
  const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriod[]>(initial?.payrollPeriods || defaultPayrollPeriods);
  const [employeeAdvances, setEmployeeAdvances] = useState<EmployeeAdvance[]>(initial?.employeeAdvances || defaultEmployeeAdvances);
  const [employeeDeductions, setEmployeeDeductions] = useState<EmployeeDeduction[]>(initial?.employeeDeductions || defaultEmployeeDeductions);
  const [payrollLines, setPayrollLines] = useState<PayrollEmployeeLine[]>(initial?.payrollLines || defaultPayrollLines);
  const [salaryPayments, setSalaryPayments] = useState<SalaryPayment[]>(initial?.salaryPayments || defaultSalaryPayments);

  // Guard Advances Derived / Local
  const [guardAdvancesList, setGuardAdvancesList] = useState<GuardAdvance[]>(() => {
    if (initial?.guardAdvancesList) return initial.guardAdvancesList;
    return defaultGuards.slice(0, 4).map((g, idx) => ({
      id: `adv-${idx + 1}`,
      guardId: g.id,
      guardCode: g.employeeCode,
      guardName: g.fullName,
      advanceAmount: 15000 + idx * 5000,
      approvedAmount: 15000 + idx * 5000,
      monthlyDeduction: 5000,
      remainingBalance: 10000 + idx * 3000,
      outstandingBalance: 10000 + idx * 3000,
      requestDate: '2026-08-15',
      status: idx === 3 ? 'PENDING' : 'APPROVED',
      reason: idx % 2 === 0 ? 'Medical emergency assistance' : 'Family wedding advance',
    }));
  });

  // Payroll Records Local State
  const [payrollRecordsList, setPayrollRecordsList] = useState<PayrollRecord[]>(() => {
    if (initial?.payrollRecordsList) return initial.payrollRecordsList;
    return defaultGuards.map((g, idx) => {
      const basic = g.monthlyBasicSalary || (g.isArmedCertified ? 42000 : 34000);
      const otHours = idx % 2 === 0 ? 16 : 8;
      const otAmount = otHours * 250;
      const allowances = 3000;
      const gross = basic + otAmount + allowances;
      const advDed = idx < 3 ? 5000 : 0;
      const unifDed = idx === 1 ? 2000 : 0;
      const tax = Math.round(basic * 0.02);
      const totalDed = advDed + unifDed + tax;
      const net = gross - totalDed;

      return {
        id: `pay-rec-${idx + 1}`,
        guardId: g.id,
        guardCode: g.employeeCode,
        guardName: g.fullName,
        designation: g.designation,
        siteName: g.currentSiteName || 'Sitara Chemicals HQ',
        basicSalary: basic,
        dutyDays: 30,
        overtimeHours: otHours,
        overtimeAmount: otAmount,
        allowances,
        grossSalary: gross,
        advancesDeduction: advDed,
        uniformDeductions: unifDed,
        penalties: 0,
        taxDeduction: tax,
        totalDeductions: totalDed,
        netPayable: net,
        month: 'August',
        year: 2026,
        status: idx < 2 ? 'PAID' : 'APPROVED',
        processedAt: '2026-08-31 18:00',
      };
    });
  });

  // Uniform Stock
  const [uniformStockList, setUniformStockList] = useState<UniformItem[]>(() => {
    if (initial?.uniformStockList) return initial.uniformStockList;
    return [
      { id: 'uni-1', itemCode: 'UNI-SHIRT-M', name: 'Tactical Duty Shirt (Medium)', category: 'Uniform', size: 'Medium', inStockQuantity: 120, reorderLevel: 25, costPerUnit: 1400 },
      { id: 'uni-2', itemCode: 'UNI-SHIRT-L', name: 'Tactical Duty Shirt (Large)', category: 'Uniform', size: 'Large', inStockQuantity: 150, reorderLevel: 30, costPerUnit: 1400 },
      { id: 'uni-3', itemCode: 'UNI-PANTS-32', name: 'MSS Cargo Trousers (32")', category: 'Uniform', size: '32"', inStockQuantity: 85, reorderLevel: 20, costPerUnit: 1600 },
      { id: 'uni-4', itemCode: 'UNI-PANTS-34', name: 'MSS Cargo Trousers (34")', category: 'Uniform', size: '34"', inStockQuantity: 110, reorderLevel: 25, costPerUnit: 1600 },
      { id: 'uni-5', itemCode: 'UNI-BOOT-42', name: 'Steel-Toe Tactical Combat Boots', category: 'Footwear', size: 'Size 42', inStockQuantity: 45, reorderLevel: 15, costPerUnit: 4500 },
      { id: 'uni-6', itemCode: 'UNI-BERET-NAVY', name: 'MSS Crest Navy Beret & Insignia', category: 'Headwear', size: 'One Size', inStockQuantity: 200, reorderLevel: 40, costPerUnit: 800 },
      { id: 'uni-7', itemCode: 'UNI-BELT-DUTY', name: 'Heavy-Duty Webbing Security Belt', category: 'Gear', size: 'Adjustable', inStockQuantity: 95, reorderLevel: 20, costPerUnit: 1100 },
      { id: 'uni-8', itemCode: 'UNI-JACKET-WINT', name: 'Thermal Patrol Jacket with MSS Badges', category: 'Uniform', size: 'Large', inStockQuantity: 18, reorderLevel: 20, costPerUnit: 5200 },
    ];
  });

  // Weapon Stock
  const [weaponsStockList, setWeaponsStockList] = useState<WeaponItem[]>(() => {
    if (initial?.weaponsStockList) return initial.weaponsStockList;
    return [
      {
        id: 'wpn-1',
        itemCode: 'WPN-GLK-001',
        serialNumber: 'BDX-9948-AUT',
        type: '9mm Semi-Automatic Pistol',
        caliber: '9x19mm Parabellum',
        assignedGuardId: defaultGuards[1]?.id,
        assignedGuardName: defaultGuards[1]?.fullName || 'Zulfiqar Ali',
        assignedSiteId: defaultSecuritySites[0]?.id,
        assignedSiteName: defaultSecuritySites[0]?.name || 'Sitara Chemicals HQ Complex',
        licenseNumber: 'ARM-PUN-771829',
        licenseExpiry: '2027-08-20',
        status: 'ISSUED',
        condition: 'Excellent',
      },
      {
        id: 'wpn-2',
        itemCode: 'WPN-SHT-002',
        serialNumber: 'SG-12GA-7721',
        type: '12-Gauge Pump Action Shotgun',
        caliber: '12 Bore',
        assignedGuardId: undefined,
        assignedGuardName: undefined,
        assignedSiteId: undefined,
        assignedSiteName: undefined,
        licenseNumber: 'ARM-FED-883912',
        licenseExpiry: '2028-02-14',
        status: 'IN_VAULT',
        condition: 'Good',
      },
      {
        id: 'wpn-3',
        itemCode: 'WPN-GLK-003',
        serialNumber: 'BDX-9952-AUT',
        type: '9mm Semi-Automatic Pistol',
        caliber: '9x19mm Parabellum',
        assignedGuardId: defaultGuards[0]?.id,
        assignedGuardName: defaultGuards[0]?.fullName || 'Muhammad Ramzan',
        assignedSiteId: defaultSecuritySites[1]?.id,
        assignedSiteName: defaultSecuritySites[1]?.name || 'Habib Metropolitan Bank Main Vault',
        licenseNumber: 'ARM-ISB-662910',
        licenseExpiry: '2027-11-30',
        status: 'ISSUED',
        condition: 'Excellent',
      },
      {
        id: 'wpn-4',
        itemCode: 'WPN-BER-004',
        serialNumber: 'BER-92FS-4419',
        type: 'Beretta 92FS 9mm Pistol',
        caliber: '9x19mm',
        assignedGuardId: undefined,
        assignedGuardName: undefined,
        assignedSiteId: undefined,
        assignedSiteName: undefined,
        licenseNumber: 'ARM-KHI-331908',
        licenseExpiry: '2026-10-15',
        status: 'IN_VAULT',
        condition: 'Maintenance Due',
      },
    ];
  });

  // Inventory & Assets
  const [itemCategories, setItemCategories] = useState<ItemCategory[]>(initial?.itemCategories || defaultItemCategories);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initial?.inventoryItems || defaultInventoryItems);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initial?.warehouses || defaultWarehouses);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initial?.stockMovements || defaultStockMovements);
  const [uniformIssues, setUniformIssues] = useState<UniformIssueRecord[]>(initial?.uniformIssues || defaultUniformIssues);
  const [equipmentRecords, setEquipmentRecords] = useState<EquipmentRecord[]>(initial?.equipmentRecords || defaultEquipmentRecords);
  const [fixedAssets, setFixedAssets] = useState<FixedAsset[]>(initial?.fixedAssets || defaultFixedAssets);

  // Controlled Equipment
  const [controlledItems, setControlledItems] = useState<ControlledItem[]>(initial?.controlledItems || defaultControlledItems);
  const [authorizedPersonnel, setAuthorizedPersonnel] = useState<AuthorizedPersonnelRecord[]>(initial?.authorizedPersonnel || defaultAuthorizedPersonnel);
  const [controlledMovements, setControlledMovements] = useState<ControlledCustodyMovement[]>(initial?.controlledMovements || defaultControlledMovements);
  const [controlledIncidents, setControlledIncidents] = useState<ControlledIncident[]>(initial?.controlledIncidents || defaultControlledIncidents);

  // Reports & Audits
  const [savedReports, setSavedReports] = useState<SavedReport[]>(initial?.savedReports || []);
  const [exportHistory, setExportHistory] = useState<ExportHistoryRecord[]>(initial?.exportHistory || defaultExportHistory);
  const [backups, setBackups] = useState<BackupPackage[]>(initial?.backups || defaultBackups);

  // Global search & transient toasts
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Save to localStorage on state changes
  useEffect(() => {
    const snapshot = {
      currentUser,
      company,
      users,
      roles,
      settings,
      auditLogs,
      notifications,
      chartOfAccounts,
      accountingPeriods,
      vouchers,
      journalEntries,
      cashAccounts,
      bankAccounts,
      suppliers,
      clients,
      contracts,
      securitySites,
      guardRequirements,
      clientInvoices,
      clientReceipts,
      guards,
      shifts,
      guardAssignments,
      dailyDeployments,
      attendanceRecords,
      overtimeRecords,
      supervisorMonitoring,
      salaryComponents,
      salaryStructures,
      employeeSalarySetups,
      payrollPeriods,
      employeeAdvances,
      guardAdvancesList,
      payrollRecordsList,
      employeeDeductions,
      payrollLines,
      salaryPayments,
      itemCategories,
      inventoryItems,
      uniformStockList,
      weaponsStockList,
      warehouses,
      stockMovements,
      uniformIssues,
      equipmentRecords,
      fixedAssets,
      controlledItems,
      authorizedPersonnel,
      controlledMovements,
      controlledIncidents,
      savedReports,
      exportHistory,
      backups,
    };
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(snapshot));
    } catch (e) {
      console.warn('Could not persist ERP state to local storage:', e);
    }
  }, [
    currentUser,
    company,
    users,
    roles,
    settings,
    auditLogs,
    notifications,
    chartOfAccounts,
    accountingPeriods,
    vouchers,
    journalEntries,
    cashAccounts,
    bankAccounts,
    suppliers,
    clients,
    contracts,
    securitySites,
    guardRequirements,
    clientInvoices,
    clientReceipts,
    guards,
    shifts,
    guardAssignments,
    dailyDeployments,
    attendanceRecords,
    overtimeRecords,
    supervisorMonitoring,
    salaryComponents,
    salaryStructures,
    employeeSalarySetups,
    payrollPeriods,
    employeeAdvances,
    guardAdvancesList,
    payrollRecordsList,
    employeeDeductions,
    payrollLines,
    salaryPayments,
    itemCategories,
    inventoryItems,
    uniformStockList,
    weaponsStockList,
    warehouses,
    stockMovements,
    uniformIssues,
    equipmentRecords,
    fixedAssets,
    controlledItems,
    authorizedPersonnel,
    controlledMovements,
    controlledIncidents,
    savedReports,
    exportHistory,
    backups,
  ]);

  // Auth & RBAC
  const currentUserRole = useMemo(() => {
    return roles.find((r) => r.id === currentUser.primaryRoleId) || roles[0];
  }, [roles, currentUser]);

  const login = async (usernameOrEmail: string, _pass: string, _rememberMe?: boolean) => {
    const target = users.find(
      (u) =>
        u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
        (u.email && u.email.toLowerCase() === usernameOrEmail.toLowerCase())
    );

    if (!target) {
      return { success: false, error: 'Invalid username/email or password.' };
    }

    if (target.status === 'suspended') {
      return { success: false, error: 'This user account is currently suspended. Please contact Security Administrator.' };
    }

    setCurrentUser(target);
    addToast(`Authenticated as ${target.fullName} (${target.designation || 'Staff'}).`, 'success');
    logAuditEvent({
      userId: target.id,
      userName: target.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'LOGIN',
      module: 'Security & Auth',
      resource: 'User Session',
      details: `User ${target.username} logged in successfully`,
      status: 'success',
    });
    return { success: true };
  };

  const requestPasswordReset = async (email: string) => {
    addToast(`Password recovery verification code sent to ${email}`, 'info');
    return { success: true };
  };

  const resetPasswordWithToken = async (_arg1: string, _arg2: string, _arg3?: string) => {
    addToast('Your password has been successfully reset. Please log in with your new credentials.', 'success');
    return { success: true, message: 'Password has been successfully updated.' };
  };

  const hasPermission = (permissionCode: string): boolean => {
    if (!currentUserRole) return false;
    if (currentUserRole.code === 'SUPER_ADMIN' || currentUserRole.name.toLowerCase().includes('super admin')) {
      return true;
    }
    return currentUserRole.permissionCodes.includes(permissionCode);
  };

  const isSuperAdmin = (): boolean => {
    return (
      currentUser.username === 'tariq.khan' ||
      currentUserRole?.code === 'SUPER_ADMIN' ||
      currentUserRole?.name.toLowerCase().includes('super')
    );
  };

  const logout = () => {
    addToast('Signed out of Mountain Security Services ERP.', 'info');
  };

  const setActiveTab = (tab: string, moduleId?: string) => {
    setActiveTabRaw(tab);
    if (moduleId) {
      setSelectedModuleId(moduleId);
    }
  };

  const selectedFutureModule = useMemo(() => {
    if (!selectedModuleId) return futureModulesRegistry[0] || null;
    return futureModulesRegistry.find((m) => m.id === selectedModuleId) || futureModulesRegistry[0] || null;
  }, [selectedModuleId]);

  // Audits & Notifications
  const logAuditEvent = (event: Omit<AuditLog, 'id' | 'timestamp' | 'ipAddress'>) => {
    const newLog: AuditLog = {
      ...event,
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.1.100',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = (msg: string, type: NotificationType = 'info', title?: string) => {
    const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const toastType: 'success' | 'error' | 'warning' | 'info' =
      type === 'critical' || type === 'error' ? 'error' : type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'info';
    setToasts((prev) => [...prev, { id: toastId, message: msg, type: toastType, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 4000);

    addNotification({
      title: title || 'MSS Notification',
      message: msg,
      type,
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markNotificationAsRead = (id: string) => markNotificationRead(id);

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAllNotificationsAsRead = () => markAllNotificationsRead();

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const quickSwitchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      addToast(`Switched active session to ${target.fullName} (${target.designation || 'Staff'}).`, 'info');
    }
  };

  // Company & Settings
  const updateCompany = (data: Partial<Company>) => {
    setCompany((prev) => ({ ...prev, ...data }));
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'UPDATE_COMPANY',
      module: 'Foundation',
      resource: 'Company Profile',
      details: 'Updated Mountain Security Services corporate configuration.',
      status: 'success',
    });
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'UPDATE_SETTINGS',
      module: 'System',
      resource: 'Governance Settings',
      details: 'Updated system security and notification policies.',
      status: 'success',
    });
  };

  // Users & Roles
  const createUser = (userData: Partial<User>) => {
    try {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        fullName: userData.fullName || 'New User',
        username: userData.username || `user_${Date.now()}`,
        email: userData.email || '',
        phone: userData.phone || '',
        primaryRoleId: userData.primaryRoleId || roles[0]?.id || 'role-operator',
        additionalRoleIds: userData.additionalRoleIds || [],
        status: userData.status || 'active',
        department: userData.department || 'Operations',
        designation: userData.designation || 'Staff',
        createdAt: new Date().toISOString(),
        createdBy: currentUser.fullName,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.fullName,
      };
      setUsers((prev) => [newUser, ...prev]);
      addToast(`Created user account: ${newUser.fullName}`, 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to create user' };
    }
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    try {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...userData, updatedAt: new Date().toISOString(), updatedBy: currentUser.fullName } : u)));
      addToast('User details updated successfully.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update user' };
    }
  };

  const deleteUser = (id: string) => {
    try {
      const target = users.find((u) => u.id === id);
      if (!target) return { success: false, error: 'User not found' };
      if (target.id === currentUser.id) {
        addToast('You cannot delete your own active logged-in account.', 'error');
        return { success: false, error: 'Cannot delete current user session' };
      }
      if (target.username === 'tariq.khan') {
        addToast('Master Super Admin user account is protected and cannot be deleted.', 'error');
        return { success: false, error: 'Super Admin account is protected' };
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_DELETE',
        module: 'Users',
        resource: 'User Management',
        recordId: target.id,
        recordTitle: target.fullName,
        details: `Deleted user account: ${target.fullName} (${target.username})`,
        status: 'success',
      });
      addToast(`User ${target.fullName} deleted.`, 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete user' };
    }
  };

  const setUserStatus = (id: string, status: UserStatus, _reason?: string) => {
    try {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
      addToast(`User status set to ${status}.`, 'info');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update user status' };
    }
  };

  const adminResetPassword = (id: string, _pass: string) => {
    addToast('Password reset token generated and sent to user email.', 'success');
    return { success: true };
  };

  const getUserPermissions = (user: User): string[] => {
    const role = roles.find((r) => r.id === user.primaryRoleId);
    if (!role) return [];
    if (role.code === 'SUPER_ADMIN') return permissions.map((p) => p.code);
    return role.permissionCodes || [];
  };

  const createRole = (roleData: Partial<Role>) => {
    try {
      const newRole: Role = {
        id: `role-${Date.now()}`,
        name: roleData.name || 'New Role',
        code: roleData.code || `ROLE_${Date.now()}`,
        description: roleData.description || '',
        isSystem: false,
        status: 'active',
        permissionCodes: roleData.permissionCodes || [],
        createdAt: new Date().toISOString(),
        createdBy: currentUser.fullName,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.fullName,
      };
      setRoles((prev) => [...prev, newRole]);
      addToast(`Created role: ${newRole.name}`, 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to create role' };
    }
  };

  const updateRole = (id: string, roleData: Partial<Role>) => {
    try {
      setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, ...roleData } : r)));
      addToast('Role updated.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update role' };
    }
  };

  const deleteRole = (id: string) => {
    try {
      const target = roles.find((r) => r.id === id);
      if (!target) return { success: false, error: 'Role not found' };
      if (target.code === 'SUPER_ADMIN') {
        addToast('System default SUPER_ADMIN role cannot be deleted.', 'error');
        return { success: false, error: 'Super Admin role is protected' };
      }
      const assignedUsers = users.filter((u) => u.primaryRoleId === id || u.additionalRoleIds?.includes(id));
      if (assignedUsers.length > 0) {
        addToast(`Cannot delete role: ${assignedUsers.length} user(s) are currently assigned to this role.`, 'error');
        return { success: false, error: `Role assigned to ${assignedUsers.length} active users` };
      }
      setRoles((prev) => prev.filter((r) => r.id !== id));
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_DELETE',
        module: 'Roles',
        resource: 'Role Management',
        recordId: target.id,
        recordTitle: target.name,
        details: `Deleted security role: ${target.name} (${target.code})`,
        status: 'success',
      });
      addToast(`Role ${target.name} deleted.`, 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete role' };
    }
  };

  const setRoleStatus = (id: string, status: RoleStatus) => {
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const updateRolePermissions = (id: string, newPermCodes: string[]) => {
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, permissionCodes: newPermCodes } : r)));
    addToast('Role permissions updated.', 'success');
  };

  // Accounts methods
  const createVoucher = (v: Omit<Voucher, 'id' | 'createdAt' | 'createdBy' | 'status'>) => {
    const newV: Voucher = {
      ...v,
      id: `vch-${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.fullName,
      status: 'DRAFT',
    };
    setVouchers((prev) => [newV, ...prev]);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_CREATE',
      module: 'Accounts',
      resource: 'Vouchers',
      recordId: newV.id,
      recordTitle: newV.voucherNumber,
      details: `Created new draft voucher ${newV.voucherNumber} (${newV.type}).`,
      status: 'success',
    });
    addToast(`Voucher ${newV.voucherNumber} created as DRAFT.`, 'info');
    return newV;
  };

  const updateVoucher = (id: string, voucherData: Partial<Voucher>) => {
    try {
      setVouchers((prev) => prev.map((v) => (v.id === id ? { ...v, ...voucherData } : v)));
      const v = vouchers.find((item) => item.id === id);
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_UPDATE',
        module: 'Accounts',
        resource: 'Vouchers',
        recordId: id,
        recordTitle: v?.voucherNumber || id,
        details: `Updated voucher ${v?.voucherNumber || id}.`,
        status: 'success',
      });
      addToast('Voucher details updated.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update voucher' };
    }
  };

  const deleteVoucher = (id: string) => {
    try {
      const v = vouchers.find((item) => item.id === id);
      if (!v) return { success: false, error: 'Voucher not found' };
      if (v.status === 'POSTED') {
        addToast('Cannot delete a POSTED voucher. Please reverse the voucher instead to maintain accounting integrity.', 'error');
        return { success: false, error: 'Cannot delete POSTED voucher' };
      }
      setVouchers((prev) => prev.filter((item) => item.id !== id));
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_DELETE',
        module: 'Accounts',
        resource: 'Vouchers',
        recordId: id,
        recordTitle: v.voucherNumber,
        details: `Deleted ${v.status} voucher ${v.voucherNumber}.`,
        status: 'success',
      });
      addToast(`Voucher ${v.voucherNumber} deleted.`, 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete voucher' };
    }
  };

  const approveVoucher = (id: string) => {
    setVouchers((prev) => prev.map((v) => (v.id === id ? { ...v, status: 'APPROVED', approvedBy: currentUser.fullName } : v)));
    addToast('Voucher approved.', 'success');
  };

  const postVoucher = (id: string) => {
    setVouchers((prev) => prev.map((v) => (v.id === id ? { ...v, status: 'POSTED', postedBy: currentUser.fullName, postedAt: new Date().toISOString() } : v)));
    addToast('Voucher posted to General Ledger.', 'success');
  };

  const reverseVoucher = (id: string, reason: string) => {
    setVouchers((prev) => prev.map((v) => (v.id === id ? { ...v, status: 'REVERSED', reversalReason: reason } : v)));
    addToast('Voucher reversed.', 'warning');
  };

  const createAccount = (acc: Omit<ChartOfAccount, 'id' | 'balance'>) => {
    const newAcc: ChartOfAccount = { ...acc, id: `coa-${Date.now()}`, balance: 0 };
    setChartOfAccounts((prev) => [...prev, newAcc]);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_CREATE',
      module: 'Accounts',
      resource: 'Chart of Accounts',
      recordId: newAcc.id,
      recordTitle: `${newAcc.code || newAcc.accountCode} - ${newAcc.name}`,
      details: `Created chart of account ${newAcc.code || newAcc.accountCode} (${newAcc.name}).`,
      status: 'success',
    });
    addToast(`Account ${newAcc.code || newAcc.accountCode} added.`, 'success');
  };

  const updateAccount = (id: string, data: Partial<ChartOfAccount>) => {
    setChartOfAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
    const acc = chartOfAccounts.find((a) => a.id === id);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_UPDATE',
      module: 'Accounts',
      resource: 'Chart of Accounts',
      recordId: id,
      recordTitle: acc ? `${acc.accountCode} - ${acc.accountName}` : id,
      details: `Updated chart of account ${acc?.accountCode || id}.`,
      status: 'success',
    });
    addToast('Account updated.', 'success');
  };

  const deleteAccount = (id: string) => {
    try {
      const acc = chartOfAccounts.find((a) => a.id === id);
      if (!acc) return { success: false, error: 'Account not found' };
      if (Math.abs(acc.balance) > 0.01) {
        addToast(`Cannot delete account with an active balance (${company.currencySymbol} ${acc.balance.toLocaleString()}).`, 'error');
        return { success: false, error: 'Account has non-zero balance' };
      }
      setChartOfAccounts((prev) => prev.filter((a) => a.id !== id));
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_DELETE',
        module: 'Accounts',
        resource: 'Chart of Accounts',
        recordId: id,
        recordTitle: `${acc.accountCode} - ${acc.accountName}`,
        details: `Deleted account ${acc.accountCode} (${acc.accountName}).`,
        status: 'success',
      });
      addToast(`Account ${acc.accountCode} deleted.`, 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete account' };
    }
  };

  const createBankAccount = (bank: Omit<BankAccount, 'id'>) => {
    const newBank: BankAccount = { ...bank, id: `bnk-${Date.now()}` };
    setBankAccounts((prev) => [...prev, newBank]);
    addToast(`Bank account ${newBank.bankName} added.`, 'success');
  };

  const updateBankAccount = (id: string, data: Partial<BankAccount>) => {
    setBankAccounts((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
    addToast('Bank account updated.', 'success');
  };

  const deleteBankAccount = (id: string) => {
    const b = bankAccounts.find((item) => item.id === id);
    setBankAccounts((prev) => prev.filter((item) => item.id !== id));
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_DELETE',
      module: 'Accounts',
      resource: 'Bank Accounts',
      recordId: id,
      recordTitle: b?.bankName,
      details: `Deleted bank account ${b?.bankName || id}.`,
      status: 'success',
    });
    addToast('Bank account deleted.', 'success');
    return { success: true };
  };

  const createCashAccount = (cash: Omit<CashAccount, 'id'>) => {
    const newCash: CashAccount = { ...cash, id: `csh-${Date.now()}` };
    setCashAccounts((prev) => [...prev, newCash]);
    addToast(`Cash ledger ${newCash.name} added.`, 'success');
  };

  const updateCashAccount = (id: string, data: Partial<CashAccount>) => {
    setCashAccounts((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    addToast('Cash ledger updated.', 'success');
  };

  const deleteCashAccount = (id: string) => {
    const c = cashAccounts.find((item) => item.id === id);
    setCashAccounts((prev) => prev.filter((item) => item.id !== id));
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_DELETE',
      module: 'Accounts',
      resource: 'Cash Accounts',
      recordId: id,
      recordTitle: c?.name,
      details: `Deleted cash ledger ${c?.name || id}.`,
      status: 'success',
    });
    addToast('Cash ledger deleted.', 'success');
    return { success: true };
  };

  // Clients & Sites methods
  const addClient = (c: Omit<Client, 'id' | 'createdAt' | 'createdBy' | 'totalOutstanding'>) => {
    const newC: Client = {
      ...c,
      id: `cli-${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.fullName,
      totalOutstanding: 0,
      contractsCount: 0,
      guardedSitesCount: 0,
      activeGuardsCount: 0,
    } as any;
    setClients((prev) => [newC, ...prev]);
    addToast(`Client ${newC.companyName} registered.`, 'success');
    return newC;
  };

  const updateClient = (id: string, data: Partial<Client>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    const cli = clients.find((c) => c.id === id);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_UPDATE',
      module: 'Clients',
      resource: 'Client Directory',
      recordId: id,
      recordTitle: cli?.companyName || id,
      details: `Updated client profile for ${cli?.companyName || id}.`,
      status: 'success',
    });
    addToast('Client details updated.', 'success');
  };

  const deleteClient = (id: string, isArchive: boolean = false) => {
    try {
      const cli = clients.find((c) => c.id === id);
      if (!cli) return { success: false, error: 'Client not found' };

      const activeContracts = contracts.filter((ctr) => ctr.clientId === id && ctr.status === 'ACTIVE');
      if (activeContracts.length > 0 && !isArchive) {
        addToast(`Client has ${activeContracts.length} active contract(s). Archive instead or terminate contracts first.`, 'error');
        return { success: false, error: `Client has ${activeContracts.length} active contract(s)` };
      }

      if (isArchive) {
        setClients((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'INACTIVE' as any } : c)));
        logAuditEvent({
          userId: currentUser.id,
          userName: currentUser.fullName,
          userRole: currentUserRole?.name || 'Administrator',
          action: 'RECORD_ARCHIVE',
          module: 'Clients',
          resource: 'Client Directory',
          recordId: id,
          recordTitle: cli.companyName,
          details: `Archived client ${cli.companyName}. Historical records preserved.`,
          status: 'success',
        });
        addToast(`Client ${cli.companyName} archived.`, 'info');
      } else {
        setClients((prev) => prev.filter((c) => c.id !== id));
        logAuditEvent({
          userId: currentUser.id,
          userName: currentUser.fullName,
          userRole: currentUserRole?.name || 'Administrator',
          action: 'RECORD_DELETE',
          module: 'Clients',
          resource: 'Client Directory',
          recordId: id,
          recordTitle: cli.companyName,
          details: `Permanently deleted client ${cli.companyName}.`,
          status: 'success',
        });
        addToast(`Client ${cli.companyName} deleted.`, 'success');
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete client' };
    }
  };

  const restoreClient = (id: string) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'ACTIVE' as any } : c)));
    const cli = clients.find((c) => c.id === id);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_RESTORE',
      module: 'Clients',
      resource: 'Client Directory',
      recordId: id,
      recordTitle: cli?.companyName || id,
      details: `Restored archived client ${cli?.companyName || id} to active status.`,
      status: 'success',
    });
    addToast('Client restored to active status.', 'success');
  };

  const addContract = (ctr: Omit<SecurityContract, 'id' | 'createdAt'>) => {
    const newCtr: SecurityContract = {
      ...ctr,
      id: `ctr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      totalMonthlyValue: ctr.totalMonthlyValue ?? ctr.monthlyRate ?? 250000,
    };
    setContracts((prev) => [newCtr, ...prev]);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_CREATE',
      module: 'Clients',
      resource: 'Contracts',
      recordId: newCtr.id,
      recordTitle: newCtr.contractNumber,
      details: `Drafted security contract ${newCtr.contractNumber} for ${newCtr.clientName}.`,
      status: 'success',
    });
    addToast(`Contract ${newCtr.contractNumber} recorded.`, 'success');
    return newCtr;
  };

  const updateContract = (id: string, data: Partial<SecurityContract>) => {
    setContracts((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    const ctr = contracts.find((c) => c.id === id);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_UPDATE',
      module: 'Clients',
      resource: 'Contracts',
      recordId: id,
      recordTitle: ctr?.contractNumber || id,
      details: `Updated contract ${ctr?.contractNumber || id}.`,
      status: 'success',
    });
    addToast('Contract updated.', 'success');
  };

  const deleteContract = (id: string) => {
    try {
      const ctr = contracts.find((c) => c.id === id);
      if (!ctr) return { success: false, error: 'Contract not found' };
      setContracts((prev) => prev.filter((c) => c.id !== id));
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_DELETE',
        module: 'Clients',
        resource: 'Contracts',
        recordId: id,
        recordTitle: ctr.contractNumber,
        details: `Deleted contract ${ctr.contractNumber} (${ctr.clientName}).`,
        status: 'success',
      });
      addToast(`Contract ${ctr.contractNumber} deleted.`, 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete contract' };
    }
  };

  const addSecuritySite = (site: Omit<SecuritySite, 'id' | 'createdAt'>) => {
    const newSite: SecuritySite = {
      ...site,
      id: `site-${Date.now()}`,
      code: site.siteCode,
      createdAt: new Date().toISOString(),
    };
    setSecuritySites((prev) => [newSite, ...prev]);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_CREATE',
      module: 'Clients',
      resource: 'Security Sites',
      recordId: newSite.id,
      recordTitle: newSite.name,
      details: `Registered physical security site ${newSite.name} (${newSite.siteCode}).`,
      status: 'success',
    });
    addToast(`Security site ${newSite.name} registered.`, 'success');
    return newSite;
  };

  const updateSecuritySite = (id: string, data: Partial<SecuritySite>) => {
    setSecuritySites((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    const s = securitySites.find((item) => item.id === id);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_UPDATE',
      module: 'Clients',
      resource: 'Security Sites',
      recordId: id,
      recordTitle: s?.name || id,
      details: `Updated security site ${s?.name || id}.`,
      status: 'success',
    });
    addToast('Security site updated.', 'success');
  };

  const deleteSecuritySite = (id: string) => {
    try {
      const site = securitySites.find((s) => s.id === id);
      if (!site) return { success: false, error: 'Site not found' };
      const activeGuards = guardAssignments.filter((a) => a.siteId === id && a.status === 'ACTIVE');
      if (activeGuards.length > 0) {
        addToast(`Cannot delete site: ${activeGuards.length} guard(s) are actively deployed here. Reassign them first.`, 'error');
        return { success: false, error: `${activeGuards.length} guard(s) actively deployed` };
      }
      setSecuritySites((prev) => prev.filter((s) => s.id !== id));
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_DELETE',
        module: 'Clients',
        resource: 'Security Sites',
        recordId: id,
        recordTitle: site.name,
        details: `Deleted site ${site.name} (${site.siteCode}).`,
        status: 'success',
      });
      addToast(`Site ${site.name} deleted.`, 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete site' };
    }
  };

  const createClientInvoice = (inv: Omit<ClientInvoice, 'id' | 'createdAt' | 'paidAmount' | 'outstandingAmount'>) => {
    const grand = inv.grandTotal || 0;
    const newInv: ClientInvoice = {
      ...inv,
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString(),
      paidAmount: 0,
      outstandingAmount: grand,
      totalAmount: grand,
    };
    setClientInvoices((prev) => [newInv, ...prev]);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_CREATE',
      module: 'Clients',
      resource: 'Client Invoices',
      recordId: newInv.id,
      recordTitle: newInv.invoiceNumber,
      details: `Generated client invoice ${newInv.invoiceNumber} for ${newInv.clientName}.`,
      status: 'success',
    });
    addToast(`Invoice ${newInv.invoiceNumber} generated.`, 'success');
    return newInv;
  };

  const updateClientInvoice = (id: string, data: Partial<ClientInvoice>) => {
    try {
      setClientInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, ...data } : inv)));
      const inv = clientInvoices.find((i) => i.id === id);
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_UPDATE',
        module: 'Clients',
        resource: 'Client Invoices',
        recordId: id,
        recordTitle: inv?.invoiceNumber || id,
        details: `Updated invoice ${inv?.invoiceNumber || id}.`,
        status: 'success',
      });
      addToast('Invoice updated.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update invoice' };
    }
  };

  const deleteClientInvoice = (id: string) => {
    try {
      const inv = clientInvoices.find((i) => i.id === id);
      if (!inv) return { success: false, error: 'Invoice not found' };
      setClientInvoices((prev) => prev.filter((i) => i.id !== id));
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_DELETE',
        module: 'Clients',
        resource: 'Client Invoices',
        recordId: id,
        recordTitle: inv.invoiceNumber,
        details: `Deleted invoice ${inv.invoiceNumber} for ${inv.clientName}.`,
        status: 'success',
      });
      addToast(`Invoice ${inv.invoiceNumber} deleted.`, 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete invoice' };
    }
  };

  const recordClientReceipt = (rct: Omit<ClientReceipt, 'id' | 'createdAt' | 'status'>) => {
    const newRct: ClientReceipt = {
      ...rct,
      id: `rct-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'POSTED',
    };
    setClientReceipts((prev) => [newRct, ...prev]);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_CREATE',
      module: 'Clients',
      resource: 'Client Receipts',
      recordId: newRct.id,
      recordTitle: newRct.receiptNumber,
      details: `Recorded client payment receipt ${newRct.receiptNumber} (${company.currencySymbol} ${(newRct.amountReceived || 0).toLocaleString()}).`,
      status: 'success',
    });
    addToast(`Receipt ${newRct.receiptNumber} recorded.`, 'success');
    return newRct;
  };

  const deleteClientReceipt = (id: string) => {
    try {
      const rct = clientReceipts.find((r) => r.id === id);
      setClientReceipts((prev) => prev.filter((r) => r.id !== id));
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_DELETE',
        module: 'Clients',
        resource: 'Client Receipts',
        recordId: id,
        recordTitle: rct?.receiptNumber,
        details: `Deleted receipt ${rct?.receiptNumber || id}.`,
        status: 'success',
      });
      addToast('Receipt deleted.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete receipt' };
    }
  };

  const recordInvoicePayment = (invoiceId: string, amount: number, paymentMethod: string = 'Bank Transfer') => {
    setClientInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const total = inv.grandTotal || inv.totalAmount || inv.subtotal || 0;
        const newPaid = (inv.paidAmount || 0) + amount;
        const newOutstanding = Math.max(0, total - newPaid);
        const newStatus: any = newOutstanding <= 0 ? 'PAID' : 'PARTIAL';
        return {
          ...inv,
          paidAmount: newPaid,
          outstandingAmount: newOutstanding,
          status: newStatus,
        };
      })
    );
    addToast(`Recorded payment of ${company.currencySymbol} ${amount.toLocaleString()} via ${paymentMethod}.`, 'success');
  };

  // Guards & Operations methods
  const addGuard = (g: Omit<GuardPersonnel, 'id' | 'createdAt'>) => {
    const newG: GuardPersonnel = {
      ...g,
      id: `grd-${Date.now()}`,
      guardCode: g.employeeCode || g.guardCode || `MSS-${Date.now()}`,
      monthlyBasicSalary: g.monthlyBasicSalary || (g.isArmedCertified ? 42000 : 34000),
      isArmedAuthorized: g.isArmedCertified,
      createdAt: new Date().toISOString(),
    };
    setGuards((prev) => [newG, ...prev]);
    addToast(`Guard ${newG.fullName} enlisted.`, 'success');
    return newG;
  };

  const createGuard = (g: any) => {
    return addGuard({
      employeeCode: g.guardCode || g.employeeCode || `MSS-${Date.now()}`,
      fullName: g.fullName || g.name || 'New Guard',
      fatherName: g.fatherName || '',
      employeeType: g.employeeType || (g.rank === 'Officer' ? 'Security Supervisor' : 'Security Guard'),
      cnicOrNationalId: g.cnic || g.cnicOrNationalId || '33100-0000000-0',
      phone: g.phone || '+92 300 0000000',
      currentAddress: g.currentAddress || 'MSS Accommodation',
      permanentAddress: g.permanentAddress || 'MSS Accommodation',
      emergencyContactName: g.emergencyContactName || 'MSS Command',
      emergencyContactPhone: g.emergencyContactPhone || '+92 300 1234567',
      joiningDate: g.joinDate || g.joiningDate || new Date().toISOString().substring(0, 10),
      employmentType: g.employmentType || 'Permanent',
      designation: g.rank || g.designation || 'Security Guard',
      department: 'Operations',
      branch: 'Central',
      status: 'ACTIVE',
      isArmedCertified: g.isArmedCertified || !!g.weaponLicenseNumber,
      gunLicenseNumber: g.weaponLicenseNumber || g.gunLicenseNumber,
      documents: [],
    });
  };

  const updateGuard = (id: string, data: Partial<GuardPersonnel>) => {
    setGuards((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)));
    const g = guards.find((item) => item.id === id);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_UPDATE',
      module: 'Operations',
      resource: 'Personnel Master',
      recordId: id,
      recordTitle: g?.fullName || id,
      details: `Updated security guard personnel record for ${g?.fullName || id}.`,
      status: 'success',
    });
    addToast('Personnel record updated.', 'success');
  };

  const deleteGuard = (id: string, isArchive: boolean = false) => {
    try {
      const grd = guards.find((g) => g.id === id);
      if (!grd) return { success: false, error: 'Guard not found' };

      const activeAssignments = guardAssignments.filter((a) => (a.guardId === id || a.employeeId === id) && a.status === 'ACTIVE');
      const issuedWeapons = weaponsStockList.filter((w) => w.assignedGuardId === id && w.status === 'ISSUED');

      if (!isArchive && (activeAssignments.length > 0 || issuedWeapons.length > 0)) {
        const reasons = [];
        if (activeAssignments.length > 0) reasons.push(`${activeAssignments.length} active post assignment(s)`);
        if (issuedWeapons.length > 0) reasons.push(`${issuedWeapons.length} issued weapon(s) in custody`);
        addToast(`Cannot permanently delete guard with ${reasons.join(' and ')}. Please archive personnel instead.`, 'error');
        return { success: false, error: `Guard has active duties: ${reasons.join(', ')}` };
      }

      if (isArchive) {
        setGuards((prev) => prev.map((g) => (g.id === id ? { ...g, status: 'INACTIVE' as any } : g)));
        logAuditEvent({
          userId: currentUser.id,
          userName: currentUser.fullName,
          userRole: currentUserRole?.name || 'Administrator',
          action: 'RECORD_ARCHIVE',
          module: 'Operations',
          resource: 'Personnel Master',
          recordId: id,
          recordTitle: grd.fullName,
          details: `Archived guard personnel ${grd.fullName} (${grd.guardCode || grd.employeeCode}).`,
          status: 'success',
        });
        addToast(`Guard ${grd.fullName} archived as inactive.`, 'info');
      } else {
        setGuards((prev) => prev.filter((g) => g.id !== id));
        logAuditEvent({
          userId: currentUser.id,
          userName: currentUser.fullName,
          userRole: currentUserRole?.name || 'Administrator',
          action: 'RECORD_DELETE',
          module: 'Operations',
          resource: 'Personnel Master',
          recordId: id,
          recordTitle: grd.fullName,
          details: `Permanently deleted guard ${grd.fullName} (${grd.guardCode || grd.employeeCode}).`,
          status: 'success',
        });
        addToast(`Guard ${grd.fullName} deleted.`, 'success');
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete guard' };
    }
  };

  const restoreGuard = (id: string) => {
    setGuards((prev) => prev.map((g) => (g.id === id ? { ...g, status: 'ACTIVE' as any } : g)));
    const grd = guards.find((g) => g.id === id);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_RESTORE',
      module: 'Operations',
      resource: 'Personnel Master',
      recordId: id,
      recordTitle: grd?.fullName || id,
      details: `Restored archived guard ${grd?.fullName || id} to active duty roster.`,
      status: 'success',
    });
    addToast('Guard restored to active roster.', 'success');
  };

  const addGuardAssignment = (asg: Omit<GuardAssignment, 'id' | 'createdAt'>) => {
    const newAsg: GuardAssignment = {
      ...asg,
      id: `asg-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setGuardAssignments((prev) => [newAsg, ...prev]);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_CREATE',
      module: 'Operations',
      resource: 'Guard Assignments',
      recordId: newAsg.id,
      recordTitle: newAsg.assignmentNumber,
      details: `Created guard assignment ${newAsg.assignmentNumber} for ${newAsg.guardName}.`,
      status: 'success',
    });
    addToast(`Deployment assignment ${newAsg.assignmentNumber} created.`, 'success');
    return newAsg;
  };

  const updateGuardAssignment = (id: string, data: Partial<GuardAssignment>) => {
    try {
      setGuardAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
      const asg = guardAssignments.find((a) => a.id === id);
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_UPDATE',
        module: 'Operations',
        resource: 'Guard Assignments',
        recordId: id,
        recordTitle: asg?.assignmentNumber || id,
        details: `Updated guard assignment ${asg?.assignmentNumber || id}.`,
        status: 'success',
      });
      addToast('Assignment updated.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update assignment' };
    }
  };

  const deleteGuardAssignment = (id: string) => {
    try {
      const asg = guardAssignments.find((a) => a.id === id);
      setGuardAssignments((prev) => prev.filter((a) => a.id !== id));
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_DELETE',
        module: 'Operations',
        resource: 'Guard Assignments',
        recordId: id,
        recordTitle: asg?.assignmentNumber,
        details: `Deleted assignment ${asg?.assignmentNumber || id}.`,
        status: 'success',
      });
      addToast('Deployment assignment removed.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete assignment' };
    }
  };

  const recordDailyDeployment = (dep: Omit<DailyDeployment, 'id' | 'createdAt'>) => {
    const newDep: DailyDeployment = {
      ...dep,
      id: `dep-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setDailyDeployments((prev) => [newDep, ...prev]);
    addToast(`Roll-call deployment saved for ${newDep.date}.`, 'info');
    return newDep;
  };

  const recordAttendance = (att: Omit<AttendanceRecord, 'id'>) => {
    const newAtt: AttendanceRecord = { ...att, id: `att-${Date.now()}` };
    setAttendanceRecords((prev) => [newAtt, ...prev]);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_CREATE',
      module: 'Operations',
      resource: 'Attendance Logs',
      recordId: newAtt.id,
      recordTitle: `${newAtt.employeeName} (${newAtt.date})`,
      details: `Logged duty attendance for ${newAtt.employeeName} on ${newAtt.date}.`,
      status: 'success',
    });
  };

  const updateAttendance = (id: string, data: Partial<AttendanceRecord>) => {
    try {
      setAttendanceRecords((prev) => prev.map((att) => (att.id === id ? { ...att, ...data } : att)));
      const att = attendanceRecords.find((a) => a.id === id);
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_UPDATE',
        module: 'Operations',
        resource: 'Attendance Logs',
        recordId: id,
        recordTitle: att ? `${att.employeeName} (${att.date})` : id,
        details: `Updated attendance record for ${att?.employeeName || id}.`,
        status: 'success',
      });
      addToast('Attendance record updated.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update attendance' };
    }
  };

  const deleteAttendance = (id: string) => {
    try {
      const att = attendanceRecords.find((a) => a.id === id);
      setAttendanceRecords((prev) => prev.filter((a) => a.id !== id));
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_DELETE',
        module: 'Operations',
        resource: 'Attendance Logs',
        recordId: id,
        recordTitle: att ? `${att.employeeName} (${att.date})` : id,
        details: `Deleted attendance log for ${att?.employeeName || id} on ${att?.date}.`,
        status: 'success',
      });
      addToast('Attendance record deleted.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete attendance' };
    }
  };

  const recordOvertime = (ot: any) => {
    const newOT: OvertimeRecord = {
      id: `ot-${Date.now()}`,
      employeeId: ot.guardId || ot.employeeId || 'grd-01',
      employeeCode: ot.guardCode || ot.employeeCode || 'MSS-GRD-0001',
      employeeName: ot.guardName || ot.employeeName || 'Guard Personnel',
      guardName: ot.guardName || ot.employeeName,
      date: ot.date || new Date().toISOString().substring(0, 10),
      siteId: ot.siteId || 'site-01',
      siteName: ot.siteName || 'Sitara Chemicals Complex',
      shiftId: 'shf-01',
      shiftName: 'Day Shift (12h)',
      scheduledHours: 12,
      actualHours: 12 + (ot.hours || ot.overtimeHours || 4),
      hours: ot.hours || ot.overtimeHours || 4,
      eligibleOvertimeHours: ot.hours || ot.overtimeHours || 4,
      approvedOvertimeHours: ot.hours || ot.overtimeHours || 4,
      ratePerHour: ot.hourlyRate || 250,
      hourlyRate: ot.hourlyRate || 250,
      overtimeAmount: (ot.hours || 4) * (ot.hourlyRate || 250),
      totalAmount: (ot.hours || 4) * (ot.hourlyRate || 250),
      status: 'PENDING APPROVAL',
      reason: ot.reason || 'Extra perimeter duty',
      supervisorName: currentUser.fullName,
      createdAt: new Date().toISOString(),
    };
    setOvertimeRecords((prev) => [newOT, ...prev]);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_CREATE',
      module: 'Operations',
      resource: 'Overtime Register',
      recordId: newOT.id,
      recordTitle: `${newOT.employeeName} (${newOT.hours}h)`,
      details: `Created overtime claim for ${newOT.employeeName} (${newOT.hours} hours).`,
      status: 'success',
    });
    addToast('Overtime record logged and queued for approval.', 'success');
  };

  const updateOvertime = (id: string, data: Partial<OvertimeRecord>) => {
    try {
      setOvertimeRecords((prev) => prev.map((ot) => (ot.id === id ? { ...ot, ...data } : ot)));
      const ot = overtimeRecords.find((o) => o.id === id);
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_UPDATE',
        module: 'Operations',
        resource: 'Overtime Register',
        recordId: id,
        recordTitle: ot ? `${ot.employeeName} (${ot.date})` : id,
        details: `Updated overtime record for ${ot?.employeeName || id}.`,
        status: 'success',
      });
      addToast('Overtime record updated.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update overtime' };
    }
  };

  const deleteOvertime = (id: string) => {
    try {
      const ot = overtimeRecords.find((o) => o.id === id);
      setOvertimeRecords((prev) => prev.filter((o) => o.id !== id));
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_DELETE',
        module: 'Operations',
        resource: 'Overtime Register',
        recordId: id,
        recordTitle: ot ? `${ot.employeeName} (${ot.date})` : id,
        details: `Deleted overtime claim for ${ot?.employeeName || id} on ${ot?.date}.`,
        status: 'success',
      });
      addToast('Overtime record deleted.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete overtime' };
    }
  };

  const approveOvertime = (id: string) => {
    setOvertimeRecords((prev) => prev.map((ot) => (ot.id === id ? { ...ot, status: 'APPROVED', approvedBy: currentUser.fullName } : ot)));
    addToast('Overtime duty approved.', 'success');
  };

  const rejectOvertime = (id: string) => {
    setOvertimeRecords((prev) => prev.map((ot) => (ot.id === id ? { ...ot, status: 'REJECTED' } : ot)));
    addToast('Overtime duty rejected.', 'warning');
  };

  // Payroll methods
  const requestAdvance = (adv: Omit<EmployeeAdvance, 'id' | 'createdAt' | 'paidAmount' | 'recoveredAmount' | 'outstandingBalance' | 'status'>) => {
    const newAdv: EmployeeAdvance = {
      ...adv,
      id: `adv-${Date.now()}`,
      paidAmount: 0,
      recoveredAmount: 0,
      outstandingBalance: adv.approvedAmount || adv.requestedAmount,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
    };
    setEmployeeAdvances((prev) => [newAdv, ...prev]);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_CREATE',
      module: 'Payroll',
      resource: 'Salary Advances',
      recordId: newAdv.id,
      recordTitle: `${newAdv.employeeName} (${company.currencySymbol} ${newAdv.requestedAmount.toLocaleString()})`,
      details: `Submitted salary advance request of ${company.currencySymbol} ${newAdv.requestedAmount} for ${newAdv.employeeName}.`,
      status: 'success',
    });
    addToast(`Advance request recorded for ${newAdv.employeeName}.`, 'info');
  };

  const createGuardAdvance = (adv: Omit<GuardAdvance, 'id'>) => {
    const newAdv: GuardAdvance = {
      ...adv,
      id: `adv-${Date.now()}`,
    };
    setGuardAdvancesList((prev) => [newAdv, ...prev]);
    addToast(`Advance registered for ${newAdv.guardName}.`, 'success');
  };

  const updateAdvance = (id: string, data: Partial<EmployeeAdvance>) => {
    try {
      setEmployeeAdvances((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
      setGuardAdvancesList((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
      const adv = employeeAdvances.find((a) => a.id === id) || guardAdvancesList.find((a) => a.id === id);
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_UPDATE',
        module: 'Payroll',
        resource: 'Salary Advances',
        recordId: id,
        recordTitle: adv ? (adv as any).employeeName || (adv as any).guardName : id,
        details: `Updated salary advance record ${id}.`,
        status: 'success',
      });
      addToast('Advance record updated.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update advance' };
    }
  };

  const deleteAdvance = (id: string) => {
    try {
      const adv = employeeAdvances.find((a) => a.id === id) || guardAdvancesList.find((a) => a.id === id);
      setEmployeeAdvances((prev) => prev.filter((a) => a.id !== id));
      setGuardAdvancesList((prev) => prev.filter((a) => a.id !== id));
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_DELETE',
        module: 'Payroll',
        resource: 'Salary Advances',
        recordId: id,
        recordTitle: adv ? (adv as any).employeeName || (adv as any).guardName : id,
        details: `Deleted salary advance entry ${id}.`,
        status: 'success',
      });
      addToast('Advance record deleted.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete advance' };
    }
  };

  const approveAdvance = (id: string) => {
    setEmployeeAdvances((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'APPROVED', approvedBy: currentUser.fullName } : a)));
    setGuardAdvancesList((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'APPROVED' } : a)));
    addToast('Advance loan approved.', 'success');
  };

  const processPayrollPeriod = (periodId: string) => {
    setPayrollPeriods((prev) => prev.map((p) => (p.id === periodId ? { ...p, status: 'PROCESSING' } : p)));
    addToast('Monthly salary batch calculated.', 'success');
  };

  const approvePayrollPeriod = (periodId: string) => {
    setPayrollPeriods((prev) => prev.map((p) => (p.id === periodId ? { ...p, status: 'APPROVED', approvedBy: currentUser.fullName } : p)));
    setPayrollRecordsList((prev) => prev.map((r) => ({ ...r, status: 'APPROVED' })));
    addToast('Payroll batch approved for disbursement.', 'success');
  };

  const updatePayrollRecord = (id: string, data: Partial<PayrollRecord>) => {
    try {
      setPayrollRecordsList((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
      const rec = payrollRecordsList.find((r) => r.id === id);
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_UPDATE',
        module: 'Payroll',
        resource: 'Payroll Records',
        recordId: id,
        recordTitle: rec ? `${rec.guardName || rec.employeeName} (${rec.monthYear})` : id,
        details: `Updated salary slip record for ${rec?.guardName || rec?.employeeName || id}.`,
        status: 'success',
      });
      addToast('Salary slip updated.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update payroll record' };
    }
  };

  const deletePayrollRecord = (id: string) => {
    try {
      const rec = payrollRecordsList.find((r) => r.id === id);
      setPayrollRecordsList((prev) => prev.filter((r) => r.id !== id));
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_DELETE',
        module: 'Payroll',
        resource: 'Payroll Records',
        recordId: id,
        recordTitle: rec ? `${rec.guardName || rec.employeeName} (${rec.monthYear})` : id,
        details: `Deleted salary slip entry for ${rec?.guardName || rec?.employeeName || id}.`,
        status: 'success',
      });
      addToast('Salary record deleted.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete payroll record' };
    }
  };

  const disburseSalaryPayment = (pay: Omit<SalaryPayment, 'id' | 'createdAt' | 'status'>) => {
    const newPay: SalaryPayment = {
      ...pay,
      id: `sal-pay-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'POSTED',
    };
    setSalaryPayments((prev) => [newPay, ...prev]);
    addToast(`Salary payment ${newPay.paymentNumber} posted.`, 'success');
  };

  // Inventory, Armory & Uniforms methods
  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'totalQuantity' | 'availableQuantity' | 'issuedQuantity'>) => {
    const newItm: InventoryItem = {
      ...item,
      id: `itm-${Date.now()}`,
      totalQuantity: 50,
      availableQuantity: 50,
      issuedQuantity: 0,
    };
    setInventoryItems((prev) => [newItm, ...prev]);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_CREATE',
      module: 'Inventory',
      resource: 'General Items',
      recordId: newItm.id,
      recordTitle: newItm.name,
      details: `Created inventory item ${newItm.name} (${newItm.itemCode}).`,
      status: 'success',
    });
  };

  const updateInventoryItem = (id: string, data: Partial<InventoryItem>) => {
    try {
      setInventoryItems((prev) => prev.map((itm) => (itm.id === id ? { ...itm, ...data } : itm)));
      const itm = inventoryItems.find((i) => i.id === id);
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_UPDATE',
        module: 'Inventory',
        resource: 'General Items',
        recordId: id,
        recordTitle: itm?.name || id,
        details: `Updated inventory item ${itm?.name || id}.`,
        status: 'success',
      });
      addToast('Inventory item updated.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update inventory' };
    }
  };

  const deleteInventoryItem = (id: string) => {
    try {
      const itm = inventoryItems.find((i) => i.id === id);
      setInventoryItems((prev) => prev.filter((i) => i.id !== id));
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_DELETE',
        module: 'Inventory',
        resource: 'General Items',
        recordId: id,
        recordTitle: itm?.name,
        details: `Deleted inventory item ${itm?.name || id}.`,
        status: 'success',
      });
      addToast('Inventory item deleted.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete inventory' };
    }
  };

  const createUniformItem = (item: Omit<UniformItem, 'id'>) => {
    const newItm: UniformItem = { ...item, id: `uni-${Date.now()}` };
    setUniformStockList((prev) => [newItm, ...prev]);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_CREATE',
      module: 'Inventory',
      resource: 'Uniform Stock',
      recordId: newItm.id,
      recordTitle: newItm.name,
      details: `Added uniform asset ${newItm.name}.`,
      status: 'success',
    });
    addToast(`Uniform item ${newItm.name} added to inventory.`, 'success');
  };

  const updateUniformItem = (id: string, data: Partial<UniformItem>) => {
    try {
      setUniformStockList((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
      const u = uniformStockList.find((item) => item.id === id);
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_UPDATE',
        module: 'Inventory',
        resource: 'Uniform Stock',
        recordId: id,
        recordTitle: u?.name || id,
        details: `Updated uniform item ${u?.name || id}.`,
        status: 'success',
      });
      addToast('Uniform item updated.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update uniform' };
    }
  };

  const deleteUniformItem = (id: string) => {
    try {
      const u = uniformStockList.find((item) => item.id === id);
      setUniformStockList((prev) => prev.filter((item) => item.id !== id));
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_DELETE',
        module: 'Inventory',
        resource: 'Uniform Stock',
        recordId: id,
        recordTitle: u?.name,
        details: `Deleted uniform article ${u?.name || id}.`,
        status: 'success',
      });
      addToast('Uniform item deleted.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete uniform' };
    }
  };

  const createWeaponItem = (item: Omit<WeaponItem, 'id'>) => {
    const newWpn: WeaponItem = { ...item, id: `wpn-${Date.now()}` };
    setWeaponsStockList((prev) => [newWpn, ...prev]);
    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
      action: 'RECORD_CREATE',
      module: 'Inventory',
      resource: 'Weapons Stock',
      recordId: newWpn.id,
      recordTitle: `${newWpn.serialNumber} (${newWpn.type})`,
      details: `Registered weapon ${newWpn.serialNumber} into armory ledger.`,
      status: 'success',
    });
    addToast(`Firearm ${newWpn.serialNumber} entered into armory ledger.`, 'success');
  };

  const updateWeaponItem = (id: string, data: Partial<WeaponItem>) => {
    try {
      setWeaponsStockList((prev) => prev.map((w) => (w.id === id ? { ...w, ...data } : w)));
      const w = weaponsStockList.find((item) => item.id === id);
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_UPDATE',
        module: 'Inventory',
        resource: 'Weapons Stock',
        recordId: id,
        recordTitle: w?.serialNumber || id,
        details: `Updated weapon record ${w?.serialNumber || id}.`,
        status: 'success',
      });
      addToast('Firearm record updated.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update firearm' };
    }
  };

  const deleteWeaponItem = (id: string) => {
    try {
      const wpn = weaponsStockList.find((w) => w.id === id);
      if (wpn?.status === 'ISSUED') {
        addToast(`Cannot delete firearm ${wpn.serialNumber}: currently issued to guard ${wpn.assignedGuardName || ''}. Return to vault first.`, 'error');
        return { success: false, error: 'Firearm currently issued to guard' };
      }
      setWeaponsStockList((prev) => prev.filter((w) => w.id !== id));
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_DELETE',
        module: 'Inventory',
        resource: 'Weapons Stock',
        recordId: id,
        recordTitle: wpn?.serialNumber,
        details: `Deleted firearm record ${wpn?.serialNumber || id} from armory ledger.`,
        status: 'success',
      });
      addToast('Firearm removed from armory ledger.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete firearm' };
    }
  };

  const issueWeaponToGuard = (weaponId: string, guardId: string) => {
    const guard = guards.find((g) => g.id === guardId);
    if (!guard) return;
    setWeaponsStockList((prev) =>
      prev.map((w) =>
        w.id === weaponId
          ? {
              ...w,
              status: 'ISSUED',
              assignedGuardId: guard.id,
              assignedGuardName: guard.fullName,
              assignedSiteName: guard.currentSiteName || 'Active Patrol Post',
            }
          : w
      )
    );
    addToast(`Weapon assigned to Guard ${guard.fullName}.`, 'success');
  };

  const recordStockMovement = (mov: Omit<StockMovement, 'id' | 'createdAt' | 'status'>) => {
    const newMov: StockMovement = {
      ...mov,
      id: `stk-mov-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'POSTED',
    };
    setStockMovements((prev) => [newMov, ...prev]);
  };

  const issueUniformToGuard = (itemIdOrRecord: string | Omit<UniformIssueRecord, 'id' | 'status'>, guardId?: string, qty?: number) => {
    if (typeof itemIdOrRecord === 'string' && guardId && qty) {
      setUniformStockList((prev) =>
        prev.map((u) => (u.id === itemIdOrRecord ? { ...u, inStockQuantity: Math.max(0, u.inStockQuantity - qty) } : u))
      );
      const targetGuard = guards.find((g) => g.id === guardId);
      addToast(`Issued ${qty} unit(s) to Guard ${targetGuard?.fullName || 'Personnel'}.`, 'success');
    } else if (typeof itemIdOrRecord === 'object') {
      const newIssue: UniformIssueRecord = {
        ...itemIdOrRecord,
        id: `uni-iss-${Date.now()}`,
        status: 'ISSUED',
      };
      setUniformIssues((prev) => [newIssue, ...prev]);
    }
  };

  const returnUniformFromGuard = (id: string, _returnCondition: any) => {
    setUniformIssues((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'RETURNED' } : u)));
    addToast('Uniform returned to warehouse.', 'info');
  };

  // Controlled items methods
  const registerControlledItem = (item: Omit<ControlledItem, 'id' | 'recordNumber' | 'registrationDate'>) => {
    const count = controlledItems.length + 1;
    const newCtrl: ControlledItem = {
      ...item,
      id: `ctrl-${Date.now()}`,
      recordNumber: `WPN-REG-${String(count).padStart(4, '0')}`,
      registrationDate: new Date().toISOString().substring(0, 10),
    };
    setControlledItems((prev) => [newCtrl, ...prev]);
    addToast(`Controlled asset ${newCtrl.serialNumber} registered.`, 'success');
    return newCtrl;
  };

  const updateControlledItem = (id: string, data: Partial<ControlledItem>) => {
    setControlledItems((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    addToast('Controlled item updated.', 'success');
  };

  const deleteControlledItem = (id: string) => {
    try {
      const item = controlledItems.find((c) => c.id === id);
      setControlledItems((prev) => prev.filter((c) => c.id !== id));
      logAuditEvent({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUserRole?.name || 'Administrator',
        action: 'RECORD_DELETE',
        module: 'Inventory',
        resource: 'Controlled Items',
        recordId: id,
        recordTitle: item?.serialNumber || item?.recordNumber,
        details: `Deleted controlled asset record ${item?.serialNumber || id}.`,
        status: 'success',
      });
      addToast('Controlled item record deleted.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete controlled asset' };
    }
  };

  const recordControlledMovement = (mov: Omit<ControlledCustodyMovement, 'id' | 'movementNumber'>) => {
    const newMov: ControlledCustodyMovement = {
      ...mov,
      id: `mov-${Date.now()}`,
      movementNumber: `MOV-${Date.now()}`,
    };
    setControlledMovements((prev) => [newMov, ...prev]);
  };

  const reportControlledIncident = (inc: Omit<ControlledIncident, 'id' | 'incidentNumber' | 'dateReported' | 'status'>) => {
    const newInc: ControlledIncident = {
      ...inc,
      id: `inc-${Date.now()}`,
      incidentNumber: `INC-${Date.now()}`,
      dateReported: new Date().toISOString(),
      status: 'OPEN',
    };
    setControlledIncidents((prev) => [newInc, ...prev]);
    addToast('High-priority security incident reported to Director Operations.', 'error');
  };

  const recordExportAction = (exp: Omit<ExportHistoryRecord, 'id' | 'timestamp' | 'userName' | 'userRole'>) => {
    const newExp: ExportHistoryRecord = {
      ...exp,
      id: `exp-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Administrator',
    };
    setExportHistory((prev) => [newExp, ...prev]);
  };

  // Backups & Danger Zone
  const createBackupSnapshot = (name: string, type: BackupPackage['type']): BackupPackage => {
    const backupSnapshot: BackupPackage = {
      id: `bak-${Date.now()}`,
      packageNumber: `MSS-BAK-${new Date().toISOString().substring(0, 10)}-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      type,
      createdAt: new Date().toISOString(),
      sizeBytes: 1542000,
      recordsCount:
        clients.length +
        guards.length +
        vouchers.length +
        contracts.length +
        weaponsStockList.length +
        uniformStockList.length,
      status: 'VALID',
      createdBy: currentUser.fullName,
      dataSnapshot: {
        company,
        users,
        roles,
        settings,
        clients,
        contracts,
        securitySites,
        guards,
        vouchers,
        payrollRecordsList,
        guardAdvancesList,
        weaponsStockList,
        uniformStockList,
      },
    };
    setBackups((prev) => [backupSnapshot, ...prev]);
    return backupSnapshot;
  };

  const restoreFromBackup = (backupId: string): boolean => {
    const target = backups.find((b) => b.id === backupId);
    if (!target || !target.dataSnapshot) return false;
    const s = target.dataSnapshot;
    if (s.company) setCompany(s.company);
    if (s.users) setUsers(s.users);
    if (s.roles) setRoles(s.roles);
    if (s.settings) setSettings(s.settings);
    if (s.clients) setClients(s.clients);
    if (s.contracts) setContracts(s.contracts);
    if (s.securitySites) setSecuritySites(s.securitySites);
    if (s.guards) setGuards(s.guards);
    if (s.vouchers) setVouchers(s.vouchers);
    if (s.payrollRecordsList) setPayrollRecordsList(s.payrollRecordsList);
    if (s.guardAdvancesList) setGuardAdvancesList(s.guardAdvancesList);
    if (s.weaponsStockList) setWeaponsStockList(s.weaponsStockList);
    if (s.uniformStockList) setUniformStockList(s.uniformStockList);
    addToast(`Restored system data from backup snapshot: ${target.packageNumber}`, 'success');
    return true;
  };

  const executeResetAllData = (options: ResetAllDataOptions) => {
    const safetyBackup = createBackupSnapshot('Pre-Reset Automatic Safety Backup (MSS Protection)', 'SAFETY_AUTO');
    const summary: string[] = [];

    if (options.scope === 'FULL' || options.modules.includes('ACCOUNTS')) {
      setVouchers([]);
      setJournalEntries([]);
      summary.push('Reset Accounts & Double-Entry Vouchers');
    }
    if (options.scope === 'FULL' || options.modules.includes('CLIENTS')) {
      setClients([]);
      setContracts([]);
      setSecuritySites([]);
      setClientInvoices([]);
      setClientReceipts([]);
      summary.push('Purged Clients, SLAs, Security Sites & Invoices');
    }
    if (options.scope === 'FULL' || options.modules.includes('OPERATIONS')) {
      setGuards([]);
      setGuardAssignments([]);
      setDailyDeployments([]);
      setAttendanceRecords([]);
      setOvertimeRecords([]);
      summary.push('Cleared Guard Roster & Deployment Attendance Logs');
    }
    if (options.scope === 'FULL' || options.modules.includes('PAYROLL')) {
      setPayrollLines([]);
      setEmployeeAdvances([]);
      setGuardAdvancesList([]);
      setPayrollRecordsList([]);
      setSalaryPayments([]);
      summary.push('Reset Payroll Processing Batches & Advance Loans');
    }
    if (options.scope === 'FULL' || options.modules.includes('INVENTORY')) {
      setStockMovements([]);
      setUniformIssues([]);
      setWeaponsStockList([]);
      setUniformStockList([]);
      setControlledMovements([]);
      setControlledIncidents([]);
      summary.push('Emptied Armory Vault & Uniform Inventory');
    }

    logAuditEvent({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUserRole?.name || 'Super Administrator',
      action: 'EXECUTE_DATA_RESET',
      module: 'System',
      resource: 'Danger Zone',
      details: `Executed data reset (${options.scope}). Preserved MSS Branding, Logo & Super Admin access.`,
      status: 'warning',
    });

    addToast('Data reset completed. Core branding and Super Admin master access preserved.', 'warning', 'MSS Data Reset');

    return {
      success: true,
      safetyBackupId: safetyBackup.id,
      summary,
    };
  };

  const resetToFactoryDefaults = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    window.location.reload();
  };

  return (
    <ERPContext.Provider
      value={{
        isAuthenticated: true,
        currentUser,
        setCurrentUser,
        currentUserRole,
        currentRole: currentUserRole,
        hasPermission,
        isSuperAdmin,
        logout,

        activeTab,
        setActiveTab,
        sidebarCollapsed,
        setSidebarCollapsed,
        futureModules: futureModulesRegistry,
        selectedFutureModule,

        company,
        updateCompany,
        updateCompanyProfile: updateCompany,
        users,
        setUsers,
        login,
        requestPasswordReset,
        resetPasswordWithToken,
        createUser,
        updateUser,
        deleteUser,
        setUserStatus,
        adminResetPassword,
        getUserPermissions,
        quickSwitchUser,

        roles,
        setRoles,
        createRole,
        updateRole,
        deleteRole,
        setRoleStatus,
        updateRolePermissions,

        permissions,
        settings,
        systemSettings: settings,
        updateSettings,
        updateSystemSettings: updateSettings,

        auditLogs,
        logAuditEvent,
        notifications,
        unreadNotificationCount,
        addNotification,
        addToast,
        toasts,
        removeToast,
        markNotificationRead,
        markNotificationAsRead,
        markAllNotificationsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        globalSearchOpen,
        setGlobalSearchOpen,

        // Accounts
        accounts: chartOfAccounts,
        chartOfAccounts,
        accountingPeriods,
        vouchers,
        journalEntries,
        cashAccounts,
        bankAccounts,
        suppliers,
        createVoucher,
        updateVoucher,
        deleteVoucher,
        approveVoucher,
        postVoucher,
        reverseVoucher,
        createAccount,
        updateAccount,
        deleteAccount,
        createBankAccount,
        updateBankAccount,
        deleteBankAccount,
        createCashAccount,
        updateCashAccount,
        deleteCashAccount,

        // Clients
        clients,
        contracts,
        securitySites,
        guardRequirements,
        clientInvoices,
        clientReceipts,
        addClient,
        createClient: (c: any) => addClient(c),
        updateClient,
        deleteClient,
        restoreClient,
        addContract,
        createContract: (c: any) => addContract(c),
        updateContract,
        deleteContract,
        addSecuritySite,
        createSecuritySite: (s: any) => addSecuritySite(s),
        updateSecuritySite,
        deleteSecuritySite,
        createClientInvoice,
        updateClientInvoice,
        deleteClientInvoice,
        recordClientReceipt,
        deleteClientReceipt,
        recordInvoicePayment,

        // Operations
        guards,
        shifts,
        guardAssignments,
        dailyDeployments,
        attendanceRecords,
        overtimeRecords,
        supervisorMonitoring,
        addGuard,
        createGuard,
        updateGuard,
        deleteGuard,
        restoreGuard,
        addGuardAssignment,
        createGuardAssignment: (a: any) => addGuardAssignment(a),
        updateGuardAssignment,
        deleteGuardAssignment,
        recordDailyDeployment,
        recordAttendance,
        updateAttendance,
        deleteAttendance,
        recordOvertime,
        updateOvertime,
        deleteOvertime,
        approveOvertime,
        rejectOvertime,

        // Payroll
        salaryComponents,
        salaryStructures,
        employeeSalarySetups,
        payrollPeriods,
        employeeAdvances,
        guardAdvances: guardAdvancesList,
        createGuardAdvance,
        employeeDeductions,
        payrollLines,
        payrollRecords: payrollRecordsList,
        salaryPayments,
        requestAdvance,
        updateAdvance,
        deleteAdvance,
        approveAdvance,
        processPayrollPeriod,
        approvePayrollPeriod,
        updatePayrollRecord,
        deletePayrollRecord,
        disburseSalaryPayment,

        // Inventory & Armory
        itemCategories,
        inventoryItems,
        uniformStock: uniformStockList,
        createUniformItem,
        updateUniformItem,
        deleteUniformItem,
        weapons: weaponsStockList,
        weaponsStock: weaponsStockList,
        createWeapon: (item: any) => createWeaponItem(item),
        createWeaponItem,
        updateWeaponItem,
        deleteWeaponItem,
        issueWeapon: (weaponId: string, guardId?: string) => {
          if (guardId) issueWeaponToGuard(weaponId, guardId);
        },
        issueWeaponToGuard,
        returnWeapon: (weaponId: string) => {
          setWeaponsStockList((prev) =>
            prev.map((w) =>
              w.id === weaponId
                ? {
                    ...w,
                    status: 'IN_VAULT',
                    assignedGuardId: undefined,
                    assignedGuardName: undefined,
                    assignedSiteName: undefined,
                  }
                : w
            )
          );
          addToast('Weapon returned to armory vault.', 'info');
        },
        warehouses,
        stockMovements,
        uniformIssues,
        equipmentRecords,
        fixedAssets,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        recordStockMovement,
        issueUniformToGuard,
        returnUniformFromGuard,

        // Controlled
        controlledItems,
        authorizedPersonnel,
        controlledMovements,
        controlledIncidents,
        registerControlledItem,
        updateControlledItem,
        deleteControlledItem,
        recordControlledMovement,
        reportControlledIncident,

        // Reports
        savedReports,
        exportHistory,
        recordExportAction,

        // System Control
        backups,
        createBackupSnapshot,
        restoreFromBackup,
        executeResetAllData,
        resetToFactoryDefaults,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = (): ERPContextType => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
