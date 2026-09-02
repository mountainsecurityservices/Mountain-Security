import React, { useState, useMemo } from 'react';
import {
  Lock,
  ArrowLeft,
  Search,
  Shield,
  Layers,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { DataTable, ColumnDef, FilterOption } from '../common/DataTable';
import { Permission } from '../../types';
import { useERP } from '../../context/ERPContext';

export const PermissionsCatalogView: React.FC = () => {
  const { permissions, roles, setActiveTab } = useERP();

  const columns: ColumnDef<Permission>[] = useMemo(
    () => [
      {
        id: 'name',
        header: 'Permission Token & Name',
        accessorKey: 'name',
        sortable: true,
        cell: (row) => (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 font-bold text-xs shrink-0">
              <Lock className="w-3.5 h-3.5 text-slate-600" />
            </div>
            <div>
              <div className="font-bold text-slate-900 font-['Space_Grotesk'] text-xs">
                {row.name}
              </div>
              <div className="font-mono text-[10px] text-red-600 font-bold">{row.code}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'module',
        header: 'Module Scope',
        accessorKey: 'module',
        sortable: true,
        cell: (row) => (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold font-mono">
            {row.module}
          </span>
        ),
      },
      {
        id: 'action',
        header: 'Action Type',
        accessorKey: 'action',
        sortable: true,
        cell: (row) => (
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold uppercase tracking-wider">
            {row.action}
          </span>
        ),
      },
      {
        id: 'description',
        header: 'Security Authorization Scope',
        accessorKey: 'description',
        sortable: false,
        cell: (row) => (
          <p className="text-xs text-slate-600 max-w-md leading-relaxed">{row.description}</p>
        ),
      },
      {
        id: 'assignedRoles',
        header: 'Roles with Access',
        sortable: false,
        cell: (row) => {
          const matchingRoles = roles.filter(
            (r) => r.code === 'SUPER_ADMIN' || (r.permissionCodes || []).includes(row.code)
          );
          return (
            <div className="flex flex-wrap gap-1 max-w-xs">
              {matchingRoles.map((r) => (
                <span
                  key={r.id}
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    r.code === 'SUPER_ADMIN'
                      ? 'bg-slate-900 text-slate-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {r.name}
                </span>
              ))}
            </div>
          );
        },
      },
    ],
    [roles]
  );

  const filterOptions: FilterOption[] = useMemo(() => {
    const modules = Array.from(new Set(permissions.map((p) => p.module)));
    return [
      {
        key: 'module',
        label: 'Module',
        options: modules.map((m) => ({ label: m, value: m })),
      },
    ];
  }, [permissions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              type="button"
              onClick={() => setActiveTab('roles')}
              className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Roles
            </button>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Master Permissions & Authority Tokens Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete catalog of {permissions.length} granular action tokens regulating access across Mountain Security Services ERP.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('roles')}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Shield className="w-4 h-4 text-red-400" />
          <span>Manage Security Roles</span>
        </button>
      </div>

      {/* Permissions DataTable */}
      <DataTable<Permission>
        title="Active Permission Definitions"
        subtitle="Tokens are evaluated at runtime by the centralized access control enforcement engine"
        columns={columns}
        data={permissions}
        searchPlaceholder="Search permission tokens, actions, or descriptions..."
        searchFilterFields={['name', 'code', 'module', 'action', 'description']}
        filterOptions={filterOptions}
        exportFilename="mss-permissions-catalog"
      />
    </div>
  );
};
