import React from 'react';
import {
  User,
  Shield,
  Mail,
  Phone,
  Briefcase,
  Building,
  Calendar,
  Clock,
  Key,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { User as UserType } from '../../types';
import { useERP } from '../../context/ERPContext';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onEdit?: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  onClose,
  user,
  onEdit,
}) => {
  const { roles, permissions, getUserPermissions, hasPermission } = useERP();

  if (!user) return null;

  const primaryRole = roles.find((r) => r.id === user.primaryRoleId);
  const additionalRoles = roles.filter((r) => (user.additionalRoleIds || []).includes(r.id));
  const userPermCodes = getUserPermissions(user);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Personnel Profile Dossier"
      subtitle="Mountain Security Services Personnel Records & Access Clearances"
      icon={<User className="w-5 h-5 text-red-500" />}
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-[11px] text-slate-400 font-mono">
            System ID: {user.id}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            {onEdit && hasPermission('users.edit') && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Edit Personnel Record
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Header Profile Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-xl bg-slate-900 text-white font-bold text-lg flex items-center justify-center font-['Space_Grotesk'] shadow-sm">
              {user.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk']">
                  {user.fullName}
                </h3>
                <StatusBadge status={user.status} size="sm" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {user.designation || 'Staff'} • {user.department || 'Operations'}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                <span>Badge: {user.employeeRef || 'MSS-000'}</span>
                <span>Username: @{user.username}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Primary Role
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg mt-1 font-mono">
              <Shield className="w-3.5 h-3.5 text-red-400" />
              {primaryRole?.name || 'Unassigned'}
            </span>
          </div>
        </div>

        {/* Contact & Organizational Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Contact Channels
            </span>
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="font-mono">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="font-mono">{user.phone}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              System Timestamps
            </span>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Last Active:
              </span>
              <strong className="font-mono text-slate-800">{user.lastLogin || 'Never'}</strong>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Enrolled:
              </span>
              <strong className="font-mono text-slate-800">{user.createdAt}</strong>
            </div>
          </div>
        </div>

        {/* Assigned Roles List */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Security Clearances & Roles
          </h4>
          <div className="flex flex-wrap gap-2">
            {primaryRole && (
              <span className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Primary: {primaryRole.name} ({primaryRole.code})
              </span>
            )}
            {additionalRoles.map((r) => (
              <span
                key={r.id}
                className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-medium inline-flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                Auxiliary: {r.name}
              </span>
            ))}
          </div>
        </div>

        {/* Permissions Breakdown Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Effective Permission Matrix ({userPermCodes.length} Authorized Capabilities)
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">
              {primaryRole?.code === 'SUPER_ADMIN' ? 'UNRESTRICTED ACCESS' : 'ROLE-ENFORCED'}
            </span>
          </div>

          <div className="max-h-48 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2">
            {permissions
              .filter((p) => userPermCodes.includes(p.code))
              .map((p) => (
                <div
                  key={p.code}
                  className="flex items-start gap-2 p-1.5 bg-white rounded border border-slate-200 text-xs"
                >
                  <Lock className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-800 block truncate">{p.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">{p.code}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
