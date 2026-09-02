import React from 'react';
import { Eye, Edit2, Trash2, MoreVertical, Archive } from 'lucide-react';

export interface RowActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  canView?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canArchive?: boolean;
  viewTooltip?: string;
  editTooltip?: string;
  deleteTooltip?: string;
  archiveTooltip?: string;
  disabledReason?: string;
  extraActions?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const RowActionButtons: React.FC<RowActionButtonsProps> = ({
  onView,
  onEdit,
  onDelete,
  onArchive,
  canView = true,
  canEdit = true,
  canDelete = true,
  canArchive = true,
  viewTooltip = 'View Details',
  editTooltip = 'Edit Record',
  deleteTooltip = 'Delete Record',
  archiveTooltip = 'Archive Record',
  disabledReason,
  extraActions,
  className = '',
  size = 'md',
}) => {
  const btnClass = size === 'sm' ? 'p-1 text-xs' : 'p-1.5 text-xs';
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div
      className={`inline-flex items-center justify-end gap-1 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {onView && canView && (
        <button
          type="button"
          onClick={onView}
          title={viewTooltip}
          aria-label={viewTooltip}
          className={`${btnClass} text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-hidden focus:ring-2 focus:ring-slate-300`}
        >
          <Eye className={iconSize} />
        </button>
      )}

      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          disabled={!canEdit}
          title={canEdit ? editTooltip : (disabledReason || 'You do not have permission to edit this record')}
          aria-label={editTooltip}
          className={`${btnClass} rounded-lg transition-colors focus:outline-hidden focus:ring-2 ${
            canEdit
              ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:ring-blue-300'
              : 'text-slate-300 cursor-not-allowed opacity-50'
          }`}
        >
          <Edit2 className={iconSize} />
        </button>
      )}

      {onArchive && (
        <button
          type="button"
          onClick={onArchive}
          disabled={!canArchive}
          title={canArchive ? archiveTooltip : (disabledReason || 'You do not have permission to archive this record')}
          aria-label={archiveTooltip}
          className={`${btnClass} rounded-lg transition-colors focus:outline-hidden focus:ring-2 ${
            canArchive
              ? 'text-amber-600 hover:text-amber-800 hover:bg-amber-50 focus:ring-amber-300'
              : 'text-slate-300 cursor-not-allowed opacity-50'
          }`}
        >
          <Archive className={iconSize} />
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          disabled={!canDelete}
          title={canDelete ? deleteTooltip : (disabledReason || 'You do not have permission to delete this record')}
          aria-label={deleteTooltip}
          className={`${btnClass} rounded-lg transition-colors focus:outline-hidden focus:ring-2 ${
            canDelete
              ? 'text-rose-600 hover:text-rose-800 hover:bg-rose-50 focus:ring-rose-300'
              : 'text-slate-300 cursor-not-allowed opacity-50'
          }`}
        >
          <Trash2 className={iconSize} />
        </button>
      )}

      {extraActions}
    </div>
  );
};
