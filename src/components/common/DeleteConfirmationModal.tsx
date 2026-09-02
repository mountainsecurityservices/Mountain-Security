import React from 'react';
import { AlertTriangle, Trash2, ShieldAlert, Archive } from 'lucide-react';
import { Modal } from './Modal';

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  recordTitle: string;
  recordId?: string;
  moduleName?: string;
  isArchive?: boolean;
  warningMessage?: string;
  isLoading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  recordTitle,
  recordId,
  moduleName,
  isArchive = false,
  warningMessage,
  isLoading = false,
}) => {
  const modalTitle = title || (isArchive ? 'Archive Record' : 'Confirm Record Deletion');
  const actionText = isArchive ? 'Archive Record' : 'Delete Record';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      maxWidth="md"
      icon={
        isArchive ? (
          <Archive className="w-5 h-5 text-amber-500" />
        ) : (
          <ShieldAlert className="w-5 h-5 text-rose-500" />
        )
      }
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 text-white shadow-xs focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
              isArchive
                ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 shadow-amber-500/20'
                : 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 shadow-rose-500/20'
            }`}
          >
            {isLoading ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isArchive ? (
              <Archive className="w-3.5 h-3.5" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            <span>{actionText}</span>
          </button>
        </>
      }
    >
      <div className="space-y-4 py-1 text-xs text-slate-600">
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
          {moduleName && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Module: {moduleName}
            </span>
          )}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-slate-900 truncate">
              {recordTitle}
            </h4>
            {recordId && (
              <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-200 text-slate-700">
                {recordId}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {warningMessage ||
              (isArchive
                ? 'This record will be moved to archives and deactivated. Its historical data and audit trails will be preserved.'
                : 'Are you sure you want to delete this record? This action cannot be undone and will be logged in the permanent audit trail.')}
          </p>
        </div>
      </div>
    </Modal>
  );
};
