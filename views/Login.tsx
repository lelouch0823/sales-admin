import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { Button } from '../components/ui';

// 登录页面视图
// 职责:
// 1. 提供登录界面，分为左侧品牌区和右侧表单区
// 2. 支持中英文切换 (i18n)
// 3. 嵌入 LoginForm 组件处理实际认证逻辑
export const LoginView: React.FC = () => {
  const { t, i18n } = useTranslation();

  // 切换语言处理函数
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row animate-fade-in">
      {/* 左侧: 品牌视觉区域 (Brand & Visuals) */}
      <div className="md:w-1/2 bg-primary relative overflow-hidden flex flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-gray-800 to-black z-0"></div>
        {/* 装饰性背景图案 (Abstract Pattern) */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="url(#grad1)" />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: 'rgb(59,130,246)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'rgb(147,51,234)', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 品牌 Logo 与 Slogan */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand to-cyan-400 flex items-center justify-center text-white text-xs font-bold shadow-lg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">WR.DO</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            The Operating System <br /> for Modern Retail.
          </h1>
          <p className="text-gray-400 text-lg max-w-md">
            Unify your product data, inventory, and customer relationships in one beautiful dashboard.
          </p>
        </div>

        {/* 底部链接 */}
        <div className="relative z-10 flex gap-6 text-sm text-gray-500">
          <span>{t('login.footer.rights')}</span>
          <a href="#" className="hover:text-gray-300 transition-colors">{t('login.footer.privacy')}</a>
          <a href="#" className="hover:text-gray-300 transition-colors">{t('login.footer.terms')}</a>
        </div>
      </div>

      {/* 右侧: 登录表单区域 */}
      <div className="md:w-1/2 flex items-center justify-center p-8 relative">
        {/* 语言切换按钮 (绝对定位) */}
        <div className="absolute top-8 right-8">
          <Button variant="ghost" size="sm" onClick={toggleLanguage}>
            <Globe size={16} className="mr-2" />
            {i18n.language === 'en' ? 'English' : '中文'}
          </Button>
        </div>

        {/* 登录表单组件 */}
        <LoginForm />
      </div>
    </div>
  );
};