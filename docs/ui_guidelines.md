# UI Development & Internationalization Guidelines

This document serves as the standard for all UI development within the project. Adherence is required to maintain consistency, visual quality, and localization support.

## 1. Design System & Styling (Tailwind CSS)

We use **Tailwind CSS** exclusively. The configuration in `index.html` encapsulates our Design Tokens.

### 1.1 Semantic Color System (Strict)
Do not use raw colors (e.g., `blue-600`) directly unless necessary. Use semantic tokens:

*   **Surfaces**:
    *   Page Background: `bg-page` (#fafafa)
    *   Card/Modal Background: `bg-surface` (#ffffff)
*   **Primary Action**:
    *   Button/Text: `bg-primary`, `text-primary` (Dark Gray/Black)
    *   Hover: `hover:bg-primary-hover`
*   **Brand / Accents**:
    *   Links/Highlights: `text-brand`
    *   Light Backgrounds: `bg-brand-light`
*   **Status Indicators**:
    *   **Success**: `bg-success-light`, `text-success-text` (Green)
    *   **Warning**: `bg-warning-light`, `text-warning-text` (Amber)
    *   **Danger**:  `bg-danger-light`, `text-danger-text` (Red)

### 1.2 Typography
*   **Font Family**: `Inter` (Sans-serif).
*   **Font Weights**:
    *   Regular (`font-normal`): Standard body text.
    *   Medium (`font-medium`): Buttons, Navigation, Table headers.
    *   Bold (`font-bold`): Page titles, Card headers, KPIs.
*   **Font Sizes**:
    *   `text-[10px]` or `text-xs`: Badges, Metadata, Small labels.
    *   `text-sm`: Standard body, Table content, Form inputs.
    *   `text-lg`: Section headers.
    *   `text-2xl`: Page titles, Modal titles.

### 1.3 Layout & Spacing
*   **Main Container**: `max-w-7xl mx-auto px-4 sm:px-8 py-8`.
*   **Card Spacing**: `p-6` is the standard padding for cards.
*   **Grid Systems**:
    *   KPIs: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`.
    *   Form Filters: `grid-cols-1 md:grid-cols-3 gap-4`.

### 1.4 Animation
Use the extended animation utilities defined in `tailwind.config`:
*   `animate-fade-in`: For whole page transitions.
*   `animate-in slide-in-from-bottom-2`: For Modals, Dropdowns, Toasts.
*   `animate-in slide-in-from-right`: For Drawers.

---

## 2. Component Usage

Always prioritize reusing existing components over creating new DOM structures.

### Core Components
*   **`Card`**: The fundamental container. Use `noPadding` prop if the card contains a full-width table.
*   **`Badge`**: For status (`PUBLISHED`), tags (`VIP`), or stock levels. Uses semantic colors automatically.
*   **`Modal`**: For forms, confirmations, or quick actions.
*   **`Drawer`**: For detailed views or complex editing forms.
*   **`Toggle`**: For boolean switches.

### Icons
*   Library: `lucide-react`.
*   Sizing:
    *   `size={14}`: Inside buttons or metadata.
    *   `size={16}` or `size={18}`: Standard UI elements.
    *   `size={20}`: Navigation icons or close buttons.
    *   `size={24}`: Empty states or large headers.

---

## 3. Internationalization (i18n)

**Critical Rule**: **NO** hardcoded text strings are allowed in UI components (views, components, alerts).

### 3.1 Workflow
1.  **Identify Text**: E.g., a button label "Create User".
2.  **Add to `lib/i18n.ts`**:
    *   Add to `resources.en.translation`.
    *   Add to `resources.zh.translation`.
    *   **Naming Convention**: `module.section.key` (e.g., `users.modal.create_btn`).
3.  **Use in Component**:
    ```tsx
    import { useTranslation } from 'react-i18next';
    
    // In component
    const { t } = useTranslation();
    return <button>{t('users.modal.create_btn')}</button>;
    ```

### 3.2 Common Namespace
Reuse keys in the `common` namespace to avoid duplication:
*   Actions: `save`, `cancel`, `edit`, `delete`, `confirm`, `add`, `create`.
*   States: `loading`, `no_data`, `success`, `error`.
*   UI: `actions`, `status`, `search`, `filters`.

### 3.3 Dynamic Content
Use interpolation for variables.
*   **Definition**: `"welcome": "Welcome, {{name}}"`
*   **Usage**: `t('dashboard.welcome', { name: user.name })`

---

## 4. Code Style & Best Practices

### 4.1 React
*   **Functional Components**: Use `React.FC<Props>`.
*   **Hooks**: Organize hooks at the top of the component.
*   **Conditionals**: Use short-circuit evaluation `{isVisible && <Component />}` for simple toggles.

### 4.2 TypeScript
*   **Strict Typing**: Avoid `any`. Define interfaces in `types.ts` if shared, or locally if component-specific.
*   **Props**: Define explicit props interfaces.

### 4.3 Clean Code
*   **Extraction**: If a component exceeds ~200 lines or has complex rendering logic, extract it.
*   **Logic Separation**: Keep business logic separate from rendering.
