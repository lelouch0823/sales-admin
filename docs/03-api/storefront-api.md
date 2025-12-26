# 🛍️ 用户端API对接文档 (Storefront)

> **注意**: 本文档仅包含已实现的公开接口。购物车、订单、个人中心等功能暂未在此版本中开放或需参考 Admin API。

## 🎯 概述

**基础URL**: `/api/v1`

| 模块        | API路径                | 功能描述             | 认证要求 |
| ----------- | ---------------------- | -------------------- | -------- |
| 🛍️ 商品展示 | `/products`            | 商品浏览、搜索、推荐 | 无需认证 |
| 🏷️ 品牌展示 | `/brands`              | 品牌信息、分区       | 无需认证 |
| 🗂️ 分类浏览 | `/products/categories` | 产品分类树           | 无需认证 |

## 🛍️ 商品展示 API

### 1. 搜索产品

**端点**: `GET /products/search`
**描述**: 根据关键词和筛选条件搜索产品

**查询参数**:

- `q`: 搜索关键词
- `category`: 分类名称
- `brand`: 品牌名称
- `minPrice`, `maxPrice`: 价格范围
- `tags`: 标签 (逗号分隔)
- `inStock`: 是否有库存 (true/false)
- `page`, `limit`: 分页参数

### 2. 获取活跃产品列表

**端点**: `GET /products/active`
**描述**: 获取所有激活状态的产品

**查询参数**:

- `limit`: 数量限制

### 3. 获取精选/推荐产品

**端点**: `GET /products/featured`
**描述**: 获取精选产品列表

**查询参数**:

- `limit`: 数量限制

### 4. 获取相关推荐

**端点**: `GET /products/recommended`
**描述**: 获取推荐产品（可按品牌筛选）

**查询参数**:

- `brand_id`: 品牌ID (可选)
- `limit`: 数量限制

### 5. 获取单个产品推荐

**端点**: `GET /products/{id}/recommendations`
**描述**: 根据当前产品ID获取相关推荐

**查询参数**:

- `limit`: 数量限制 (默认: 5)

### 6. 根据SKU获取产品

**端点**: `GET /products/sku/{sku}`

## 🏷️ 品牌展示 API

### 1. 获取品牌列表

**端点**: `GET /brands`
**描述**: 分页获取所有品牌

### 2. 获取活跃品牌

**端点**: `GET /brands/active`
**描述**: 获取所有激活状态的品牌

### 3. 获取品牌分区

**端点**: `GET /brands/segments`
**描述**: 获取品牌分区列表（用于前端展示的一级品牌导航）

**响应**:

```json
[
  {
    "id": "uuid",
    "name": "Brand Name",
    "logoUrl": "http://...",
    "description": "..."
  }
]
```

### 4. 获取品牌详情

**端点**: `GET /brands/{id}`
**描述**: 获取单个品牌的基础信息

### 5. 获取品牌产品数量

**端点**: `GET /brands/{id}/product-count`

## 🗂️ 分类 API

### 获取分类树

**端点**: `GET /products/categories`
**查询参数**:

- `tree`: 是否返回树形结构 (true/false)
- `includeStats`: 是否包含产品统计 (true/false)
  > **KK Backend 用户端商品展示API接口文档** | 最后更新: 2025-07-18 | 维护者: AI Assistant

## 🎯 概述

本文档专为**用户端/前台开发**提供API对接指南，主要用于商品展示、购物车、订单等用户功能的实现。

### 🏗️ 技术架构

- **后端**: NestJS + TypeScript + PostgreSQL + Redis
- **API版本**: v1
- **基础URL**: `http://localhost:3003/api/v1` (开发环境)
- **认证方式**: JWT Bearer Token (可选，部分接口需要)
- **响应格式**: 标准化JSON响应包装
- **文档地址**: `http://localhost:3003/api/docs` (Swagger UI)

### 📊 用户端功能模块

| 模块        | API路径       | 功能描述             | 认证要求 |
| ----------- | ------------- | -------------------- | -------- |
| 🔐 用户认证 | `/auth`       | 注册、登录、个人资料 | 部分需要 |
| 🛍️ 商品展示 | `/products`   | 商品浏览、搜索、详情 | 无需认证 |
| 🏷️ 品牌展示 | `/brands`     | 品牌信息、品牌商品   | 无需认证 |
| 🗂️ 分类浏览 | `/categories` | 产品分类、分类商品   | 无需认证 |
| 🛒 购物车   | `/cart`       | 购物车管理           | 需要认证 |
| 📋 订单管理 | `/orders`     | 下单、订单查询       | 需要认证 |
| 👤 个人中心 | `/profile`    | 个人信息、地址管理   | 需要认证 |
| ❤️ 收藏夹   | `/favorites`  | 商品收藏             | 需要认证 |

