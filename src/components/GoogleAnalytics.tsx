import React, { useEffect } from 'react';
import { isAnalyticsEnabled } from '../config/analytics';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

interface GoogleAnalyticsProps {
  measurementId: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ measurementId }) => {
  useEffect(() => {
    // Only load Google Analytics if it's enabled
    if (!isAnalyticsEnabled()) {
      console.log('Google Analytics disabled for localhost/development environment');
      return;
    }

    // Validate measurement ID
    if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
      console.error('Invalid Google Analytics Measurement ID:', measurementId);
      return;
    }

    console.log('Loading Google Analytics with Measurement ID:', measurementId);

    // Check if script is already loaded
    const existingScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
    if (existingScript) {
      console.log('Google Analytics script already loaded');
      return;
    }

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    
    script1.onload = () => {
      console.log('Google Analytics script loaded successfully');
      
      // Initialize gtag after script loads
      try {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function(...args: unknown[]) {
          window.dataLayer.push(args);
        };

        window.gtag('js', new Date());
        window.gtag('config', measurementId, {
          page_title: document.title,
          page_location: window.location.href,
          send_page_view: true,
          anonymize_ip: true,
          cookie_flags: 'SameSite=None;Secure',
        });

        console.log('Google Analytics initialized successfully');
        
        // Send initial page view
        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_referrer: document.referrer,
        });
        
        console.log('Initial page view sent to Google Analytics');
        
      } catch (error) {
        console.error('Failed to initialize Google Analytics:', error);
      }
    };
    
    script1.onerror = (error) => {
      console.error('Failed to load Google Analytics script:', error);
    };
    
    document.head.appendChild(script1);

    // Cleanup function
    return () => {
      if (script1.parentNode) {
        script1.parentNode.removeChild(script1);
      }
    };
  }, [measurementId]);

  return null;
};

export default GoogleAnalytics; 