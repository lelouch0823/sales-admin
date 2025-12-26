# 🔌 第三方集成 API 文档

> **KK Backend 第三方集成 API 接口文档** | 最后更新: 2025-07-13 | 维护者: AI Assistant

## 🎯 概述

本文档详细介绍 KK Backend 项目中第三方库集成的 API 接口，包括队列管理、缓存操作、健康检查等功能的 REST API。

## 📋 API 分类

### 🚀 队列管理 API

- [队列统计](#队列统计-api) - 获取队列状态和统计信息
- [任务管理](#任务管理-api) - 任务的增删改查操作
- [队列控制](#队列控制-api) - 队列的暂停、恢复、清理
- [监控面板](#监控面板-api) - 队列监控仪表板接口

### 🔴 缓存管理 API

- [缓存操作](#缓存操作-api) - 基本的缓存增删改查
- [缓存演示](#缓存演示-api) - 缓存功能演示接口
- [缓存统计](#缓存统计-api) - 缓存性能统计信息

### 🛡️ 健康检查 API

- [系统健康](#系统健康-api) - 整体系统健康状态
- [组件健康](#组件健康-api) - 各组件详细健康检查

---

## 🚀 队列管理 API

### 队列统计 API

#### 获取所有队列统计信息

```http
GET /api/queues/stats
```

**响应示例:**

```json
{
  "success": true,
  "data": [
    {
      "name": "image-processing",
      "waiting": 5,
      "active": 2,
      "completed": 150,
      "failed": 3,
      "delayed": 0,
      "paused": false
    },
    {
      "name": "email",
      "waiting": 12,
      "active": 1,
      "completed": 89,
      "failed": 1,
      "delayed": 2,
      "paused": false
    }
  ]
}
```

#### 获取指定队列统计信息

```http
GET /api/queues/{queueName}/stats
```

**路径参数:**

- `queueName` (string): 队列名称

**响应示例:**

```json
{
  "success": true,
  "data": {
    "name": "email",
    "waiting": 12,
    "active": 1,
    "completed": 89,
    "failed": 1,
    "delayed": 2,
    "paused": false
  }
}
```

### 任务管理 API

#### 获取队列中的任务列表

```http
GET /api/queues/{queueName}/jobs?status=waiting&start=0&end=50
```

**查询参数:**

- `status` (string): 任务状态 (waiting, active, completed, failed, delayed)
- `start` (number): 起始位置，默认 0
- `end` (number): 结束位置，默认 50

**响应示例:**

```json
{
  "success": true,
  "data": [
    {
      "id": "job_123",
      "name": "send-email",
      "data": {
        "to": "user@example.com",
        "subject": "Welcome"
      },
      "progress": 0,
      "status": "waiting",
      "createdAt": "2025-07-13T10:00:00Z",
      "attempts": 0,
      "delay": 0
    }
  ]
}
```

#### 添加邮件发送任务

```http
POST /api/queues/email/jobs
```

**请求体:**

```json
{
  "type": "send-email",
  "to": "user@example.com",
  "subject": "Welcome to our platform",
  "template": "welcome",
  "data": {
    "username": "John Doe",
    "activationLink": "https://example.com/activate/123"
  }
}
```

**响应示例:**

```json
{
  "success": true,
  "jobId": "job_456",
  "message": "邮件发送任务已添加到队列"
}
```

#### 重试失败的任务

```http
POST /api/queues/{queueName}/jobs/{jobId}/retry
```

**响应示例:**

```json
{
  "success": true,
  "message": "任务 job_123 已重新加入队列"
}
```

### 队列控制 API

#### 暂停队列

```http
POST /api/queues/{queueName}/pause
```

#### 恢复队列

```http
POST /api/queues/{queueName}/resume
```

#### 清空队列

```http
POST /api/queues/{queueName}/clean
```

### 监控面板 API

#### 获取仪表板概览数据

```http
GET /api/queue-dashboard/overview
```

**响应示例:**

```json
{
  "success": true,
  "data": {
    "stats": [...],
    "metrics": {
      "total": {
        "totalWaiting": 25,
        "totalActive": 5,
        "totalCompleted": 500,
        "totalFailed": 8,
        "totalQueues": 6
      }
    },
    "alerts": [
      {
        "queue": "email",
        "level": "warning",
        "message": "High number of waiting jobs",
        "value": 50,
        "threshold": 100
      }
    ],
    "timestamp": "2025-07-13T10:00:00Z"
  }
}
```

#### 获取定时任务列表

```http
GET /api/queue-dashboard/scheduled-jobs
```

**响应示例:**

```json
{
  "success": true,
  "data": [
    {
      "name": "daily-cleanup",
      "queueName": "cleanup",
      "jobType": "cleanup-temp-files",
      "cronExpression": "0 2 * * *",
      "enabled": true,
      "description": "每日清理临时文件"
    }
  ]
}
```

---

## 🔴 缓存管理 API

### 缓存操作 API

#### 基本缓存操作演示

```http
GET /api/cache-demo/basic/{key}
```

**路径参数:**

- `key` (string): 缓存键

**响应示例:**

```json
{
  "success": true,
  "data": {
    "original": {
      "message": "Hello from cache!",
      "timestamp": "2025-07-13T10:00:00Z",
      "random": 0.123456
    },
    "cached": {
      "message": "Hello from cache!",
      "timestamp": "2025-07-13T10:00:00Z",
      "random": 0.123456
    },
    "exists": true,
    "ttl": 295,
    "stats": {
      "hits": 1,
      "misses": 0,
      "sets": 1,
      "deletes": 0,
      "hitRate": 100
    }
  }
}
```

#### 缓存穿透保护演示

```http
GET /api/cache-demo/protection/{userId}
```

**响应示例:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "name": "User 123",
      "email": "user123@example.com",
      "createdAt": "2025-07-13T10:00:00Z"
    },
    "duration": "15ms",
    "fromCache": true
  }
}
```

#### 批量缓存操作

```http
POST /api/cache-demo/batch
```

**请求体:**

```json
{
  "keys": ["product:1", "product:2", "product:3"],
  "values": [
    { "id": "1", "name": "Laptop", "price": 999.99 },
    { "id": "2", "name": "Mouse", "price": 29.99 },
    { "id": "3", "name": "Keyboard", "price": 79.99 }
  ]
}
```

### 缓存统计 API

#### 获取缓存统计信息

```http
GET /api/cache-demo/stats
```

**响应示例:**

```json
{
  "success": true,
  "data": {
    "cache": {
      "hits": 150,
      "misses": 25,
      "sets": 100,
      "deletes": 10,
      "hitRate": 85.7,
      "totalOperations": 285
    },
    "redis": {
      "version": "7.0.0",
      "uptime": 86400,
      "memory": "2.5MB",
      "clients": 5,
      "operations": 1500
    }
  }
}
```

---

## 🛡️ 健康检查 API

### 系统健康 API

#### 获取系统整体健康状态

```http
GET /health
```

**响应示例:**

```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    },
    "redis": {
      "status": "up",
      "responseTime": "5ms",
      "memory": {
        "used": "2.5MB",
        "healthy": true
      }
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    },
    "redis": {
      "status": "up",
      "responseTime": "5ms"
    }
  }
}
```

#### 获取 Redis 健康状态

```http
GET /health/redis
```

**响应示例:**

```json
{
  "status": "up",
  "ping": "PONG",
  "responseTime": "5ms",
  "memory": {
    "used": "2.50MB",
    "threshold": "1024MB",
    "healthy": true
  },
  "connections": {
    "current": 5,
    "threshold": 100,
    "healthy": true
  },
  "mode": "standalone",
  "version": "7.0.0"
}
```

### 组件健康 API

#### 获取队列健康状态

```http
GET /api/queue-dashboard/health
```

**响应示例:**

```json
{
  "success": true,
  "data": {
    "queues": {
      "status": "up",
      "queues": {
        "image-processing": {
          "healthy": true,
          "metrics": {
            "waiting": 5,
            "active": 2,
            "failed": 0
          }
        },
        "email": {
          "healthy": true,
          "metrics": {
            "waiting": 12,
            "active": 1,
            "failed": 1
          }
        }
      }
    }
  }
}
```

---

## 🔧 错误处理

### 标准错误响应格式

```json
{
  "success": false,
  "error": "错误描述",
  "code": "ERROR_CODE",
  "timestamp": "2025-07-13T10:00:00Z",
  "path": "/api/queues/invalid-queue/stats"
}
```

### 常见错误码

| 错误码                   | HTTP状态码 | 描述           |
| ------------------------ | ---------- | -------------- |
| `QUEUE_NOT_FOUND`        | 404        | 队列不存在     |
| `JOB_NOT_FOUND`          | 404        | 任务不存在     |
| `INVALID_QUEUE_NAME`     | 400        | 无效的队列名称 |
| `CACHE_OPERATION_FAILED` | 500        | 缓存操作失败   |
| `REDIS_CONNECTION_ERROR` | 503        | Redis连接错误  |

---

## 🔗 相关链接

- [第三方集成详细文档](../07-modules/third-party-integrations.md)
- [系统架构文档](../02-architecture/system-design.md)
- [部署配置指南](../05-deployment/README.md)
- [API 总览文档](README.md)

---

**文档信息**

- 创建时间: 2025-07-13
- 最后更新: 2025-07-13
- 维护者: AI Assistant
- 审核者: API团队
