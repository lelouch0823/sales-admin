/**
 * 用户相关类型定义（前端业务类型）
 * 
 * 这些类型用于前端业务逻辑，与后端 API 类型分离
 * 后端数据通过 normalizers.ts 转换为这些类型
 */

/** 用户角色（前端业务角色） */
export type Role = 'SUPER_ADMIN' | 'OPS_GLOBAL' | 'STORE_MANAGER' | 'STORE_STAFF';

/** 用户状态 */
export type UserStatus = 'ACTIVE' | 'DISABLED';

/**
 * 用户实体（前端业务类型）
 * 
 * 注意：name 是必填字段，用于显示
 * 后端 API 返回的 fullName/username 会通过 normalizers 转换
 */
export interface User {
  /** 用户 ID */
  id: string;
  /** 显示名称（必填） */
  name: string;
  /** 邮箱 */
  email: string;
  /** 角色 */
  role: Role;
  /** 所属租户 ID（门店用户必填） */
  tenantId?: string;
  /** 状态 */
  status: UserStatus;
  /** 头像 URL */
  avatarUrl?: string;
}
