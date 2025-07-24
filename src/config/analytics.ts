// Google Analytics Configuration
export const ANALYTICS_CONFIG = {
  // Replace with your actual Google Analytics Measurement ID
  // Format: G-XXXXXXXXXX
  MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-T4S5FKSFWD',
  
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
  return ANALYTICS_CONFIG.ENABLED && !!ANALYTICS_CONFIG.MEASUREMENT_ID && ANALYTICS_CONFIG.MEASUREMENT_ID !== 'G-T4S5FKSFWD';
}; 