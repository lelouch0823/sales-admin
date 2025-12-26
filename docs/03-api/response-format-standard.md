# 📋 API响应格式标准规范

> **KK Backend API响应格式统一标准** | 最后更新: 2025-07-15 | 维护者: AI Assistant

## 📖 概述

本文档定义了KK Backend项目中所有API端点的标准响应格式，确保前后端接口的一致性和可预测性。所有API响应都必须遵循此标准格式。

## 🎯 设计原则

1. **一致性**: 所有API端点使用相同的响应结构
2. **可预测性**: 前端可以依赖固定的响应格式进行解析
3. **信息完整性**: 提供足够的元数据用于调试和监控
4. **向后兼容性**: 新增字段不影响现有客户端
5. **错误友好性**: 提供详细的错误信息便于问题定位

## ✅ 标准成功响应格式

### 基本结构

```json
{
  "success": true,
  "data": <实际数据>,
  "message": "操作成功",
  "timestamp": "2025-07-15T17:43:31.708Z",
  "path": "/api/v1/endpoint",
  "method": "GET",
  "requestId": 123,
  "metadata": {
    "version": "1.0.0",
    "environment": "development",
    "userAgent": "Mozilla/5.0...",
    "ip": "::1"
  }
}
```

### 字段说明

| 字段名                 | 类型    | 必需 | 说明                                           |
| ---------------------- | ------- | ---- | ---------------------------------------------- |
| `success`              | boolean | ✅   | 请求是否成功，成功响应始终为 `true`            |
| `data`                 | any     | ✅   | 实际返回的业务数据，可以是对象、数组或基本类型 |
| `message`              | string  | ✅   | 响应消息，通常为"操作成功"或具体的成功描述     |
| `timestamp`            | string  | ✅   | ISO 8601格式的响应时间戳                       |
| `path`                 | string  | ✅   | 请求的API路径                                  |
| `method`               | string  | ✅   | HTTP请求方法（GET、POST、PUT、DELETE等）       |
| `requestId`            | number  | ✅   | 唯一的请求标识符，用于日志追踪                 |
| `metadata`             | object  | ✅   | 元数据信息                                     |
| `metadata.version`     | string  | ✅   | API版本号                                      |
| `metadata.environment` | string  | ✅   | 运行环境（development、production等）          |
| `metadata.userAgent`   | string  | ✅   | 客户端用户代理字符串                           |
| `metadata.ip`          | string  | ✅   | 客户端IP地址                                   |

### 示例

#### 1. 单个对象响应

```json
{
  "success": true,
  "data": {
    "id": "29501f73-0f71-42fe-b4e4-13e15ccbc4a0",
    "username": "testuser",
    "email": "test@example.com",
    "role": "user"
  },
  "message": "获取用户信息成功",
  "timestamp": "2025-07-15T17:43:31.708Z",
  "path": "/api/v1/users/29501f73-0f71-42fe-b4e4-13e15ccbc4a0",
  "method": "GET",
  "requestId": 123,
  "metadata": {
    "version": "1.0.0",
    "environment": "development",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "ip": "192.168.1.100"
  }
}
```

#### 2. 数组响应

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "产品1",
      "price": "99.99"
    },
    {
      "id": "2",
      "name": "产品2",
      "price": "199.99"
    }
  ],
  "message": "获取产品列表成功",
  "timestamp": "2025-07-15T17:43:31.708Z",
  "path": "/api/v1/products",
  "method": "GET",
  "requestId": 124,
  "metadata": {
    "version": "1.0.0",
    "environment": "development",
    "userAgent": "python-requests/2.31.0",
    "ip": "::1"
  }
}
```

#### 3. 创建操作响应

```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "name": "新产品",
    "status": "active",
    "createdAt": "2025-07-15T17:43:31.708Z"
  },
  "message": "产品创建成功",
  "timestamp": "2025-07-15T17:43:31.708Z",
  "path": "/api/v1/products",
  "method": "POST",
  "requestId": 125,
  "metadata": {
    "version": "1.0.0",
    "environment": "development",
    "userAgent": "axios/1.6.0",
    "ip": "192.168.1.100"
  }
}
```

## ❌ 标准错误响应格式

### 基本结构

```json
{
  "success": false,
  "statusCode": 400,
  "error": "BadRequestException",
  "message": "错误描述",
  "timestamp": "2025-07-15T17:43:31.708Z",
  "path": "/api/v1/endpoint",
  "method": "POST",
  "details": [
    {
      "field": "email",
      "value": "invalid-email",
      "constraints": {
        "isEmail": "email must be an email"
      },
      "messages": ["邮箱格式不正确"]
    }
  ]
}
```

### 字段说明

| 字段名       | 类型    | 必需 | 说明                                 |
| ------------ | ------- | ---- | ------------------------------------ |
| `success`    | boolean | ✅   | 请求是否成功，错误响应始终为 `false` |
| `statusCode` | number  | ✅   | HTTP状态码                           |
| `error`      | string  | ✅   | 错误类型名称                         |
| `message`    | string  | ✅   | 错误描述信息                         |
| `timestamp`  | string  | ✅   | ISO 8601格式的错误时间戳             |
| `path`       | string  | ✅   | 请求的API路径                        |
| `method`     | string  | ✅   | HTTP请求方法                         |
| `details`    | array   | ❌   | 详细错误信息（主要用于验证错误）     |

### 常见错误类型

| 状态码 | 错误类型                     | 说明           | 示例场景                     |
| ------ | ---------------------------- | -------------- | ---------------------------- |
| 400    | BadRequestException          | 请求参数错误   | 参数格式不正确、缺少必需参数 |
| 401    | UnauthorizedException        | 未授权访问     | 未提供token、token无效或过期 |
| 403    | ForbiddenException           | 权限不足       | 用户权限不够访问资源         |
| 404    | NotFoundException            | 资源不存在     | 请求的用户、产品等不存在     |
| 409    | ConflictException            | 资源冲突       | 用户名已存在、重复创建       |
| 422    | UnprocessableEntityException | 实体无法处理   | 数据验证失败                 |
| 429    | TooManyRequestsException     | 请求过于频繁   | 触发限流器                   |
| 500    | InternalServerErrorException | 服务器内部错误 | 系统异常、数据库连接失败     |

### 错误响应示例

#### 1. 验证错误

```json
{
  "success": false,
  "statusCode": 400,
  "error": "BadRequestException",
  "message": "请求参数验证失败",
  "timestamp": "2025-07-15T17:43:31.708Z",
  "path": "/api/v1/auth/register",
  "method": "POST",
  "details": [
    {
      "field": "email",
      "value": "invalid-email",
      "constraints": {
        "isEmail": "email must be an email"
      },
      "messages": ["邮箱格式不正确"]
    },
    {
      "field": "password",
      "value": "123",
      "constraints": {
        "minLength": "password must be longer than or equal to 8 characters"
      },
      "messages": ["密码长度至少8位"]
    }
  ]
}
```

#### 2. 认证错误

```json
{
  "success": false,
  "statusCode": 401,
  "error": "UnauthorizedException",
  "message": "用户名或密码错误",
  "timestamp": "2025-07-15T17:43:31.708Z",
  "path": "/api/v1/auth/login",
  "method": "POST"
}
```

#### 3. 权限错误

```json
{
  "success": false,
  "statusCode": 403,
  "error": "ForbiddenException",
  "message": "权限不足，需要管理员权限",
  "timestamp": "2025-07-15T17:43:31.708Z",
  "path": "/api/v1/users",
  "method": "GET"
}
```

#### 4. 资源不存在

```json
{
  "success": false,
  "statusCode": 404,
  "error": "NotFoundException",
  "message": "用户不存在",
  "timestamp": "2025-07-15T17:43:31.708Z",
  "path": "/api/v1/users/non-existent-id",
  "method": "GET"
}
```

#### 5. 限流错误

```json
{
  "success": false,
  "statusCode": 429,
  "error": "TooManyRequestsException",
  "message": "请求过于频繁，请稍后再试",
  "timestamp": "2025-07-15T17:43:31.708Z",
  "path": "/api/v1/auth/login",
  "method": "POST"
}
```

## 🔧 实现指南

### 1. 后端实现

#### 使用装饰器

```typescript
import { ResponseFormatter } from '../../common/decorators/response-formatter.decorator';

