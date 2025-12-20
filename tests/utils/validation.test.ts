/**
 * validation 工具函数测试
 */
import { describe, it, expect } from 'vitest';
import {
    validateEmail,
    validatePhone,
    validateRequired,
    validateLength,
    validateRange,
    validateUrl,
    validateAll
} from '../../utils/validation';

describe('validateEmail', () => {
    it('应该验证有效邮箱', () => {
        expect(validateEmail('test@example.com').valid).toBe(true);
    });

    it('应该拒绝无效邮箱', () => {
        expect(validateEmail('invalid').valid).toBe(false);
        expect(validateEmail('test@').valid).toBe(false);
        expect(validateEmail('@example.com').valid).toBe(false);
    });

    it('应该拒绝空邮箱', () => {
        expect(validateEmail('').valid).toBe(false);
    });
});

describe('validatePhone', () => {
    it('应该验证有效手机号', () => {
        expect(validatePhone('13812345678').valid).toBe(true);
        expect(validatePhone('15912345678').valid).toBe(true);
    });

    it('应该拒绝无效手机号', () => {
        expect(validatePhone('12345678901').valid).toBe(false);
        expect(validatePhone('1381234567').valid).toBe(false);
    });
});

describe('validateRequired', () => {
    it('应该验证非空值', () => {
        expect(validateRequired('hello').valid).toBe(true);
        expect(validateRequired(0).valid).toBe(true);
        expect(validateRequired(false).valid).toBe(true);
    });

    it('应该拒绝空值', () => {
        expect(validateRequired('').valid).toBe(false);
        expect(validateRequired(null).valid).toBe(false);
        expect(validateRequired(undefined).valid).toBe(false);
        expect(validateRequired([]).valid).toBe(false);
    });
});

describe('validateLength', () => {
    it('应该验证字符串长度', () => {
        expect(validateLength('hello', 1, 10).valid).toBe(true);
        expect(validateLength('hello', 5, 5).valid).toBe(true);
    });

    it('应该拒绝不符合长度的字符串', () => {
        expect(validateLength('hi', 3, 10).valid).toBe(false);
        expect(validateLength('hello world', 1, 5).valid).toBe(false);
    });
});

describe('validateRange', () => {
    it('应该验证数字范围', () => {
        expect(validateRange(5, 1, 10).valid).toBe(true);
        expect(validateRange(1, 1, 10).valid).toBe(true);
        expect(validateRange(10, 1, 10).valid).toBe(true);
    });

    it('应该拒绝超出范围的数字', () => {
        expect(validateRange(0, 1, 10).valid).toBe(false);
        expect(validateRange(11, 1, 10).valid).toBe(false);
    });
});

describe('validateUrl', () => {
    it('应该验证有效 URL', () => {
        expect(validateUrl('https://example.com').valid).toBe(true);
        expect(validateUrl('http://localhost:3000').valid).toBe(true);
    });

    it('应该拒绝无效 URL', () => {
        expect(validateUrl('not-a-url').valid).toBe(false);
        expect(validateUrl('').valid).toBe(false);
    });
});

describe('validateAll', () => {
    it('应该返回第一个失败的验证结果', () => {
        const result = validateAll(
            () => validateRequired('hello'),
            () => validateLength('hi', 3, 10)
        );
        expect(result.valid).toBe(false);
        expect(result.message).toContain('3');
    });

    it('应该返回成功当所有验证通过', () => {
        const result = validateAll(
            () => validateRequired('hello'),
            () => validateLength('hello', 1, 10)
        );
        expect(result.valid).toBe(true);
    });
});
