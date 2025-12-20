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
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
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
      }
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
        exclude: [
          'node_modules/',
          'tests/',
          '**/*.d.ts',
        ],
      },
    },
  };
});
