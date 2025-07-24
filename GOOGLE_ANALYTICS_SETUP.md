# Google Analytics Setup Guide

This project includes Google Analytics 4 (GA4) integration to track user interactions and page views.

## Setup Instructions

### 1. Create Google Analytics Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property for your website
3. Get your Measurement ID (format: G-XXXXXXXXXX)

### 2. Configure Environment Variables

Create a `.env` file in the root directory and add your Google Analytics Measurement ID:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### 3. Features

The analytics integration tracks:

- **Page Views**: Automatic tracking of page navigation
- **Tab Switches**: When users switch between Generate and Scan tabs
- **Language Changes**: When users change the language
- **Custom Events**: Barcode generation, scanning, and other user interactions

### 4. Development vs Production

- Analytics is **disabled** in development mode
- Analytics is **enabled** only in production builds
- This prevents development traffic from affecting your analytics data

### 5. Privacy Compliance

The implementation respects user privacy by:
- Only loading analytics in production
- Using standard GA4 tracking methods
- Not collecting personally identifiable information

### 6. Custom Event Tracking

You can add custom event tracking in your components:

```typescript
import { useAnalytics } from './hooks/useAnalytics';

const { trackEvent, trackCustomEvent } = useAnalytics();

// Track a custom event
trackEvent({
  action: 'barcode_generated',
  category: 'barcode',
  label: 'code128',
});

// Track with custom parameters
trackCustomEvent('pdf_exported', {
  format: 'pdf',
  barcode_count: 10,
});
```

### 7. Verification

After deployment:
1. Check your Google Analytics dashboard
2. Verify that page views and events are being tracked
3. Test different user interactions to ensure proper tracking 