# 🏭 仓库管理 API

**基础路径**: `/admin/warehouses`, `/admin/transfer-orders`
**认证要求**: Bearer Token 必需

## 🔐 权限说明

| 接口                                      | 方法 | 权限要求       |
| ----------------------------------------- | ---- | -------------- |
| `/admin/warehouses`                       | GET  | ADMIN, MANAGER |
| `/admin/warehouses`                       | POST | ADMIN, MANAGER |
| `/admin/warehouses/tree`                  | GET  | ADMIN, MANAGER |
| `/admin/warehouses/{id}`                  | GET  | ADMIN, MANAGER |
| `/admin/warehouses/{id}/transfer-sources` | GET  | ADMIN, MANAGER |
| `/admin/transfer-orders`                  | GET  | ADMIN, MANAGER |
| `/admin/transfer-orders`                  | POST | ADMIN, MANAGER |
| `/admin/transfer-orders/{id}`             | GET  | ADMIN, MANAGER |
| `/admin/transfer-orders/{id}/submit`      | POST | ADMIN, MANAGER |
| `/admin/transfer-orders/{id}/approve`     | POST | ADMIN          |
| `/admin/transfer-orders/{id}/ship`        | POST | ADMIN, MANAGER |
| `/admin/transfer-orders/{id}/receive`     | POST | ADMIN, MANAGER |

---

## 仓库管理 (Warehouses)

### 获取仓库列表

**端点**: `GET /admin/warehouses`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**查询参数**:

- `page`, `limit`: 分页参数
- `type`: 仓库类型 (CENTRAL, REGIONAL, STORE, VIRTUAL)
- `tenantId`: 租户ID
- `parentId`: 父仓库ID
- `regionCode`: 区域代码
- `isActive`: 是否激活
- `keyword`: 编码或名称模糊搜索

**响应**:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "code": "WH-BJ-001",
        "name": "北京总仓",
        "type": "CENTRAL",
        "level": 0,
        "isTransferSource": true,
        "isActive": true
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### 创建仓库

**端点**: `POST /admin/warehouses`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**请求体**:

```json
{
  "code": "WH-SH-001",
  "name": "上海区域仓",
  "type": "REGIONAL",
  "parentId": "uuid-parent",
  "regionCode": "CN-SH",
  "address": "上海市浦东新区xxx路xxx号",
  "priority": 100
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "code": "WH-SH-001",
    "name": "上海区域仓",
    "type": "REGIONAL",
    "level": 1,
    "createdAt": "2025-01-01T00:00:00Z"
  },
  "message": "仓库创建成功"
}
```

---

### 获取仓库层级树

**端点**: `GET /admin/warehouses/tree`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "root-uuid",
      "name": "总仓",
      "code": "WH-BJ-001",
      "type": "CENTRAL",
      "children": [
        {
          "id": "child-uuid",
          "name": "区域仓",
          "code": "WH-SH-001",
          "type": "REGIONAL",
          "children": []
        }
      ]
    }
  ]
}
```

---

### 获取可调货源仓库

**端点**: `GET /admin/warehouses/{id}/transfer-sources`
**描述**: 根据目标仓库ID，获取按优先级排序的推荐源仓库列表
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**路径参数**:

- `id` (UUID): 目标仓库ID

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "source-uuid",
      "code": "WH-BJ-001",
      "name": "北京总仓",
      "type": "CENTRAL",
      "priority": 100,
      "estimatedDeliveryDays": 2
    }
  ]
}
```

---

## 调货单管理 (Transfer Orders)

### 获取调货单列表

**端点**: `GET /admin/transfer-orders`
**描述**: 分页获取调货单列表
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**查询参数**:

- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `status`: 状态筛选 (draft, pending, approved, shipped, received, cancelled)
- `sourceWarehouseId`: 源仓库ID
- `targetWarehouseId`: 目标仓库ID
- `dateFrom`, `dateTo`: 日期范围
- `priority`: 优先级 (low, normal, high, urgent)

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "transfer-uuid",
      "orderNumber": "TO-20250101-001",
      "sourceWarehouse": {
        "id": "source-uuid",
        "name": "北京总仓"
      },
      "targetWarehouse": {
        "id": "target-uuid",
        "name": "上海区域仓"
      },
      "status": "approved",
      "priority": "high",
      "itemCount": 5,
      "expectedArrival": "2025-01-03T00:00:00Z",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

### 获取调货单详情

**端点**: `GET /admin/transfer-orders/{id}`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**路径参数**:

- `id` (UUID): 调货单ID

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "transfer-uuid",
    "orderNumber": "TO-20250101-001",
    "sourceWarehouse": {
      "id": "source-uuid",
      "code": "WH-BJ-001",
      "name": "北京总仓"
    },
    "targetWarehouse": {
      "id": "target-uuid",
      "code": "WH-SH-001",
      "name": "上海区域仓"
    },
    "status": "approved",
    "priority": "high",
    "items": [
      {
        "id": "item-uuid",
        "productId": "product-uuid",
        "productName": "产品名称",
        "sku": "SKU-001",
        "quantity": 10,
        "receivedQuantity": null
      }
    ],
    "expectedArrival": "2025-01-03T00:00:00Z",
    "notes": "紧急补货",
    "createdBy": {
      "id": "user-uuid",
      "name": "操作员"
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "logs": [
      {
        "action": "created",
        "operator": "操作员",
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

---

### 创建调货单

**端点**: `POST /admin/transfer-orders`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**请求体**:

```json
{
  "sourceWarehouseId": "uuid-source",
  "targetWarehouseId": "uuid-target",
  "items": [{ "productId": "uuid-prod", "quantity": 10 }],
  "expectedArrival": "2025-01-03T00:00:00Z",
  "notes": "紧急补货",
  "priority": "high"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "new-transfer-uuid",
    "orderNumber": "TO-20250101-002",
    "status": "draft",
    "createdAt": "2025-01-01T00:00:00Z"
  },
  "message": "调货单创建成功"
}
```

---

### 提交审批

**端点**: `POST /admin/transfer-orders/{id}/submit`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "transfer-uuid",
    "status": "pending"
  },
  "message": "调货单已提交审批"
}
```

---

### 审批通过

**端点**: `POST /admin/transfer-orders/{id}/approve`
**认证**: Bearer Token 必需
**权限**: ADMIN

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "transfer-uuid",
    "status": "approved"
  },
  "message": "调货单已审批通过"
}
```

---

### 发货

**端点**: `POST /admin/transfer-orders/{id}/ship`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "transfer-uuid",
    "status": "shipped",
    "shippedAt": "2025-01-02T00:00:00Z"
  },
  "message": "调货单已发货"
}
```

---

### 收货确认

**端点**: `POST /admin/transfer-orders/{id}/receive`
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**请求体**:

```json
{
  "items": [{ "productId": "uuid-prod", "receivedQuantity": 10, "notes": "完好" }]
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "transfer-uuid",
    "status": "received",
    "receivedAt": "2025-01-03T00:00:00Z"
  },
  "message": "收货确认成功"
}
```
