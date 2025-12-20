import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * UI 状态 Store
 * 管理全局 UI 状态：侧边栏、主题、语言偏好等
 */
interface UIState {
    sidebarCollapsed: boolean;
    theme: 'light' | 'dark' | 'system';
    locale: 'en' | 'zh';
    toggleSidebar: () => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    setLocale: (locale: 'en' | 'zh') => void;
}

export const useUIStore = create<UIState>()(
    devtools(
        persist(
            (set) => ({
                sidebarCollapsed: false,
                theme: 'light',
                locale: 'zh',
                toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
                setTheme: (theme) => set({ theme }),
                setLocale: (locale) => set({ locale }),
            }),
            {
                name: 'ui-storage',
            }
        )
    )
);

/**
 * 通知状态 Store
 * 管理应用内通知消息
 */
interface Notification {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message?: string;
    timestamp: Date;
    read: boolean;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
    devtools((set) => ({
        notifications: [],
        unreadCount: 0,
        addNotification: (notification) =>
            set((state) => {
                const newNotification: Notification = {
                    ...notification,
                    id: Math.random().toString(36).substr(2, 9),
                    timestamp: new Date(),
                    read: false,
                };
                return {
                    notifications: [newNotification, ...state.notifications],
                    unreadCount: state.unreadCount + 1,
                };
            }),
        markAsRead: (id) =>
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n.id === id ? { ...n, read: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            })),
        markAllAsRead: () =>
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, read: true })),
                unreadCount: 0,
            })),
        clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
    }))
);
