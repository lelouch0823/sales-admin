import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useApp } from '../../lib/context';

export const WelcomeBanner: React.FC = () => {
  const { currentUser } = useApp();
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">{t('dashboard.welcome', { name: currentUser.name.split(' ')[0] })}</h2>
            <p className="text-gray-300 max-w-xl text-sm leading-relaxed">
              <Trans i18nKey="dashboard.welcome_sub" values={{ role: currentUser.role }}>
                You are logged in as <span className="font-mono font-bold text-blue-300">{currentUser.role}</span>. 
                Manage your store recommendations, customer relationships, and system permissions efficiently.
              </Trans>
            </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
    </div>
  );
};