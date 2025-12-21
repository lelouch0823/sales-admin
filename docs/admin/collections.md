# 📚 系列管理 API

**基础路径**: `/collections`
**认证要求**: Bearer Token 必需 (ADMIN, MANAGER) - 部分接口公开

## 获取系列列表

**端点**: `GET /collections`
**认证**: Bearer Token 可选

**查询参数**:
- `page`, `limit`, `search`
- `brandId`, `designerId`
- `status`: (active, inactive)
- `sortBy`: (name, createdAt)

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "春季新品系列",
      "brand": { "id": "brand-uuid", "name": "品牌名称" },
      "productCount": 15
    }
  ]
}
```

## 获取活跃系列

**端点**: `GET /collections/active`

## 获取系列统计信息

**端点**: `GET /collections/stats`

**响应**:
```json
{
  "success": true,
  "data": {
    "totalCollections": 50,
    "activeCollections": 42
  }
}
```

## 获取系列详情

**端点**: `GET /collections/{id}`
**路径参数**: `id` (UUID)

## 创建系列

**端点**: `POST /collections`

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

## 更新系列

**端点**: `PATCH /collections/{id}`

## 删除系列

**端点**: `DELETE /collections/{id}`

## 根据品牌/设计师获取系列

**端点**: `GET /collections/by-brand/{brandId}`
**端点**: `GET /collections/by-designer/{designerId}`
