# 📋 API 文档模板

> **使用说明**: 创建新的 API 接口文档时，请复制此模板并按规范填写。

---

## 📖 模块头部格式

```markdown
# 🏷️ [模块名称] API

**基础路径**: `/api-path`
**认证要求**: Bearer Token 必需 (ADMIN, MANAGER) / 公开

## 🔐 权限说明

| 接口         | 方法   | 权限要求              |
| ------------ | ------ | --------------------- |
| `/path`      | GET    | 公开 / ADMIN, MANAGER |
| `/path`      | POST   | ADMIN, MANAGER        |
| `/path/{id}` | DELETE | ADMIN                 |
```

---

## 📝 接口文档结构

每个接口应包含以下完整内容：

### 1. 接口定义

```markdown
## [接口名称]

**端点**: `[METHOD] /path`
**描述**: 接口功能描述
**认证**: Bearer Token 必需/可选
**权限**: ADMIN / MANAGER / 公开
```

### 2. 请求参数

````markdown
**路径参数**:

- `id` (UUID): 资源唯一标识

**查询参数**:

- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `search`: 搜索关键词
- `status`: 状态筛选 (active, inactive)
- `sortBy`: 排序字段
- `sortOrder`: 排序方向 (ASC, DESC)

**请求体**:

```json
{
  "field1": "value1",
  "field2": "value2"
}
```
````

````

### 3. 响应示例

```markdown
**响应**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "示例名称",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
````

````

---

## ✅ 标准响应格式

### 成功响应

```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
````

### 分页响应

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": [...]
  }
}
```

> 详细错误码参考: [error-codes.md](./error-codes.md)

---

## 🌐 多语言字段约定

部分实体支持中英文字段，约定如下：

| 字段            | 类型   | 必填 | 说明     |
| --------------- | ------ | :--: | -------- |
| `name`          | string |  ✅  | 中文名称 |
| `nameEn`        | string |  ❌  | 英文名称 |
| `description`   | string |  ❌  | 中文描述 |
| `descriptionEn` | string |  ❌  | 英文描述 |

**示例**:

```json
{
  "name": "品牌中文名",
  "nameEn": "Brand English Name",
  "description": "中文描述",
  "descriptionEn": "English description"
}
```

---

## 📋 完整接口示例

### 获取列表

**端点**: `GET /resources`
**描述**: 分页获取资源列表
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**查询参数**:

- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `search`: 搜索关键词
- `status`: 状态筛选 (active, inactive)
- `sortBy`: 排序字段 (name, createdAt)
- `sortOrder`: 排序方向 (ASC, DESC)

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "资源名称",
      "status": "active",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

### 获取详情

**端点**: `GET /resources/{id}`
**描述**: 获取单个资源详情
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**路径参数**:

- `id` (UUID): 资源唯一标识

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "资源名称",
    "description": "详细描述",
    "status": "active",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### 创建资源

**端点**: `POST /resources`
**描述**: 创建新资源
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**请求体**:

```json
{
  "name": "新资源名称",
  "description": "资源描述",
  "status": "active"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "new-uuid-string",
    "name": "新资源名称",
    "description": "资源描述",
    "status": "active",
    "createdAt": "2025-01-01T00:00:00Z"
  },
  "message": "创建成功"
}
```

---

### 更新资源

**端点**: `PATCH /resources/{id}`
**描述**: 更新资源信息
**认证**: Bearer Token 必需
**权限**: ADMIN, MANAGER

**路径参数**:

- `id` (UUID): 资源唯一标识

**请求体**:

```json
{
  "name": "更新后的名称",
  "status": "inactive"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "更新后的名称",
    "status": "inactive",
    "updatedAt": "2025-01-01T00:00:00Z"
  },
  "message": "更新成功"
}
```

---

### 删除资源

**端点**: `DELETE /resources/{id}`
**描述**: 删除指定资源
**认证**: Bearer Token 必需
**权限**: ADMIN

**路径参数**:

- `id` (UUID): 资源唯一标识

**响应**:

```json
{
  "success": true,
  "message": "删除成功"
}
```

---

**文档信息**

- 创建时间: 2025-12-21
- 维护者: AI Assistant
