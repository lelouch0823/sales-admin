# 📋 订单管理 API

**基础路径**: `/orders`
**认证要求**: Bearer Token 必需 (ADMIN, MANAGER)

## 获取订单列表

**端点**: `GET /orders`

**查询参数**:
- `page`: 页码
- `limit`: 每页数量
- `status`: 状态筛选 (pending, confirmed, processing, shipped, delivered, cancelled, refunded, failed, returned)
- `customerId`: 客户ID筛选
- `dateFrom`, `dateTo`
- `minAmount`, `maxAmount`
- `sortBy`

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
      "items": [
        {
          "productId": "product-uuid",
          "productName": "精美陶瓷餐具套装",
          "quantity": 2
        }
      ]
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 200 }
}
```

## 更新订单状态

**端点**: `PATCH /orders/{id}/status`

**请求体**:
```json
{
  "status": "processing",
  "notes": "订单已开始处理"
}
```

## 获取订单统计

**端点**: `GET /orders/stats`

**响应**:
```json
{
  "success": true,
  "data": {
    "totalOrders": 1000,
    "total": 1000,
    "totalRevenue": 299999.50,
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
    "byShippingStatus": {
      "pending": 150,
      "shipped": 200,
      "delivered": 600,
      "returned": 50
    },
    "recentOrders": [
      {
        "id": "uuid",
        "orderNumber": "ORD-20250101-001",
        "customerName": "张三",
        "totalAmount": 599.98,
        "status": "confirmed",
        "createdAt": "2025-01-01T12:00:00Z"
      }
    ],
    "topCustomers": [
      {
        "customerId": "uuid",
        "orderCount": 15,
        "totalSpent": 12500.00
      }
    ]
  }
}
```
