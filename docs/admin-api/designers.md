# 🎨 设计师管理 API

**基础路径**: `/designers`
**认证要求**: Bearer Token 必需 (ADMIN, MANAGER) - 部分接口公开

## 获取设计师列表

**端点**: `GET /designers`
**认证**: Bearer Token 可选

**查询参数**:
- `page`, `limit`, `search`
- `status`, `level`
- `sortBy`

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "张设计师",
      "level": "senior",
      "totalProjects": 25
    }
  ]
}
```

## 获取活跃设计师

**端点**: `GET /designers/active`

## 获取设计师统计信息

**端点**: `GET /designers/stats`

## 获取设计师详情

**端点**: `GET /designers/{id}`

## 获取设计师作品集

**端点**: `GET /designers/{id}/portfolio`

## 创建设计师

**端点**: `POST /designers`

**请求体**:
```json
{
  "name": "李设计师",
  "email": "li.designer@example.com",
  "bio": "设计师简介",
  "level": "mid",
  "skills": ["产品设计"]
}
```

## 更新设计师

**端点**: `PATCH /designers/{id}`

## 删除设计师

**端点**: `DELETE /designers/{id}`
