/**
 * 推荐预览组件
 *
 * 展示 App 端最终看到的推荐列表
 * 支持选择门店和限制数量
 */

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Store, Globe, Package, AlertTriangle, CheckCircle } from 'lucide-react';

import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Button, Select } from '../../../components/ui';
import { Recommendation } from '../types';

interface PreviewProduct {
    id: string;
    sku: string;
    name: string;
    imageUrl: string;
    price: number;
    stockStatus: 'IN_STOCK' | 'TRANSFERABLE' | 'BACKORDER' | 'UNAVAILABLE';
    stockCount: number;
}

interface RecommendationPreviewProps {
    globalRecommendations: (Recommendation & { product: PreviewProduct })[];
    storeRecommendations: Map<string, (Recommendation & { product: PreviewProduct })[]>;
    stores: { id: string; name: string }[];
}

// 库存状态配置
const STOCK_STATUS_CONFIG = {
    IN_STOCK: { variant: 'success' as const, label: '有货', icon: CheckCircle },
    TRANSFERABLE: { variant: 'warning' as const, label: '可调货', icon: Package },
    BACKORDER: { variant: 'warning' as const, label: '可预订', icon: AlertTriangle },
    UNAVAILABLE: { variant: 'danger' as const, label: '无货', icon: AlertTriangle },
};

export const RecommendationPreview: React.FC<RecommendationPreviewProps> = ({
    globalRecommendations,
    storeRecommendations,
    stores,
}) => {
    const { t } = useTranslation();
    const [selectedStore, setSelectedStore] = useState<string>('');
    const [limit, setLimit] = useState(10);

    // 计算最终推荐列表
    const finalRecommendations = useMemo(() => {
        // 如果选择了门店且门店有配置，使用门店配置（完全覆盖）
        if (selectedStore) {
            const storeRecs = storeRecommendations.get(selectedStore);
            if (storeRecs && storeRecs.length > 0) {
                return storeRecs
                    .filter(r => r.isEnabled)
                    .sort((a, b) => a.priority - b.priority)
                    .slice(0, limit)
                    .map(r => ({ ...r, source: 'store' as const }));
            }
        }

        // 否则使用全局配置
        return globalRecommendations
            .filter(r => r.isEnabled)
            .sort((a, b) => a.priority - b.priority)
            .slice(0, limit)
            .map(r => ({ ...r, source: 'global' as const }));
    }, [selectedStore, globalRecommendations, storeRecommendations, limit]);

    const storeOptions = [
        { value: '', label: t('recommendations.preview.all_stores', '全局视图') },
        ...stores.map(s => ({ value: s.id, label: s.name })),
    ];

    const limitOptions = [
        { value: '5', label: '5' },
        { value: '10', label: '10' },
        { value: '20', label: '20' },
        { value: '50', label: '50' },
    ];

    // 判断是否使用门店覆盖
    const isStoreOverride = selectedStore && storeRecommendations.get(selectedStore)?.length;

    return (
        <div className="space-y-4">
            {/* 控制栏 */}
            <Card>
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <Select
                            label={t('recommendations.preview.store', '选择门店')}
                            options={storeOptions}
                            value={selectedStore}
                            onChange={e => setSelectedStore(e.target.value)}
                        />
                    </div>
                    <div className="w-24">
                        <Select
                            label={t('recommendations.preview.limit', '显示数量')}
                            options={limitOptions}
                            value={String(limit)}
                            onChange={e => setLimit(Number(e.target.value))}
                        />
                    </div>
                    <Button variant="secondary">
                        <Eye size={16} className="mr-2" />
                        {t('recommendations.preview.refresh', '刷新预览')}
                    </Button>
                </div>

                {/* 覆盖提示 */}
                {isStoreOverride && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2 text-sm text-blue-700">
                        <Store size={16} />
                        {t('recommendations.preview.store_override', '当前显示门店配置，门店配置存在时完全覆盖全局配置')}
                    </div>
                )}
            </Card>

            {/* 预览列表 */}
            <Card noPadding>
                <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-medium flex items-center gap-2">
                        <Eye size={18} />
                        {t('recommendations.preview.title', 'App 端预览')}
                        <Badge variant="neutral">{finalRecommendations.length} {t('common.items', '项')}</Badge>
                    </h3>
                </div>

                <div className="divide-y">
                    {finalRecommendations.map((rec, index) => {
                        const statusConfig = STOCK_STATUS_CONFIG[rec.product.stockStatus];
                        const StatusIcon = statusConfig.icon;

                        return (
                            <div key={rec.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                                {/* 排名 */}
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                    {index + 1}
                                </div>

                                {/* 商品图片 */}
                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                                    <img
                                        src={rec.product.imageUrl}
                                        alt={rec.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* 商品信息 */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-primary truncate">{rec.product.name}</div>
                                    <div className="text-sm text-gray-500 font-mono">{rec.product.sku}</div>
                                </div>

                                {/* 价格 */}
                                <div className="text-right">
                                    <div className="font-bold text-primary">¥{rec.product.price.toFixed(2)}</div>
                                </div>

                                {/* 库存状态 */}
                                <div className="w-24">
                                    <Badge variant={statusConfig.variant}>
                                        <StatusIcon size={12} className="mr-1" />
                                        {statusConfig.label}
                                    </Badge>
                                </div>

                                {/* 来源 */}
                                <div className="w-20">
                                    <Badge variant={rec.source === 'global' ? 'neutral' : 'success'}>
                                        {rec.source === 'global' ? (
                                            <><Globe size={12} className="mr-1" /> 全局</>
                                        ) : (
                                            <><Store size={12} className="mr-1" /> 门店</>
                                        )}
                                    </Badge>
                                </div>
                            </div>
                        );
                    })}

                    {finalRecommendations.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            {t('recommendations.preview.empty', '暂无推荐商品')}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
