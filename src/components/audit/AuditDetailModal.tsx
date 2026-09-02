import React from 'react';
import { FileText, Clock, User, Shield, Globe, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { AuditLog } from '../../types';

interface AuditDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLog | null;
}

export const AuditDetailModal: React.FC<AuditDetailModalProps> = ({
  isOpen,
  onClose,
  log,
}) => {
  if (!log) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Forensic Audit Entry Dossier"
      subtitle={`Immutable Forensic Event Log [ID: ${log.id}]`}
      icon={<FileText className="w-5 h-5 text-red-500" />}
      maxWidth="xl"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
        >
          Close Forensic Inspector
        </button>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Header Summary */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-slate-500 text-[11px]">Timestamp: {log.timestamp}</span>
            <StatusBadge status={log.status} size="sm" />
          </div>
          <p className="text-sm font-bold text-slate-900 font-['Space_Grotesk'] leading-snug">
            {log.details}
          </p>
        </div>

        {/* Actor & Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Action Actor
            </span>
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <User className="w-4 h-4 text-slate-500" />
              <span>{log.userName}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-mono">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>Role: {log.userRole}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-mono">
              <span>Actor ID: {log.userId}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Target Resource & Scope
            </span>
            <div className="text-slate-900 font-bold">{log.resource}</div>
            <div className="text-slate-500 text-[11px] font-mono">Module: {log.module}</div>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-mono">
              <Globe className="w-3 h-3 text-slate-400" />
              <span>IP: {log.ipAddress}</span>
            </div>
          </div>
        </div>

        {/* Action Type & Record Ref */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Action Code
            </span>
            <span className="font-mono font-bold text-slate-900 uppercase">
              {log.action}
            </span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Record Title / Identifier
            </span>
            <span className="font-mono text-slate-800 font-semibold truncate block">
              {log.recordTitle || log.recordId || 'N/A'}
            </span>
          </div>
        </div>

        {/* JSON / Data State Diff (if present) */}
        {(log.oldValue || log.newValue) && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
              State Diff & Parameters
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {log.oldValue && (
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">
                    Previous Value:
                  </span>
                  <pre className="p-2.5 bg-slate-950 text-slate-200 rounded-lg text-[10px] font-mono overflow-x-auto max-h-36">
                    {JSON.stringify(log.oldValue, null, 2)}
                  </pre>
                </div>
              )}
              {log.newValue && (
                <div>
                  <span className="text-[10px] text-emerald-700 font-bold block mb-1">
                    Updated Value:
                  </span>
                  <pre className="p-2.5 bg-slate-950 text-emerald-300 rounded-lg text-[10px] font-mono overflow-x-auto max-h-36">
                    {JSON.stringify(log.newValue, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
