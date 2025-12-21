/**
 * CSV 导入服务测试
 */
import { describe, it, expect } from 'vitest';
import {
    parseCSV,
    validateCSVData,
    csvRowToProduct,
    generateCSVTemplate,
    generateErrorCSV,
    CSV_REQUIRED_FIELDS,
} from '../../modules/pim/csv-import';

describe('parseCSV', () => {
    it('应该正确解析简单 CSV', () => {
        const csv = `sku,name,brand,category,price
SKU001,Test Product,Brand A,Category 1,99.99`;

        const { headers, rows } = parseCSV(csv);

        expect(headers).toEqual(['sku', 'name', 'brand', 'category', 'price']);
        expect(rows).toHaveLength(1);
        expect(rows[0]['sku']).toBe('SKU001');
        expect(rows[0]['name']).toBe('Test Product');
    });

    it('应该处理带引号的字段', () => {
        const csv = `sku,name,description
SKU001,"Product, with comma","Description with ""quotes"""`;

        const { rows } = parseCSV(csv);

        expect(rows[0]['name']).toBe('Product, with comma');
    });

    it('应该抛出错误当 CSV 无效时', () => {
        expect(() => parseCSV('')).toThrow();
        expect(() => parseCSV('header only')).toThrow();
    });
});

describe('validateCSVData', () => {
    it('应该通过有效数据', () => {
        const rows = [{
            sku: 'SKU001',
            name: 'Test',
            brand: 'Brand',
            category: 'Category',
            price: '99.99',
        }];

        const errors = validateCSVData(rows, new Set());

        expect(errors).toHaveLength(0);
    });

    it('应该检测必填字段缺失', () => {
        const rows = [{
            sku: '',
            name: 'Test',
            brand: 'Brand',
            category: 'Category',
            price: '99.99',
        }];

        const errors = validateCSVData(rows, new Set());

        expect(errors.some(e => e.field === 'sku')).toBe(true);
    });

    it('应该检测重复 SKU', () => {
        const rows = [
            { sku: 'SKU001', name: 'Test 1', brand: 'Brand', category: 'Cat', price: '10' },
            { sku: 'SKU001', name: 'Test 2', brand: 'Brand', category: 'Cat', price: '20' },
        ];

        const errors = validateCSVData(rows, new Set());

        expect(errors.some(e => e.message.includes('重复'))).toBe(true);
    });

    it('应该检测无效价格', () => {
        const rows = [{
            sku: 'SKU001',
            name: 'Test',
            brand: 'Brand',
            category: 'Category',
            price: 'not-a-number',
        }];

        const errors = validateCSVData(rows, new Set());

        expect(errors.some(e => e.field === 'price')).toBe(true);
    });
});

describe('csvRowToProduct', () => {
    it('应该转换 CSV 行为 Product 对象', () => {
        const row = {
            sku: 'SKU001',
            name: 'Test Product',
            brand: 'Test Brand',
            category: 'Test Category',
            price: '99.99',
            original_price: '129.99',
            allow_backorder: 'true',
            allow_transfer: 'false',
            tags: 'new;sale',
            description: 'Test desc',
        };

        const product = csvRowToProduct(row);

        expect(product.sku).toBe('SKU001');
        expect(product.name).toBe('Test Product');
        expect(product.price).toBe(99.99);
        expect(product.originalPrice).toBe(129.99);
        expect(product.allowBackorder).toBe(true);
        expect(product.allowTransfer).toBe(false);
        expect(product.tags).toEqual(['new', 'sale']);
        expect(product.status).toBe('DRAFT');
    });

    it('应该使用默认值', () => {
        const row = {
            sku: 'SKU001',
            name: 'Test',
            brand: 'Brand',
            category: 'Category',
            price: '50',
        };

        const product = csvRowToProduct(row);

        expect(product.allowBackorder).toBe(false);
        expect(product.allowTransfer).toBe(true); // 默认 true
        expect(product.tags).toEqual([]);
    });
});

describe('generateCSVTemplate', () => {
    it('应该生成包含所有字段的模板', () => {
        const template = generateCSVTemplate();
        const lines = template.split('\n');
        const headers = lines[0].split(',');

        CSV_REQUIRED_FIELDS.forEach(field => {
            expect(headers).toContain(field);
        });
    });
});

describe('generateErrorCSV', () => {
    it('应该生成错误报告', () => {
        const errors = [
            { row: 2, field: 'sku', value: '', message: 'SKU 是必填字段' },
            { row: 3, field: 'price', value: 'abc', message: '价格必须是有效数字' },
        ];

        const csv = generateErrorCSV(errors);
        const lines = csv.split('\n');

        expect(lines[0]).toContain('行号');
        expect(lines[1]).toContain('2');
        expect(lines[2]).toContain('3');
    });
});
