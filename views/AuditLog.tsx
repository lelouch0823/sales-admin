import React from 'react';
import { useApp } from '../lib/context';
import { AuditTable } from '../components/audit/AuditTable';
import { useTranslation } from 'react-i18next';

export const AuditLogView: React.FC = () => {
  const { logs, users } = useApp();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h2 className="text-xl font-bold text-gray-900">{t('audit.title')}</h2>
       </div>
       <AuditTable logs={logs} users={users} />
    </div>
  );
};