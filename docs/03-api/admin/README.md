# 🛠️ 管理端API对接文档

> **KK Backend 管理端专用API接口文档** | 维护者: AI Assistant

## 🎯 概述

本文档专为**管理端开发**提供完整的API对接指南。

### 🏗️ 技术架构

- **后端**: NestJS + TypeScript + PostgreSQL + Redis
- **API版本**: v1
- **基础URL**: `http://localhost:3003/api/v1` (开发环境)
- **认证方式**: JWT Bearer Token
- **响应格式**: 标准化JSON响应包装
- **文档地址**: `http://localhost:3003/api/docs` (Swagger UI)

### 📊 功能模块导航

| 模块          | 文档链接                           | 功能描述                 |
| ------------- | ---------------------------------- | ------------------------ |
| 🔐 认证管理   | [当前页面](#-认证管理-api)         | 登录、注册、Token管理    |
| 👥 用户管理   | [users.md](./users.md)             | 用户CRUD、角色管理、统计 |
| 📦 产品管理   | [products.md](./products.md)       | 产品CRUD、搜索、分类     |
| 🏷️ 品牌管理   | [brands.md](./brands.md)           | 品牌CRUD、关联管理       |
| 📚 系列管理   | [collections.md](./collections.md) | 系列CRUD、品牌关联       |
| 🎨 设计师管理 | [designers.md](./designers.md)     | 设计师CRUD、作品集       |
| 📋 订单管理   | [orders.md](./orders.md)           | 订单查看、状态管理       |
| 📊 库存管理   | [inventory.md](./inventory.md)     | 库存监控、调整           |
| 📈 数据分析   | [analytics.md](./analytics.md)     | 仪表板、报表             |

**其他模块 (详见 `docs/07-modules/`):**

- 📧 邮件管理
- 📤 导出管理
- 📁 文件上传
- ⏰ 任务调度
- 📊 监控管理

---

## 🔐 认证管理 API

### 用户登录

**端点**: `POST /auth/login`
**描述**: 使用用户名/邮箱和密码登录系统

**请求体**:

```json
{
  "usernameOrEmail": "admin@example.com",
  "password": "Admin123!"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-string",
      "username": "admin",
      "email": "admin@example.com",
      "fullName": "系统管理员",
      "role": "admin",
      "status": "active",
      "lastLoginAt": "2025-07-18T10:30:00Z"
    }
  }
}
```

### 获取当前用户信息

**端点**: `GET /auth/profile`
**认证**: Bearer Token 必需

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "username": "admin",
    "email": "admin@example.com",
    "fullName": "系统管理员",
    "role": "admin",
    "status": "active",
    "lastLoginAt": "2025-07-18T10:30:00Z"
  }
}
```

### 刷新访问令牌

**端点**: `POST /auth/refresh`
**描述**: 使用刷新令牌获取新的访问令牌

**请求体**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 修改密码

**端点**: `POST /auth/change-password`
**认证**: Bearer Token 必需

**请求体**:

```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

### 用户登出

**端点**: `POST /auth/logout`
**认证**: Bearer Token 必需

**响应**:

```json
{
  "success": true,
  "message": "登出成功"
}
```

### 创建管理员账户

**端点**: `POST /auth/register-admin`
**认证**: Bearer Token 必需 (仅超级管理员)

**请求体**:

```json
{
  "username": "newadmin",
  "email": "newadmin@example.com",
  "password": "NewAdmin123!",
  "confirmPassword": "NewAdmin123!",
  "fullName": "新管理员"
}
```
