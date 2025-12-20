import { z } from 'zod';

/**
 * 通用验证 Schema
 * 使用 Zod 定义类型安全的表单验证规则
 */

// 用户登录
export const loginSchema = z.object({
    email: z.string().email('请输入有效的邮箱地址'),
    password: z.string().min(6, '密码至少6个字符'),
    rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// 用户创建/编辑
export const userSchema = z.object({
    name: z.string().min(2, '姓名至少2个字符').max(50, '姓名不能超过50个字符'),
    email: z.string().email('请输入有效的邮箱地址'),
    role: z.enum(['SUPER_ADMIN', 'OPS_GLOBAL', 'OPS_STORE', 'STORE_MANAGER']),
    tenantId: z.string().optional(),
    isActive: z.boolean().default(true),
});

export type UserFormData = z.infer<typeof userSchema>;

// 商品创建/编辑
export const productSchema = z.object({
    sku: z.string().min(1, 'SKU不能为空').max(50, 'SKU不能超过50个字符'),
    name: z.string().min(1, '商品名称不能为空').max(200, '商品名称不能超过200个字符'),
    brand: z.string().min(1, '品牌不能为空'),
    category: z.string().min(1, '分类不能为空'),
    description: z.string().optional(),
    price: z.number().min(0, '价格不能为负数'),
    status: z.enum(['DRAFT', 'PUBLISHED', 'UNPUBLISHED']),
    tags: z.array(z.string()).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// 客户创建/编辑
export const customerSchema = z.object({
    name: z.string().min(1, '客户名称不能为空').max(100, '客户名称不能超过100个字符'),
    phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码'),
    email: z.string().email('请输入有效的邮箱地址').optional().or(z.literal('')),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

// 库存操作
export const stockActionSchema = z.object({
    quantity: z.number().min(1, '数量必须大于0'),
    warehouseId: z.string().min(1, '请选择仓库'),
    toWarehouseId: z.string().optional(),
    reason: z.string().optional(),
});

export type StockActionFormData = z.infer<typeof stockActionSchema>;
