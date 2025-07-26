import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useAnalytics } from '../useAnalytics';

// Mock gtag
const mockGtag = vi.fn();

// Set up gtag on both global and window
(global as any).gtag = mockGtag;
(window as any).gtag = mockGtag;

// Ensure window.gtag is available and properly typed
Object.defineProperty(window, 'gtag', {
  value: mockGtag,
  writable: true,
  configurable: true,
});

// Also set it as a property
window.gtag = mockGtag;

// Ensure window is properly defined
if (typeof window === 'undefined') {
  (global as any).window = global;
}

// Mock window.dataLayer
Object.defineProperty(window, 'dataLayer', {
  value: [],
  writable: true,
});

describe('useAnalytics Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.dataLayer = [];
    // Ensure mockGtag is properly reset and available
    mockGtag.mockClear();
    (window as any).gtag = mockGtag;
    (global as any).gtag = mockGtag;
  });

  it('returns analytics functions', () => {
    const { result } = renderHook(() => useAnalytics());

    expect(result.current.trackEvent).toBeDefined();
    expect(result.current.trackPageView).toBeDefined();
    expect(result.current.trackCustomEvent).toBeDefined();
    expect(typeof result.current.trackEvent).toBe('function');
    expect(typeof result.current.trackPageView).toBe('function');
    expect(typeof result.current.trackCustomEvent).toBe('function');
  });



  it('tracks page view', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackPageView('/test-page');
    });

    expect(mockGtag).toHaveBeenCalledWith('config', expect.any(String), {
      page_title: document.title,
      page_location: '/test-page',
    });
  });

  it('tracks custom event', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackCustomEvent('test_event', { key: 'value' });
    });

    expect(mockGtag).toHaveBeenCalledWith('event', 'test_event', { key: 'value' });
  });

  it('tracks event with category, action, and label', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackEvent({
        action: 'click',
        category: 'button',
        label: 'submit',
      });
    });

    expect(mockGtag).toHaveBeenCalledWith('event', 'click', {
      event_category: 'button',
      event_label: 'submit',
    });
  });

  it('tracks event with value', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackEvent({
        action: 'purchase',
        category: 'ecommerce',
        value: 100,
      });
    });

    expect(mockGtag).toHaveBeenCalledWith('event', 'purchase', {
      event_category: 'ecommerce',
      value: 100,
    });
  });

  it('tracks event with value', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackEvent({
        action: 'scroll',
        category: 'engagement',
        value: 10,
      });
    });

    expect(mockGtag).toHaveBeenCalledWith('event', 'scroll', {
      event_category: 'engagement',
      value: 10,
    });
  });

  it('handles missing gtag gracefully', () => {
    // Remove gtag from global
    delete (global as any).gtag;

    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackEvent({
        action: 'test',
        category: 'test',
      });
    });

    // Should not throw error
    expect(result.current.trackEvent).toBeDefined();
    
    // Verify that gtag was not called (since it doesn't exist)
    expect(mockGtag).not.toHaveBeenCalled();
  });

  it('handles gtag errors gracefully', () => {
    const mockGtagWithError = vi.fn().mockImplementation(() => {
      throw new Error('gtag error');
    });
    (global as any).gtag = mockGtagWithError;

    // Mock console.error to suppress error output during test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackEvent({
        action: 'test',
        category: 'test',
      });
    });

    // Should not throw error
    expect(result.current.trackEvent).toBeDefined();
    
    // Verify that console.error was called with the error
    expect(consoleSpy).toHaveBeenCalledWith('Analytics error:', expect.any(Error));
    
    // Restore console.error
    consoleSpy.mockRestore();
  });

  it('tracks multiple events', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackEvent({
        action: 'first_click',
        category: 'button',
      });
      result.current.trackEvent({
        action: 'second_click',
        category: 'link',
      });
    });

    expect(mockGtag).toHaveBeenCalledTimes(2);
    expect(mockGtag).toHaveBeenNthCalledWith(1, 'event', 'first_click', {
      event_category: 'button',
    });
    expect(mockGtag).toHaveBeenNthCalledWith(2, 'event', 'second_click', {
      event_category: 'link',
    });
  });

  it('tracks page view with custom path', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackPageView('/custom-page');
    });

    expect(mockGtag).toHaveBeenCalledWith('config', 'G-T4S5FKSFWD', {
      page_title: document.title,
      page_location: '/custom-page',
    });
  });

  it('tracks custom event with complex data', () => {
    const { result } = renderHook(() => useAnalytics());

    const complexData = {
      user_id: '12345',
      session_id: 'abc123',
      timestamp: Date.now(),
      metadata: {
        source: 'web',
        version: '1.0.0',
      },
    };

    act(() => {
      result.current.trackCustomEvent('user_action', complexData);
    });

    expect(mockGtag).toHaveBeenCalledWith('event', 'user_action', complexData);
  });

  it('handles minimal event parameters', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackEvent({
        action: 'test',
        category: 'test',
      });
    });

    expect(mockGtag).toHaveBeenCalledWith('event', 'test', {
      event_category: 'test',
      event_label: undefined,
    });
  });

  it('handles null and undefined values', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackEvent({
        action: null as any,
        category: undefined as any,
        label: null as any,
      });
    });

    expect(mockGtag).toHaveBeenCalledWith('event', null, {
      event_category: undefined,
      event_label: null,
    });
  });
}); 