import React, { memo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/ui/Pagination';

export interface Column<T> {
  /** 列标识 */
  key: string;
  /** 列标题 */
  header: string;
  /** 数据访问器 */
  accessor?: keyof T | ((row: T) => React.ReactNode);
  /** 自定义渲染 */
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  /** 是否可排序 */
  sortable?: boolean;
  /** 列宽 */
  width?: string | number;
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  /** 列定义 */
  columns: Column<T>[];
  /** 数据源 */
  data: T[];
  /** 行唯一标识字段 */
  rowKey: keyof T | ((row: T) => string);
  /** 是否加载中 */
  loading?: boolean;
  /** 加载骨架屏行数 */
  skeletonRows?: number;
  /** 空状态提示 */
  emptyText?: string;
  /** 分页配置 */
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  /** 排序状态 */
  sortState?: { key: string; direction: 'asc' | 'desc' } | null;
  /** 排序变化回调 */
  onSortChange?: (sortState: { key: string; direction: 'asc' | 'desc' } | null) => void;
  /** 行选择 */
  selectedRows?: Set<string>;
  /** 行选择变化回调 */
  onSelectedRowsChange?: (selectedRows: Set<string>) => void;
  /** 行点击回调 */
  onRowClick?: (row: T) => void;
  /** 自定义类名 */
  className?: string;
}

interface DataTableRowProps<T> {
  row: T;
  rowIndex: number;
  columns: Column<T>[];
  isSelected: boolean;
  onSelectRow?: (row: T) => void;
  onRowClick?: (row: T) => void;
  showCheckbox: boolean;
}

// 提取并 Memoize 行组件以优化性能
const DataTableRow = memo(
  <T,>({
    row,
    rowIndex,
    columns,
    isSelected,
    onSelectRow,
    onRowClick,
    showCheckbox,
  }: DataTableRowProps<T>) => {
    const getCellValue = (row: T, column: Column<T>): unknown => {
      if (column.accessor) {
        if (typeof column.accessor === 'function') {
          return column.accessor(row);
        }
        return row[column.accessor];
      }
      return (row as Record<string, unknown>)[column.key];
    };

    return (
      <tr
        className={cn(
          'transition-colors',
          isSelected ? 'bg-blue-50' : 'hover:bg-gray-50',
          onRowClick && 'cursor-pointer'
        )}
        onClick={() => onRowClick?.(row)}
      >
        {showCheckbox && (
          <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelectRow?.(row)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </td>
        )}
        {columns.map(column => {
          const value = getCellValue(row, column);
          return (
            <td
              key={column.key}
              className={cn(
                'px-4 py-3 text-sm text-gray-900',
                column.align === 'center' && 'text-center',
                column.align === 'right' && 'text-right'
              )}
            >
              {column.render ? column.render(value, row, rowIndex) : (value as React.ReactNode)}
            </td>
          );
        })}
      </tr>
    );
  },
  // 自定义比较函数（可选，如果默认浅比较不够用）
  (prevProps, nextProps) => {
    return (
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.row === nextProps.row &&
      prevProps.columns === nextProps.columns
    );
  }
) as <T>(props: DataTableRowProps<T>) => React.ReactElement;

/**
 * 通用数据表格组件
 */
export function DataTable<T>({
  columns,
  data,
  rowKey,
  loading = false,
  skeletonRows = 5,
  emptyText = '暂无数据',
  pagination,
  sortState,
  onSortChange,
  selectedRows,
  onSelectedRowsChange,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const getRowKey = (row: T): string => {
    if (typeof rowKey === 'function') {
      return rowKey(row);
    }
    return String(row[rowKey]);
  };

  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !onSortChange) return;

    if (sortState?.key === column.key) {
      if (sortState.direction === 'asc') {
        onSortChange({ key: column.key, direction: 'desc' });
      } else {
        onSortChange(null);
      }
    } else {
      onSortChange({ key: column.key, direction: 'asc' });
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectedRowsChange) return;
    if (e.target.checked) {
      onSelectedRowsChange(new Set(data.map(getRowKey)));
    } else {
      onSelectedRowsChange(new Set());
    }
  };

  const handleSelectRow = (row: T) => {
    if (!onSelectedRowsChange || !selectedRows) return;
    const key = getRowKey(row);
    const newSelected = new Set(selectedRows);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    onSelectedRowsChange(newSelected);
  };

  const isAllSelected =
    selectedRows && data.length > 0 && data.every(row => selectedRows.has(getRowKey(row)));
  const isSomeSelected = selectedRows && data.some(row => selectedRows.has(getRowKey(row)));

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    if (sortState?.key === column.key) {
      return sortState.direction === 'asc' ? (
        <ChevronUp size={14} className="text-blue-600" />
      ) : (
        <ChevronDown size={14} className="text-blue-600" />
      );
    }
    return <ChevronsUpDown size={14} className="text-gray-400" />;
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {selectedRows !== undefined && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={el => {
                      if (el) el.indeterminate = !isAllSelected && !!isSomeSelected;
                    }}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map(column => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sortable && 'cursor-pointer select-none hover:bg-gray-100'
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div
                    className={cn(
                      'flex items-center gap-1',
                      column.align === 'center' && 'justify-center',
                      column.align === 'right' && 'justify-end'
                    )}
                  >
                    <span>{column.header}</span>
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              // 骨架屏
              Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i}>
                  {selectedRows !== undefined && (
                    <td className="px-4 py-3">
                      <Skeleton className="w-4 h-4" />
                    </td>
                  )}
                  {columns.map(column => (
                    <td key={column.key} className="px-4 py-3">
                      <Skeleton className="h-5 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // 空状态
              <tr>
                <td
                  colSpan={columns.length + (selectedRows !== undefined ? 1 : 0)}
                  className="px-4 py-12"
                >
                  <EmptyState title={emptyText} />
                </td>
              </tr>
            ) : (
              // 数据行
              data.map((row, rowIndex) => {
                const key = getRowKey(row);
                const isSelected = selectedRows?.has(key);
                return (
                  <DataTableRow
                    key={key}
                    row={row}
                    rowIndex={rowIndex}
                    columns={columns}
                    isSelected={!!isSelected}
                    onSelectRow={handleSelectRow}
                    onRowClick={onRowClick}
                    showCheckbox={selectedRows !== undefined}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  );
}

export default DataTable;
