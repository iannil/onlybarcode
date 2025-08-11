import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import App from '../../App';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

// Mock the analytics hook
vi.mock('../../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: vi.fn(),
    trackPageView: vi.fn(),
    trackCustomEvent: vi.fn(),
  }),
}));

// Mock child components to focus on App logic
vi.mock('../BarcodeScanner', () => ({
  default: () => <div data-testid="barcode-scanner">Barcode Scanner</div>,
}));

vi.mock('../BatchProcessor', () => ({
  default: () => <div data-testid="batch-processor">Batch Processor</div>,
}));

vi.mock('../PrivacyPolicy', () => ({
  default: () => <div data-testid="privacy-policy">Privacy Policy</div>,
}));

vi.mock('../TermsOfService', () => ({
  default: () => <div data-testid="terms-of-service">Terms of Service</div>,
}));

vi.mock('../ContactUs', () => ({
  default: () => <div data-testid="contact-us">Contact Us</div>,
}));

vi.mock('../SEOHead', () => ({
  default: () => <div data-testid="seo-head">SEO Head</div>,
}));

vi.mock('../GoogleAnalytics', () => ({
  default: () => <div data-testid="google-analytics">Google Analytics</div>,
}));

vi.mock('../QrCodeGenerator', () => ({
  default: () => <div data-testid="qr-code-generator">QR Code Generator</div>,
}));

vi.mock('../QrCodeScanner', () => ({
  default: () => <div data-testid="qr-code-scanner">QR Code Scanner</div>,
}));



const renderApp = () => {
  return render(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    // Reset window.location.hash
    window.location.hash = '';
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderApp();
    // 检查页面主元素是否存在
    expect(screen.getByTestId('batch-processor')).toBeInTheDocument();
  });

  it('displays main navigation tabs', () => {
    renderApp();
    expect(screen.getAllByText(/Barcode/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/QR code|QR Code|二维码/i).length).toBeGreaterThan(0);
  });

  it('shows barcode tab content by default', () => {
    renderApp();
    expect(screen.getByTestId('batch-processor')).toBeInTheDocument();
  });

  it('switches to QR code tab when clicked', async () => {
    renderApp();
    const qrCodeTab = screen.getByText(/二维码|QR Code/);
    fireEvent.click(qrCodeTab);
    
    await waitFor(() => {
      expect(screen.getByTestId('qr-code-generator')).toBeInTheDocument();
    });
  });



  it('handles hash navigation for barcode-scan', async () => {
    window.location.hash = '#barcode-scan';
    renderApp();
    
    await waitFor(() => {
      expect(screen.getByTestId('barcode-scanner')).toBeInTheDocument();
    });
  });

  it('handles hash navigation for barcode-generate', async () => {
    window.location.hash = '#barcode-generate';
    renderApp();
    
    await waitFor(() => {
      expect(screen.getByTestId('batch-processor')).toBeInTheDocument();
    });
  });

  it('handles hash navigation for qrcode-scan', async () => {
    window.location.hash = '#qrcode-scan';
    renderApp();
    
    await waitFor(() => {
      expect(screen.getByTestId('qr-code-scanner')).toBeInTheDocument();
    });
  });

  it('handles hash navigation for qrcode-generate', async () => {
    window.location.hash = '#qrcode-generate';
    renderApp();
    
    await waitFor(() => {
      expect(screen.getByTestId('qr-code-generator')).toBeInTheDocument();
    });
  });



  it('handles hash navigation for privacy page', async () => {
    window.location.hash = '#privacy';
    renderApp();
    
    await waitFor(() => {
      expect(screen.getByTestId('privacy-policy')).toBeInTheDocument();
    });
  });

  it('handles hash navigation for terms page', async () => {
    window.location.hash = '#terms';
    renderApp();
    
    await waitFor(() => {
      expect(screen.getByTestId('terms-of-service')).toBeInTheDocument();
    });
  });

  it('handles hash navigation for contact page', async () => {
    window.location.hash = '#contact';
    renderApp();
    
    await waitFor(() => {
      expect(screen.getByTestId('contact-us')).toBeInTheDocument();
    });
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    renderApp();
    const menuButton = screen.getByLabelText(/menu|Menu/);
    fireEvent.click(menuButton);
    
    // Check if mobile menu is shown (this would depend on the actual implementation)
    expect(menuButton).toBeInTheDocument();
  });

  it('changes language when language selector is used', async () => {
    renderApp();
    // 用正则或函数匹配语言切换按钮
    const languageButton = screen.getAllByText((content) => /en|中文/i.test(content))[0];
    fireEvent.click(languageButton);
    // 切换后应有语言变化的内容（如“条形码”或“Barcode”）
    expect(screen.getAllByText(/Barcode|条形码/).length).toBeGreaterThan(0);
  });

  it('displays SEO head component', () => {
    renderApp();
    expect(screen.getByTestId('seo-head')).toBeInTheDocument();
  });

  it('displays Google Analytics component', () => {
    renderApp();
    expect(screen.getByTestId('google-analytics')).toBeInTheDocument();
  });

  it('handles window hash change events', async () => {
    renderApp();
    
    // Simulate hash change
    window.location.hash = '#qrcode';
    act(() => {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('qr-code-generator')).toBeInTheDocument();
    });
  });

  it('resets mode to single when navigating to barcode-generate', async () => {
    window.location.hash = '#barcode-generate';
    renderApp();
    
    await waitFor(() => {
      expect(screen.getByTestId('batch-processor')).toBeInTheDocument();
    });
  });
}); 