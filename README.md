# Sales Admin

基于 React 19 + TypeScript + Vite 构建的现代化销售管理后台系统。

## 技术栈

- **框架**: React 19 + TypeScript
- **构建**: Vite
- **包管理**: pnpm
- **样式**: Tailwind CSS
- **状态管理**: Zustand + React Query
- **表单验证**: react-hook-form + zod
- **国际化**: i18next
- **测试**: Vitest

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 构建生产版本
pnpm build
```

## 项目结构

```
src/
├── components/       # 公共组件
│   ├── common/       # 通用组件 (Modal, Card, Badge 等)
│   ├── ui/           # UI 组件 (Button, Input, Select 等)
│   ├── primitives/   # 原语组件 (Dialog, Tooltip 等)
│   ├── motion/       # 动画组件
│   └── charts/       # 图表组件
├── modules/          # 业务模块
│   ├── pim/          # 商品管理
│   ├── orders/       # 订单管理
│   ├── inventory/    # 库存管理
│   ├── warehouse/    # 仓库管理
│   ├── crm/          # 客户关系
│   ├── analytics/    # 数据分析
│   └── recommendations/ # 推荐管理
├── hooks/            # 自定义 Hooks
├── lib/              # 核心库 (http, auth, store)
├── constants/        # 常量定义
├── types/            # 类型定义
└── utils/            # 工具函数
```

## 开发规范

详见 [组件库文档](docs/component-library.md)
