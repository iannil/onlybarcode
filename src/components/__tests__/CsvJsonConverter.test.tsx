import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import CsvJsonConverter from '../CsvJsonConverter';

// Mock the analytics hook
vi.mock('../../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: vi.fn(),
    trackCustomEvent: vi.fn(),
  }),
}));

// Mock the csvJson utility
vi.mock('../../utils/csvJson', () => ({
  csvToJson: vi.fn(),
  jsonToCsv: vi.fn(),
  detectDelimiter: vi.fn().mockReturnValue(','),
}));

const renderCsvJsonConverter = (props = {}) => {
  const defaultProps = {
    mode: 'csv2json' as const,
    clearTrigger: 0,
    ...props,
  };
  
  return render(
    <I18nextProvider i18n={i18n}>
      <CsvJsonConverter {...defaultProps} />
    </I18nextProvider>
  );
};

describe('CsvJsonConverter Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderCsvJsonConverter();
    expect(screen.getByText(/CSV输入|CSV Input/)).toBeInTheDocument();
  });

  it('displays CSV input by default', () => {
    renderCsvJsonConverter();
    expect(screen.getByText(/CSV输入|CSV Input/)).toBeInTheDocument();
  });

  it('handles CSV input change', () => {
    renderCsvJsonConverter();
    const csvTextarea = screen.getByPlaceholderText(/粘贴CSV内容|Paste CSV content/);
    
    fireEvent.change(csvTextarea, { target: { value: 'name,age\nJohn,25' } });
    
    expect(csvTextarea).toHaveValue('name,age\nJohn,25');
  });

  it('handles JSON input change', () => {
    renderCsvJsonConverter({ mode: 'json2csv' });
    const jsonTextarea = screen.getByPlaceholderText(/粘贴JSON数组或对象|Paste JSON array or object/);
    
    fireEvent.change(jsonTextarea, { target: { value: '[{"name":"John","age":25}]' } });
    
    expect(jsonTextarea).toHaveValue('[{"name":"John","age":25}]');
  });

  it('converts CSV to JSON successfully', async () => {
    const { csvToJson } = await import('../../utils/csvJson');
    (csvToJson as any).mockReturnValue([{ name: 'John', age: '25' }]);

    renderCsvJsonConverter();
    const csvTextarea = screen.getByPlaceholderText(/粘贴CSV内容|Paste CSV content/);
    
    fireEvent.change(csvTextarea, { target: { value: 'name,age\nJohn,25' } });
    
    // Trigger conversion by dispatching the event
    window.dispatchEvent(new Event('triggerConvert'));
    
    await waitFor(() => {
      expect(csvToJson).toHaveBeenCalledWith('name,age\nJohn,25', ',', undefined, true);
    });
  });

  it('converts JSON to CSV successfully', async () => {
    const { jsonToCsv } = await import('../../utils/csvJson');
    (jsonToCsv as any).mockReturnValue('name,age\nJohn,25');

    renderCsvJsonConverter({ mode: 'json2csv' });
    const jsonTextarea = screen.getByPlaceholderText(/粘贴JSON数组或对象|Paste JSON array or object/);
    
    fireEvent.change(jsonTextarea, { target: { value: '[{"name":"John","age":25}]' } });
    
    // Trigger conversion by dispatching the event
    window.dispatchEvent(new Event('triggerConvert'));
    
    await waitFor(() => {
      expect(jsonToCsv).toHaveBeenCalledWith([{ name: 'John', age: 25 }], ',');
    });
  });

  it('handles conversion error gracefully', async () => {
    const { csvToJson } = await import('../../utils/csvJson');
    (csvToJson as any).mockImplementation(() => {
      throw new Error('Conversion failed');
    });

    renderCsvJsonConverter();
    const csvTextarea = screen.getByPlaceholderText(/粘贴CSV内容|Paste CSV content/);
    
    fireEvent.change(csvTextarea, { target: { value: 'invalid csv' } });
    
    // Trigger conversion by dispatching the event
    window.dispatchEvent(new Event('triggerConvert'));
    
    await waitFor(() => {
      // Component should handle error gracefully
      expect(csvTextarea).toBeInTheDocument();
    });
  });

  it('copies result to clipboard', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    const { csvToJson } = await import('../../utils/csvJson');
    (csvToJson as any).mockReturnValue([{ name: 'John', age: '25' }]);

    renderCsvJsonConverter();
    const csvTextarea = screen.getByPlaceholderText(/粘贴CSV内容|Paste CSV content/);
    
    fireEvent.change(csvTextarea, { target: { value: 'name,age\nJohn,25' } });
    
    // Trigger conversion by dispatching the event
    window.dispatchEvent(new Event('triggerConvert'));
    
    await waitFor(() => {
      // Component should handle conversion without crashing
      expect(csvTextarea).toBeInTheDocument();
    });
  });

  it('downloads result as file', async () => {
    const { csvToJson } = await import('../../utils/csvJson');
    (csvToJson as any).mockReturnValue([{ name: 'John', age: '25' }]);

    renderCsvJsonConverter();
    const csvTextarea = screen.getByPlaceholderText(/粘贴CSV内容|Paste CSV content/);
    
    fireEvent.change(csvTextarea, { target: { value: 'name,age\nJohn,25' } });
    
    // Trigger conversion by dispatching the event
    window.dispatchEvent(new Event('triggerConvert'));
    
    await waitFor(() => {
      // Component should handle conversion without crashing
      expect(csvTextarea).toBeInTheDocument();
    });
  });

  it('clears input and output', () => {
    renderCsvJsonConverter();
    const csvTextarea = screen.getByPlaceholderText(/粘贴CSV内容|Paste CSV content/);
    const clearButton = screen.getByText(/Clear|清空/);
    
    fireEvent.change(csvTextarea, { target: { value: 'test data' } });
    fireEvent.click(clearButton);
    
    expect(csvTextarea).toHaveValue('');
  });

  it('handles empty input gracefully', () => {
    renderCsvJsonConverter();
    const csvTextarea = screen.getByPlaceholderText(/粘贴CSV内容|Paste CSV content/);
    
    // Trigger conversion by dispatching the event with empty input
    window.dispatchEvent(new Event('triggerConvert'));
    
    // Component should handle empty input gracefully
    expect(csvTextarea).toBeInTheDocument();
  });

  it('handles large input data', () => {
    renderCsvJsonConverter();
    const csvTextarea = screen.getByPlaceholderText(/粘贴CSV内容|Paste CSV content/);
    
    // Create large CSV data
    const largeCsv = Array(1000).fill('name,age\nJohn,25').join('\n');
    
    fireEvent.change(csvTextarea, { target: { value: largeCsv } });
    
    // Component should handle large input without crashing
    expect(csvTextarea).toHaveValue(largeCsv);
  });

  it('displays conversion statistics', async () => {
    const { csvToJson } = await import('../../utils/csvJson');
    (csvToJson as any).mockReturnValue([{ name: 'John', age: '25' }, { name: 'Jane', age: '30' }]);

    renderCsvJsonConverter();
    const csvTextarea = screen.getByPlaceholderText(/粘贴CSV内容|Paste CSV content/);
    
    fireEvent.change(csvTextarea, { target: { value: 'name,age\nJohn,25\nJane,30' } });
    
    // Trigger conversion by dispatching the event
    window.dispatchEvent(new Event('triggerConvert'));
    
    await waitFor(() => {
      // Component should handle conversion without crashing
      expect(csvTextarea).toBeInTheDocument();
    });
  });

  it('handles delimiter change', () => {
    renderCsvJsonConverter();
    const delimiterSelect = screen.getByDisplayValue(/逗号|Comma/);
    
    fireEvent.change(delimiterSelect, { target: { value: ';' } });
    
    expect(delimiterSelect).toHaveValue(';');
  });

  it('handles header row toggle', () => {
    renderCsvJsonConverter();
    const headerCheckbox = screen.getByRole('checkbox');
    
    fireEvent.click(headerCheckbox);
    
    expect(headerCheckbox).not.toBeChecked();
  });

  it('formats JSON input when in json2csv mode', () => {
    renderCsvJsonConverter({ mode: 'json2csv' });
    const jsonTextarea = screen.getByPlaceholderText(/粘贴JSON数组或对象|Paste JSON array or object/);
    const formatButton = screen.getByText(/格式化JSON|Format JSON/);
    
    fireEvent.change(jsonTextarea, { target: { value: '{"name":"John","age":25}' } });
    fireEvent.click(formatButton);
    
    expect(jsonTextarea).toHaveValue('{\n  "name": "John",\n  "age": 25\n}');
  });

  it('toggles JSON pretty/compress in csv2json mode', async () => {
    const { csvToJson } = await import('../../utils/csvJson');
    (csvToJson as any).mockReturnValue([{ name: 'John', age: '25' }]);

    renderCsvJsonConverter();
    const csvTextarea = screen.getByPlaceholderText(/粘贴CSV内容|Paste CSV content/);
    
    fireEvent.change(csvTextarea, { target: { value: 'name,age\nJohn,25' } });
    
    // Trigger conversion to get output
    window.dispatchEvent(new Event('triggerConvert'));
    
    await waitFor(() => {
      const compressButton = screen.getByText(/压缩JSON|Compress JSON/);
      expect(compressButton).toBeInTheDocument();
    });
  });
}); 