# 库存中心需求说明

## 1. 模块目标
建立“单据驱动”的库存管理体系，确保管理端与销售端库存状态（可售、可调、可预订）一致。

## 2. 核心数据模型

### 2.1 仓库 (Warehouse)
- 类型：`STORE` (门店仓), `DC` (总仓), `VIRTUAL` (虚拟仓)。

### 2.2 库存账户 (Stock Balance)
按 `SKU x Warehouse` 维护：
- `on_hand`：实物库存。
- `reserved`：预订/占用库存。
- `available`：可售库存 (`available = on_hand - reserved`)。
- `in_transit`：在途库存（调拨中）。

### 2.3 可售状态 (Sales Status)
逻辑需与今日推荐模块一致：
- **IN_STOCK**: available > 0
- **TRANSFERABLE**: available = 0 且 allow_transfer = true 且其他仓有货
- **BACKORDER**: available = 0 且 allow_backorder = true
- **UNAVAILABLE**: 以上皆否

## 3. 功能需求

### 3.1 库存查询 (Stock Explorer)
- **按 SKU 视图**：查看某 SKU 在所有门店的分布、可售状态、总库存。
- **按仓库视图**：查看某门店下的所有 SKU 库存。

### 3.2 SKU 详情与流水
- 展示库存分布表。
- **库存流水 (Inventory Ledger)**：记录每一次变更（入库/出库/预订/调拨），确保可追溯。

### 3.3 单据管理
- **入库单 (Receiving)**：采购入库、退货入库。增加 `on_hand`。
- **出库单 (Issuing)**：销售出库、报损。减少 `on_hand`。
- **调拨单 (Transfer)**：
  - 流程：Draft -> Shipped (扣减来源仓, 增加在途) -> Received (增加入库仓, 扣减在途)。
- **预订 (Reservations)**：
  - 增加 `reserved`，减少 `available`。
  - 支持手动创建预订占用，或由订单系统自动触发。

### 3.4 库存规则
- 设置全局或单店的低库存阈值。
- 设置安全库存水位。

## 4. 权限与审计
- **STORE_MANAGER**：仅能操作本门店入库、盘点，发起调拨申请。
- **OPS/ADMIN**：全权管理，处理调拨审批，执行库存调整。
- **审计**：所有库存变更必须记录操作人、时间、单据号。