/**
 * Excel 导入导出工具
 *
 * 使用 xlsx (SheetJS) 实现 Excel 文件的读取和生成
 */

import * as XLSX from 'xlsx';

/**
 * 将数据导出为 Excel 文件
 * @param data 数据数组
 * @param filename 文件名（不含扩展名）
 * @param sheetName 工作表名称
 */
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  sheetName = 'Sheet1'
): void {
  // 创建工作簿
  const workbook = XLSX.utils.book_new();

  // 将数据转换为工作表
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // 生成并下载文件
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * 将数据导出为 Excel，支持自定义列头
 * @param data 数据数组
 * @param headers 列头配置 { key: '数据键', label: '显示名称' }
 * @param filename 文件名
 * @param sheetName 工作表名称
 */
export function exportToExcelWithHeaders<T extends Record<string, unknown>>(
  data: T[],
  headers: { key: keyof T; label: string }[],
  filename: string,
  sheetName = 'Sheet1'
): void {
  // 转换数据格式，使用中文列头
  const formattedData = data.map(row => {
    const newRow: Record<string, unknown> = {};
    headers.forEach(({ key, label }) => {
      newRow[label] = row[key];
    });
    return newRow;
  });

  exportToExcel(formattedData, filename, sheetName);
}

/**
 * 从 Excel 文件读取数据
 * @param file 文件对象
 * @returns Promise<数据数组>
 */
export function readExcelFile<T = Record<string, unknown>>(file: File): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });

        // 读取第一个工作表
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // 转换为 JSON
        const jsonData = XLSX.utils.sheet_to_json<T>(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 从 Excel 文件读取数据，支持列名映射
 * @param file 文件对象
 * @param columnMap 列名映射 { 'Excel列名': '数据键' }
 * @returns Promise<数据数组>
 */
export async function readExcelFileWithMapping<T = Record<string, unknown>>(
  file: File,
  columnMap: Record<string, string>
): Promise<T[]> {
  const rawData = await readExcelFile<Record<string, unknown>>(file);

  return rawData.map(row => {
    const mappedRow: Record<string, unknown> = {};
    Object.entries(columnMap).forEach(([excelCol, dataKey]) => {
      if (row[excelCol] !== undefined) {
        mappedRow[dataKey] = row[excelCol];
      }
    });
    return mappedRow as T;
  });
}
