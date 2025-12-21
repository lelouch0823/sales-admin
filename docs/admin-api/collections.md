# 📚 系列管理 API

**基础路径**: `/collections`
**认证要求**: Bearer Token 必需 (ADMIN, MANAGER) - 部分接口公开

## 🔐 权限说明

| 接口                        | 方法   | 权限要求       |
| --------------------------- | ------ | -------------- |
| `/collections`              | GET    | 公开           |
| `/collections`              | POST   | ADMIN, MANAGER |
| `/collections/active`       | GET    | 公开           |
| `/collections/stats`        | GET    | ADMIN, MANAGER |
| `/collections/{id}`         | GET    | 公开           |
| `/collections/{id}`         | PATCH  | ADMIN, MANAGER |
| `/collections/{id}`         | DELETE | ADMIN          |
| `/collections/batch-status` | PATCH  | ADMIN, MANAGER |

---

## 获取系列列表

**端点**: `GET /collections`
**认证**: Bearer Token 可选 (公开接口)

**查询参数**:

- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `search`: 搜索关键词
- `brandId`: 品牌ID筛选
- `designerId`: 设计师ID筛选
- `status`: 状态筛选 (active, inactive)
- `sortBy`: 排序字段 (name, createdAt)
- `sortOrder`: 排序方向 (ASC, DESC)

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "春季新品系列",
      "brand": { "id": "brand-uuid", "name": "品牌名称" },
      "designer": { "id": "designer-uuid", "name": "设计师名" },
      "productCount": 15,
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

## 获取活跃系列

**端点**: `GET /collections/active`
**认证**: Bearer Token 可选 (公开接口)

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "春季新品系列",
      "productCount": 15
    }
  ]
}
```

---

## 获取系列统计信息

**端点**: `GET /collections/stats`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**响应**:

```json
{
  "success": true,
  "data": {
    "totalCollections": 50,
    "activeCollections": 42,
    "inactiveCollections": 8
  }
}
```

---

## 获取系列详情

**端点**: `GET /collections/{id}`
**认证**: Bearer Token 可选 (公开接口)

**路径参数**:

- `id` (UUID): 系列唯一标识

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "春季新品系列",
    "description": "系列描述",
    "brand": { "id": "brand-uuid", "name": "品牌名称" },
    "designer": { "id": "designer-uuid", "name": "设计师名" },
    "productCount": 15,
    "status": "active",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

---

## 创建系列

**端点**: `POST /collections`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**请求体**:

```json
{
  "name": "夏季新品系列",
  "description": "系列描述",
  "brandId": "brand-uuid",
  "designerId": "designer-uuid",
  "status": "active"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "name": "夏季新品系列",
    "status": "active",
    "createdAt": "2025-01-01T00:00:00Z"
  },
  "message": "系列创建成功"
}
```

---

## 更新系列

**端点**: `PATCH /collections/{id}`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**路径参数**:

- `id` (UUID): 系列唯一标识

**请求体**:

```json
{
  "name": "更新的系列名称",
  "description": "更新的描述",
  "status": "inactive"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "更新的系列名称",
    "status": "inactive",
    "updatedAt": "2025-01-01T00:00:00Z"
  },
  "message": "系列更新成功"
}
```

---

## 删除系列

**端点**: `DELETE /collections/{id}`
**认证**: Bearer Token 必需
**权限**: ADMIN

**路径参数**:

- `id` (UUID): 系列唯一标识

**响应**:

```json
{
  "success": true,
  "message": "系列删除成功"
}
```

---

## 批量更新系列状态

**端点**: `PATCH /collections/batch-status`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**请求体**:

```json
{
  "collectionIds": ["uuid-1", "uuid-2"],
  "status": "inactive"
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

## 根据品牌/设计师获取系列

**端点**: `GET /collections/by-brand/{brandId}`
**端点**: `GET /collections/by-designer/{designerId}`
**认证**: Bearer Token 可选 (公开接口)

**路径参数**:

- `brandId` 或 `designerId` (UUID)

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "系列名称",
      "productCount": 15
    }
  ]
}
```
