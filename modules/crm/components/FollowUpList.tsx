/**
 * CRM 跟进记录组件
 *
 * 显示客户跟进历史记录
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    MessageSquare,
    Phone,
    Mail,
    Calendar,
    Plus,
    User,
    Clock,
} from 'lucide-react';

import { Card } from '../../../components/common/Card';
import { Button, Textarea } from '../../../components/ui';

// ============ 类型定义 ============

/** 跟进方式 */
export type FollowUpType = 'CALL' | 'VISIT' | 'EMAIL' | 'WECHAT' | 'OTHER';

/** 跟进记录 */
export interface FollowUpRecord {
    id: string;
    customerId: string;
    type: FollowUpType;
    content: string;
    createdBy: string;
    createdByName: string;
    createdAt: string;
    nextFollowUpAt?: string;
}

interface FollowUpListProps {
    records: FollowUpRecord[];
    onAddRecord: (record: Omit<FollowUpRecord, 'id' | 'createdAt'>) => void;
    currentUserId: string;
    currentUserName: string;
    customerId: string;
}

// 跟进类型配置（使用 key 而非直接中文）
const FOLLOW_UP_TYPE_KEYS = ['CALL', 'VISIT', 'EMAIL', 'WECHAT', 'OTHER'] as const;
const FOLLOW_UP_ICONS: Record<FollowUpType, React.ElementType> = {
    CALL: Phone,
    VISIT: User,
    EMAIL: Mail,
    WECHAT: MessageSquare,
    OTHER: Calendar,
};

export const FollowUpList: React.FC<FollowUpListProps> = ({
    records,
    onAddRecord,
    currentUserId,
    currentUserName,
    customerId,
}) => {
    const { t } = useTranslation();
    const [isAdding, setIsAdding] = useState(false);
    const [newType, setNewType] = useState<FollowUpType>('CALL');
    const [newContent, setNewContent] = useState('');
    const [nextFollowUp, setNextFollowUp] = useState('');

    // 提交新记录
    const handleSubmit = () => {
        if (!newContent.trim()) return;

        onAddRecord({
            customerId,
            type: newType,
            content: newContent.trim(),
            createdBy: currentUserId,
            createdByName: currentUserName,
            nextFollowUpAt: nextFollowUp || undefined,
        });

        // 重置表单
        setNewContent('');
        setNextFollowUp('');
        setIsAdding(false);
    };

    // 格式化时间
    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return t('crm.followup.today', '今天');
        if (days === 1) return t('crm.followup.yesterday', '昨天');
        if (days < 7) return t('crm.followup.days_ago', '{{days}} 天前', { days });
        return date.toLocaleDateString();
    };

    return (
        <div className="space-y-4">
            {/* 添加按钮 */}
            {!isAdding && (
                <Button variant="secondary" onClick={() => setIsAdding(true)}>
                    <Plus size={16} className="mr-2" />
                    {t('crm.followup.add', '添加跟进记录')}
                </Button>
            )}

            {/* 添加表单 */}
            {isAdding && (
                <Card>
                    <div className="space-y-4">
                        <h4 className="font-medium">{t('crm.followup.new', '新建跟进记录')}</h4>

                        {/* 跟进类型 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('crm.followup.type', '跟进方式')}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {FOLLOW_UP_TYPE_KEYS.map(typeKey => {
                                    const Icon = FOLLOW_UP_ICONS[typeKey];
                                    return (
                                        <button
                                            key={typeKey}
                                            onClick={() => setNewType(typeKey)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${newType === typeKey
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
                                                }`}
                                        >
                                            <Icon size={14} />
                                            {t(`crm.followup.type_${typeKey.toLowerCase()}`, typeKey)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 跟进内容 */}
                        <Textarea
                            label={t('crm.followup.content', '跟进内容')}
                            value={newContent}
                            onChange={e => setNewContent(e.target.value)}
                            rows={3}
                            placeholder={t('crm.followup.content_placeholder', '记录本次跟进的详细内容...')}
                        />

                        {/* 下次跟进时间 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('crm.followup.next_date', '下次跟进时间（可选）')}
                            </label>
                            <input
                                type="date"
                                value={nextFollowUp}
                                onChange={e => setNextFollowUp(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-full max-w-xs"
                            />
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => setIsAdding(false)}>
                                {t('common.cancel', '取消')}
                            </Button>
                            <Button variant="primary" onClick={handleSubmit} disabled={!newContent.trim()}>
                                {t('common.save', '保存')}
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* 跟进记录列表 */}
            <div className="space-y-3">
                {records.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-lg">
                        {t('crm.followup.empty', '暂无跟进记录')}
                    </div>
                ) : (
                    records.map(record => {
                        const TypeIcon = FOLLOW_UP_ICONS[record.type] || MessageSquare;

                        return (
                            <Card key={record.id}>
                                <div className="flex gap-4">
                                    {/* 图标 */}
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <TypeIcon size={18} />
                                    </div>

                                    {/* 内容 */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium text-primary">
                                                {t(`crm.followup.type_${record.type.toLowerCase()}`, record.type)}
                                            </span>
                                            <span className="text-xs text-gray-400">·</span>
                                            <span className="text-xs text-gray-500">{record.createdByName}</span>
                                            <span className="text-xs text-gray-400">·</span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock size={12} />
                                                {formatTime(record.createdAt)}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {record.content}
                                        </p>

                                        {record.nextFollowUpAt && (
                                            <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar size={12} />
                                                {t('crm.followup.next_time', '下次跟进')}:
                                                {new Date(record.nextFollowUpAt).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
};
