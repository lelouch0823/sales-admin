import { Variants, Transition } from 'framer-motion';

/**
 * Framer Motion 动画预设
 * 统一的动画配置，确保应用内动画风格一致
 */

// 通用过渡配置
export const springTransition: Transition = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
};

export const easeTransition: Transition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3,
};

// --- 进入/退出动画 ---

export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
};

export const fadeInDown: Variants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

export const fadeInLeft: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
};

export const fadeInRight: Variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
};

export const scaleIn: Variants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
};

// --- 容器/列表动画 ---

export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

export const listItem: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

// --- 模态框/抽屉动画 ---

export const modalOverlay: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const modalContent: Variants = {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: springTransition,
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 10,
        transition: { duration: 0.2 },
    },
};

export const drawerRight: Variants = {
    initial: { x: '100%' },
    animate: { x: 0, transition: springTransition },
    exit: { x: '100%', transition: { duration: 0.2 } },
};

export const drawerLeft: Variants = {
    initial: { x: '-100%' },
    animate: { x: 0, transition: springTransition },
    exit: { x: '-100%', transition: { duration: 0.2 } },
};

// --- 交互动画 ---

export const buttonTap = {
    scale: 0.98,
    transition: { duration: 0.1 },
};

export const cardHover = {
    scale: 1.02,
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    transition: springTransition,
};

// --- 页面过渡动画 ---

export const pageTransition: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
};
