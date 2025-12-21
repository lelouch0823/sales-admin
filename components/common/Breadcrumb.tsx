import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface BreadcrumbItem {
  /** 显示文字 */
  label: string;
  /** 链接地址 (最后一项无需链接) */
  href?: string;
  /** 点击回调 */
  onClick?: () => void;
  /** 图标 */
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  /** 面包屑项目 */
  items: BreadcrumbItem[];
  /** 分隔符 */
  separator?: React.ReactNode;
  /** 是否显示首页图标 */
  showHomeIcon?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * 面包屑导航组件
 */
export function Breadcrumb({
  items,
  separator = <ChevronRight size={14} className="text-gray-400" />,
  showHomeIcon = true,
  className,
}: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav className={cn('flex items-center', className)} aria-label="面包屑导航">
      <ol className="flex items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {/* 分隔符 */}
              {index > 0 && <span className="select-none">{separator}</span>}

              {/* 内容 */}
              {isLast ? (
                // 最后一项 (当前页)
                <span
                  className="text-sm font-medium text-gray-900 flex items-center gap-1.5"
                  aria-current="page"
                >
                  {item.icon}
                  {item.label}
                </span>
              ) : (
                // 可点击链接
                <a
                  href={item.href || '#'}
                  onClick={e => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1.5"
                >
                  {isFirst && showHomeIcon && !item.icon ? <Home size={14} /> : item.icon}
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
