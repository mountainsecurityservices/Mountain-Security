import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserX,
  UserCheck,
  KeyRound,
  Edit,
  Eye,
  Lock,
  Mail,
  Phone,
  Building,
} from 'lucide-react';
import { DataTable, ColumnDef, FilterOption } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Modal } from '../common/Modal';
import { FormField, PasswordInput } from '../common/FormComponents';
import { UserModal } from './UserModal';
import { UserDetailModal } from './UserDetailModal';
import { User, UserStatus } from '../../types';
import { useERP } from '../../context/ERPContext';

export const UserManagementView: React.FC = () => {
  const {
    users,
    roles,
    hasPermission,
    isSuperAdmin,
    setUserStatus,
    adminResetPassword,
    addToast,
  } = useERP();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Status Change Dialog State
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [targetStatusUser, setTargetStatusUser] = useState<User | null>(null);
  const [newStatusToApply, setNewStatusToApply] = useState<UserStatus>('active');

  // Password Reset Modal State
  const [pwResetModalOpen, setPwResetModalOpen] = useState(false);
  const [pwResetTargetUser, setPwResetTargetUser] = useState<User | null>(null);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [isResettingPw, setIsResettingPw] = useState(false);

  // Computed Counts
  const totalCount = users.length;
  const activeCount = users.filter((u) => u.status === 'active').length;
  const inactiveCount = users.filter((u) => u.status === 'inactive').length;
  const suspendedCount = users.filter((u) => u.status === 'suspended').length;

  const canCreateUser = isSuperAdmin() || hasPermission('users.create');
  const canEditUser = isSuperAdmin() || hasPermission('users.edit');
  const canChangeStatus = isSuperAdmin() || hasPermission('users.status_change');
  const canResetPassword = isSuperAdmin() || hasPermission('users.password_reset');

  // Table Columns Definition
  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        id: 'fullName',
        header: 'Personnel / Name',
        accessorKey: 'fullName',
        sortable: true,
        cell: (row) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-xs shrink-0 font-['Space_Grotesk']">
              {row.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 truncate font-['Space_Grotesk']">
                {row.fullName}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {row.employeeRef || row.username}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'username',
        header: 'Username',
        accessorKey: 'username',
        sortable: true,
        cell: (row) => <span className="font-mono text-xs text-slate-600">@{row.username}</span>,
      },
      {
        id: 'email',
        header: 'Contact Email & Phone',
        accessorKey: 'email',
        sortable: true,
        cell: (row) => (
          <div className="space-y-0.5">
            <div className="text-xs text-slate-700 font-mono truncate">{row.email}</div>
            <div className="text-[11px] text-slate-400 font-mono">{row.phone}</div>
          </div>
        ),
      },
      {
        id: 'department',
        header: 'Dept & Designation',
        accessorKey: 'department',
        sortable: true,
        cell: (row) => (
          <div>
            <div className="font-medium text-slate-800 text-xs">{row.designation || 'Staff'}</div>
            <div className="text-[11px] text-slate-500">{row.department || 'Operations'}</div>
          </div>
        ),
      },
      {
        id: 'primaryRoleId',
        header: 'Primary Security Role',
        sortable: true,
        cell: (row) => {
          const role = roles.find((r) => r.id === row.primaryRoleId);
          const isSuper = role?.code === 'SUPER_ADMIN';
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono ${
                isSuper
                  ? 'bg-slate-950 text-red-400 border border-slate-800'
                  : 'bg-slate-100 text-slate-800 border border-slate-200'
              }`}
            >
              <Shield className="w-3 h-3" />
              {role?.name || 'Unassigned'}
            </span>
          );
        },
      },
      {
        id: 'status',
        header: 'Account Status',
        accessorKey: 'status',
        sortable: true,
        cell: (row) => <StatusBadge status={row.status} size="sm" />,
      },
      {
        id: 'lastLogin',
        header: 'Last Active Session',
        accessorKey: 'lastLogin',
        sortable: true,
        cell: (row) => (
          <span className="font-mono text-[11px] text-slate-500">
            {row.lastLogin || 'Never logged in'}
          </span>
        ),
      },
    ],
    [roles]
  );

  // Dropdown Filter Options
  const filterOptions: FilterOption[] = useMemo(
    () => [
      {
        key: 'status',
        label: 'Status',
        options: [
          { label: 'Active Personnel', value: 'active' },
          { label: 'Inactive Accounts', value: 'inactive' },
          { label: 'Suspended Accounts', value: 'suspended' },
        ],
      },
      {
        key: 'department',
        label: 'Department',
        options: [
          { label: 'Operations', value: 'Operations' },
          { label: 'Executive', value: 'Executive' },
          { label: 'Security', value: 'Security' },
          { label: 'Human Resources', value: 'Human Resources' },
          { label: 'Finance', value: 'Finance' },
          { label: 'Compliance', value: 'Compliance' },
          { label: 'IT', value: 'IT' },
        ],
      },
    ],
    []
  );

  // Row Action Items
  const getRowActions = (user: User) => {
    return [
      {
        label: 'View Dossier Profile',
        icon: <Eye className="w-4 h-4" />,
        onClick: () => {
          setSelectedUser(user);
          setDetailModalOpen(true);
        },
      },
      {
        label: 'Edit Personnel Details',
        icon: <Edit className="w-4 h-4" />,
        disabled: !canEditUser,
        disabledReason: 'You do not have permission to edit user records.',
        onClick: () => {
          setEditingUser(user);
          setUserModalOpen(true);
        },
      },
      {
        label: 'Reset Security Password',
        icon: <KeyRound className="w-4 h-4" />,
        disabled: !canResetPassword,
        disabledReason: 'You do not have permission to reset user passwords.',
        onClick: () => {
          setPwResetTargetUser(user);
          setNewAdminPassword('mss_temp_' + Math.floor(1000 + Math.random() * 9000));
          setPwResetModalOpen(true);
        },
      },
      {
        label: user.status === 'active' ? 'Deactivate Account' : 'Activate Account',
        icon: user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />,
        disabled: !canChangeStatus,
        disabledReason: 'You do not have permission to modify account status.',
        onClick: () => {
          setTargetStatusUser(user);
          setNewStatusToApply(user.status === 'active' ? 'inactive' : 'active');
          setStatusDialogOpen(true);
        },
      },
      {
        label: 'Suspend Account (Security Alert)',
        icon: <ShieldAlert className="w-4 h-4 text-red-500" />,
        danger: true,
        hidden: user.status === 'suspended',
        disabled: !canChangeStatus,
        disabledReason: 'You do not have permission to suspend accounts.',
        onClick: () => {
          setTargetStatusUser(user);
          setNewStatusToApply('suspended');
          setStatusDialogOpen(true);
        },
      },
    ];
  };

  // Status Change Confirm Handler
  const handleConfirmStatusChange = async () => {
    if (!targetStatusUser) return;
    await setUserStatus(
      targetStatusUser.id,
      newStatusToApply,
      `Administrative status update triggered via User Management interface.`
    );
    setStatusDialogOpen(false);
    setTargetStatusUser(null);
  };

  // Admin Password Reset Confirm Handler
  const handleAdminResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwResetTargetUser || !newAdminPassword.trim()) return;

    setIsResettingPw(true);
    await adminResetPassword(pwResetTargetUser.id, newAdminPassword);
    setIsResettingPw(false);
    setPwResetModalOpen(false);
    setPwResetTargetUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Enrollment CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Personnel & User Access Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Provision accounts, assign operational roles, enforce credentials, and manage security statuses.
          </p>
        </div>

        {canCreateUser && (
          <button
            type="button"
            onClick={() => {
              setEditingUser(null);
              setUserModalOpen(true);
            }}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4 text-red-400" />
            <span>Enroll New Personnel</span>
          </button>
        )}
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Enrolled
          </span>
          <span className="text-2xl font-black text-slate-900 font-['Space_Grotesk'] mt-1 block">
            {totalCount}
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            Active Accounts
          </span>
          <span className="text-2xl font-black text-emerald-700 font-['Space_Grotesk'] mt-1 block">
            {activeCount}
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 bg-slate-50/50 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Inactive
          </span>
          <span className="text-2xl font-black text-slate-600 font-['Space_Grotesk'] mt-1 block">
            {inactiveCount}
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-red-200 bg-red-50/20 shadow-xs">
          <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">
            Suspended
          </span>
          <span className="text-2xl font-black text-red-600 font-['Space_Grotesk'] mt-1 block">
            {suspendedCount}
          </span>
        </div>
      </div>

      {/* Main Data Table */}
      <DataTable<User>
        title="Authorized Personnel Roster"
        subtitle={`Managing ${users.length} registered Mountain Security Services accounts`}
        columns={columns}
        data={users}
        searchPlaceholder="Search personnel by name, username, badge, email, title..."
        searchFilterFields={['fullName', 'username', 'email', 'phone', 'designation', 'employeeRef', 'department']}
        filterOptions={filterOptions}
        actions={getRowActions}
        exportFilename="mss-personnel-roster"
        onRowClick={(row) => {
          setSelectedUser(row);
          setDetailModalOpen(true);
        }}
      />

      {/* User Enrollment & Edit Modal */}
      <UserModal
        isOpen={userModalOpen}
        onClose={() => {
          setUserModalOpen(false);
          setEditingUser(null);
        }}
        userToEdit={editingUser}
      />

      {/* User Dossier Inspector Modal */}
      <UserDetailModal
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onEdit={() => {
          setEditingUser(selectedUser);
          setUserModalOpen(true);
        }}
      />

      {/* Status Change Confirmation Dialog */}
      <ConfirmDialog
        isOpen={statusDialogOpen}
        onClose={() => {
          setStatusDialogOpen(false);
          setTargetStatusUser(null);
        }}
        onConfirm={handleConfirmStatusChange}
        title={
          newStatusToApply === 'suspended'
            ? 'Confirm Account Suspension'
            : newStatusToApply === 'inactive'
            ? 'Deactivate User Account'
            : 'Reactivate User Account'
        }
        variant={newStatusToApply === 'suspended' ? 'danger' : 'warning'}
        confirmText={
          newStatusToApply === 'suspended'
            ? 'Suspend Account'
            : newStatusToApply === 'inactive'
            ? 'Deactivate'
            : 'Activate Account'
        }
        message={
          targetStatusUser ? (
            <div>
              <p>
                Are you sure you want to change the status of <strong>{targetStatusUser.fullName}</strong> (@{targetStatusUser.username}) to{' '}
                <strong className="uppercase">{newStatusToApply}</strong>?
              </p>
              {newStatusToApply === 'suspended' && (
                <p className="mt-2 text-red-600 text-xs font-semibold">
                  Warning: Suspended accounts are immediately blocked from authentication across all Mountain Security Services systems and a high-priority security audit record will be logged.
                </p>
              )}
            </div>
          ) : (
            ''
          )
        }
      />

      {/* Admin Reset Password Modal */}
      <Modal
        isOpen={pwResetModalOpen}
        onClose={() => {
          setPwResetModalOpen(false);
          setPwResetTargetUser(null);
        }}
        title="Admin Credential Reset"
        subtitle={`Temporary Password Generation for ${pwResetTargetUser?.fullName}`}
        icon={<KeyRound className="w-5 h-5 text-red-500" />}
        maxWidth="md"
      >
        <form onSubmit={handleAdminResetPassword} className="space-y-4">
          <p className="text-xs text-slate-600">
            Set a temporary security password for <strong>{pwResetTargetUser?.fullName}</strong>. The user will be required to update their password upon next authentication.
          </p>

          <FormField label="Temporary Password" required helperText="Generated temporary security token">
            <PasswordInput
              value={newAdminPassword}
              onChange={(e) => setNewAdminPassword(e.target.value)}
              required
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => {
                setPwResetModalOpen(false);
                setPwResetTargetUser(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isResettingPw}
              className="px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
            >
              {isResettingPw && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Apply Password Reset
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
