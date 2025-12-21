/**
 * 品牌类型定义
 *
 * 对应后端 /brands 接口
 */

/** 品牌实体 */
export interface Brand {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  country?: string;
  foundedYear?: number;
  logoUrl?: string;
  websiteUrl?: string;
  productCount?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** 品牌统计 */
export interface BrandStats {
  totalBrands: number;
  activeBrands: number;
  inactiveBrands: number;
  byCountry: Array<{
    country: string;
    count: number;
  }>;
  topBrands: Array<{
    id: string;
    name: string;
    productCount: number;
  }>;
}

/** 批量删除请求 */
export interface BatchDeleteRequest {
  brandIds: string[];
}

/** 批量操作结果 */
export interface BatchOperationResult {
  deletedCount: number;
  failedCount: number;
}
