/**
 * CSV 导入服务
 *
 * 提供 CSV 解析、校验和导入功能
 */

import { Product } from './types';

// ============ 类型定义 ============

/** CSV 导入状态 */
export type ImportStatus = 'idle' | 'parsing' | 'validating' | 'importing' | 'done' | 'error';

/** 校验错误 */
export interface ValidationError {
    row: number;
    field: string;
    value: string;
    message: string;
}

/** 导入结果 */
export interface ImportResult {
    success: boolean;
    totalRows: number;
    successCount: number;
    errorCount: number;
    errors: ValidationError[];
}

/** CSV 行数据 */
export interface CSVRow {
    sku: string;
    name: string;
    brand: string;
    category: string;
    price: string;
    original_price?: string;
    allow_backorder?: string;
    allow_transfer?: string;
    tags?: string;
    description?: string;
}

// ============ CSV 模板字段 ============

export const CSV_TEMPLATE_HEADERS = [
    'sku',
    'name',
    'brand',
    'category',
    'price',
    'original_price',
    'allow_backorder',
    'allow_transfer',
    'tags',
    'description',
];

export const CSV_REQUIRED_FIELDS = ['sku', 'name', 'brand', 'category', 'price'];

// ============ 解析函数 ============

/**
 * 解析 CSV 文本
 */
export function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
        throw new Error('CSV 文件格式无效：至少需要表头和一行数据');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
            row[header] = values[index]?.trim() || '';
        });
        rows.push(row);
    }

    return { headers, rows };
}

/**
 * 解析单行 CSV（处理引号内的逗号）
 */
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.replace(/^"|"$/g, ''));
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.replace(/^"|"$/g, ''));

    return result;
}

// ============ 校验函数 ============

/**
 * 校验 CSV 数据
 */
export function validateCSVData(
    rows: Record<string, string>[],
    existingSKUs: Set<string>
): ValidationError[] {
    const errors: ValidationError[] = [];
    const seenSKUs = new Set<string>();

    rows.forEach((row, index) => {
        const rowNum = index + 2; // CSV 行号（从 2 开始，1 是表头）

        // 检查必填字段
        CSV_REQUIRED_FIELDS.forEach(field => {
            if (!row[field] || row[field].trim() === '') {
                errors.push({
                    row: rowNum,
                    field,
                    value: row[field] || '',
                    message: `${field} 是必填字段`,
                });
            }
        });

        // SKU 唯一性检查
        const sku = row['sku']?.trim();
        if (sku) {
            if (seenSKUs.has(sku)) {
                errors.push({
                    row: rowNum,
                    field: 'sku',
                    value: sku,
                    message: 'SKU 在导入文件中重复',
                });
            } else if (existingSKUs.has(sku)) {
                // 注意：这里可以选择更新现有商品，暂时标记为提示
                // errors.push({ row: rowNum, field: 'sku', value: sku, message: 'SKU 已存在（将更新）' });
            }
            seenSKUs.add(sku);
        }

        // 价格格式检查
        const price = row['price']?.trim();
        if (price && isNaN(parseFloat(price))) {
            errors.push({
                row: rowNum,
                field: 'price',
                value: price,
                message: '价格必须是有效数字',
            });
        }

        // 原价格式检查
        const originalPrice = row['original_price']?.trim();
        if (originalPrice && isNaN(parseFloat(originalPrice))) {
            errors.push({
                row: rowNum,
                field: 'original_price',
                value: originalPrice,
                message: '原价必须是有效数字',
            });
        }
    });

    return errors;
}

// ============ 转换函数 ============

/**
 * 将 CSV 行转换为 Product 对象
 */
export function csvRowToProduct(row: Record<string, string>): Omit<Product, 'id'> {
    return {
        sku: row['sku']?.trim() || '',
        name: row['name']?.trim() || '',
        brand: row['brand']?.trim() || '',
        category: row['category']?.trim() || '',
        price: parseFloat(row['price']) || 0,
        originalPrice: row['original_price'] ? parseFloat(row['original_price']) : undefined,
        imageUrl: '',
        status: 'DRAFT', // 默认为草稿状态
        description: row['description']?.trim(),
        tags: row['tags'] ? row['tags'].split(';').map(t => t.trim()).filter(Boolean) : [],
        globalStatus: 'OFF_SHELF',
        allowBackorder: row['allow_backorder']?.toLowerCase() === 'true',
        allowTransfer: row['allow_transfer']?.toLowerCase() !== 'false', // 默认 true
        mediaAssets: [],
        updatedAt: new Date().toISOString(),
        updatedBy: '',
    };
}

// ============ 模板生成 ============

/**
 * 生成 CSV 模板
 */
export function generateCSVTemplate(): string {
    const headers = CSV_TEMPLATE_HEADERS.join(',');
    const exampleRow = [
        'SKU001',
        '示例商品名称',
        '示例品牌',
        '示例类目',
        '99.99',
        '129.99',
        'true',
        'true',
        '新品;促销',
        '商品描述',
    ].join(',');

    return `${headers}\n${exampleRow}`;
}

/**
 * 生成错误报告 CSV
 */
export function generateErrorCSV(errors: ValidationError[]): string {
    const headers = ['行号', '字段', '值', '错误信息'].join(',');
    const rows = errors.map(e =>
        [e.row, e.field, `"${e.value}"`, `"${e.message}"`].join(',')
    );
    return [headers, ...rows].join('\n');
}
