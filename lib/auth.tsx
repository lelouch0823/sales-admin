import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { User, Role } from '../types';
import { MOCK_USERS } from './data/users';
import { authApi, HttpError } from './api';
import { useToast } from './toast';

// --- 类型定义 ---
interface AuthSession {
  token: string;
  userId: string;
  expiresAt: number; // 过期时间戳
}

interface AuthContextType {
  user: User | null; // 当前登录用户对象
  isAuthenticated: boolean; // 是否已认证
  isLoading: boolean; // 认证初始化中
  error: string | null; // 登录错误信息
  /**
   * 登录方法
   * @param email 用户邮箱
   * @param password 密码 (Mock 模式下可选)
   * @param rememberMe 是否记住我 (延长 Session 有效期)
   */
  login: (email: string, password?: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  switchUser: (userId: string) => void; // 开发调试用：模拟身份切换
  // RBAC 权限检查辅助方法
  hasRole: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'WR_DO_SESSION_V1'; // LocalStorage 键名

/**
 * AuthProvider 组件
 * 职责: 管理全局用户认证状态、Session 持久化、自动登出逻辑
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { success, error: toastError, info } = useToast();

  // 定时器引用，用于定期检查 Session 过期
  const checkIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- 辅助方法: 验证 Session 是否有效 ---
  const validateSession = useCallback((session: AuthSession): boolean => {
    if (Date.now() > session.expiresAt) {
      return false; // Token 已过期
    }
    return true;
  }, []);

  // --- 辅助方法: 清除 Session (登出) ---
  const clearSession = useCallback((showToast: boolean = false) => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    if (showToast) {
      info('Session expired. Please log in again.');
    }
  }, [info]);

  // --- 1. 初始化 / 恢复 Session ---
  // 应用启动时检查本地存储的 Session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedSessionStr = localStorage.getItem(STORAGE_KEY);
        if (storedSessionStr) {
          const session: AuthSession = JSON.parse(storedSessionStr);

          if (validateSession(session)) {
            // 模拟 Token 验证的网络延迟
            await new Promise(resolve => setTimeout(resolve, 400));

            const foundUser = MOCK_USERS.find(u => u.id === session.userId);
            if (foundUser) {
              setUser(foundUser);
            } else {
              // Session 中的用户 ID 在数据库中找不到 (可能用户已被删除)
              clearSession();
            }
          } else {
            console.log('Session expired during init');
            clearSession();
          }
        }
      } catch (e) {
        console.error("Auth init failed", e);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [validateSession, clearSession]);

  // --- 2. 自动登出监控 (Auto-Logout Monitor) ---
  // 定期轮询检查 Session 是否过期
  useEffect(() => {
    if (!user) {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      return;
    }

    // 每分钟检查一次 Session 是否仍然有效
    checkIntervalRef.current = setInterval(() => {
      const storedSessionStr = localStorage.getItem(STORAGE_KEY);
      if (storedSessionStr) {
        const session: AuthSession = JSON.parse(storedSessionStr);
        if (!validateSession(session)) {
          clearSession(true); // 显示过期提示并登出
        }
      } else {
        // Session 被外部删除 (例如在另一个 Tab 登出)
        clearSession();
      }
    }, 60 * 1000);

    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, [user, validateSession, clearSession]);


  // --- 3. 登录动作 ---
  const login = async (email: string, password?: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(email, password || '', rememberMe);

      setUser(response.user);

      // 计算过期时间（默认 24 小时，记住我则 7 天）
      const duration = rememberMe ? 7 * 24 * 3600 * 1000 : 24 * 3600 * 1000;
      const session: AuthSession = {
        token: response.accessToken,
        userId: response.user.id,
        expiresAt: Date.now() + duration
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      success(`Welcome back, ${response.user.name}`);
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.message);
        toastError(err.message);
      } else {
        setError('An unexpected error occurred');
        toastError('Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- 4. 登出动作 ---
  const logout = () => {
    clearSession();
    success('You have been logged out.');
  };

  // --- 5. 开发工具: 切换角色 (Impersonation) ---
  const switchUser = (userId: string) => {
    const foundUser = MOCK_USERS.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      // 更新 Session 以保持持久化
      const session: AuthSession = {
        token: `mock_impersonate_${Date.now()}`,
        userId: foundUser.id,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      success(`Switched to user: ${foundUser.name}`);
    }
  };

  // --- 6. RBAC 权限检查辅助方法 ---
  const hasRole = (allowedRoles: Role[]): boolean => {
    if (!user) return false;
    // 超级管理员拥有所有权限
    if (user.role === 'SUPER_ADMIN') return true;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      logout,
      switchUser,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};