import React, { useState, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Upload, Image, X, CheckCircle, Copy, AlertCircle } from 'lucide-react';

interface ScanResult {
  id: string;
  text: string;
  format: string;
  fileName: string;
  timestamp: Date;
  imageUrl: string;
}

const BarcodeScanner: React.FC = () => {
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
        console.error(`识别失败 ${file.name}:`, error);
        setError(`无法识别文件 ${file.name} 中的条形码`);
      }
    }

    setScanning(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('复制失败:', error);
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
      ['文件名', '条形码内容', '格式', '识别时间'],
      ...results.map(result => [
        result.fileName,
        result.text,
        result.format,
        result.timestamp.toLocaleString('zh-CN')
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Image className="w-5 h-5 mr-2 text-blue-600" />
              图片上传
            </h3>

            <div
              className={`upload-zone border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                dragOver ? 'dragover' : ''
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    拖拽图片到此处或点击上传
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    支持 JPG、PNG、WEBP 格式，可多选
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
                <span>正在识别条形码...</span>
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
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">识别提示</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 确保图片清晰，条形码完整可见</li>
              <li>• 支持多种条形码格式识别</li>
              <li>• 可同时上传多张图片批量处理</li>
              <li>• 识别结果可导出为CSV文件</li>
            </ul>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                识别结果 ({results.length})
              </h3>
              {results.length > 0 && (
                <div className="flex space-x-2">
                  <button
                    onClick={exportResults}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                  >
                    导出CSV
                  </button>
                  <button
                    onClick={clearResults}
                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                  >
                    清空
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Image className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>暂无识别结果</p>
                  <p className="text-sm">上传图片开始识别条形码</p>
                </div>
              ) : (
                results.map((result) => (
                  <div key={result.id} className="batch-item bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <img
                        src={result.imageUrl}
                        alt={result.fileName}
                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {result.fileName}
                          </h4>
                          <button
                            onClick={() => removeResult(result.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-500">内容:</span>
                            <span className="text-sm text-gray-900 font-mono bg-white px-2 py-1 rounded border">
                              {result.text}
                            </span>
                            <button
                              onClick={() => copyToClipboard(result.text)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="复制内容"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>格式: {result.format}</span>
                            <span>时间: {result.timestamp.toLocaleString('zh-CN')}</span>
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