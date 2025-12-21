import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

// 图表颜色主题
export const chartColors = {
  primary: '#1f2937',
  brand: '#3b82f6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  muted: '#9ca3af',
  // 调色板用于多数据系列
  palette: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'],
};

// 通用 Tooltip 样式
const tooltipStyle = {
  contentStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  labelStyle: { color: '#374151', fontWeight: 600 },
};

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface BaseChartProps {
  data: ChartDataPoint[];
  height?: number;
}

/**
 * 面积图 (AreaChart)
 * 适用于展示趋势数据
 */
interface AreaChartProps extends BaseChartProps {
  dataKey?: string;
  color?: string;
  gradient?: boolean;
}

export const SimpleAreaChart: React.FC<AreaChartProps> = ({
  data,
  height = 300,
  dataKey = 'value',
  color = chartColors.brand,
  gradient = true,
}) => {
  const gradientId = `gradient-${dataKey}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        {gradient && (
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
        )}
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} />
        <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
        <Tooltip {...tooltipStyle} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill={gradient ? `url(#${gradientId})` : color}
          fillOpacity={gradient ? 1 : 0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

/**
 * 柱状图 (BarChart)
 * 适用于比较数据
 */
interface BarChartProps extends BaseChartProps {
  dataKey?: string;
  color?: string;
  horizontal?: boolean;
}

export const SimpleBarChart: React.FC<BarChartProps> = ({
  data,
  height = 300,
  dataKey = 'value',
  color = chartColors.brand,
  horizontal = false,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        {horizontal ? (
          <>
            <XAxis type="number" tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#9ca3af' }} />
          </>
        ) : (
          <>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
          </>
        )}
        <Tooltip {...tooltipStyle} />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

/**
 * 饼图 (PieChart)
 * 适用于占比数据
 */
interface PieChartProps extends BaseChartProps {
  innerRadius?: number;
  outerRadius?: number;
  showLabel?: boolean;
}

export const SimplePieChart: React.FC<PieChartProps> = ({
  data,
  height = 300,
  innerRadius = 60,
  outerRadius = 100,
  showLabel = true,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey="value"
          label={
            showLabel
              ? ({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              : undefined
          }
          labelLine={showLabel}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={chartColors.palette[index % chartColors.palette.length]}
            />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

/**
 * 折线图 (LineChart)
 * 适用于多系列趋势对比
 */
interface LineChartProps extends BaseChartProps {
  lines: Array<{
    dataKey: string;
    color: string;
    name?: string;
  }>;
}

export const SimpleLineChart: React.FC<LineChartProps> = ({ data, height = 300, lines }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} />
        <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
        <Tooltip {...tooltipStyle} />
        <Legend />
        {lines.map(line => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name || line.dataKey}
            stroke={line.color}
            strokeWidth={2}
            dot={{ fill: line.color, strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

// 导出 recharts 组件供直接使用
export {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
};
