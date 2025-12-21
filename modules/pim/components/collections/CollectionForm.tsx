import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collectionApi } from '../../../collections/api';
import { Collection } from '../../../collections/types';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { X, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CollectionFormProps {
  initialData?: Collection;
  onSave: () => void;
  onCancel: () => void;
}

export function CollectionForm({ initialData, onSave, onCancel }: CollectionFormProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Collection>>({
    name: '',
    description: '',
    status: 'active',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        await collectionApi.update(initialData.id, formData);
        toast.success(t('collectionUpdated'));
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await collectionApi.create(formData as any);
        toast.success(t('collectionCreated'));
      }
      onSave();
    } catch (error) {
      console.error('Failed to save collection', error);
      toast.error(t('saveFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">
          {initialData ? t('editCollection') : t('createCollection')}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
          <Input
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder={t('enterCollectionName')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
            value={formData.description || ''}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder={t('enterDescription')}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="status"
            checked={formData.status === 'active'}
            onChange={e =>
              setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="status" className="text-sm text-gray-700">
            {t('active')}
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save size={16} className="mr-2" />
            {isSubmitting ? t('saving') : t('save')}
          </Button>
        </div>
      </form>
    </div>
  );
}
