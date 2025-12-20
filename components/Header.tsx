import React from 'react';
import { Bell, Menu, Globe, RotateCcw } from 'lucide-react';
import { useApp } from '../lib/context';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onMenuClick: () => void; // 移动端菜单点击回调
  onOpenCommand: () => void; // 打开命令面板回调
}

/**
 * 顶部导航栏组件 (Header)
 * 职责:
 * 1. 包含移动端菜单触发器和全局搜索入口
 * 2. 提供全局操作 (语言切换、重置演示数据)
 * 3. 显示当前登录用户信息
 */
export const Header: React.FC<HeaderProps> = ({ onMenuClick, onOpenCommand }) => {
  const { currentUser, resetDemoData } = useApp();
  const { t, i18n } = useTranslation();

  // 语言切换逻辑
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md pt-6 pb-2 px-4 sm:px-8 flex items-center justify-between border-b border-transparent transition-all">
      {/* 左侧区域: 移动端菜单 & 搜索框 */}
      <div className="flex items-center gap-4 w-full max-w-md">
        {/* 移动端菜单按钮 (仅在小屏显示) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* 伪搜索框 (点击唤起命令面板) */}
        <div className="relative group w-full cursor-pointer" onClick={onOpenCommand}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {/* Using text-gray-400 to match the subtle look */}
          </div>
          <div className="relative">
            <input
              type="text"
              readOnly
              placeholder={t('header.search_placeholder')}
              className="w-full bg-gray-100/50 hover:bg-gray-100 focus:bg-surface border border-transparent focus:border-gray-200 text-gray-600 text-sm rounded-lg pl-4 pr-12 py-2.5 outline-none transition-all placeholder:text-gray-400 shadow-sm focus:shadow-md cursor-pointer"
            />
            {/* 快捷键提示 */}
            <div className="absolute inset-y-0 right-3 flex items-center">
              <kbd className="hidden sm:inline-flex items-center h-5 px-1.5 border border-gray-200 rounded text-[10px] font-sans font-medium text-gray-400 bg-surface shadow-sm">
                <span className="text-xs mr-0.5">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧区域: 全局操作与个人信息 */}
      <div className="flex items-center gap-4">
        {/* 重置数据按钮 (仅限超级管理员，用于演示环境) */}
        {currentUser.role === 'SUPER_ADMIN' && (
          <button
            onClick={() => { if (confirm('Reset all demo data?')) resetDemoData(); }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Reset Demo Data"
          >
            <RotateCcw size={18} />
          </button>
        )}

        {/* 语言切换按钮 */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          <Globe size={14} />
          {i18n.language === 'en' ? 'EN' : '中文'}
        </button>

        {/* 通知中心 (Mock) */}
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-white"></span>
        </button>

        {/* 用户信息卡片 */}
        <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
          <div className="text-right hidden md:block">
            <div className="text-sm font-medium text-primary">{currentUser.name}</div>
            <div className="text-xs text-gray-500">{currentUser.role}</div>
          </div>
          <button className="relative">
            <img
              src={currentUser.avatarUrl}
              alt="Profile"
              className="w-9 h-9 rounded-full border border-gray-200 object-cover shadow-sm"
            />
          </button>
        </div>
      </div>
    </header>
  );
};