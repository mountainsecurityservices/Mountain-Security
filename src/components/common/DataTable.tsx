import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  Download,
  Printer,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from 'lucide-react';
import { ActionMenu, ActionMenuItem } from './ActionMenu';
import { EmptyState } from './EmptyState';
import { TableSkeleton } from './LoadingSkeleton';

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  hidden?: boolean;
}

export interface FilterOption {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchFilterFields?: (keyof T | string)[];
  filterOptions?: FilterOption[];
  actions?: (row: T) => ActionMenuItem[];
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
  enableExport?: boolean;
  enablePrint?: boolean;
  exportFilename?: string;
  keyExtractor?: (row: T, index: number) => string;
  defaultSort?: { columnId: string; direction: 'asc' | 'desc' };
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  columns: initialColumns,
  data,
  searchPlaceholder = 'Search records...',
  searchFilterFields,
  filterOptions = [],
  actions,
  isLoading = false,
  title,
  subtitle,
  headerActions,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no records matching your current filter criteria.',
  onEmptyAction,
  emptyActionLabel,
  enableExport = true,
  enablePrint = true,
  exportFilename = 'mss-erp-export',
  keyExtractor,
  defaultSort,
  onRowClick,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortState, setSortState] = useState<{ columnId: string; direction: 'asc' | 'desc' } | null>(
    defaultSort || null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>(
    initialColumns.filter((c) => c.hidden).map((c) => c.id)
  );
  const [showColSettings, setShowColSettings] = useState(false);

  // Visible columns
  const visibleColumns = useMemo(() => {
    return initialColumns.filter((col) => !hiddenColumns.includes(col.id));
  }, [initialColumns, hiddenColumns]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (!value || value === 'ALL') {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Apply Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = (searchFilterFields && searchFilterFields.length > 0
          ? searchFilterFields
          : Object.keys(row)
        ).some((field) => {
          const val = row[field as string];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(query);
        });

        if (!matchesSearch) return false;
      }

      // Apply Dropdown Filters
      for (const [key, filterVal] of Object.entries(activeFilters)) {
        if (!filterVal || filterVal === 'ALL') continue;
        const rowVal = row[key];
        if (String(rowVal).toLowerCase() !== String(filterVal).toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [data, searchQuery, searchFilterFields, activeFilters]);

  // Sort Logic
  const sortedData = useMemo(() => {
    if (!sortState) return filteredData;
    const { columnId, direction } = sortState;
    const col = initialColumns.find((c) => c.id === columnId);
    if (!col) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = col.accessorKey ? a[col.accessorKey] : a[columnId];
      const bVal = col.accessorKey ? b[col.accessorKey] : b[columnId];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return direction === 'asc' ? (aVal < bVal ? -1 : 1) : (aVal > bVal ? -1 : 1);
    });
  }, [filteredData, sortState, initialColumns]);

  // Pagination Logic
  const totalRecords = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Handle Sort Header Click
  const handleSort = (columnId: string, sortable?: boolean) => {
    if (!sortable) return;
    setSortState((prev) => {
      if (!prev || prev.columnId !== columnId) {
        return { columnId, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { columnId, direction: 'desc' };
      }
      return null;
    });
  };

  // Export to CSV
  const handleExportCSV = () => {
    const exportCols = visibleColumns.filter((c) => c.accessorKey || c.id);
    const headers = exportCols.map((c) => `"${c.header.replace(/"/g, '""')}"`).join(',');
    
    const rows = sortedData.map((row) =>
      exportCols
        .map((c) => {
          const val = c.accessorKey ? row[c.accessorKey] : row[c.id];
          const cleanVal = val === null || val === undefined ? '' : String(val).replace(/"/g, '""');
          return `"${cleanVal}"`;
        })
        .join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${exportFilename}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Table
  const handlePrint = () => {
    window.print();
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0 || Boolean(searchQuery);

  if (isLoading) {
    return <TableSkeleton rows={pageSize} cols={visibleColumns.length + (actions ? 1 : 0)} />;
  }

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
      {/* Top Header / Title Bar */}
      {(title || subtitle || headerActions) && (
        <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 bg-slate-50/50">
          <div>
            {title && (
              <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk'] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      )}

      {/* Controls Bar: Search, Filters, Export, Visibility */}
      <div className="p-4 border-b border-slate-100 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between bg-white">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          {filterOptions.map((fOpt) => (
            <div key={fOpt.key} className="flex items-center">
              <select
                value={activeFilters[fOpt.key] || 'ALL'}
                onChange={(e) => handleFilterChange(fOpt.key, e.target.value)}
                className="text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              >
                <option value="ALL">All {fOpt.label}s</option>
                {fOpt.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1.5 rounded hover:bg-red-50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Table Utilities */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          {enableExport && (
            <button
              type="button"
              onClick={handleExportCSV}
              title="Export CSV"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          )}

          {enablePrint && (
            <button
              type="button"
              onClick={handlePrint}
              title="Print Table"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
          )}

          {/* Column Visibility Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColSettings(!showColSettings)}
              title="Column Visibility"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {showColSettings && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white p-2.5 shadow-xl border border-slate-200 z-30">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Toggle Columns
                </p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {initialColumns.map((col) => (
                    <label
                      key={col.id}
                      className="flex items-center gap-2 text-xs text-slate-700 hover:bg-slate-50 p-1 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={!hiddenColumns.includes(col.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setHiddenColumns((prev) => prev.filter((id) => id !== col.id));
                          } else {
                            if (visibleColumns.length > 1) {
                              setHiddenColumns((prev) => [...prev, col.id]);
                            }
                          }
                        }}
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                      />
                      <span className="truncate">{col.header}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="overflow-x-auto max-w-full">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {visibleColumns.map((col) => {
                const isSorted = sortState?.columnId === col.id;
                const alignClass =
                  col.align === 'center'
                    ? 'text-center'
                    : col.align === 'right'
                    ? 'text-right'
                    : 'text-left';

                return (
                  <th
                    key={col.id}
                    scope="col"
                    onClick={() => handleSort(col.id, col.sortable)}
                    className={`px-4 py-3 select-none ${alignClass} ${
                      col.sortable
                        ? 'cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors'
                        : ''
                    } ${col.className || ''}`}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === 'center'
                          ? 'justify-center'
                          : col.align === 'right'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-slate-400">
                          {isSorted ? (
                            sortState.direction === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-slate-900" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-900" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
              {actions && (
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 w-16"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700 bg-white">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (actions ? 1 : 0)}
                  className="p-8 text-center"
                >
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    actionLabel={onEmptyAction && emptyActionLabel ? emptyActionLabel : undefined}
                    onAction={onEmptyAction}
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => {
                const rowKey = keyExtractor ? keyExtractor(row, rIdx) : row.id || `row-${rIdx}`;
                const rowActions = actions ? actions(row) : [];

                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`group transition-colors hover:bg-slate-50/80 ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                  >
                    {visibleColumns.map((col) => {
                      const alignClass =
                        col.align === 'center'
                          ? 'text-center'
                          : col.align === 'right'
                          ? 'text-right'
                          : 'text-left';

                      return (
                        <td
                          key={col.id}
                          className={`px-4 py-3.5 align-middle ${alignClass} ${col.className || ''}`}
                        >
                          {col.cell
                            ? col.cell(row, rIdx)
                            : col.accessorKey
                            ? String(row[col.accessorKey] ?? '—')
                            : String(row[col.id] ?? '—')}
                        </td>
                      );
                    })}

                    {actions && (
                      <td
                        className="px-4 py-3.5 align-middle text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ActionMenu items={rowActions} />
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 bg-slate-50/50 text-xs text-slate-600">
        <div className="flex items-center gap-4">
          <span>
            Showing{' '}
            <strong className="font-semibold text-slate-900">
              {totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </strong>{' '}
            to{' '}
            <strong className="font-semibold text-slate-900">
              {Math.min(currentPage * pageSize, totalRecords)}
            </strong>{' '}
            of <strong className="font-semibold text-slate-900">{totalRecords}</strong> records
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 focus:outline-hidden focus:border-slate-900"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Page Nav Buttons */}
        <div className="flex items-center gap-1 self-center sm:self-auto">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 font-semibold text-slate-800 text-xs">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
