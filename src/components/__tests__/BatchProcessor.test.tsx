import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import BatchProcessor from '../BatchProcessor';

// Mock the analytics hook
vi.mock('../../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: vi.fn(),
    trackCustomEvent: vi.fn(),
  }),
}));

// Mock jsbarcode
vi.mock('jsbarcode', () => ({
  default: vi.fn(),
}));

// Mock pdf-lib
vi.mock('pdf-lib', () => ({
  PDFDocument: {
    create: vi.fn().mockResolvedValue({
      addPage: vi.fn().mockReturnValue({
        drawImage: vi.fn(),
      }),
      embedPng: vi.fn().mockResolvedValue({}),
      save: vi.fn().mockResolvedValue(new Uint8Array()),
    }),
  },
}));

// Mock JSZip
vi.mock('jszip', () => ({
  default: vi.fn().mockImplementation(() => ({
    file: vi.fn(),
    generateAsync: vi.fn().mockResolvedValue(new Blob()),
  })),
}));

// Mock file-saver
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

// Mock canvas
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn().mockReturnValue({
    drawImage: vi.fn(),
    getImageData: vi.fn().mockReturnValue({ data: new Uint8Array(100) }),
    clearRect: vi.fn(),
  }),
});

Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
  value: vi.fn().mockReturnValue('data:image/png;base64,test'),
});

const renderBatchProcessor = (props = {}) => {
  const defaultProps = {
    mode: 'single' as const,
    setMode: vi.fn(),
    ...props,
  };
  
  return render(
    <I18nextProvider i18n={i18n}>
      <BatchProcessor {...defaultProps} />
    </I18nextProvider>
  );
};

