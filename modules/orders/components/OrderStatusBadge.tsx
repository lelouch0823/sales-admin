import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../../components/common/Badge';
import { OrderStatus } from '../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { t } = useTranslation();

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'refunded':
        return 'error';
      case 'failed':
        return 'error';
      case 'returned':
        return 'warning';
      default:
        return 'default';
    }
  };

  return <Badge variant={getStatusColor(status)}>{t(`status.${status}`)}</Badge>;
}
