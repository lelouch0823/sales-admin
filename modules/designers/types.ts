/**
 * 设计师类型定义
 *
 * 对应后端 /designers 接口
 */

/** 设计师级别 */
export type DesignerLevel = 'junior' | 'mid' | 'senior' | 'lead';

/** 设计师实体 */
export interface Designer {
  id: string;
  name: string;
  email?: string;
  bio?: string;
  level: DesignerLevel;
  skills?: string[];
  avatarUrl?: string;
  status?: 'active' | 'inactive';
  totalProjects?: number;
  createdAt?: string;
  updatedAt?: string;
}

/** 作品集项 */
export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
}

/** 设计师统计 */
export interface DesignerStats {
  totalDesigners: number;
  activeDesigners: number;
  byLevel: Record<DesignerLevel, number>;
}
