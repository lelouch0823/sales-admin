# 📊 库存管理 API

**基础路径**: `/inventory`
**认证要求**: Bearer Token 必需 (ADMIN, MANAGER)

## 1. 库存查询与管理

### 获取库存列表

**端点**: `GET /inventory`
**描述**: 分页获取库存列表，支持多种筛选

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `search`: 搜索关键词 (产品名称、SKU、批次号)
- `productId`: 产品ID筛选
- `warehouseId`: 仓库ID筛选
- `locationId`: 库位ID筛选
- `status`: 状态筛选 (数组: available, reserved, out_of_stock, low_stock, discontinued...)
- `lowStock`: 是否低库存 (true/false)
- `outOfStock`: 是否缺货 (true/false)
- `expiringSoon`: 是否即将过期 (true/false)
- `minQuantity`: 最小数量
- `maxQuantity`: 最大数量
- `sortBy`: 排序字段 (quantity, availableQuantity, lastMovementAt, expiryDate)
- `sortOrder`: 排序方向 (ASC, DESC)

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "product": { "id": "uuid", "name": "产品名", "sku": "SKU001" },
      "quantity": 100,
      "availableQuantity": 90,
      "reservedQuantity": 10,
      "status": "in_stock",
      "warehouse": { "id": "uuid", "name": "主仓库" }
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 100 }
}
```

### 创建库存记录

**端点**: `POST /inventory`
**描述**: 创建新的库存记录

**请求体**:
```json
{
  "productId": "uuid",
  "warehouseId": "uuid",
  "quantity": 100,
  "location": "A-01-01",
  "batchNumber": "BATCH001",
  "expiryDate": "2025-12-31"
}
```

### 获取单条库存详情

**端点**: `GET /inventory/{id}`
**路径参数**: `id` (库存ID)

### 更新库存记录

**端点**: `PATCH /inventory/{id}`
**描述**: 更新库存非数量属性（如位置、批次）

**请求体**:
```json
{
  "location": "B-02",
  "notes": "位置调整"
}
```

### 删除库存记录

**端点**: `DELETE /inventory/{id}`
**权限**: 仅 ADMIN

## 2. 库存调整与转移

### 调整库存数量

**端点**: `POST /inventory/adjust`
**描述**: 手动调整库存数量（盘点、损耗等）

**请求体**:
```json
{
  "inventoryId": "uuid",
  "newQuantity": 150,
  "reason": "manual_adjustment",
  "notes": "盘点修正",
  "unitCost": 25.5
}
```

### 库存转移

**端点**: `POST /inventory/transfer`
**描述**: 在不同库存记录（仓库/位置）间转移

**请求体**:
```json
{
  "fromInventoryId": "uuid-source",
  "toInventoryId": "uuid-target",
  "quantity": 50,
  "reason": "transfer_out",
  "notes": "调拨到分店"
}
```

### 预留库存

**端点**: `POST /inventory/reserve`
**描述**: 为订单预留库存

**请求体**:
```json
{
  "productId": "uuid",
  "quantity": 5,
  "orderId": "uuid-order",
  "reason": "订单预留"
}
```

## 3. 统计与报表

### 获取库存统计

**端点**: `GET /inventory/stats`

**响应**:
```json
{
  "success": true,
  "data": {
    "totalProducts": 500,
    "totalQuantity": 10000,
    "totalValue": 250000.00,
    "lowStockItems": 25,
    "outOfStockItems": 5,
    "expiringSoonItems": 10,
    "damagedItems": 3,
    "byStatus": {
      "available": 450,
      "reserved": 30,
      "out_of_stock": 5,
      "low_stock": 25,
      "discontinued": 5,
      "damaged": 3,
      "expired": 2
    },
    "topMovingProducts": [
      {
        "productId": "uuid",
        "productName": "热销产品A",
        "sku": "SKU001",
        "totalMovement": 500,
        "movementCount": 25
      }
    ],
    "recentMovements": [
      {
        "id": "uuid",
        "inventoryId": "uuid",
        "type": "stock_out",
        "quantityChange": -10,
        "quantityBefore": 100,
        "quantityAfter": 90,
        "reason": "订单出库",
        "createdAt": "2025-01-01T12:00:00Z",
        "productName": "产品名称",
        "sku": "SKU001"
      }
    ],
    "activeAlerts": 30,
    "alertsByType": {
      "low_stock": 25,
      "out_of_stock": 5,
      "overstock": 0,
      "expiry_warning": 10,
      "damage_alert": 3,
      "reorder_point": 25
    }
  }
}
```

### 获取低库存列表

**端点**: `GET /inventory/low-stock`
**描述**: 快速获取所有低于预警值的库存项

### 获取即将过期商品

**端点**: `GET /inventory/expiring-soon`
**查询参数**: `days` (提前天数，默认30)

### 获取库存价值报告

**端点**: `GET /inventory/value-report`
**描述**: 获取详细的库存价值分析报告

**响应**:
```json
{
  "success": true,
  "data": {
    "totalValue": 250000.00,
    "byCategory": [
      {
        "category": "电子产品",
        "value": 100000.00,
        "quantity": 500
      }
    ],
    "byWarehouse": [
      {
        "warehouse": "主仓库",
        "value": 200000.00,
        "quantity": 800
      }
    ],
    "topValueProducts": [
      {
        "id": "uuid",
        "productId": "uuid",
        "productName": "高价值产品A",
        "sku": "SKU001",
        "quantity": 50,
        "unitCost": 500.00,
        "totalValue": 25000.00
      }
    ],
    "generatedAt": "2025-01-01T12:00:00Z"
  }
}
```

## 4. 历史与审计

### 获取操作历史

**端点**: `GET /inventory/{id}/movements`
**描述**: 获取指定库存的所有变动记录

### 获取库存日志

**端点**: `GET /inventory/logs`
**描述**: 获取系统内所有库存相关的操作日志

## 5. 预警管理

### 获取活跃预警

**端点**: `GET /inventory/alerts/active`

### 运行预警检查

**端点**: `POST /inventory/alerts/check`
**描述**: 手动触发一次全局库存预警检查
