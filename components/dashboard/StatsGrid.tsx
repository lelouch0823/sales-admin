import React from 'react';
import { Users, ShoppingBag, History, PackagePlus } from 'lucide-react';
import { StatCard } from '../StatCard';
import { useTranslation } from 'react-i18next';

interface StatsGridProps {
  customerCount: number;
  activeRecsCount: number;
  productCount: number;
  logCount: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ 
    customerCount, 
    activeRecsCount, 
    productCount, 
    logCount 
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t('dashboard.stats.total_customers')} 
          current={customerCount} 
          total={5000} 
          variant="gradient"
          icon={Users}
          totalLabel={t('dashboard.stats.total')}
        />
        <StatCard 
          title={t('dashboard.stats.active_recs')} 
          current={activeRecsCount} 
          total={20} 
          variant="grid"
          icon={ShoppingBag}
          totalLabel={t('dashboard.stats.total')}
        />
        <StatCard 
          title={t('dashboard.stats.total_products')} 
          current={productCount} 
          unit="#"
          variant="grid"
          icon={PackagePlus}
          totalLabel={t('dashboard.stats.total')}
        />
        <StatCard 
          title={t('dashboard.stats.audit_events')} 
          current={logCount} 
          total={100} 
          variant="grid"
          icon={History}
          totalLabel={t('dashboard.stats.total')}
        />
    </div>
  );
};