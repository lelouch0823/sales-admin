import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * 全局 Toast 提供者 (ToastProvider)
 * 职责:
 * 1. 管理 Toast 通知列表状态
 * 2. 提供简便的调用方法 (success, error, etc.)
 * 3. 渲染页面右下角的 Toast 容器
 * 4. 处理 Toast 的自动销毁 (Auto-dismiss)
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // 移除指定 ID 的 Toast
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // 添加 Toast 并设置定时器自动销毁
  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // 4秒后自动移除
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  // 快捷方法封装
  const success = useCallback((msg: string) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg: string) => addToast(msg, 'error'), [addToast]);
  const info = useCallback((msg: string) => addToast(msg, 'info'), [addToast]);
  const warning = useCallback((msg: string) => addToast(msg, 'warning'), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, success, error, info, warning }}>
      {children}
      {/* Toast 渲染容器: 固定在右下角，通过 pointer-events-none 允许点击穿透到下方内容 */}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg border animate-in slide-in-from-right-full transition-all duration-300
              ${toast.type === 'success' ? 'bg-white border-green-200 text-gray-800' : ''}
              ${toast.type === 'error' ? 'bg-white border-red-200 text-gray-800' : ''}
              ${toast.type === 'warning' ? 'bg-white border-amber-200 text-gray-800' : ''}
              ${toast.type === 'info' ? 'bg-white border-blue-200 text-gray-800' : ''}
            `}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle size={18} className="text-green-500" />}
              {toast.type === 'error' && <AlertCircle size={18} className="text-red-500" />}
              {toast.type === 'warning' && <AlertTriangle size={18} className="text-amber-500" />}
              {toast.type === 'info' && <Info size={18} className="text-blue-500" />}
            </div>
            <div className="flex-1 text-sm font-medium break-words">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// 自定义 Hook 方便组件调用
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};