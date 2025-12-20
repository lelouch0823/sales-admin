import React from 'react';
import { AuditLog, User } from '../../types';
import { Card } from '../common/Card';
import { useTranslation } from 'react-i18next';

interface AuditTableProps {
  logs: AuditLog[];
  users: User[];
}

export const AuditTable: React.FC<AuditTableProps> = ({ logs, users }) => {
  const { t } = useTranslation();
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || id;

  return (
    <Card noPadding>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-4 px-6">{t('audit.table.timestamp')}</th>
              <th className="py-4 px-6">{t('audit.table.operator')}</th>
              <th className="py-4 px-6">{t('audit.table.action')}</th>
              <th className="py-4 px-6">{t('audit.table.target')}</th>
              <th className="py-4 px-6">{t('audit.table.details')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50/40 text-sm">
                <td className="py-4 px-6 text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                <td className="py-4 px-6 font-medium text-gray-900">{getUserName(log.operatorId)}</td>
                <td className="py-4 px-6">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                    log.action === 'DELETE' ? 'bg-red-100 text-red-700' :
                    log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {t(`consts.action.${log.action}`) || log.action}
                  </span>
                </td>
                <td className="py-4 px-6 font-mono text-xs text-gray-600">
                   {t(`consts.target_type.${log.targetType}`) || log.targetType} / {log.targetId}
                </td>
                <td className="py-4 px-6 text-gray-600">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <div className="p-8 text-center text-gray-400">{t('common.no_data')}</div>}
      </div>
    </Card>
  );
};