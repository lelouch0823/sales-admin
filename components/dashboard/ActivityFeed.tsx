import React from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import { Card } from '../common/Card';
import { AuditLog } from '../../types';
import { useTranslation } from 'react-i18next';

interface ActivityFeedProps {
  logs: AuditLog[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ logs }) => {
  const { t } = useTranslation();

  return (
    <Card className="h-full">
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">{t('dashboard.recent_activity')}</h3>
            <button className="text-xs text-brand hover:underline flex items-center gap-1">{t('common.view_all')} <ArrowRight size={12}/></button>
        </div>
        <div className="space-y-6">
            {logs.slice(0, 5).map(log => (
                <div key={log.id} className="flex gap-4 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[19px] top-8 bottom-[-24px] w-px bg-gray-100 last:hidden"></div>
                        
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 border-surface shadow-sm z-10 ${
                            log.action === 'CREATE' ? 'bg-success-light text-success-text' :
                            log.action === 'DELETE' ? 'bg-danger-light text-danger-text' :
                            'bg-brand-light text-brand'
                        }`}>
                            <FileText size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-primary">
                                {t(`consts.action.${log.action}`)} 
                                <span className="text-gray-500 font-normal"> {t('common.on')} {t(`consts.target_type.${log.targetType}`)}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{log.timestamp}</p>
                        </div>
                </div>
            ))}
            {logs.length === 0 && <div className="text-sm text-gray-400">{t('common.no_data')}</div>}
        </div>
    </Card>
  );
};