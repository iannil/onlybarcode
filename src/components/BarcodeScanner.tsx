import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Upload, Image, X, CheckCircle, Copy, AlertCircle } from 'lucide-react';
import SEOHead from './SEOHead';
import { seoConfig, getAlternateLanguages } from '../config/seo';

interface ScanResult {
  id: string;
  text: string;
  format: string;
  fileName: string;
  timestamp: Date;
  imageUrl: string;
}

const BarcodeScanner: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // SEO配置
  const seoData = seoConfig.pages.scan[i18n.language as keyof typeof seoConfig.pages.scan] || seoConfig.pages.scan.zh;
  const alternateLanguages = getAlternateLanguages();

  const [dragOver, setDragOver] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files.filter(file => file.type.startsWith('image/')));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setScanning(true);
    setError(null);

    for (const file of files) {
      try {
        const imageUrl = URL.createObjectURL(file);
        const result = await reader.current.decodeFromImageUrl(imageUrl);
        
        const scanResult: ScanResult = {
          id: Math.random().toString(36).substr(2, 9),
          text: result.getText(),
          format: result.getBarcodeFormat().toString(),
          fileName: file.name,
          timestamp: new Date(),
          imageUrl: imageUrl,
        };

        setResults(prev => [scanResult, ...prev]);
      } catch (error) {
        console.error(`${t('recognition_failed')} ${file.name}:`, error);
        setError(`${t('cannot_recognize_file')} ${file.name}`);
      }
    }

    setScanning(false);
    

  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error(t('copy_failed') + ':', error);
    }
  };

  const removeResult = (id: string) => {
    setResults(prev => {
      const updated = prev.filter(result => result.id !== id);
      // Clean up object URLs
      const removed = prev.find(result => result.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.imageUrl);
      }
      return updated;
    });
  };

  const clearResults = () => {
    results.forEach(result => URL.revokeObjectURL(result.imageUrl));
    setResults([]);
    setError(null);
  };

  const exportResults = () => {
    const csv = [
      [t('filename'), t('barcode_content'), t('format'), t('recognition_time')],
      ...results.map(result => [
        result.fileName,
        result.text,
        result.format,
        result.timestamp.toLocaleString(i18n.language === 'zh' ? 'zh-CN' : 'en-US')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `barcode_scan_results_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tab-content">
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        alternateLanguages={alternateLanguages}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Upload Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Image className="w-5 h-5 mr-2 text-blue-600" />
              {t('image_upload')}
            </h3>

            <div
              className={`upload-zone border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ${
                dragOver ? 'dragover border-blue-400 bg-blue-50/50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-medium text-slate-900">
                    {t('drag_drop_upload')}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {t('supported_formats')}
                  </p>
                </div>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              multiple
              className="hidden"
            />

            {scanning && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>{t('scanning_barcodes')}</span>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">{t('recognition_tips')}</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• {t('ensure_clear_image')}</li>
              <li>• {t('support_multiple_formats')}</li>
              <li>• {t('batch_process_images')}</li>
              <li>• {t('export_csv_results')}</li>
            </ul>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                {t('recognition_results')} ({results.length})
              </h3>
              {results.length > 0 && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={exportResults}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors shadow-sm"
                  >
                    {t('export_csv')}
                  </button>
                  <button
                    onClick={clearResults}
                    className="px-3 py-1 bg-slate-600 text-white text-sm rounded-md hover:bg-slate-700 transition-colors shadow-sm"
                  >
                    {t('clear')}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Image className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>{t('no_recognition_results')}</p>
                  <p className="text-sm">{t('upload_images_start')}</p>
                </div>
              ) : (
                results.map((result) => (
                  <div key={result.id} className="batch-item bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <img
                        src={result.imageUrl}
                        alt={result.fileName}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md border border-gray-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {result.fileName}
                          </h4>
                          <button
                            onClick={() => removeResult(result.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-1 space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                            <span className="text-xs font-medium text-gray-500">{t('content')}:</span>
                            <span className="text-sm text-gray-900 font-mono bg-white px-2 py-1 rounded border break-all">
                              {result.text}
                            </span>
                            <button
                              onClick={() => copyToClipboard(result.text)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors self-start sm:self-auto"
                              title={t('copy_content')}
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-gray-500">
                            <span>{t('format')}: {result.format}</span>
                            <span>{t('time')}: {result.timestamp.toLocaleString(i18n.language === 'zh' ? 'zh-CN' : 'en-US')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;