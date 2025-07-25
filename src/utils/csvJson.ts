// CSV <-> JSON 转换工具

/**
 * 将CSV字符串转换为JSON数组
 * @param csv CSV字符串
 * @param delimiter 分隔符，默认','
 * @param selectedFields 可选，指定要保留的字段数组
 * @param hasHeader 是否首行为表头，默认true
 */
export function csvToJson(csv: string, delimiter = ',', selectedFields?: string[], hasHeader = true): any[] {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length === 0) return [];
  if (hasHeader) {
    const headers = lines[0].split(delimiter).map(h => h.trim());
    const filteredHeaders = selectedFields && selectedFields.length > 0 ? headers.filter(h => selectedFields.includes(h)) : headers;
    return lines.slice(1).map(line => {
      const values = line.split(delimiter);
      const obj: Record<string, any> = {};
      headers.forEach((header, i) => {
        if (!selectedFields || selectedFields.includes(header)) {
          obj[header] = values[i] !== undefined ? values[i].trim() : '';
        }
      });
      // 只返回筛选后的字段
      if (selectedFields && selectedFields.length > 0) {
        const filteredObj: Record<string, any> = {};
        filteredHeaders.forEach(h => { filteredObj[h] = obj[h]; });
        return filteredObj;
      }
      return obj;
    });
  } else {
    // 无表头，生成key1,key2...作为字段名
    const colCount = lines[0].split(delimiter).length;
    const headers = Array.from({length: colCount}, (_, i) => `col${i+1}`);
    return lines.map(line => {
      const values = line.split(delimiter);
      const obj: Record<string, any> = {};
      headers.forEach((header, i) => {
        obj[header] = values[i] !== undefined ? values[i].trim() : '';
      });
      return obj;
    });
  }
}

/**
 * 将JSON数组转换为CSV字符串
 * @param json JSON对象数组
 * @param delimiter 分隔符，默认','
 * @param selectedFields 可选，指定要导出的字段数组
 */
export function jsonToCsv(json: any[], delimiter = ',', selectedFields?: string[]): string {
  if (!Array.isArray(json) || json.length === 0) return '';
  const headers = selectedFields && selectedFields.length > 0 ? selectedFields : Object.keys(json[0]);
  const csvRows = [headers.join(delimiter)];
  for (const row of json) {
    const values = headers.map(h => {
      const val = row[h] !== undefined ? String(row[h]) : '';
      // 简单处理分隔符、引号
      if (val.includes(delimiter) || val.includes('"')) {
        return '"' + val.replace(/"/g, '""') + '"';
      }
      return val;
    });
    csvRows.push(values.join(delimiter));
  }
  return csvRows.join('\n');
}

/**
 * 自动检测CSV分隔符
 * @param csv CSV字符串
 * @returns 检测到的分隔符，默认为逗号
 */
export function detectDelimiter(csv: string): string {
  const lines = csv.trim().split(/\r?\n/).slice(0, 5); // 取前5行
  const delimiters = [',', ';', '\t', '|'];
  let maxScore = 0;
  let best = ',';
  for (const d of delimiters) {
    const counts = lines.map(line => line.split(d).length);
    const score = counts.reduce((a, b) => a + b, 0);
    // 只有分隔符数量大于1才考虑
    if (Math.min(...counts) > 1 && score > maxScore) {
      maxScore = score;
      best = d;
    }
  }
  return best;
} 