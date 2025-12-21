import { useTranslation } from 'react-i18next';
import { OrderLog } from '../types';
import { formatDate } from '../../../utils/date';
import { Circle, CheckCircle, AlertCircle, Truck, Package } from 'lucide-react';

interface OrderTimelineProps {
  logs: OrderLog[];
}

export function OrderTimeline({ logs }: OrderTimelineProps) {
  const { t } = useTranslation();

  const getIcon = (action: string) => {
    if (action.includes('create')) return Circle;
    if (action.includes('pay')) return CheckCircle;
    if (action.includes('ship')) return Truck;
    if (action.includes('deliver')) return Package;
    if (action.includes('cancel')) return AlertCircle;
    return Circle;
  };

  if (!logs || logs.length === 0) {
    return <div className="text-gray-500 text-sm">{t('noLogs')}</div>;
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {logs.map((log, logIdx) => {
          const Icon = getIcon(log.action);
          return (
            <li key={log.id}>
              <div className="relative pb-8">
                {logIdx !== logs.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                      <Icon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        {log.action}{' '}
                        <span className="font-medium text-gray-900">by {log.operator.name}</span>
                      </p>
                      {log.notes && (
                        <p className="mt-1 text-sm text-gray-500 italic">&quot;{log.notes}&quot;</p>
                      )}
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={log.createdAt}>{formatDate(log.createdAt)}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
