# 📮 后台 API 接口改进建议

> **来自**: 前端开发团队 | **日期**: 2025-12-21

## 一、缺失接口补充

### 🔴 高优先级

#### 1. 订单管理模块

| 接口                 | 方法   | 说明                               |
| -------------------- | ------ | ---------------------------------- |
| `/orders/{id}`       | GET    | 获取单个订单详情（含订单项、日志） |
| `/orders`            | POST   | 创建订单（管理端手动下单场景）     |
| `/orders/{id}`       | DELETE | 删除/作废订单                      |
| `/orders/{id}/items` | GET    | 获取订单商品明细                   |
| `/orders/{id}/logs`  | GET    | 获取订单操作日志                   |

**建议响应格式** (`GET /orders/{id}`):

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-20250101-001",
    "status": "confirmed",
    "customer": { "id": "uuid", "name": "客户名" },
    "items": [...],
    "totalAmount": 599.98,
    "shippingAddress": {...},
    "paymentInfo": {...},
    "createdAt": "2025-01-01T12:00:00Z",
    "logs": [...]
  }
}
```

#### 2. 调货单查询接口

| 接口                          | 方法 | 说明                             |
| ----------------------------- | ---- | -------------------------------- |
| `/admin/transfer-orders`      | GET  | 调货单列表（支持分页、状态筛选） |
| `/admin/transfer-orders/{id}` | GET  | 调货单详情                       |

---

### 🟡 中优先级

#### 3. 品牌统计接口

| 接口            | 方法 | 说明                           |
| --------------- | ---- | ------------------------------ |
| `/brands/stats` | GET  | 品牌统计（总数、按国家分布等） |

---

## 二、文档规范化建议

### 1. 统一响应格式

请确保所有接口都采用统一的响应包装格式：

```json
// 成功响应
{
  "success": true,
  "data": {...},
  "message": "操作成功"  // 可选
}

// 分页响应
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "参数验证失败",
    "details": [...]
  }
}
```

### 2. 补充响应示例

以下接口文档缺少响应体示例，建议补充：

| 模块   | 接口                                                |
| ------ | --------------------------------------------------- |
| 品牌   | `GET /brands/{id}`, `DELETE /brands/{id}`           |
| 系列   | `GET /collections/{id}`, `DELETE /collections/{id}` |
| 设计师 | `GET /designers/{id}`, `DELETE /designers/{id}`     |
| 订单   | `PATCH /orders/{id}/status`                         |
| 认证   | `POST /auth/change-password`                        |
| 库存   | `POST /inventory/alerts/check`                      |

### 3. 多语言字段约定

部分实体有中英文字段（如 `name` / `nameEn`），建议统一约定：

```json
{
  "name": "品牌中文名", // 必填
  "nameEn": "Brand English", // 可选
  "description": "中文描述",
  "descriptionEn": "English description"
}
```

---

## 三、接口优化建议

### 1. 批量操作接口

建议为以下模块增加批量操作接口：

| 模块 | 接口                              | 说明              |
| ---- | --------------------------------- | ----------------- |
| 订单 | `PATCH /orders/batch-status`      | 批量更新订单状态  |
| 品牌 | `DELETE /brands/batch`            | 批量删除品牌      |
| 系列 | `PATCH /collections/batch-status` | 批量启用/停用系列 |

### 2. 关联查询优化

建议在列表接口中支持 `include` 参数，减少 N+1 查询：

```
GET /products?include=brand,collection,designer
GET /orders?include=customer,items
```

### 3. 导出接口

建议增加数据导出接口：

| 接口                | 方法 | 说明                     |
| ------------------- | ---- | ------------------------ |
| `/orders/export`    | POST | 导出订单数据 (Excel/CSV) |
| `/inventory/export` | POST | 导出库存数据             |
| `/analytics/export` | POST | 导出分析报告             |

---

## 四、错误码规范

建议定义统一的业务错误码：

| 错误码                     | HTTP 状态码 | 说明                 |
| -------------------------- | ----------- | -------------------- |
| `AUTH_INVALID_CREDENTIALS` | 401         | 用户名或密码错误     |
| `AUTH_TOKEN_EXPIRED`       | 401         | Token 已过期         |
| `RESOURCE_NOT_FOUND`       | 404         | 资源不存在           |
| `VALIDATION_ERROR`         | 400         | 参数验证失败         |
| `DUPLICATE_ENTRY`          | 409         | 重复数据             |
| `INVENTORY_INSUFFICIENT`   | 422         | 库存不足             |
| `ORDER_STATUS_INVALID`     | 422         | 订单状态不允许此操作 |

---

## 五、Swagger 文档补充

建议在 Swagger UI (`/api/docs`) 中补充：

1. **接口分组标签** - 按模块分组展示
2. **请求/响应示例** - 每个接口都有完整示例
3. **认证说明** - 标注哪些接口需要认证
4. **权限说明** - 标注所需角色 (ADMIN/MANAGER)

---

**联系方式**: 如有疑问，请联系前端开发团队
