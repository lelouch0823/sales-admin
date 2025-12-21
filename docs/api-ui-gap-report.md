# 📊 前端 API 与 UI 实现差距审查报告

**生成时间**: 2025-12-21  
**审查范围**: `modules/` 目录下所有业务模块

---

## 📋 概况总览

| 模块                     | API 对接 | UI 组件 | 路由入口 |  实现状态  |
| ------------------------ | :------: | :-----: | :------: | :--------: |
| PIM (商品管理)           |    ✅    |   ✅    |    ✅    |  🟢 完整   |
| Inventory (库存)         |    ✅    |   ✅    |    ✅    |  🟢 完整   |
| CRM (客户)               |    ✅    |   ✅    |    ✅    |  🟢 完整   |
| Recommendations          |    ✅    |   ✅    |    ✅    |  🟢 完整   |
| **Orders (订单)**        |    ✅    |   ❌    |    ❌    | 🔴 缺失 UI |
| **Analytics (数据分析)** |    ✅    |   ❌    |    ❌    | 🔴 缺失 UI |
| **Brands (品牌)**        |    ✅    |   ❌    |    ❌    | 🔴 缺失 UI |
| **Collections (系列)**   |    ✅    |   ❌    |    ❌    | 🔴 缺失 UI |
| **Designers (设计师)**   |    ✅    |   ❌    |    ❌    | 🔴 缺失 UI |
| **Warehouse (仓库)**     |    ✅    |   ❌    |    ❌    | 🔴 缺失 UI |

---

## 🟢 已完整实现的模块

### 1. PIM (商品管理)

- **路径**: `modules/pim/`
- **API 文件**: `api.ts` (1.6KB)
- **UI 组件**: `PIMView.tsx` + 7 个子组件
- **路由**: `pim-list`
- **功能**: 商品列表、编辑、CSV 导入、批量操作

### 2. Inventory (库存管理)

- **路径**: `modules/inventory/`
- **API 文件**: `api.ts` (3.3KB)
- **UI 组件**: `InventoryView.tsx` + 7 个子组件
- **路由**: `inv-explorer`
- **功能**: 库存查询、调整、转移、预警管理

### 3. CRM (客户管理)

- **路径**: `modules/crm/`
- **API 文件**: `api.ts` (0.7KB)
- **UI 组件**: `CustomersView.tsx` + 4 个子组件
- **路由**: `customers`
- **功能**: 客户列表、详情、跟进记录

### 4. Recommendations (推荐系统)

- **路径**: `modules/recommendations/`
- **API 文件**: `api.ts` (0.7KB)
- **UI 组件**: `RecommendationsView.tsx` + 4 个子组件
- **路由**: `recs-global`, `recs-store`, `recs-preview`
- **功能**: 全局推荐、门店推荐、App 预览

---

## 🔴 仅有 API 无 UI 的模块

### 1. Orders (订单管理) - **高优先级**

**当前状态**: 仅完成 API 对接

**已对接的 API 接口**:
| 接口 | 方法 | 说明 |
|------|------|------|
| `/orders` | GET | 订单列表 |
| `/orders` | POST | 创建订单 |
| `/orders/{id}` | GET | 订单详情 |
| `/orders/{id}` | DELETE | 删除订单 |
| `/orders/{id}/status` | PATCH | 更新状态 |
| `/orders/batch-status` | PATCH | 批量更新状态 |
| `/orders/{id}/items` | GET | 订单商品明细 |
| `/orders/{id}/logs` | GET | 操作日志 |
| `/orders/stats` | GET | 订单统计 |

**缺失的 UI 组件**:

- [ ] `OrdersView.tsx` - 订单列表页面
- [ ] `OrderDetail.tsx` - 订单详情面板
- [ ] `OrderStatusBadge.tsx` - 状态徽章组件
- [ ] `OrderTimeline.tsx` - 订单操作日志时间线
- [ ] `OrderStats.tsx` - 订单统计卡片

---

### 2. Analytics (数据分析) - **高优先级**

**当前状态**: 仅完成 API 对接

**已对接的 API 接口**:
| 接口 | 方法 | 说明 |
|------|------|------|
| `/analytics/dashboard` | GET | 仪表板数据 |
| `/analytics/comprehensive` | GET | 综合报告 |
| `/analytics/trends` | GET | 趋势分析 |
| `/analytics/realtime` | GET | 实时数据 |
| `/analytics/metrics` | GET | 关键指标 |
| `/analytics/comparison` | GET | 对比分析 |
| `/analytics/sales` | GET | 销售报表 |

**缺失的 UI 组件**:

- [ ] `AnalyticsView.tsx` - 数据分析主页面
- [ ] `DashboardCharts.tsx` - 仪表板图表组件
- [ ] `TrendsChart.tsx` - 趋势图表
- [ ] `RealtimeMetrics.tsx` - 实时数据展示
- [ ] `ComparisonTable.tsx` - 对比分析表格
- [ ] `SalesReport.tsx` - 销售报表

> [!NOTE]
> 当前 `views/Dashboard.tsx` (2.1KB) 使用的是 mock 数据，未对接 Analytics API。

---

### 3. Brands (品牌管理) - **中优先级**

