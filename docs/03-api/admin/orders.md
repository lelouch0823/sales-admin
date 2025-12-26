# 📋 订单管理 API

**基础路径**: `/orders`
**认证要求**: Bearer Token 必需

## 🔐 权限说明

| 接口                   | 方法   | 权限要求             |
| ---------------------- | ------ | -------------------- |
| `/orders`              | GET    | ADMIN, MANAGER       |
| `/orders`              | POST   | ADMIN, MANAGER       |
| `/orders/{id}`         | GET    | ADMIN, MANAGER, 本人 |
| `/orders/{id}`         | DELETE | ADMIN                |
| `/orders/{id}/status`  | PATCH  | ADMIN, MANAGER       |
| `/orders/{id}/items`   | GET    | ADMIN, MANAGER, 本人 |
| `/orders/{id}/logs`    | GET    | ADMIN, MANAGER       |
| `/orders/batch-status` | PATCH  | ADMIN, MANAGER       |
| `/orders/stats`        | GET    | ADMIN, MANAGER       |

---

## 获取订单列表

**端点**: `GET /orders`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**查询参数**:

- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `status`: 状态筛选 (pending, confirmed, processing, shipped, delivered, cancelled, refunded, failed, returned)
- `customerId`: 客户ID筛选
- `dateFrom`, `dateTo`: 日期范围
- `minAmount`, `maxAmount`: 金额范围
- `sortBy`: 排序字段
- `sortOrder`: 排序方向 (ASC, DESC)

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "orderNumber": "ORD-20250716-001",
      "customerName": "张三",
      "status": "confirmed",
      "totalAmount": 599.98,
      "itemCount": 2,
      "createdAt": "2025-01-01T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 200,
    "totalPages": 10
  }
}
```

---

## 获取订单详情

**端点**: `GET /orders/{id}`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER, 本人

**路径参数**:

- `id` (UUID): 订单唯一标识

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "orderNumber": "ORD-20250716-001",
    "status": "confirmed",
    "customer": {
      "id": "customer-uuid",
      "name": "张三",
      "phone": "13800138000",
      "email": "zhangsan@example.com"
    },
    "items": [
      {
        "id": "item-uuid",
        "productId": "product-uuid",
        "productName": "精美陶瓷餐具套装",
        "sku": "SKU-001",
        "quantity": 2,
        "unitPrice": 299.99,
        "totalPrice": 599.98
      }
    ],
    "totalAmount": 599.98,
    "shippingAddress": {
      "province": "北京市",
      "city": "北京市",
      "district": "朝阳区",
      "address": "xxx街道xxx号",
      "zipCode": "100000"
    },
    "paymentInfo": {
      "method": "alipay",
      "status": "paid",
      "paidAt": "2025-01-01T12:30:00Z"
    },
    "createdAt": "2025-01-01T12:00:00Z",
    "updatedAt": "2025-01-01T12:30:00Z"
  }
}
```

---

## 创建订单

**端点**: `POST /orders`
**描述**: 管理端手动下单
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**请求体**:

```json
{
  "customerId": "customer-uuid",
  "items": [
    {
      "productId": "product-uuid",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "province": "北京市",
    "city": "北京市",
    "district": "朝阳区",
    "address": "xxx街道xxx号",
    "zipCode": "100000",
    "receiverName": "张三",
    "receiverPhone": "13800138000"
  },
  "notes": "订单备注"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "new-order-uuid",
    "orderNumber": "ORD-20250716-002",
    "status": "pending",
    "totalAmount": 599.98,
    "createdAt": "2025-01-01T12:00:00Z"
  },
  "message": "订单创建成功"
}
```

---

## 删除/作废订单

**端点**: `DELETE /orders/{id}`
**认证**: Bearer Token 必需
**权限**: ADMIN

**路径参数**:

- `id` (UUID): 订单唯一标识

**响应**:

```json
{
  "success": true,
  "message": "订单已作废"
}
```

---

## 更新订单状态

**端点**: `PATCH /orders/{id}/status`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**路径参数**:

- `id` (UUID): 订单唯一标识

**请求体**:

```json
{
  "status": "processing",
  "notes": "订单已开始处理"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "orderNumber": "ORD-20250716-001",
    "status": "processing",
    "updatedAt": "2025-01-01T13:00:00Z"
  },
  "message": "订单状态更新成功"
}
```

---

## 批量更新订单状态

**端点**: `PATCH /orders/batch-status`
**描述**: 批量更新多个订单的状态
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**请求体**:

```json
{
  "orderIds": ["uuid-1", "uuid-2", "uuid-3"],
  "status": "processing",
  "notes": "批量处理"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "updatedCount": 3,
    "failedCount": 0
  },
  "message": "批量更新成功"
}
```

---

## 获取订单商品明细

**端点**: `GET /orders/{id}/items`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER, 本人

**路径参数**:

- `id` (UUID): 订单唯一标识

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "item-uuid",
      "productId": "product-uuid",
      "productName": "精美陶瓷餐具套装",
      "sku": "SKU-001",
      "mainImageUrl": "https://...",
      "quantity": 2,
      "unitPrice": 299.99,
      "totalPrice": 599.98
    }
  ]
}
```

---

## 获取订单操作日志

**端点**: `GET /orders/{id}/logs`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**路径参数**:

- `id` (UUID): 订单唯一标识

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "log-uuid",
      "action": "status_change",
      "fromStatus": "pending",
      "toStatus": "confirmed",
      "operator": {
        "id": "user-uuid",
        "name": "管理员"
      },
      "notes": "订单确认",
      "createdAt": "2025-01-01T12:30:00Z"
    }
  ]
}
```

---

## 获取订单统计

**端点**: `GET /orders/stats`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**响应**:

```json
{
  "success": true,
  "data": {
    "totalOrders": 1000,
    "totalRevenue": 299999.5,
    "averageOrderValue": 299.99,
    "todayOrders": 25,
    "weekOrders": 150,
    "monthOrders": 500,
    "byStatus": {
      "pending": 50,
      "confirmed": 200,
      "processing": 100,
      "shipped": 150,
      "delivered": 450,
      "cancelled": 30,
      "refunded": 20
    },
    "byPaymentStatus": {
      "pending": 100,
      "paid": 850,
      "refunded": 50
    },
    "topCustomers": [
      {
        "customerId": "uuid",
        "customerName": "张三",
        "orderCount": 15,
        "totalSpent": 12500.0
      }
    ]
  }
}
```
