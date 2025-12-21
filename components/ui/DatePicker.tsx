import { useState } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { zhCN } from 'date-fns/locale';
import { format } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';

export interface DatePickerProps {
  /** 选中的日期 */
  value?: Date;
  /** 日期变化回调 */
  onChange?: (date: Date | undefined) => void;
  /** 占位文字 */
  placeholder?: string;
  /** 日期格式 */
  dateFormat?: string;
  /** 最小日期 */
  minDate?: Date;
  /** 最大日期 */
  maxDate?: Date;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}

export interface DateRangePickerProps {
  /** 选中的日期范围 */
  value?: DateRange;
  /** 日期变化回调 */
  onChange?: (range: DateRange | undefined) => void;
  /** 占位文字 */
  placeholder?: string;
  /** 日期格式 */
  dateFormat?: string;
  /** 最小日期 */
  minDate?: Date;
  /** 最大日期 */
  maxDate?: Date;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}

// 日历样式类
const calendarClassNames = {
  months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
  month: 'space-y-4',
  caption: 'flex justify-center pt-1 relative items-center',
  caption_label: 'text-sm font-medium text-gray-900',
  nav: 'space-x-1 flex items-center',
  nav_button: cn(
    'inline-flex items-center justify-center w-7 h-7 rounded-md',
    'hover:bg-gray-100 transition-colors',
    'disabled:opacity-50'
  ),
  nav_button_previous: 'absolute left-1',
  nav_button_next: 'absolute right-1',
  table: 'w-full border-collapse space-y-1',
  head_row: 'flex',
  head_cell: 'text-gray-500 rounded-md w-9 font-normal text-[0.8rem]',
  row: 'flex w-full mt-2',
  cell: cn(
    'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
    '[&:has([aria-selected])]:bg-blue-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
  ),
  day: cn(
    'h-9 w-9 p-0 font-normal',
    'inline-flex items-center justify-center rounded-md',
    'hover:bg-gray-100 transition-colors',
    'aria-selected:opacity-100'
  ),
  day_selected: cn(
    'bg-blue-600 text-white',
    'hover:bg-blue-700 hover:text-white',
    'focus:bg-blue-700 focus:text-white'
  ),
  day_today: 'bg-gray-100 text-gray-900',
  day_outside: 'text-gray-400 opacity-50',
  day_disabled: 'text-gray-400 opacity-50',
  day_range_middle: 'aria-selected:bg-blue-100 aria-selected:text-gray-900',
  day_hidden: 'invisible',
};

/**
 * 单日期选择器
 */
export function DatePicker({
  value,
  onChange,
  placeholder = '选择日期',
  dateFormat = 'yyyy-MM-dd',
  minDate,
  maxDate,
  disabled = false,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'inline-flex items-center justify-between w-full px-3 py-2 rounded-lg border border-gray-200',
            'bg-white text-sm text-left',
            'hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
            !value && 'text-gray-400',
            className
          )}
        >
          <span>{value ? format(value, dateFormat, { locale: zhCN }) : placeholder}</span>
          <Calendar size={16} className="text-gray-400" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 p-3 bg-white rounded-xl shadow-xl border border-gray-200"
          align="start"
          sideOffset={4}
        >
          <DayPicker
            mode="single"
            selected={value}
            onSelect={handleSelect}
            locale={zhCN}
            disabled={[
              ...(minDate ? [{ before: minDate }] : []),
              ...(maxDate ? [{ after: maxDate }] : []),
            ]}
            classNames={calendarClassNames}
            components={{
              Chevron: ({ orientation }) =>
                orientation === 'left' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />,
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/**
 * 日期范围选择器
 */
export function DateRangePicker({
  value,
  onChange,
  placeholder = '选择日期范围',
  dateFormat = 'yyyy-MM-dd',
  minDate,
  maxDate,
  disabled = false,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const formatRange = (range: DateRange | undefined) => {
    if (!range?.from) return null;
    if (!range.to) return format(range.from, dateFormat, { locale: zhCN });
    return `${format(range.from, dateFormat, { locale: zhCN })} ~ ${format(range.to, dateFormat, { locale: zhCN })}`;
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'inline-flex items-center justify-between w-full px-3 py-2 rounded-lg border border-gray-200',
            'bg-white text-sm text-left',
            'hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
            !value?.from && 'text-gray-400',
            className
          )}
        >
          <span>{formatRange(value) || placeholder}</span>
          <Calendar size={16} className="text-gray-400" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 p-3 bg-white rounded-xl shadow-xl border border-gray-200"
          align="start"
          sideOffset={4}
        >
          <DayPicker
            mode="range"
            selected={value}
            onSelect={onChange}
            locale={zhCN}
            numberOfMonths={2}
            disabled={[
              ...(minDate ? [{ before: minDate }] : []),
              ...(maxDate ? [{ after: maxDate }] : []),
            ]}
            classNames={calendarClassNames}
            components={{
              Chevron: ({ orientation }) =>
                orientation === 'left' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />,
            }}
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              确定
            </Button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default DatePicker;
