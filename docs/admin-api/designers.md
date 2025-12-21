# 🎨 设计师管理 API

**基础路径**: `/designers`
**认证要求**: Bearer Token 必需 (ADMIN, MANAGER) - 部分接口公开

## 🔐 权限说明

| 接口                        | 方法   | 权限要求       |
| --------------------------- | ------ | -------------- |
| `/designers`                | GET    | 公开           |
| `/designers`                | POST   | ADMIN, MANAGER |
| `/designers/active`         | GET    | 公开           |
| `/designers/stats`          | GET    | ADMIN, MANAGER |
| `/designers/{id}`           | GET    | 公开           |
| `/designers/{id}`           | PATCH  | ADMIN, MANAGER |
| `/designers/{id}`           | DELETE | ADMIN          |
| `/designers/{id}/portfolio` | GET    | 公开           |

---

## 获取设计师列表

**端点**: `GET /designers`
**认证**: Bearer Token 可选 (公开接口)

**查询参数**:

- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `search`: 搜索关键词
- `status`: 状态筛选
- `level`: 级别筛选 (junior, mid, senior, lead)
- `sortBy`: 排序字段
- `sortOrder`: 排序方向 (ASC, DESC)

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "张设计师",
      "level": "senior",
      "totalProjects": 25,
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 30,
    "totalPages": 2
  }
}
```

---

## 获取活跃设计师

**端点**: `GET /designers/active`
**认证**: Bearer Token 可选 (公开接口)

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "张设计师",
      "level": "senior"
    }
  ]
}
```

---

## 获取设计师统计信息

**端点**: `GET /designers/stats`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**响应**:

```json
{
  "success": true,
  "data": {
    "totalDesigners": 30,
    "activeDesigners": 25,
    "byLevel": {
      "junior": 5,
      "mid": 10,
      "senior": 12,
      "lead": 3
    }
  }
}
```

---

## 获取设计师详情

**端点**: `GET /designers/{id}`
**认证**: Bearer Token 可选 (公开接口)

**路径参数**:

- `id` (UUID): 设计师唯一标识

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "张设计师",
    "email": "zhang.designer@example.com",
    "bio": "设计师简介",
    "level": "senior",
    "skills": ["产品设计", "工业设计"],
    "totalProjects": 25,
    "status": "active",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

## 获取设计师作品集

**端点**: `GET /designers/{id}/portfolio`
**认证**: Bearer Token 可选 (公开接口)

**路径参数**:

- `id` (UUID): 设计师唯一标识

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "project-uuid",
      "name": "项目名称",
      "description": "项目描述",
      "imageUrl": "https://...",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

## 创建设计师

**端点**: `POST /designers`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

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

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "name": "李设计师",
    "level": "mid",
    "createdAt": "2025-01-01T00:00:00Z"
  },
  "message": "设计师创建成功"
}
```

---

## 更新设计师

**端点**: `PATCH /designers/{id}`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**路径参数**:

- `id` (UUID): 设计师唯一标识

**请求体**:

```json
{
  "bio": "更新的简介",
  "level": "senior",
  "skills": ["产品设计", "UI设计"]
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "李设计师",
    "level": "senior",
    "updatedAt": "2025-01-01T00:00:00Z"
  },
  "message": "设计师更新成功"
}
```

---

## 删除设计师

**端点**: `DELETE /designers/{id}`
**认证**: Bearer Token 必需
**权限**: ADMIN

**路径参数**:

- `id` (UUID): 设计师唯一标识

**响应**:

```json
{
  "success": true,
  "message": "设计师删除成功"
}
```
