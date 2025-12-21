# UI 开发与国际化规范指南

本文档是项目 UI 开发的唯一标准。所有开发工作必须严格遵守此规范，以确保视觉一致性、代码质量和国际化支持。

## 1. 设计系统与样式 (Design System & Styling)

我们全面采用 **Tailwind CSS v4**。所有的设计令牌（Design Tokens）都封装在 `styles/index.css` 的 `@theme` 配置中。

### 1.1 语义化颜色系统 (Semantic Color System)

**严格禁止**直接使用原始色值（如 `bg-blue-600`），除非是用于临时的调试。必须使用语义化 Token：

*   **主色调 (Primary Action)**:
    *   背景/按钮: `bg-primary` (Indigo), `bg-primary-hover`。
    *   文本/图标: `text-primary` (通常用于深色背景或高亮强调)。
    *   淡色背景: `bg-primary/10` 或 `bg-primary-light`。
*   **背景层级 (Surfaces)**:
    *   页面底色: `bg-page` (#f9fafb) - 整个应用的背景。
    *   卡片/容器: `bg-surface` (#ffffff) - 内容承载容器。
*   **状态指示 (Status)**:
    *   **成功 Success**: `bg-success-light`, `text-success` (Green)。
    *   **警告 Warning**: `bg-warning-light`, `text-warning` (Amber)。
    *   **危险 Danger**:  `bg-danger-light`, `text-danger` (Red)。
    *   **信息 Info**: `bg-info-light`, `text-info` (Blue)。
*   **中性色 (Neutrals)**:
    *   边框: `border-gray-200`。
    *   辅助文本: `text-gray-500` / `text-gray-400`。
    *   主要文本: `text-gray-900` / `text-gray-700`。

### 1.2 排版 (Typography)

*   **字体**: `Inter` (Sans-serif)。
*   **字重 (Font Weights)**:
    *   `font-normal`: 标准正文。
    *   `font-medium`: 按钮、导航菜单、表格表头、强调文本。
    *   `font-bold`: 页面主标题、卡片标题、KPI 数字。
*   **字号 (Font Sizes)**:
    *   `text-xs` (12px): 标签 (Badge)、辅助元数据。
    *   `text-sm` (14px): 标准正文、表格内容、表单输入框。
    *   `text-base` (16px): 少数正文强调。
    *   `text-lg` (18px): 区域小标题。
    *   `text-2xl` (24px): 页面主标题、模态框标题。

### 1.3 布局与间距 (Layout & Spacing)

*   **页面容器**: `max-w-7xl mx-auto px-4 sm:px-8 py-8`。
*   **卡片内边距**: `p-6` 是标准内边距。对于包含全宽表格的卡片，使用 `noPadding` 属性。
*   **网格系统 (Grid)**:
    *   KPI 数据卡: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`。
    *   表单筛选栏: `grid-cols-1 md:grid-cols-3 gap-4`。

### 1.4 动画 (Animation)

使用 `styles/index.css` 定义的 `tailwindcss-animate` 兼容类，保持交互流畅：

*   **页面/内容加载**: `animate-fade-in`。
*   **模态框/Dropdown**: `animate-in fade-in zoom-in-95 duration-200`。
*   **抽屉 (Drawer)**: `animate-in slide-in-from-right duration-300`。
*   **骨架屏**: `animate-shimmer`。

---

## 2. 组件使用规范 (Component Usage)

**核心原则**: 优先复用 `components/` 下的现有组件，避免编写行内 HTML 结构。

### 核心组件库
*   **`Card`**: 基础内容容器。如果卡片内是全宽表格，请使用 `<Card noPadding>`.
*   **`Button`**: 
    *   主要操作: `<Button variant="primary">`
    *   次要/取消: `<Button variant="secondary">`
    *   危险操作: `<Button variant="danger">`
*   **`Badge`**: 用于状态展示 (`PUBLISHED`, `DRAFT`) 或标签。会自动适配语义色。
*   **`Modal`**: 用于表单填写、确认对话框或快速操作。
*   **`Drawer`**: 用于复杂的编辑表单或详情查看。
*   **表单控件**: 使用封装好的 `Input`, `Select`, `Textarea`，保持样式统一。

### 图标 (Icons)
*   库: `lucide-react`。
*   设计规范:
    *   `size={14}`: 按钮内部、元数据旁。
    *   `size={16}` / `size={18}`: 标准 UI 元素、列表操作。
    *   `size={20}`: 导航栏、关闭按钮。
    *   `size={24}`: 空状态页、大型标题旁。

---

## 3. 国际化 (i18n) 规范

**⚠️ 强制规则**: UI 组件（视图、组件、Alert 消息）中 **严禁出现硬编码的中文字符串**。

### 3.1 开发工作流
1.  **识别文本**: 例如，将要添加一个按钮 "创建用户"。
2.  **添加键值**: 打开 `lib/i18n.ts`：
    *   在 `resources.en.translation` 添加英文。
    *   在 `resources.zh.translation` 添加中文。
    *   **命名规范**: `模块.区域/功能.键名` (例如 `users.modal.create_btn` 或 `inventory.list.sku`)。
3.  **组件调用**:
    ```tsx
    import { useTranslation } from 'react-i18next';
    
    // 组件内
    const { t } = useTranslation();
    return <Button>{t('users.modal.create_btn', '创建用户')}</Button>;
    // 注意：t() 的第二个参数是默认值（fallback），建议填写方便开发时识别
    ```

### 3.2 通用命名空间 (Common Namespace)
优先复用 `common` 命名空间下的键值，减少冗余：
*   **动作**: `common.save` (保存), `common.cancel` (取消), `common.edit` (编辑), `common.delete` (删除), `common.add` (添加), `common.search` (搜索)。
*   **状态**: `common.loading` (加载中), `common.success` (成功), `common.error` (错误), `common.no_data` (暂无数据)。

### 3.3 动态内容
使用插值变量，不要根据语言拼接字符串：
*   **定义**: `"welcome": "欢迎回来, {{name}}"`
*   **使用**: `t('dashboard.welcome', { name: user.name })`

---

## 4. 代码风格与最佳实践 (Code Style)

### 4.1 React 开发
*   **组件定义**: 使用 `React.FC<Props>` 类型。
*   **Hooks 顺序**: 所有的 Hooks (useState, useEffect, useQuery) 必须置于组件顶部。
*   **条件渲染**:
    *   简单显示/隐藏: `{isVisible && <Component />}`
    *   复杂分支: 使用三元运算符或提炼为函数。

### 4.2 TypeScript 规范
*   **严禁 Any**: 避免使用 `any`。如果在重构旧代码时遇到困难，优先定义 Interface 或使用 `unknown`。
*   **接口定义**:
    *   组件 Props 接口定义在组件文件内。
    *   共享的数据模型定义在 `types/` 目录下。

### 4.3 代码整洁之道
*   **组件拆分**: 如果一个组件超过 **200 行** 或包含复杂的渲染逻辑（如大型 Modals），请将其拆分为独立的子组件。
*   **逻辑分离**: 尽量将复杂的业务逻辑（数据处理、API 调用）提取到 Custom Hooks 中，保持视图层纯净。
