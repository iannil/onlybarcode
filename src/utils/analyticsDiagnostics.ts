import { ANALYTICS_CONFIG, isAnalyticsEnabled } from '../config/analytics';

export interface AnalyticsDiagnostics {
  isEnabled: boolean;
  measurementId: string;
  environment: string;
  hostname: string;
  isProduction: boolean;
  isLocalhost: boolean;
  hasValidMeasurementId: boolean;
  issues: string[];
}

export const runAnalyticsDiagnostics = (): AnalyticsDiagnostics => {
  const issues: string[] = [];
  const environment = import.meta.env.MODE;
  const isProduction = import.meta.env.PROD;
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || 
                     hostname.startsWith('192.168.') || hostname.startsWith('10.') || 
                     hostname.startsWith('172.');
  const hasValidMeasurementId = !!(ANALYTICS_CONFIG.MEASUREMENT_ID && 
                                  ANALYTICS_CONFIG.MEASUREMENT_ID !== 'G-XXXXXXXXXX');
  const isEnabled = isAnalyticsEnabled();

  // Check for issues
  if (!isProduction) {
    issues.push('Not running in production environment');
  }

  if (isLocalhost) {
    issues.push('Running on localhost or local network');
  }

  if (!hasValidMeasurementId) {
    issues.push('Invalid or placeholder Measurement ID');
  }

  if (!ANALYTICS_CONFIG.MEASUREMENT_ID) {
    issues.push('No Measurement ID configured');
  }

  if (ANALYTICS_CONFIG.MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    issues.push('Using placeholder Measurement ID - please replace with real ID');
  }

  return {
    isEnabled,
    measurementId: ANALYTICS_CONFIG.MEASUREMENT_ID,
    environment,
    hostname,
    isProduction,
    isLocalhost,
    hasValidMeasurementId,
    issues,
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
  
  if (diagnostics.issues.length > 0) {
    console.group('❌ Issues Found:');
    diagnostics.issues.forEach(issue => console.log('-', issue));
    console.groupEnd();
  } else {
    console.log('✅ No issues found');
  }
  
  console.groupEnd();
};
