import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { useNotificationStore } from '@/lib/store';
import { Dropdown, DropdownTrigger, DropdownContent } from '@/components/primitives';
import { Button } from '@/components/ui';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { cn } from '@/utils/cn';

/**
 * 通知中心面板组件
 * 展示 useNotificationStore 中的通知列表
 */
export function NotificationPanel() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } =
    useNotificationStore();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return `${days}天前`;
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-l-green-500';
      case 'error':
        return 'bg-red-50 border-l-red-500';
      case 'warning':
        return 'bg-amber-50 border-l-amber-500';
      case 'info':
      default:
        return 'bg-blue-50 border-l-blue-500';
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <button
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="打开通知中心"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-medium text-white bg-red-500 rounded-full">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownTrigger>

      <DropdownContent
        align="end"
        sideOffset={8}
        className="w-80 max-h-[480px] flex flex-col bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">通知</span>
            {unreadCount > 0 && <Badge variant="default">{unreadCount} 未读</Badge>}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} title="全部标为已读">
                <CheckCheck size={16} />
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearNotifications} title="清空通知">
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* 通知列表 */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-12 px-4">
              <EmptyState title="暂无通知" description="有新消息时会在这里显示" />
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {notifications.map(notification => (
                <li
                  key={notification.id}
                  className={cn(
                    'relative px-4 py-3 border-l-4 transition-colors cursor-pointer hover:bg-gray-50',
                    getTypeStyles(notification.type),
                    !notification.read && 'bg-opacity-80'
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm truncate',
                          !notification.read
                            ? 'font-semibold text-gray-900'
                            : 'font-medium text-gray-700'
                        )}
                      >
                        {notification.title}
                      </p>
                      {notification.message && (
                        <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                          {notification.message}
                        </p>
                      )}
                      <p className="mt-1 text-[10px] text-gray-400">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="shrink-0 w-2 h-2 mt-1.5 bg-blue-500 rounded-full" />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DropdownContent>
    </Dropdown>
  );
}

export default NotificationPanel;
