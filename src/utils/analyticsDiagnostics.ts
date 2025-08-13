import { ANALYTICS_CONFIG, isAnalyticsEnabled } from '../config/analytics';

export interface AnalyticsDiagnostics {
  isEnabled: boolean;
  measurementId: string;
  environment: string;
  hostname: string;
  isProduction: boolean;
  isLocalhost: boolean;
  hasValidMeasurementId: boolean;
  gtagLoaded: boolean;
  dataLayerExists: boolean;
  scriptLoaded: boolean;
  issues: string[];
  recommendations: string[];
}

export const runAnalyticsDiagnostics = (): AnalyticsDiagnostics => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  const environment = import.meta.env.MODE;
  const isProduction = import.meta.env.PROD;
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || 
                     hostname.startsWith('192.168.') || hostname.startsWith('10.') || 
                     hostname.startsWith('172.');
  const hasValidMeasurementId = !!(ANALYTICS_CONFIG.MEASUREMENT_ID && 
                                  ANALYTICS_CONFIG.MEASUREMENT_ID !== 'G-XXXXXXXXXX');
  const isEnabled = isAnalyticsEnabled();
  
  // Check if gtag is available
  const gtagLoaded = typeof window !== 'undefined' && typeof window.gtag === 'function';
  
  // Check if dataLayer exists
  const dataLayerExists = typeof window !== 'undefined' && Array.isArray(window.dataLayer);
  
  // Check if Google Analytics script is loaded
  const scriptLoaded = typeof window !== 'undefined' && 
                      document.querySelector('script[src*="googletagmanager.com/gtag/js"]') !== null;

  // Check for issues
  if (!isProduction) {
    issues.push('Not running in production environment');
    recommendations.push('Deploy to production environment for analytics to work');
  }

  if (isLocalhost) {
    issues.push('Running on localhost or local network');
    recommendations.push('Test on a public domain for analytics to work');
  }

  if (!hasValidMeasurementId) {
    issues.push('Invalid or placeholder Measurement ID');
    recommendations.push('Replace G-XXXXXXXXXX with your actual Google Analytics Measurement ID');
  }

  if (!ANALYTICS_CONFIG.MEASUREMENT_ID) {
    issues.push('No Measurement ID configured');
    recommendations.push('Set VITE_GA_MEASUREMENT_ID environment variable');
  }

  if (ANALYTICS_CONFIG.MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    issues.push('Using placeholder Measurement ID - please replace with real ID');
    recommendations.push('Update the Measurement ID in src/config/analytics.ts');
  }

  if (!gtagLoaded) {
    issues.push('Google Analytics gtag function not loaded');
    recommendations.push('Check if Google Analytics script is loading properly');
  }

  if (!dataLayerExists) {
    issues.push('Google Analytics dataLayer not initialized');
    recommendations.push('Ensure Google Analytics is properly initialized');
  }

  if (!scriptLoaded) {
    issues.push('Google Analytics script not found in DOM');
    recommendations.push('Check if Google Analytics script is being injected');
  }

  // Check for ad blockers or privacy tools
  if (typeof window !== 'undefined') {
    const hasAdBlocker = !!(window as { adsbygoogle?: boolean }).adsbygoogle === false;
    if (hasAdBlocker) {
      issues.push('Potential ad blocker detected');
      recommendations.push('Disable ad blockers or add analytics.google.com to whitelist');
    }
  }

  // Check for privacy settings
  if (typeof window !== 'undefined' && 'navigator' in window) {
    const hasPrivacySettings = (navigator as { doNotTrack?: string | null }).doNotTrack === '1';
    if (hasPrivacySettings) {
      issues.push('Do Not Track setting enabled');
      recommendations.push('User has enabled Do Not Track - analytics may be blocked');
    }
  }

  return {
    isEnabled,
    measurementId: ANALYTICS_CONFIG.MEASUREMENT_ID,
    environment,
    hostname,
    isProduction,
    isLocalhost,
    hasValidMeasurementId,
    gtagLoaded,
    dataLayerExists,
    scriptLoaded,
    issues,
    recommendations,
  };
};

export const logAnalyticsDiagnostics = (): void => {
  const diagnostics = runAnalyticsDiagnostics();
  
  console.group('🔍 Google Analytics Diagnostics');
  console.log('Enabled:', diagnostics.isEnabled);
  console.log('Environment:', diagnostics.environment);
  console.log('Production:', diagnostics.isProduction);
  console.log('Hostname:', diagnostics.hostname);
  console.log('Localhost:', diagnostics.isLocalhost);
  console.log('Measurement ID:', diagnostics.measurementId);
  console.log('Valid Measurement ID:', diagnostics.hasValidMeasurementId);
  console.log('gtag Loaded:', diagnostics.gtagLoaded);
  console.log('DataLayer Exists:', diagnostics.dataLayerExists);
  console.log('Script Loaded:', diagnostics.scriptLoaded);
  
  if (diagnostics.issues.length > 0) {
    console.group('❌ Issues Found:');
    diagnostics.issues.forEach(issue => console.log('-', issue));
    console.groupEnd();
    
    console.group('💡 Recommendations:');
    diagnostics.recommendations.forEach(rec => console.log('-', rec));
    console.groupEnd();
  } else {
    console.log('✅ No issues found');
  }
  
  // Additional debugging information
  if (typeof window !== 'undefined') {
    console.group('🔧 Debug Info:');
    console.log('window.gtag:', typeof window.gtag);
    console.log('window.dataLayer:', window.dataLayer);
    console.log('Google Analytics Scripts:', document.querySelectorAll('script[src*="googletagmanager.com"]').length);
    console.log('User Agent:', navigator.userAgent);
    console.log('Do Not Track:', (navigator as { doNotTrack?: string | null }).doNotTrack);
    console.groupEnd();
  }
  
  console.groupEnd();
};

// Function to test Google Analytics tracking
export const testAnalyticsTracking = (): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('🧪 Testing Google Analytics tracking...');
    
    // Test page view
    window.gtag('config', ANALYTICS_CONFIG.MEASUREMENT_ID, {
      page_title: 'Analytics Test',
      page_location: window.location.href,
    });
    
    // Test custom event
    window.gtag('event', 'analytics_test', {
      event_category: 'diagnostics',
      event_label: 'manual_test',
      value: 1,
    });
    
    console.log('✅ Test events sent to Google Analytics');
    console.log('📊 Check Google Analytics Real-Time reports to verify data collection');
  } else {
    console.error('❌ Cannot test tracking - gtag not available');
  }
};
