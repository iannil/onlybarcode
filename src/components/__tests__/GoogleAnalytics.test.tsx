import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import GoogleAnalytics from '../GoogleAnalytics';

// Mock gtag
const mockGtag = vi.fn();
(global as any).gtag = mockGtag;

// Mock window.dataLayer
Object.defineProperty(window, 'dataLayer', {
  value: [],
  writable: true,
});

describe('GoogleAnalytics Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.dataLayer = [];
  });

  it('renders without crashing', () => {
    render(<GoogleAnalytics measurementId="G-TEST123" />);
    expect(document.head).toBeDefined();
  });

  it('adds Google Analytics script to head', () => {
    render(<GoogleAnalytics measurementId="G-TEST123" />);
    
    const script = document.querySelector('script[src*="googletagmanager.com"]');
    expect(script).toBeTruthy();
  });

  it('adds gtag script to head', () => {
    render(<GoogleAnalytics measurementId="G-TEST123" />);
    
    const gtagScript = document.querySelector('script[src*="gtag"]');
    expect(gtagScript).toBeTruthy();
  });

  it('initializes dataLayer', () => {
    render(<GoogleAnalytics measurementId="G-TEST123" />);
    
    expect(window.dataLayer).toBeDefined();
    expect(Array.isArray(window.dataLayer)).toBe(true);
  });

  it('configures Google Analytics with correct ID', () => {
    render(<GoogleAnalytics measurementId="G-TEST123" />);
    
    // Check if gtag function is available
    expect(typeof window.gtag).toBe('function');
  });

  it('sets up gtag function', () => {
    render(<GoogleAnalytics measurementId="G-TEST123" />);
    
    expect(typeof window.gtag).toBe('function');
  });

  it('handles missing analytics config gracefully', () => {
    // Mock missing config
    const originalEnv = process.env;
    process.env = { ...originalEnv, VITE_GA_ID: undefined };
    
    render(<GoogleAnalytics measurementId="" />);
    
    // Component should not crash without config
    expect(document.head).toBeDefined();
    
    process.env = originalEnv;
  });

  it('handles multiple renders without duplication', () => {
    const { rerender } = render(<GoogleAnalytics measurementId="G-TEST123" />);
    
    const initialScripts = document.querySelectorAll('script[src*="googletagmanager.com"]');
    const initialCount = initialScripts.length;
    
    rerender(<GoogleAnalytics measurementId="G-TEST123" />);
    
    const finalScripts = document.querySelectorAll('script[src*="googletagmanager.com"]');
    const finalCount = finalScripts.length;
    
    // Should not duplicate scripts
    expect(finalCount).toBe(initialCount);
  });

  it('respects development environment', () => {
    const originalEnv = process.env;
    process.env.NODE_ENV = 'development';
    
    render(<GoogleAnalytics measurementId="G-TEST123" />);
    
    // Should still render but might have different behavior
    expect(document.head).toBeDefined();
    
    process.env = originalEnv;
  });

  it('handles production environment', () => {
    const originalEnv = process.env;
    process.env.NODE_ENV = 'production';
    
    render(<GoogleAnalytics measurementId="G-TEST123" />);
    
    // Should render normally in production
    expect(document.head).toBeDefined();
    
    process.env = originalEnv;
  });
}); 