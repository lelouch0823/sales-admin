# 📦 产品管理 API

**基础路径**: `/products`
**认证要求**: Bearer Token 必需 (ADMIN, MANAGER) - 部分接口公开

## 🔐 权限说明

| 接口                             | 方法   | 权限要求       |
| -------------------------------- | ------ | -------------- |
| `/products`                      | GET    | 公开           |
| `/products`                      | POST   | ADMIN, MANAGER |
| `/products/{id}`                 | GET    | 公开           |
| `/products/{id}`                 | PATCH  | ADMIN, MANAGER |
| `/products/{id}`                 | DELETE | ADMIN          |
| `/products/stats`                | GET    | ADMIN, MANAGER |
| `/products/batch-status`         | PATCH  | ADMIN, MANAGER |
| `/products/{id}/recommendations` | GET    | 公开           |

---

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
- `stockStatus`: 库存状态筛选
- `isActive`: 是否激活
- `isFeatured`: 是否精选
- `minPrice`, `maxPrice`: 价格范围
- `sortBy`: 排序字段 (name, price, createdAt, stockQuantity)
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

---

## 获取产品详情

**端点**: `GET /products/{id}`
**认证**: Bearer Token 可选 (公开接口)

**路径参数**:

- `id` (UUID): 产品唯一标识

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "sku": "SKU-123456",
    "name": "产品名称",
    "description": "产品详细描述",
    "category": {
      "id": "category-uuid",
      "name": "餐具"
    },
    "brand": {
      "id": "brand-uuid",
      "name": "品牌名称"
    },
    "price": 89.99,
    "costPrice": 45.0,
    "stockQuantity": 100,
    "status": "active",
    "images": ["https://..."],
    "specifications": {},
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

---

## 创建产品

**端点**: `POST /products`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

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

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "new-uuid-string",
    "sku": "SKU-789012",
    "name": "新产品名称",
    "price": 89.99,
    "status": "active",
    "createdAt": "2025-01-01T00:00:00Z"
  },
  "message": "产品创建成功"
}
```

---

## 更新产品

**端点**: `PATCH /products/{id}`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**路径参数**:

- `id` (UUID): 产品唯一标识

**请求体**:

```json
{
  "name": "更新的产品名称",
  "price": 79.99,
  "stockQuantity": 150,
  "status": "active"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "更新的产品名称",
    "price": 79.99,
    "stockQuantity": 150,
    "updatedAt": "2025-01-01T00:00:00Z"
  },
  "message": "产品更新成功"
}
```

---

## 删除产品

**端点**: `DELETE /products/{id}`
**认证**: Bearer Token 必需
**权限**: ADMIN

**路径参数**:

- `id` (UUID): 产品唯一标识

**响应**:

```json
{
  "success": true,
  "message": "产品删除成功"
}
```

---

## 批量更新产品状态

**端点**: `PATCH /products/batch/status`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**请求体**:

```json
{
  "ids": ["uuid-1", "uuid-2"],
  "isActive": false
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "updatedCount": 2,
    "failedCount": 0
  },
  "message": "批量更新成功"
}
```

---

## 获取产品统计

**端点**: `GET /products/stats`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**响应**:

```json
{
  "success": true,
  "data": {
    "totalProducts": 2500,
    "activeProducts": 2200,
    "inactiveProducts": 300,
    "lowStockProducts": 45,
    "outOfStockProducts": 12
  }
}
```

---

## 获取推荐产品

**端点**: `GET /products/{id}/recommendations`
**描述**: 获取与指定产品相关的推荐产品
**认证**: Bearer Token 可选 (公开接口)

**路径参数**:

- `id` (UUID): 产品唯一标识

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
