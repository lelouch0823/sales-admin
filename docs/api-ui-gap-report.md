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

## 🔧 技术实现细节

### 1. 数据交互与 Mock 策略

- **数据获取**: 统一使用 `hooks/useApiQuery` (封装各类 React Query) 进行数据请求。
  - 示例: `const { data, isLoading } = useApiQuery('/orders', filterParams);`
- **Mock 数据现状**:
  - 当前 `lib/http.ts` 发起真实网络请求，无内置 Mock。
  - **开发建议**: 若后端不可用，建议在 `lib/api-factory.ts` 临时拦截请求返回 Mock 数据，或引入 MSW (Mock Service Worker)。

### 2. 状态管理规范

- **URL 状态同步**: 筛选条件（如 `page`, `status`, `search`）必须同步到 URL Query 参数，以便分享和刷新。
  - 推荐工具: `react-router-dom` 的 `useSearchParams`。
- **本地状态**: 表单、弹窗显隐使用 `useState` 或 `useReducer`。

### 3. 组件复用指南

请优先使用以下 `components/` 下的封装组件：

- **基础 UI**: `components/ui/` (Button, Input, Select, Badge, Card)
- **交互组件**: `components/primitives/` (Dialog, Sheet/Drawer, Tooltip, Dropdown)
- **布局组件**: `AnimatedBox` (页面容器), `PageHeader` (标准页头)
- **表单验证**: 使用 `hooks/useZodForm` 配合 `zod` schema 定义。

### 4. 路由配置

- 所有新页面需在 `router/routes.ts` 中注册，并使用 `React.lazy` 实现按需加载。
- 权限控制需在 `constants/routes.ts` 中配置 `allowedRoles`。

---

## 📅 实施路线图 (Roadmap)

### Phase 1: 核心业务 UI (High Priority)

1. **Orders (订单模块)**: 开发列表页、详情页及状态流转。
2. **Analytics (数据分析)**: 对接真实 API，替换 `Dashboard` 的 Mock 数据，实现图表组件。

### Phase 2: PIM 模块整合 (Scheme B)

1. 在 `modules/pim/components` 下建立子目录 (`brands`, `collections`, `designers`)。
2. 开发对应的列表、编辑组件。
3. 改造 `PIMView` 引入 Tab 切换结构，统一入口。

### Phase 3: 运营辅助功能 (Low Priority)

1. **Warehouse (仓库)**: 实现仓库树状视图和调货单流程。

---

## 🏗️ 推荐方案：品牌/系列/设计师整合到 PIM

> [!IMPORTANT]
> **推荐将 Brands、Collections、Designers 三个模块作为 PIM 的子模块实现**，而非独立页面。

### 方案对比

| 方案                     | 描述                    | 优点               | 缺点                    |
| ------------------------ | ----------------------- | ------------------ | ----------------------- |
| **A: 保持独立**          | 3 个独立路由入口        | 职责单一           | 路由分散，需 4 个菜单项 |
| **B: 合并到 PIM** ✅     | 作为 PIM 的 Tab 页      | 单一入口，统一管理 | PIMView 变大（可拆分）  |
| **C: 新建 Catalog 模块** | 3 个合并为 1 个独立模块 | 中间方案           | 仍需额外路由            |

### 方案 B 详细设计（推荐）

#### 目录结构

```text
modules/pim/
├── PIMView.tsx                    # 主视图（带 Tab 切换）
├── api.ts                         # 商品 API（现有）
├── types.ts                       # 商品类型（现有）
├── components/
│   ├── products/                  # 商品相关组件（现有）
│   │   ├── ProductRow.tsx
│   │   ├── ProductEditor.tsx
│   │   └── ProductFilters.tsx
│   ├── brands/                    # 品牌 UI 组件（新增）
│   │   ├── BrandList.tsx
│   │   ├── BrandForm.tsx
│   │   └── BrandCard.tsx
│   ├── collections/               # 系列 UI 组件（新增）
│   │   ├── CollectionList.tsx
│   │   ├── CollectionForm.tsx
│   │   └── CollectionFilter.tsx
│   └── designers/                 # 设计师 UI 组件（新增）
│       ├── DesignerList.tsx
│       ├── DesignerProfile.tsx
│       └── PortfolioGallery.tsx
└── submodules/                    # API 层保持独立（复用现有）
    ├── brands/      → 软链接到 modules/brands/
    ├── collections/ → 软链接到 modules/collections/
    └── designers/   → 软链接到 modules/designers/
```

#### UI 实现方式

```tsx
// modules/pim/PIMView.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import { ProductList } from './components/products/ProductList';
import { BrandList } from './components/brands/BrandList';
import { CollectionList } from './components/collections/CollectionList';
import { DesignerList } from './components/designers/DesignerList';

export function PIMView() {
  return (
    <Tabs defaultValue="products">
      <TabsList>
        <TabsTrigger value="products">商品</TabsTrigger>
        <TabsTrigger value="brands">品牌</TabsTrigger>
        <TabsTrigger value="collections">系列</TabsTrigger>
        <TabsTrigger value="designers">设计师</TabsTrigger>
      </TabsList>

      <TabsContent value="products">
        <ProductList />
      </TabsContent>
      <TabsContent value="brands">
        <BrandList />
      </TabsContent>
      <TabsContent value="collections">
        <CollectionList />
      </TabsContent>
      <TabsContent value="designers">
        <DesignerList />
      </TabsContent>
    </Tabs>
  );
}
```

#### 为什么推荐方案 B？

1. **符合 PIM 概念**
   - PIM (Product Information Management) = 产品 + 分类属性
   - 品牌、系列、设计师都是产品的**属性维度**

2. **用户体验更好**
   - 单一入口，减少菜单项
   - 管理员编辑商品时可快速切换查看相关属性

3. **代码复用**
   - 共享筛选、搜索、批量操作等 UI 逻辑
   - API 层保持独立，不影响现有代码

4. **路由简化**
   - 只需 `/pim` 一个路由
   - 通过 URL 参数或 Tab 状态管理子视图：`/pim?tab=brands`

#### 实施步骤

1. **Phase 1**: 在 `modules/pim/components/` 下创建 `brands/`、`collections/`、`designers/` 子目录
2. **Phase 2**: 开发 `BrandList.tsx`、`CollectionList.tsx`、`DesignerList.tsx` 列表组件
3. **Phase 3**: 修改 `PIMView.tsx`，添加 Tabs 组件整合四个子视图
4. **Phase 4**: 开发编辑表单和详情组件
5. **Phase 5**: 移除旧的独立模块目录（可选，或保留作为 API 层）

#### 数据模型增强建议

当前 `Product` 类型中 `brand` 是字符串，建议升级为外键关联：

```diff
// modules/pim/types.ts
export interface Product {
  id: string;
  sku: string;
  name: string;
- brand: string;
+ brandId: string;
+ brand?: { id: string; name: string };
+ collectionId?: string;
+ collection?: { id: string; name: string };
+ designerId?: string;
+ designer?: { id: string; name: string };
  // ...
}
```
