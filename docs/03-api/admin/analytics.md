# 📈 数据分析 API

**基础路径**: `/analytics`
**认证要求**: Bearer Token 必需 (ADMIN, MANAGER)

## 获取仪表板数据

**端点**: `GET /analytics/dashboard`

**查询参数**:

- `timeRange`: 时间范围 (TODAY, YESTERDAY, LAST_7_DAYS, LAST_30_DAYS, LAST_90_DAYS, THIS_MONTH, LAST_MONTH, THIS_YEAR, LAST_YEAR, CUSTOM)
- `startDate`: 自定义开始日期 (当 timeRange 为 CUSTOM 时必需)
- `endDate`: 自定义结束日期 (当 timeRange 为 CUSTOM 时必需)

**响应**:

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalRevenue": 299999.5,
      "totalOrders": 800,
      "totalCustomers": 1000,
      "totalProducts": 500,
      "revenueGrowth": 15.8,
      "orderGrowth": 12.5,
      "customerGrowth": 8.9,
      "conversionRate": 3.2,
      "averageOrderValue": 375.0,
      "customerLifetimeValue": 1200.0
    },
    "recentOrders": [],
    "topProducts": [],
    "alerts": [],
    "charts": {
      "salesTrend": [],
      "userGrowth": [],
      "topCategories": [],
      "revenueByChannel": [],
      "inventoryStatus": {},
      "customerSegments": []
    }
  }
}
```

## 获取综合分析报告

**端点**: `GET /analytics/comprehensive`

**响应**:

```json
{
  "success": true,
  "data": {
    "sales": {},
    "users": {},
    "products": {},
    "summary": {
      "totalRevenue": 299999.5,
      "totalOrders": 800,
      "totalCustomers": 1000,
      "totalProducts": 500,
      "averageOrderValue": 375.0,
      "customerRetentionRate": 0.65,
      "conversionRate": 3.2,
      "topSellingProduct": "产品名称"
    },
    "insights": ["洞察1", "洞察2"],
    "generatedAt": "2025-01-01T00:00:00Z"
  }
}
```

## 获取趋势分析

**端点**: `GET /analytics/trends`

**响应**:

```json
{
  "success": true,
  "data": {
    "salesTrend": [],
    "userGrowthTrend": [],
    "productPerformanceTrend": [],
    "seasonalPatterns": {
      "hasSeasonality": true,
      "pattern": "increasing",
      "averageRevenue": 10000,
      "recentAverageRevenue": 12000
    },
    "predictions": {
      "available": true,
      "nextDayRevenue": 15000,
      "nextDayOrders": 50,
      "confidence": 0.7,
      "method": "moving_average"
    },
    "analysisDate": "2025-01-01T00:00:00Z"
  }
}
```

## 获取实时数据

**端点**: `GET /analytics/realtime`

**响应**:

```json
{
  "success": true,
  "data": {
    "onlineUsers": 150,
    "todayRevenue": 25000.0,
    "todayOrders": 80,
    "todayNewUsers": 25,
    "averageOrderValue": 312.5,
    "conversionRate": 3.5,
    "recentActivities": [],
    "liveOrders": [],
    "lastUpdated": "2025-01-01T12:00:00Z"
  }
}
```

## 获取关键指标

**端点**: `GET /analytics/metrics`

**响应**:

```json
{
  "success": true,
  "data": {
    "revenue": {
      "total": 299999.5,
      "growth": 15.8,
      "target": 360000,
      "achievement": 83.3
    },
    "orders": {
      "total": 800,
      "growth": 12.5,
      "averageValue": 375.0,
      "conversionRate": 3.2
    },
    "customers": {
      "total": 1000,
      "new": 150,
      "returning": 850,
      "retentionRate": 0.65
    },
    "products": {
      "total": 500,
      "active": 450,
      "topPerformer": {},
      "lowPerformer": {}
    },
    "generatedAt": "2025-01-01T00:00:00Z"
  }
}
```

## 获取对比分析

**端点**: `GET /analytics/comparison`
**描述**: 将当前时间范围与指定对比时间范围进行对比分析

**查询参数**:

- `timeRange`: 当前时间范围
- `compareWith`: 对比时间范围 (必需)

**响应**:

```json
{
  "success": true,
  "data": {
    "current": {
      "sales": {},
      "users": {},
      "products": {},
      "summary": {}
    },
    "comparison": {
      "sales": {},
      "users": {},
      "products": {},
      "summary": {}
    },
    "changes": {
      "revenue": 15.5,
      "orders": 12.3,
      "customers": 8.7,
      "averageOrderValue": 3.2
    },
    "insights": ["收入增长显著，较对比期增长 15.5%", "订单量大幅增加，增长 12.3%"],
    "period": {
      "current": "LAST_30_DAYS",
      "comparison": "LAST_MONTH"
    },
    "generatedAt": "2025-01-01T00:00:00Z"
  }
}
```

## 获取销售报表

**端点**: `GET /analytics/sales`

**查询参数**:

- `period`: (daily, weekly, monthly, yearly)
- `dateFrom`, `dateTo`
- `groupBy`

**响应**:

```json
{
  "success": true,
  "data": {
    "summary": { "totalSales": 299999.5 },
    "salesData": [],
    "topPerformers": {}
  }
}
```
