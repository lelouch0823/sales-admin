import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { Button, Input } from '../ui';

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
        <p className="text-sm text-muted mt-2">{t('login.subtitle')}</p>
      </div>

      <div className="space-y-5">
        {error && (
          <div className="p-3 bg-danger-light border border-red-100 rounded-lg flex items-center gap-2 text-sm text-danger animate-in fade-in">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        <Input
          label={t('login.email_label')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="filled"
          placeholder="name@company.com"
          disabled={isLoading}
          required
        />

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-gray-500 uppercase">{t('login.password_label')}</label>
            <a href="#" className="text-xs font-medium text-primary hover:text-primary-hover">{t('login.forgot_password')}</a>
          </div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="filled"
            disabled={isLoading}
            required
          />
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setRememberMe(!rememberMe)}
            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}
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
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            className="shadow-lg shadow-gray-900/10"
          >
            {t('login.sign_in_btn')}
            {!isLoading && <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </div>

        <div className="p-3 bg-primary-light rounded-lg text-primary text-xs text-center border border-blue-100">
          {t('login.demo_hint')}
        </div>
      </div>
    </form>
  );
};