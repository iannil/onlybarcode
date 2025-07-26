import '@testing-library/jest-dom'
import { vi, beforeEach, afterEach } from 'vitest'

// Suppress console output during tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleInfo = console.info;

beforeEach(() => {
  console.log = vi.fn();
  console.error = vi.fn();
  console.warn = vi.fn();
  console.info = vi.fn();
});

afterEach(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.info = originalConsoleInfo;
});

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

// Mock navigation API to prevent JSDOM errors
Object.defineProperty(window, 'navigation', {
  value: {
    navigate: vi.fn(),
    goBack: vi.fn(),
    goForward: vi.fn(),
    reload: vi.fn(),
    canGoBack: false,
    canGoForward: false,
    currentEntry: {
      index: 0,
      key: 'test-key',
      id: 'test-id',
      url: 'http://localhost:3000',
      getState: vi.fn(),
    },
    entries: vi.fn(),
    onnavigate: null,
    onnavigatesuccess: null,
    onnavigateerror: null,
    oncurrententrychange: null,
  },
  writable: true,
})

// Mock window.location methods that might cause navigation issues
const originalLocation = window.location;
delete (window as any).location;
window.location = {
  ...originalLocation,
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
  toString: () => 'http://localhost:3000',
} as any;

// Mock HTMLAnchorElement navigation to prevent JSDOM errors
HTMLAnchorElement.prototype.click = vi.fn();
HTMLAnchorElement.prototype.setAttribute = vi.fn();
HTMLAnchorElement.prototype.getAttribute = vi.fn();

// Mock fetch to prevent navigation errors
global.fetch = vi.fn();

// Mock XMLHttpRequest to prevent navigation errors
global.XMLHttpRequest = vi.fn().mockImplementation(() => ({
  open: vi.fn(),
  send: vi.fn(),
  setRequestHeader: vi.fn(),
  readyState: 4,
  status: 200,
  responseText: '',
  onreadystatechange: null,
})) as any; 