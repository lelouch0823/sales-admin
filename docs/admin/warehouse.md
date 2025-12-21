# 🏭 仓库管理 API

**基础路径**: `/admin/warehouses`, `/admin/transfer-orders`
**认证要求**: Bearer Token 必需 (ADMIN, MANAGER)

## 仓库管理 (Warehouses)

### 获取仓库列表

**端点**: `GET /admin/warehouses`

**查询参数**:
- `page`, `limit` (分页)
- `type`: (CENTRAL, REGIONAL, STORE, VIRTUAL)
- `tenantId`
- `parentId`
- `regionCode`
- `isActive`
- `keyword` (编码或名称模糊搜索)

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
        "isTransferSource": true
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### 创建仓库

**端点**: `POST /admin/warehouses`

**请求体**:
```json
{
  "code": "WH-SH-001",
  "name": "上海区域仓",
  "type": "REGIONAL",
  "parentId": "uuid-parent",
  "regionCode": "CN-SH",
  "address": "上海市...",
  "priority": 100
}
```

### 获取仓库层级树

**端点**: `GET /admin/warehouses/tree`

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "root-uuid",
      "name": "总仓",
      "children": [
        { "id": "child-uuid", "name": "区域仓", "children": [] }
      ]
    }
  ]
}
```

### 获取可调货源仓库

**端点**: `GET /admin/warehouses/{id}/transfer-sources`

**说明**: 根据目标仓库ID，获取按优先级排序的推荐源仓库列表。

---

## 调货单管理 (Transfer Orders)

### 创建调货单

**端点**: `POST /admin/transfer-orders`

**请求体**:
```json
{
  "sourceWarehouseId": "uuid-source",
  "targetWarehouseId": "uuid-target",
  "items": [
    { "productId": "uuid-prod", "quantity": 10 }
  ],
  "expectedArrival": "2025-01-01T00:00:00Z",
  "notes": "紧急补货",
  "priority": "high"
}
```

### 提交审批

**端点**: `POST /admin/transfer-orders/{id}/submit`

### 审批通过

**端点**: `POST /admin/transfer-orders/{id}/approve`

### 发货

**端点**: `POST /admin/transfer-orders/{id}/ship`

### 收货确认

**端点**: `POST /admin/transfer-orders/{id}/receive`

**请求体**:
```json
{
  "items": [
    { "productId": "uuid-prod", "receivedQuantity": 10, "notes": "完好" }
  ]
}
```
