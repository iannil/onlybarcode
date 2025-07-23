import React, { useState, useRef, useEffect, useCallback } from 'react';
import JsBarcode from 'jsbarcode';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Upload, Download, FileText, Package, X, CheckCircle, AlertCircle, Loader, Settings, RefreshCw, Copy, Play } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface BarcodeItem {
  id: string;
  text: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  fileName?: string;
  dataUrl?: string;
  error?: string;
}

type Mode = 'single' | 'batch';

const BarcodeProcessor: React.FC = () => {
  // 模式：单个/批量
  const [mode, setMode] = useState<Mode>('single');
  // 单个输入
  const [singleText, setSingleText] = useState('123456789012');
  // 批量输入
  const [items, setItems] = useState<BarcodeItem[]>([]);
  const [processing, setProcessing] = useState(false);
  // 通用设置
  const [format, setFormat] = useState('CODE128');
  // 1. width 只允许 number | undefined
  const [width, setWidth] = useState<number>(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const [fontSize, setFontSize] = useState(20);
  const [margin, setMargin] = useState(10);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [lineColor, setLineColor] = useState('#000000');
  const [showSettings, setShowSettings] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  // 条码预览每行数量，默认1，最大5
  const [barcodesPerRow, setBarcodesPerRow] = useState(1);
  // 1. 新增批量输入文本的state
  const [batchText, setBatchText] = useState('');
  // 1. 新增页面宽高 state
  const [pageWidth, setPageWidth] = useState<string | number>('');
  const [pageHeight, setPageHeight] = useState(140);
  // 用于存储每个条码图片的实际宽度
  const [imgSizes, setImgSizes] = useState<Record<string, { width: number; height: number }>>({});
  // 在 state 区域添加 repeatCount
  const [repeatCount, setRepeatCount] = useState<number>(1);

  const formats = [
    { value: 'CODE128', label: 'Code 128' },
    { value: 'EAN13', label: 'EAN-13' },
    { value: 'EAN8', label: 'EAN-8' },
    { value: 'CODE39', label: 'Code 39' },
    { value: 'ITF14', label: 'ITF-14' },
    { value: 'MSI', label: 'MSI' },
    { value: 'pharmacode', label: 'Pharmacode' },
    { value: 'codabar', label: 'Codabar' },
  ];

  // 单个生成条形码
  const generateSingleBarcode = () => {
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
      } catch (error) {
        console.error(error);
        alert('条码生成失败: ' + (error instanceof Error ? error.message : error));
      }
    }
  };

  useEffect(() => {
    if (mode === 'single') generateSingleBarcode();
    // eslint-disable-next-line
  }, [singleText, format, width, height, displayValue, fontSize, margin, backgroundColor, lineColor, mode]);

  // 单个下载
  const downloadSingleBarcode = (type: 'png' | 'svg') => {
    if (type === 'png' && canvasRef.current) {
      const link = document.createElement('a');
      link.download = `barcode-${singleText}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
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
        } catch (error) {}
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
      } catch (error) {}
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

  // 批量逻辑（原BatchProcessor）
  const handleTextImport = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    let newItems: BarcodeItem[] = [];
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
  };

  const handleFileImport = async (files: File[]) => {
    for (const file of files) {
      if (file.type === 'text/plain') {
        const text = await file.text();
        handleTextImport(text);
      }
    }
  };

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
    handleFileImport(files);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileImport(files);
  };

  const generateBarcode = async (text: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!text.trim()) {
        reject(new Error('条码内容不能为空'));
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
        console.error(error);
        reject(error);
      }
    });
  };

  const processItems = async () => {
    if (items.length === 0) return;
    setProcessing(true);
    for (const item of items) {
      if (item.status !== 'pending') continue;
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'processing' } : i));
      try {
        const dataUrl = await generateBarcode(item.text);
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'completed', dataUrl } : i));
      } catch (error) {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error', error: error instanceof Error ? error.message : '处理失败' } : i));
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    setProcessing(false);
  };

  const downloadResults = async () => {
    const completedItems = items.filter(item => item.status === 'completed' && item.dataUrl);
    if (completedItems.length === 0) return;
    if (completedItems.length === 1) {
      const item = completedItems[0];
      const link = document.createElement('a');
      link.href = item.dataUrl!;
      link.download = `barcode-${item.text}.png`;
      link.click();
    } else {
      const zip = new JSZip();
      for (const item of completedItems) {
        if (item.dataUrl) {
          const response = await fetch(item.dataUrl);
          const blob = await response.blob();
          const fileName = `barcode-${item.text.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
          zip.file(fileName, blob);
        }
      }
      const csvContent = [
        ['文本内容', '文件名', '状态'],
        ...items.map(item => [
          item.text,
          item.fileName || `barcode-${item.text.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
          item.status === 'completed' ? '成功' : item.status === 'error' ? '失败' : '待处理'
        ])
      ].map(row => row.join(',')).join('\n');
      zip.file('batch_results.csv', '\ufeff' + csvContent);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `batch_barcodes_${new Date().toISOString().split('T')[0]}.zip`);
    }
  };

  // PDF 导出逻辑
  const exportPDF = async () => {
    const completedItems = items.filter(item => item.status === 'completed' && item.dataUrl);
    if (completedItems.length === 0) return;

    const pdfDoc = await PDFDocument.create();

    // Embed font once
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (const item of completedItems) {
      // Load image as Uint8Array
      const response = await fetch(item.dataUrl!);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const pngImage = await pdfDoc.embedPng(new Uint8Array(arrayBuffer));
      const imgWidth = pngImage.width;
      const imgHeight = pngImage.height;

      // Set page size to image size + some margin
      const margin = 32;
      const pageWidth = imgWidth + margin * 2;
      const pageHeight = imgHeight + margin * 2 + 32; // extra for text
      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      // Draw white background
      page.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        color: rgb(1, 1, 1),
      });

      // Draw image centered
      page.drawImage(pngImage, {
        x: margin,
        y: margin + 24,
        width: imgWidth,
        height: imgHeight,
      });

      // Draw text below barcode
      // Center the text horizontally using font metrics
      const fontSize = 16;
      const textWidth = font.widthOfTextAtSize(item.text, fontSize);
      const textX = (pageWidth - textWidth) / 2;
      page.drawText(item.text, {
        x: textX,
        y: margin,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, `batch_barcodes_${new Date().toISOString().split('T')[0]}.pdf`);
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

  // 2. useEffect 监听 batchText 变化，自动导入并生成条码
  useEffect(() => {
    if (batchText.trim()) {
      handleTextImport(batchText);
    } else {
      setItems([]);
    }
    // eslint-disable-next-line
  }, [batchText, repeatCount]);

  // barcodesPerRow 已经是受控布局，布局会自动响应

  // 新增 useEffect：参数变化时重置已完成items为pending，触发processItems重新生成图片
  useEffect(() => {
    if (mode === 'batch' && items.length > 0 && items.some(i => i.status === 'completed')) {
      setItems(prev => prev.map(i => i.status === 'completed' ? { ...i, status: 'pending', dataUrl: undefined, error: undefined } : i));
    }
    // eslint-disable-next-line
  }, [width, height, format, displayValue, fontSize, margin, backgroundColor, lineColor]);

  // 图片加载后回调，记录实际宽高
  const handleImgLoad = useCallback((id: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setImgSizes(prev => ({ ...prev, [id]: { width: naturalWidth, height: naturalHeight } }));
  }, []);

  // 预览区分组逻辑，保证每行高度一致
  const completedItems = items.filter(item => item.status === 'completed' && item.dataUrl);
  const previewRows: BarcodeItem[][] = [];
  for (let i = 0; i < completedItems.length; i += barcodesPerRow) {
    previewRows.push(completedItems.slice(i, i + barcodesPerRow));
  }

  // 生成预览条码元素，保证每行高度一致
  const previewBarcodeElements: JSX.Element[] = [];
  previewRows.forEach((row, rowIdx) => {
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
          className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-xl bg-white mx-auto px-2 my-4"
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
      {/* 主体内容 */}
      {mode === 'single' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 输入设置 */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-600" />
                  条形码设置
                </h3>
                {/* 简洁的模式切换 */}
                <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-lg">
                  <button
                    onClick={() => setMode('single')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                      mode === 'single'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    单个
                  </button>
                  <button
                    onClick={() => setMode('batch')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                      mode === 'batch'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    批量
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    文本内容
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={singleText}
                      onChange={(e) => setSingleText(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
                      placeholder="请输入要生成条形码的文本"
                    />
                    <button
                      onClick={generateRandomCode}
                      className="px-3 py-2 bg-slate-100/80 hover:bg-slate-200/80 rounded-lg transition-colors backdrop-blur-sm"
                      title="生成随机码"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    条形码格式
                  </label>
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
                </div>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  {showSettings ? '隐藏高级设置' : '显示高级设置'}
                </button>
                {showSettings && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          线条宽度: {width}
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
                          高度: {height}px
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
                          字体大小: {fontSize}px
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
                          边距: {margin}px
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
                          背景颜色
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
                          线条颜色
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
                        显示文本
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* 预览区 */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">条形码预览</h3>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <canvas
                  ref={canvasRef}
                  className="max-w-full mx-auto barcode-container bg-white rounded shadow-sm"
                  width={width || 300}
                  height={height || 100}
                />
                <svg ref={svgRef} style={{ display: 'none' }} width={width || 300} height={height || 100}></svg>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={() => downloadSingleBarcode('png')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载 PNG
                </button>
                <button
                  onClick={() => downloadSingleBarcode('svg')}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载 SVG
                </button>
                <button
                  onClick={copySingleBarcodeData}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors shadow-sm ${
                    copySuccess 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      复制数据
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">使用提示</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 不同格式对文本内容有特定要求</li>
                <li>• EAN-13需要12-13位数字</li>
                <li>• Code 128支持字母和数字</li>
                <li>• 可调节尺寸和颜色以适应不同需求</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 批量输入区 */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-600" />
                  条形码设置
                </h3>
                {/* 简洁的模式切换 */}
                <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-lg">
                  <button
                    onClick={() => setMode('single')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                      mode === 'single'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    单个
                  </button>
                  <button
                    onClick={() => setMode('batch')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                      mode === 'batch'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    批量
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">条形码格式</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {formats.map((fmt) => (
                      <option key={fmt.value} value={fmt.value}>{fmt.label}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  {showSettings ? '隐藏高级设置' : '显示高级设置'}
                </button>
                {showSettings && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          线条宽度: {width}
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
                          高度: {height}px
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
                          字体大小: {fontSize}px
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
                          边距: {margin}px
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
                          背景颜色
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
                          线条颜色
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
                        显示文本
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          条码重复生成次数
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
                {/* 保留每行条码数输入框和页面宽高设置（如需）可放在高级设置下方，否则移除 */}
              </div>
              {/* 3. 条码文本输入 */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">文本输入 (每行一个)</label>
                <textarea
                  ref={textInputRef}
                  value={batchText}
                  onChange={e => setBatchText(e.target.value)}
                  placeholder="输入要生成条形码的文本，每行一个"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={processItems}
                  disabled={processing || items.length === 0 || items.some(i => i.status === 'processing' || i.status === 'completed')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 shadow-sm"
                >
                  {processing ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  <span>开始处理</span>
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={downloadResults}
                    disabled={completedCount === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>导出 ZIP</span>
                  </button>
                  <button
                    onClick={exportPDF}
                    disabled={completedCount === 0}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>导出 PDF</span>
                  </button>
                  <button
                    onClick={clearItems}
                    disabled={items.length === 0}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    清空
                  </button>
                </div>
              </div>
              {processing && processingCount > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>处理进度</span>
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
              {/* 处理列表和统计合并显示 */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-500 mb-2">处理列表</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {items.length === 0 ? (
                                    <div className="text-center py-4 text-slate-400 text-xs">
                  <Package className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                  <p>暂无处理项目</p>
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
                  <h4 className="text-sm font-medium text-slate-900 mb-3">处理统计</h4>
                    <div className="grid grid-cols-2 gap-4">
                                              <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                          <div className="text-xs text-slate-600">成功完成</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                          <div className="text-xs text-slate-600">处理失败</div>
                        </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* 结果区 */}
          <div className="space-y-6">
            {/* 只保留条码预览区 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6 min-h-[220px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">条码预览</h3>
              </div>
              {/* 条码预览每行数量设置，仅批量模式显示 */}
              <div className="mb-4 flex items-center space-x-4">
                <label className="text-sm text-gray-700 font-medium">每行条码数</label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={barcodesPerRow}
                  onChange={e => setBarcodesPerRow(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-blue-700 font-bold w-6 text-center">{barcodesPerRow}</span>
              </div>
              {completedItems.length > 0 ? (
                <div
                  className={
                    barcodesPerRow > 1
                      ? `grid gap-4 pb-2 grid-cols-${barcodesPerRow}`
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
                  <div className="text-base">暂无条码预览，请先输入内容并点击“开始处理”</div>
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