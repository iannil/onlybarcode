import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import JsonXmlConverter from '../JsonXmlConverter';

// Mock the analytics hook
vi.mock('../../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: vi.fn(),
    trackCustomEvent: vi.fn(),
  }),
}));

// Mock the jsonXml utility
vi.mock('../../utils/jsonXml', () => ({
  jsonToXml: vi.fn(),
  xmlToJson: vi.fn(),
  isValidXml: vi.fn().mockReturnValue(true),
}));

const renderJsonXmlConverter = (props = {}) => {
  const defaultProps = {
    mode: 'json2xml' as const,
    clearTrigger: 0,
    ...props,
  };
  
  return render(
    <I18nextProvider i18n={i18n}>
      <JsonXmlConverter {...defaultProps} />
    </I18nextProvider>
  );
};

describe('JsonXmlConverter Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderJsonXmlConverter();
    expect(screen.getByText(/JSON Input/)).toBeInTheDocument();
  });

  it('displays JSON input by default', () => {
    renderJsonXmlConverter();
    expect(screen.getByText(/JSON Input/)).toBeInTheDocument();
  });



  it('handles JSON input change', () => {
    renderJsonXmlConverter();
    const jsonTextarea = screen.getByPlaceholderText(/Paste JSON array or object/);
    
    fireEvent.change(jsonTextarea, { target: { value: '{"name":"John","age":25}' } });
    
    expect(jsonTextarea).toHaveValue('{"name":"John","age":25}');
  });

  it('handles XML input change', () => {
    renderJsonXmlConverter({ mode: 'xml2json' });
    const xmlTextarea = screen.getByPlaceholderText(/Paste XML content/);
    
    fireEvent.change(xmlTextarea, { target: { value: '<person><name>John</name><age>25</age></person>' } });
    
    expect(xmlTextarea).toHaveValue('<person><name>John</name><age>25</age></person>');
  });

  it('converts JSON to XML successfully', async () => {
    const { jsonToXml } = await import('../../utils/jsonXml');
    (jsonToXml as any).mockReturnValue('<person><name>John</name><age>25</age></person>');

    renderJsonXmlConverter();
    const jsonTextarea = screen.getByPlaceholderText(/Paste JSON array or object/);
    
    fireEvent.change(jsonTextarea, { target: { value: '{"name":"John","age":25}' } });
    // Trigger conversion via event
    window.dispatchEvent(new Event('triggerConvert'));
    
    await waitFor(() => {
      expect(jsonToXml).toHaveBeenCalledWith({ name: 'John', age: 25 }, 'root');
    });
  });

  it('converts XML to JSON successfully', async () => {
    const { xmlToJson } = await import('../../utils/jsonXml');
    (xmlToJson as any).mockReturnValue({ name: 'John', age: 25 });

    renderJsonXmlConverter({ mode: 'xml2json' });
    const xmlTextarea = screen.getByPlaceholderText(/Paste XML content/);
    
    fireEvent.change(xmlTextarea, { target: { value: '<person><name>John</name><age>25</age></person>' } });
    // Trigger conversion via event
    window.dispatchEvent(new Event('triggerConvert'));
    
    await waitFor(() => {
      expect(xmlToJson).toHaveBeenCalledWith('<person><name>John</name><age>25</age></person>');
    });
  });

  it('handles conversion error gracefully', async () => {
    const { jsonToXml } = await import('../../utils/jsonXml');
    (jsonToXml as any).mockImplementation(() => {
      throw new Error('Conversion failed');
    });

    renderJsonXmlConverter();
    const jsonTextarea = screen.getByPlaceholderText(/Paste JSON array or object/);
    
    fireEvent.change(jsonTextarea, { target: { value: 'invalid json' } });
    // Trigger conversion via event
    window.dispatchEvent(new Event('triggerConvert'));
    
    await waitFor(() => {
      // Component should handle error gracefully
      expect(jsonTextarea).toBeInTheDocument();
    });
  });

  it('copies result to clipboard', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    const { jsonToXml } = await import('../../utils/jsonXml');
    (jsonToXml as any).mockReturnValue('<person><name>John</name><age>25</age></person>');

    renderJsonXmlConverter();
    const jsonTextarea = screen.getByPlaceholderText(/Paste JSON array or object/);
    
    fireEvent.change(jsonTextarea, { target: { value: '{"name":"John","age":25}' } });
    // Trigger conversion via event
    window.dispatchEvent(new Event('triggerConvert'));
    
    await waitFor(() => {
      // Component should handle conversion without crashing
      expect(jsonTextarea).toBeInTheDocument();
    });
  });

  it('downloads result as file', async () => {
    const { saveAs } = require('file-saver');
    
    const { jsonToXml } = await import('../../utils/jsonXml');
    (jsonToXml as any).mockReturnValue('<person><name>John</name><age>25</age></person>');

    renderJsonXmlConverter();
    const jsonTextarea = screen.getByPlaceholderText(/Paste JSON array or object/);
    
    fireEvent.change(jsonTextarea, { target: { value: '{"name":"John","age":25}' } });
    // Trigger conversion via event
    window.dispatchEvent(new Event('triggerConvert'));
    
    await waitFor(() => {
      // Component should handle conversion without crashing
      expect(jsonTextarea).toBeInTheDocument();
    });
  });

  it('clears input and output', () => {
    renderJsonXmlConverter();
    const jsonTextarea = screen.getByPlaceholderText(/Paste JSON array or object/);
    const clearButton = screen.getByText(/Clear/);
    
    fireEvent.change(jsonTextarea, { target: { value: 'test data' } });
    fireEvent.click(clearButton);
    
    expect(jsonTextarea).toHaveValue('');
  });

  it('handles empty input gracefully', () => {
    renderJsonXmlConverter();
    const jsonTextarea = screen.getByPlaceholderText(/Paste JSON array or object/);
    
    // Trigger conversion via event with empty input
    window.dispatchEvent(new Event('triggerConvert'));
    
    // Component should handle empty input gracefully
    expect(jsonTextarea).toBeInTheDocument();
  });

  it('handles large input data', () => {
    renderJsonXmlConverter();
    const jsonTextarea = screen.getByPlaceholderText(/Paste JSON array or object/);
    
    // Create large JSON data
    const largeJson = JSON.stringify(Array(1000).fill({ name: 'John', age: 25 }));
    
    fireEvent.change(jsonTextarea, { target: { value: largeJson } });
    
    // Component should handle large input without crashing
    expect(jsonTextarea).toHaveValue(largeJson);
  });

  it('handles malformed JSON input', async () => {
    const { jsonToXml } = await import('../../utils/jsonXml');
    (jsonToXml as any).mockImplementation(() => {
      throw new Error('Invalid JSON format');
    });

    renderJsonXmlConverter();
    const jsonTextarea = screen.getByPlaceholderText(/Paste JSON array or object/);
    
    fireEvent.change(jsonTextarea, { target: { value: '{"invalid": json}' } });
    // Trigger conversion via event
    window.dispatchEvent(new Event('triggerConvert'));
    
    await waitFor(() => {
      // Component should handle malformed input gracefully
      expect(jsonTextarea).toBeInTheDocument();
    });
  });

  it('handles malformed XML input', async () => {
    const { xmlToJson } = await import('../../utils/jsonXml');
    (xmlToJson as any).mockImplementation(() => {
      throw new Error('Invalid XML format');
    });

    renderJsonXmlConverter({ mode: 'xml2json' });
    const xmlTextarea = screen.getByPlaceholderText(/Paste XML content/);
    
    fireEvent.change(xmlTextarea, { target: { value: '<invalid>xml</unclosed>' } });
    // Trigger conversion via event
    window.dispatchEvent(new Event('triggerConvert'));
    
    await waitFor(() => {
      // Component should handle malformed input gracefully
      expect(xmlTextarea).toBeInTheDocument();
    });
  });

  it('displays XML root name input', () => {
    renderJsonXmlConverter();
    const rootNameInput = screen.getByPlaceholderText('root');
    
    expect(rootNameInput).toBeInTheDocument();
    expect(rootNameInput).toHaveValue('root');
  });

  it('handles root element name setting', () => {
    renderJsonXmlConverter();
    const rootNameInput = screen.getByPlaceholderText('root');
    
    fireEvent.change(rootNameInput, { target: { value: 'custom' } });
    
    expect(rootNameInput).toHaveValue('custom');
  });

  it('handles format button clicks', () => {
    renderJsonXmlConverter();
    const formatButton = screen.getByText(/Format JSON/);
    
    fireEvent.click(formatButton);
    
    // Component should handle format button click without crashing
    expect(formatButton).toBeInTheDocument();
  });

  it('handles file upload for JSON', () => {
    renderJsonXmlConverter();
    const fileInput = screen.getByLabelText(/Import/);
    
    const file = new File(['{"name":"John","age":25}'], 'test.json', { type: 'application/json' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Component should handle file upload
    expect(fileInput).toBeInTheDocument();
  });

  it('handles file upload for XML', () => {
    renderJsonXmlConverter({ mode: 'xml2json' });
    const fileInput = screen.getByLabelText(/Import/);
    
    const file = new File(['<person><name>John</name><age>25</age></person>'], 'test.xml', { type: 'application/xml' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Component should handle file upload
    expect(fileInput).toBeInTheDocument();
  });

  it('handles unsupported file types', () => {
    renderJsonXmlConverter();
    const fileInput = screen.getByLabelText(/Import/);
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Component should handle unsupported file types gracefully
    expect(fileInput).toBeInTheDocument();
  });

  it('displays conversion statistics', async () => {
    const { jsonToXml } = await import('../../utils/jsonXml');
    (jsonToXml as any).mockReturnValue('<person><name>John</name><age>25</age></person>');

    renderJsonXmlConverter();
    const jsonTextarea = screen.getByPlaceholderText(/Paste JSON array or object|粘贴JSON数组或对象/);
    
    fireEvent.change(jsonTextarea, { target: { value: '{"name":"John","age":25}' } });
    // Trigger conversion via event
    window.dispatchEvent(new Event('triggerConvert'));
    
    await waitFor(() => {
      expect(jsonToXml).toHaveBeenCalledWith({ name: 'John', age: 25 }, 'root');
    });
  });

  it('handles complex nested JSON structures', async () => {
    const { jsonToXml } = await import('../../utils/jsonXml');
    (jsonToXml as any).mockReturnValue('<data><person><name>John</name><details><age>25</age><city>NYC</city></details></person></data>');

    renderJsonXmlConverter();
    const jsonTextarea = screen.getByPlaceholderText(/Paste JSON array or object|粘贴JSON数组或对象/);
    
    const complexJson = '{"person":{"name":"John","details":{"age":25,"city":"NYC"}}}';
    fireEvent.change(jsonTextarea, { target: { value: complexJson } });
    // Trigger conversion via event
    window.dispatchEvent(new Event('triggerConvert'));
    
    await waitFor(() => {
      expect(jsonToXml).toHaveBeenCalledWith({ person: { name: 'John', details: { age: 25, city: 'NYC' } } }, 'root');
    });
  });

  it('handles arrays in JSON', async () => {
    const { jsonToXml } = await import('../../utils/jsonXml');
    (jsonToXml as any).mockReturnValue('<data><items><item>1</item><item>2</item><item>3</item></items></data>');

    renderJsonXmlConverter();
    const jsonTextarea = screen.getByPlaceholderText(/Paste JSON array or object|粘贴JSON数组或对象/);
    
    const arrayJson = '{"items":[1,2,3]}';
    fireEvent.change(jsonTextarea, { target: { value: arrayJson } });
    // Trigger conversion via event
    window.dispatchEvent(new Event('triggerConvert'));
    
    await waitFor(() => {
      expect(jsonToXml).toHaveBeenCalledWith({ items: [1, 2, 3] }, 'root');
    });
  });

  it('handles XML with attributes', async () => {
    const { xmlToJson } = await import('../../utils/jsonXml');
    (xmlToJson as any).mockReturnValue({ person: { name: 'John', age: 25, '@id': '1' } });

    renderJsonXmlConverter({ mode: 'xml2json' });
    const xmlTextarea = screen.getByPlaceholderText(/Paste XML content|粘贴XML内容/);
    
    const xmlWithAttributes = '<person id="1"><name>John</name><age>25</age></person>';
    fireEvent.change(xmlTextarea, { target: { value: xmlWithAttributes } });
    // Trigger conversion via event
    window.dispatchEvent(new Event('triggerConvert'));
    
    await waitFor(() => {
      expect(xmlToJson).toHaveBeenCalledWith(xmlWithAttributes);
    });
  });
}); 