import React, { useState } from 'react';
import { User, Shield, Key, Mail, Phone, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { FormField, Input, PasswordInput } from '../common/FormComponents';
import { StatusBadge } from '../common/StatusBadge';
import { useERP } from '../../context/ERPContext';

interface MyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyAccountModal: React.FC<MyAccountModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, currentRole, updateUser, addToast } = useERP();

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!currentUser) return null;

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateUser(currentUser.id, { fullName, email, phone });
    setIsSaving(false);
    if (res.success) {
      addToast('Profile details updated successfully.', 'success', 'Profile Updated');
      onClose();
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      addToast('New password must be at least 8 characters long.', 'error', 'Validation Error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match.', 'error', 'Validation Error');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      addToast('Security credentials updated successfully.', 'success', 'Password Changed');
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="My MSS Account"
      subtitle="Personnel Profile & Security Credentials"
      icon={<User className="w-5 h-5 text-red-500" />}
      maxWidth="lg"
    >
      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-5">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === 'profile'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          General Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === 'security'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          Security & Password
        </button>
      </div>

      {activeTab === 'profile' ? (
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="flex items-center gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl mb-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-base shadow-sm font-['Space_Grotesk']">
              {currentUser.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 truncate font-['Space_Grotesk']">
                  {currentUser.fullName}
                </h4>
                <StatusBadge status={currentUser.status} size="sm" />
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {currentUser.designation || 'Security Personnel'} • {currentUser.department || 'Operations'}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                <span>Ref: {currentUser.employeeRef || 'MSS-EMP-001'}</span>
                <span>Role: {currentRole?.name || 'Authorized User'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full Name" required>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Username" helperText="System username cannot be changed">
              <Input value={currentUser.username} disabled className="bg-slate-100" />
            </FormField>

            <FormField label="Email Address" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />
            </FormField>

            <FormField label="Phone Number" required>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
                required
              />
            </FormField>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-3.5 h-3.5" /> Last Active Login:
              </span>
              <strong className="font-mono text-slate-800">{currentUser.lastLogin || 'Current Session'}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3.5 h-3.5" /> Account Enrolled:
              </span>
              <strong className="font-mono text-slate-800">{currentUser.createdAt}</strong>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
            >
              {isSaving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Save Profile Changes
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
            <Key className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Password Security Standards</strong>
              <p className="mt-0.5 text-amber-700">
                Passwords must contain at least 8 characters including letters, numbers, and special symbols.
              </p>
            </div>
          </div>

          <FormField label="Current Password" required>
            <PasswordInput
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </FormField>

          <FormField label="New Password" required>
            <PasswordInput
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Confirm New Password" required>
            <PasswordInput
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
            >
              {isSaving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Update Password
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
