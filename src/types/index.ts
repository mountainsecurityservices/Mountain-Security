/**
 * Mountain Security Services (MSS) - ERP Platform
 * Comprehensive TypeScript Interfaces & Schema Definitions across Phases 1 to 9
 */

// ==========================================
// 1. SYSTEM, USERS, ROLES & PERMISSIONS
// ==========================================

export type UserStatus = 'active' | 'inactive' | 'suspended';
export type RoleStatus = 'active' | 'inactive';
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'critical';

export interface Company {
  id: string;
  officialName: string;
  shortName: string;
  logoUrl?: string;
  tagline: string;
  address: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  phone: string;
  emergencyPhone: string;
  emergencyHotline?: string;
  email: string;
  website: string;
  registrationNumber: string;
  taxRegistrationNumber: string;
  taxId?: string;
  licenseNumber: string;
  currency: string;
  currencySymbol: string;
  timeZone: string;
  financialYearStart: string;
  companyStatus: 'active' | 'provisional' | 'under_review';
  establishedYear: string;
}

export interface Permission {
  id: string;
  code: string;
  module: string;
  resource: string;
  action: 'view' | 'create' | 'edit' | 'delete' | 'deactivate' | 'suspend' | 'approve' | 'post' | 'reverse' | 'cancel' | 'export' | 'print' | 'manage';
  name: string;
  description: string;
  category: 'Foundation' | 'Accounts' | 'Clients & Operations' | 'Guards & Operations' | 'Payroll' | 'Inventory & Assets' | 'Controlled Equipment' | 'Reports & Export' | 'System Control';
}

