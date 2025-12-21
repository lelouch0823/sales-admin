# 🏷️ 品牌管理 API

**基础路径**: `/brands`
**认证要求**: Bearer Token 必需 (ADMIN, MANAGER) - 部分接口公开

## 获取品牌列表

**端点**: `GET /brands`
**认证**: Bearer Token 可选

**查询参数**:
- `page`, `limit`, `search`
- `country`: 国家筛选
- `sortBy`: (name, foundedYear)

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "品牌名称",
      "country": "意大利",
      "productCount": 125
    }
  ]
}
```

## 创建品牌

**端点**: `POST /brands`

**请求体**:
```json
{
  "name": "新品牌",
  "nameEn": "New Brand",
  "description": "品牌描述",
  "country": "德国",
  "foundedYear": 1980
}
```

## 获取品牌详情

**端点**: `GET /brands/{id}`
**路径参数**: `id` (UUID)

## 更新品牌

**端点**: `PATCH /brands/{id}`

**请求体**:
```json
{
  "description": "更新的品牌描述",
  "websiteUrl": "https://updated-brand.com"
}
```

## 删除品牌

**端点**: `DELETE /brands/{id}`
**权限**: 仅 ADMIN
