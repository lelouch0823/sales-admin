# 🏷️ 品牌管理 API

**基础路径**: `/brands`
**认证要求**: Bearer Token 必需 (ADMIN, MANAGER) - 部分接口公开

## 🔐 权限说明

| 接口            | 方法   | 权限要求       |
| --------------- | ------ | -------------- |
| `/brands`       | GET    | 公开           |
| `/brands`       | POST   | ADMIN, MANAGER |
| `/brands/{id}`  | GET    | 公开           |
| `/brands/{id}`  | PATCH  | ADMIN, MANAGER |
| `/brands/{id}`  | DELETE | ADMIN          |
| `/brands/stats` | GET    | ADMIN, MANAGER |
| `/brands/batch` | DELETE | ADMIN          |

---

## 获取品牌列表

**端点**: `GET /brands`
**认证**: Bearer Token 可选 (公开接口)

**查询参数**:

- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `search`: 搜索关键词
- `country`: 国家筛选
- `isActive`: 是否激活
- `sortBy`: 排序字段 (name, foundedYear, createdAt)
- `sortOrder`: 排序方向 (ASC, DESC)

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "品牌名称",
      "nameEn": "Brand Name",
      "country": "意大利",
      "logoUrl": "https://...",
      "productCount": 125,
      "isActive": true
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

## 获取品牌详情

**端点**: `GET /brands/{id}`
**认证**: Bearer Token 可选 (公开接口)

**路径参数**:

- `id` (UUID): 品牌唯一标识

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "品牌名称",
    "nameEn": "Brand Name",
    "description": "品牌描述",
    "descriptionEn": "Brand description",
    "country": "意大利",
    "foundedYear": 1980,
    "logoUrl": "https://...",
    "websiteUrl": "https://brand.com",
    "productCount": 125,
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

---

## 创建品牌

**端点**: `POST /brands`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**请求体**:

```json
{
  "name": "新品牌",
  "nameEn": "New Brand",
  "description": "品牌描述",
  "descriptionEn": "Brand description",
  "country": "德国",
  "foundedYear": 1980,
  "logoUrl": "https://...",
  "websiteUrl": "https://brand.com"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "name": "新品牌",
    "nameEn": "New Brand",
    "country": "德国",
    "createdAt": "2025-01-01T00:00:00Z"
  },
  "message": "品牌创建成功"
}
```

---

## 更新品牌

**端点**: `PATCH /brands/{id}`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**路径参数**:

- `id` (UUID): 品牌唯一标识

**请求体**:

```json
{
  "description": "更新的品牌描述",
  "websiteUrl": "https://updated-brand.com"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "品牌名称",
    "description": "更新的品牌描述",
    "websiteUrl": "https://updated-brand.com",
    "updatedAt": "2025-01-01T00:00:00Z"
  },
  "message": "品牌更新成功"
}
```

---

## 删除品牌

**端点**: `DELETE /brands/{id}`
**认证**: Bearer Token 必需
**权限**: ADMIN

**路径参数**:

- `id` (UUID): 品牌唯一标识

**响应**:

```json
{
  "success": true,
  "message": "品牌删除成功"
}
```

---

## 获取品牌统计

**端点**: `GET /brands/stats`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**响应**:

```json
{
  "success": true,
  "data": {
    "totalBrands": 50,
    "activeBrands": 45,
    "inactiveBrands": 5,
    "byCountry": [
      {
        "country": "意大利",
        "count": 15
      },
      {
        "country": "德国",
        "count": 12
      },
      {
        "country": "法国",
        "count": 10
      }
    ],
    "topBrands": [
      {
        "id": "uuid",
        "name": "品牌名称",
        "productCount": 125
      }
    ]
  }
}
```

---

## 批量删除品牌

**端点**: `DELETE /brands/batch`
**认证**: Bearer Token 必需
**权限**: ADMIN

**请求体**:

```json
{
  "brandIds": ["uuid-1", "uuid-2", "uuid-3"]
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "deletedCount": 3,
    "failedCount": 0
  },
  "message": "批量删除成功"
}
```
