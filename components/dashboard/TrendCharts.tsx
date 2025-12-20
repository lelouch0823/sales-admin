import React from 'react';
import { Card } from '../common/Card';
import { SimpleAreaChart, SimpleBarChart } from '../charts';
import { useTranslation } from 'react-i18next';

/**
 * 趋势图表组件
 * 
 * 使用封装:
 * - SimpleAreaChart: Recharts 封装的面积图
 * - SimpleBarChart: Recharts 封装的柱状图
 */

// Mock 数据 - 模拟过去 7 天的销售数据
const salesData = [
    { name: '周一', value: 4200 },
    { name: '周二', value: 3800 },
    { name: '周三', value: 5100 },
    { name: '周四', value: 4600 },
    { name: '周五', value: 6200 },
    { name: '周六', value: 7800 },
    { name: '周日', value: 5400 },
];

// Mock 数据 - 模拟各渠道销售占比
const channelData = [
    { name: '线下门店', value: 42 },
    { name: '线上商城', value: 28 },
    { name: '分销渠道', value: 18 },
    { name: '企业客户', value: 12 },
];

interface TrendChartsProps {
    className?: string;
}

export const TrendCharts: React.FC<TrendChartsProps> = ({ className }) => {
    const { t } = useTranslation();

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className || ''}`}>
            {/* 销售趋势图 */}
            <Card>
                <div className="mb-4">
                    <h3 className="font-bold text-lg text-primary">{t('dashboard.charts.sales_trend')}</h3>
                    <p className="text-sm text-muted">{t('dashboard.charts.last_7_days')}</p>
                </div>
                <SimpleAreaChart
                    data={salesData}
                    height={220}
                    color="#3b82f6"
                    gradient
                />
            </Card>

            {/* 渠道分布图 */}
            <Card>
                <div className="mb-4">
                    <h3 className="font-bold text-lg text-primary">{t('dashboard.charts.channel_dist')}</h3>
                    <p className="text-sm text-muted">{t('dashboard.charts.by_channel')}</p>
                </div>
                <SimpleBarChart
                    data={channelData}
                    height={220}
                    color="#22c55e"
                    horizontal
                />
            </Card>
        </div>
    );
};
