// Google Analytics Configuration
export const ANALYTICS_CONFIG = {
  // Replace with your actual Google Analytics Measurement ID
  // Format: G-XXXXXXXXXX
  MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-891EFN0THT',
  
  // Enable/disable analytics (useful for development)
  ENABLED: import.meta.env.PROD,
  
  // Custom event names
  EVENTS: {
    // Page interactions
    PAGE_VIEW: 'page_view',
    TAB_SWITCH: 'tab_switch',
    LANGUAGE_CHANGE: 'language_change',
    
    // Barcode operations
    BARCODE_GENERATED: 'barcode_generated',
    BARCODE_SCANNED: 'barcode_scanned',
    BATCH_PROCESSED: 'batch_processed',
    PDF_EXPORTED: 'pdf_exported',
    
    // User interactions
    BUTTON_CLICK: 'button_click',
    FORM_SUBMIT: 'form_submit',
    ERROR_OCCURRED: 'error_occurred',
  },
  
  // Event categories
  CATEGORIES: {
    NAVIGATION: 'navigation',
    BARCODE: 'barcode',
    USER_INTERACTION: 'user_interaction',
    SYSTEM: 'system',
  },
} as const;

// Helper function to check if analytics is enabled
export const isAnalyticsEnabled = (): boolean => {
  // Allow analytics in test environment for testing purposes
  if (import.meta.env.MODE === 'test') {
    console.log('Analytics enabled for test environment');
    return true;
  }
  
  // Check if we're in production
  if (!import.meta.env.PROD) {
    console.log('Analytics disabled: not in production environment');
    return false;
  }
  
  // Check if we're on localhost or local development
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
      console.log(`Analytics disabled: running on local network (${hostname})`);
      return false;
    }
  }
  
  // Check if measurement ID is valid
  if (!ANALYTICS_CONFIG.MEASUREMENT_ID || ANALYTICS_CONFIG.MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    console.log('Analytics disabled: invalid or placeholder Measurement ID');
    return false;
  }
  
  // Validate Measurement ID format
  const measurementIdPattern = /^G-[A-Z0-9]{10}$/;
  if (!measurementIdPattern.test(ANALYTICS_CONFIG.MEASUREMENT_ID)) {
    console.error('Analytics disabled: invalid Measurement ID format. Expected format: G-XXXXXXXXXX');
    return false;
  }
  
  console.log('Analytics enabled for production environment');
  return true;
};

// Enhanced validation function
export const validateAnalyticsSetup = (): {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
} => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Check Measurement ID
  if (!ANALYTICS_CONFIG.MEASUREMENT_ID) {
    issues.push('No Measurement ID configured');
    recommendations.push('Set VITE_GA_MEASUREMENT_ID environment variable');
  } else if (ANALYTICS_CONFIG.MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    issues.push('Using placeholder Measurement ID');
    recommendations.push('Replace G-XXXXXXXXXX with your actual Google Analytics 4 Measurement ID');
  } else if (!/^G-[A-Z0-9]{10}$/.test(ANALYTICS_CONFIG.MEASUREMENT_ID)) {
    issues.push('Invalid Measurement ID format');
    recommendations.push('Measurement ID should be in format G-XXXXXXXXXX');
  }
  
  // Check environment
  if (!import.meta.env.PROD) {
    issues.push('Not in production environment');
    recommendations.push('Analytics only works in production builds');
  }
  
  // Check hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      issues.push('Running on localhost');
      recommendations.push('Deploy to production domain for analytics to work');
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    recommendations,
  };
}; 