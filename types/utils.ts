/**
 * 通用工具类型
 */

/**
 * 将类型的所有属性变为可选（深层递归）
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * 将类型的所有属性变为必需（深层递归）
 */
export type DeepRequired<T> = {
    [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * 提取数组元素类型
 */
export type ArrayElement<T extends readonly unknown[]> = T extends readonly (infer U)[] ? U : never;

/**
 * 将联合类型转为交叉类型
 */
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

/**
 * 可空类型
 */
export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;

/**
 * 非空断言类型
 */
export type NonNullableFields<T> = {
    [P in keyof T]: NonNullable<T[P]>;
};

/**
 * 获取函数返回值类型（异步函数）
 */
export type AsyncReturnType<T extends (...args: unknown[]) => Promise<unknown>> =
    T extends (...args: unknown[]) => Promise<infer R> ? R : never;

/**
 * 字符串字面量类型工具
 */
export type StringLiteral<T> = T extends string ? (string extends T ? never : T) : never;

/**
 * 值类型（从对象类型提取值的联合）
 */
export type ValueOf<T> = T[keyof T];

/**
 * 排除类型中的某些键
 */
export type OmitStrict<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * 可区分联合类型辅助
 */
export type DiscriminatedUnion<T, K extends keyof T, V extends T[K]> = T extends { [key in K]: V } ? T : never;
