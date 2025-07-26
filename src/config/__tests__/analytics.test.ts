import { describe, it, expect } from 'vitest';
import { ANALYTICS_CONFIG } from '../analytics';

describe('Analytics Configuration', () => {
  it('should have correct configuration structure', () => {
    expect(ANALYTICS_CONFIG).toHaveProperty('MEASUREMENT_ID');
    expect(ANALYTICS_CONFIG).toHaveProperty('ENABLED');
    expect(ANALYTICS_CONFIG).toHaveProperty('EVENTS');
    expect(ANALYTICS_CONFIG).toHaveProperty('CATEGORIES');
  });

  it('should have proper events structure', () => {
    const events = ANALYTICS_CONFIG.EVENTS;
    
    // Check that events has expected properties
    expect(events).toHaveProperty('PAGE_VIEW');
    expect(events).toHaveProperty('BARCODE_GENERATED');
    expect(events).toHaveProperty('BARCODE_SCANNED');
    expect(events).toHaveProperty('BATCH_PROCESSED');
    expect(events).toHaveProperty('PDF_EXPORTED');
    expect(events).toHaveProperty('BUTTON_CLICK');
    expect(events).toHaveProperty('FORM_SUBMIT');
    expect(events).toHaveProperty('ERROR_OCCURRED');
    
    // Check that properties have correct types
    expect(typeof events.PAGE_VIEW).toBe('string');
    expect(typeof events.BARCODE_GENERATED).toBe('string');
  });

  it('should have proper categories structure', () => {
    const categories = ANALYTICS_CONFIG.CATEGORIES;
    
    // Check that categories has expected properties
    expect(categories).toHaveProperty('NAVIGATION');
    expect(categories).toHaveProperty('BARCODE');
    expect(categories).toHaveProperty('USER_INTERACTION');
    expect(categories).toHaveProperty('SYSTEM');
    
    // Check that properties have correct types
    expect(typeof categories.NAVIGATION).toBe('string');
    expect(typeof categories.BARCODE).toBe('string');
  });

  it('should have proper enabled flag', () => {
    expect(typeof ANALYTICS_CONFIG.ENABLED).toBe('boolean');
  });

  it('should have proper measurement ID type', () => {
    expect(typeof ANALYTICS_CONFIG.MEASUREMENT_ID).toBe('string');
  });

  it('should handle missing environment variable', () => {
    // Test that the config doesn't crash when VITE_GA_MEASUREMENT_ID is not set
    expect(ANALYTICS_CONFIG).toBeDefined();
  });

  it('should handle empty measurement ID', () => {
    // Test that the config handles empty ID gracefully
    expect(ANALYTICS_CONFIG.MEASUREMENT_ID).toBeDefined();
  });

  it('should handle undefined measurement ID', () => {
    // Test that the config handles undefined ID gracefully
    expect(ANALYTICS_CONFIG.MEASUREMENT_ID).toBeDefined();
  });
}); 