import React, { useState, useEffect } from 'react';
import { UploadCloud, ArrowUp, ArrowDown, FileText, Star, Trash2 } from 'lucide-react';
import { Product, ProductStatus } from '../../types';
import { Toggle } from '../Toggle';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useTranslation } from 'react-i18next';

interface ProductEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Product | null; // null means Create mode
  onSave: (product: Partial<Product>) => void;
  canEdit: boolean;
}

export const ProductEditor: React.FC<ProductEditorProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  canEdit,
}) => {
  const { t } = useTranslation();
  const [editTab, setEditTab] = useState<'INFO' | 'PRICE' | 'MEDIA'>('INFO');
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setEditForm(JSON.parse(JSON.stringify(initialData)));
      } else {
        setEditForm({
          sku: '',
          name: '',
          brand: '',
          category: '',
          price: 0,
          status: 'DRAFT',
          globalStatus: 'OFF_SHELF',
          allowBackorder: false,
          allowTransfer: false,
          tags: [],
          mediaAssets: [],
        });
      }
      setEditTab('INFO');
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    onSave(editForm);
    onClose();
  };

  // Media Sorting
  const moveMedia = (index: number, direction: 'up' | 'down') => {
    if (!editForm.mediaAssets) return;
    const newMedia = [...editForm.mediaAssets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newMedia.length) {
      [newMedia[index], newMedia[targetIndex]] = [newMedia[targetIndex], newMedia[index]];
      setEditForm({ ...editForm, mediaAssets: newMedia });
    }
  };

  const setMainMedia = (index: number) => {
    if (!editForm.mediaAssets) return;
    const newMedia = editForm.mediaAssets.map((m, i) => ({
      ...m,
      isMain: i === index,
    }));
    setEditForm({ ...editForm, mediaAssets: newMedia });
  };

  const InfoTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            {t('pim.editor.sku')}
          </label>
          <input
            className="w-full border p-2 rounded text-sm bg-gray-50"
            value={editForm.sku}
            onChange={e => setEditForm({ ...editForm, sku: e.target.value })}
            disabled={!!initialData}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            {t('pim.editor.brand')}
          </label>
          <input
            className="w-full border p-2 rounded text-sm"
            value={editForm.brand}
            onChange={e => setEditForm({ ...editForm, brand: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
          {t('pim.editor.name')}
        </label>
        <input
          className="w-full border p-2 rounded text-sm"
          value={editForm.name}
          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            {t('pim.editor.category')}
          </label>
          <input
            className="w-full border p-2 rounded text-sm"
            value={editForm.category}
            onChange={e => setEditForm({ ...editForm, category: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            {t('pim.editor.status')}
          </label>
          <select
            className="w-full border p-2 rounded text-sm"
            value={editForm.status}
            onChange={e => setEditForm({ ...editForm, status: e.target.value as ProductStatus })}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="UNPUBLISHED">Unpublished</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
          {t('pim.editor.tags')}
        </label>
        <input
          className="w-full border p-2 rounded text-sm"
          placeholder="New, Sale, ..."
          value={editForm.tags?.join(', ')}
          onChange={e =>
            setEditForm({ ...editForm, tags: e.target.value.split(',').map(s => s.trim()) })
          }
        />
      </div>
    </div>
  );

  const PriceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            {t('pim.editor.retail_price')}
          </label>
          <input
            type="number"
            className="w-full border p-2 rounded text-sm"
            value={editForm.price}
            onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
          />
        </div>
      </div>
      <div className="border-t pt-4">
        <h4 className="text-sm font-bold mb-3">{t('pim.editor.sales_rules')}</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">{t('pim.editor.allow_backorder')}</span>
            <Toggle
              enabled={!!editForm.allowBackorder}
              onToggle={() =>
                setEditForm({ ...editForm, allowBackorder: !editForm.allowBackorder })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">{t('pim.editor.allow_transfer')}</span>
            <Toggle
              enabled={!!editForm.allowTransfer}
              onToggle={() => setEditForm({ ...editForm, allowTransfer: !editForm.allowTransfer })}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const MediaTab = () => (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
        <UploadCloud size={32} className="mb-2" />
        <span className="text-sm">{t('pim.editor.upload_hint')}</span>
        <span className="text-xs text-gray-400 mt-1">{t('pim.editor.simulated_upload')}</span>
      </div>

      <div className="space-y-2">
        {editForm.mediaAssets?.map((media, idx) => (
          <div key={idx} className="flex items-center gap-3 border p-2 rounded bg-white">
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => moveMedia(idx, 'up')}
                disabled={idx === 0}
                className="text-gray-300 hover:text-gray-600 disabled:opacity-20"
              >
                <ArrowUp size={14} />
              </button>
              <button
                onClick={() => moveMedia(idx, 'down')}
                disabled={idx === (editForm.mediaAssets?.length || 0) - 1}
                className="text-gray-300 hover:text-gray-600 disabled:opacity-20"
              >
                <ArrowDown size={14} />
              </button>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
              {media.type === 'IMAGE' ? (
                <img src={media.url} className="w-full h-full object-cover" />
              ) : (
                <FileText size={20} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium flex items-center gap-2">
                {media.type}
                {media.isMain && <Badge variant="success">Main</Badge>}
              </div>
              <div className="text-xs text-gray-500 truncate">{media.url}</div>
            </div>

            <div className="flex items-center gap-2">
              {!media.isMain && media.type === 'IMAGE' && (
                <button
                  onClick={() => setMainMedia(idx)}
                  className="text-xs text-gray-400 hover:text-blue-600"
                  title={t('pim.editor.set_main')}
                >
                  <Star size={16} />
                </button>
              )}
              <button className="text-xs text-red-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {(!editForm.mediaAssets || editForm.mediaAssets.length === 0) && (
          <div className="text-center text-sm text-gray-400 py-4">{t('pim.editor.no_media')}</div>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('pim.editor.title_edit') : t('pim.editor.title_create')}
      className="max-w-2xl h-[90vh]"
      noPadding
    >
      <div className="flex flex-col h-full">
        <div className="flex border-b bg-white px-6 shrink-0">
          {['info', 'price', 'media'].map(tabKey => (
            <button
              key={tabKey}
              onClick={() => setEditTab(tabKey.toUpperCase() as 'INFO' | 'PRICE' | 'MEDIA')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors uppercase ${editTab === tabKey.toUpperCase() ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400'}`}
            >
              {t(`pim.editor.tabs.${tabKey}`)}
            </button>
          ))}
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {editTab === 'INFO' && <InfoTab />}
          {editTab === 'PRICE' && <PriceTab />}
          {editTab === 'MEDIA' && <MediaTab />}
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {t('common.cancel')}
          </button>
          {canEdit && (
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm text-white bg-gray-900 hover:bg-black rounded-lg shadow-sm"
            >
              {initialData ? t('common.save_changes') : t('common.create')}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
