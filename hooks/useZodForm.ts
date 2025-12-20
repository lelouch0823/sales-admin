import { useForm, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

/**
 * useZodForm - 结合 react-hook-form 和 zod 的自定义 Hook
 * 
 * @example
 * const form = useZodForm({
 *   schema: loginSchema,
 *   defaultValues: { email: '', password: '' }
 * });
 * 
 * <form onSubmit={form.handleSubmit(onSubmit)}>
 *   <input {...form.register('email')} />
 *   {form.formState.errors.email?.message}
 * </form>
 */

interface UseZodFormProps<T extends Record<string, unknown>> extends Omit<UseFormProps<T>, 'resolver'> {
    schema: ZodSchema<T>;
}

export function useZodForm<T extends Record<string, unknown>>({
    schema,
    ...formConfig
}: UseZodFormProps<T>) {
    return useForm<T>({
        ...formConfig,
        // @ts-expect-error - Zod v4 type compatibility issue with @hookform/resolvers
        resolver: zodResolver(schema),
    });
}

/**
 * 表单字段错误提取辅助函数
 */
export function getFieldError(errors: Record<string, unknown>, field: string): string | undefined {
    const error = errors[field] as { message?: string } | undefined;
    return error?.message;
}

/**
 * 判断表单是否有任何错误
 */
export function hasFormErrors(errors: Record<string, unknown>): boolean {
    return Object.keys(errors).length > 0;
}

// Re-export react-hook-form 常用功能
export { useForm, useFormContext, useWatch, useFieldArray, Controller, FormProvider } from 'react-hook-form';
export type { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
