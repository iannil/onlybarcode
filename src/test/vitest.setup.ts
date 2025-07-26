import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-url')
global.URL.revokeObjectURL = vi.fn()

// Mock FileReader
// @ts-expect-error - Mocking FileReader for testing
global.FileReader = vi.fn().mockImplementation(() => ({
  readAsText: vi.fn(),
  readAsDataURL: vi.fn(),
  onload: null,
  onerror: null,
  result: null,
}))

// Mock DOMParser for XML parsing
global.DOMParser = vi.fn().mockImplementation(() => ({
  parseFromString: vi.fn().mockImplementation((xmlString: string) => {
    // Simple mock implementation for testing
    if (xmlString.includes('parsererror') || xmlString === '') {
      return {
        getElementsByTagName: vi.fn().mockReturnValue([{ tagName: 'parsererror' }]),
        documentElement: {
          nodeName: 'root',
          attributes: [],
          childNodes: [],
          nodeType: 1
        }
      }
    }
    
    return {
      getElementsByTagName: vi.fn().mockReturnValue([]),
      documentElement: {
        nodeName: 'root',
        attributes: [],
        childNodes: [],
        nodeType: 1
      }
    }
  })
}))

// Mock Node types
global.Node = {
  TEXT_NODE: 3,
  ELEMENT_NODE: 1
} as typeof Node 