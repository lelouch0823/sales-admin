# 组件库与第三方库使用指南

本文档介绍项目中的 UI 组件和第三方库封装，以及如何正确使用它们。

## 1. UI 组件 (`components/ui/`)

### 统一表单组件

所有表单元素必须使用封装组件，禁止直接使用原生 HTML 元素。

```tsx
import { Button, Input, Select, Textarea } from '@/components/ui';

// Button
<Button variant="primary" size="md" loading={isLoading}>
  提交
</Button>

// Input
<Input label="用户名" error="必填" helperText="请输入邮箱" />

// Select
<Select
  label="角色"
  options={[{ value: 'admin', label: '管理员' }]}
  value={role}
  onChange={handleChange}
/>

// Textarea
<Textarea label="备注" autoSize minRows={3} />
```

**Button Variants**: `primary`, `secondary`, `ghost`, `danger`, `link`  
**Button Sizes**: `sm`, `md`, `lg`

---

## 2. 原语组件 (`components/primitives/`)

封装 Radix UI，提供无障碍支持。切换底层库只需修改此目录。

### Dialog (对话框)

```tsx
import { Dialog, DialogContent, DialogFooter, DialogClose } from '@/components/primitives';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent title="确认删除" description="此操作不可撤销">
    <p>确定要删除吗？</p>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="secondary">取消</Button>
      </DialogClose>
      <Button variant="danger" onClick={handleDelete}>
        删除
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

### Dropdown (下拉菜单)

```tsx
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from '@/components/primitives';

<Dropdown>
  <DropdownTrigger asChild>
    <Button>更多操作</Button>
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem onClick={handleEdit}>编辑</DropdownItem>
    <DropdownItem onClick={handleDelete}>删除</DropdownItem>
  </DropdownContent>
</Dropdown>;
```

### Tooltip (提示)

```tsx
import { Tooltip, TooltipProvider } from '@/components/primitives';

// 在 App 根部添加一次 TooltipProvider
<TooltipProvider>
  <Tooltip content="这是提示文字">
    <Button>悬停</Button>
  </Tooltip>
</TooltipProvider>;
```

---

## 3. 动画组件 (`components/motion/`)

封装 Framer Motion，提供语义化动画。

```tsx
import { AnimatedBox, AnimatedList, AnimatedListItem } from '@/components/motion';

// 单个元素动画
<AnimatedBox animation="fadeInUp" delay={0.2}>
  <Card>内容</Card>
</AnimatedBox>

// 列表动画 (子元素依次入场)
<AnimatedList staggerDelay={0.05}>
  {items.map(item => (
    <AnimatedListItem key={item.id}>
      <Card>{item.name}</Card>
    </AnimatedListItem>
  ))}
</AnimatedList>
```

**预设动画**: `fadeIn`, `fadeInUp`, `fadeInDown`, `fadeInLeft`, `fadeInRight`, `scaleIn`

---

## 4. 图表组件 (`components/charts/`)

封装 Recharts，提供简化 API。

```tsx
import { SimpleAreaChart, SimpleBarChart, SimplePieChart } from '@/components/charts';

// 面积图
<SimpleAreaChart data={data} height={300} color="#3b82f6" />

// 柱状图
<SimpleBarChart data={data} horizontal />

// 饼图
<SimplePieChart data={data} innerRadius={60} />
```

---

## 5. 数据请求 (`hooks/useApiQuery`)

封装 React Query，提供统一 API。切换到 SWR 只需修改此文件。

```tsx
import { useApiQuery, useApiMutation, useInvalidateQueries } from '@/hooks';

// 查询
const { data, isLoading, error, refetch } = useApiQuery({
  queryKey: ['users'],
  queryFn: () => api.getUsers(),
  staleTime: 5 * 60 * 1000,
});

// 变更
const invalidate = useInvalidateQueries();
const { mutate, isPending } = useApiMutation({
  mutationFn: data => api.createUser(data),
  onSuccess: () => invalidate(['users']),
});
```

---

## 6. 表单验证 (`hooks/useZodForm`)

整合 react-hook-form + zod。

```tsx
import { useZodForm } from '@/hooks';
import { loginSchema } from '@/lib/schemas';

const {
  register,
  handleSubmit,
  formState: { errors },
} = useZodForm({
  schema: loginSchema,
  defaultValues: { email: '', password: '' },
});

<form onSubmit={handleSubmit(onSubmit)}>
  <Input {...register('email')} error={errors.email?.message} />
</form>;
```

---

## 7. 日期处理 (`utils/date`)

封装 date-fns，使用命名空间导入。

```tsx
import { dateUtils } from '@/utils';

dateUtils.formatDate(date); // "2024-01-15"
dateUtils.formatDateTime(date); // "2024-01-15 14:30:00"
dateUtils.formatRelativeTime(date); // "3 天前"
dateUtils.formatSmart(date); // "今天 14:30" / "昨天" / "周三"
```

---

## 8. 状态管理 (`lib/store`)

使用 Zustand。

```tsx
import { useUIStore, useNotificationStore } from '@/lib/store';

