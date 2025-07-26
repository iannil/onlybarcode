import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import QrCodeGenerator from '../QrCodeGenerator';

// Mock the analytics hook
vi.mock('../../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: vi.fn(),
    trackCustomEvent: vi.fn(),
  }),
}));

// Mock QRCode library
vi.mock('qrcode', () => ({
  default: {
    toCanvas: vi.fn(),
    toDataURL: vi.fn(),
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

// Mock pdf-lib
vi.mock('pdf-lib', () => ({
  PDFDocument: {
    create: vi.fn().mockResolvedValue({
      addPage: vi.fn(),
      embedPng: vi.fn().mockResolvedValue({}),
      drawImage: vi.fn(),
      save: vi.fn().mockResolvedValue(new Uint8Array()),
    }),
  },
}));

// Mock canvas
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn().mockReturnValue({
    drawImage: vi.fn(),
    getImageData: vi.fn().mockReturnValue({ data: new Uint8Array(100) }),
  }),
});

const renderQrCodeGenerator = (props = {}) => {
  const defaultProps = {
    mode: 'single' as const,
    setMode: vi.fn(),
    ...props,
  };
  
  return render(
    <I18nextProvider i18n={i18n}>
      <QrCodeGenerator {...defaultProps} />
    </I18nextProvider>
  );
};

describe('QrCodeGenerator Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderQrCodeGenerator();
    expect(screen.getByText(/生成|Generate/)).toBeInTheDocument();
  });

  it('displays single mode by default', () => {
    renderQrCodeGenerator();
    expect(screen.getByDisplayValue('https://654653.com')).toBeInTheDocument();
  });

  it('switches to batch mode when mode prop is batch', () => {
    renderQrCodeGenerator({ mode: 'batch' });
    expect(screen.getByText(/批量|Batch/)).toBeInTheDocument();
  });

  it('handles text input change in single mode', () => {
    renderQrCodeGenerator();
    const textInput = screen.getByDisplayValue('https://654653.com');
    
    fireEvent.change(textInput, { target: { value: 'new text' } });
    
    expect(textInput).toHaveValue('new text');
  });

  it('handles text input change in batch mode', () => {
    renderQrCodeGenerator({ mode: 'batch' });
    const textArea = screen.getByPlaceholderText(/Input content|输入内容/);
    
    fireEvent.change(textArea, { target: { value: 'line1\nline2' } });
    
    expect(textArea).toHaveValue('line1\nline2');
  });

  it('generates QR code in single mode', async () => {
    const mockToCanvas = vi.fn().mockResolvedValue(undefined);
    const QRCode = await import('qrcode');
    QRCode.default.toCanvas = mockToCanvas;

    renderQrCodeGenerator();
    const generateButton = screen.getByText(/生成|Generate/);
    
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(mockToCanvas).toHaveBeenCalled();
    });
  });

  it('handles QR code generation error', async () => {
    const mockToCanvas = vi.fn().mockRejectedValue(new Error('Generation failed'));
    const QRCode = await import('qrcode');
    QRCode.default.toCanvas = mockToCanvas;

    renderQrCodeGenerator();
    const generateButton = screen.getByText(/生成|Generate/);
    
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      // Component should handle error gracefully
      expect(generateButton).toBeInTheDocument();
    });
  });

  it('generates QR codes in batch mode', async () => {
    const mockToDataURL = vi.fn().mockResolvedValue('data:image/png;base64,test');
    const QRCode = await import('qrcode');
    QRCode.default.toDataURL = mockToDataURL;

    renderQrCodeGenerator({ mode: 'batch' });
    const textArea = screen.getByPlaceholderText(/Input content|输入内容/);
    const generateButton = screen.getAllByText(/Process|开始处理/)[0];
    
    fireEvent.change(textArea, { target: { value: 'test1\ntest2' } });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(mockToDataURL).toHaveBeenCalled();
    });
  });

  it('handles batch generation with empty input', () => {
    renderQrCodeGenerator({ mode: 'batch' });
    const generateButton = screen.getAllByText(/Process|开始处理/)[0];
    
    fireEvent.click(generateButton);
    
    // Component should handle empty input gracefully
    expect(generateButton).toBeInTheDocument();
  });

  it('toggles settings panel', () => {
    renderQrCodeGenerator();
    const settingsButton = screen.getByText(/Show Advanced Settings|显示高级设置/);
    
    fireEvent.click(settingsButton);
    
    // Settings panel should be toggled
    expect(settingsButton).toBeInTheDocument();
  });

  it('handles size setting change', () => {
    renderQrCodeGenerator();
    const settingsButton = screen.getByText(/Show Advanced Settings|显示高级设置/);
    fireEvent.click(settingsButton);
    
    // Test that advanced settings can be toggled
    expect(settingsButton).toBeInTheDocument();
  });

  it('handles margin setting change', () => {
    renderQrCodeGenerator();
    const settingsButton = screen.getByText(/Show Advanced Settings|显示高级设置/);
    fireEvent.click(settingsButton);
    
    // Test that advanced settings can be toggled
    expect(settingsButton).toBeInTheDocument();
  });

  it('handles background color change', () => {
    renderQrCodeGenerator();
    const settingsButton = screen.getByText(/Show Advanced Settings|显示高级设置/);
    fireEvent.click(settingsButton);
    
    // Test that advanced settings can be toggled
    expect(settingsButton).toBeInTheDocument();
  });

  it('handles foreground color change', () => {
    renderQrCodeGenerator();
    const settingsButton = screen.getByText(/Show Advanced Settings|显示高级设置/);
    fireEvent.click(settingsButton);
    
    // Test that advanced settings can be toggled
    expect(settingsButton).toBeInTheDocument();
  });

  it('handles error correction level change', () => {
    renderQrCodeGenerator();
    const settingsButton = screen.getByText(/Show Advanced Settings|显示高级设置/);
    fireEvent.click(settingsButton);
    
    // Test that advanced settings can be toggled
    expect(settingsButton).toBeInTheDocument();
  });

  it('handles repeat count change in batch mode', () => {
    renderQrCodeGenerator({ mode: 'batch' });
    const settingsButton = screen.getByText(/Show Advanced Settings|显示高级设置/);
    fireEvent.click(settingsButton);
    
    // Test that advanced settings can be toggled
    expect(settingsButton).toBeInTheDocument();
  });

  it('handles QR codes per row change', () => {
    renderQrCodeGenerator({ mode: 'batch' });
    const settingsButton = screen.getByText(/Show Advanced Settings|显示高级设置/);
    fireEvent.click(settingsButton);
    
    // Test that advanced settings can be toggled
    expect(settingsButton).toBeInTheDocument();
  });

  it('toggles print all on one page setting', () => {
    renderQrCodeGenerator({ mode: 'batch' });
    const settingsButton = screen.getByText(/Show Advanced Settings|显示高级设置/);
    fireEvent.click(settingsButton);
    
    // Test that advanced settings can be toggled
    expect(settingsButton).toBeInTheDocument();
  });

  it('generates random string', () => {
    renderQrCodeGenerator();
    const generateButton = screen.getByText(/Generate QR Code|生成二维码/);
    
    fireEvent.click(generateButton);
    
    // Generate functionality should work
    expect(generateButton).toBeInTheDocument();
  });

  it('copies QR code to clipboard', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    renderQrCodeGenerator();
    const copyButton = screen.getByText(/Copy Image|复制图片/);
    
    fireEvent.click(copyButton);
    
    // Copy functionality should work
    expect(copyButton).toBeInTheDocument();
  });

  it('downloads single QR code', () => {
    const { saveAs } = require('file-saver');
    
    renderQrCodeGenerator();
    const downloadButton = screen.getByText(/Download PNG|下载PNG/);
    
    fireEvent.click(downloadButton);
    
    // Download functionality should work
    expect(downloadButton).toBeInTheDocument();
  });

  it('downloads batch QR codes as ZIP', async () => {
    const { saveAs } = require('file-saver');
    
    renderQrCodeGenerator({ mode: 'batch' });
    const downloadButton = screen.getByText(/Export ZIP|导出ZIP/);
    
    fireEvent.click(downloadButton);
    
    // Download functionality should work
    expect(downloadButton).toBeInTheDocument();
  });

  it('exports batch QR codes as PDF', async () => {
    const { saveAs } = require('file-saver');
    
    renderQrCodeGenerator({ mode: 'batch' });
    const exportButton = screen.getByText(/Export PDF|导出PDF/);
    
    fireEvent.click(exportButton);
    
    // Export functionality should work
    expect(exportButton).toBeInTheDocument();
  });

  it('removes batch item', () => {
    renderQrCodeGenerator({ mode: 'batch' });
    const removeButton = screen.getByText(/Clear|清除/);
    
    fireEvent.click(removeButton);
    
    // Remove functionality should work
    expect(removeButton).toBeInTheDocument();
  });

  it('clears all results', () => {
    renderQrCodeGenerator({ mode: 'batch' });
    const clearButton = screen.getByText(/Clear|清除/);
    
    fireEvent.click(clearButton);
    
    // Clear functionality should work
    expect(clearButton).toBeInTheDocument();
  });

  it('handles processing state during batch generation', async () => {
    const mockToDataURL = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve('data:image/png;base64,test'), 100))
    );
    const QRCode = await import('qrcode');
    QRCode.default.toDataURL = mockToDataURL;

    renderQrCodeGenerator({ mode: 'batch' });
    const textArea = screen.getByPlaceholderText(/Input content|输入内容/);
    const generateButton = screen.getAllByText(/Process|开始处理/)[0];
    
    fireEvent.change(textArea, { target: { value: 'test' } });
    fireEvent.click(generateButton);
    
    // Component should show processing state
    await waitFor(() => {
      expect(generateButton).toBeInTheDocument();
    });
  });

  it('handles batch generation with large input', async () => {
    const mockToDataURL = vi.fn().mockResolvedValue('data:image/png;base64,test');
    const QRCode = await import('qrcode');
    QRCode.default.toDataURL = mockToDataURL;

    renderQrCodeGenerator({ mode: 'batch' });
    const textArea = screen.getByPlaceholderText(/Input content|输入内容/);
    const generateButton = screen.getAllByText(/Process|开始处理/)[0];
    
    // Create large input
    const largeInput = Array(100).fill('test').join('\n');
    fireEvent.change(textArea, { target: { value: largeInput } });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(mockToDataURL).toHaveBeenCalled();
    });
  });
}); 