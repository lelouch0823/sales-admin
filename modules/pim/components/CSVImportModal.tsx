/**
 * CSV 导入模态框
 *
 * 提供商品批量导入功能
 * 支持：模板下载、文件上传、预校验、错误报告
 */

import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Download, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/ui';
import {
    parseCSV,
    validateCSVData,
    csvRowToProduct,
    generateCSVTemplate,
    generateErrorCSV,
    ImportStatus,
    ValidationError,
} from '../csv-import';
import { productApi } from '../api';

interface CSVImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    existingSKUs: string[];
    onImportComplete: () => void;
}

export const CSVImportModal: React.FC<CSVImportModalProps> = ({
    isOpen,
    onClose,
    existingSKUs,
    onImportComplete,
}) => {
    const { t } = useTranslation();

    // 状态
    const [status, setStatus] = useState<ImportStatus>('idle');
    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [result, setResult] = useState<{ success: number; total: number } | null>(null);
    const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);

    // 重置状态
    const resetState = useCallback(() => {
        setStatus('idle');
        setFile(null);
        setErrors([]);
        setResult(null);
        setParsedRows([]);
    }, []);

    // 下载模板
    const handleDownloadTemplate = () => {
        const csv = generateCSVTemplate();
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'product_import_template.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // 下载错误报告
    const handleDownloadErrors = () => {
        const csv = generateErrorCSV(errors);
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'import_errors.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // 文件选择
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setStatus('parsing');
        setErrors([]);

        try {
            const text = await selectedFile.text();
            const { rows } = parseCSV(text);
            setParsedRows(rows);

            // 开始校验
            setStatus('validating');
            const validationErrors = validateCSVData(rows, new Set(existingSKUs));
            setErrors(validationErrors);

            if (validationErrors.length === 0) {
                setStatus('idle'); // 可以导入
            } else {
                setStatus('error');
            }
        } catch (err) {
            setErrors([{
                row: 0,
                field: 'file',
                value: selectedFile.name,
                message: (err as Error).message,
            }]);
            setStatus('error');
        }
    };

    // 执行导入
    const handleImport = async () => {
        if (parsedRows.length === 0) return;

        setStatus('importing');
        let successCount = 0;
        const importErrors: ValidationError[] = [];

        for (let i = 0; i < parsedRows.length; i++) {
            const row = parsedRows[i];
            try {
                const product = csvRowToProduct(row);
                await productApi.create(product);
                successCount++;
            } catch (err) {
                importErrors.push({
                    row: i + 2,
                    field: 'import',
                    value: row['sku'] || '',
                    message: (err as Error).message,
                });
            }
        }

        setResult({ success: successCount, total: parsedRows.length });
        setErrors(importErrors);
        setStatus('done');

        if (successCount > 0) {
            onImportComplete();
        }
    };

    // 关闭时重置
    const handleClose = () => {
        resetState();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={t('pim.import.title', 'CSV 批量导入')}
            className="max-w-2xl"
        >
            <div className="space-y-6">
                {/* 步骤 1：下载模板 */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            1
                        </div>
                        <div>
                            <p className="font-medium">{t('pim.import.step1', '下载模板')}</p>
                            <p className="text-sm text-gray-500">{t('pim.import.step1_desc', '使用标准模板填写商品数据')}</p>
                        </div>
                    </div>
                    <Button variant="secondary" onClick={handleDownloadTemplate}>
                        <Download size={16} className="mr-2" />
                        {t('pim.import.download_template', '下载模板')}
                    </Button>
                </div>

                {/* 步骤 2：上传文件 */}
                <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            2
                        </div>
                        <div>
                            <p className="font-medium">{t('pim.import.step2', '上传 CSV 文件')}</p>
                            <p className="text-sm text-gray-500">{t('pim.import.step2_desc', '选择填写好的 CSV 文件')}</p>
                        </div>
                    </div>

                    <label className="block">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={status === 'importing'}
                        />
                        <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                            {file ? (
                                <div className="flex items-center gap-2 text-primary">
                                    <FileText size={20} />
                                    <span>{file.name}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Upload size={20} />
                                    <span>{t('pim.import.select_file', '点击选择文件')}</span>
                                </div>
                            )}
                        </div>
                    </label>
                </div>

                {/* 校验状态 */}
                {status === 'validating' && (
                    <div className="flex items-center gap-2 text-blue-600">
                        <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                        <span>{t('pim.import.validating', '正在校验数据...')}</span>
                    </div>
                )}

                {/* 校验通过 */}
                {file && errors.length === 0 && status === 'idle' && (
                    <div className="flex items-center gap-2 text-green-600 p-3 bg-green-50 rounded-lg">
                        <CheckCircle size={20} />
                        <span>{t('pim.import.valid', `校验通过，共 ${parsedRows.length} 条数据`)}</span>
                    </div>
                )}

                {/* 校验错误 */}
                {errors.length > 0 && status === 'error' && (
                    <div className="p-4 bg-red-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-red-600">
                                <XCircle size={20} />
                                <span>{t('pim.import.errors', `发现 ${errors.length} 个错误`)}</span>
                            </div>
                            <Button variant="secondary" size="sm" onClick={handleDownloadErrors}>
                                <Download size={14} className="mr-1" />
                                {t('pim.import.download_errors', '下载错误报告')}
                            </Button>
                        </div>
                        <div className="max-h-32 overflow-y-auto text-sm text-red-700">
                            {errors.slice(0, 5).map((err, i) => (
                                <div key={i} className="py-1">
                                    行 {err.row}: {err.field} - {err.message}
                                </div>
                            ))}
                            {errors.length > 5 && (
                                <div className="py-1 text-red-500">...还有 {errors.length - 5} 个错误</div>
                            )}
                        </div>
                    </div>
                )}

                {/* 导入中 */}
                {status === 'importing' && (
                    <div className="flex items-center gap-2 text-blue-600 p-3 bg-blue-50 rounded-lg">
                        <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                        <span>{t('pim.import.importing', '正在导入...')}</span>
                    </div>
                )}

                {/* 导入完成 */}
                {status === 'done' && result && (
                    <div className={`p-4 rounded-lg ${result.success === result.total ? 'bg-green-50' : 'bg-yellow-50'}`}>
                        <div className="flex items-center gap-2">
                            {result.success === result.total ? (
                                <CheckCircle size={20} className="text-green-600" />
                            ) : (
                                <AlertTriangle size={20} className="text-yellow-600" />
                            )}
                            <span>
                                {t('pim.import.complete', `导入完成：成功 ${result.success} 条，失败 ${result.total - result.success} 条`)}
                            </span>
                        </div>
                    </div>
                )}

                {/* 操作按钮 */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="secondary" onClick={handleClose}>
                        {status === 'done' ? t('common.close', '关闭') : t('common.cancel', '取消')}
                    </Button>
                    {status !== 'done' && (
                        <Button
                            variant="primary"
                            onClick={handleImport}
                            disabled={!file || errors.length > 0 || status === 'importing' || parsedRows.length === 0}
                        >
                            {status === 'importing' ? t('pim.import.importing', '导入中...') : t('pim.import.start', '开始导入')}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};
