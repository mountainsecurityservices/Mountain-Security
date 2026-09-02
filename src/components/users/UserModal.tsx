import React, { useState, useEffect } from 'react';
import { User, UserPlus, Shield, Mail, Phone, Briefcase, Building, Key } from 'lucide-react';
import { Modal } from '../common/Modal';
import { FormField, Input, Select, PasswordInput } from '../common/FormComponents';
import { User as UserType, UserStatus } from '../../types';
import { useERP } from '../../context/ERPContext';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: UserType | null;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
}) => {
  const { roles, createUser, updateUser, addToast } = useERP();

  const isEditing = Boolean(userToEdit);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('Operations');
  const [employeeRef, setEmployeeRef] = useState('');
  const [primaryRoleId, setPrimaryRoleId] = useState('');
  const [additionalRoleIds, setAdditionalRoleIds] = useState<string[]>([]);
  const [status, setStatus] = useState<UserStatus>('active');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Populate form on edit
  useEffect(() => {
    if (userToEdit) {
      setFullName(userToEdit.fullName);
      setUsername(userToEdit.username);
      setEmail(userToEdit.email);
      setPhone(userToEdit.phone);
      setDesignation(userToEdit.designation || '');
      setDepartment(userToEdit.department || 'Operations');
      setEmployeeRef(userToEdit.employeeRef || '');
      setPrimaryRoleId(userToEdit.primaryRoleId);
      setAdditionalRoleIds(userToEdit.additionalRoleIds || []);
      setStatus(userToEdit.status);
      setPassword('');
      setError('');
    } else {
      setFullName('');
      setUsername('');
      setEmail('');
      setPhone('');
      setDesignation('Security Officer');
      setDepartment('Operations');
      setEmployeeRef(`MSS-EMP-${Math.floor(100 + Math.random() * 900)}`);
      setPrimaryRoleId(roles[0]?.id || '');
      setAdditionalRoleIds([]);
      setStatus('active');
      setPassword('mss_pass_' + Math.floor(1000 + Math.random() * 9000));
      setError('');
    }
  }, [userToEdit, roles, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !email.trim() || !primaryRoleId) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (!isEditing && (!password || password.length < 6)) {
      setError('Initial password must be at least 6 characters.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      if (isEditing && userToEdit) {
        const res = await updateUser(userToEdit.id, {
          fullName: fullName.trim(),
          username: username.trim(),
          email: email.trim(),
          phone: phone.trim(),
          designation: designation.trim(),
          department,
          employeeRef: employeeRef.trim(),
          primaryRoleId,
          additionalRoleIds,
          status,
        });

        setIsSubmitting(false);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Failed to update user.');
        }
      } else {
        const res = await createUser({
          fullName: fullName.trim(),
          username: username.trim(),
          email: email.trim(),
          phone: phone.trim(),
          designation: designation.trim(),
          department,
          employeeRef: employeeRef.trim(),
          primaryRoleId,
          additionalRoleIds,
          status,
        });

        setIsSubmitting(false);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Failed to create user.');
        }
      }
    } catch {
      setIsSubmitting(false);
      setError('An unexpected error occurred.');
    }
  };

  const roleOptions = roles.map((r) => ({
    label: `${r.name} (${r.code})`,
    value: r.id,
    disabled: r.status === 'inactive',
  }));

  const departmentOptions = [
    { label: 'Operations & Site Patrol', value: 'Operations' },
    { label: 'Executive & Strategic Command', value: 'Executive' },
    { label: 'Security Intelligence & Dispatch', value: 'Security' },
    { label: 'Human Resources & Training', value: 'Human Resources' },
    { label: 'Finance & Accounts', value: 'Finance' },
    { label: 'Compliance & Legal Inspection', value: 'Compliance' },
    { label: 'Information Systems & Tech', value: 'IT' },
  ];

  const statusOptions = [
    { label: 'Active (Full Access)', value: 'active' },
    { label: 'Inactive (Deactivated)', value: 'inactive' },
    { label: 'Suspended (Security Hold)', value: 'suspended' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Personnel Account' : 'Enroll New System User'}
      subtitle="Mountain Security Services Personnel Identity & Access Provisioning"
      icon={isEditing ? <User className="w-5 h-5 text-red-500" /> : <UserPlus className="w-5 h-5 text-red-500" />}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Section 1: Basic Identity */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
            1. Personnel Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField label="Full Name" required>
              <Input
                placeholder="e.g. John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Employee Badge / Ref" required>
              <Input
                placeholder="MSS-EMP-XXX"
                value={employeeRef}
                onChange={(e) => setEmployeeRef(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Corporate Email" required>
              <Input
                type="email"
                placeholder="user@mountainsecurity.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />
            </FormField>

            <FormField label="Phone Number" required>
              <Input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
                required
              />
            </FormField>

            <FormField label="Designation / Title" required>
              <Input
                placeholder="e.g. Field Supervisor"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                leftIcon={<Briefcase className="w-4 h-4" />}
                required
              />
            </FormField>

            <FormField label="Department" required>
              <Select
                options={departmentOptions}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </FormField>
          </div>
        </div>

        {/* Section 2: Credentials & Clearance */}
        <div className="pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
            2. Credentials & Security Clearance
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField label="System Username" required helperText="Unique account login identifier">
              <Input
                placeholder="e.g. john.doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormField>

            {!isEditing ? (
              <FormField label="Initial Password" required helperText="Temporary password for first login">
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormField>
            ) : (
              <FormField label="Account Status" required>
                <Select
                  options={statusOptions}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as UserStatus)}
                />
              </FormField>
            )}

            <FormField label="Primary Security Role" required helperText="Determines primary ERP clearance level">
              <Select
                options={roleOptions}
                value={primaryRoleId}
                onChange={(e) => setPrimaryRoleId(e.target.value)}
              />
            </FormField>

            {!isEditing && (
              <FormField label="Account Status" required>
                <Select
                  options={statusOptions}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as UserStatus)}
                />
              </FormField>
            )}
          </div>
        </div>

        {/* Section 3: Additional Secondary Roles */}
        <div className="pt-2 border-t border-slate-100">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
            Additional Auxiliary Roles (Optional)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 max-h-36 overflow-y-auto">
            {roles
              .filter((r) => r.id !== primaryRoleId && r.status === 'active')
              .map((r) => {
                const isChecked = additionalRoleIds.includes(r.id);
                return (
                  <label
                    key={r.id}
                    className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAdditionalRoleIds((prev) => [...prev, r.id]);
                        } else {
                          setAdditionalRoleIds((prev) => prev.filter((id) => id !== r.id));
                        }
                      }}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <span className="truncate">{r.name}</span>
                  </label>
                );
              })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isSubmitting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isEditing ? 'Save User Changes' : 'Provision User Account'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
