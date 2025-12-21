/**
 * 打印工具 Hook
 *
 * 使用 react-to-print 实现页面内容打印
 */

import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface UsePrintOptions {
  documentTitle?: string;
  onBeforePrint?: () => Promise<void>;
  onAfterPrint?: () => void;
}

/**
 * 打印 Hook
 * @param options 打印选项
 * @returns { printRef, handlePrint }
 */
export function usePrint<T extends HTMLElement = HTMLDivElement>(options: UsePrintOptions = {}) {
  const printRef = useRef<T>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: options.documentTitle || '打印文档',
    onBeforePrint: options.onBeforePrint,
    onAfterPrint: options.onAfterPrint,
  });

  return {
    printRef,
    handlePrint,
  } as const;
}
