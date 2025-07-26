import React, { useState, useEffect } from 'react';
import { jsonToXml, xmlToJson, isValidXml, isValidJson } from '../utils/jsonXml';
import { FileText, Trash2, Copy, Download, Upload, Compass, Braces, Code } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface JsonXmlConverterProps {
  mode: 'json2xml' | 'xml2json';
  clearTrigger: number;
}

const JsonXmlConverter: React.FC<JsonXmlConverterProps> = ({ mode, clearTrigger }) => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [jsonPretty, setJsonPretty] = useState(true);
  const [xmlPretty, setXmlPretty] = useState(true);
  const [rootName, setRootName] = useState('root');

  // Clear all content when clearTrigger changes
  useEffect(() => {
    setInput('');
    setOutput('');
    setError(null);
  }, [clearTrigger]);

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

  const validateXml = (xmlStr: string): string | null => {
    if (!isValidXml(xmlStr)) {
      return t('xml_format_error', 'XML格式错误');
    }
    return null;
  };

  const handleConvert = () => {
    setError(null);
    try {
      if (mode === 'json2xml') {
        const err = validateJson(input);
        if (err) throw new Error(err);
        const obj = JSON.parse(input);
        const xml = jsonToXml(obj, rootName);
        setOutput(xmlPretty ? formatXml(xml) : xml);
      } else {
        const err = validateXml(input);
        if (err) throw new Error(err);
        const json = xmlToJson(input);
        const jsonStr = jsonPretty ? JSON.stringify(json, null, 2) : JSON.stringify(json);
        setOutput(jsonStr);
      }
    } catch (e: any) {
      setOutput('');
      setError(t('format_error', '格式错误或转换失败') + ': ' + (e.message || ''));
    }
  };

  // Listen for external convert trigger
  useEffect(() => {
    const handleTriggerConvert = () => {
      handleConvert();
    };

    window.addEventListener('triggerConvert', handleTriggerConvert);
    return () => {
      window.removeEventListener('triggerConvert', handleTriggerConvert);
    };
  }, [input, mode, jsonPretty, xmlPretty, rootName]);

  // Format XML with proper indentation
  const formatXml = (xml: string): string => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
  };

  // File import
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      setInput(text);
    };
    reader.readAsText(file);
  };

  // File export
  const handleFileExport = () => {
    let data = output;
    let type = 'application/xml';
    let filename = 'output.xml';
    if (mode === 'xml2json') {
      type = 'application/json';
      filename = 'output.json';
    }
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy output
  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  // Clear input/output
  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  // JSON/XML formatting
  const handleFormat = () => {
    if (mode === 'json2xml' && output) {
      setOutput(xmlPretty ? output.replace(/>\s*</g, '><').replace(/></g, '>\n<') : formatXml(output));
      setXmlPretty(!xmlPretty);
    } else if (mode === 'xml2json' && output) {
      try {
        const obj = JSON.parse(output);
        setOutput(jsonPretty ? JSON.stringify(obj) : JSON.stringify(obj, null, 2));
        setJsonPretty(!jsonPretty);
      } catch {}
    }
  };

  return (
    <div className="w-full">
      {/* Main: Left-right layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Input and related configuration */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6 flex flex-col min-h-[420px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-slate-900 flex items-center leading-none">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              {mode === 'json2xml' ? t('json_input_title', 'JSON输入') : t('xml_input_title', 'XML输入')}
            </h3>
            <div className="flex gap-1">
              <input 
                type="file" 
                accept={mode === 'json2xml' ? '.json' : '.xml'} 
                className="hidden" 
                id="xml-file-input" 
                onChange={handleFileImport} 
              />
              <label 
                htmlFor="xml-file-input" 
                className="cursor-pointer text-xs flex items-center justify-center gap-1 px-2 py-1 border rounded bg-slate-50 hover:bg-blue-50"
              >
                <Download className="w-4 h-4" />{t('import')}
              </label>
              <button 
                onClick={handleClear} 
                className="text-xs h-7 px-2 py-1 rounded-md border font-medium transition-colors duration-150 bg-slate-50 hover:bg-blue-50 flex items-center justify-center gap-1"
              >
                <Trash2 className="w-4 h-4" />{t('clear')}
              </button>
              {mode === 'xml2json' && (
                <button
                  onClick={() => {
                    try {
                      const formatted = formatXml(input);
                      setInput(formatted);
                    } catch {}
                  }}
                  className="text-xs h-7 px-2 py-1 rounded-md border font-medium transition-colors duration-150 bg-slate-50 hover:bg-blue-50 flex items-center justify-center gap-1"
                >
                  <Compass className="w-4 h-4" />{t('format_xml', '格式化XML')}
                </button>
              )}
              {mode === 'json2xml' && (
                <button
                  onClick={() => {
                    try {
                      const obj = JSON.parse(input);
                      setInput(JSON.stringify(obj, null, 2));
                    } catch {}
                  }}
                  className="text-xs h-7 px-2 py-1 rounded-md border font-medium transition-colors duration-150 bg-slate-50 hover:bg-blue-50 flex items-center justify-center gap-1"
                >
                  <Compass className="w-4 h-4" />{t('format_json', '格式化JSON')}
                </button>
              )}
            </div>
          </div>
          <textarea
            rows={18}
            className="w-full rounded border border-slate-200 p-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
            placeholder={mode === 'json2xml' ? t('json_input_placeholder', '粘贴JSON数组或对象') : t('xml_input_placeholder', '粘贴XML内容')}
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{ minHeight: 320 }}
          />
          {/* XML root name configuration for JSON to XML */}
          {mode === 'json2xml' && (
            <div className="flex items-center gap-4 mt-3">
              <label className="text-xs text-slate-600 flex items-center gap-1">
                <Code className="w-4 h-4" />
                {t('xml_root_name', 'XML根节点名称')}:
                <input
                  type="text"
                  value={rootName}
                  onChange={(e) => setRootName(e.target.value)}
                  className="ml-1 px-2 py-0.5 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-200"
                  placeholder="root"
                />
              </label>
            </div>
          )}
        </div>

        {/* Right: Output and related configuration */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6 flex flex-col min-h-[420px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-slate-900 flex items-center leading-none">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              {mode === 'json2xml' ? t('xml_output_title', 'XML输出') : t('json_output_title', 'JSON输出')}
            </h3>
            <div className="flex gap-1">
              <button 
                onClick={handleFileExport} 
                className="text-xs h-7 px-2 py-1 rounded-md border font-medium transition-colors duration-150 bg-slate-50 hover:bg-blue-50 flex items-center justify-center gap-1"
              >
                <Upload className="w-4 h-4" />{t('export')}
              </button>
              <button 
                onClick={handleCopy} 
                className="text-xs h-7 px-2 py-1 rounded-md border font-medium transition-colors duration-150 bg-slate-50 hover:bg-blue-50 flex items-center justify-center gap-1"
              >
                <Copy className="w-4 h-4" />{t('copy')}
              </button>
              {mode === 'json2xml' && (
                <button 
                  onClick={handleFormat} 
                  className="text-xs h-7 px-2 py-1 rounded-md border font-medium transition-colors duration-150 bg-slate-50 hover:bg-blue-50 flex items-center justify-center gap-1"
                >
                  <Compass className="w-4 h-4" />
                  {xmlPretty ? t('compress_xml', '压缩XML') : t('beautify_xml', '美化XML')}
                </button>
              )}
              {mode === 'xml2json' && (
                <button 
                  onClick={handleFormat} 
                  className="text-xs h-7 px-2 py-1 rounded-md border font-medium transition-colors duration-150 bg-slate-50 hover:bg-blue-50 flex items-center justify-center gap-1"
                >
                  <Compass className="w-4 h-4" />
                  {jsonPretty ? t('compress_json', '压缩JSON') : t('beautify_json', '美化JSON')}
                </button>
              )}
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

export default JsonXmlConverter; 