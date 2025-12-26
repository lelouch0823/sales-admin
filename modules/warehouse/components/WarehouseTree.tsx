import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { warehouseApi } from '../api';
import { Warehouse, WarehouseType } from '../types';
import {
  ChevronRight,
  ChevronDown,
  Warehouse as WarehouseIcon,
  MapPin,
  Building2,
} from 'lucide-react';
import { AnimatedBox } from '../../../components/motion';
import { Skeleton } from '../../../components/common/Skeleton';

interface WarehouseTreeProps {
  onSelect: (warehouse: Warehouse) => void;
  selectedId?: string;
}

export function WarehouseTree({ onSelect, selectedId }: WarehouseTreeProps) {
  const { t } = useTranslation();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const { data: treeData, isLoading } = useApiQuery<Warehouse[]>({
    queryKey: ['warehouse-tree'],
    queryFn: () => warehouseApi.getTree(),
  });

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newResolved = new Set(expandedIds);
    if (newResolved.has(id)) {
      newResolved.delete(id);
    } else {
      newResolved.add(id);
    }
    setExpandedIds(newResolved);
  };

  const getIcon = (type: WarehouseType) => {
    switch (type) {
      case 'CENTRAL':
        return <Building2 size={16} className="text-purple-600" />;
      case 'REGIONAL':
        return <WarehouseIcon size={16} className="text-blue-600" />;
      default:
        return <MapPin size={16} className="text-gray-500" />;
    }
  };

  const renderNode = (node: Warehouse, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedId === node.id;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center py-2 px-2 cursor-pointer transition-colors hover:bg-gray-50 ${
            isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => onSelect(node)}
        >
          {hasChildren ? (
            <button
              onClick={e => toggleExpand(e, node.id)}
              className="p-1 mr-1 text-gray-400 hover:text-gray-600 rounded-sm hover:bg-gray-200/50"
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <div className="w-6 mr-1" />
          )}

          <div className="mr-2">{getIcon(node.type)}</div>

          <div className="flex-1 text-sm font-medium truncate">
            {node.name}
            {node.code && <span className="text-xs text-gray-400 ml-2">({node.code})</span>}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l border-gray-100 ml-4">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // 优化：使用骨架屏替代文字 Loading
  if (isLoading) {
    return (
      <div className="bg-white border-r border-gray-200 h-full w-80 p-4 space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton className="h-5 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <AnimatedBox className="bg-white border-r border-gray-200 h-full overflow-y-auto w-80 flex flex-col">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-bold text-gray-900">{t('nav.warehouses')}</h3>
        <p className="text-xs text-gray-500 mt-1">{t('warehouse.hierarchy')}</p>
      </div>
      <div className="flex-1 py-2">
        {treeData?.map(root => renderNode(root))}
        {(!treeData || treeData.length === 0) && (
          <div className="p-4 text-center text-gray-400 text-sm">{t('noData')}</div>
        )}
      </div>
    </AnimatedBox>
  );
}
