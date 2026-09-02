import React, { useState, useEffect, useMemo } from 'react';
import { Shield, ShieldPlus, Lock, CheckSquare, Square, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { FormField, Input, Textarea, Select } from '../common/FormComponents';
import { Role, RoleStatus, Permission } from '../../types';
import { useERP } from '../../context/ERPContext';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleToEdit?: Role | null;
}

export const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  roleToEdit,
}) => {
  const { permissions, createRole, updateRole } = useERP();

  const isEditing = Boolean(roleToEdit);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<RoleStatus>('active');
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Group permissions by module
  const permissionsByModule = useMemo(() => {
    const map: Record<string, Permission[]> = {};
    permissions.forEach((p) => {
      if (!map[p.module]) {
        map[p.module] = [];
      }
      map[p.module].push(p);
    });
    return map;
  }, [permissions]);

  useEffect(() => {
    if (roleToEdit) {
      setName(roleToEdit.name);
      setCode(roleToEdit.code);
      setDescription(roleToEdit.description);
      setStatus(roleToEdit.status);
      setSelectedPerms(roleToEdit.permissionCodes || []);
      setError('');
    } else {
      setName('');
      setCode('');
      setDescription('');
      setStatus('active');
      setSelectedPerms([]);
      setError('');
    }
  }, [roleToEdit, isOpen]);

  const togglePermission = (permCode: string) => {
    setSelectedPerms((prev) =>
      prev.includes(permCode) ? prev.filter((c) => c !== permCode) : [...prev, permCode]
    );
  };

  const toggleModuleAll = (moduleName: string) => {
    const modPerms = permissionsByModule[moduleName] || [];
    const modCodes = modPerms.map((p) => p.code);
    const allSelected = modCodes.every((c) => selectedPerms.includes(c));

    if (allSelected) {
      setSelectedPerms((prev) => prev.filter((c) => !modCodes.includes(c)));
    } else {
      setSelectedPerms((prev) => Array.from(new Set([...prev, ...modCodes])));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !description.trim()) {
      setError('Please fill in role title, code, and description.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      if (isEditing && roleToEdit) {
        const res = await updateRole(roleToEdit.id, {
          name: name.trim(),
          description: description.trim(),
          status,
          permissionCodes: selectedPerms,
        });

        setIsSubmitting(false);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Failed to update role.');
        }
      } else {
        const res = await createRole({
          name: name.trim(),
          code: code.trim().toUpperCase(),
          description: description.trim(),
          status,
          permissionCodes: selectedPerms,
        });

        setIsSubmitting(false);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Failed to create role.');
        }
      }
    } catch {
      setIsSubmitting(false);
      setError('An error occurred while saving role.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Configure Security Role' : 'Define New Operational Role'}
      subtitle="Mountain Security Services Enterprise Access Control Matrix"
      icon={isEditing ? <Shield className="w-5 h-5 text-red-500" /> : <ShieldPlus className="w-5 h-5 text-red-500" />}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormField label="Role Title / Name" required>
            <Input
              placeholder="e.g. Armed Patrol Supervisor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormField>

          <FormField
            label="Role Code Identifier"
            required
            helperText={isEditing ? 'System role codes cannot be renamed' : 'e.g. PATROL_SUPERVISOR'}
          >
            <Input
              placeholder="ROLE_CODE"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
              disabled={isEditing}
              className={isEditing ? 'bg-slate-100 font-mono' : 'font-mono uppercase'}
              required
            />
          </FormField>
        </div>

        <FormField label="Role Description & Operational Scope" required>
          <Textarea
            rows={2}
            placeholder="Describe the operational responsibilities and system capabilities granted by this role..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </FormField>

        {/* Permissions Matrix Selector */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                Granted Permissions Matrix ({selectedPerms.length} Selected)
              </h4>
              <p className="text-[11px] text-slate-500">
                Toggle capabilities granted to personnel holding this security role
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedPerms(permissions.map((p) => p.code))}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
              >
                Select All
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => setSelectedPerms([])}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-700"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
            {(Object.entries(permissionsByModule) as [string, Permission[]][]).map(([moduleName, perms]) => {
              const modCodes = perms.map((p) => p.code);
              const allModSelected = modCodes.every((c) => selectedPerms.includes(c));
              const someModSelected =
                !allModSelected && modCodes.some((c) => selectedPerms.includes(c));

              return (
                <div
                  key={moduleName}
                  className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 font-['Space_Grotesk']">
                      {moduleName} Module ({perms.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleModuleAll(moduleName)}
                      className="text-[11px] font-medium text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
                    >
                      {allModSelected ? (
                        <>
                          <CheckSquare className="w-3.5 h-3.5 text-slate-900" />
                          <span>Deselect Module</span>
                        </>
                      ) : (
                        <>
                          <Square className="w-3.5 h-3.5 text-slate-400" />
                          <span>Select Module</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {perms.map((p) => {
                      const isChecked = selectedPerms.includes(p.code);
                      return (
                        <label
                          key={p.code}
                          className={`flex items-start gap-2 p-1.5 rounded-md border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-slate-900 text-white border-slate-800'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(p.code)}
                            className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-600"
                          />
                          <div className="min-w-0">
                            <span className="font-semibold block truncate leading-snug">
                              {p.name}
                            </span>
                            <span
                              className={`text-[10px] font-mono block truncate ${
                                isChecked ? 'text-slate-300' : 'text-slate-400'
                              }`}
                            >
                              {p.code}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
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
            {isEditing ? 'Save Role Changes' : 'Create Role'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
