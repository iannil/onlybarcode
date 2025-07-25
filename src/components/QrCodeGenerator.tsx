import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import { Settings, Package, RefreshCw, Download, CheckCircle, Copy, AlertCircle, Loader, Trash, Play, X } from 'lucide-react';

interface QrCodeGeneratorProps {
  mode: 'single' | 'batch';
  setMode: (mode: 'single' | 'batch') => void;
}

const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ mode, setMode }) => {
  const { t } = useTranslation();
  const [singleText, setSingleText] = useState('https://654653.com');
  const [batchText, setBatchText] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processingCount, setProcessingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [size, setSize] = useState(200);
  const [margin, setMargin] = useState(4);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('L');
  const [repeatCount, setRepeatCount] = useState(1);
  const [qrcodesPerRow, setQrcodesPerRow] = useState(1);
  const [printAllOnOnePage, setPrintAllOnOnePage] = useState(false);

  // 处理 processing list 数据结构
  interface QrBatchItem {
    id: string;
    text: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    dataUrl?: string;
    error?: string;
  }
  const [batchItems, setBatchItems] = useState<QrBatchItem[]>([]);

  // 生成随机字符串
  const generateRandomString = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = Math.floor(Math.random() * 10) + 10; // 10-19 characters
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // 单个生成
  const generateSingle = async () => {
    setError(null);
    if (!singleText.trim()) {
      setError(t('qrcode_content_empty', '二维码内容不能为空'));
      return;
    }
    try {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, singleText, { 
          width: size,
          margin: margin,
          color: {
            dark: foregroundColor,
            light: backgroundColor
          },
          errorCorrectionLevel: errorCorrectionLevel
        });
      }
    } catch (err) {
      setError(t('qrcode_generation_failed', '二维码生成失败'));
    }
  };

  // 批量生成逻辑调整，支持 processing list
  const generateBatch = async () => {
    setError(null);
    setProcessing(true);
    const lines = batchText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let items: QrBatchItem[] = [];
    lines.forEach((text, lineIdx) => {
      for (let i = 0; i < repeatCount; i++) {
        items.push({
          id: `qr-${Date.now()}-${lineIdx}-${i}`,
          text,
          status: 'pending',
        });
      }
    });
    setBatchItems(items);
    let completed = 0;
    let failed = 0;
    const imgs: string[] = [];
    for (let idx = 0; idx < items.length; idx++) {
      setBatchItems(prev => prev.map((item, i) => i === idx ? { ...item, status: 'processing' } : item));
      try {
        const dataUrl = await QRCode.toDataURL(items[idx].text, {
          width: size,
          margin: margin,
          color: {
            dark: foregroundColor,
            light: backgroundColor
          },
          errorCorrectionLevel: errorCorrectionLevel
        });
        imgs.push(dataUrl);
        setBatchItems(prev => prev.map((item, i) => i === idx ? { ...item, status: 'completed', dataUrl } : item));
        completed++;
      } catch (e) {
        imgs.push('');
        setBatchItems(prev => prev.map((item, i) => i === idx ? { ...item, status: 'error', error: t('qrcode_generation_failed', '二维码生成失败') } : item));
        failed++;
      }
    }
    setResults(imgs);
    setProcessing(false);
    setCompletedCount(completed);
    setErrorCount(failed);
  };

  // 批量导出相关
  const downloadSingle = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `qrcode.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const copySingle = async () => {
    if (canvasRef.current) {
      try {
        const dataURL = canvasRef.current.toDataURL();
        await navigator.clipboard.writeText(dataURL);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {}
    }
  };

  // 单项删除
  const removeBatchItem = (id: string) => {
    setBatchItems(prev => prev.filter(item => item.id !== id));
    // 同步移除 results
    // 这里假设顺序一致
    // 实际可根据 id 匹配 dataUrl
  };

  // 清空结果
  const clearResults = () => {
    setResults([]);
    setProcessingCount(0);
    setCompletedCount(0);
    setErrorCount(0);
    setBatchItems([]);
    setBatchText('');
  };

  // 导出ZIP
  const downloadResults = async () => {
    if (!results.length) return;
    const zip = new JSZip();
    results.forEach((img, idx) => {
      if (img) {
        const base64Data = img.split(',')[1];
        zip.file(`qrcode-${idx + 1}.png`, base64Data, { base64: true });
      }
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = `qrcodes-${new Date().toISOString().split('T')[0]}.zip`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // 导出PDF
  const exportPDF = async () => {
    if (!results.length) return;
    const pdfDoc = await PDFDocument.create();
    const size = Math.min(180, 600 / qrcodesPerRow - 8);
    
    if (printAllOnOnePage) {
      // 单页模式：所有二维码打印在一页
      const pageMargin = 20;
      const pageWidth = 595.28; // A4 width pt
      const pageHeight = 841.89; // A4 height pt
      const cellSize = 120;
      const perRow = qrcodesPerRow;
      let x = pageMargin;
      let y = pageHeight - pageMargin;
      let row = 0;
      let col = 0;
      let page = pdfDoc.addPage([pageWidth, pageHeight]);
      
      for (let i = 0; i < results.length; i++) {
        if (col >= perRow) {
          col = 0;
          row++;
          x = pageMargin;
          y -= cellSize + 20;
          if (y < pageMargin + cellSize) {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            y = pageHeight - pageMargin;
            row = 0;
          }
        }
        const imgData = results[i];
        if (imgData) {
          const pngImage = await pdfDoc.embedPng(imgData);
          page.drawImage(pngImage, {
            x: x + col * (cellSize + 10),
            y: y - cellSize,
            width: cellSize,
            height: cellSize,
          });
        }
        col++;
      }
    } else {
      // 多页模式：每页一个二维码
      for (let i = 0; i < results.length; i++) {
        const page = pdfDoc.addPage([size, size]);
        const imgData = results[i];
        if (imgData) {
          const pngImage = await pdfDoc.embedPng(imgData);
          page.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: size,
            height: size,
          });
        }
      }
    }
    
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `qrcodes-${new Date().toISOString().split('T')[0]}.pdf`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  useEffect(() => {
    if (mode === 'single') {
      generateSingle();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="tab-content">
      {mode === 'single' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          <div className="flex flex-col min-h-[420px] h-full gap-4 sm:gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6 sm:p-6 flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-600" />
                  {t('qrcode_settings', '二维码设置')}
                </h3>
              </div>
              <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-lg mb-4">
                <button
                  onClick={() => {
                    setMode('single');
                    window.location.hash = 'qrcode-generate';
                  }}
                  className={`flex-1 px-3 py-2 sm:py-1 rounded-xl text-base sm:text-xs font-medium transition-all duration-200 ${
                    mode === 'single'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t('single', '单个')}
                </button>
                <button
                  onClick={() => {
                    setMode('batch');
                    window.location.hash = 'qrcode-generate-batch';
                  }}
                  className={`flex-1 px-3 py-2 sm:py-1 rounded-xl text-base sm:text-xs font-medium transition-all duration-200 ${
                    mode === 'single'
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'bg-white text-blue-600 shadow-sm'
                  }`}
                >
                  {t('batch', '批量')}
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('text_content', '内容')}
                  </label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="text"
                      value={singleText}
                      onChange={e => setSingleText(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
                      placeholder={t('text_content_placeholder', '输入内容') as string}
                    />
                    <button
                      onClick={() => {
                        const randomString = generateRandomString();
                        setSingleText(randomString);
                        // Generate QR code immediately after setting random text
                        setTimeout(() => generateSingle(), 100);
                      }}
                      className="px-3 py-2 bg-slate-100/80 hover:bg-slate-200/80 rounded-lg transition-colors backdrop-blur-sm sm:w-auto"
                      title={t('reset', '重置')}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  {showSettings ? t('hide_advanced_settings', '隐藏高级设置') : t('show_advanced_settings', '显示高级设置')}
                </button>
                {showSettings && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('size', '尺寸')}: {size}px
                        </label>
                        <input
                          type="range"
                          min="100"
                          max="400"
                          value={size}
                          onChange={(e) => setSize(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('margin', '边距')}: {margin}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={margin}
                          onChange={(e) => setMargin(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('background_color', '背景色')}
                        </label>
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-full h-10 rounded border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('foreground_color', '前景色')}
                        </label>
                        <input
                          type="color"
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          className="w-full h-10 rounded border border-gray-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('error_correction_level', '错误纠正级别')}
                      </label>
                      <select
                        value={errorCorrectionLevel}
                        onChange={(e) => setErrorCorrectionLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                        className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="L">{t('error_correction_l', 'L - 低 (7%)')}</option>
                        <option value="M">{t('error_correction_m', 'M - 中 (15%)')}</option>
                        <option value="Q">{t('error_correction_q', 'Q - 高 (25%)')}</option>
                        <option value="H">{t('error_correction_h', 'H - 最高 (30%)')}</option>
                      </select>
                    </div>
                  </div>
                )}
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded mb-2"
                  onClick={generateSingle}
                >
                  {t('generate_qrcode', '生成二维码')}
                </button>
              </div>
            </div>
            <div className="flex-grow" />
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-500" />
                {t('qrcode_preview', '二维码预览')}
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 text-center">
                <canvas
                  ref={canvasRef}
                  className="max-w-full mx-auto barcode-container bg-white rounded shadow-sm"
                  width={200}
                  height={200}
                />
                {error && (
                  <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2 flex items-center gap-2 justify-center">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap gap-2">
                <button
                  onClick={downloadSingle}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('download_png', '下载PNG')}
                </button>
                <button
                  onClick={copySingle}
                  className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors shadow-sm ${
                    copySuccess 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {t('copied', '已复制')}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      {t('copy_data', '复制图片')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-600" />
                  {t('qrcode_settings', '二维码设置')}
                </h3>
              </div>
              <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-lg mb-4">
                <button
                  onClick={() => {
                    setMode('single');
                    window.location.hash = 'qrcode-generate';
                  }}
                  className={`flex-1 px-3 py-2 sm:py-1 rounded-xl text-base sm:text-xs font-medium transition-all duration-200 ${
                    mode === 'batch'
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'bg-white text-blue-600 shadow-sm'
                  }`}
                >
                  {t('single', '单个')}
                </button>
                <button
                  onClick={() => {
                    setMode('batch');
                    window.location.hash = 'qrcode-generate-batch';
                  }}
                  className={`flex-1 px-3 py-2 sm:py-1 rounded-xl text-base sm:text-xs font-medium transition-all duration-200 ${
                    mode === 'batch'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t('batch', '批量')}
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('input_batch_content', '每行一个内容')}
                  </label>
                  <textarea
                    className="w-full border rounded p-2 mb-2"
                    rows={6}
                    value={batchText}
                    onChange={e => setBatchText(e.target.value)}
                    placeholder={t('input_batch_content', '每行一个内容') as string}
                  />
                </div>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  {showSettings ? t('hide_advanced_settings', '隐藏高级设置') : t('show_advanced_settings', '显示高级设置')}
                </button>
                {showSettings && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('size', '尺寸')}: {size}px
                        </label>
                        <input
                          type="range"
                          min="100"
                          max="400"
                          value={size}
                          onChange={(e) => setSize(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('margin', '边距')}: {margin}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={margin}
                          onChange={(e) => setMargin(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('background_color', '背景色')}
                        </label>
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-full h-10 rounded border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('foreground_color', '前景色')}
                        </label>
                        <input
                          type="color"
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          className="w-full h-10 rounded border border-gray-300"
                        />
                      </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('error_correction_level', '错误纠正级别')}
                        </label>
                        <select
                          value={errorCorrectionLevel}
                          onChange={(e) => setErrorCorrectionLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                          className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="L">{t('error_correction_l', 'L - 低 (7%)')}</option>
                          <option value="M">{t('error_correction_m', 'M - 中 (15%)')}</option>
                          <option value="Q">{t('error_correction_q', 'Q - 高 (25%)')}</option>
                          <option value="H">{t('error_correction_h', 'H - 最高 (30%)')}</option>
                        </select>
                      </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('repeat_count', '重复生成次数')}
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={repeatCount}
                          onChange={e => setRepeatCount(Number(e.target.value) || 1)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                      
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Processing List 区域，含四个操作按钮 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6">
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-4">
                <button
                  onClick={generateBatch}
                  disabled={processing || !batchText.trim()}
                  className="flex items-center justify-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm w-full sm:w-auto sm:min-w-[90px]"
                >
                  {processing ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {t('batch_generate', '批量生成')}
                </button>
                <button
                  onClick={downloadResults}
                  disabled={results.length === 0}
                  className="flex items-center justify-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm w-full sm:w-auto sm:min-w-[90px]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('export_zip', '导出ZIP')}
                </button>
                <button
                  onClick={exportPDF}
                  disabled={results.length === 0}
                  className="flex items-center justify-center px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm w-full sm:w-auto sm:min-w-[90px]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('export_pdf', '导出PDF')}
                </button>
                <button
                  onClick={clearResults}
                  disabled={results.length === 0 && !batchText.trim() && batchItems.length === 0}
                  className="flex items-center justify-center px-3 py-2 text-sm bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm w-full sm:w-auto sm:min-w-[90px]"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  {t('clear', '清空')}
                </button>
              </div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">{t('processing_list', '处理列表')}</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {batchItems.length === 0 ? (
                  <div className="text-center py-4 text-slate-400 text-xs">
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                    <p>{t('no_items', '暂无数据')}</p>
                  </div>
                ) : (
                  batchItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        {item.status === 'pending' && (
                          <div className="w-3 h-3 border border-gray-300 rounded-full"></div>
                        )}
                        {item.status === 'processing' && (
                          <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {item.status === 'completed' && (
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        )}
                        {item.status === 'error' && (
                          <AlertCircle className="w-3 h-3 text-red-400" />
                        )}
                        <span className="text-xs text-gray-600 truncate max-w-[120px]">{item.text}</span>
                        {item.error && (
                          <span className="text-xs text-red-400 ml-2">{item.error}</span>
                        )}
                      </div>
                      <button
                        onClick={() => removeBatchItem(item.id)}
                        className="p-0.5 text-gray-300 hover:text-red-400 transition-colors ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
              {batchItems.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-2xl p-4 mt-4 backdrop-blur-sm">
                  <h4 className="text-sm font-medium text-slate-900 mb-3">{t('processing_list', '处理列表')}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                      <div className="text-xs text-slate-600">{t('success_completed', '成功')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                      <div className="text-xs text-slate-600">{t('processing_failed', '失败')}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-500" />
                {t('qrcode_preview', '二维码预览')}
              </h3>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="text-sm text-gray-700 font-medium">{t('qrcodes_per_row', '每行二维码数')}</label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={qrcodesPerRow}
                    onChange={e => setQrcodesPerRow(Number(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-blue-700 font-bold w-6 text-center">{qrcodesPerRow}</span>
                </div>
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={printAllOnOnePage}
                    onChange={e => setPrintAllOnOnePage(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{t('print_all_on_one_page', '全部打印在单页PDF')}</span>
                </label>
              </div>
              <div 
                className="grid my-4"
                style={{ gridTemplateColumns: `repeat(${qrcodesPerRow}, 1fr)`, gap: '8px' }}
              >
                {results.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 col-span-full">
                    <span>{t('no_qrcode_results', '暂无二维码')}</span>
                  </div>
                ) : (
                  results.map((img, idx) =>
                    img ? (
                      <div key={idx} className="flex justify-center items-center">
                        <img 
                          src={img} 
                          alt={`qrcode-${idx}`} 
                          style={{ 
                            width: Math.min(180, 600 / qrcodesPerRow - 8), 
                            height: Math.min(180, 600 / qrcodesPerRow - 8), 
                            aspectRatio: '1 / 1',
                            objectFit: 'contain',
                            display: 'block'
                          }}
                        />
                      </div>
                    ) : null
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrCodeGenerator; 