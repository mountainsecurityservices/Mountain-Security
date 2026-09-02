import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Clock,
  Lock,
  Globe,
  Bell,
  Save,
  RotateCcw,
  AlertTriangle,
  Key,
  ShieldAlert,
} from 'lucide-react';
import { FormField, Input, Select, Toggle } from '../common/FormComponents';
import { DangerZoneResetModal } from './DangerZoneResetModal';
import { useERP } from '../../context/ERPContext';
import { SystemSettings } from '../../types';

export const SystemSettingsView: React.FC = () => {
  const {
    systemSettings,
    updateSystemSettings,
    hasPermission,
    isSuperAdmin,
    addToast,
  } = useERP();

  const canEditSettings = isSuperAdmin() || hasPermission('settings.edit');
  const [formData, setFormData] = useState<SystemSettings>(systemSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'danger'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [dangerResetOpen, setDangerResetOpen] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditSettings) {
      addToast('You do not have permission to modify system settings.', 'error', 'Permission Denied');
      return;
    }

    setIsSaving(true);
    await updateSystemSettings(formData);
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            System Configuration & Security Governance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure enterprise security policies, session controls, localization, and system defaults.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isSuperAdmin() && (
            <button
              type="button"
              onClick={() => setDangerResetOpen(true)}
              className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Reset All Data</span>
            </button>
          )}

          {canEditSettings && (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-2"
            >
              {isSaving ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4 text-red-400" />
              )}
              <span>Save System Settings</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Settings Card with Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 shrink-0 whitespace-nowrap ${
              activeTab === 'general'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>General & Localization</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 shrink-0 whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & Policies</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 shrink-0 whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>

          {isSuperAdmin() && (
            <button
              type="button"
              onClick={() => setActiveTab('danger')}
              className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 shrink-0 whitespace-nowrap ${
                activeTab === 'danger'
                  ? 'border-rose-600 text-rose-600 bg-rose-50/40'
                  : 'border-transparent text-rose-500 hover:text-rose-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Danger Zone: Data Reset</span>
            </button>
          )}
        </div>

        {/* Tab Contents */}
        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk'] uppercase tracking-wider">
                Platform Identity & Regional Format Defaults
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="System Brand Title">
                  <Input
                    value={formData.general.systemName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general: { ...formData.general, systemName: e.target.value },
                      })
                    }
                  />
                </FormField>

                <FormField label="Default Corporate Timezone">
                  <Select
                    options={[
                      { label: 'America/Denver (MST / UTC-7)', value: 'America/Denver' },
                      { label: 'America/Los_Angeles (PST / UTC-8)', value: 'America/Los_Angeles' },
                      { label: 'America/Chicago (CST / UTC-6)', value: 'America/Chicago' },
                      { label: 'America/New_York (EST / UTC-5)', value: 'America/New_York' },
                      { label: 'UTC Universal Time', value: 'UTC' },
                    ]}
                    value={formData.general.timezone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general: { ...formData.general, timezone: e.target.value },
                      })
                    }
                  />
                </FormField>

                <FormField label="Date Format Presentation">
                  <Select
                    options={[
                      { label: 'YYYY-MM-DD (ISO Standard)', value: 'YYYY-MM-DD' },
                      { label: 'MM/DD/YYYY (US Standard)', value: 'MM/DD/YYYY' },
                      { label: 'DD/MM/YYYY (UK / International)', value: 'DD/MM/YYYY' },
                    ]}
                    value={formData.general.dateFormat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general: { ...formData.general, dateFormat: e.target.value },
                      })
                    }
                  />
                </FormField>

                <FormField label="Time Format">
                  <Select
                    options={[
                      { label: '12-Hour Clock (AM/PM)', value: '12h' },
                      { label: '24-Hour Military Format', value: '24h' },
                    ]}
                    value={formData.general.timeFormat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general: { ...formData.general, timeFormat: e.target.value as '12h' | '24h' },
                      })
                    }
                  />
                </FormField>

                <FormField label="Operating Base Currency">
                  <Select
                    options={[
                      { label: 'USD ($) - United States Dollar', value: 'USD' },
                      { label: 'CAD ($) - Canadian Dollar', value: 'CAD' },
                      { label: 'EUR (€) - Euro', value: 'EUR' },
                      { label: 'GBP (£) - British Pound', value: 'GBP' },
                    ]}
                    value={formData.general.currency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general: { ...formData.general, currency: e.target.value },
                      })
                    }
                  />
                </FormField>

                <FormField label="Default Records Per Page">
                  <Select
                    options={[
                      { label: '10 Records per view', value: 10 },
                      { label: '25 Records per view', value: 25 },
                      { label: '50 Records per view', value: 50 },
                    ]}
                    value={formData.general.recordsPerPageDefault}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general: {
                          ...formData.general,
                          recordsPerPageDefault: Number(e.target.value),
                        },
                      })
                    }
                  />
                </FormField>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk'] uppercase tracking-wider">
                Enterprise Security & Access Policies
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Session Idle Timeout (Minutes)"
                  helperText="Inactivity period before automatic session lock"
                >
                  <Select
                    options={[
                      { label: '15 Minutes (High Security)', value: 15 },
                      { label: '30 Minutes (Standard Enterprise)', value: 30 },
                      { label: '60 Minutes', value: 60 },
                      { label: '120 Minutes', value: 120 },
                    ]}
                    value={formData.security.sessionTimeoutMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        security: {
                          ...formData.security,
                          sessionTimeoutMinutes: Number(e.target.value),
                        },
                      })
                    }
                  />
                </FormField>

                <FormField
                  label="Max Failed Login Attempts"
                  helperText="Threshold before temporary account security hold"
                >
                  <Select
                    options={[
                      { label: '3 Failed Attempts', value: 3 },
                      { label: '5 Failed Attempts (Recommended)', value: 5 },
                      { label: '10 Failed Attempts', value: 10 },
                    ]}
                    value={formData.security.maxFailedLoginAttempts}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        security: {
                          ...formData.security,
                          maxFailedLoginAttempts: Number(e.target.value),
                        },
                      })
                    }
                  />
                </FormField>

                <FormField label="Minimum Password Length">
                  <Select
                    options={[
                      { label: '8 Characters', value: 8 },
                      { label: '10 Characters', value: 10 },
                      { label: '12 Characters (High Security)', value: 12 },
                    ]}
                    value={formData.security.passwordMinLength}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        security: {
                          ...formData.security,
                          passwordMinLength: Number(e.target.value),
                        },
                      })
                    }
                  />
                </FormField>

                <FormField label="Password Expiration Interval (Days)">
                  <Select
                    options={[
                      { label: 'Every 60 Days', value: 60 },
                      { label: 'Every 90 Days (Recommended)', value: 90 },
                      { label: 'Every 180 Days', value: 180 },
                      { label: 'Never Expire', value: 0 },
                    ]}
                    value={formData.security.passwordExpiryDays}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        security: {
                          ...formData.security,
                          passwordExpiryDays: Number(e.target.value),
                        },
                      })
                    }
                  />
                </FormField>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <Toggle
                  label="Enforce Complex Passwords"
                  description="Require combination of uppercase letters, lowercase letters, numbers, and special symbols"
                  checked={formData.security.requireComplexPassword}
                  onChange={(checked) =>
                    setFormData({
                      ...formData,
                      security: { ...formData.security, requireComplexPassword: checked },
                    })
                  }
                />

                <Toggle
                  label="Multi-Factor Authentication (MFA / 2FA)"
                  description="Mandate second-factor authentication for administrative and dispatch roles"
                  checked={formData.security.enableTwoFactorAuth}
                  onChange={(checked) =>
                    setFormData({
                      ...formData,
                      security: { ...formData.security, enableTwoFactorAuth: checked },
                    })
                  }
                />

                <Toggle
                  label="Mandatory Password Update on First Login"
                  description="Enforce immediate credential reset for newly provisioned personnel accounts"
                  checked={formData.security.forcePasswordChangeOnFirstLogin}
                  onChange={(checked) =>
                    setFormData({
                      ...formData,
                      security: {
                        ...formData.security,
                        forcePasswordChangeOnFirstLogin: checked,
                      },
                    })
                  }
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk'] uppercase tracking-wider">
                System Broadcast & Security Alert Triggers
              </h3>

              <div className="space-y-2">
                <Toggle
                  label="Security Incident & Suspicious Activity Alerts"
                  description="Dispatch immediate high-priority alerts on failed logins or suspended access attempts"
                  checked={formData.notifications.emailOnSecurityAlert}
                  onChange={(checked) =>
                    setFormData({
                      ...formData,
                      notifications: {
                        ...formData.notifications,
                        emailOnSecurityAlert: checked,
                      },
                    })
                  }
                />

                <Toggle
                  label="Audit Forensic Notifications"
                  description="Notify security administrators when role permissions or company credentials change"
                  checked={formData.notifications.emailOnRolePermissionChange}
                  onChange={(checked) =>
                    setFormData({
                      ...formData,
                      notifications: {
                        ...formData.notifications,
                        emailOnRolePermissionChange: checked,
                      },
                    })
                  }
                />

                <Toggle
                  label="Account Enrollment & Status Updates"
                  description="Transmit welcome credentials and status change notifications to user registered emails"
                  checked={formData.notifications.emailOnUserStatusChange}
                  onChange={(checked) =>
                    setFormData({
                      ...formData,
                      notifications: {
                        ...formData.notifications,
                        emailOnUserStatusChange: checked,
                      },
                    })
                  }
                />

                <Toggle
                  label="SMS Critical Guard Dispatch Escalation"
                  description="Transmit SMS text notifications for emergency dispatch and patrol site incidents"
                  checked={formData.notifications.smsOnCriticalIncidents}
                  onChange={(checked) =>
                    setFormData({
                      ...formData,
                      notifications: {
                        ...formData.notifications,
                        smsOnCriticalIncidents: checked,
                      },
                    })
                  }
                />
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-6">
              <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-600 text-white rounded-xl">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-rose-950 font-['Space_Grotesk']">
                      Mountain Security Services — Danger Zone: Business Data Reset
                    </h3>
                    <p className="text-xs text-rose-800">
                      Multi-step safety protocol for full or selective enterprise data reset.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-rose-900 leading-relaxed">
                  Resetting data will purge operational entries, transaction vouchers, client records, guard rosters,
                  and logs while strictly preserving the <strong>MSS Logo</strong>, <strong>MSS Branding</strong>,
                  <strong>Super Admin Master Account</strong>, and <strong>Enterprise Security Roles</strong>.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setDangerResetOpen(true)}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Initiate Multi-Step Data Reset</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Multi-Step Danger Zone Reset Modal */}
      <DangerZoneResetModal
        isOpen={dangerResetOpen}
        onClose={() => setDangerResetOpen(false)}
      />
    </div>
  );
};
