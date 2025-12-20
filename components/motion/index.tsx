import React from 'react';
import { motion, AnimatePresence, HTMLMotionProps, Variants } from 'framer-motion';
import {
    fadeIn,
    fadeInUp,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    listItem,
    springTransition,
    easeTransition,
} from '../../lib/animations';

/**
 * 动画组件抽象层
 * 
 * 设计目标:
 * 1. 隐藏 framer-motion 的具体实现
 * 2. 提供语义化的动画组件
 * 3. 方便未来切换到其他动画库或 CSS 动画
 */

// --- 类型定义 ---

export type AnimationPreset =
    | 'fadeIn'
    | 'fadeInUp'
    | 'fadeInDown'
    | 'fadeInLeft'
    | 'fadeInRight'
    | 'scaleIn'
    | 'listItem';

interface AnimatedBoxProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
    /** 预设动画效果 */
    animation?: AnimationPreset;
    /** 自定义 variants */
    variants?: Variants;
    /** 动画延迟 (秒) */
    delay?: number;
    /** 动画时长 (秒) */
    duration?: number;
    /** 子元素 */
    children: React.ReactNode;
    /** 使用 spring 动画 */
    spring?: boolean;
    /** 挂载时动画 */
    animateOnMount?: boolean;
}

// 预设映射
const presetMap: Record<AnimationPreset, Variants> = {
    fadeIn,
    fadeInUp,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    listItem,
};

/**
 * AnimatedBox - 通用动画容器
 */
export const AnimatedBox: React.FC<AnimatedBoxProps> = ({
    animation = 'fadeIn',
    variants: customVariants,
    delay = 0,
    duration,
    children,
    spring = true,
    animateOnMount = true,
    ...props
}) => {
    const variants = customVariants || presetMap[animation];
    const transition = spring ? springTransition : easeTransition;

    return (
        <motion.div
            variants={variants}
            initial={animateOnMount ? 'initial' : false}
            animate="animate"
            exit="exit"
            transition={{
                ...transition,
                delay,
                ...(duration ? { duration } : {}),
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

/**
 * AnimatedList - 列表动画容器
 */
interface AnimatedListProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
    children: React.ReactNode;
    staggerDelay?: number;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
    children,
    staggerDelay = 0.05,
    ...props
}) => {
    const staggerVariants: Variants = {
        initial: {},
        animate: {
            transition: {
                staggerChildren: staggerDelay,
            },
        },
    };

    return (
        <motion.div
            variants={staggerVariants}
            initial="initial"
            animate="animate"
            {...props}
        >
            {children}
        </motion.div>
    );
};

/**
 * AnimatedListItem - 列表项动画
 */
interface AnimatedListItemProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
    children: React.ReactNode;
}

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
    children,
    ...props
}) => {
    return (
        <motion.div variants={listItem} {...props}>
            {children}
        </motion.div>
    );
};

/**
 * AnimatedPresence - 条件渲染动画包装器
 */
interface AnimatedPresenceWrapperProps {
    children: React.ReactNode;
    mode?: 'sync' | 'wait' | 'popLayout';
}

export const AnimatedPresenceWrapper: React.FC<AnimatedPresenceWrapperProps> = ({
    children,
    mode = 'wait',
}) => {
    return <AnimatePresence mode={mode}>{children}</AnimatePresence>;
};

/**
 * PageTransition - 页面切换动画
 */
interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={easeTransition}
        >
            {children}
        </motion.div>
    );
};

// 导出原始 motion 和 AnimatePresence 供高级用户使用
export { motion, AnimatePresence };
