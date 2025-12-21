/**
 * 文件拖拽上传 Hook
 *
 * 使用 react-dropzone 实现拖拽上传
 */

import { useCallback } from 'react';
import { useDropzone, Accept, FileRejection } from 'react-dropzone';

interface UseFileDropOptions {
  accept?: Accept;
  maxSize?: number;
  maxFiles?: number;
  onDrop: (files: File[]) => void;
  onError?: (message: string) => void;
}

/**
 * 文件拖拽上传 Hook
 * @param options 配置选项
 */
export function useFileDrop(options: UseFileDropOptions) {
  const { accept, maxSize = 10 * 1024 * 1024, maxFiles = 1, onDrop, onError } = options;

  const handleDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(({ errors }) => errors.map(e => e.message).join(', '));
        onError?.(errors.join('; '));
        return;
      }

      if (acceptedFiles.length > 0) {
        onDrop(acceptedFiles);
      }
    },
    [onDrop, onError]
  );

  const dropzone = useDropzone({
    onDrop: handleDrop,
    accept,
    maxSize,
    maxFiles,
    multiple: maxFiles > 1,
  });

  return {
    ...dropzone,
    isDragActive: dropzone.isDragActive,
    getRootProps: dropzone.getRootProps,
    getInputProps: dropzone.getInputProps,
  };
}

// 常用文件类型
export const FILE_ACCEPT = {
  CSV: { 'text/csv': ['.csv'] },
  EXCEL: {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-excel': ['.xls'],
  },
  IMAGES: {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  },
} as const;