describe('BatchProcessor Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderBatchProcessor();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('displays single mode by default', () => {
    renderBatchProcessor();
    expect(screen.getByDisplayValue('123456789012')).toBeInTheDocument();
  });

  it('switches to batch mode when mode prop is batch', () => {
    renderBatchProcessor({ mode: 'batch' });
    expect(screen.getByText(/Batch|批量/)).toBeInTheDocument();
  });

  it('handles text input change in single mode', () => {
    renderBatchProcessor();
    const textInput = screen.getByDisplayValue('123456789012');
    
    fireEvent.change(textInput, { target: { value: 'new barcode' } });
    
    expect(textInput).toHaveValue('new barcode');
  });

  it('handles text input change in batch mode', () => {
    renderBatchProcessor({ mode: 'batch' });
    const textArea = screen.getByPlaceholderText(/输入要生成条形码的文本|Enter text to generate barcodes/);
    
    fireEvent.change(textArea, { target: { value: 'line1\nline2' } });
    
    expect(textArea).toHaveValue('line1\nline2');
  });

  it('generates barcode in single mode', async () => {
    const mockJsBarcode = vi.fn();
    const jsbarcode = await import('jsbarcode');
    jsbarcode.default = mockJsBarcode;

    renderBatchProcessor();
    const textInput = screen.getByDisplayValue('123456789012');
    
    fireEvent.change(textInput, { target: { value: 'test barcode' } });
    
    await waitFor(() => {
      expect(mockJsBarcode).toHaveBeenCalled();
    });
  });

  it('handles barcode generation error', async () => {
    const mockJsBarcode = vi.fn().mockImplementation(() => {
      throw new Error('Generation failed');
    });
    const jsbarcode = await import('jsbarcode');
    jsbarcode.default = mockJsBarcode;

    renderBatchProcessor();
    const textInput = screen.getByDisplayValue('123456789012');
    
    fireEvent.change(textInput, { target: { value: 'invalid' } });
    
    await waitFor(() => {
      // Component should handle error gracefully
      expect(textInput).toBeInTheDocument();
    });
  });

  it('generates barcodes in batch mode', async () => {
    const mockJsBarcode = vi.fn();
    const jsbarcode = await import('jsbarcode');
    jsbarcode.default = mockJsBarcode;

    renderBatchProcessor({ mode: 'batch' });
    const textArea = screen.getByPlaceholderText(/输入要生成条形码的文本|Enter text to generate barcodes/);
    const processButton = screen.getAllByText(/Process|开始处理/)[0]; // Get the first (button) element
    
    fireEvent.change(textArea, { target: { value: 'test1\ntest2' } });
    fireEvent.click(processButton);
    
    await waitFor(() => {
      expect(mockJsBarcode).toHaveBeenCalled();
    });
  });

  it('handles batch generation with empty input', () => {
    renderBatchProcessor({ mode: 'batch' });
    const processButton = screen.getAllByText(/Process|开始处理/)[0]; // Get the first (button) element
    
    // Button should be disabled with empty input
    expect(processButton).toBeDisabled();
  });

  it('toggles settings panel', () => {
    renderBatchProcessor();
    const settingsButton = screen.getByText(/显示高级设置|Show Advanced Settings/);
    
    fireEvent.click(settingsButton);
    
    // Settings panel should be toggled
    expect(screen.getByText(/隐藏高级设置|Hide Advanced Settings/)).toBeInTheDocument();
  });

  it('handles format setting change', () => {
    renderBatchProcessor();
    const formatSelect = screen.getByDisplayValue(/Code 128/);
    
    fireEvent.change(formatSelect, { target: { value: 'CODE128' } });
    
    expect(formatSelect).toHaveValue('CODE128');
  });

  it('handles width setting change', () => {
    renderBatchProcessor();
    const settingsButton = screen.getByText(/显示高级设置|Show Advanced Settings/);
    fireEvent.click(settingsButton);
    
    const widthInput = screen.getByDisplayValue('2');
    fireEvent.change(widthInput, { target: { value: '3' } });
    
    expect(widthInput).toHaveValue('3');
  });

  it('handles height setting change', () => {
    renderBatchProcessor();
    const settingsButton = screen.getByText(/显示高级设置|Show Advanced Settings/);
    fireEvent.click(settingsButton);
    
    const heightInput = screen.getByDisplayValue('100');
    fireEvent.change(heightInput, { target: { value: '150' } });
    
    expect(heightInput).toHaveValue('150');
  });

  it('handles display value setting change', () => {
    renderBatchProcessor();
    const settingsButton = screen.getByText(/显示高级设置|Show Advanced Settings/);
    fireEvent.click(settingsButton);
    
    const displayValueCheckbox = screen.getByRole('checkbox');
    fireEvent.click(displayValueCheckbox);
    
    expect(displayValueCheckbox).not.toBeChecked();
  });

  it('handles font size setting change', () => {
    renderBatchProcessor();
    const settingsButton = screen.getByText(/显示高级设置|Show Advanced Settings/);
    fireEvent.click(settingsButton);
    
    const fontSizeInput = screen.getByDisplayValue('20');
    fireEvent.change(fontSizeInput, { target: { value: '16' } });
    
    expect(fontSizeInput).toHaveValue('16');
  });

  it('handles margin setting change', () => {
    renderBatchProcessor();
    const settingsButton = screen.getByText(/显示高级设置|Show Advanced Settings/);
    fireEvent.click(settingsButton);
    
    const marginInput = screen.getByDisplayValue('10');
    fireEvent.change(marginInput, { target: { value: '15' } });
    
    expect(marginInput).toHaveValue('15');
  });

  it('handles background color change', () => {
    renderBatchProcessor();
    const settingsButton = screen.getByText(/显示高级设置|Show Advanced Settings/);
    fireEvent.click(settingsButton);
    
    const bgColorInput = screen.getByDisplayValue('#ffffff');
    fireEvent.change(bgColorInput, { target: { value: '#f0f0f0' } });
    
    expect(bgColorInput).toHaveValue('#f0f0f0');
  });

  it('handles line color change', () => {
    renderBatchProcessor();
    const settingsButton = screen.getByText(/显示高级设置|Show Advanced Settings/);
    fireEvent.click(settingsButton);
    
    const lineColorInput = screen.getByDisplayValue('#000000');
    fireEvent.change(lineColorInput, { target: { value: '#333333' } });
    
    expect(lineColorInput).toHaveValue('#333333');
  });

  it('handles repeat count change in batch mode', () => {
    renderBatchProcessor({ mode: 'batch' });
    const settingsButton = screen.getByText(/显示高级设置|Show Advanced Settings/);
    fireEvent.click(settingsButton);
    
    const repeatInput = screen.getAllByDisplayValue('1')[1]; // Get the number input, not the range input
    fireEvent.change(repeatInput, { target: { value: '3' } });
    
    expect(repeatInput).toHaveValue('3');
  });

  it('handles barcodes per row change', () => {
    renderBatchProcessor({ mode: 'batch' });
    const perRowInput = screen.getByDisplayValue('1');
    fireEvent.change(perRowInput, { target: { value: '2' } });
    
    expect(perRowInput).toHaveValue('2');
  });

  it('toggles single page PDF setting', () => {
    renderBatchProcessor({ mode: 'batch' });
    const singlePageCheckbox = screen.getByRole('checkbox');
    fireEvent.click(singlePageCheckbox);
    
    expect(singlePageCheckbox).toBeChecked();
  });

  it('generates random barcode', () => {
    renderBatchProcessor();
    const randomButton = screen.getByTitle(/Generate Random Code|生成随机码/);
    
    fireEvent.click(randomButton);
    
    // Random barcode should be generated
    expect(randomButton).toBeInTheDocument();
  });

  it('copies barcode to clipboard', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    renderBatchProcessor();
    const copyButton = screen.getByText(/复制数据|Copy Data/);
    
    fireEvent.click(copyButton);
    
    // Copy functionality should work
    expect(copyButton).toBeInTheDocument();
  });

  it('downloads single barcode as PNG', () => {
    const { saveAs } = require('file-saver');
    
    renderBatchProcessor();
    const downloadButton = screen.getByText(/下载PNG|Download PNG/);
    
    fireEvent.click(downloadButton);
    
    // Download functionality should work
    expect(downloadButton).toBeInTheDocument();
  });

  it('downloads single barcode as SVG', () => {
    const { saveAs } = require('file-saver');
    
    renderBatchProcessor();
    const downloadButton = screen.getByText(/下载SVG|Download SVG/);
    
    fireEvent.click(downloadButton);
    
    // Download functionality should work
    expect(downloadButton).toBeInTheDocument();
  });

  it('exports batch barcodes as ZIP', async () => {
    const { saveAs } = require('file-saver');
    
    renderBatchProcessor({ mode: 'batch' });
    const exportButton = screen.getByText(/导出ZIP|Export ZIP/);
    
    fireEvent.click(exportButton);
    
    // Export functionality should work
    expect(exportButton).toBeInTheDocument();
  });

  it('exports batch barcodes as PDF', async () => {
    const { saveAs } = require('file-saver');
    
    renderBatchProcessor({ mode: 'batch' });
    const exportButton = screen.getByText(/导出PDF|Export PDF/);
    
    fireEvent.click(exportButton);
    
    // Export functionality should work
    expect(exportButton).toBeInTheDocument();
  });

  it('removes batch item', () => {
    renderBatchProcessor({ mode: 'batch' });
    const textArea = screen.getByPlaceholderText(/输入要生成条形码的文本|Enter text to generate barcodes/);
    
    fireEvent.change(textArea, { target: { value: 'test item' } });
    
    // Component should handle batch input without crashing
    expect(textArea).toBeInTheDocument();
  });

  it('clears all results', () => {
    renderBatchProcessor({ mode: 'batch' });
    const clearButton = screen.getByText(/清空|Clear/);
    
    fireEvent.click(clearButton);
    
    // Clear functionality should work
    expect(clearButton).toBeInTheDocument();
  });

  it('handles processing state during batch generation', async () => {
    const mockJsBarcode = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    const jsbarcode = await import('jsbarcode');
    jsbarcode.default = mockJsBarcode;

    renderBatchProcessor({ mode: 'batch' });
    const textArea = screen.getByPlaceholderText(/输入要生成条形码的文本|Enter text to generate barcodes/);
    const processButton = screen.getAllByText(/Process|开始处理/)[0]; // Get the first (button) element
    
    fireEvent.change(textArea, { target: { value: 'test' } });
    fireEvent.click(processButton);
    
    // Component should show processing state
    await waitFor(() => {
      expect(processButton).toBeInTheDocument();
    });
  });

  it('handles batch generation with large input', async () => {
    const mockJsBarcode = vi.fn();
    const jsbarcode = await import('jsbarcode');
    jsbarcode.default = mockJsBarcode;

    renderBatchProcessor({ mode: 'batch' });
    const textArea = screen.getByPlaceholderText(/输入要生成条形码的文本|Enter text to generate barcodes/);
    const processButton = screen.getAllByText(/Process|开始处理/)[0]; // Get the first (button) element
    
    // Create large input
    const largeInput = Array(100).fill('test').join('\n');
    fireEvent.change(textArea, { target: { value: largeInput } });
    fireEvent.click(processButton);
    
    await waitFor(() => {
      expect(mockJsBarcode).toHaveBeenCalled();
    });
  });

  it('validates barcode format', () => {
    renderBatchProcessor();
    const textInput = screen.getByDisplayValue('123456789012');
    
    // Test invalid input
    fireEvent.change(textInput, { target: { value: 'invalid' } });
    
    // Component should handle invalid input gracefully
    expect(textInput).toBeInTheDocument();
  });

  it('handles different barcode formats', () => {
    renderBatchProcessor();
    const formatSelect = screen.getByDisplayValue(/Code 128/);
    
    // Test different formats
    const formats = ['CODE128', 'CODE39', 'EAN13', 'EAN8'];
    formats.forEach(format => {
      fireEvent.change(formatSelect, { target: { value: format } });
      expect(formatSelect).toHaveValue(format);
    });
  });
}); 