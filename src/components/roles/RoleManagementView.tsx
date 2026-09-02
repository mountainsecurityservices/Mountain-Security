import React, { useState, useMemo } from 'react';
import {
  Shield,
  ShieldPlus,
  ShieldCheck,
  Lock,
  Edit,
  Sliders,
  CheckCircle2,
  XCircle,
  Users,
} from 'lucide-react';
import { DataTable, ColumnDef } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { RoleModal } from './RoleModal';
import { RolePermissionsMatrixModal } from './RolePermissionsMatrixModal';
import { Role, RoleStatus } from '../../types';
import { useERP } from '../../context/ERPContext';

export const RoleManagementView: React.FC = () => {
  const {
    roles,
    users,
    permissions,
    hasPermission,
    isSuperAdmin,
    setRoleStatus,
    setActiveTab,
  } = useERP();

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [matrixModalOpen, setMatrixModalOpen] = useState(false);
  const [matrixRole, setMatrixRole] = useState<Role | null>(null);

  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [targetStatusRole, setTargetStatusRole] = useState<Role | null>(null);

  const canCreateRole = isSuperAdmin() || hasPermission('roles.create');
  const canEditRole = isSuperAdmin() || hasPermission('roles.edit');
  const canEditMatrix = isSuperAdmin() || hasPermission('roles.edit_permissions');
  const canChangeStatus = isSuperAdmin() || hasPermission('roles.status_change');

  // Computed counts
  const totalRoles = roles.length;
  const systemRoles = roles.filter((r) => r.isSystem).length;
  const customRoles = roles.filter((r) => !r.isSystem).length;

  const columns: ColumnDef<Role>[] = useMemo(
    () => [
      {
        id: 'name',
        header: 'Role Title & Identifier',
        accessorKey: 'name',
        sortable: true,
        cell: (row) => (
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-white font-bold text-xs shrink-0 ${
                row.isSystem ? 'bg-slate-950 text-red-400' : 'bg-purple-900 text-purple-200'
              }`}
            >
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 font-['Space_Grotesk'] text-xs">
                {row.name}
              </div>
              <div className="font-mono text-[10px] text-slate-400 font-bold">{row.code}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'description',
        header: 'Operational Scope & Responsibilities',
        accessorKey: 'description',
        sortable: false,
        cell: (row) => (
          <p className="text-xs text-slate-600 line-clamp-2 max-w-md leading-relaxed">
            {row.description}
          </p>
        ),
      },
      {
        id: 'isSystem',
        header: 'Role Category',
        accessorKey: 'isSystem',
        sortable: true,
        cell: (row) => (
          <StatusBadge
            status={row.isSystem ? 'system' : 'custom'}
            size="sm"
          />
        ),
      },
      {
        id: 'userCount',
        header: 'Assigned Personnel',
        sortable: true,
        cell: (row) => {
          const count = users.filter(
            (u) => u.primaryRoleId === row.id || (u.additionalRoleIds || []).includes(row.id)
          ).length;
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-mono font-bold">
              <Users className="w-3 h-3 text-slate-500" />
              {count} Users
            </span>
          );
        },
      },
      {
        id: 'permissionCount',
        header: 'Permissions Matrix',
        sortable: true,
        cell: (row) => {
          const isSuper = row.code === 'SUPER_ADMIN';
          const count = isSuper ? permissions.length : (row.permissionCodes || []).length;

          return (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-900">
                {count} / {permissions.length}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                ({Math.round((count / permissions.length) * 100)}%)
              </span>
            </div>
          );
        },
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        sortable: true,
        cell: (row) => <StatusBadge status={row.status} size="sm" />,
      },
    ],
    [users, permissions]
  );

  const getRowActions = (role: Role) => {
    return [
      {
        label: 'Manage Permissions Matrix',
        icon: <Sliders className="w-4 h-4" />,
        disabled: !canEditMatrix,
        disabledReason: 'You lack permission to configure permissions matrices.',
        onClick: () => {
          setMatrixRole(role);
          setMatrixModalOpen(true);
        },
      },
      {
        label: 'Edit Role Definition',
        icon: <Edit className="w-4 h-4" />,
        disabled: !canEditRole || (role.isSystem && !isSuperAdmin()),
        disabledReason: role.isSystem
          ? 'System protected roles can only be edited by Super Admin.'
          : 'You lack permission to edit roles.',
        onClick: () => {
          setEditingRole(role);
          setRoleModalOpen(true);
        },
      },
      {
        label: role.status === 'active' ? 'Deactivate Role' : 'Activate Role',
        icon: role.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />,
        disabled: !canChangeStatus || role.isSystem,
        disabledReason: role.isSystem
          ? 'System protected roles cannot be deactivated.'
          : 'You lack permission to toggle role status.',
        onClick: () => {
          setTargetStatusRole(role);
          setStatusConfirmOpen(true);
        },
      },
    ];
  };

  const handleConfirmToggleStatus = async () => {
    if (!targetStatusRole) return;
    const newStatus: RoleStatus = targetStatusRole.status === 'active' ? 'inactive' : 'active';
    await setRoleStatus(targetStatusRole.id, newStatus);
    setStatusConfirmOpen(false);
    setTargetStatusRole(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Definition CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Security Roles & Access Hierarchy
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure enterprise security profiles, define operational clearance scopes, and manage granular permission tokens.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('permissions')}
            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl shadow-2xs transition-colors inline-flex items-center gap-2"
          >
            <Lock className="w-4 h-4 text-amber-500" />
            <span>Permissions Catalog</span>
          </button>

          {canCreateRole && (
            <button
              type="button"
              onClick={() => {
                setEditingRole(null);
                setRoleModalOpen(true);
              }}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-2"
            >
              <ShieldPlus className="w-4 h-4 text-red-400" />
              <span>Define New Security Role</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Roles Defined
          </span>
          <span className="text-2xl font-black text-slate-900 font-['Space_Grotesk'] mt-1 block">
            {totalRoles}
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 bg-slate-900 text-white shadow-xs">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
            System Protected Roles
          </span>
          <span className="text-2xl font-black text-white font-['Space_Grotesk'] mt-1 block">
            {systemRoles}
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-purple-200 bg-purple-50/30 shadow-xs">
          <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
            Custom Enterprise Roles
          </span>
          <span className="text-2xl font-black text-purple-700 font-['Space_Grotesk'] mt-1 block">
            {customRoles}
          </span>
        </div>
      </div>

      {/* Roles Data Table */}
      <DataTable<Role>
        title="Security Clearance Roles Registry"
        subtitle={`Managing ${roles.length} role authorization profiles across all ERP modules`}
        columns={columns}
        data={roles}
        searchPlaceholder="Search roles by title, code, or description..."
        searchFilterFields={['name', 'code', 'description']}
        actions={getRowActions}
        exportFilename="mss-security-roles"
        onRowClick={(row) => {
          setMatrixRole(row);
          setMatrixModalOpen(true);
        }}
      />

      {/* Role Creation / Edit Modal */}
      <RoleModal
        isOpen={roleModalOpen}
        onClose={() => {
          setRoleModalOpen(false);
          setEditingRole(null);
        }}
        roleToEdit={editingRole}
      />

      {/* Permissions Matrix Inspector Modal */}
      <RolePermissionsMatrixModal
        isOpen={matrixModalOpen}
        onClose={() => {
          setMatrixModalOpen(false);
          setMatrixRole(null);
        }}
        role={matrixRole}
      />

      {/* Status Toggle Confirm Dialog */}
      <ConfirmDialog
        isOpen={statusConfirmOpen}
        onClose={() => {
          setStatusConfirmOpen(false);
          setTargetStatusRole(null);
        }}
        onConfirm={handleConfirmToggleStatus}
        title={
          targetStatusRole?.status === 'active'
            ? 'Deactivate Security Role'
            : 'Reactivate Security Role'
        }
        variant={targetStatusRole?.status === 'active' ? 'warning' : 'info'}
        confirmText={
          targetStatusRole?.status === 'active' ? 'Deactivate Role' : 'Reactivate Role'
        }
        message={
          targetStatusRole ? (
            <p>
              Are you sure you want to change the status of role <strong>{targetStatusRole.name}</strong> ({targetStatusRole.code}) to{' '}
              <strong className="uppercase">{targetStatusRole.status === 'active' ? 'inactive' : 'active'}</strong>?
            </p>
          ) : (
            ''
          )
        }
      />
    </div>
  );
};
