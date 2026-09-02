import React from 'react';
import { Eye, Edit2, Trash2, X } from 'lucide-react';
import { Modal } from './Modal';

export interface DetailField {
  label: string;
  value: React.ReactNode;
  isMono?: boolean;
  isBadge?: boolean;
  fullWidth?: boolean;
}

export interface RecordDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: 'emerald' | 'blue' | 'amber' | 'rose' | 'slate' | 'purple';
  };
  fields: DetailField[];
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  fields,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const getBadgeStyle = (variant = 'slate') => {
    switch (variant) {
      case 'emerald':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'amber':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'rose':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="lg"
      icon={<Eye className="w-5 h-5 text-slate-700" />}
      footer={
        <div className="flex items-center justify-between w-full">
          <div>
            {onDelete && canDelete && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete();
                }}
                className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            {onEdit && canEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Record</span>
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4 py-1 text-xs">
        {/* Header summary banner */}
        {(subtitle || badge) && (
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            {subtitle && <p className="text-slate-500 font-medium">{subtitle}</p>}
            {badge && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${getBadgeStyle(
                  badge.variant
                )}`}
              >
                {badge.text}
              </span>
            )}
          </div>
        )}

        {/* Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {fields.map((field, idx) => (
            <div
              key={idx}
              className={`p-3 bg-slate-50/70 border border-slate-200/70 rounded-xl ${
                field.fullWidth ? 'sm:col-span-2' : ''
              }`}
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {field.label}
              </span>
              <div
                className={`text-slate-900 font-medium break-words ${
                  field.isMono ? 'font-mono text-[11px]' : 'text-xs'
                }`}
              >
                {field.value ?? <span className="text-slate-400 italic">None</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
