/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // 使用 class 策略支持暗色主题
    theme: {
        extend: {
            // ========== 颜色系统 ==========
            colors: {
                // 主色调
                primary: {
                    DEFAULT: '#6366f1',
                    hover: '#4f46e5',
                    light: '#e0e7ff',
                    dark: '#3730a3',
                },
                // 品牌色 (用于强调)
                brand: '#6366f1',
                // 语义色
                success: {
                    DEFAULT: '#10b981',
                    light: '#d1fae5',
                },
                warning: {
                    DEFAULT: '#f59e0b',
                    light: '#fef3c7',
                },
                danger: {
                    DEFAULT: '#ef4444',
                    light: '#fee2e2',
                },
                info: {
                    DEFAULT: '#3b82f6',
                    light: '#dbeafe',
                },
                // 页面背景
                page: '#f9fafb',
                surface: '#ffffff',
                // 中性色 (覆盖默认 gray)
                gray: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                },
            },
            // ========== 间距 ==========
            spacing: {
                'xs': '0.25rem',
                'sm': '0.5rem',
                'md': '1rem',
                'lg': '1.5rem',
                'xl': '2rem',
                '2xl': '3rem',
            },
            // ========== 字体 ==========
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
            },
            fontSize: {
                'xs': '0.75rem',
                'sm': '0.875rem',
                'base': '1rem',
                'lg': '1.125rem',
                'xl': '1.25rem',
                '2xl': '1.5rem',
                '3xl': '1.875rem',
            },
            // ========== 圆角 ==========
            borderRadius: {
                'sm': '0.375rem',
                'md': '0.5rem',
                'lg': '0.75rem',
                'xl': '1rem',
            },
            // ========== 阴影 ==========
            boxShadow: {
                'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
                'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
            // ========== 过渡 ==========
            transitionDuration: {
                'fast': '150ms',
                'normal': '300ms',
                'slow': '500ms',
            },
            // ========== 布局 ==========
            width: {
                'sidebar': '16rem',
                'sidebar-collapsed': '5rem',
            },
            height: {
                'header': '4rem',
            },
            maxWidth: {
                'content': '80rem',
            },
            // ========== Z-Index ==========
            zIndex: {
                'dropdown': '100',
                'sticky': '200',
                'fixed': '300',
                'modal-backdrop': '400',
                'modal': '500',
                'popover': '600',
                'tooltip': '700',
                'toast': '800',
            },
            // ========== 动画 ==========
            animation: {
                'fade-in': 'fade-in 0.3s ease-out',
                'slide-up': 'slide-in-up 0.3s ease-out',
                'slide-down': 'slide-in-down 0.3s ease-out',
                'scale-in': 'scale-in 0.3s ease-out',
                'shimmer': 'shimmer 1.5s infinite',
            },
            keyframes: {
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                'slide-in-up': {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-in-down': {
                    from: { opacity: '0', transform: 'translateY(-10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'scale-in': {
                    from: { opacity: '0', transform: 'scale(0.95)' },
                    to: { opacity: '1', transform: 'scale(1)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
        },
    },
    plugins: [],
}
