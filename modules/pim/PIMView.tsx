import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatedBox, AnimatedPresenceWrapper } from '../../components/motion';
import { ProductList } from './components/ProductList';
import { ProductEditor } from './components/ProductEditor';
import { BrandList } from './components/brands/BrandList';
import { BrandForm } from './components/brands/BrandForm';
import { CollectionList } from './components/collections/CollectionList';
import { CollectionForm } from './components/collections/CollectionForm';
import { DesignerList } from './components/designers/DesignerList';
import { DesignerForm } from './components/designers/DesignerForm';

import { Product } from './types';
import { Brand } from '../brands/types';
import { Collection } from '../collections/types';
import { Designer } from '../designers/types';

import { Package, Tag, Layers, User } from 'lucide-react';

type Tab = 'products' | 'brands' | 'collections' | 'designers';

export function PIMView() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('products');

  // State for Product Editor
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

  // State for Sub-modules (using a generic editing state approach could be cleaner but explicit is fine for now)
  const [editingBrand, setEditingBrand] = useState<Brand | null | 'new'>(null);
  const [editingCollection, setEditingCollection] = useState<Collection | null | 'new'>(null);
  const [editingDesigner, setEditingDesigner] = useState<Designer | null | 'new'>(null);

  // --- TAB NAVIGATION ---
  const tabs = [
    { id: 'products', label: t('products'), icon: Package },
    { id: 'brands', label: t('brands'), icon: Tag },
    { id: 'collections', label: t('collections'), icon: Layers },
    { id: 'designers', label: t('designers'), icon: User },
  ];

  // --- PRODUCTS HANDLERS ---
  const handleCreateProduct = () => {
    setSelectedProduct(undefined);
    setIsEditingProduct(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditingProduct(true);
  };

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        if (isEditingProduct) {
          return (
            <ProductEditor
              initialData={selectedProduct}
              onClose={() => setIsEditingProduct(false)}
            />
          );
        }
        return <ProductList onCreate={handleCreateProduct} onEdit={handleEditProduct} />;

      case 'brands':
        if (editingBrand) {
          return (
            <BrandForm
              initialData={editingBrand === 'new' ? undefined : editingBrand}
              onSave={() => setEditingBrand(null)}
              onCancel={() => setEditingBrand(null)}
            />
          );
        }
        return <BrandList onCreate={() => setEditingBrand('new')} onEdit={setEditingBrand} />;

      case 'collections':
        if (editingCollection) {
          return (
            <CollectionForm
              initialData={editingCollection === 'new' ? undefined : editingCollection}
              onSave={() => setEditingCollection(null)}
              onCancel={() => setEditingCollection(null)}
            />
          );
        }
        return (
          <CollectionList
            onCreate={() => setEditingCollection('new')}
            onEdit={setEditingCollection}
          />
        );

      case 'designers':
        if (editingDesigner) {
          return (
            <DesignerForm
              initialData={editingDesigner === 'new' ? undefined : editingDesigner}
              onSave={() => setEditingDesigner(null)}
              onCancel={() => setEditingDesigner(null)}
            />
          );
        }
        return (
          <DesignerList onCreate={() => setEditingDesigner('new')} onEdit={setEditingDesigner} />
        );

      default:
        return null;
    }
  };

  return (
    <AnimatedBox className="h-full flex flex-col p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('pim')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('pimSubtitle')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as Tab);
                  // Reset editors when switching tabs
                  setIsEditingProduct(false);
                  setEditingBrand(null);
                  setEditingCollection(null);
                  setEditingDesigner(null);
                }}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon
                  className={`
                    -ml-0.5 mr-2 h-5 w-5
                    ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                  `}
                  aria-hidden="true"
                />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 relative">
        <AnimatedPresenceWrapper mode="wait">
          <AnimatedBox key={activeTab} className="h-full" animation="fadeIn" duration={0.2}>
            {renderContent()}
          </AnimatedBox>
        </AnimatedPresenceWrapper>
      </div>
    </AnimatedBox>
  );
}
