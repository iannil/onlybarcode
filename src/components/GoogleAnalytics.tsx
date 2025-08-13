import React, { useEffect } from 'react';
import { isAnalyticsEnabled, validateAnalyticsSetup } from '../config/analytics';

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
    // Validate setup first
    const validation = validateAnalyticsSetup();
    if (!validation.isValid) {
      console.group('❌ Google Analytics Setup Issues:');
      validation.issues.forEach(issue => console.error('-', issue));
      console.groupEnd();
      console.group('💡 Recommendations:');
      validation.recommendations.forEach(rec => console.log('-', rec));
      console.groupEnd();
      return;
    }

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
          debug_mode: import.meta.env.DEV,
          // Enhanced configuration for better tracking
          site_speed_sample_rate: 100,
          always_send_referrer: true,
          allow_google_signals: true,
          allow_ad_personalization_signals: true,
        });

        console.log('Google Analytics initialized successfully');
        
        // Send initial page view
        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_referrer: document.referrer,
          custom_map: {
            'custom_parameter_1': 'site_section',
            'custom_parameter_2': 'user_type',
          },
          site_section: 'main',
          user_type: 'visitor',
        });
        
        console.log('Initial page view sent to Google Analytics');
        
        // Enhanced debugging for production
        if (import.meta.env.PROD) {
          // Monitor for successful data transmission
          setTimeout(() => {
            if (window.dataLayer && window.dataLayer.length > 0) {
              console.log('✅ Google Analytics dataLayer contains events:', window.dataLayer.length);
              
              // Check for network requests to Google Analytics
              if ('performance' in window) {
                const observer = new PerformanceObserver((list) => {
                  list.getEntries().forEach((entry) => {
                    if (entry.name.includes('google-analytics.com') || entry.name.includes('googletagmanager.com')) {
                      console.log('🌐 Google Analytics network request:', entry.name);
                    }
                  });
                });
                observer.observe({ entryTypes: ['resource'] });
              }
              
              // Test network connectivity
              fetch('https://www.google-analytics.com/collect', {
                method: 'HEAD',
                mode: 'no-cors'
              }).then(() => {
                console.log('✅ Google Analytics endpoint accessible');
              }).catch(() => {
                console.warn('⚠️ Google Analytics endpoint may be blocked');
              });
              
            } else {
              console.warn('⚠️ Google Analytics dataLayer appears empty - check for blocking issues');
            }
          }, 2000);
        }
        
      } catch (error) {
        console.error('Failed to initialize Google Analytics:', error);
      }
    };
    
    script1.onerror = (error) => {
      console.error('Failed to load Google Analytics script:', error);
      console.error('This may be due to:');
      console.error('1. Network connectivity issues');
      console.error('2. Ad blockers or privacy extensions');
      console.error('3. Firewall blocking Google Analytics domains');
      console.error('4. Invalid Measurement ID');
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