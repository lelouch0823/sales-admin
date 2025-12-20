# PIM System Optimization & Completion Plan (SOTA Roadmap)

## 1. Executive Summary
目前的 PIM 模块处于 **V1.0 (MVP)** 阶段，满足了基础的信息录入与列表管理。为了达到 **SOTA (State-of-the-Art)** 级别，我们需要从单一的“数据存储”向“智能数据资产管理”转型。核心升级方向为：**多规格变体模型**、**AI 驱动的内容生成**、**数据完整性度量**以及**动态属性系统**。

## 2. Core Architecture Upgrades (数据内核升级)

### 2.1 SPU-SKU 变体模型 (Variant Management)
**现状**: `Product` = `SKU`，完全扁平化。无法表达“这件T恤有红/白两色，S/M/L三码”的聚合关系。
**升级目标**:
- **SPU (Standard Product Unit)**: 产品基类，承载公共属性（如：品牌、类目、名称、主图、材质描述）。
- **SKU (Stock Keeping Unit)**: 库存单元，承载销售属性（如：颜色、尺寸、价格、条码）。
- **UI 需求**: 新增 "Variant Matrix" 编辑器，支持二维/三维规格生成表格。

### 2.2 动态属性系统 (Dynamic Attributes)
**现状**: 只有固定的 `brand`, `category`, `price` 等字段。
**升级目标**: 不同类目需要不同的属性模板。
- **电子产品**: CPU、内存、屏幕尺寸。
- **服饰**: 材质成分、洗涤说明、尺码表。
- **技术实现**: 引入 EAV (Entity-Attribute-Value) 模型或基于 PostgreSQL JSONB 的 Schema 校验。

## 3. AI Intelligence Suite (Gemini Integration)

### 3.1 智能文案生成 (Magic Description)
- **功能**: 根据 SKU 名称和属性，调用 Gemini 自动生成 SEO 友好的标题、短描述和长描述。
- **多语言**: 一键生成 En/Zh/Jp 等多语言版本，降低出海门槛。

### 3.2 图像识别与打标 (Auto-Tagging)
- **功能**: 上传图片后，通过多模态大模型分析图片内容，自动填充 `Tags` (e.g., "Minimalist", "Summer", "Office") 和 `Color` 属性。

### 3.3 数据清洗 (Data Standardization)
- **功能**: AI 自动修正拼写错误，统一单位（如将 "10 kgs", "10kg", "10 Kilograms" 统一为 "10 kg"）。

## 4. Data Quality & Governance (数据质量与治理)

### 4.1 数据完整度评分 (Completeness Score)
**概念**: 并不是所有填了必填项的商品都适合上架。
**功能**:
- 定义渠道标准（如 Amazon 标准、Shopify 标准）。
- 实时计算评分：`Score = (已填核心字段 / 总核心字段) * 权重`。
- **UI**: 在列表页显示 "Quality Score: 85/100" 进度条，并提示 "Missing: Material Description"。

### 4.2 媒体资产管理 (Advanced DAM)
- **图片处理**: 内置裁剪、压缩、自动移除背景 (AI Background Removal)。
- **合规检查**: 自动检测图片是否包含违规文字或水印。

## 5. Workflow & Operations (工作流与运营)

### 5.1 审批工作流 (Approval Process)
- **流程**: Editor 提交修改 -> Manager 审核差异 (Diff View) -> Publish。
- **UI**: 增加 "Changeset" 视图，高亮显示本次修改了哪些字段。

### 5.2 版本控制 (Versioning)
- 记录每一次发布的快照，支持一键回滚到历史版本。

### 5.3 渠道价格策略 (Channel Pricing)
- 支持为不同渠道（App, Web, 线下门店, 分销商）设置不同的价格表 (Price Lists)。

## 6. Implementation Phases (实施阶段)

| Phase | Focus | Key Features |
| :--- | :--- | :--- |
| **Phase 1 (Current)** | **Foundation** | Basic CRUD, List View, Simple Media. |
| **Phase 2 (Q2)** | **Structure** | SPU/SKU Logic, Dynamic Attributes, Variant Editor. |
| **Phase 3 (Q3)** | **Intelligence** | Gemini AI Description, Auto-tagging, Translation. |
| **Phase 4 (Q4)** | **Governance** | Quality Score, Approval Workflow, Versioning. |
