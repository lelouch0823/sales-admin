import React, { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';
import { Product, ProductStatus } from '../../types';
import { useTranslation } from 'react-i18next';

interface InfoTabProps {
  form: Partial<Product>;
  onChange: (updates: Partial<Product>) => void;
  isEditMode: boolean; // 编辑模式下部分字段 (如 SKU) 禁用
}

/**
 * PIM 编辑器 - 基础信息 Tab
 * 职责:
 * 1. 编辑商品核心字段 (SKU, 名称, 品牌, 描述)
 * 2. 处理标签 (Tags) 的输入交互 (回车/逗号生成标签)
 */
export const InfoTab: React.FC<InfoTabProps> = ({ form, onChange, isEditMode }) => {
  const { t } = useTranslation();
  const [tagInput, setTagInput] = useState('');
  const [showTagsHelp, setShowTagsHelp] = useState(false);

  // --- 标签处理逻辑 ---
  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // 1. 输入法合成检查 (IME Composition Check): 防止在拼音输入过程中触发 Enter
      if (e.nativeEvent.isComposing) return;

      // 2. 允许回车键 (Enter) 或 逗号 (,) 触发标签生成
      if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          const trimmed = tagInput.trim().replace(/,/g, ''); // 清理输入
          
          if (trimmed) {
              // 避免重复添加
              if (!form.tags?.includes(trimmed)) {
                  onChange({ tags: [...(form.tags || []), trimmed] });
              }
              // 无论是否重复，都清空输入框，重置输入流
              setTagInput('');
          }
      } 
      // 3. Backspace 删除: 当输入框为空时，按退格键删除最后一个标签
      else if (e.key === 'Backspace' && !tagInput && form.tags?.length) {
          const newTags = [...(form.tags || [])];
          newTags.pop();
          onChange({ tags: newTags });
      }
  };

  const removeTag = (tagToRemove: string) => {
      onChange({ tags: form.tags?.filter(t => t !== tagToRemove) });
  };

  return (
      <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('pim.editor.sku')}</label>
                  <input 
                    className="w-full border p-2 rounded text-sm bg-gray-50 focus:bg-white focus:border-brand transition-colors outline-none disabled:opacity-60" 
                    value={form.sku || ''} 
                    onChange={e => onChange({ sku: e.target.value })} 
                    disabled={isEditMode} // SKU 是主键，编辑模式下不可修改
                    placeholder={t('pim.editor.sku_placeholder')}
                  />
              </div>
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('pim.editor.brand')}</label>
                  <input 
                    className="w-full border p-2 rounded text-sm bg-gray-50 focus:bg-white focus:border-brand transition-colors outline-none" 
                    value={form.brand || ''} 
                    onChange={e => onChange({ brand: e.target.value })} 
                    placeholder={t('pim.editor.brand_placeholder')}
                  />
              </div>
          </div>
          <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('pim.editor.name')}</label>
              <input 
                className="w-full border p-2 rounded text-sm bg-gray-50 focus:bg-white focus:border-brand transition-colors outline-none" 
                value={form.name || ''} 
                onChange={e => onChange({ name: e.target.value })} 
                placeholder={t('pim.editor.name_placeholder')}
              />
          </div>
          <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('pim.editor.description')}</label>
              <textarea 
                className="w-full border p-2 rounded text-sm h-24 resize-none bg-gray-50 focus:bg-white focus:border-brand transition-colors outline-none" 
                value={form.description || ''} 
                onChange={e => onChange({ description: e.target.value })} 
                placeholder={t('pim.editor.description_placeholder')}
              />
          </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('pim.editor.category')}</label>
                  <input 
                    className="w-full border p-2 rounded text-sm bg-gray-50 focus:bg-white focus:border-brand transition-colors outline-none" 
                    value={form.category || ''} 
                    onChange={e => onChange({ category: e.target.value })} 
                    placeholder={t('pim.editor.category_placeholder')}
                  />
              </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('pim.editor.status')}</label>
                  <select className="w-full border p-2 rounded text-sm bg-gray-50 focus:bg-white focus:border-brand transition-colors outline-none" value={form.status} onChange={e => onChange({ status: e.target.value as ProductStatus })}>
                      <option value="DRAFT">{t('consts.status.DRAFT')}</option>
                      <option value="PUBLISHED">{t('consts.status.PUBLISHED')}</option>
                      <option value="UNPUBLISHED">{t('consts.status.UNPUBLISHED')}</option>
                  </select>
              </div>
          </div>
           
           {/* 标签输入区域 */}
           <div>
              <div className="flex items-center gap-2 mb-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase">{t('pim.editor.tags')}</label>
                  <button onClick={() => setShowTagsHelp(!showTagsHelp)} className="text-gray-400 hover:text-brand transition-colors">
                      <HelpCircle size={14} />
                  </button>
                  {showTagsHelp && (
                      <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded animate-in fade-in">
                          {t('pim.editor.tags_help')}
                      </span>
                  )}
              </div>
              <div className="w-full border p-2 rounded text-sm flex flex-wrap gap-2 focus-within:bg-white focus-within:border-brand transition-colors bg-gray-50">
                  {form.tags?.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2 py-1 rounded bg-gray-200 text-xs font-medium text-gray-700">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="ml-1 text-gray-400 hover:text-gray-600"><X size={12} /></button>
                      </span>
                  ))}
                  <input 
                    type="text"
                    className="outline-none flex-1 min-w-[100px] text-sm bg-transparent" 
                    placeholder={form.tags?.length ? '' : t('pim.editor.tags_placeholder')}
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                  />
              </div>
          </div>
      </div>
  );
};