## 🛍️ 商品展示 API

### 获取商品列表

**端点**: `GET /products`

**描述**: 获取商品列表，支持分页、搜索、筛选和排序

**认证**: 无需认证

**查询参数**:

- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20, 最大: 100)
- `search`: 搜索关键词 (商品名称、描述、SKU)
- `category`: 分类筛选 (分类名称或ID)
- `brand`: 品牌筛选 (品牌名称或ID)
- `priceMin`: 最低价格
- `priceMax`: 最高价格
- `color`: 颜色筛选
- `material`: 材质筛选
- `inStock`: 是否有库存 (true/false)
- `featured`: 是否精选商品 (true/false)
- `sortBy`: 排序字段 (price, name, createdAt, popularity)
- `sortOrder`: 排序方向 (ASC, DESC, 默认: DESC)

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "sku": "SKU-123456",
      "name": "经典白瓷餐盘",
      "nameEn": "Classic White Ceramic Plate",
      "category": "餐具",
      "brand": "Royal Copenhagen",
      "designer": "Arne Jacobsen",
      "material": "陶瓷",
      "color": "白色",
      "price": 89.99,
      "priceOriginal": 99.99,
      "currency": "EUR",
      "stockStatus": "in_stock",
      "isFeatured": true,
      "mainImageUrl": "https://example.com/images/plate-main.jpg",
      "galleryImages": [
        "https://example.com/images/plate-1.jpg",
        "https://example.com/images/plate-2.jpg",
        "https://example.com/images/plate-3.jpg"
      ],
      "shortDescription": "经典设计的白瓷餐盘，适合日常使用",
      "tags": ["餐具", "陶瓷", "白色", "经典"],
      "rating": 4.8,
      "reviewCount": 156,
      "isOnSale": true,
      "discountPercentage": 10
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "totalPages": 25,
    "hasNext": true,
    "hasPrev": false
  },
  "filters": {
    "categories": [
      { "name": "餐具", "count": 120 },
      { "name": "照明", "count": 85 },
      { "name": "装饰品", "count": 95 }
    ],
    "brands": [
      { "name": "Royal Copenhagen", "count": 45 },
      { "name": "Georg Jensen", "count": 38 }
    ],
    "priceRange": {
      "min": 15.99,
      "max": 899.99
    },
    "colors": [
      { "name": "白色", "count": 78 },
      { "name": "黑色", "count": 45 },
      { "name": "蓝色", "count": 32 }
    ]
  }
}
```

### 获取商品详情

**端点**: `GET /products/{id}`

**描述**: 获取单个商品的详细信息

**认证**: 无需认证

**路径参数**:

- `id`: 商品ID (UUID) 或 SKU

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "sku": "SKU-123456",
    "name": "经典白瓷餐盘",
    "nameEn": "Classic White Ceramic Plate",
    "category": "餐具",
    "brand": {
      "id": "brand-uuid",
      "name": "Royal Copenhagen",
      "nameEn": "Royal Copenhagen",
      "logoUrl": "https://example.com/brand-logo.jpg",
      "country": "丹麦"
    },
    "designer": {
      "id": "designer-uuid",
      "name": "Arne Jacobsen",
      "nameEn": "Arne Jacobsen",
      "nationality": "丹麦"
    },
    "material": "陶瓷",
    "dimensions": {
      "length": 25,
      "width": 25,
      "height": 3,
      "unit": "cm"
    },
    "weight": 0.5,
    "color": "白色",
    "finish": "光滑",
    "price": 89.99,
    "priceOriginal": 99.99,
    "currency": "EUR",
    "stockStatus": "in_stock",
    "stockQuantity": 50,
    "isFeatured": true,
    "mainImageUrl": "https://example.com/images/plate-main.jpg",
    "galleryImages": [
      "https://example.com/images/plate-1.jpg",
      "https://example.com/images/plate-2.jpg",
      "https://example.com/images/plate-3.jpg",
      "https://example.com/images/plate-4.jpg"
    ],
    "description": "这款经典白瓷餐盘由著名设计师Arne Jacobsen设计，采用优质陶瓷材料制作，表面光滑细腻，适合日常使用和特殊场合。简约的设计风格体现了北欧设计的精髓。",
    "shortDescription": "经典设计的白瓷餐盘，适合日常使用",
    "specifications": "材质：高级陶瓷\n尺寸：直径25cm\n重量：500g\n产地：丹麦",
    "careInstructions": "可用洗碗机清洗，避免急剧温度变化，不可用于微波炉",
    "tags": ["餐具", "陶瓷", "白色", "经典", "北欧设计"],
    "rating": 4.8,
    "reviewCount": 156,
    "isOnSale": true,
    "discountPercentage": 10,
    "availability": {
      "inStock": true,
      "quantity": 50,
      "estimatedDelivery": "2-3个工作日",
      "shippingOptions": [
        {
          "method": "standard",
          "name": "标准配送",
          "cost": 9.99,
          "estimatedDays": "3-5"
        },
        {
          "method": "express",
          "name": "快速配送",
          "cost": 19.99,
          "estimatedDays": "1-2"
        }
      ]
    },
    "relatedProducts": [
      {
        "id": "related-uuid-1",
        "name": "配套茶杯",
        "price": 45.99,
        "mainImageUrl": "https://example.com/cup.jpg"
      },
      {
        "id": "related-uuid-2",
        "name": "餐具套装",
        "price": 299.99,
        "mainImageUrl": "https://example.com/set.jpg"
      }
    ],
    "reviews": [
      {
        "id": "review-uuid",
        "user": {
          "name": "张三",
          "avatar": "https://example.com/avatar.jpg"
        },
        "rating": 5,
        "comment": "质量很好，设计简约大方",
        "createdAt": "2025-07-15T10:30:00Z",
        "verified": true
      }
    ],
    "createdAt": "2025-07-18T10:30:00Z",
    "updatedAt": "2025-07-18T10:30:00Z"
  }
}
```

