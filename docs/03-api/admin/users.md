# 👥 用户管理 API

**基础路径**: `/users`
**认证要求**: Bearer Token 必需

## 🔐 权限说明

| 接口           | 方法   | 权限要求       |
| -------------- | ------ | -------------- |
| `/users`       | GET    | ADMIN, MANAGER |
| `/users`       | POST   | ADMIN, MANAGER |
| `/users/{id}`  | GET    | ADMIN, MANAGER |
| `/users/{id}`  | PATCH  | ADMIN, MANAGER |
| `/users/{id}`  | DELETE | ADMIN          |
| `/users/stats` | GET    | ADMIN, MANAGER |

---

## 获取用户列表

**端点**: `GET /users`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**查询参数**:

- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `search`: 搜索关键词
- `role`: 角色筛选 (admin, manager, user, moderator, guest, super_admin)
- `status`: 状态筛选 (active, inactive, suspended, pending, banned, deleted)
- `sortBy`: 排序字段 (createdAt, username, email)
- `sortOrder`: 排序方向 (ASC, DESC, 默认: DESC)

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "username": "admin",
      "email": "admin@example.com",
      "fullName": "系统管理员",
      "role": "admin",
      "status": "active",
      "lastLoginAt": "2025-07-18T10:30:00Z",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## 创建用户

**端点**: `POST /users`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**请求体**:

```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "Password123!",
  "fullName": "新用户",
  "role": "user",
  "status": "active"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "new-uuid-string",
    "username": "newuser",
    "email": "newuser@example.com",
    "fullName": "新用户",
    "role": "user",
    "status": "active",
    "createdAt": "2025-01-01T00:00:00Z"
  },
  "message": "用户创建成功"
}
```

---

## 获取用户详情

**端点**: `GET /users/{id}`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**路径参数**:

- `id` (UUID): 用户唯一标识

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "username": "user123",
    "email": "user123@example.com",
    "fullName": "用户姓名",
    "role": "user",
    "status": "active",
    "lastLoginAt": "2025-01-01T10:00:00Z",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

---

## 更新用户

**端点**: `PATCH /users/{id}`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**路径参数**:

- `id` (UUID): 用户唯一标识

**请求体**:

```json
{
  "fullName": "更新的姓名",
  "role": "manager",
  "status": "active"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "username": "user123",
    "fullName": "更新的姓名",
    "role": "manager",
    "status": "active",
    "updatedAt": "2025-01-01T00:00:00Z"
  },
  "message": "用户更新成功"
}
```

---

## 删除用户

**端点**: `DELETE /users/{id}`
**认证**: Bearer Token 必需
**权限**: ADMIN

**路径参数**:

- `id` (UUID): 用户唯一标识

**响应**:

```json
{
  "success": true,
  "message": "用户删除成功"
}
```

---

## 获取用户统计

**端点**: `GET /users/stats`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**响应**:

```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "activeUsers": 1100,
    "inactiveUsers": 150,
    "adminUsers": 5,
    "managerUsers": 15,
    "regularUsers": 1230,
    "userGrowthRate": 3.6,
    "byRole": {
      "admin": 5,
      "manager": 15,
      "user": 1200,
      "moderator": 20,
      "guest": 10
    }
  }
}
```
