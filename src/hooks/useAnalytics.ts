import { useCallback } from 'react';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const useAnalytics = () => {
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
        });
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, []);

  const trackPageView = useCallback((url: string) => {
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'G-T4S5FKSFWD', {
          page_title: document.title,
          page_location: url,
        });
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, []);

  const trackCustomEvent = useCallback((eventName: string, parameters?: Record<string, unknown>) => {
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, parameters);
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackCustomEvent,
  };
}; 