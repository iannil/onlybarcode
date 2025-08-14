import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import BarcodeFormatGuide from '../BarcodeFormatGuide';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
    i18n: {
      language: 'zh'
    }
  })
}));

// Mock SEOHead component
vi.mock('../SEOHead', () => ({
  default: () => <div data-testid="seo-head">SEO Head</div>
}));

// Mock seo config
vi.mock('../../config/seo', () => ({
  seoConfig: {
    pages: {
      'format-guide': {
        zh: {
          title: '条码格式指南',
          description: '了解各种条码格式的特点、用途和限制',
          keywords: '条码格式,条码类型,条码指南'
        }
      }
    }
  },
  getAlternateLanguages: () => []
}));

describe('BarcodeFormatGuide Component', () => {
  beforeEach(() => {
    render(<BarcodeFormatGuide />);
  });

  it('renders the format guide title', () => {
    expect(screen.getByText('条码格式指南')).toBeInTheDocument();
  });

  it('renders search input', () => {
    expect(screen.getByPlaceholderText('搜索格式...')).toBeInTheDocument();
  });

  it('renders category filter', () => {
    expect(screen.getByDisplayValue('所有格式')).toBeInTheDocument();
  });

  it('displays format cards', () => {
    expect(screen.getByText('Code 128')).toBeInTheDocument();
    expect(screen.getByText('EAN-13')).toBeInTheDocument();
    expect(screen.getByText('Code 39')).toBeInTheDocument();
  });

  it('filters formats by search term', () => {
    const searchInput = screen.getByPlaceholderText('搜索格式...');
    fireEvent.change(searchInput, { target: { value: 'EAN' } });
    
    expect(screen.getByText('EAN-13')).toBeInTheDocument();
    expect(screen.getByText('EAN-8')).toBeInTheDocument();
    expect(screen.queryByText('Code 128')).not.toBeInTheDocument();
  });

  it('filters formats by category', () => {
    const categorySelect = screen.getByDisplayValue('所有格式');
    fireEvent.change(categorySelect, { target: { value: 'retail' } });
    
    expect(screen.getByText('EAN-13')).toBeInTheDocument();
    expect(screen.getByText('UPC-A')).toBeInTheDocument();
    expect(screen.queryByText('Code 128')).not.toBeInTheDocument();
  });

  it('displays format information correctly', () => {
    expect(screen.getByText('format_info_code128')).toBeInTheDocument();
    expect(screen.getAllByText('ABC123')[0]).toBeInTheDocument();
  });

  it('shows no results message when no formats match', () => {
    const searchInput = screen.getByPlaceholderText('搜索格式...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    expect(screen.getByText('未找到匹配的格式')).toBeInTheDocument();
  });
});