export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  isSystem: boolean;
  status: RoleStatus;
  permissionCodes: string[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface User {
  id: string;
  employeeRef?: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  profilePhoto?: string;
  primaryRoleId: string;
  additionalRoleIds: string[];
  status: UserStatus;
  department?: string;
  designation?: string;
  lastLogin?: string;
  lastLogout?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  resource: string;
  recordId?: string;
  recordTitle?: string;
  details: string;
  oldValue?: any;
  newValue?: any;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'failure';
}

export interface NotificationItem {
  id: string;
  userId?: string;
  targetRoles?: string[];
  title: string;
  message: string;
  type: NotificationType;
  relatedModule?: string;
  module?: string;
  relatedRecordId?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
}

export interface SecuritySettings {
  minPasswordLength: number;
  passwordMinLength?: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  sessionTimeoutMinutes: number;
  maxFailedLoginAttempts: number;
  lockoutDurationMinutes: number;
  enforceMFA: boolean;
  passwordExpiryDays: number;
}

export interface GeneralSettings {
  applicationName: string;
  systemName?: string;
  defaultLanguage: string;
  defaultDateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
  defaultTimeFormat: '12h' | '24h';
  timeZone: string;
  currency: string;
  currencySymbol: string;
  recordsPerPageDefault: number;
  enableAuditLogging: boolean;
  maintenanceMode: boolean;
}

export interface NotificationSettings {
  emailAlertsOnSuspension: boolean;
  emailAlertsOnRoleChange: boolean;
  emailAlertsOnFailedLogins: boolean;
  notifyOnNewUserCreation: boolean;
  systemAlertBroadcast: boolean;
}

export interface SystemSettings {
  company: Company;
  general: GeneralSettings;
  security: SecuritySettings;
  notifications: NotificationSettings;
}

// ==========================================
// 2. PHASE 2: ACCOUNTS & DOUBLE-ENTRY LEDGER
// ==========================================

export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Cost of Service' | 'Expense' | 'Other Income' | 'Other Expense' | 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
export type NormalBalance = 'Debit' | 'Credit';
export type VoucherType = 'GV' | 'PV' | 'RV' | 'JV' | 'CV'; // General, Payment, Receipt, Journal, Contra
export type VoucherStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'POSTED' | 'REVERSED' | 'CANCELLED';
export type AccountingPeriodStatus = 'OPEN' | 'CLOSED' | 'LOCKED';

export interface ChartOfAccount {
  id: string;
  code: string; // e.g. "1111", "4110"
  accountCode?: string;
  name: string;
  parentCode?: string;
  type: AccountType;
  category: string;
  normalBalance: NormalBalance;
  level: number;
  isGroup: boolean; // Group accounts cannot be posted to
  isPostable: boolean;
  status: 'active' | 'inactive';
  description?: string;
  balance: number; // dynamically computed
}

export interface AccountingPeriod {
  id: string;
  fiscalYear: string; // e.g. "2026-2027"
  name: string; // e.g. "September 2026"
  startDate: string;
  endDate: string;
  status: AccountingPeriodStatus;
}

export interface VoucherLine {
  id: string;
  accountCode: string;
  accountName: string;
  subledgerType?: 'Client' | 'Supplier' | 'Employee' | 'Site' | 'None';
  subledgerId?: string;
  subledgerName?: string;
  description: string;
  debit: number;
  credit: number;
  branch?: string;
  department?: string;
  costCenter?: string;
  client?: string;
  site?: string;
  guard?: string;
}

export interface Voucher {
  id: string;
  voucherNumber: string; // e.g. PV-2026-0001
  type: VoucherType;
  date: string;
  periodId: string;
  branch: string;
  referenceNumber?: string;
  externalReference?: string;
  payeePayer?: string;
  paymentMethod?: 'Cash' | 'Bank Transfer' | 'Cheque' | 'Online' | 'Other';
  cashOrBankAccountId?: string;
  narration: string;
  lines: VoucherLine[];
  totalDebit: number;
  totalCredit: number;
  status: VoucherStatus;
  reversalVoucherId?: string;
  reversedFromVoucherId?: string;
  reversalReason?: string;
  createdAt: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  postedBy?: string;
  postedAt?: string;
}

export interface JournalEntryLine {
  id: string;
  journalEntryId: string;
  accountCode: string;
  accountName: string;
  subledgerType?: string;
  subledgerId?: string;
  subledgerName?: string;
  description: string;
  debit: number;
  credit: number;
  branch?: string;
  costCenter?: string;
  client?: string;
  site?: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string; // e.g. JE-2026-0001
  date: string;
  sourceType: 'General Voucher' | 'Payment Voucher' | 'Receipt Voucher' | 'Journal Voucher' | 'Contra Voucher' | 'Client Invoice' | 'Client Receipt' | 'Payroll Posting' | 'Opening Balance' | 'Depreciation';
  sourceReference: string; // Voucher / Invoice / Payroll ID
  voucherNumber?: string;
  narration: string;
  periodId: string;
  lines: JournalEntryLine[];
  totalDebit: number;
  totalCredit: number;
  status: 'POSTED' | 'REVERSED';
  postedBy: string;
  postedAt: string;
}

export interface CashAccount {
  id: string;
  name: string; // e.g. "Main Cash Box - Head Office"
  accountCode: string; // linked to COA e.g. "1111"
  glAccountCode?: string;
  branch: string;
  responsiblePerson: string;
  custodianName?: string;
  status: 'active' | 'inactive';
  openingBalance: number;
  currentBalance: number;
}

export interface BankAccount {
  id: string;
  accountName: string; // e.g. "MSS Primary Corporate Account"
  accountTitle?: string;
  bankName: string; // e.g. "Habib Bank Limited" / "Chase Bank"
  accountNumber: string;
  iban?: string;
  branchName: string;
  accountType: 'Current' | 'Savings' | 'Operational' | string;
  linkedAccountCode: string; // linked to COA e.g. "1121"
  glAccountCode?: string;
  branch: string;
  status: 'active' | 'inactive';
  openingBalance: number;
  currentBalance: number;
}

export interface OpeningBalanceBatch {
  id: string;
  batchNumber: string;
  openingDate: string;
  fiscalYear: string;
  description: string;
  lines: VoucherLine[];
  totalDebit: number;
  totalCredit: number;
  status: 'DRAFT' | 'POSTED';
  createdAt: string;
  createdBy: string;
  postedAt?: string;
}

export interface Supplier {
  id: string;
  code: string; // e.g. "SUP-0001"
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  taxRegistrationNumber: string;
  paymentTerms: string;
  status: 'active' | 'inactive';
  balance: number;
}

// ==========================================
// 3. PHASE 3: CLIENTS, CONTRACTS & SITES
// ==========================================

export type ClientType = 'Corporate' | 'Commercial' | 'Industrial' | 'Educational' | 'Healthcare' | 'Residential' | 'Government' | 'Event' | 'Other' | string;
export type ClientStatus = 'Lead' | 'Active' | 'Inactive' | 'Suspended' | 'Archived' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'LEAD';
export type ContractStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'ACTIVE' | 'EXPIRING' | 'EXPIRED' | 'SUSPENDED' | 'TERMINATED' | 'CANCELLED';
export type SiteStatus = 'PLANNED' | 'ACTIVE' | 'TEMPORARILY SUSPENDED' | 'CLOSED' | 'CONTRACT ENDED' | 'INACTIVE';
export type InvoiceStatus = 'DRAFT' | 'PENDING APPROVAL' | 'APPROVED' | 'ISSUED' | 'PARTIALLY PAID' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface ClientContact {
  id: string;
  name: string;
  designation: string;
  department?: string;
  phone: string;
  email: string;
  isPrimary: boolean;
  isBilling: boolean;
  isEmergency: boolean;
}

export interface ClientDocument {
  id: string;
  title: string;
  type: string;
  fileUrl?: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'VALID' | 'EXPIRING' | 'EXPIRED';
}

export interface Client {
  id: string;
  code: string; // e.g. CLI-0001
  type: ClientType;
  category?: string;
  legalName: string;
  displayName: string;
  companyName?: string;
  name?: string;
  businessRegNumber: string;
  taxNumber: string;
  primaryContact: string;
  contactPerson?: string;
  designation: string;
  phone: string;
  email: string;
  billingAddress: string;
  address?: string;
  city: string;
  stateProvince: string;
  creditLimit: number;
  paymentTerms: string; // e.g. "Net 30 Days"
  paymentTermsDays?: number;
  status: ClientStatus;
  notes?: string;
  contacts: ClientContact[];
  documents: ClientDocument[];
  totalOutstanding: number;
  contractsCount?: number;
  guardedSitesCount?: number;
  activeGuardsCount?: number;
  createdAt: string;
  createdBy: string;
}

export interface SecurityContract {
  id: string;
  contractNumber: string; // e.g. CTR-2026-001
  title: string;
  clientId: string;
  clientName: string;
  type: 'Monthly Security Services' | 'Annual Security Services' | 'Short-Term' | 'Event Security' | 'Mobile Patrol' | 'VIP Escort' | string;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  billingFrequency: 'Monthly' | 'Bi-Weekly' | 'Weekly' | 'Fixed' | string;
  contractValue: number;
  billingMethod: 'Fixed Monthly Billing' | 'Per Guard Billing' | 'Per Shift Billing' | 'Per Hour Billing' | string;
  monthlyRate: number;
  totalMonthlyValue?: number;
  unarmedGuardsCount?: number;
  armedGuardsCount?: number;
  unarmedRatePerGuard?: number;
  armedRatePerGuard?: number;
  perGuardRate?: number;
  noticePeriodDays: number;
  autoRenewal: boolean;
  termsAndConditions?: string;
  createdAt: string;
  approvedBy?: string;
  activatedAt?: string;
}

export type Contract = SecurityContract;

export interface SecuritySite {
  id: string;
  siteCode: string; // e.g. SIT-0001
  code?: string;
  name: string;
  clientId: string;
  clientName: string;
  contractId: string;
  contractNumber: string;
  type: 'Factory' | 'Office' | 'Commercial Plaza' | 'Warehouse' | 'Hospital' | 'School' | 'Residential Community' | 'Event Venue';
  address: string;
  city: string;
  primaryContact: string;
  emergencyContact: string;
  phone: string;
  status: SiteStatus;
  operatingHours: string; // e.g. "24/7 (2 Shifts)"
  requiredGuardsCount: number;
  dayGuardsRequired?: number;
  nightGuardsRequired?: number;
  armedGuardsRequired?: number;
  unarmedGuardsRequired?: number;
  siteInchargeName?: string;
  siteInchargePhone?: string;
  specialInstructions?: string;
  notes?: string;
  createdAt: string;
}

export interface GuardRequirementLine {
  id: string;
  positionType: 'Security Guard' | 'Armed Guard' | 'Supervisor' | 'Site Incharge' | 'CCTV Operator' | 'Lady Guard' | 'Dog Handler';
  requiredCount: number;
  shift: 'Day Shift' | 'Night Shift' | '24h Rotation' | 'Custom';
  startTime: string; // "08:00"
  endTime: string; // "20:00"
  workingDays: string; // "7 Days / Week"
  billingRatePerUnit: number;
}

export interface GuardRequirement {
  id: string;
  code: string; // e.g. GSQ-0001
  clientId: string;
  clientName: string;
  contractId: string;
  contractNumber: string;
  siteId: string;
  siteName: string;
  effectiveStartDate: string;
  effectiveEndDate?: string;
  status: 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'EXPIRED';
  lines: GuardRequirementLine[];
  totalMonthlyBillingEstimate: number;
  approvedBy?: string;
  createdAt: string;
}

export interface SiteBillingLine {
  id: string;
  serviceDescription: string;
  quantity: number;
  unit: string;
  rate: number;
  taxPercent: number;
  discount: number;
  netAmount: number;
}

export interface SiteBilling {
  id: string;
  billingNumber: string; // BIL-2026-0001
  clientId: string;
  clientName: string;
  contractId: string;
  siteId: string;
  siteName: string;
  billingPeriod: string; // e.g. "August 2026"
  billingStartDate: string;
  billingEndDate: string;
  billingDate: string;
  status: 'DRAFT' | 'APPROVED' | 'INVOICED';
  lines: SiteBillingLine[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  createdInvoiceId?: string;
  createdAt: string;
}

export interface ClientInvoiceLine {
  id: string;
  serviceDescription: string;
  quantity: number;
  unit: string;
  rate: number;
  grossAmount: number;
  discount: number;
  taxAmount: number;
  netAmount: number;
}

export interface ClientInvoice {
  id: string;
  invoiceNumber: string; // INV-2026-0001
  clientId: string;
  clientName: string;
  billingAddress?: string;
  contractId?: string;
  siteId?: string;
  siteName?: string;
  invoiceDate: string;
  dueDate: string;
  billingPeriod?: string;
  billingMonth?: string;
  status: InvoiceStatus;
  lines?: ClientInvoiceLine[];
  items?: any[];
  subtotal: number;
  taxTotal?: number;
  taxAmount?: number;
  discountTotal?: number;
  grandTotal?: number;
  totalAmount?: number;
  paidAmount: number;
  outstandingAmount: number;
  glJournalEntryId?: string;
  createdAt: string;
  issuedAt?: string;
}

export interface PaymentAllocation {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  allocatedAmount: number;
}

export interface ClientReceipt {
  id: string;
  receiptNumber: string; // RCT-2026-0001
  receiptDate: string;
  clientId: string;
  clientName: string;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Cheque' | 'Online';
  cashOrBankAccountId: string;
  cashOrBankAccountName: string;
  amountReceived: number;
  paymentReference: string;
  allocations: PaymentAllocation[];
  unallocatedAmount: number;
  narration: string;
  status: 'DRAFT' | 'POSTED';
  linkedVoucherId?: string;
  createdAt: string;
  postedAt?: string;
}

// ==========================================
// 4. PHASE 4: GUARDS & SECURITY OPERATIONS
// ==========================================

export type EmployeeType = 'Security Guard' | 'Armed Guard' | 'Security Supervisor' | 'Site Incharge' | 'Operations Manager' | 'Driver' | 'CCTV Operator' | 'Office Staff';
export type EmploymentStatus = 'APPLICANT' | 'ACTIVE' | 'ON LEAVE' | 'SUSPENDED' | 'RESIGNED' | 'TERMINATED' | 'ARCHIVED';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EARLY DEPARTURE' | 'ON LEAVE' | 'REST DAY' | 'HOLIDAY';
export type AssignmentStatus = 'DRAFT' | 'PENDING APPROVAL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type Guard = GuardPersonnel;

export interface GuardPersonnel {
  id: string;
  employeeCode: string; // MSS-GRD-0001
  guardCode?: string;
  fullName: string;
  fatherName: string;
  employeeType: EmployeeType;
  cnicOrNationalId: string;
  cnic?: string;
  phone: string;
  secondaryPhone?: string;
  email?: string;
  currentAddress: string;
  permanentAddress: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  profilePhoto?: string;
  joiningDate: string;
  joinDate?: string;
  employmentType: 'Permanent' | 'Contract' | 'Daily Worker';
  designation: string;
  rank?: string;
  department: string;
  branch: string;
  status: EmploymentStatus;
  currentSiteId?: string;
  currentSiteName?: string;
  currentShiftId?: string;
  isArmedCertified: boolean;
  isArmedAuthorized?: boolean;
  gunLicenseNumber?: string;
  weaponLicenseNumber?: string;
  monthlyBasicSalary?: number;
  uniformSizeShirt?: string; // M, L, XL
  uniformSizePants?: string; // 32, 34, 36
  shoeSize?: string; // 8, 9, 10
  documents: {
    id: string;
    title: string;
    type: 'CNIC' | 'Police Verification' | 'Guard License' | 'Training Certificate' | 'Medical Clearance';
    issueDate: string;
    expiryDate?: string;
    status: 'VALID' | 'EXPIRING' | 'EXPIRED';
  }[];
  createdAt: string;
}

export interface SecurityShift {
  id: string;
  code: string; // SHF-001
  name: string; // "Day Shift", "Night Shift"
  startTime: string; // "08:00"
  endTime: string; // "20:00"
  breakDurationMinutes: number;
  workingHours: number; // 12
  crossesMidnight: boolean;
  gracePeriodMinutes: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface GuardAssignment {
  id: string;
  assignmentNumber: string; // ASG-2026-0001
  employeeId: string;
  guardId?: string;
  employeeCode: string;
  employeeName: string;
  guardName?: string;
  employeeType: EmployeeType;
  postDesignation?: string;
  clientId: string;
  clientName: string;
  contractId: string;
  siteId: string;
  siteName: string;
  shiftId: string;
  shiftName: string;
  shift?: string;
  supervisorName: string;
  startDate: string;
  endDate?: string;
  type: 'Permanent Site Assignment' | 'Relief Assignment' | 'Short-Term Assignment' | 'Emergency Deployment';
  status: AssignmentStatus;
  approvedBy?: string;
  createdAt: string;
}

export interface DailyDeploymentLine {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  employeeType: EmployeeType;
  positionType: string;
  attendanceStatus: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  hoursWorked?: number;
  isRelief: boolean;
  notes?: string;
}

export interface DailyDeployment {
  id: string;
  date: string;
  clientId: string;
  clientName: string;
  contractId: string;
  siteId: string;
  siteName: string;
  shiftId: string;
  shiftName: string;
  supervisorName: string;
  requiredPersonnelCount: number;
  deployedPersonnelCount: number;
  shortageCount: number; // required - deployed
  status: 'DRAFT' | 'APPROVED' | 'PUBLISHED';
  lines: DailyDeploymentLine[];
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  guardId?: string;
  employeeCode: string;
  employeeName: string;
  guardName?: string;
  employeeType?: EmployeeType | string;
  date: string;
  siteId: string;
  siteName: string;
  shiftId: string;
  shiftName: string;
  shift?: string;
  scheduledStart: string;
  scheduledEnd: string;
  checkInTime?: string;
  checkOutTime?: string;
  hoursWorked?: number;
  lateMinutes?: number;
  earlyDepartureMinutes?: number;
  overtimeHours?: number;
  status: AttendanceStatus;
  source: 'MANUAL' | 'BIOMETRIC' | 'SUPERVISOR_APP' | 'MANUAL_ENTRY';
  isPeriodLocked?: boolean;
  verifiedBySupervisor?: boolean;
  supervisorName?: string;
  notes?: string;
}

export interface OvertimeRecord {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  guardName?: string;
  date: string;
  siteId: string;
  siteName: string;
  shiftId: string;
  shiftName: string;
  scheduledHours: number;
  actualHours: number;
  hours?: number;
  eligibleOvertimeHours: number;
  approvedOvertimeHours: number;
  ratePerHour: number;
  hourlyRate?: number;
  overtimeAmount: number;
  totalAmount?: number;
  status: 'PENDING APPROVAL' | 'APPROVED' | 'REJECTED' | 'LOCKED' | 'PENDING';
  reason?: string;
  supervisorName: string;
  approvedBy?: string;
  createdAt: string;
}

export interface SupervisorMonitoring {
  id: string;
  date: string;
  supervisorId: string;
  supervisorName: string;
  siteId: string;
  siteName: string;
  shiftName: string;
  operationalStatus: 'FULLY STAFFED' | 'SHORTAGE' | 'INCIDENT REPORTED' | 'NORMAL';
  assignedGuardsCount: number;
  presentGuardsCount: number;
  absentGuardsCount: number;
  shortageCount: number;
  observations: string;
  status: 'COMPLETED' | 'REQUIRES ATTENTION';
  createdAt: string;
}

// ==========================================
// 5. PHASE 5: PAYROLL & SALARY PROCESSING
// ==========================================

export type SalaryComponentType = 'EARNING' | 'DEDUCTION' | 'EMPLOYER_COST';
export type PayrollPeriodStatus = 'DRAFT' | 'OPEN' | 'PROCESSING' | 'APPROVED' | 'POSTED' | 'PAID' | 'CLOSED' | 'LOCKED';

export interface SalaryComponent {
  id: string;
  code: string; // e.g. "BAS_SAL", "HOUSE_ALLW", "ADV_REC"
  name: string;
  type: SalaryComponentType;
  calculationMethod: 'Fixed Amount' | 'Percentage' | 'Attendance-Based' | 'Overtime-Based';
  isRecurring: boolean;
  status: 'active' | 'inactive';
  description?: string;
}

export interface SalaryStructureLine {
  id: string;
  componentId: string;
  componentCode: string;
  componentName: string;
  type: SalaryComponentType;
  amount: number;
  percentage?: number;
}

export interface SalaryStructure {
  id: string;
  code: string; // e.g. "STR-GRD-01"
  name: string; // "Standard Guard Salary Structure"
  designation: string;
  effectiveStartDate: string;
  status: 'ACTIVE' | 'ARCHIVED';
  lines: SalaryStructureLine[];
  baseGrossSalary: number;
  createdAt: string;
}

export interface EmployeeSalarySetup {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  designation: string;
  salaryStructureId: string;
  salaryStructureName: string;
  basicSalary: number;
  houseAllowance: number;
  transportAllowance: number;
  otherAllowances: number;
  grossSalary: number;
  preferredPaymentMethod: 'Cash' | 'Bank Transfer';
  bankAccountNumber?: string;
  bankName?: string;
  status: 'active' | 'inactive';
}

export interface PayrollPeriod {
  id: string;
  periodName: string; // "August 2026"
  startDate: string;
  endDate: string;
  payDate: string;
  status: PayrollPeriodStatus;
  createdAt: string;
  approvedBy?: string;
  postedAt?: string;
}

export interface EmployeeAdvance {
  id: string;
  advanceNumber: string; // ADV-2026-0001
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  advanceDate: string;
  requestedAmount: number;
  approvedAmount: number;
  paidAmount: number;
  installmentsCount: number;
  monthlyInstallmentAmount: number;
  recoveredAmount: number;
  outstandingBalance: number;
  reason: string;
  status: 'REQUESTED' | 'APPROVED' | 'PAID' | 'PARTIALLY RECOVERED' | 'FULLY RECOVERED' | 'REJECTED';
  createdAt: string;
  approvedBy?: string;
}

export interface EmployeeDeduction {
  id: string;
  deductionNumber: string; // DED-2026-0001
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  type: 'Late Deduction' | 'Uniform Penalty' | 'Unpaid Absence' | 'Disciplinary' | 'Other';
  amount: number;
  effectivePeriod: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'APPLIED' | 'REJECTED';
  createdAt: string;
  approvedBy?: string;
}

export interface PayrollEmployeeLine {
  id: string;
  payrollPeriodId: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  designation: string;
  siteName: string;
  basicSalary: number;
  allowances: number;
  overtimeHours: number;
  overtimeAmount: number;
  attendanceAdjustment: number;
  grossEarnings: number;
  advanceRecovery: number;
  otherDeductions: number;
  totalDeductions: number;
  netPay: number;
  paidAmount: number;
  outstandingPayable: number;
  paymentStatus: 'UNPAID' | 'PARTIALLY PAID' | 'PAID';
}

export interface SalaryPayment {
  id: string;
  paymentNumber: string; // SAL-PAY-2026-0001
  payrollPeriodId: string;
  periodName: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  paymentDate: string;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Cheque';
  cashOrBankAccountId: string;
  cashOrBankAccountName: string;
  amountPaid: number;
  referenceNumber: string;
  status: 'POSTED';
  linkedVoucherId?: string;
  createdAt: string;
  postedBy: string;
}

// ==========================================
// 6. PHASE 6: INVENTORY & ASSETS
// ==========================================

export type ItemType = 'General Inventory' | 'Uniform' | 'Equipment' | 'Consumable' | 'Fixed Asset Candidate';
export type StockMovementType = 'STOCK_IN' | 'STOCK_OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'RETURN';
export type ItemCondition = 'GOOD' | 'USED' | 'DAMAGED' | 'REPAIR REQUIRED' | 'UNUSABLE' | 'LOST';

export interface ItemCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: 'active' | 'inactive';
}

export interface InventoryItem {
  id: string;
  itemCode: string; // MSS-INV-0001
  name: string;
  category: string;
  itemType: ItemType;
  unitOfMeasure: 'Piece' | 'Pair' | 'Box' | 'Set' | 'Unit' | 'Meter';
  brand?: string;
  model?: string;
  description?: string;
  minStockLevel: number;
  reorderLevel: number;
  defaultWarehouseId: string;
  totalQuantity: number;
  availableQuantity: number;
  issuedQuantity: number;
  unitCost: number;
  status: 'active' | 'inactive';
}

export interface Warehouse {
  id: string;
  code: string; // WH-01
  name: string; // "Main Central Armory & Inventory Store"
  branch: string;
  address: string;
  responsiblePerson: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface StockMovement {
  id: string;
  movementNumber: string; // STK-IN-2026-0001
  type: StockMovementType;
  date: string;
  warehouseId: string;
  warehouseName: string;
  destinationWarehouseId?: string;
  destinationWarehouseName?: string;
  recipientType?: 'Employee' | 'Site' | 'Department' | 'Supplier';
  recipientId?: string;
  recipientName?: string;
  referenceNumber?: string;
  reason?: string;
  status: 'DRAFT' | 'APPROVED' | 'POSTED';
  lines: {
    id: string;
    itemId: string;
    itemCode: string;
    itemName: string;
    unit: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    condition: ItemCondition;
  }[];
  totalAmount: number;
  createdAt: string;
  postedBy?: string;
}

export interface UniformIssueRecord {
  id: string;
  issueNumber: string; // UNI-ISS-2026-0001
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  uniformItem: 'Security Shirt' | 'Security Pants' | 'Combat Boots' | 'Beret / Cap' | 'Security Belt' | 'Winter Jacket';
  size: string; // M, L, XL, 34, 36, 9
  quantity: number;
  issueDate: string;
  expectedReturnDate?: string;
  condition: ItemCondition;
  status: 'ISSUED' | 'RETURNED' | 'LOST' | 'DAMAGED';
  returnedDate?: string;
  returnCondition?: ItemCondition;
  notes?: string;
}

export interface EquipmentRecord {
  id: string;
  equipmentCode: string; // MSS-EQP-0001
  name: string; // "Motorola 2-Way VHF Radio"
  category: 'Communication' | 'Inspection & Metal Detector' | 'Patrol Torch' | 'Safety & First Aid' | 'Body Camera';
  brand: string;
  model: string;
  serialNumber: string;
  currentStatus: 'AVAILABLE' | 'ISSUED' | 'ASSIGNED TO SITE' | 'UNDER MAINTENANCE' | 'DAMAGED' | 'LOST';
  currentLocation: string; // "Warehouse", "Faisalabad Industrial Site"
  currentCustodianId?: string;
  currentCustodianName?: string;
  condition: ItemCondition;
  purchaseCost: number;
  purchaseDate: string;
}

export interface FixedAsset {
  id: string;
  assetCode: string; // MSS-AST-0001
  name: string; // "Toyota Hilux Patrol Vehicle"
  category: 'Vehicles' | 'Office Furniture' | 'IT Equipment' | 'Surveillance & CCTV' | 'Power Generators';
  serialNumber?: string;
  purchaseDate: string;
  capitalizationDate: string;
  purchaseCost: number;
  usefulLifeYears: number;
  depreciationMethod: 'Straight Line' | 'Reducing Balance';
  residualValue: number;
  accumulatedDepreciation: number;
  currentBookValue: number;
  status: 'ACTIVE' | 'ASSIGNED' | 'UNDER MAINTENANCE' | 'DISPOSED';
  location: string;
  custodianName?: string;
  disposalDate?: string;
  disposalValue?: number;
}

// ==========================================
// 7. PHASE 7: WEAPONS & CONTROLLED EQUIPMENT
// ==========================================

export type ControlledItemStatus = 
  | 'REGISTERED' 
  | 'AVAILABLE' 
  | 'IN AUTHORIZED CUSTODY' 
  | 'ASSIGNED' 
  | 'IN TRANSFER' 
  | 'PENDING RETURN' 
  | 'REQUIRES INSPECTION' 
  | 'UNDER MAINTENANCE' 
  | 'DAMAGED' 
  | 'LOST' 
  | 'SUSPENDED' 
  | 'RETIRED' 
  | 'ARCHIVED';

export type ControlledCategory = 
  | 'Licensed Firearm' 
  | 'Tactical Body Armor' 
  | 'Ammunition & Magazines' 
  | 'High-Security Keyvault' 
  | 'Tactical Restraints & Batons' 
  | 'Ballistic Shield';

export interface ControlledDocument {
  id: string;
  documentType: 'State License' | 'BSIS Permit' | 'Ballistic Certification' | 'Armorer Inspection Certificate' | 'Police NOC';
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  status: 'VALID' | 'EXPIRING SOON' | 'EXPIRED';
}

export interface ControlledItem {
  id: string;
  recordNumber: string; // MSS-CTRL-000001
  itemName: string; // "Glock 17 9mm Tactical / Remington 870"
  category: ControlledCategory;
  classification: 'RESTRICTED' | 'LICENSED' | 'TACTICAL CUSTODY';
  manufacturer: string;
  model: string;
  serialNumber: string;
  licenseNumber: string;
  registrationDate: string;
  currentStatus: ControlledItemStatus;
  currentAuthorizedLocation: string; // "HQ Secure Armory Safe 01"
  currentCustodianId?: string;
  currentCustodianName?: string;
  custodianAuthorizationRef?: string;
  conditionStatus: 'GOOD' | 'SERVICED' | 'NEEDS INSPECTION' | 'MAINTENANCE REQUIRED' | 'DAMAGED';
  documents: ControlledDocument[];
  notes?: string;
}

export interface AuthorizedPersonnelRecord {
  id: string;
  employeeId: string;
  employeeCode: string;
  fullName: string;
  designation: string;
  authorizationStatus: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'PENDING';
  gunLicenseNumber: string;
  licenseExpiryDate: string;
  trainingCertNumber: string;
  trainingCertExpiryDate: string;
  approvedScope: string; // "Armored Escort / Site Tactical"
  approvedBy: string;
  approvedAt: string;
}

export interface ControlledCustodyMovement {
  id: string;
  movementNumber: string; // MOV-2026-0001
  controlledItemId: string;
  controlledItemName: string;
  serialNumber: string;
  movementType: 'REGISTRATION' | 'ISSUE' | 'RETURN' | 'TRANSFER' | 'INSPECTION' | 'MAINTENANCE' | 'INCIDENT';
  previousStatus: ControlledItemStatus;
  newStatus: ControlledItemStatus;
  fromLocationOrCustodian: string;
  toLocationOrCustodian: string;
  date: string;
  time: string;
  performedBy: string;
  approvedBy?: string;
  authorizationReference?: string;
  condition: string;
  notes?: string;
}

export interface ToastNotification {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface ControlledIncident {
  id: string;
  incidentNumber: string; // INC-2026-0001
  type: 'LOST' | 'DAMAGED' | 'ACCIDENTAL DISCHARGE ATTEMPT' | 'STORAGE COMPROMISE';
  controlledItemId: string;
  controlledItemName: string;
  serialNumber: string;
  custodianName: string;
  location: string;
  dateReported: string;
  reportedBy: string;
  description: string;
  status: 'OPEN' | 'REPORTED' | 'UNDER REVIEW' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';
  resolution?: string;
  reviewedBy?: string;
}

// ==========================================
// 8. PHASE 8: REPORTS & EXPORT CENTER
// ==========================================

export type ReportCategory = 
  | 'OPERATIONAL' 
  | 'ATTENDANCE' 
  | 'GUARD' 
  | 'PAYROLL' 
  | 'FINANCIAL' 
  | 'INVENTORY' 
  | 'CONTROLLED_EQUIPMENT';

export interface SavedReport {
  id: string;
  name: string;
  category: ReportCategory;
  reportCode: string;
  filters: Record<string, any>;
  createdAt: string;
  createdBy: string;
}

export interface ExportHistoryRecord {
  id: string;
  userName: string;
  userRole: string;
  reportCategory: ReportCategory;
  reportName: string;
  exportFormat: 'PDF' | 'EXCEL' | 'CSV' | 'PRINT';
  dateRange: string;
  filterSummary: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED';
  isSensitive: boolean;
}

// ==========================================
// 9. PHASE 9: SYSTEM CONTROL, BACKUPS & RESET
// ==========================================

export interface BackupPackage {
  id: string;
  backupNumber?: string; // BKP-2026-0001
  packageNumber?: string;
  type: 'FULL_BACKUP' | 'ACCOUNTS' | 'OPERATIONS' | 'PAYROLL' | 'CONFIGURATION' | 'SAFETY_AUTO' | string;
  name: string;
  timestamp?: string;
  createdAt?: string;
  sizeBytes: number;
  recordsCount: number;
  status: 'VALID' | 'CORRUPTED';
  createdBy: string;
  dataSnapshot: Record<string, any>;
}

export interface PermissionTestResult {
  id: string;
  roleOrUser: string;
  module: string;
  action: string;
  permissionCode: string;
  expectedResult: 'ALLOW' | 'DENY';
  actualResult: 'ALLOW' | 'DENY';
  passed: boolean;
  timestamp: string;
}

export interface ResetAllDataOptions {
  scope?: string;
  modules?: string[];
  resetAccounts?: boolean;
  resetClientsAndContracts?: boolean;
  resetOperationsAndGuards?: boolean;
  resetAttendance?: boolean;
  resetPayroll?: boolean;
  resetInventory?: boolean;
  resetControlledEquipment?: boolean;
  resetAuditAndReportsConfig?: boolean;
  preserveLogoAndBranding?: boolean;
  preserveSuperAdmin?: boolean;
  preserveRolesAndPermissions?: boolean;
  preserveCoreSettings?: boolean;
}

// Global active tabs across the ERP
export type ActiveTab =
  | 'dashboard'
  | 'company-profile'
  | 'users'
  | 'roles'
  | 'permissions'
  | 'settings'
  | 'audit-logs'
  // Accounts
  | 'accounts-dashboard'
  | 'chart-of-accounts'
  | 'opening-balances'
  | 'vouchers'
  | 'journal-entries'
  | 'general-ledger'
  | 'account-ledger'
  | 'cash-management'
  | 'bank-management'
  | 'accounts-receivable'
  | 'accounts-payable'
  | 'financial-reports'
  // Clients & Sites
  | 'clients-dashboard'
  | 'clients-list'
  | 'contracts-list'
  | 'security-sites'
  | 'guard-requirements'
  | 'site-billing'
  | 'client-invoices'
  | 'client-receipts'
  | 'client-statements'
  | 'billing-reports'
  // Guards & Operations
  | 'operations-dashboard'
  | 'guards-roster'
  | 'guard-assignments'
  | 'shift-management'
  | 'daily-deployment'
  | 'attendance-management'
  | 'overtime-management'
  | 'supervisor-monitoring'
  | 'operations-reports'
  // Payroll
  | 'payroll-dashboard'
  | 'salary-structures'
  | 'salary-components'
  | 'employee-salary-setup'
  | 'payroll-periods'
  | 'payroll-processing'
  | 'employee-advances'
  | 'employee-deductions'
  | 'salary-payments'
  | 'payslips'
  | 'payroll-reports'
  // Inventory & Assets
  | 'inventory-dashboard'
  | 'item-master'
  | 'warehouses'
  | 'stock-movements'
  | 'uniform-management'
  | 'equipment-management'
  | 'site-equipment'
  | 'fixed-assets'
  | 'inventory-reports'
  // Controlled Equipment (Weapons & High-Security)
  | 'controlled-dashboard'
  | 'controlled-item-register'
  | 'authorized-personnel'
  | 'authorized-locations'
  | 'controlled-custody'
  | 'controlled-inspections'
  | 'controlled-maintenance'
  | 'controlled-incidents'
  | 'controlled-reports'
  // Reports & Export Center
  | 'reporting-center'
  | 'saved-reports'
  | 'export-history'
  // System Control
  | 'system-health'
  | 'activity-history'
  | 'backup-recovery'
  | 'notifications-center'
  | 'permission-testing'
  | 'final-validation'
  | 'danger-zone-reset'
  | string;

export interface FutureModuleMeta {
  id: string;
  name: string;
  group: string;
  iconName: string;
  phase: string;
  description: string;
  plannedEntities: string[];
  requiredPermissions: string[];
  features: string[];
}

export interface GuardAdvance {
  id: string;
  guardId: string;
  guardCode?: string;
  guardName: string;
  employeeName?: string;
  advanceAmount?: number;
  amount?: number;
  approvedAmount?: number;
  monthlyDeduction?: number;
  monthlyDeductionAmount?: number;
  monthlyRecoveryAmount?: number;
  recoveredAmount?: number;
  repaidAmount?: number;
  remainingBalance?: number;
  outstandingBalance?: number;
  requestDate: string;
  sanctionDate?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID' | 'RECOVERING' | 'RECOVERED';
  reason?: string;
  purpose?: string;
}

export interface PayrollRecord {
  id: string;
  guardId: string;
  guardCode: string;
  guardName: string;
  employeeName?: string;
  designation: string;
  siteName: string;
  basicSalary: number;
  monthlyBasicSalary?: number;
  dutyDays?: number;
  daysWorked?: number;
  overtimeHours: number;
  overtimeAmount: number;
  allowances: number;
  grossSalary: number;
  grossEarned?: number;
  advancesDeduction: number;
  advanceDeduction?: number;
  advanceRecovery?: number;
  uniformDeductions?: number;
  uniformDeduction?: number;
  eobiDeduction?: number;
  eobi?: number;
  penalties?: number;
  taxDeduction?: number;
  totalDeductions?: number;
  netPayable: number;
  netDisbursed?: number;
  paymentMethod?: string;
  month: string;
  year?: number;
  period?: string;
  status: 'DRAFT' | 'APPROVED' | 'PAID' | 'LOCKED' | string;
  processedAt?: string;
}

export interface UniformItem {
  id: string;
  itemCode: string;
  name: string;
  category: string;
  size: string;
  inStockQuantity: number;
  reorderLevel: number;
  costPerUnit: number;
}

export interface WeaponItem {
  id: string;
  itemCode: string;
  serialNumber: string;
  type: string;
  caliber: string;
  makeModel?: string;
  ammunitionRounds?: number;
  assignedGuardId?: string;
  assignedGuardName?: string;
  assignedSiteId?: string;
  assignedSiteName?: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'IN_VAULT' | 'ISSUED' | 'MAINTENANCE' | 'DECOMMISSIONED' | 'IN_ARMORY' | 'IN_REPAIR';
  condition: string;
}
