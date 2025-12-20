import React, { useEffect } from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string; // 控制抽屉宽度，例如 'max-w-md'
}

/**
 * 通用抽屉组件 (Drawer)
 * 职责:
 * 1. 提供右侧滑出的面板，用于展示详细信息或复杂表单
 * 2. 处理滚动锁定和背景点击关闭
 * 3. 相比 Modal，Drawer 更适合纵向内容较多的场景 (如详情页、审计日志)
 */
export const Drawer: React.FC<DrawerProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  className = 'max-w-md' 
}) => {
  // --- 副作用: 锁定/解锁 Body 滚动 ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // 背景遮罩: 点击此处关闭抽屉
    <div 
      className="fixed inset-0 bg-black/50 z-[100] flex justify-end backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* 抽屉主体: 从右侧滑入 (slide-in-from-right) */}
      <div 
        className={`bg-surface h-full shadow-2xl w-full ${className} flex flex-col animate-in slide-in-from-right duration-300`}
        onClick={(e) => e.stopPropagation()} // 阻止点击冒泡
      >
        {children}
      </div>
    </div>
  );
};