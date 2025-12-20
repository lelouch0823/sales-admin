export type StockStatus = 'IN_STOCK' | 'TRANSFERABLE' | 'BACKORDER' | 'UNAVAILABLE';
export type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED';

export interface MediaAsset {
  id: string;
  type: 'IMAGE' | 'PDF';
  url: string;
  title?: string;
  isMain?: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  
  // PIM Extended Fields
  status: ProductStatus;
  description?: string;
  tags: string[];
  
  // Sales Rules
  globalStatus: 'ON_SHELF' | 'OFF_SHELF'; // Legacy/Simple status
  allowBackorder: boolean;
  allowTransfer: boolean;

  // Media
  mediaAssets: MediaAsset[];
  
  updatedAt: string;
  updatedBy: string;
}
