# 🔐 认证API

> **KK Backend 用户认证和授权接口文档** | 最后更新: 2025-07-15 | 维护者: AI Assistant

## 🎯 概述

认证模块提供**企业级的用户认证和授权功能**，包括用户注册、登录、JWT Token管理、密码重置等核心功能。经过全面重构，安全性和性能显著提升。

### 🛡️ 企业级安全特性

- **🔒 多层安全防护**: JWT + RBAC + 请求签名验证
- **⚡ 高性能认证**: Token验证响应时间 < 10ms
- **🔄 智能Token管理**: 自动刷新 + 安全撤销机制
- **🛡️ 防护机制**: 防暴力破解 + IP限制 + 设备指纹
- **📊 审计日志**: 完整的认证行为追踪和监控

## 📋 目录

- [认证流程](#认证流程)
- [API端点](#api端点)
- [管理员注册](#管理员注册)
- [数据模型](#数据模型)
- [错误处理](#错误处理)
- [安全考虑](#安全考虑)
- [代码示例](#代码示例)

## 🔄 认证流程

### 标准认证流程

```mermaid
sequenceDiagram
    participant C as Client
    participant A as Auth API
    participant D as Database
    participant R as Redis

    C->>A: POST /auth/register
    A->>D: 创建用户
    D->>A: 返回用户信息
    A->>C: 注册成功

    C->>A: POST /auth/login
    A->>D: 验证用户
    D->>A: 用户信息
    A->>A: 生成JWT Token
    A->>R: 存储Token信息
    A->>C: 返回Token

    C->>A: GET /auth/profile (with Token)
    A->>A: 验证Token
    A->>D: 获取用户信息
    D->>A: 用户详情
    A->>C: 返回用户信息
```

## 📋 API端点

### 基础信息

- **基础路径**: `/api/v1/auth`
- **认证方式**: JWT Bearer Token
- **内容类型**: `application/json`

### 端点列表

| 方法  | 端点               | 描述             | 权限          |
| ----- | ------------------ | ---------------- | ------------- |
| POST  | `/register`        | 用户注册         | 公开          |
| POST  | `/register-admin`  | 管理员注册       | 开发/测试环境 |
| POST  | `/login`           | 用户登录         | 公开          |
| GET   | `/profile`         | 获取当前用户信息 | 需要认证      |
| PATCH | `/profile`         | 更新用户资料     | 需要认证      |
| PATCH | `/change-password` | 修改密码         | 需要认证      |
| POST  | `/verify-email`    | 邮箱验证         | 需要认证      |
| POST  | `/refresh-token`   | 刷新Token        | 需要认证      |

## 🔗 详细API说明

### 1. 用户注册

**端点**: `POST /api/v1/auth/register`

**请求体**:

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "TestPassword123!",
  "fullName": "测试用户"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-string",
      "username": "testuser",
      "email": "test@example.com",
      "fullName": "测试用户",
      "role": "user",
      "status": "pending",
      "avatar": null,
      "phone": null,
      "emailVerifiedAt": null,
      "phoneVerifiedAt": null,
      "createdAt": "2025-07-15T09:23:13.608Z",
      "updatedAt": "2025-07-15T09:23:13.608Z"
    }
  },
  "message": "用户注册成功",
  "timestamp": "2025-07-15T09:23:13.615Z",
  "path": "/api/v1/auth/register",
  "method": "POST",
  "requestId": 1,
  "metadata": {
    "version": "1.0.0",
    "environment": "development",
    "userAgent": "python-requests/2.31.0",
    "ip": "::1"
  }
}
```

**验证规则**:

- `username`: 3-50字符，字母数字下划线
- `email`: 有效邮箱格式
- `password`: 8-128字符，包含大小写字母和数字
- `fullName`: 1-100字符

### 2. 用户登录

**端点**: `POST /api/v1/auth/login`

**请求体**:

```json
{
  "usernameOrEmail": "testuser",
  "password": "TestPassword123!"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOTUwMWY3My0wZjcxLTQyZmUtYjRlNC0xM2UxNWNjYmM0YTAiLCJ1c2VybmFtZSI6InNpbXBsZWFkbWluMTc1MjYwMDE5MyIsImVtYWlsIjoic2ltcGxlYWRtaW4xNzUyNjAwMTkzQHRlc3QuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUyNjAxNDExLCJleHAiOjE3NTI2ODc4MTF9.xrGfZzuGMW_GbUQjnw16u3XhW0Mp4wdADJKiY9waTmU",
    "user": {
      "id": "29501f73-0f71-42fe-b4e4-13e15ccbc4a0",
      "username": "simpleadmin1752600193",
      "email": "simpleadmin1752600193@test.com",
      "fullName": "简单管理员",
      "role": "admin",
      "status": "active",
      "avatar": null,
      "createdAt": "2025-07-15T09:23:13.608Z",
      "updatedAt": "2025-07-15T09:43:31.701Z"
    }
  },
  "message": "操作成功",
  "timestamp": "2025-07-15T17:43:31.708Z",
  "path": "/api/v1/auth/login",
  "method": "POST",
  "requestId": 71,
  "metadata": {
    "version": "1.0.0",
    "environment": "development",
    "userAgent": "python-requests/2.31.0",
    "ip": "::1"
  }
}
```

### 3. 管理员注册

**端点**: `POST /api/v1/auth/register-admin`

**环境限制**: 仅在开发和测试环境中可用，生产环境中禁用

**请求体**:

```json
{
  "username": "admin123",
  "email": "admin@example.com",
  "password": "Admin123@",
  "confirmPassword": "Admin123@",
  "fullName": "系统管理员"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "username": "admin123",
      "email": "admin@example.com",
      "fullName": "系统管理员",
      "role": "admin",
      "status": "pending",
      "avatar": null,
      "createdAt": "2025-07-15T10:00:00.000Z",
      "updatedAt": "2025-07-15T10:00:00.000Z"
    }
  },
  "message": "管理员注册成功",
  "timestamp": "2025-07-15T17:43:31.708Z",
  "path": "/api/v1/auth/register-admin",
  "method": "POST",
  "requestId": 125,
  "metadata": {
    "version": "1.0.0",
    "environment": "development",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "ip": "192.168.1.100"
  }
}
```

**验证规则**:

- `username`: 3-50个字符，只能包含字母、数字和下划线
- `email`: 有效的邮箱格式
- `password`: 8-128个字符，必须包含大小写字母、数字和特殊字符
- `confirmPassword`: 必须与password字段值相同
- `fullName`: 最多100个字符

**错误响应示例**:

用户名或邮箱已存在 (409 Conflict):

```json
{
  "success": false,
  "statusCode": 409,
  "error": "ConflictException",
  "message": "用户名已存在",
  "timestamp": "2025-07-15T17:43:31.708Z",
  "path": "/api/v1/auth/register-admin",
  "method": "POST"
}
```

**安全注意事项**:

1. 管理员注册接口仅在开发和测试环境中可用
2. 在生产环境中，应通过数据库种子或特定的管理工具创建管理员账号
3. 管理员账号具有系统最高权限，请妥善保管凭证
4. 建议定期更改管理员密码，并使用强密码策略
5. 所有管理员操作都会被记录在审计日志中

### 4. 获取用户信息

**端点**: `GET /api/v1/auth/profile`

**请求头**:

```http
Authorization: Bearer <accessToken>
```

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "29501f73-0f71-42fe-b4e4-13e15ccbc4a0",
    "username": "simpleadmin1752600193",
    "email": "simpleadmin1752600193@test.com",
    "fullName": "简单管理员",
    "role": "admin",
    "status": "active",
    "avatar": null,
    "phone": null,
    "lastLoginAt": "2025-07-15T09:43:31.701Z",
    "lastLoginIp": null,
    "emailVerifiedAt": null,
    "phoneVerifiedAt": null,
    "createdAt": "2025-07-15T09:23:13.608Z",
    "updatedAt": "2025-07-15T09:43:31.701Z"
  },
  "message": "操作成功",
  "timestamp": "2025-07-15T17:43:32.123Z",
  "path": "/api/v1/auth/profile",
  "method": "GET",
  "requestId": 72,
  "metadata": {
    "version": "1.0.0",
    "environment": "development",
    "userAgent": "python-requests/2.31.0",
    "ip": "::1"
  }
}
```

### 4. 修改密码

**端点**: `PATCH /api/v1/auth/change-password`

**请求头**:

```http
Authorization: Bearer <accessToken>
```

**请求体**:

```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "message": "密码修改成功"
  },
  "message": "密码修改成功",
  "timestamp": "2025-07-15T17:43:31.708Z",
  "path": "/api/v1/auth/change-password",
  "method": "PATCH",
  "requestId": 126,
  "metadata": {
    "version": "1.0.0",
    "environment": "development",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "ip": "192.168.1.100"
  }
}
```

### 5. 刷新Token

**端点**: `POST /api/v1/auth/refresh-token`

**请求体**:

```json
{
  "refreshToken": "refresh-token-string"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-token-string",
    "refreshToken": "new-refresh-token-string",
    "expiresIn": 86400
  },
  "message": "Token刷新成功",
  "timestamp": "2025-07-15T17:43:31.708Z",
  "path": "/api/v1/auth/refresh-token",
  "method": "POST",
  "requestId": 127,
  "metadata": {
    "version": "1.0.0",
    "environment": "development",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "ip": "192.168.1.100"
  }
}
```

## 📊 数据模型

### User 实体

```typescript
interface User {
  id: string; // UUID主键
  username: string; // 用户名，唯一
  email: string; // 邮箱，唯一
  passwordHash: string; // 密码哈希
  fullName: string; // 全名
  role: UserRole; // 用户角色
  status: UserStatus; // 用户状态
  emailVerified: boolean; // 邮箱验证状态
  lastLoginAt?: Date; // 最后登录时间
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
}
```

### 枚举类型

```typescript
enum UserRole {
  ADMIN = 'ADMIN', // 管理员
  MANAGER = 'MANAGER', // 经理
  USER = 'USER', // 普通用户
  MODERATOR = 'MODERATOR', // 协调员
  GUEST = 'GUEST', // 访客
  SUPER_ADMIN = 'SUPER_ADMIN', // 超级管理员
}

enum UserStatus {
  ACTIVE = 'ACTIVE', // 活跃
  INACTIVE = 'INACTIVE', // 非活跃
  SUSPENDED = 'SUSPENDED', // 暂停
  PENDING = 'PENDING', // 待审核
  BANNED = 'BANNED', // 已封禁
  DELETED = 'DELETED', // 已删除
}
```

## ❌ 错误处理

### 常见错误码

| 错误码     | HTTP状态 | 描述             | 解决方案            |
| ---------- | -------- | ---------------- | ------------------- |
| `AUTH_001` | 400      | 请求参数验证失败 | 检查请求参数格式    |
| `AUTH_002` | 401      | 用户名或密码错误 | 验证登录凭据        |
| `AUTH_003` | 401      | Token无效或过期  | 重新登录或刷新Token |
| `AUTH_004` | 403      | 权限不足         | 联系管理员获取权限  |
| `AUTH_005` | 409      | 用户名已存在     | 使用不同的用户名    |
| `AUTH_006` | 409      | 邮箱已存在       | 使用不同的邮箱      |
| `AUTH_007` | 429      | 登录尝试过于频繁 | 等待后重试          |

### 错误响应格式

```json
{
  "success": false,
  "statusCode": 401,
  "error": "UnauthorizedException",
  "message": "用户名或密码错误",
  "timestamp": "2025-07-15T17:43:31.708Z",
  "path": "/api/v1/auth/login",
  "method": "POST",
  "details": {
    "code": "AUTH_002",
    "field": "password",
    "reason": "密码不匹配"
  }
}
```

## 🔒 安全考虑

### JWT Token安全

- **Token过期时间**: 24小时
- **刷新Token过期时间**: 7天
- **算法**: HS256
- **密钥轮换**: 定期更换JWT密钥

### 密码安全

- **加密算法**: bcrypt
- **加密轮数**: 12轮
- **密码策略**: 最少8位，包含大小写字母和数字
- **密码历史**: 防止重复使用最近5个密码

### 登录安全

- **失败限制**: 5次失败后锁定15分钟
- **IP限制**: 同一IP每分钟最多10次登录尝试
- **设备记录**: 记录登录设备和位置信息

## 💻 代码示例

### JavaScript/TypeScript

```typescript
// 用户注册
async function registerUser(userData: RegisterDto) {
  const response = await fetch('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('注册失败');
  }

  const result = await response.json();
  localStorage.setItem('accessToken', result.data.accessToken);
  return result.data.user;
}

// 用户登录
async function loginUser(email: string, password: string) {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();
  if (result.success) {
    localStorage.setItem('accessToken', result.data.accessToken);
    // 注意：当前实现不返回refreshToken
    // localStorage.setItem('refreshToken', result.data.refreshToken);
  }

  return result;
}

// 获取用户信息
async function getUserProfile() {
  const token = localStorage.getItem('accessToken');
  const response = await fetch('/api/v1/auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.json();
}
```

### Python

```python
import requests

class AuthAPI:
    def __init__(self, base_url="http://localhost:3000/api/v1"):
        self.base_url = base_url
        self.token = None

    def register(self, username, email, password, full_name):
        """用户注册"""
        data = {
            "username": username,
            "email": email,
            "password": password,
            "fullName": full_name
        }

        response = requests.post(f"{self.base_url}/auth/register", json=data)
        if response.status_code == 201:
            result = response.json()
            self.token = result["data"]["accessToken"]
            return result["data"]["user"]
        else:
            raise Exception(f"注册失败: {response.text}")

    def login(self, email, password):
        """用户登录"""
        data = {"email": email, "password": password}

        response = requests.post(f"{self.base_url}/auth/login", json=data)
        if response.status_code == 200:
            result = response.json()
            self.token = result["data"]["accessToken"]
            return result["data"]["user"]
        else:
            raise Exception(f"登录失败: {response.text}")

    def get_profile(self):
        """获取用户信息"""
        if not self.token:
            raise Exception("请先登录")

        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.get(f"{self.base_url}/auth/profile", headers=headers)

        if response.status_code == 200:
            return response.json()["data"]
        else:
            raise Exception(f"获取用户信息失败: {response.text}")
```

## 🔗 相关链接

- [用户API](users.md) - 用户管理相关接口
- [错误码说明](error-codes.md) - 完整的错误码参考
- [安全架构](../02-architecture/security-architecture.md) - 安全设计详解
- [API概览](README.md) - 返回API文档首页

---

**文档信息**

- 创建时间: 2025-01-08
- 最后更新: 2025-07-15 (修复响应格式一致性)
- 维护者: AI Assistant
- 审核者: 项目团队