@Controller('users')
@ResponseFormatter // 控制器级别应用
export class UsersController {
  @Get()
  @ResponseFormatter // 方法级别应用（可选，如果控制器已应用）
  async getUsers() {
    return users; // 装饰器会自动包装成标准格式
  }
}
```

#### Swagger文档定义

```typescript
import { AuthApiResponses, createStandardErrorResponse } from '../../common/swagger/standard-responses';

@ApiResponse(AuthApiResponses.login)
@ApiResponse(createStandardErrorResponse(401, '用户名或密码错误'))
async login(@Body() loginDto: LoginDto) {
  return await this.authService.login(loginDto);
}
```

### 2. 前端处理

#### JavaScript/TypeScript

```typescript
interface StandardResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  path: string;
  method: string;
  requestId: number;
  metadata: {
    version: string;
    environment: string;
    userAgent: string;
    ip: string;
  };
}

interface ErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
  method: string;
  details?: Array<{
    field: string;
    value: any;
    constraints: Record<string, string>;
    messages: string[];
  }>;
}

// API调用示例
async function apiCall<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const result: StandardResponse<T> | ErrorResponse = await response.json();

  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.message);
  }
}
```

## 📝 开发规范

### 1. 必须遵循的规则

1. **所有API端点**都必须返回标准格式
2. **成功响应**的 `success` 字段必须为 `true`
3. **错误响应**的 `success` 字段必须为 `false`
4. **时间戳**必须使用ISO 8601格式
5. **错误消息**必须对用户友好且具有指导性

### 2. 推荐做法

1. 使用 `@ResponseFormatter` 装饰器自动格式化响应
2. 为每个API端点定义完整的Swagger文档
3. 在错误响应中提供详细的 `details` 信息
4. 使用有意义的 `message` 描述操作结果
5. 保持 `requestId` 的唯一性用于日志追踪

### 3. 禁止事项

1. **禁止**直接返回原始数据而不包装
2. **禁止**在成功响应中省略必需字段
3. **禁止**在错误响应中暴露敏感信息
4. **禁止**使用不一致的字段命名
5. **禁止**修改标准格式结构

## 🧪 测试验证

### 自动化测试脚本

项目提供了自动化测试脚本来验证API响应格式的一致性：

```bash
# 运行API格式审查
cd python_tests
python api_format_audit.py
```

### 手动验证清单

- [ ] 响应包含所有必需字段
- [ ] `success` 字段值正确
- [ ] `timestamp` 格式为ISO 8601
- [ ] 错误响应包含适当的状态码
- [ ] Swagger文档与实际响应一致

## 📚 相关文档

- [认证API文档](./authentication.md)
- [用户API文档](./users.md)
- [产品API文档](./products.md)
- [错误代码文档](./error-codes.md)
- [前端集成指南](./frontend-integration.md)

## 📞 支持与反馈

如有疑问或建议，请联系：

- 维护者: AI Assistant
- 项目团队: KK Backend Team

---

**文档信息**

- 创建时间: 2025-07-15
- 最后更新: 2025-07-15
- 维护者: AI Assistant
- 审核者: 项目团队
