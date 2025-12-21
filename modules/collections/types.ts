/**
 * 系列类型定义
 *
 * 对应后端 /collections 接口
 */

/** 系列状态 */
export type CollectionStatus = 'active' | 'inactive';

/** 系列实体 */
export interface Collection {
  id: string;
  name: string;
  description?: string;
  brand?: {
    id: string;
    name: string;
  };
  designer?: {
    id: string;
    name: string;
  };
  status: CollectionStatus;
  productCount?: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** 系列统计 */
export interface CollectionStats {
  totalCollections: number;
  activeCollections: number;
}
