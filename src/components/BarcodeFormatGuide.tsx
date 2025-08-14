import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, CheckCircle, AlertCircle, Search } from 'lucide-react';
import SEOHead from './SEOHead';
import { getAlternateLanguages } from '../config/seo';

interface FormatInfo {
  value: string;
  label: string;
  description: string;
  example: string;
  validation: RegExp;
  useCases: string[];
  limitations: string[];
  category: string;
}

const BarcodeFormatGuide: React.FC = () => {
  const { t } = useTranslation();
  
  // SEO配置
  const seoData = {
    title: t('barcode_format_guide'),
    description: t('format_guide_description'),
    keywords: '条码格式,条码类型,条码指南,barcode format,barcode types'
  };
  const alternateLanguages = getAlternateLanguages();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const formatCategories = [
    { value: 'all', label: t('all_formats', '所有格式') },
    { value: 'retail', label: t('retail_formats', '零售格式') },
    { value: 'industrial', label: t('industrial_formats', '工业格式') },
    { value: 'logistics', label: t('logistics_formats', '物流格式') },
    { value: 'pharmaceutical', label: t('pharmaceutical_formats', '药品格式') },
    { value: '2d', label: t('2d_formats', '2D格式') },
  ];

  const formats: FormatInfo[] = [
    {
      value: 'CODE128',
      label: 'Code 128',
      description: t('format_info_code128'),
      example: 'ABC123',
      validation: /^[\u0000-\u007F]+$/, // eslint-disable-line no-control-regex
      useCases: [t('code128_use_case1'), t('code128_use_case2'), t('code128_use_case3')],
      limitations: [t('code128_limit1')],
      category: 'industrial'
    },
    {
      value: 'CODE128A',
      label: 'Code 128A',
      description: t('format_info_code128a'),
      example: 'ABC123',
      validation: /^[A-Z0-9\u0000-\u001F]+$/, // eslint-disable-line no-control-regex
      useCases: [t('code128a_use_case1'), t('code128a_use_case2')],
      limitations: [t('code128a_limit1'), t('code128a_limit2')],
      category: 'industrial'
    },
    {
      value: 'CODE128B',
      label: 'Code 128B',
      description: t('format_info_code128b'),
      example: 'ABC123!@#',
      validation: /^[\u0020-\u007F]+$/,
      useCases: [t('code128b_use_case1'), t('code128b_use_case2')],
      limitations: [t('code128b_limit1')],
      category: 'industrial'
    },
    {
      value: 'CODE128C',
      label: 'Code 128C',
      description: t('format_info_code128c'),
      example: '123456',
      validation: /^[0-9]{2,}$/,
      useCases: [t('code128c_use_case1'), t('code128c_use_case2')],
      limitations: [t('code128c_limit1'), t('code128c_limit2')],
      category: 'industrial'
    },
    {
      value: 'EAN13',
      label: 'EAN-13',
      description: t('format_info_ean13'),
      example: '1234567890128',
      validation: /^[0-9]{13}$/,
      useCases: [t('ean13_use_case1'), t('ean13_use_case2')],
      limitations: [t('ean13_limit1'), t('ean13_limit2')],
      category: 'retail'
    },
    {
      value: 'EAN8',
      label: 'EAN-8',
      description: t('format_info_ean8'),
      example: '12345678',
      validation: /^[0-9]{8}$/,
      useCases: [t('ean8_use_case1'), t('ean8_use_case2')],
      limitations: [t('ean8_limit1'), t('ean8_limit2')],
      category: 'retail'
    },
    {
      value: 'EAN5',
      label: 'EAN-5',
      description: t('format_info_ean5'),
      example: '12345',
      validation: /^[0-9]{5}$/,
      useCases: [t('ean5_use_case1'), t('ean5_use_case2')],
      limitations: [t('ean5_limit1'), t('ean5_limit2')],
      category: 'retail'
    },
    {
      value: 'EAN2',
      label: 'EAN-2',
      description: t('format_info_ean2'),
      example: '12',
      validation: /^[0-9]{2}$/,
      useCases: [t('ean2_use_case1'), t('ean2_use_case2')],
      limitations: [t('ean2_limit1'), t('ean2_limit2')],
      category: 'retail'
    },
    {
      value: 'UPC',
      label: 'UPC-A',
      description: t('format_info_upc'),
      example: '123456789012',
      validation: /^[0-9]{12}$/,
      useCases: [t('upc_use_case1'), t('upc_use_case2')],
      limitations: [t('upc_limit1'), t('upc_limit2')],
      category: 'retail'
    },
    {
      value: 'UPCE',
      label: 'UPC-E',
      description: t('format_info_upce'),
      example: '12345678',
      validation: /^[0-9]{8}$/,
      useCases: [t('upce_use_case1'), t('upce_use_case2')],
      limitations: [t('upce_limit1'), t('upce_limit2')],
      category: 'retail'
    },
    {
      value: 'CODE39',
      label: 'Code 39',
      description: t('format_info_code39'),
      example: 'ABC-123',
      validation: /^[0-9A-Z\-./+\s$%]+$/,
      useCases: [t('code39_use_case1'), t('code39_use_case2')],
      limitations: [t('code39_limit1'), t('code39_limit2')],
      category: 'industrial'
    },
    {
      value: 'CODE93',
      label: 'Code 93',
      description: t('format_info_code93'),
      example: 'ABC123',
      validation: /^[\u0000-\u007F]+$/, // eslint-disable-line no-control-regex
      useCases: [t('code93_use_case1'), t('code93_use_case2')],
      limitations: [t('code93_limit1')],
      category: 'logistics'
    },
    {
      value: 'ITF',
      label: 'ITF',
      description: t('format_info_itf'),
      example: '123456',
      validation: /^[0-9]{2,}$/,
      useCases: [t('itf_use_case1'), t('itf_use_case2')],
      limitations: [t('itf_limit1'), t('itf_limit2')],
      category: 'logistics'
    },
    {
      value: 'ITF14',
      label: 'ITF-14',
      description: t('format_info_itf14'),
      example: '12345678901234',
      validation: /^[0-9]{14}$/,
      useCases: [t('itf14_use_case1'), t('itf14_use_case2')],
      limitations: [t('itf14_limit1'), t('itf14_limit2')],
      category: 'logistics'
    },
    {
      value: 'MSI',
      label: 'MSI',
      description: t('format_info_msi'),
      example: '123456',
      validation: /^[0-9]+$/,
      useCases: [t('msi_use_case1'), t('msi_use_case2')],
      limitations: [t('msi_limit1')],
      category: 'retail'
    },
    {
      value: 'MSI10',
      label: 'MSI10',
      description: t('format_info_msi10'),
      example: '123456',
      validation: /^[0-9]+$/,
      useCases: [t('msi10_use_case1'), t('msi10_use_case2')],
      limitations: [t('msi10_limit1')],
      category: 'retail'
    },
    {
      value: 'MSI11',
      label: 'MSI11',
      description: t('format_info_msi11'),
      example: '123456',
      validation: /^[0-9]+$/,
      useCases: [t('msi11_use_case1'), t('msi11_use_case2')],
      limitations: [t('msi11_limit1')],
      category: 'retail'
    },
    {
      value: 'MSI1010',
      label: 'MSI1010',
      description: t('format_info_msi1010'),
      example: '123456',
      validation: /^[0-9]+$/,
      useCases: [t('msi1010_use_case1'), t('msi1010_use_case2')],
      limitations: [t('msi1010_limit1')],
      category: 'retail'
    },
    {
      value: 'MSI1110',
      label: 'MSI1110',
      description: t('format_info_msi1110'),
      example: '123456',
      validation: /^[0-9]+$/,
      useCases: [t('msi1110_use_case1'), t('msi1110_use_case2')],
      limitations: [t('msi1110_limit1')],
      category: 'retail'
    },
    {
      value: 'pharmacode',
      label: 'Pharmacode',
      description: t('format_info_pharmacode'),
      example: '123456',
      validation: /^[0-9]+$/,
      useCases: [t('pharmacode_use_case1'), t('pharmacode_use_case2')],
      limitations: [t('pharmacode_limit1')],
      category: 'pharmaceutical'
    },
    {
      value: 'codabar',
      label: 'Codabar',
      description: t('format_info_codabar'),
      example: 'A123456B',
      validation: /^[A-D][0-9\-$:/.+]+[A-D]$/,
      useCases: [t('codabar_use_case1'), t('codabar_use_case2')],
      limitations: [t('codabar_limit1')],
      category: 'pharmaceutical'
    },
    // 2D Barcode formats
    {
      value: 'DATAMATRIX',
      label: t('barcode_format_datamatrix'),
      description: t('format_info_datamatrix'),
      example: 'ABC123!@#',
      validation: /^[\u0000-\u007F]+$/, // eslint-disable-line no-control-regex
      useCases: [t('datamatrix_use_case1'), t('datamatrix_use_case2'), t('datamatrix_use_case3')],
      limitations: [t('datamatrix_limit1'), t('datamatrix_limit2')],
      category: '2d'
    },
    {
      value: 'PDF417',
      label: t('barcode_format_pdf417'),
      description: t('format_info_pdf417'),
      example: 'ABC123!@#',
      validation: /^[\u0000-\u007F]+$/, // eslint-disable-line no-control-regex
      useCases: [t('pdf417_use_case1'), t('pdf417_use_case2'), t('pdf417_use_case3')],
      limitations: [t('pdf417_limit1'), t('pdf417_limit2')],
      category: '2d'
    },
    {
      value: 'AZTEC',
      label: t('barcode_format_aztec'),
      description: t('format_info_aztec'),
      example: 'ABC123!@#',
      validation: /^[\u0000-\u007F]+$/, // eslint-disable-line no-control-regex
      useCases: [t('aztec_use_case1'), t('aztec_use_case2'), t('aztec_use_case3')],
      limitations: [t('aztec_limit1'), t('aztec_limit2')],
      category: '2d'
    },
    {
      value: 'DOTCODE',
      label: t('barcode_format_dotcode'),
      description: t('format_info_dotcode'),
      example: 'ABC123!@#',
      validation: /^[\u0000-\u007F]+$/, // eslint-disable-line no-control-regex
      useCases: [t('dotcode_use_case1'), t('dotcode_use_case2'), t('dotcode_use_case3')],
      limitations: [t('dotcode_limit1'), t('dotcode_limit2')],
      category: '2d'
    },
  ];

  const filteredFormats = formats.filter(format => {
    const matchesSearch = format.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         format.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || format.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="tab-content">
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        alternateLanguages={alternateLanguages}
      />
      
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6 mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
            <Info className="w-6 h-6 mr-3 text-blue-600" />
            {t('barcode_format_guide', '条码格式指南')}
          </h1>
          <p className="text-slate-600 mb-6">
            {t('format_guide_description', '了解各种条码格式的特点、用途和限制，选择最适合您需求的格式。')}
          </p>
          
          {/* 搜索和筛选 */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('search_formats', '搜索格式...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {formatCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 格式列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFormats.map((format) => (
            <div key={format.value} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{format.label}</h3>
                  <p className="text-sm text-slate-500">{format.value}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  format.category === 'retail' ? 'bg-green-100 text-green-800' :
                  format.category === 'industrial' ? 'bg-blue-100 text-blue-800' :
                  format.category === 'logistics' ? 'bg-purple-100 text-purple-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {formatCategories.find(c => c.value === format.category)?.label}
                </span>
              </div>
              
              <p className="text-slate-600 mb-4">{format.description}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    {t('example', '示例')}
                  </h4>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {format.example}
                  </code>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    {t('use_cases', '使用场景')}
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {format.useCases.map((useCase, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {format.limitations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1 text-orange-500" />
                      {t('limitations', '限制')}
                    </h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {format.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredFormats.length === 0 && (
          <div className="text-center py-12">
            <Info className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">{t('no_formats_found', '未找到匹配的格式')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodeFormatGuide;