// UI 状态
const { sidebarCollapsed, toggleSidebar } = useUIStore();

// 通知
const { addNotification, notifications } = useNotificationStore();
addNotification({ type: 'success', title: '保存成功' });
```

---

## 9. 快捷键 (`hooks/useHotkey`)

封装 react-hotkeys-hook，提供统一快捷键接口。

```tsx
import { useHotkey, HOTKEYS, formatHotkeyDisplay } from '@/hooks/useHotkey';

// 使用预定义快捷键
useHotkey(HOTKEYS.SAVE, () => handleSave(), { enableOnFormTags: true });

// 自定义快捷键
useHotkey('ctrl+shift+n', () => handleNew());

// 显示快捷键提示 (⌘S / Ctrl+S)
<span>{formatHotkeyDisplay('mod+s')}</span>;
```

**预定义快捷键**: `SAVE`, `NEW`, `SEARCH`, `CLOSE`, `COPY`, `PASTE`, `UNDO`, `REDO`

---

## 10. 命令菜单 (`lib/command-menu`)

封装 cmdk，提供全局搜索/命令面板。

```tsx
import {
  CommandRoot,
  CommandInput,
  CommandList,
  CommandItem,
  useCommandMenu,
  commandMenuStyles,
} from '@/lib/command-menu';

const { open, search, setSearch, toggle, close } = useCommandMenu();

<CommandRoot className={commandMenuStyles.root}>
  <CommandInput placeholder="搜索..." className={commandMenuStyles.input} />
  <CommandList>
    <CommandItem onSelect={handleSelect}>操作项</CommandItem>
  </CommandList>
</CommandRoot>;
```

---

## 11. 文件上传 (`hooks/useFileDrop`)

封装 react-dropzone，提供拖拽上传功能。

```tsx
import { useFileDrop, FILE_ACCEPT } from '@/hooks/useFileDrop';

const { getRootProps, getInputProps, isDragActive } = useFileDrop({
  accept: FILE_ACCEPT.EXCEL,
  maxSize: 5 * 1024 * 1024,
  onDrop: files => handleFiles(files),
  onError: msg => toast.error(msg),
});

<div {...getRootProps()} className={isDragActive ? 'border-primary' : ''}>
  <input {...getInputProps()} />
  <p>拖拽文件到此处</p>
</div>;
```

**预定义文件类型**: `FILE_ACCEPT.CSV`, `FILE_ACCEPT.EXCEL`, `FILE_ACCEPT.IMAGES`

---

## 12. Excel 导入导出 (`utils/excel`)

封装 xlsx (SheetJS)，提供 Excel 读写功能。

```tsx
import { exportToExcelWithHeaders, readExcelFile } from '@/utils/excel';

// 导出
exportToExcelWithHeaders(
  data,
  [
    { key: 'sku', label: 'SKU编码' },
    { key: 'name', label: '商品名称' },
  ],
  'inventory-export'
);

// 导入
const rows = await readExcelFile(file);
```

---

## 13. 打印 (`hooks/usePrint`)

封装 react-to-print，提供组件打印功能。

```tsx
import { usePrint } from '@/hooks/usePrint';

const { printRef, handlePrint } = usePrint({
  documentTitle: '发货单',
  onAfterPrint: () => toast.success('打印完成'),
});

<div ref={printRef}>可打印内容</div>
<Button onClick={handlePrint}>打印</Button>
```

---

## 14. 类名合并 (`utils/cn`)

封装 clsx + tailwind-merge，解决 Tailwind 类冲突。

```tsx
import { cn } from '@/utils/cn';

// 条件类名
<div className={cn('p-4', isActive && 'bg-primary', { 'opacity-50': disabled })} />

// 解决冲突 (p-2 会覆盖 p-4)
<div className={cn('p-4', 'p-2')} /> // => 'p-2'
```

---

## 切换底层库指南

| 功能        | 当前库                | 切换方式                      |
| ----------- | --------------------- | ----------------------------- |
| 数据请求    | React Query           | 修改 `hooks/useApiQuery.ts`   |
| 动画        | Framer Motion         | 修改 `components/motion/`     |
| 对话框/下拉 | Radix UI              | 修改 `components/primitives/` |
| 图表        | Recharts              | 修改 `components/charts/`     |
| 日期        | date-fns              | 修改 `utils/date.ts`          |
| 状态管理    | Zustand               | 修改 `lib/store.ts`           |
| 快捷键      | react-hotkeys-hook    | 修改 `hooks/useHotkey.ts`     |
| 命令菜单    | cmdk                  | 修改 `lib/command-menu.ts`    |
| 文件上传    | react-dropzone        | 修改 `hooks/useFileDrop.ts`   |
| Excel       | xlsx (SheetJS)        | 修改 `utils/excel.ts`         |
| 打印        | react-to-print        | 修改 `hooks/usePrint.ts`      |
| 类名合并    | clsx + tailwind-merge | 修改 `utils/cn.ts`            |
