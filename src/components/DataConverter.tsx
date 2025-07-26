import React, { useState } from 'react';
import CsvJsonConverter from './CsvJsonConverter';
import JsonXmlConverter from './JsonXmlConverter';
import { FileText, Code, Braces, Shuffle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ConversionMode = 'csv2json' | 'json2csv' | 'json2xml' | 'xml2json';

const DataConverter: React.FC = () => {
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<ConversionMode>('csv2json');
  const [clearTrigger, setClearTrigger] = useState(0);

  const conversionModes = [
    { 
      id: 'csv2json' as ConversionMode, 
      label: t('csv_to_json', 'CSV → JSON'), 
      icon: FileText,
      description: t('csv_to_json_desc', '将CSV转换为JSON格式')
    },
    { 
      id: 'json2csv' as ConversionMode, 
      label: t('json_to_csv', 'JSON → CSV'), 
      icon: Braces,
      description: t('json_to_csv_desc', '将JSON转换为CSV格式')
    },
    { 
      id: 'json2xml' as ConversionMode, 
      label: t('json_to_xml', 'JSON → XML'), 
      icon: Code,
      description: t('json_to_xml_desc', '将JSON转换为XML格式')
    },
    { 
      id: 'xml2json' as ConversionMode, 
      label: t('xml_to_json', 'XML → JSON'), 
      icon: Code,
      description: t('xml_to_json_desc', '将XML转换为JSON格式')
    },
  ];

  const handleModeChange = (newMode: ConversionMode) => {
    if (newMode !== activeMode) {
      setActiveMode(newMode);
      // Trigger clear by incrementing the counter
      setClearTrigger(prev => prev + 1);
    }
  };

  return (
    <div className="w-full mx-auto px-2 sm:px-6 lg:px-8">
      {/* Conversion mode tabs and convert button in same row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
        <div className="flex flex-wrap gap-2">
          {conversionModes.map((mode) => (
            <button
              key={mode.id}
              className={`h-9 px-3 py-2 rounded-md border text-sm font-medium transition-colors duration-150 ${
                activeMode === mode.id 
                  ? 'bg-blue-50 border-blue-500 text-blue-700' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              onClick={() => handleModeChange(mode.id)}
              title={mode.description}
            >
              <mode.icon className="w-4 h-4 mr-1 inline-block align-text-bottom" />
              {mode.label}
            </button>
          ))}
        </div>
        <button
          className="h-9 px-3 py-2 rounded-md border border-blue-600 bg-blue-600 text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
          style={{ minHeight: '32px' }}
          onClick={() => {
            // Trigger convert in the active converter
            const event = new CustomEvent('triggerConvert');
            window.dispatchEvent(event);
          }}
        >
          <Shuffle className="w-4 h-4" />{t('convert')}
        </button>
      </div>
      
      {/* Converter content */}
      {(activeMode === 'csv2json' || activeMode === 'json2csv') && (
        <CsvJsonConverter mode={activeMode} clearTrigger={clearTrigger} />
      )}
      {(activeMode === 'json2xml' || activeMode === 'xml2json') && (
        <JsonXmlConverter mode={activeMode} clearTrigger={clearTrigger} />
      )}
    </div>
  );
};

export default DataConverter; 