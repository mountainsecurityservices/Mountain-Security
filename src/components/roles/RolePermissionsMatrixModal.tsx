import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Lock, Search, CheckSquare, Square, Save, X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Role, Permission } from '../../types';
import { useERP } from '../../context/ERPContext';

interface RolePermissionsMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
}

export const RolePermissionsMatrixModal: React.FC<RolePermissionsMatrixModalProps> = ({
  isOpen,
  onClose,
  role,
}) => {
  const { permissions, updateRolePermissions, isSuperAdmin } = useERP();

  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (role) {
      setSelectedPerms(role.permissionCodes || []);
      setSearchQuery('');
    }
  }, [role, isOpen]);

  const isRoleSuperAdmin = role?.code === 'SUPER_ADMIN';

  // Group permissions by module
  const permissionsByModule = useMemo(() => {
    const map: Record<string, Permission[]> = {};
    permissions.forEach((p) => {
      if (
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.module.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        if (!map[p.module]) {
          map[p.module] = [];
        }
        map[p.module].push(p);
      }
    });
    return map;
  }, [permissions, searchQuery]);

  const togglePermission = (code: string) => {
    if (isRoleSuperAdmin) return;
    setSelectedPerms((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const toggleModule = (moduleName: string) => {
    if (isRoleSuperAdmin) return;
    const modPerms = permissionsByModule[moduleName] || [];
    const modCodes = modPerms.map((p) => p.code);
    const allSelected = modCodes.every((c) => selectedPerms.includes(c));

    if (allSelected) {
      setSelectedPerms((prev) => prev.filter((c) => !modCodes.includes(c)));
    } else {
      setSelectedPerms((prev) => Array.from(new Set([...prev, ...modCodes])));
    }
  };

  const handleSave = async () => {
    if (!role) return;
    setIsSaving(true);
    await updateRolePermissions(role.id, selectedPerms);
    setIsSaving(false);
    onClose();
  };

  if (!role) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Permissions Matrix:</span>
          <span className="text-red-600">{role.name}</span>
        </div>
      }
      subtitle={`Granular ERP Capabilities & Authority Token Assignment (Code: ${role.code})`}
      icon={<Lock className="w-5 h-5 text-red-500" />}
      maxWidth="4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-slate-500">
            <strong className="text-slate-900 font-bold">{selectedPerms.length}</strong> of{' '}
            {permissions.length} total permissions enabled
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isRoleSuperAdmin}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all inline-flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Permissions Matrix
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {isRoleSuperAdmin && (
          <div className="p-3 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              <span>
                <strong>Super Admin Bypass:</strong> This system role has permanent unrestricted access to all current and future ERP modules.
              </span>
            </div>
          </div>
        )}

        {/* Search and Module Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search permission tokens or actions..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-hidden focus:border-slate-900"
            />
          </div>

          {!isRoleSuperAdmin && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedPerms(permissions.map((p) => p.code))}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => setSelectedPerms([])}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Deselect All
              </button>
            </div>
          )}
        </div>

        {/* Modules Grid */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {(Object.entries(permissionsByModule) as [string, Permission[]][]).map(([moduleName, perms]) => {
            const modCodes = perms.map((p) => p.code);
            const allSelected = modCodes.every((c) => selectedPerms.includes(c));

            return (
              <div
                key={moduleName}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 font-['Space_Grotesk'] uppercase tracking-wider">
                      {moduleName} Module
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {perms.filter((p) => selectedPerms.includes(p.code)).length} of {perms.length}{' '}
                      granted
                    </span>
                  </div>
                  {!isRoleSuperAdmin && (
                    <button
                      type="button"
                      onClick={() => toggleModule(moduleName)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100"
                    >
                      {allSelected ? (
                        <>
                          <CheckSquare className="w-3.5 h-3.5 text-slate-900" />
                          <span>Deselect Group</span>
                        </>
                      ) : (
                        <>
                          <Square className="w-3.5 h-3.5 text-slate-400" />
                          <span>Select Group</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {perms.map((p) => {
                    const isChecked = selectedPerms.includes(p.code);
                    return (
                      <div
                        key={p.code}
                        onClick={() => togglePermission(p.code)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                          isChecked
                            ? 'bg-slate-900 text-white border-slate-800 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          disabled={isRoleSuperAdmin}
                          className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-600"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold leading-snug truncate">{p.name}</div>
                          <div
                            className={`text-[10px] font-mono mt-0.5 truncate ${
                              isChecked ? 'text-slate-300' : 'text-slate-400'
                            }`}
                          >
                            {p.code}
                          </div>
                          <p
                            className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                              isChecked ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            {p.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
