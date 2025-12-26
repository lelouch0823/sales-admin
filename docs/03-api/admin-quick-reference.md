# 🚀 管理端API快速参考

> **快速查找管理端常用API接口** | 基于 [管理端API概览](admin/README.md) 完整文档

## 🔐 认证相关

| 操作         | 方法 | 端点                   | 权限  |
| ------------ | ---- | ---------------------- | ----- |
| 管理员登录   | POST | `/auth/login`          | 公开  |
| 获取用户信息 | GET  | `/auth/profile`        | Token |
| 管理员注册   | POST | `/auth/admin/register` | ADMIN |

## 👥 用户管理

| 操作     | 方法  | 端点           | 权限           |
| -------- | ----- | -------------- | -------------- |
| 用户列表 | GET   | `/users`       | ADMIN, MANAGER |
| 创建用户 | POST  | `/users`       | ADMIN, MANAGER |
| 更新用户 | PATCH | `/users/:id`   | ADMIN, MANAGER |
| 用户统计 | GET   | `/users/stats` | ADMIN, MANAGER |

## 📦 产品管理

| 操作     | 方法   | 端点            | 权限           |
| -------- | ------ | --------------- | -------------- |
| 产品列表 | GET    | `/products`     | 公开           |
| 创建产品 | POST   | `/products`     | ADMIN, MANAGER |
| 更新产品 | PATCH  | `/products/:id` | ADMIN, MANAGER |
| 删除产品 | DELETE | `/products/:id` | ADMIN          |

## 🏷️ 品牌管理

| 操作     | 方法   | 端点          | 权限           |
| -------- | ------ | ------------- | -------------- |
| 品牌列表 | GET    | `/brands`     | 公开           |
| 创建品牌 | POST   | `/brands`     | ADMIN, MANAGER |
| 更新品牌 | PATCH  | `/brands/:id` | ADMIN, MANAGER |
| 删除品牌 | DELETE | `/brands/:id` | ADMIN          |

## 📋 订单管理

| 操作     | 方法  | 端点                 | 权限           |
| -------- | ----- | -------------------- | -------------- |
| 订单列表 | GET   | `/orders`            | ADMIN, MANAGER |
| 订单详情 | GET   | `/orders/:id`        | ADMIN, MANAGER |
| 更新状态 | PATCH | `/orders/:id/status` | ADMIN, MANAGER |
| 订单统计 | GET   | `/orders/stats`      | ADMIN, MANAGER |

## 📊 库存管理

| 操作     | 方法 | 端点                           | 权限           |
| -------- | ---- | ------------------------------ | -------------- |
| 库存列表 | GET  | `/inventory`                   | ADMIN, MANAGER |
| 调整库存 | POST | `/inventory/:productId/adjust` | ADMIN, MANAGER |
| 库存统计 | GET  | `/inventory/stats`             | ADMIN, MANAGER |

## 📈 数据分析

| 操作       | 方法 | 端点                   | 权限           |
| ---------- | ---- | ---------------------- | -------------- |
| 仪表板数据 | GET  | `/analytics/dashboard` | ADMIN, MANAGER |
| 销售报表   | GET  | `/analytics/sales`     | ADMIN, MANAGER |

## 🔧 常用查询参数

### 分页参数

- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)

### 排序参数

- `sortBy`: 排序字段 (默认: createdAt)
- `sortOrder`: 排序方向 (ASC, DESC, 默认: DESC)

### 筛选参数

- `search`: 搜索关键词
- `status`: 状态筛选
- `dateFrom`: 开始日期 (YYYY-MM-DD)
- `dateTo`: 结束日期 (YYYY-MM-DD)

## 📝 标准响应格式

### 成功响应

```json
{
  "success": true,
  "data": {
    /* 数据内容 */
  },
  "message": "操作成功",
  "timestamp": "2025-07-16T00:00:00.000Z",
  "path": "/api/v1/endpoint",
  "method": "GET",
  "requestId": 1234567890,
  "metadata": {
    "version": "1.0.0",
    "environment": "development",
    "pagination": {
      /* 分页信息 */
    }
  }
}
```

### 错误响应

```json
{
  "success": false,
  "statusCode": 400,
  "error": "Bad Request",
  "message": "具体错误信息",
  "timestamp": "2025-07-16T00:00:00.000Z",
  "path": "/api/v1/endpoint",
  "method": "POST"
}
```

## 🚀 快速开始

1. **获取Token**: 使用管理员账号登录获取 `accessToken`
2. **设置Header**: 在请求头中添加 `Authorization: Bearer {token}`
3. **调用API**: 根据权限调用相应的管理接口
4. **处理响应**: 根据标准响应格式处理返回数据

## 📖 完整文档

详细的API文档、请求示例和前端对接指南请参考：

- [**完整管理端API文档**](admin/README.md)
- [认证API详情](authentication.md)
- [用户API详情](users.md)
- [产品API详情](products.md)

---

**💡 提示**: 本文档为快速参考，完整的请求参数、响应字段和错误处理请查看对应的详细文档。
