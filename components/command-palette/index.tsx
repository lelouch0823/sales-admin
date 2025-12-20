import React, { useState, useEffect, useRef } from 'react';
import { Search, Command } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CommandPaletteProps, SearchResult } from './types';
import { useCommandData } from './useCommandData';
import { CommandItem } from './CommandItem';

/**
 * 全局命令面板组件 (CommandPalette)
 * 职责:
 * 1. 提供类似 MacOS Spotlight 的全局搜索入口
 * 2. 支持键盘导航 (上下箭头、回车、ESC)
 * 3. 实时搜索导航、商品、客户和执行快捷动作
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 获取过滤后的搜索结果
  const results = useCommandData(query);

  // --- Effect Hooks ---

  // 1. 打开时重置状态并聚焦输入框
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // 2. 键盘导航逻辑 (Keyboard Navigation)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length); // 循环向下
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length); // 循环向上
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected) handleSelect(selected);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // 3. 自动滚动逻辑 (Auto-scroll): 确保选中项始终在视图内
  useEffect(() => {
    if (listRef.current) {
        const node = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
        node?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  // --- Handlers ---

  const handleSelect = (item: SearchResult) => {
    if (item.action) {
        item.action(); // 执行回调动作 (如登出)
    } else if (item.type === 'NAV') {
        onNavigate(item.id); // 页面跳转
    } else if (item.type === 'PRODUCT') {
        onNavigate('pim-list'); // 模拟跳转到商品详情 (实际应跳转 id)
    } else if (item.type === 'CUSTOMER') {
        onNavigate('customers'); // 模拟跳转到客户详情
    }
    onClose();
  };

  if (!isOpen) return null;

  // --- Render ---

  let lastSection = '';

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4" onClick={onClose}>
        {/* 背景遮罩 */}
        <div className="fixed inset-0 bg-black/25 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200" />
        
        {/* 模态框窗口 */}
        <div 
            className="w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden relative flex flex-col animate-in slide-in-from-bottom-4 duration-300 border border-gray-200 ring-1 ring-black/5"
            onClick={e => e.stopPropagation()}
        >
            {/* 输入区域 */}
            <div className="flex items-center px-4 py-4 border-b border-gray-100 relative bg-white/50">
                <Search size={20} className="text-gray-400 mr-3 pointer-events-none" />
                <input 
                    ref={inputRef}
                    className="flex-1 text-lg bg-transparent outline-none placeholder:text-gray-400 text-gray-800 h-6"
                    placeholder={t('cmd.placeholder')}
                    value={query}
                    onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                />
                <div className="absolute right-4 flex items-center gap-2">
                    <kbd className="hidden sm:inline-flex items-center h-5 px-2 text-[10px] font-medium text-gray-400 bg-gray-100 rounded border border-gray-200 shadow-sm">ESC</kbd>
                </div>
            </div>

            {/* 结果列表区域 */}
            <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2 scroll-smooth custom-scrollbar">
                {results.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 text-sm flex flex-col items-center">
                        <Command size={32} className="text-gray-300 mb-3" />
                        <p>{t('cmd.no_results')}</p>
                        <p className="text-xs text-gray-400 mt-1">Try searching for products, customers, or actions.</p>
                    </div>
                ) : (
                    results.map((item, idx) => {
                        const showHeader = item.section !== lastSection;
                        lastSection = item.section;

                        return (
                            <React.Fragment key={`${item.type}-${item.id}-${idx}`}>
                                {/* 分组标题 */}
                                {showHeader && (
                                    <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider sticky top-0 bg-white/95 backdrop-blur z-10 shadow-sm">
                                        {item.section}
                                    </div>
                                )}
                                <CommandItem 
                                    item={item} 
                                    isActive={idx === selectedIndex} 
                                    query={query}
                                    onSelect={() => handleSelect(item)}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                    index={idx}
                                />
                            </React.Fragment>
                        );
                    })
                )}
            </div>
            
            {/* 底部状态栏 / 提示 */}
            <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-100 text-[10px] text-gray-400 flex items-center justify-end gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-1">
                    <span className="bg-white border border-gray-200 px-1.5 py-0.5 rounded font-bold shadow-sm">↑</span>
                    <span className="bg-white border border-gray-200 px-1.5 py-0.5 rounded font-bold shadow-sm">↓</span>
                    <span>to navigate</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="bg-white border border-gray-200 px-1.5 py-0.5 rounded font-bold shadow-sm">↵</span>
                    <span>to select</span>
                </div>
            </div>
        </div>
    </div>
  );
};