**当前状态**: 仅完成 API 对接

**已对接的 API 接口**:
| 接口 | 方法 | 说明 |
|------|------|------|
| `/brands` | GET | 品牌列表 |
| `/brands` | POST | 创建品牌 |
| `/brands/{id}` | GET | 品牌详情 |
| `/brands/{id}` | PATCH | 更新品牌 |
| `/brands/{id}` | DELETE | 删除品牌 |
| `/brands/stats` | GET | 品牌统计 |
| `/brands/batch` | DELETE | 批量删除 |

**缺失的 UI 组件**:

- [ ] `BrandsView.tsx` - 品牌列表页面
- [ ] `BrandForm.tsx` - 品牌编辑表单
- [ ] `BrandCard.tsx` - 品牌卡片组件

---

### 4. Collections (系列管理) - **中优先级**

**当前状态**: 仅完成 API 对接

**已对接的 API 接口**:
| 接口 | 方法 | 说明 |
|------|------|------|
| `/collections` | GET | 系列列表 |
| `/collections` | POST | 创建系列 |
| `/collections/{id}` | GET/PATCH/DELETE | 系列 CRUD |
| `/collections/active` | GET | 活跃系列 |
| `/collections/stats` | GET | 系列统计 |
| `/collections/batch-status` | PATCH | 批量更新状态 |
| `/collections/by-brand/{id}` | GET | 按品牌查询 |
| `/collections/by-designer/{id}` | GET | 按设计师查询 |

**缺失的 UI 组件**:

- [ ] `CollectionsView.tsx` - 系列列表页面
- [ ] `CollectionForm.tsx` - 系列编辑表单
- [ ] `CollectionFilter.tsx` - 筛选组件

---

### 5. Designers (设计师管理) - **中优先级**

**当前状态**: 仅完成 API 对接

**已对接的 API 接口**:
| 接口 | 方法 | 说明 |
|------|------|------|
| `/designers` | GET | 设计师列表 |
| `/designers` | POST | 创建设计师 |
| `/designers/{id}` | GET/PATCH/DELETE | 设计师 CRUD |
| `/designers/active` | GET | 活跃设计师 |
| `/designers/stats` | GET | 设计师统计 |
| `/designers/{id}/portfolio` | GET | 作品集 |

**缺失的 UI 组件**:

- [ ] `DesignersView.tsx` - 设计师列表页面
- [ ] `DesignerProfile.tsx` - 设计师详情
- [ ] `PortfolioGallery.tsx` - 作品集展示

---

### 6. Warehouse (仓库管理) - **低优先级**

**当前状态**: 仅完成 API 对接

**已对接的 API 接口**:
| 接口 | 方法 | 说明 |
|------|------|------|
| `/admin/warehouses` | GET/POST | 仓库列表/创建 |
| `/admin/warehouses/{id}` | GET/PATCH/DELETE | 仓库 CRUD |
| `/admin/warehouses/tree` | GET | 仓库层级树 |
| `/admin/warehouses/{id}/transfer-sources` | GET | 可调货源仓库 |
| `/admin/transfer-orders` | GET/POST | 调货单列表/创建 |
| `/admin/transfer-orders/{id}` | GET | 调货单详情 |
| `/admin/transfer-orders/{id}/submit` | POST | 提交审批 |
| `/admin/transfer-orders/{id}/approve` | POST | 审批通过 |
| `/admin/transfer-orders/{id}/ship` | POST | 发货 |
| `/admin/transfer-orders/{id}/receive` | POST | 收货确认 |

**缺失的 UI 组件**:

- [ ] `WarehouseView.tsx` - 仓库管理页面
- [ ] `WarehouseTree.tsx` - 仓库层级树组件
- [ ] `TransferOrderList.tsx` - 调货单列表
- [ ] `TransferOrderForm.tsx` - 调货单表单
- [ ] `TransferOrderDetail.tsx` - 调货单详情
- [ ] `TransferWorkflow.tsx` - 调货流程状态机

---

## 📈 统计汇总

| 指标                | 数量 |
| ------------------- | ---- |
| 已完整实现模块      | 4    |
| 仅 API 无 UI 模块   | 6    |
| 已对接 API 接口总数 | ~50+ |
| 待开发 UI 组件      | ~25+ |

---

## 🎯 建议优先级

1. **🔴 高优先级 (核心业务)**
   - Orders (订单管理) - 核心交易流程
   - Analytics (数据分析) - 经营决策支撑

2. **🟡 中优先级 (产品管理)**
   - Brands (品牌管理) - 可集成到 PIM 模块
   - Collections (系列管理) - 可集成到 PIM 模块
   - Designers (设计师管理) - 可集成到 PIM 模块

3. **🟢 低优先级 (运营辅助)**
   - Warehouse (仓库管理) - 可依赖现有库存模块

---

## 💡 实现建议

1. **复用现有组件库**: 参考 `docs/component-library.md` 中已封装的 UI 组件
2. **参考现有模块结构**: 以 `modules/pim/` 或 `modules/inventory/` 为模板
3. **使用 useApiQuery Hook**: 统一数据请求和状态管理
4. **考虑模块整合**: Brands/Collections/Designers 可作为 PIM 的子模块实现