### 获取精选商品

**端点**: `GET /products/featured`

**描述**: 获取精选商品列表

**认证**: 无需认证

**查询参数**:

- `limit`: 数量限制 (默认: 10, 最大: 50)
- `category`: 分类筛选

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "精选商品名称",
      "price": 89.99,
      "priceOriginal": 99.99,
      "mainImageUrl": "https://example.com/image.jpg",
      "brand": "品牌名称",
      "rating": 4.8,
      "reviewCount": 156,
      "isOnSale": true,
      "discountPercentage": 10
    }
  ]
}
```

### 获取新品推荐

**端点**: `GET /products/new-arrivals`

**描述**: 获取最新上架的商品

**认证**: 无需认证

**查询参数**:

- `limit`: 数量限制 (默认: 20, 最大: 50)
- `days`: 天数范围 (默认: 30)

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "新品名称",
      "price": 89.99,
      "mainImageUrl": "https://example.com/image.jpg",
      "brand": "品牌名称",
      "publishedAt": "2025-07-18T10:30:00Z",
      "isNew": true
    }
  ]
}
```

### 获取热销商品

**端点**: `GET /products/bestsellers`

**描述**: 获取热销商品列表

**认证**: 无需认证

**查询参数**:

- `limit`: 数量限制 (默认: 20, 最大: 50)
- `period`: 统计周期 (week, month, quarter, year, 默认: month)

**响应**:

````json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "热销商品名称",
      "price": 89.99,
      "mainImageUrl": "https://example.com/image.jpg",
      "brand": "品牌名称",
      "salesCount": 245,
      "rating": 4.8,
      "reviewCount": 156
    }
  ]
}

### 获取推荐产品

**端点**: `GET /products/recommended`

**描述**: 获取推荐产品列表，支持按品牌筛选

**认证**: 无需认证

**查询参数**:

- `limit`: 数量限制 (默认: 10)
- `brand_id`: 品牌ID筛选 (可选)

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "推荐商品名称",
      "price": 89.99,
      "originalPrice": 99.99,
      "imageUrl": "https://example.com/image.jpg",
      "brandName": "品牌名称",
      "recommendReason": "New Arrival"
    }
  ]
}
````

## 🏷️ 品牌展示 API

### 获取品牌列表

