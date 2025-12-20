import React from 'react';
import { useApp } from '../lib/context';
import { AuditTable } from '../components/audit/AuditTable';
import { useTranslation } from 'react-i18next';
import { AnimatedBox } from '../components/motion';

/**
 * 审计日志视图
 * 
 * 使用封装:
 * - AnimatedBox: 入场动画
 */
export const AuditLogView: React.FC = () => {
  const { logs, users } = useApp();
  const { t } = useTranslation();

  return (
    <AnimatedBox animation="fadeInUp" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">{t('audit.title')}</h2>
      </div>
      <AuditTable logs={logs} users={users} />
    </AnimatedBox>
  );
};