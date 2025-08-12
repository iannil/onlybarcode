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

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    
    script1.onload = () => {
      console.log('Google Analytics script loaded successfully');
    };
    
    script1.onerror = () => {
      console.error('Failed to load Google Analytics script');
    };
    
    document.head.appendChild(script1);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(...args: unknown[]) {
      window.dataLayer.push(args);
    };

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    console.log('Google Analytics initialized successfully');

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