**端点**: `GET /brands`

**描述**: 获取所有品牌列表

**认证**: 无需认证

**查询参数**:

- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `search`: 搜索关键词
- `country`: 国家筛选
- `featured`: 是否精选品牌 (true/false)

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "Royal Copenhagen",
      "nameEn": "Royal Copenhagen",
      "description": "丹麦皇家哥本哈根，创立于1775年的顶级瓷器品牌",
      "logoUrl": "https://example.com/brand-logo.jpg",
      "websiteUrl": "https://royalcopenhagen.com",
      "country": "丹麦",
      "foundedYear": 1775,
      "productCount": 125,
      "isFeatured": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### 获取品牌分区

**端点**: `GET /brands/segments`

**描述**: 获取品牌分区列表（所有活跃品牌）

**认证**: 无需认证

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "Royal Copenhagen",
      "logoUrl": "https://example.com/brand-logo.jpg",
      "description": "品牌描述"
    }
  ]
}
```

**端点**: `GET /brands/{id}`

**描述**: 获取品牌详细信息及其商品

**认证**: 无需认证

**路径参数**:

- `id`: 品牌ID (UUID)

**查询参数**:

- `productPage`: 商品页码 (默认: 1)
- `productLimit`: 商品每页数量 (默认: 20)

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "Royal Copenhagen",
    "nameEn": "Royal Copenhagen",
    "description": "丹麦皇家哥本哈根，创立于1775年的顶级瓷器品牌，以其精美的手绘瓷器和经典的蓝白花纹而闻名世界。",
    "logoUrl": "https://example.com/brand-logo.jpg",
    "bannerUrl": "https://example.com/brand-banner.jpg",
    "websiteUrl": "https://royalcopenhagen.com",
    "country": "丹麦",
    "foundedYear": 1775,
    "productCount": 125,
    "isFeatured": true,
    "products": [
      {
        "id": "product-uuid",
        "name": "蓝花餐盘",
        "price": 89.99,
        "mainImageUrl": "https://example.com/product.jpg",
        "rating": 4.8,
        "reviewCount": 45
      }
    ],
    "productsPagination": {
      "page": 1,
      "limit": 20,
      "total": 125,
      "totalPages": 7
    }
  }
}
```

## 🗂️ 分类浏览 API

### 获取分类列表

**端点**: `GET /categories`

**描述**: 获取产品分类树形结构

**认证**: 无需认证

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "餐具",
      "nameEn": "Tableware",
      "description": "各种餐具产品",
      "imageUrl": "https://example.com/category.jpg",
      "productCount": 245,
      "level": 0,
      "sortOrder": 1,
      "children": [
        {
          "id": "child-uuid",
          "name": "餐盘",
          "nameEn": "Plates",
          "productCount": 89,
          "level": 1,
          "sortOrder": 1
        },
        {
          "id": "child-uuid-2",
          "name": "茶杯",
          "nameEn": "Cups",
          "productCount": 67,
          "level": 1,
          "sortOrder": 2
        }
      ]
    }
  ]
}
```

### 获取分类商品

**端点**: `GET /categories/{id}/products`

**描述**: 获取指定分类下的商品

**认证**: 无需认证

**路径参数**:

- `id`: 分类ID (UUID)

**查询参数**:

- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)

**响应**: (与商品列表相同的响应格式)

## 🛒 购物车 API

### 获取购物车

**端点**: `GET /cart`

**描述**: 获取当前用户的购物车内容

**认证**: Bearer Token 必需

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "cart-uuid",
    "items": [
      {
        "id": "item-uuid",
        "product": {
          "id": "product-uuid",
          "name": "经典白瓷餐盘",
          "sku": "SKU-123456",
          "price": 89.99,
          "mainImageUrl": "https://example.com/image.jpg",
          "stockStatus": "in_stock",
          "stockQuantity": 50
        },
        "quantity": 2,
        "unitPrice": 89.99,
        "totalPrice": 179.98,
        "addedAt": "2025-07-18T10:30:00Z"
      }
    ],
    "summary": {
      "itemCount": 2,
      "subtotal": 179.98,
      "shippingCost": 9.99,
      "taxAmount": 37.99,
      "discountAmount": 0,
      "totalAmount": 227.96,
      "currency": "EUR"
    },
    "updatedAt": "2025-07-18T10:30:00Z"
  }
}
```
