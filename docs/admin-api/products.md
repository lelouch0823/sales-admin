# 📦 产品管理 API

**基础路径**: `/products`
**认证要求**: Bearer Token 必需 (ADMIN, MANAGER) - 部分接口公开

## 获取产品列表

**端点**: `GET /products`
**认证**: Bearer Token 可选 (公开接口)

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `search`: 搜索关键词 (名称、描述、SKU)
- `categoryId`: 分类ID筛选
- `brandId`: 品牌ID筛选
- `designerId`: 设计师ID筛选
- `collectionId`: 系列ID筛选
- `status`: 状态筛选 (active, inactive, discontinued)
- `stockStatus`: 库存状态筛选 (available, reserved, out_of_stock, low_stock, discontinued, damaged, expired, in_stock, backorder, pre_order, unknown)
- `isActive`: 是否激活 (true/false)
- `isFeatured`: 是否精选 (true/false)
- `tags`: 标签筛选 (数组)
- `material`: 材质筛选
- `color`: 颜色筛选
- `minPrice`: 最低价格
- `maxPrice`: 最高价格
- `minWeight`: 最小重量
- `maxWeight`: 最大重量
- `createdFrom`: 创建时间起 (YYYY-MM-DD)
- `createdTo`: 创建时间止 (YYYY-MM-DD)
- `sortBy`: 排序字段 (name, price, createdAt, updatedAt, stockQuantity, sortOrder)
- `sortOrder`: 排序方向 (ASC, DESC)

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "sku": "SKU-123456",
      "name": "产品名称",
      "category": "餐具",
      "brand": "品牌名称",
      "price": 89.99,
      "stockQuantity": 100,
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "totalPages": 25
  }
}
```

## 创建产品

**端点**: `POST /products`
**认证**: Bearer Token 必需 (ADMIN, MANAGER)

**请求体**:
```json
{
  "sku": "SKU-789012",
  "name": "新产品名称",
  "category": "餐具",
  "brand": "品牌名称",
  "price": 89.99,
  "stockQuantity": 100,
  "status": "active",
  "description": "产品描述"
}
```

## 获取产品详情

**端点**: `GET /products/{id}`
**路径参数**: `id` (UUID)

## 更新产品

**端点**: `PATCH /products/{id}`
**认证**: Bearer Token 必需 (ADMIN, MANAGER)

**请求体**:
```json
{
  "name": "更新的产品名称",
  "price": 79.99,
  "stockQuantity": 150,
  "status": "active"
}
```

## 删除产品

**端点**: `DELETE /products/{id}`
**权限**: 仅 ADMIN

## 批量更新产品状态

**端点**: `PATCH /products/batch-status`
**请求体**:
```json
{
  "productIds": ["uuid-1", "uuid-2"],
  "status": "inactive"
}
```

## 获取产品统计

**端点**: `GET /products/stats`

**响应**:
```json
{
  "success": true,
  "data": {
    "totalProducts": 2500,
    "activeProducts": 2200,
    "inactiveProducts": 300,
    "lowStockProducts": 45
  }
}
```

## 获取推荐产品

**端点**: `GET /products/{id}/recommendations`
**描述**: 获取与指定产品相关的推荐产品

**路径参数**: `id` (产品UUID)

**查询参数**:
- `limit`: 推荐数量 (默认: 5)

**推荐策略**:
1. 同品牌的其他产品
2. 同分类的产品
3. 相似价格区间的产品

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "sku": "SKU-123456",
      "name": "推荐产品名称",
      "category": "餐具",
      "brand": "品牌名称",
      "price": 89.99,
      "mainImageUrl": "https://...",
      "stockQuantity": 100,
      "status": "active"
    }
  ]
}
```
