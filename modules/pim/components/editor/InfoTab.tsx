import React, { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '../../../../hooks/useZodForm';

interface InfoTabProps {
    isEditMode: boolean; // 编辑模式下部分字段 (如 SKU) 禁用
}

/**
 * PIM 编辑器 - 基础信息 Tab
 */
export const InfoTab: React.FC<InfoTabProps> = ({ isEditMode }) => {
    const { t } = useTranslation();
    const { register, setValue, watch, formState: { errors } } = useFormContext();
    const [tagInput, setTagInput] = useState('');
    const [showTagsHelp, setShowTagsHelp] = useState(false);

    const tags = watch('tags') || [];

    // --- 标签处理逻辑 ---
    const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // 1. 输入法合成检查
        if (e.nativeEvent.isComposing) return;

        // 2. 允许回车键 (Enter) 或 逗号 (,) 触发标签生成
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const trimmed = tagInput.trim().replace(/,/g, '');

            if (trimmed) {
                // 避免重复添加
                if (!tags.includes(trimmed)) {
                    setValue('tags', [...tags, trimmed]);
                }
                setTagInput('');
            }
        }
        // 3. Backspace 删除
        else if (e.key === 'Backspace' && !tagInput && tags.length) {
            const newTags = [...tags];
            newTags.pop();
            setValue('tags', newTags);
        }
    };

    const removeTag = (tagToRemove: string) => {
        setValue('tags', tags.filter((t: string) => t !== tagToRemove));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('pim.editor.sku')}</label>
                    <input
                        className={`w-full border p-2 rounded text-sm bg-gray-50 focus:bg-white focus:border-brand transition-colors outline-none disabled:opacity-60 ${errors.sku ? 'border-red-500' : ''}`}
                        {...register('sku')}
                        disabled={isEditMode}
                        placeholder={t('pim.editor.sku_placeholder')}
                    />
                    {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message as string}</p>}
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('pim.editor.brand')}</label>
                    <input
                        className={`w-full border p-2 rounded text-sm bg-gray-50 focus:bg-white focus:border-brand transition-colors outline-none ${errors.brand ? 'border-red-500' : ''}`}
                        {...register('brand')}
                        placeholder={t('pim.editor.brand_placeholder')}
                    />
                    {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message as string}</p>}
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('pim.editor.name')}</label>
                <input
                    className={`w-full border p-2 rounded text-sm bg-gray-50 focus:bg-white focus:border-brand transition-colors outline-none ${errors.name ? 'border-red-500' : ''}`}
                    {...register('name')}
                    placeholder={t('pim.editor.name_placeholder')}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('pim.editor.description')}</label>
                <textarea
                    className="w-full border p-2 rounded text-sm h-24 resize-none bg-gray-50 focus:bg-white focus:border-brand transition-colors outline-none"
                    {...register('description')}
                    placeholder={t('pim.editor.description_placeholder')}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('pim.editor.category')}</label>
                    <input
                        className={`w-full border p-2 rounded text-sm bg-gray-50 focus:bg-white focus:border-brand transition-colors outline-none ${errors.category ? 'border-red-500' : ''}`}
                        {...register('category')}
                        placeholder={t('pim.editor.category_placeholder')}
                    />
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message as string}</p>}
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('pim.editor.status')}</label>
                    <select
                        className="w-full border p-2 rounded text-sm bg-gray-50 focus:bg-white focus:border-brand transition-colors outline-none"
                        {...register('status')}
                    >
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
                    <button type="button" onClick={() => setShowTagsHelp(!showTagsHelp)} className="text-gray-400 hover:text-brand transition-colors">
                        <HelpCircle size={14} />
                    </button>
                    {showTagsHelp && (
                        <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded animate-in fade-in">
                            {t('pim.editor.tags_help')}
                        </span>
                    )}
                </div>
                <div className="w-full border p-2 rounded text-sm flex flex-wrap gap-2 focus-within:bg-white focus-within:border-brand transition-colors bg-gray-50">
                    {tags.map((tag: string) => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 rounded bg-gray-200 text-xs font-medium text-gray-700">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-gray-400 hover:text-gray-600"><X size={12} /></button>
                        </span>
                    ))}
                    <input
                        type="text"
                        className="outline-none flex-1 min-w-[100px] text-sm bg-transparent"
                        placeholder={tags.length ? '' : t('pim.editor.tags_placeholder')}
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={addTag}
                    />
                </div>
            </div>
        </div>
    );
};