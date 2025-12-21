/**
 * 环境配置模块
 *
 * 提供类型安全的环境变量访问
 * 支持开发、测试、预发布、生产等多环境
 */

// ============ 环境类型 ============

/** 环境枚举 */
export type Environment = 'development' | 'test' | 'staging' | 'production';

/** 环境配置接口 */
export interface EnvConfig {
  /** API 基础 URL */
  apiBaseUrl: string;
  /** 是否开发模式 */
  isDevelopment: boolean;
  /** 是否生产模式 */
  isProduction: boolean;
  /** 是否启用 Mock 数据 */
  useMock: boolean;
  /** API 超时时间 (ms) */
  apiTimeout: number;
  /** 应用名称 */
  appName: string;
}

// ============ 环境变量读取 ============

/** Vite 环境变量类型 */
interface ImportMetaEnv {
  readonly MODE: string;
  readonly VITE_API_URL?: string;
  readonly VITE_USE_MOCK?: string;
  readonly VITE_API_TIMEOUT?: string;
  readonly VITE_APP_NAME?: string;
  [key: string]: string | undefined;
}

/**
 * 安全读取 Vite 环境变量
 */
function getEnvVar(key: string, defaultValue: string = ''): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Vite import.meta.env 类型在非 Vite 环境下不可用
  if (typeof import.meta !== 'undefined' && (import.meta as { env?: ImportMetaEnv }).env) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((import.meta as { env?: ImportMetaEnv }).env as ImportMetaEnv)[key] ?? defaultValue;
  }
  // Node.js 环境 (测试等)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] ?? defaultValue;
  }
  return defaultValue;
}

/**
 * 读取布尔环境变量
 */
function getBoolEnvVar(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key, '');
  if (value === '') return defaultValue;
  return value === 'true' || value === '1';
}

/**
 * 读取数字环境变量
 */
function getNumberEnvVar(key: string, defaultValue: number): number {
  const value = getEnvVar(key, '');
  if (value === '') return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

// ============ 环境判断 ============

/**
 * 获取当前环境
 */
function getCurrentEnvironment(): Environment {
  const mode = getEnvVar('MODE', 'development');

  switch (mode) {
    case 'production':
      return 'production';
    case 'staging':
      return 'staging';
    case 'test':
      return 'test';
    default:
      return 'development';
  }
}

// ============ 环境配置映射 ============

/** 各环境默认 API 基础 URL */
const DEFAULT_API_URLS: Record<Environment, string> = {
  development: 'http://localhost:3003/api/v1',
  test: 'http://localhost:3003/api/v1',
  staging: 'https://staging-api.example.com/api/v1',
  production: 'https://api.example.com/api/v1',
};

// ============ 导出配置 ============

/** 当前环境 */
export const ENV = getCurrentEnvironment();

/**
 * 环境配置对象
 *
 * @example
 * import { env } from '@/config/env';
 * console.log(env.apiBaseUrl); // 'http://localhost:3003/api/v1'
 * if (env.isDevelopment) { ... }
 */
export const env: EnvConfig = {
  // API 配置：优先使用环境变量，否则使用默认值
  apiBaseUrl: getEnvVar('VITE_API_URL', DEFAULT_API_URLS[ENV]),

  // 环境判断
  isDevelopment: ENV === 'development',
  isProduction: ENV === 'production',

  // Mock 配置（仅开发环境默认启用）
  useMock: getBoolEnvVar('VITE_USE_MOCK', ENV === 'development'),

  // 超时配置
  apiTimeout: getNumberEnvVar('VITE_API_TIMEOUT', 10000),

  // 应用信息
  appName: getEnvVar('VITE_APP_NAME', 'Sales Admin'),
};

/**
 * 打印环境信息（仅开发模式）
 */
export function logEnvInfo(): void {
  if (env.isDevelopment) {
    console.log('🌍 Environment:', ENV);
    console.log('🔗 API Base URL:', env.apiBaseUrl);
    console.log('🎭 Use Mock:', env.useMock);
  }
}
