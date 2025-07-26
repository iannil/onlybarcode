import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'
import DataConverter from '../DataConverter'

// Mock the child components
vi.mock('../CsvJsonConverter', () => ({
  default: ({ mode, clearTrigger }: { mode: string; clearTrigger: number }) => (
    <div data-testid="csv-json-converter" data-mode={mode} data-clear-trigger={clearTrigger}>
      CSV-JSON Converter
    </div>
  )
}))

vi.mock('../JsonXmlConverter', () => ({
  default: ({ mode, clearTrigger }: { mode: string; clearTrigger: number }) => (
    <div data-testid="json-xml-converter" data-mode={mode} data-clear-trigger={clearTrigger}>
      JSON-XML Converter
    </div>
  )
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  FileText: () => <span data-testid="file-text-icon">FileText</span>,
  Code: () => <span data-testid="code-icon">Code</span>,
  Braces: () => <span data-testid="braces-icon">Braces</span>,
  Shuffle: () => <span data-testid="shuffle-icon">Shuffle</span>
}))

const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  )
}

describe('DataConverter', () => {
  beforeEach(() => {
    // Mock window.dispatchEvent
    vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true)
  })

  it('应该渲染所有转换模式按钮', () => {
    renderWithI18n(<DataConverter />)
    
    expect(screen.getByText(/CSV → JSON/)).toBeInTheDocument()
    expect(screen.getByText(/JSON → CSV/)).toBeInTheDocument()
    expect(screen.getByText(/JSON → XML/)).toBeInTheDocument()
    expect(screen.getByText(/XML → JSON/)).toBeInTheDocument()
  })

  it('应该默认显示CSV到JSON转换器', () => {
    renderWithI18n(<DataConverter />)
    
    const converter = screen.getByTestId('csv-json-converter')
    expect(converter).toBeInTheDocument()
    expect(converter).toHaveAttribute('data-mode', 'csv2json')
  })

  it('应该切换到JSON到CSV模式', () => {
    renderWithI18n(<DataConverter />)
    
    const jsonToCsvButton = screen.getByText(/JSON → CSV/)
    fireEvent.click(jsonToCsvButton)
    
    const converter = screen.getByTestId('csv-json-converter')
    expect(converter).toHaveAttribute('data-mode', 'json2csv')
  })

  it('应该切换到JSON到XML模式', () => {
    renderWithI18n(<DataConverter />)
    
    const jsonToXmlButton = screen.getByText(/JSON → XML/)
    fireEvent.click(jsonToXmlButton)
    
    const converter = screen.getByTestId('json-xml-converter')
    expect(converter).toBeInTheDocument()
    expect(converter).toHaveAttribute('data-mode', 'json2xml')
  })

  it('应该切换到XML到JSON模式', () => {
    renderWithI18n(<DataConverter />)
    
    const xmlToJsonButton = screen.getByText(/XML → JSON/)
    fireEvent.click(xmlToJsonButton)
    
    const converter = screen.getByTestId('json-xml-converter')
    expect(converter).toBeInTheDocument()
    expect(converter).toHaveAttribute('data-mode', 'xml2json')
  })

  it('应该显示转换按钮', () => {
    renderWithI18n(<DataConverter />)
    
    const convertButton = screen.getByRole('button', { name: /convert/i })
    expect(convertButton).toBeInTheDocument()
  })

  it('应该触发转换事件当点击转换按钮', () => {
    renderWithI18n(<DataConverter />)
    
    const convertButton = screen.getByRole('button', { name: /convert/i })
    fireEvent.click(convertButton)
    
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'triggerConvert'
      })
    )
  })

  it('应该高亮当前激活的模式按钮', () => {
    renderWithI18n(<DataConverter />)
    
    const csvToJsonButton = screen.getByText(/CSV → JSON/)
    expect(csvToJsonButton).toHaveClass('bg-blue-50', 'border-blue-500', 'text-blue-700')
    
    const jsonToCsvButton = screen.getByText(/JSON → CSV/)
    expect(jsonToCsvButton).toHaveClass('bg-white', 'border-slate-200', 'text-slate-700')
  })

  it('应该在模式切换时更新clearTrigger', () => {
    renderWithI18n(<DataConverter />)
    
    const initialConverter = screen.getByTestId('csv-json-converter')
    const initialTrigger = initialConverter.getAttribute('data-clear-trigger')
    
    const jsonToCsvButton = screen.getByText(/JSON → CSV/)
    fireEvent.click(jsonToCsvButton)
    
    const updatedConverter = screen.getByTestId('csv-json-converter')
    const updatedTrigger = updatedConverter.getAttribute('data-clear-trigger')
    
    expect(Number(updatedTrigger)).toBe(Number(initialTrigger) + 1)
  })
}) 