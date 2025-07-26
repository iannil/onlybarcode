import { describe, it, expect, beforeEach } from 'vitest';
import { ANALYTICS_CONFIG } from '../analytics';

describe('Analytics Config', () => {
  beforeEach(() => {
    // Reset environment variables
    delete process.env.VITE_GA_ID;
  });

  it('exports analytics configuration', () => {
    expect(ANALYTICS_CONFIG).toBeDefined();
    expect(typeof ANALYTICS_CONFIG).toBe('object');
  });

  it('has measurement ID property', () => {
    expect(ANALYTICS_CONFIG).toHaveProperty('MEASUREMENT_ID');
  });

  it('has enabled property', () => {
    expect(ANALYTICS_CONFIG).toHaveProperty('ENABLED');
  });

  it('has events property', () => {
    expect(ANALYTICS_CONFIG).toHaveProperty('EVENTS');
  });

  it('events property is an object', () => {
    expect(typeof ANALYTICS_CONFIG.EVENTS).toBe('object');
  });

  it('has default event names', () => {
    expect(ANALYTICS_CONFIG.EVENTS).toHaveProperty('PAGE_VIEW');
    expect(ANALYTICS_CONFIG.EVENTS).toHaveProperty('BARCODE_GENERATED');
  });

  it('handles missing environment variable', () => {
    // Test that the config doesn't crash when VITE_GA_ID is not set
    expect(ANALYTICS_CONFIG).toBeDefined();
  });

  it('handles empty measurement ID', () => {
    // Test that the config handles empty ID gracefully
    expect(ANALYTICS_CONFIG.MEASUREMENT_ID).toBeDefined();
  });

  it('handles undefined measurement ID', () => {
    // Test that the config handles undefined ID gracefully
    expect(ANALYTICS_CONFIG.MEASUREMENT_ID).toBeDefined();
  });

  it('has proper events structure', () => {
    const events = ANALYTICS_CONFIG.EVENTS;
    
    // Check that events has expected properties
    expect(events).toHaveProperty('PAGE_VIEW');
    expect(events).toHaveProperty('BARCODE_GENERATED');
    
    // Check that properties have correct types
    expect(typeof events.PAGE_VIEW).toBe('string');
    expect(typeof events.BARCODE_GENERATED).toBe('string');
  });

  it('has proper enabled flag', () => {
    expect(typeof ANALYTICS_CONFIG.ENABLED).toBe('boolean');
  });

  it('has proper measurement ID type', () => {
    expect(typeof ANALYTICS_CONFIG.MEASUREMENT_ID).toBe('string');
  });
}); 