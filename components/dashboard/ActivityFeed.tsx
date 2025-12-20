import React from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import { Card } from '../common/Card';
import { AuditLog } from '../../types';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui';
import { AnimatedList, AnimatedListItem } from '../motion';
import { dateUtils } from '../../utils';

interface ActivityFeedProps {
    logs: AuditLog[];
}

/**
 * 活动记录组件
 * 
 * 使用封装:
 * - AnimatedList: Framer Motion 列表动画
 * - dateUtils: 日期格式化
 */
export const ActivityFeed: React.FC<ActivityFeedProps> = ({ logs }) => {
    const { t } = useTranslation();

    return (
        <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">{t('dashboard.recent_activity')}</h3>
                <Button variant="link" size="sm">
                    {t('common.view_all')} <ArrowRight size={12} className="ml-1" />
                </Button>
            </div>
            <AnimatedList staggerDelay={0.08} className="space-y-6">
                {logs.slice(0, 5).map(log => (
                    <AnimatedListItem key={log.id} className="flex gap-4 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[19px] top-8 bottom-[-24px] w-px bg-gray-100 last:hidden"></div>

                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 border-surface shadow-sm z-10 ${log.action === 'CREATE' ? 'bg-success-light text-success' :
                            log.action === 'DELETE' ? 'bg-danger-light text-danger' :
                                'bg-primary-light text-primary'
                            }`}>
                            <FileText size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-primary">
                                {t(`consts.action.${log.action}`)}
                                <span className="text-muted font-normal"> {t('common.on')} {t(`consts.target_type.${log.targetType}`)}</span>
                            </p>
                            <p className="text-xs text-muted mt-1">{log.details}</p>
                            <p className="text-[10px] text-gray-400 mt-1">
                                {dateUtils.formatSmart(log.timestamp)}
                            </p>
                        </div>
                    </AnimatedListItem>
                ))}
                {logs.length === 0 && <div className="text-sm text-muted">{t('common.no_data')}</div>}
            </AnimatedList>
        </Card>
    );
};