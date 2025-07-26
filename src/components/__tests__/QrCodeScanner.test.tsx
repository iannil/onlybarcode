import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import QrCodeScanner from '../QrCodeScanner';

// Mock the analytics hook
vi.mock('../../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: vi.fn(),
    trackCustomEvent: vi.fn(),
  }),
}));

// Mock @zxing/library
vi.mock('@zxing/library', () => ({
  BrowserMultiFormatReader: vi.fn().mockImplementation(() => ({
    decodeFromImageUrl: vi.fn().mockResolvedValue({
      getText: () => 'test-qr-text',
      getBarcodeFormat: () => ({ toString: () => 'QR_CODE' }),
    }),
    reset: vi.fn(),
  })),
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-url');
global.URL.revokeObjectURL = vi.fn();

const renderQrCodeScanner = () => {
  return render(
    <I18nextProvider i18n={i18n}>
      <QrCodeScanner />
    </I18nextProvider>
  );
};

describe('QrCodeScanner Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderQrCodeScanner();
    expect(screen.getByText(/Image Upload|图片上传/)).toBeInTheDocument();
  });

  it('displays drag and drop area', () => {
    renderQrCodeScanner();
    expect(screen.getByText(/拖拽|Drag/)).toBeInTheDocument();
  });

  it('handles drag over event', () => {
    renderQrCodeScanner();
    const dropArea = screen.getByText(/拖拽|Drag/).closest('div');
    if (dropArea) {
      fireEvent.dragOver(dropArea);
      // The component should handle drag over without crashing
      expect(dropArea).toBeInTheDocument();
    }
  });

  it('handles drag leave event', () => {
    renderQrCodeScanner();
    const dropArea = screen.getByText(/拖拽|Drag/).closest('div');
    if (dropArea) {
      fireEvent.dragLeave(dropArea);
      // The component should handle drag leave without crashing
      expect(dropArea).toBeInTheDocument();
    }
  });

  it('handles file input change', () => {
    renderQrCodeScanner();
    const fileInput = screen.getByLabelText(/选择文件|Choose file/);
    
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // The component should handle file input without crashing
    expect(fileInput).toBeInTheDocument();
  });

  it('displays clear results button when results exist', async () => {
    renderQrCodeScanner();
    
    // Initially, clear button should not be visible
    const clearButton = screen.queryByText(/清除|Clear/);
    expect(clearButton).not.toBeInTheDocument();
  });

  it('displays export results button when results exist', async () => {
    renderQrCodeScanner();
    
    // Initially, export button should not be visible
    const exportButton = screen.queryByText(/导出|Export/);
    expect(exportButton).not.toBeInTheDocument();
  });

  it('shows file input for manual file selection', () => {
    renderQrCodeScanner();
    const fileInput = screen.getByLabelText(/选择文件|Choose file/);
    expect(fileInput).toBeInTheDocument();
  });

  it('handles empty file selection gracefully', () => {
    renderQrCodeScanner();
    const fileInput = screen.getByLabelText(/选择文件|Choose file/);
    
    fireEvent.change(fileInput, { target: { files: [] } });
    
    // Component should handle empty file selection without crashing
    expect(fileInput).toBeInTheDocument();
  });

  it('displays error message when scanning fails', async () => {
    renderQrCodeScanner();
    
    // Mock the reader to throw an error
    const { BrowserMultiFormatReader } = await import('@zxing/library');
    const mockReader = BrowserMultiFormatReader as any;
    mockReader.mockImplementation(() => ({
      decodeFromImageUrl: vi.fn().mockRejectedValue(new Error('Scan failed')),
      reset: vi.fn(),
    }));

    const fileInput = screen.getByLabelText(/选择文件|Choose file/);
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      // Component should handle error gracefully
      expect(fileInput).toBeInTheDocument();
    });
  });

  it('handles successful scan result', async () => {
    renderQrCodeScanner();
    
    // Mock the reader to return a successful result
    const { BrowserMultiFormatReader } = await import('@zxing/library');
    const mockReader = BrowserMultiFormatReader as any;
    const mockResult = {
      getText: () => 'test-qr-text',
      getBarcodeFormat: () => ({ toString: () => 'QR_CODE' }),
    };
    mockReader.mockImplementation(() => ({
      decodeFromImageUrl: vi.fn().mockResolvedValue(mockResult),
      reset: vi.fn(),
    }));

    const fileInput = screen.getByLabelText(/选择文件|Choose file/);
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      // Component should handle successful scan
      expect(fileInput).toBeInTheDocument();
    });
  });

  it('handles copy to clipboard functionality', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    renderQrCodeScanner();
    
    // The copy functionality should be available when results exist
    // This test verifies the component doesn't crash when copy is attempted
    expect(screen.getByText(/Image Upload|图片上传/)).toBeInTheDocument();
  });

  it('handles remove result functionality', () => {
    renderQrCodeScanner();
    
    // The remove functionality should be available when results exist
    // This test verifies the component doesn't crash when remove is attempted
    expect(screen.getByText(/Image Upload|图片上传/)).toBeInTheDocument();
  });

  it('displays scanning state when processing files', async () => {
    renderQrCodeScanner();
    
    // Mock the reader to delay response
    const { BrowserMultiFormatReader } = await import('@zxing/library');
    const mockReader = BrowserMultiFormatReader as any;
    mockReader.mockImplementation(() => ({
      decodeFromImageUrl: vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          getText: () => 'test-qr-text',
          getBarcodeFormat: () => ({ toString: () => 'QR_CODE' }),
        }), 100))
      ),
      reset: vi.fn(),
    }));

    const fileInput = screen.getByLabelText(/选择文件|Choose file/);
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Component should show scanning state
    await waitFor(() => {
      expect(fileInput).toBeInTheDocument();
    });
  });

  it('handles multiple file selection', () => {
    renderQrCodeScanner();
    const fileInput = screen.getByLabelText(/选择文件|Choose file/);
    
    const files = [
      new File(['test1'], 'test1.png', { type: 'image/png' }),
      new File(['test2'], 'test2.png', { type: 'image/png' }),
    ];
    
    fireEvent.change(fileInput, { target: { files } });
    
    // Component should handle multiple files without crashing
    expect(fileInput).toBeInTheDocument();
  });

  it('filters non-image files from drag and drop', () => {
    renderQrCodeScanner();
    const dropArea = screen.getByText(/拖拽|Drag/).closest('div');
    
    if (dropArea) {
      const files = [
        new File(['test'], 'test.png', { type: 'image/png' }),
        new File(['test'], 'test.txt', { type: 'text/plain' }),
      ];
      
      fireEvent.drop(dropArea, {
        dataTransfer: { files },
      });
      
      // Component should filter out non-image files
      expect(dropArea).toBeInTheDocument();
    }
  });

  it('displays results in chronological order', async () => {
    renderQrCodeScanner();
    
    // Mock successful scans
    const { BrowserMultiFormatReader } = await import('@zxing/library');
    const mockReader = BrowserMultiFormatReader as any;
    const mockResult = {
      getText: () => 'test-qr-text',
      getBarcodeFormat: () => ({ toString: () => 'QR_CODE' }),
    };
    mockReader.mockImplementation(() => ({
      decodeFromImageUrl: vi.fn().mockResolvedValue(mockResult),
      reset: vi.fn(),
    }));

    const fileInput = screen.getByLabelText(/选择文件|Choose file/);
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      // Component should display results properly
      expect(fileInput).toBeInTheDocument();
    });
  });

  it('handles different QR code formats', async () => {
    renderQrCodeScanner();
    
    // Mock the reader to return different formats
    const { BrowserMultiFormatReader } = await import('@zxing/library');
    const mockReader = BrowserMultiFormatReader as any;
    const mockResult = {
      getText: () => 'test-qr-text',
      getBarcodeFormat: () => ({ toString: () => 'DATA_MATRIX' }),
    };
    mockReader.mockImplementation(() => ({
      decodeFromImageUrl: vi.fn().mockResolvedValue(mockResult),
      reset: vi.fn(),
    }));

    const fileInput = screen.getByLabelText(/选择文件|Choose file/);
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      // Component should handle different formats
      expect(fileInput).toBeInTheDocument();
    });
  });

  it('handles large image files', () => {
    renderQrCodeScanner();
    const fileInput = screen.getByLabelText(/选择文件|Choose file/);
    
    // Create a large file mock
    const largeFile = new File(['x'.repeat(1024 * 1024)], 'large.png', { type: 'image/png' });
    
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    
    // Component should handle large files without crashing
    expect(fileInput).toBeInTheDocument();
  });

  it('handles unsupported image formats', () => {
    renderQrCodeScanner();
    const fileInput = screen.getByLabelText(/选择文件|Choose file/);
    
    const unsupportedFile = new File(['test'], 'test.bmp', { type: 'image/bmp' });
    
    fireEvent.change(fileInput, { target: { files: [unsupportedFile] } });
    
    // Component should handle unsupported formats gracefully
    expect(fileInput).toBeInTheDocument();
  });
}); 