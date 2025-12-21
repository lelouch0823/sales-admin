import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface PaginationProps {
  /** 当前页码 (从 1 开始) */
  currentPage: number;
  /** 总页数 */
  totalPages: number;
  /** 页码变化回调 */
  onPageChange: (page: number) => void;
  /** 显示的页码数量 (默认 5) */
  siblingCount?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * 分页组件
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  disabled = false,
  className,
}: PaginationProps) {
  // 生成页码数组
  const generatePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const totalNumbers = siblingCount * 2 + 3; // 首页 + 尾页 + 当前页 + 两侧兄弟

    if (totalPages <= totalNumbers + 2) {
      // 如果总页数较少，显示全部
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1);

      const showLeftEllipsis = leftSiblingIndex > 2;
      const showRightEllipsis = rightSiblingIndex < totalPages - 1;

      pages.push(1);

      if (showLeftEllipsis) {
        pages.push('ellipsis');
      }

      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pages.push(i);
      }

      if (showRightEllipsis) {
        pages.push('ellipsis');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();

  if (totalPages <= 1) return null;

  return (
    <nav className={cn('flex items-center justify-center gap-1', className)} aria-label="分页导航">
      {/* 上一页 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        className={cn(
          'inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700',
          'hover:bg-gray-50 hover:border-gray-300 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200'
        )}
        aria-label="上一页"
      >
        <ChevronLeft size={16} />
      </button>

      {/* 页码 */}
      {pages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex items-center justify-center w-9 h-9 text-gray-400"
            >
              <MoreHorizontal size={16} />
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={disabled}
            className={cn(
              'inline-flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* 下一页 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        className={cn(
          'inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700',
          'hover:bg-gray-50 hover:border-gray-300 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200'
        )}
        aria-label="下一页"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

export default Pagination;
