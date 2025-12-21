import React from 'react';
import { cn } from '@/utils/cn';

export interface AvatarProps {
  /** 图片 URL */
  src?: string;
  /** 替代文本 */
  alt?: string;
  /** 用户名 (用于生成首字母) */
  name?: string;
  /** 尺寸 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 形状 */
  shape?: 'circle' | 'square';
  /** 自定义类名 */
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const shapeClasses = {
  circle: 'rounded-full',
  square: 'rounded-lg',
};

// 根据名字生成颜色
const getColorFromName = (name: string) => {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// 获取首字母
const getInitials = (name: string) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * 头像组件
 * 支持图片、首字母 fallback、多种尺寸和形状
 */
export function Avatar({
  src,
  alt,
  name = '',
  size = 'md',
  shape = 'circle',
  className,
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  const showFallback = !src || imgError;
  const initials = getInitials(name);
  const bgColor = getColorFromName(name || 'default');

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center overflow-hidden shrink-0',
        sizeClasses[size],
        shapeClasses[shape],
        showFallback ? bgColor : 'bg-gray-200',
        className
      )}
    >
      {!showFallback ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="font-medium text-white select-none">{initials}</span>
      )}
    </div>
  );
}

export default Avatar;
