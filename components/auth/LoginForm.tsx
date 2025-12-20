import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Loader2, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../lib/auth';

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const { login, isLoading, error } = useAuth();
  
  const [email, setEmail] = useState('alice@wr.do');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password, rememberMe);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8 animate-in slide-in-from-right-8 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-primary tracking-tight">{t('login.title')}</h2>
        <p className="text-sm text-gray-500 mt-2">{t('login.subtitle')}</p>
      </div>

      <div className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-sm text-red-600 animate-in fade-in">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('login.email_label')}</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all disabled:opacity-50"
            placeholder="name@company.com"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">{t('login.password_label')}</label>
              <a href="#" className="text-xs font-medium text-brand hover:text-brand-hover">{t('login.forgot_password')}</a>
          </div>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all disabled:opacity-50"
            disabled={isLoading}
            required
          />
        </div>

        <div className="flex items-center">
          <button 
            type="button"
            onClick={() => setRememberMe(!rememberMe)}
            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-brand border-brand' : 'bg-white border-gray-300'}`}
          >
            {rememberMe && <Check size={12} className="text-white" />}
          </button>
          <button 
            type="button"
            onClick={() => setRememberMe(!rememberMe)}
            className="ml-2 text-sm text-gray-600 select-none"
          >
            Remember me
          </button>
        </div>

        <div className="pt-2">
            <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-gray-900/10 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    {t('login.sign_in_btn')}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
            </button>
        </div>
        
        <div className="p-3 bg-brand-light rounded-lg text-brand text-xs text-center border border-blue-100">
            {t('login.demo_hint')}
        </div>
      </div>
    </form>
  );
};