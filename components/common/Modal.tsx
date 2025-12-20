import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string; // 用于控制宽度，例如 'max-w-lg'
  noPadding?: boolean; // 是否移除内容区域的内边距 (用于全宽表格)
}

/**
 * 通用模态框组件 (Modal)
 * 职责:
 * 1. 提供居中的覆盖层窗口
 * 2. 处理背景滚动锁定 (Body Scroll Locking)
 * 3. 处理点击背景关闭 (Backdrop Click)
 * 4. 提供统一的标题栏和关闭按钮
 */
export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = 'max-w-md',
  noPadding = false
}) => {
  // --- 副作用: 锁定/解锁 Body 滚动 ---
  // 当模态框打开时，禁止背景页面滚动，防止双重滚动条体验
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // 组件卸载时清理样式
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // 背景遮罩层: z-index 100 确保在最上层
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
      {/* 模态框主体: 阻止点击冒泡，防止触发背景关闭 */}
      <div 
        className={`bg-surface rounded-xl shadow-2xl w-full ${className} max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
            <h3 className="font-bold text-lg text-primary">{title}</h3>
            <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
            >
                <X size={20} />
            </button>
        </div>
        
        {/* 内容区域: 支持内部滚动 */}
        <div className={`overflow-y-auto ${noPadding ? '' : 'p-6'}`}>
            {children}
        </div>
      </div>
    </div>
  );
};