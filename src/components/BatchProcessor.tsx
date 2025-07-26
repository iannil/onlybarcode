import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import JsBarcode from 'jsbarcode';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, Package, X, CheckCircle, AlertCircle, Loader, Settings, RefreshCw, Copy, Play, Trash, Info } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { useAnalytics } from '../hooks/useAnalytics';

interface BarcodeItem {
  id: string;
  text: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  fileName?: string;
  dataUrl?: string;
  error?: string;
}

interface BarcodeProcessorProps {
  mode: 'single' | 'batch';
  setMode: (mode: 'single' | 'batch') => void;
}

const BarcodeProcessor: React.FC<BarcodeProcessorProps> = ({ mode, setMode }) => {
  const { t } = useTranslation();
  const { trackEvent, trackCustomEvent } = useAnalytics();
  const [singleText, setSingleText] = useState('123456789012');
  const [items, setItems] = useState<BarcodeItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [format, setFormat] = useState('CODE128');
  const [width, setWidth] = useState<number>(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const [fontSize, setFontSize] = useState(20);
  const [margin, setMargin] = useState(10);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [lineColor, setLineColor] = useState('#000000');
  const [showSettings, setShowSettings] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [barcodesPerRow, setBarcodesPerRow] = useState(1);
  const [batchText, setBatchText] = useState('');
  const [imgSizes, setImgSizes] = useState<Record<string, { width: number; height: number }>>({});
  const [repeatCount, setRepeatCount] = useState<number>(1);
  const [showUsageTips, setShowUsageTips] = useState(false);
  const [singleError, setSingleError] = useState<string | null>(null);
  const [singlePagePDF, setSinglePagePDF] = useState(false);

  const formats = [
    { value: 'CODE128', label: t('barcode_format_code128', 'Code 128') },
    { value: 'EAN13', label: t('barcode_format_ean13', 'EAN-13') },
    { value: 'EAN8', label: t('barcode_format_ean8', 'EAN-8') },
    { value: 'CODE39', label: t('barcode_format_code39', 'Code 39') },
    { value: 'ITF14', label: t('barcode_format_itf14', 'ITF-14') },
    { value: 'MSI', label: t('barcode_format_msi', 'MSI') },
    { value: 'pharmacode', label: t('barcode_format_pharmacode', 'Pharmacode') },
    { value: 'codabar', label: t('barcode_format_codabar', 'Codabar') },
  ];

  const generateSingleBarcode = useCallback(() => {
    if (canvasRef.current && singleText.trim()) {
      try {
        JsBarcode(canvasRef.current, singleText, {
          format,
          width: width ?? 2,
          height,
          displayValue,
          fontSize,
          margin,
          background: backgroundColor,
          lineColor,
        });
        setSingleError(null);
        
        // Track successful barcode generation
        trackEvent({
          action: 'barcode_generated',
          category: 'barcode',
          label: format,
        });
      } catch (error) {
        console.error(error);
        setSingleError(t('barcode_generation_failed') + ': ' + (error instanceof Error ? error.message : error));
        
        // Track barcode generation error
        trackEvent({
          action: 'error_occurred',
          category: 'system',
          label: 'barcode_generation_failed',
        });
        
        // 清空 canvas
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    } else if (canvasRef.current) {
      // 如果内容为空也清空
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [singleText, format, width, height, displayValue, fontSize, margin, backgroundColor, lineColor, t, trackEvent]);

  useEffect(() => {
    if (mode === 'single') generateSingleBarcode();
  }, [mode, generateSingleBarcode]);

  const downloadSingleBarcode = (type: 'png' | 'svg') => {
    if (type === 'png' && canvasRef.current) {
      const link = document.createElement('a');
      link.download = `barcode-${singleText}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
      
      // Track download event
      trackEvent({
        action: 'barcode_downloaded',
        category: 'barcode',
        label: 'png',
      });
    } else if (type === 'svg' && svgRef.current) {
      if (singleText.trim()) {
        try {
          JsBarcode(svgRef.current, singleText, {
            format,
            width,
            height,
            displayValue,
            fontSize,
            margin,
            background: backgroundColor,
            lineColor,
          });
          const svgData = new XMLSerializer().serializeToString(svgRef.current);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const svgUrl = URL.createObjectURL(svgBlob);
          const link = document.createElement('a');
          link.download = `barcode-${singleText}.svg`;
          link.href = svgUrl;
          link.click();
          URL.revokeObjectURL(svgUrl);
          
          // Track download event
          trackEvent({
            action: 'barcode_downloaded',
            category: 'barcode',
            label: 'svg',
          });
        } catch (error) {
          console.error('Failed to download SVG barcode:', error);
        }
      }
    }
  };

  const copySingleBarcodeData = async () => {
    if (canvasRef.current) {
      try {
        const dataURL = canvasRef.current.toDataURL();
        await navigator.clipboard.writeText(dataURL);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {
        console.error('Failed to copy barcode data:', error);
      }
    }
  };

  const generateRandomCode = () => {
    if (format === 'EAN13') {
      setSingleText(Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0'));
    } else if (format === 'EAN8') {
      setSingleText(Math.floor(Math.random() * 10000000).toString().padStart(7, '0'));
    } else {
      setSingleText(Math.random().toString(36).substring(2, 12).toUpperCase());
    }
  };

  const handleTextImport = useCallback((text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const newItems: BarcodeItem[] = [];
    lines.forEach((line, index) => {
      for (let i = 0; i < repeatCount; i++) {
        newItems.push({
          id: `text-${Date.now()}-${index}-${i}`,
          text: line.trim(),
          status: 'pending',
        });
      }
    });
    setItems(newItems);
  }, [repeatCount]);

  const generateBarcode = async (text: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!text.trim()) {
        reject(new Error(t('barcode_content_empty')));
        return;
      }
      const canvas = document.createElement('canvas');
      try {
        JsBarcode(canvas, text, {
          format,
          width: width ?? 2,
          height,
          displayValue,
          fontSize,
          margin,
          background: backgroundColor,
          lineColor,
        });
        resolve(canvas.toDataURL());
      } catch (error) {
        reject(error);
      }
    });
  };

  const processItems = async () => {
    setProcessing(true);
    for (const item of items) {
      if (item.status === 'pending') {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'processing' } : i));
        try {
          const dataUrl = await generateBarcode(item.text);
          setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'completed', dataUrl } : i));
        } catch (error) {
          setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error', error: error instanceof Error ? error.message : t('processing_failed_generic') } : i));
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    setProcessing(false);
    
    // Track batch processing completion
    const completedCount = items.filter(item => item.status === 'completed').length;
    const errorCount = items.filter(item => item.status === 'error').length;
    
    trackCustomEvent('batch_processed', {
      total_items: items.length,
      completed_count: completedCount,
      error_count: errorCount,
    });
  };

  const downloadResults = async () => {
    const zip = new JSZip();
    const completedItems = items.filter(item => item.status === 'completed' && item.dataUrl);
    
    completedItems.forEach((item, index) => {
      if (item.dataUrl) {
        const base64Data = item.dataUrl.split(',')[1];
        zip.file(`barcode-${item.text}-${index + 1}.png`, base64Data, { base64: true });
      }
    });
    
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `barcodes-${new Date().toISOString().split('T')[0]}.zip`);
  };

  const exportPDF = async () => {
    const completedItems = items.filter(item => item.status === 'completed' && item.dataUrl);
    if (completedItems.length === 0) return;
    const pdfDoc = await PDFDocument.create();
    const pageMargin = 20;
    if (singlePagePDF) {
      // All barcodes on one page
      const pageWidth = 595.28; // A4 width pt
      const pageHeight = 841.89; // A4 height pt
      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      const x = pageMargin;
      const y = pageHeight - pageMargin;
      const maxWidth = pageWidth - 2 * pageMargin;
      const barcodeHeight = 80;
      const barcodeMargin = 10;
      let row = 0;
      let col = 0;
      const perRow = barcodesPerRow;
      const cellWidth = maxWidth / perRow;
      completedItems.forEach((item) => {
        if (!item.dataUrl) return;
        if (col >= perRow) {
          col = 0;
          row++;
        }
        const imgX = x + col * cellWidth + (cellWidth - 120) / 2;
        const imgY = y - row * (barcodeHeight + barcodeMargin) - barcodeHeight;
        pdfDoc.embedPng(item.dataUrl).then((img) => {
          page.drawImage(img, {
            x: imgX,
            y: imgY,
            width: 120,
            height: barcodeHeight,
          });
        });
        col++;
      });
    } else {
      // One barcode per page (existing logic)
      for (const item of completedItems) {
        if (!item.dataUrl) continue;
        const page = pdfDoc.addPage([300, 140]);
        const pngImage = await pdfDoc.embedPng(item.dataUrl);
        page.drawImage(pngImage, {
          x: 20,
          y: 40,
          width: 260,
          height: 80,
        });
      }
    }
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'barcodes.pdf');
    
    // Track PDF export event
    trackCustomEvent('pdf_exported', {
      barcode_count: completedItems.length,
      format: singlePagePDF ? 'single_page' : 'multi_page',
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item?.dataUrl) {
        URL.revokeObjectURL(item.dataUrl);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const clearItems = () => {
    items.forEach(item => {
      if (item.dataUrl) {
        URL.revokeObjectURL(item.dataUrl);
      }
    });
    setItems([]);
  };

  const completedCount = items.filter(item => item.status === 'completed').length;
  const errorCount = items.filter(item => item.status === 'error').length;
  const processingCount = items.filter(item => item.status === 'processing').length;

  useEffect(() => {
    if (batchText.trim()) {
      handleTextImport(batchText);
    } else {
      setItems([]);
    }
  }, [batchText, handleTextImport]);

  useEffect(() => {
    if (mode === 'batch' && items.length > 0 && items.some(i => i.status === 'completed')) {
      setItems(prev => prev.map(i => i.status === 'completed' ? { ...i, status: 'pending', dataUrl: undefined, error: undefined } : i));
    }
  }, [width, height, format, displayValue, fontSize, margin, backgroundColor, lineColor, mode, items]);

  const handleImgLoad = useCallback((id: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setImgSizes(prev => ({ ...prev, [id]: { width: naturalWidth, height: naturalHeight } }));
  }, []);

  const completedItems = items.filter(item => item.status === 'completed' && item.dataUrl);
  const previewRows: BarcodeItem[][] = [];
  for (let i = 0; i < completedItems.length; i += barcodesPerRow) {
    previewRows.push(completedItems.slice(i, i + barcodesPerRow));
  }

  const previewBarcodeElements: JSX.Element[] = [];
  previewRows.forEach((row) => {
    const margin = 16;
    const maxImgHeight = Math.max(...row.map(item => (imgSizes[item.id]?.height || (height ? height : 100))));
    row.forEach(item => {
      const imgInfo = imgSizes[item.id] || { width: 240, height: height ? height : 100 };
      const imgWidth = imgInfo.width;
      const imgHeight = imgInfo.height;
      const maxCellWidth = 240;
      const maxCellHeight = maxImgHeight;
      const scale = Math.min(maxCellWidth / imgWidth, maxCellHeight / imgHeight, 1);
      previewBarcodeElements.push(
        <div
          key={item.id}
          className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-xl bg-white mx-auto px-2 my-2 sm:my-4"
          style={{ minWidth: 0, minHeight: maxCellHeight + margin * 2 + 16, maxWidth: maxCellWidth + margin * 2, maxHeight: maxCellHeight + margin * 2 + 16 }}
        >
          {item.dataUrl && (
            <img
              src={item.dataUrl}
              alt={`Barcode for ${item.text}`}
              className="object-contain bg-white rounded"
              style={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: maxCellHeight,
                width: imgWidth * scale,
                height: imgHeight * scale,
                marginTop: margin,
                marginBottom: 8,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              onLoad={e => handleImgLoad(item.id, e)}
            />
          )}
        </div>
      );
    });
  });

  return (
    <div className="tab-content">
      {mode === 'single' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
          <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-600" />
                  {t('barcode_settings')}
                </h3>
              </div>
              <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-lg mb-4">
                <button
                  onClick={() => {
                    setMode('single');
                    window.location.hash = 'generate';
                  }}
                  className={`flex-1 h-9 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    mode === 'batch'
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'bg-white text-blue-600 shadow-sm'
                  }`}
                >
                  {t('single')}
                </button>
                <button
                  onClick={() => {
                    setMode('batch');
                    window.location.hash = 'generate-batch';
                  }}
                  className={`flex-1 h-9 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    mode === 'single'
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'bg-white text-blue-600 shadow-sm'
                  }`}
                >
                  {t('batch')}
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('text_content')}
                  </label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="text"
                      value={singleText}
                      onChange={(e) => {
                        setSingleText(e.target.value);
                        setSingleError(null);
                      }}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
                      placeholder={t('text_content_placeholder')}
                    />
                    <button
                      onClick={generateRandomCode}
                      className="px-3 py-2 bg-slate-100/80 hover:bg-slate-200/80 rounded-lg transition-colors backdrop-blur-sm sm:w-auto"
                      title={t('generate_random')}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('barcode_format')}
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {formats.map((fmt) => (
                        <option key={fmt.value} value={fmt.value}>
                          {fmt.label}
                        </option>
                      ))}
                    </select>
                    <button
                      className={`px-3 py-2 rounded-lg transition-colors backdrop-blur-sm flex items-center justify-center sm:w-auto focus:outline-none ${showUsageTips ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-slate-100/80 hover:bg-slate-200/80'}`}
                      onClick={() => setShowUsageTips((v) => !v)}
                      aria-expanded={showUsageTips}
                      aria-controls="usage-tips-list"
                      type="button"
                      title={t('usage_tips')}
                    >
                      <Info className={`w-5 h-5 ${showUsageTips ? 'text-blue-700' : 'text-slate-700'}`} />
                    </button>
                  </div>
                  {showUsageTips && (
                    <ul id="usage-tips-list" className="text-sm text-blue-800 space-y-1 mt-2">
                      {format === 'EAN13' && (
                        <>
                          <li>• {t('ean13_requirement')}</li>
                          <li>• {t('format_requirements')}</li>
                        </>
                      )}
                      {format === 'CODE128' && (
                        <>
                          <li>• {t('code128_support')}</li>
                          <li>• {t('format_requirements')}</li>
                        </>
                      )}
                      {format !== 'EAN13' && format !== 'CODE128' && (
                        <>
                          <li>• {t('format_requirements')}</li>
                          <li>• {t('adjust_size_color')}</li>
                        </>
                      )}
                    </ul>
                  )}
                </div>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  {showSettings ? t('hide_advanced_settings') : t('show_advanced_settings')}
                </button>
                {showSettings && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('line_width')}: {width}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={width ?? 2}
                          onChange={e => setWidth(Number(e.target.value) || 2)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('height')}: {height}px
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="200"
                          value={height}
                          onChange={(e) => setHeight(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('font_size')}: {fontSize}px
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="30"
                          value={fontSize}
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('margin')}: {margin}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={margin}
                          onChange={(e) => setMargin(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('background_color')}
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
                          {t('line_color')}
                        </label>
                        <input
                          type="color"
                          value={lineColor}
                          onChange={(e) => setLineColor(e.target.value)}
                          className="w-full h-10 rounded border border-gray-300"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="displayValue"
                        checked={displayValue}
                        onChange={(e) => setDisplayValue(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="displayValue" className="ml-2 text-sm text-gray-700">
                        {t('show_text')}
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-500" />
                {t('barcode_preview')}
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 text-center">
                <canvas
                  ref={canvasRef}
                  className="max-w-full mx-auto barcode-container bg-white rounded shadow-sm"
                  width={width || 300}
                  height={height || 100}
                />
                <svg ref={svgRef} style={{ display: 'none' }} width={width || 300} height={height || 100}></svg>
                {singleError && (
                  <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2 flex items-center gap-2 justify-center">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>{singleError}</span>
                  </div>
                )}
              </div>
              <div className="mt-3 sm:mt-4 lg:mt-6 flex flex-col sm:flex-row flex-wrap gap-2">
                <button
                  onClick={() => downloadSingleBarcode('png')}
                  className="flex items-center justify-center h-9 px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('download_png')}
                </button>
                <button
                  onClick={() => downloadSingleBarcode('svg')}
                  className="flex items-center justify-center h-9 px-3 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('download_svg')}
                </button>
                <button
                  onClick={copySingleBarcodeData}
                  className={`flex items-center justify-center h-9 px-3 py-2 text-sm rounded-md transition-colors shadow-sm ${
                    copySuccess 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {t('copied')}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      {t('copy_data')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-4 sm:p-6">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-600" />
                  {t('barcode_settings')}
                </h3>
              </div>
              <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-lg mb-4">
                <button
                  onClick={() => {
                    setMode('single');
                    window.location.hash = 'generate';
                  }}
                  className={`flex-1 h-9 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    mode === 'batch'
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'bg-white text-blue-600 shadow-sm'
                  }`}
                >
                  {t('single')}
                </button>
                <button
                  onClick={() => {
                    setMode('batch');
                    window.location.hash = 'generate-batch';
                  }}
                  className={`flex-1 h-9 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    mode === 'single'
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'bg-white text-blue-600 shadow-sm'
                  }`}
                >
                  {t('batch')}
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('barcode_format')}</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {formats.map((fmt) => (
                        <option key={fmt.value} value={fmt.value}>{fmt.label}</option>
                      ))}
                    </select>
                    <button
                      className={`px-3 py-2 rounded-lg transition-colors backdrop-blur-sm flex items-center justify-center sm:w-auto focus:outline-none ${showUsageTips ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-slate-100/80 hover:bg-slate-200/80'}`}
                      onClick={() => setShowUsageTips((v) => !v)}
                      aria-expanded={showUsageTips}
                      aria-controls="usage-tips-list"
                      type="button"
                      title={t('usage_tips')}
                    >
                      <Info className={`w-5 h-5 ${showUsageTips ? 'text-blue-700' : 'text-slate-700'}`} />
                    </button>
                  </div>
                  {showUsageTips && (
                    <ul id="usage-tips-list" className="text-sm text-blue-800 space-y-1 mt-2">
                      {format === 'EAN13' && (
                        <>
                          <li>• {t('ean13_requirement')}</li>
                          <li>• {t('format_requirements')}</li>
                        </>
                      )}
                      {format === 'CODE128' && (
                        <>
                          <li>• {t('code128_support')}</li>
                          <li>• {t('format_requirements')}</li>
                        </>
                      )}
                      {format !== 'EAN13' && format !== 'CODE128' && (
                        <>
                          <li>• {t('format_requirements')}</li>
                          <li>• {t('adjust_size_color')}</li>
                        </>
                      )}
                    </ul>
                  )}
                </div>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  {showSettings ? t('hide_advanced_settings') : t('show_advanced_settings')}
                </button>
                {showSettings && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('line_width')}: {width}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={width ?? 2}
                          onChange={e => setWidth(Number(e.target.value) || 2)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('height')}: {height}px
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="200"
                          value={height}
                          onChange={(e) => setHeight(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('font_size')}: {fontSize}px
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="30"
                          value={fontSize}
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('margin')}: {margin}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={margin}
                          onChange={(e) => setMargin(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('background_color')}
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
                          {t('line_color')}
                        </label>
                        <input
                          type="color"
                          value={lineColor}
                          onChange={(e) => setLineColor(e.target.value)}
                          className="w-full h-10 rounded border border-gray-300"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="displayValue-batch"
                        checked={displayValue}
                        onChange={(e) => setDisplayValue(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="displayValue-batch" className="ml-2 text-sm text-gray-700">
                        {t('show_text')}
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('barcode_repeat_count')}
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
              <div className="mt-4 sm:mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('text_input')}</label>
                <textarea
                  ref={textInputRef}
                  value={batchText}
                  onChange={e => setBatchText(e.target.value)}
                  placeholder={t('text_input_placeholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mt-3 sm:mt-4">
                <button
                  onClick={processItems}
                  disabled={processing || items.length === 0 || items.some(i => i.status === 'processing' || i.status === 'completed')}
                  className="flex items-center justify-center h-9 px-3 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm w-full sm:w-auto sm:min-w-[90px]"
                >
                  {processing ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {t('start_processing')}
                </button>
                <button
                  onClick={downloadResults}
                  disabled={completedCount === 0}
                  className="flex items-center justify-center h-9 px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm w-full sm:w-auto sm:min-w-[90px]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('export_zip')}
                </button>
                <button
                  onClick={exportPDF}
                  disabled={completedCount === 0}
                  className="flex items-center justify-center h-9 px-3 py-2 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm w-full sm:w-auto sm:min-w-[90px]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('export_pdf')}
                </button>
                <button
                  onClick={clearItems}
                  disabled={items.length === 0}
                  className="flex items-center justify-center h-9 px-3 py-2 text-sm rounded-md bg-slate-600 text-white hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm w-full sm:w-auto sm:min-w-[90px]"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  {t('clear')}
                </button>
              </div>
              {processing && processingCount > 0 && (
                <div className="mt-3 sm:mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{t('processing_progress')}</span>
                    <span>{Math.round((completedCount + errorCount) / items.length * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="progress-bar bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(completedCount + errorCount) / items.length * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              <div className="mt-4 sm:mt-6">
                <h4 className="text-sm font-semibold text-gray-500 mb-2">{t('processing_list')}</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="text-center py-4 text-slate-400 text-xs">
                      <Package className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                      <p>{t('no_items')}</p>
                    </div>
                  ) : (
                    items.map((item) => (
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
                          <span className="text-xs text-gray-600 truncate max-w-[120px]">{item.fileName || item.text}</span>
                          {item.error && (
                            <span className="text-xs text-red-400 ml-2">{item.error}</span>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-0.5 text-gray-300 hover:text-red-400 transition-colors ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                {items.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-2xl p-4 mt-4 backdrop-blur-sm">
                    <h4 className="text-sm font-medium text-slate-900 mb-3">{t('processing_list')}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                        <div className="text-xs text-slate-600">{t('success_completed')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                        <div className="text-xs text-slate-600">{t('processing_failed')}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-4 sm:p-6 min-h-[220px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-blue-500" />
                  {t('barcode_preview')}
                </h3>
              </div>
              <div className="mb-3 sm:mb-4 flex items-center space-x-4">
                <label className="text-sm text-gray-700 font-medium">{t('barcodes_per_row')}</label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={barcodesPerRow}
                  onChange={e => setBarcodesPerRow(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-blue-700 font-bold w-6 text-center">{barcodesPerRow}</span>
                <div className="flex items-center ml-4">
                  <input
                    type="checkbox"
                    id="singlePagePDF"
                    checked={singlePagePDF}
                    onChange={e => setSinglePagePDF(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="singlePagePDF" className="ml-2 text-sm text-gray-700">{t('single_page_pdf')}</label>
                </div>
              </div>
              {completedItems.length > 0 ? (
                <div
                  className={
                    barcodesPerRow > 1
                      ? `grid gap-2 sm:gap-4 pb-2 grid-cols-${barcodesPerRow}`
                      : 'flex flex-col items-center pb-2'
                  }
                  style={
                    barcodesPerRow > 1
                      ? { gridTemplateColumns: `repeat(${barcodesPerRow}, minmax(0, 1fr))` }
                      : undefined
                  }
                >
                  {previewBarcodeElements}
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center py-12 text-gray-400">
                  <Package className="w-12 h-12 mb-4 text-gray-200" />
                  <div className="text-base">{t('no_preview')}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeProcessor;