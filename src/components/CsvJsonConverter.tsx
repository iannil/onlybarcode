import React, { useState, useEffect } from 'react';
import { csvToJson, jsonToCsv, detectDelimiter } from '../utils/csvJson';
import { FileText, Shuffle, Trash2, Copy, Download, Upload, ListFilter, AlignJustify, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CsvJsonConverter: React.FC = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'csv2json' | 'json2csv'>('csv2json');
  const [error, setError] = useState<string | null>(null);
  const [delimiter, setDelimiter] = useState<string>(',');
  const [jsonPretty, setJsonPretty] = useState(true);
  const [csvHasHeader, setCsvHasHeader] = useState(true);

  // 错误定位（仅简单高亮）
  const getErrorLine = () => {
    if (!error || !input) return null;
    if (mode === 'csv2json') {
      const lines = input.split(/\r?\n/);
      return lines.findIndex(l => l.includes(',')) + 1;
    } else {
      try {
        JSON.parse(input);
        return null;
      } catch (e:any) {
        const m = /at position (\d+)/.exec(e.message);
        if (m) {
          const pos = parseInt(m[1],10);
          const before = input.slice(0,pos);
          return before.split(/\r?\n/).length;
        }
      }
    }
    return null;
  };

  const validateCsv = (csv: string, delimiter: string): string | null => {
    const lines = csv.trim().split(/\r?\n/);
    if (lines.length < 2) return t('csv_too_few_lines', 'CSV内容不足两行');
    const headerCount = lines[0].split(delimiter).length;
    for (let i = 1; i < lines.length; i++) {
      const count = lines[i].split(delimiter).length;
      if (count !== headerCount) {
        return t('csv_column_mismatch', { line: i + 1, count, headerCount, defaultValue: `第${i + 1}行列数(${count})与表头(${headerCount})不一致` });
      }
    }
    return null;
  };

  const validateJson = (jsonStr: string): string | null => {
    try {
      const obj = JSON.parse(jsonStr);
      if (!Array.isArray(obj) && typeof obj !== 'object') {
        return t('json_must_be_object_or_array', 'JSON内容必须为对象或对象数组');
      }
      return null;
    } catch (e: any) {
      return t('json_format_error', 'JSON格式错误') + ': ' + (e.message || '');
    }
  };

  const handleConvert = () => {
    setError(null);
    try {
      if (mode === 'csv2json') {
        const err = validateCsv(input, delimiter);
        if (err) throw new Error(err);
        const json = csvToJson(input, delimiter, undefined, csvHasHeader);
        const jsonStr = jsonPretty ? JSON.stringify(json, null, 2) : JSON.stringify(json);
        setOutput(jsonStr);
      } else {
        const err = validateJson(input);
        if (err) throw new Error(err);
        let arr = JSON.parse(input);
        if (!Array.isArray(arr)) arr = [arr];
        const csv = jsonToCsv(arr, delimiter);
        setOutput(csv);
      }
    } catch (e:any) {
      setOutput('');
      setError(t('format_error', '格式错误或转换失败') + ': ' + (e.message || ''));
    }
  };

  // 文件导入
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      setInput(text);
      if (mode === 'csv2json') {
        setDelimiter(detectDelimiter(text));
      }
    };
    reader.readAsText(file);
  };

  // 文件导出
  const handleFileExport = () => {
    let data = output;
    let type = 'text/csv';
    let filename = 'output.csv';
    if (mode === 'csv2json') {
      type = 'application/json';
      filename = 'output.json';
    } else {
      // CSV导出加BOM
      if (!/^\uFEFF/.test(data)) {
        data = '\uFEFF' + data;
      }
    }
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 复制输出
  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  // 清空输入/输出
  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    // nothing
  };

  // JSON 美化/压缩
  const handleJsonFormat = () => {
    if (mode === 'csv2json' && output) {
      try {
        const obj = JSON.parse(output);
        setOutput(jsonPretty ? JSON.stringify(obj) : JSON.stringify(obj, null, 2));
        setJsonPretty(!jsonPretty);
      } catch {}
    }
  };

  return (
    <div className="w-full mx-auto px-2 sm:px-6 lg:px-8">
      {/* 顶部：模式切换和转换按钮 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex gap-2">
          <button
            className={`px-3 py-1.5 rounded border text-xs font-medium transition-colors duration-150 ${mode === 'csv2json' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            onClick={() => setMode('csv2json')}
          >CSV → JSON</button>
          <button
            className={`px-3 py-1.5 rounded border text-xs font-medium transition-colors duration-150 ${mode === 'json2csv' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            onClick={() => setMode('json2csv')}
          >JSON → CSV</button>
        </div>
        <button
          className="px-3 py-1.5 rounded border border-blue-600 bg-blue-600 text-white text-xs font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
          style={{ minHeight: '32px' }}
          onClick={handleConvert}
        >
          <Shuffle className="w-4 h-4" />{t('convert')}
        </button>
      </div>
      {/* 主体：左右布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 左侧：输入及相关配置 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6 flex flex-col min-h-[420px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-slate-900 flex items-center leading-none">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />{mode === 'csv2json' ? t('csv_input_title', 'CSV输入') : t('json_input_title', 'JSON输入')}
            </h3>
            <div className="flex gap-1">
              <input type="file" accept={mode==='csv2json'?'.csv':'.json'} className="hidden" id="file-input" onChange={handleFileImport} />
              <label htmlFor="file-input" className="cursor-pointer text-xs flex items-center gap-1 px-2 py-1 border rounded bg-slate-50 hover:bg-blue-50"><Download className="w-4 h-4" />{t('import')}</label>
              <button onClick={handleClear} className="text-xs flex items-center gap-1 px-2 py-1 border rounded bg-slate-50 hover:bg-blue-50"><Trash2 className="w-4 h-4" />{t('clear')}</button>
              {mode === 'json2csv' && (
                <button
                  onClick={() => {
                    try {
                      const obj = JSON.parse(input);
                      setInput(JSON.stringify(obj, null, 2));
                    } catch {}
                  }}
                  className="text-xs flex items-center gap-1 px-2 py-1 border rounded bg-slate-50 hover:bg-blue-50"
                >
                  <Compass className="w-4 h-4" />{t('format_json', '格式化JSON')}
                </button>
              )}
            </div>
          </div>
          <textarea
            rows={18}
            className={`w-full rounded border border-slate-200 p-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none ${getErrorLine() ? 'border-red-400' : ''}`}
            placeholder={mode === 'csv2json' ? t('csv_input_placeholder', '粘贴CSV内容') : t('json_input_placeholder', '粘贴JSON数组')}
            value={input}
            onChange={e => {
              setInput(e.target.value);
              if (mode === 'csv2json') {
                setDelimiter(detectDelimiter(e.target.value));
              }
            }}
            style={{ minHeight: 320 }}
          />
          {getErrorLine() && <div className="text-red-500 text-xs mt-1">疑似错误行: {getErrorLine()}</div>}
          {mode === 'csv2json' && (
            <div className="flex items-center gap-4 mt-3">
              <label className="text-xs text-slate-600 flex items-center gap-1"><AlignJustify className="w-4 h-4" />{t('delimiter')}
                <select className="ml-1 border rounded px-1 py-0.5 text-xs" value={delimiter} onChange={e => setDelimiter(e.target.value)}>
                  <option value=",">{t('comma_delimiter', '逗号(,)')}</option>
                  <option value=";">{t('semicolon_delimiter', '分号(;)')}</option>
                  <option value="\t">{t('tab_delimiter', 'Tab')}</option>
                  <option value="|">{t('pipe_delimiter', '竖线(|)')}</option>
                </select>
              </label>
              <label className="text-xs text-slate-600 flex items-center gap-1">
                <input type="checkbox" className="mr-1" checked={csvHasHeader} onChange={e => setCsvHasHeader(e.target.checked)} />{t('csv_header_row', '首行为表头')}
              </label>
            </div>
          )}
        </div>
        {/* 右侧：输出及相关配置 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6 flex flex-col min-h-[420px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-slate-900 flex items-center leading-none">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />{mode === 'csv2json' ? t('json_output_title', 'JSON输出') : t('csv_output_title', 'CSV输出')}
            </h3>
            <div className="flex gap-1">
              <button onClick={handleFileExport} className="text-xs flex items-center gap-1 px-2 py-1 border rounded bg-slate-50 hover:bg-blue-50"><Upload className="w-4 h-4" />{t('export')}</button>
              <button onClick={handleCopy} className="text-xs flex items-center gap-1 px-2 py-1 border rounded bg-slate-50 hover:bg-blue-50"><Copy className="w-4 h-4" />{t('copy')}</button>
              {mode === 'csv2json' && <button onClick={handleJsonFormat} className="text-xs flex items-center gap-1 px-2 py-1 border rounded bg-slate-50 hover:bg-blue-50"><Compass className="w-4 h-4" />{jsonPretty ? t('compress_json', '压缩JSON') : t('beautify_json', '美化JSON')}</button>}
            </div>
          </div>
          <textarea
            rows={18}
            className="w-full rounded border border-slate-100 bg-slate-100 p-2 font-mono text-sm focus:outline-none resize-none text-slate-400"
            placeholder={t('output_placeholder', '输出结果')}
            value={output}
            readOnly
            disabled
            style={{ minHeight: 320 }}
          />
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default CsvJsonConverter; 