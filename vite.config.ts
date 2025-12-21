import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@hooks': path.resolve(__dirname, './hooks'),
        '@constants': path.resolve(__dirname, './constants'),
        '@styles': path.resolve(__dirname, './styles'),
        '@router': path.resolve(__dirname, './router'),
        '@components': path.resolve(__dirname, './components'),
        '@modules': path.resolve(__dirname, './modules'),
        '@lib': path.resolve(__dirname, './lib'),
        '@types': path.resolve(__dirname, './types'),
        '@utils': path.resolve(__dirname, './utils'),
      },
    },
    // 构建优化配置
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // React 核心
            'vendor-react': ['react', 'react-dom'],
            // 图表库 (recharts 较大)
            'vendor-charts': ['recharts'],
            // 动画库
            'vendor-motion': ['framer-motion'],
            // Excel 处理库
            'vendor-xlsx': ['xlsx'],
            // UI 组件库
            'vendor-radix': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-popover',
              '@radix-ui/react-tooltip',
            ],
            // 表单相关
            'vendor-form': ['react-hook-form', '@hookform/resolvers', 'zod'],
            // 国际化
            'vendor-i18n': ['i18next', 'react-i18next'],
            // 数据获取
            'vendor-query': ['@tanstack/react-query', '@tanstack/react-table'],
          },
        },
      },
      // 提高 chunk 警告阈值
      chunkSizeWarningLimit: 600,
    },
    // Vitest 配置
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      include: ['tests/**/*.{test,spec}.{js,ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'tests/', '**/*.d.ts'],
      },
    },
  };
});
