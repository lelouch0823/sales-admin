/**
 * 表单验证工具
 */

export interface ValidationResult {
    valid: boolean;
    message?: string;
}

/**
 * 验证邮箱格式
 */
export function validateEmail(email: string): ValidationResult {
    if (!email) return { valid: false, message: '邮箱不能为空' };
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        return { valid: false, message: '邮箱格式不正确' };
    }
    return { valid: true };
}

/**
 * 验证手机号 (中国大陆)
 */
export function validatePhone(phone: string): ValidationResult {
    if (!phone) return { valid: false, message: '手机号不能为空' };
    const regex = /^1[3-9]\d{9}$/;
    if (!regex.test(phone)) {
        return { valid: false, message: '手机号格式不正确' };
    }
    return { valid: true };
}

/**
 * 验证必填字段
 */
export function validateRequired(value: unknown, fieldName: string = '此字段'): ValidationResult {
    if (value === null || value === undefined || value === '') {
        return { valid: false, message: `${fieldName}不能为空` };
    }
    if (Array.isArray(value) && value.length === 0) {
        return { valid: false, message: `${fieldName}不能为空` };
    }
    return { valid: true };
}

/**
 * 验证字符串长度
 */
export function validateLength(
    value: string,
    min: number,
    max: number,
    fieldName: string = '内容'
): ValidationResult {
    if (value.length < min) {
        return { valid: false, message: `${fieldName}至少需要${min}个字符` };
    }
    if (value.length > max) {
        return { valid: false, message: `${fieldName}不能超过${max}个字符` };
    }
    return { valid: true };
}

/**
 * 验证数字范围
 */
export function validateRange(
    value: number,
    min: number,
    max: number,
    fieldName: string = '数值'
): ValidationResult {
    if (value < min || value > max) {
        return { valid: false, message: `${fieldName}必须在${min}-${max}之间` };
    }
    return { valid: true };
}

/**
 * 验证 URL 格式
 */
export function validateUrl(url: string): ValidationResult {
    if (!url) return { valid: false, message: 'URL 不能为空' };
    try {
        new URL(url);
        return { valid: true };
    } catch {
        return { valid: false, message: 'URL 格式不正确' };
    }
}

/**
 * 组合验证器
 * @example
 * const result = validateAll(
 *   () => validateRequired(name, '姓名'),
 *   () => validateLength(name, 2, 20, '姓名')
 * );
 */
export function validateAll(...validators: (() => ValidationResult)[]): ValidationResult {
    for (const validator of validators) {
        const result = validator();
        if (!result.valid) return result;
    }
    return { valid: true };
}
