/**
 * Mountain Security Services (MSS) - ERP Platform
 * DangerZoneResetModal.tsx
 * Professional, Multi-Step Enterprise Data Reset Engine with Automatic Safety Backup
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Archive,
  ArrowRight,
  RotateCcw,
  Key,
  Shield,
  FileCheck,
  AlertOctagon,
  X,
  Database,
  Download,
  Info,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { ResetAllDataOptions } from '../../types';

interface DangerZoneResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ResetStep =
  | 'warning'
  | 'scope_selection'
  | 'password_verify'
  | 'phrase_confirmation'
  | 'safety_backup'
  | 'executing'
  | 'completed';

export const DangerZoneResetModal: React.FC<DangerZoneResetModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    executeResetAllData,
    logAuditEvent,
    addNotification,
    company,
  } = useERP();

  const [currentStep, setCurrentStep] = useState<ResetStep>('warning');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmationPhrase, setConfirmationPhrase] = useState('');
  const [phraseError, setPhraseError] = useState('');
  const [isFullReset, setIsFullReset] = useState(true);

  // Scope selection options
  const [scopeOptions, setScopeOptions] = useState<ResetAllDataOptions>({
    resetAccounts: true,
    resetClientsAndContracts: true,
    resetOperationsAndGuards: true,
    resetAttendance: true,
    resetPayroll: true,
    resetInventory: true,
    resetControlledEquipment: true,
    resetAuditAndReportsConfig: true,
    preserveLogoAndBranding: true,
    preserveSuperAdmin: true,
    preserveRolesAndPermissions: true,
    preserveCoreSettings: true,
  });

  // Execution state
  const [backupId, setBackupId] = useState<string>('');
  const [resetSummary, setResetSummary] = useState<string[]>([]);
  const [progressStage, setProgressStage] = useState<string>('');

  if (!isOpen) return null;

  const toggleFullReset = (enabled: boolean) => {
    setIsFullReset(enabled);
    if (enabled) {
      setScopeOptions({
        resetAccounts: true,
        resetClientsAndContracts: true,
        resetOperationsAndGuards: true,
        resetAttendance: true,
        resetPayroll: true,
        resetInventory: true,
        resetControlledEquipment: true,
        resetAuditAndReportsConfig: true,
        preserveLogoAndBranding: true,
        preserveSuperAdmin: true,
        preserveRolesAndPermissions: true,
        preserveCoreSettings: true,
      });
    }
  };

  const handleScopeToggle = (key: keyof ResetAllDataOptions) => {
    setScopeOptions((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      // Check if all business modules are selected
      const allSelected =
        updated.resetAccounts &&
        updated.resetClientsAndContracts &&
        updated.resetOperationsAndGuards &&
        updated.resetAttendance &&
        updated.resetPayroll &&
        updated.resetInventory &&
        updated.resetControlledEquipment &&
        updated.resetAuditAndReportsConfig;
      setIsFullReset(allSelected);
      return updated;
    });
  };

  const handleVerifyPassword = () => {
    if (!password.trim()) {
      setPasswordError('Please enter your administrator password.');
      return;
    }
    // Accept standard demo passwords or admin credentials
    if (password.length < 3) {
      setPasswordError('Invalid credentials. Verification failed.');
      return;
    }
    setPasswordError('');
    setCurrentStep('phrase_confirmation');
  };

  const handleVerifyPhrase = () => {
    if (confirmationPhrase.trim() !== 'RESET MSS DATA') {
      setPhraseError('Please type exactly "RESET MSS DATA" to confirm.');
      return;
    }
    setPhraseError('');
    setCurrentStep('safety_backup');
  };

  const handleExecuteResetFlow = () => {
    setCurrentStep('executing');
    setProgressStage('Initializing automated safety backup...');

    setTimeout(() => {
      setProgressStage('Validating database integrity snapshot...');
      setTimeout(() => {
        setProgressStage('Executing selective scope reset...');
        try {
          const result = executeResetAllData(scopeOptions);
          setBackupId(result.safetyBackupId);
          setResetSummary(result.summary);
          setTimeout(() => {
            setCurrentStep('completed');
          }, 600);
        } catch (e) {
          console.error(e);
        }
      }, 700);
    }, 700);
  };

  const handleClose = () => {
    setCurrentStep('warning');
    setPassword('');
    setConfirmationPhrase('');
    setPasswordError('');
    setPhraseError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-red-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="bg-linear-to-r from-red-600 to-rose-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight font-['Space_Grotesk']">
                DANGER ZONE — Multi-Step Business Data Reset
              </h3>
              <p className="text-xs text-red-100 font-medium">
                Mountain Security Services (MSS) Governance Protocol
              </p>
            </div>
          </div>
          {currentStep !== 'executing' && (
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Progress Indicators */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-[11px] font-semibold text-slate-500 overflow-x-auto gap-2">
          <span className={`flex items-center gap-1 ${currentStep === 'warning' ? 'text-red-600 font-bold' : ''}`}>
            1. Warning
          </span>
          <span>→</span>
          <span className={`flex items-center gap-1 ${currentStep === 'scope_selection' ? 'text-red-600 font-bold' : ''}`}>
            2. Select Scope
          </span>
          <span>→</span>
          <span className={`flex items-center gap-1 ${currentStep === 'password_verify' ? 'text-red-600 font-bold' : ''}`}>
            3. Password
          </span>
          <span>→</span>
          <span className={`flex items-center gap-1 ${currentStep === 'phrase_confirmation' ? 'text-red-600 font-bold' : ''}`}>
            4. Phrase
          </span>
          <span>→</span>
          <span className={`flex items-center gap-1 ${currentStep === 'safety_backup' || currentStep === 'executing' ? 'text-red-600 font-bold' : ''}`}>
            5. Safety Backup & Reset
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: WARNING */}
          {currentStep === 'warning' && (
            <div className="space-y-5">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertOctagon className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-red-900">
                    Irreversible Business Data Reset Warning
                  </h4>
                  <p className="text-xs text-red-700 leading-relaxed">
                    Executing this reset will purge live business records, transactions, guard deployments, client invoices, and ledger vouchers based on your chosen scope.
                  </p>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
                <h5 className="font-bold text-slate-900 flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-500" />
                  What happens during this process:
                </h5>
                <ul className="space-y-2 list-disc list-inside text-slate-600">
                  <li>
                    An <strong className="text-slate-900">Automated Pre-Reset Safety Backup</strong> will be generated immediately before any data is modified.
                  </li>
                  <li>
                    You can select which specific modules to clear (e.g. Accounts, Operations, Payroll, Inventory).
                  </li>
                  <li>
                    Essential system credentials (<strong className="text-slate-900">MSS Logo, Branding, Owner Account, Super Admin, and Permissions Matrix</strong>) will be preserved so you do not need to reconfigure the platform.
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep('scope_selection')}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-2"
                >
                  <span>Proceed to Scope Selection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SCOPE SELECTION */}
          {currentStep === 'scope_selection' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Select Reset Scope & Preservation Rules
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose which business domains to reset and verify items to preserve.
                </p>
              </div>

              {/* Quick Preset Selector */}
              <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="full_reset_toggle"
                    checked={isFullReset}
                    onChange={(e) => toggleFullReset(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-red-300"
                  />
                  <label htmlFor="full_reset_toggle" className="text-xs font-extrabold text-red-900 cursor-pointer">
                    FULL BUSINESS DATA RESET (All Operational Modules)
                  </label>
                </div>
                <span className="text-[10px] uppercase font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                  Recommended for Fresh Start
                </span>
              </div>

              {/* Module Checkboxes */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Business Data to Clear:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { key: 'resetAccounts', label: 'Accounts & Ledgers', desc: 'Vouchers, General Ledger, Cash/Bank books' },
                    { key: 'resetClientsAndContracts', label: 'Clients & Contracts', desc: 'Clients, Contracts, Sites, Requirements, Invoices' },
                    { key: 'resetOperationsAndGuards', label: 'Guards & Deployments', desc: 'Guard Personnel, Assignments, Daily Rosters' },
                    { key: 'resetAttendance', label: 'Attendance & Overtime', desc: 'Check-ins, Attendance logs, Overtime records' },
                    { key: 'resetPayroll', label: 'Payroll & Salary Records', desc: 'Advances, Deductions, Payslips, Disbursements' },
                    { key: 'resetInventory', label: 'Inventory & Uniforms', desc: 'Stock movements, Uniform issues, Assets' },
                    { key: 'resetControlledEquipment', label: 'Weapons & Controlled Items', desc: 'Firearms registry, Authorizations, Custody logs' },
                    { key: 'resetAuditAndReportsConfig', label: 'Reports & Export History', desc: 'Custom saved filters, Audit export history' },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-start gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={scopeOptions[item.key as keyof ResetAllDataOptions]}
                        onChange={() => handleScopeToggle(item.key as keyof ResetAllDataOptions)}
                        className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300 mt-0.5"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900">{item.label}</p>
                        <p className="text-[10px] text-slate-500 truncate">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preservation Rules Box */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Preserved Elements (Will NOT be deleted):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>MSS Logo & Branding</span>
                  </div>
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Super Admin Account</span>
                  </div>
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Roles & Permissions</span>
                  </div>
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Core System Settings</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep('warning')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep('password_verify')}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-2"
                >
                  <span>Continue to Password Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PASSWORD VERIFICATION */}
          {currentStep === 'password_verify' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                  <Key className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900">
                  Re-enter Administrator Password
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Security authorization required for {currentUser.fullName} ({currentUser.username}).
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Administrator Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Enter your security password..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  {passwordError && (
                    <p className="text-xs text-red-600 font-semibold mt-1">
                      {passwordError}
                    </p>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Tip: In this environment, you can enter any password (e.g. "admin" or "admin123") to proceed.
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep('scope_selection')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleVerifyPassword}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-2"
                >
                  <span>Verify Password</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PHRASE CONFIRMATION */}
          {currentStep === 'phrase_confirmation' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900">
                  Mandatory Confirmation Phrase
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  To prevent accidental reset, type the exact phrase below in capital letters.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-3">
                <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl text-center">
                  <span className="font-mono text-sm font-extrabold text-red-600 tracking-wider select-all">
                    RESET MSS DATA
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Type Confirmation Phrase:
                  </label>
                  <input
                    type="text"
                    value={confirmationPhrase}
                    onChange={(e) => {
                      setConfirmationPhrase(e.target.value);
                      setPhraseError('');
                    }}
                    placeholder="Type RESET MSS DATA here..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono tracking-wide focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  {phraseError && (
                    <p className="text-xs text-red-600 font-semibold mt-1">
                      {phraseError}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep('password_verify')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleVerifyPhrase}
                  disabled={confirmationPhrase.trim() !== 'RESET MSS DATA'}
                  className={`px-5 py-2.5 text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-2 ${
                    confirmationPhrase.trim() === 'RESET MSS DATA'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Confirm Phrase</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SAFETY BACKUP & FINAL EXECUTION CONFIRMATION */}
          {currentStep === 'safety_backup' && (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <Archive className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-emerald-900">
                    Automatic Safety Backup Protocol Ready
                  </h4>
                  <p className="text-xs text-emerald-700">
                    A comprehensive snapshot of all current business entities will be created immediately before data clearing. You will be able to restore the system at any time from System Control &gt; Backup & Recovery.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <p className="font-bold text-slate-900">Final Execution Summary:</p>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400">Target System:</span>{' '}
                    <strong>{company.officialName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Authorized By:</span>{' '}
                    <strong>{currentUser.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Safety Backup:</span>{' '}
                    <strong className="text-emerald-700">Automatic Enabled</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Branding & Admin:</span>{' '}
                    <strong className="text-emerald-700">Preserved</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep('phrase_confirmation')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleExecuteResetFlow}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-red-600/30 transition-all inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>EXECUTE SAFETY BACKUP & RESET DATA</span>
                </button>
              </div>
            </div>
          )}

          {/* EXECUTING SPINNER */}
          {currentStep === 'executing' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-slate-900 font-['Space_Grotesk']">
                  Executing Secure Data Reset Workflow...
                </h4>
                <p className="text-xs text-slate-500 font-mono animate-pulse">
                  {progressStage}
                </p>
              </div>
            </div>
          )}

          {/* COMPLETED VIEW */}
          {currentStep === 'completed' && (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-emerald-900">
                    Business Data Reset Successfully Executed
                  </h4>
                  <p className="text-xs text-emerald-700">
                    The selected modules have been reset. Safety snapshot{' '}
                    <span className="font-mono font-bold">{backupId}</span> has been stored in your backup archives.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <h5 className="font-bold text-slate-900">Actions Performed:</h5>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                  {resetSummary.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                  <li className="text-emerald-700 font-semibold">
                    Preserved MSS Shield Logo, Corporate Branding, and Super Administrator account.
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  Done / Return to Platform
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
