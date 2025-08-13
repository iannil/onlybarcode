# Google Analytics Troubleshooting Guide

## Issue: Analytics Loads But No Data Received

### Symptoms

- Console shows: "Google Analytics script loaded successfully"
- Console shows: "Google Analytics initialized successfully"
- Console shows: "Initial page view sent to Google Analytics"
- But Google Analytics shows: "尚未从您的网站收到任何数据" (No data received from your website)

### Common Causes and Solutions

#### 1. Ad Blockers and Privacy Extensions

**Problem**: Ad blockers like uBlock Origin, AdBlock Plus, or privacy extensions block Google Analytics.

**Solutions**:

- Disable ad blockers for your domain
- Add `analytics.google.com` and `googletagmanager.com` to whitelist
- Check browser extensions that might block tracking

#### 2. Browser Privacy Settings

**Problem**: Modern browsers have enhanced privacy features that block tracking.

**Solutions**:

- Check if "Do Not Track" is enabled in browser settings
- Disable Enhanced Tracking Protection (Firefox)
- Check Chrome's Privacy and Security settings
- Test in incognito/private mode

#### 3. Network/Firewall Issues

**Problem**: Corporate networks or firewalls block Google Analytics domains.

**Solutions**:

- Test on different networks (mobile hotspot, home network)
- Check if `google-analytics.com` and `googletagmanager.com` are accessible
- Contact network administrator if on corporate network

#### 4. Measurement ID Configuration

**Problem**: Incorrect or placeholder Measurement ID.

**Solutions**:

- Verify Measurement ID `G-891EFN0THT` is correct
- Check Google Analytics property settings
- Ensure the property is properly configured for web data collection

#### 5. Domain/URL Configuration

**Problem**: Google Analytics property not configured for your domain.

**Solutions**:

- Add your domain to Google Analytics property settings
- Check if the property is configured for the correct URL
- Verify HTTPS vs HTTP configuration

#### 6. Timing Issues

**Problem**: Data takes time to appear in Google Analytics.

**Solutions**:

- Check Real-Time reports (updates within seconds)
- Standard reports have 24-48 hour delay
- Use Real-Time URL: `https://analytics.google.com/analytics/web/#/pG-891EFN0THT/realtime/intro`

### Diagnostic Tools

#### 1. Browser Developer Tools

```javascript
// Check if gtag is available
console.log('gtag available:', typeof window.gtag === 'function');

// Check dataLayer
console.log('dataLayer:', window.dataLayer);

// Check for blocked requests
// Open Network tab and look for failed requests to google-analytics.com
```

#### 2. Enhanced Analytics Test

Click the "🧪 Test GA" button in development mode to run comprehensive diagnostics.

#### 3. Manual Network Test

```javascript
// Test if Google Analytics domains are accessible
fetch('https://www.google-analytics.com/collect', {
  method: 'HEAD',
  mode: 'no-cors'
}).then(() => console.log('✅ Accessible')).catch(() => console.log('❌ Blocked'));
```

### Step-by-Step Troubleshooting

1. **Check Real-Time Reports**
   - Go to Google Analytics Real-Time > Overview
   - Refresh your website
   - Look for active users and page views

2. **Test in Different Browsers**
   - Try Chrome, Firefox, Safari, Edge
   - Test in incognito/private mode
   - Check if issue is browser-specific

3. **Test Network Connectivity**
   - Try different networks (mobile, home, work)
   - Check if issue is network-specific

4. **Verify Google Analytics Setup**
   - Confirm Measurement ID is correct
   - Check property settings
   - Verify domain is added to property

5. **Check for Blocking**
   - Disable all browser extensions
   - Test with ad blockers disabled
   - Check browser privacy settings

### Real-Time Testing

Use the enhanced analytics test functions:

```javascript
// Run comprehensive test
runRealTimeAnalyticsTest();

// Check Real-Time status
checkRealTimeStatus();
```

### Common Error Messages

- **"尚未从您的网站收到任何数据"**: No data received - usually blocking issue
- **"Google Analytics domains blocked"**: Ad blocker or firewall issue
- **"Do Not Track enabled"**: Browser privacy setting blocking tracking
- **"gtag function not available"**: Script loading issue

### Production vs Development

- Analytics only works in production environment
- Development environment disables analytics to prevent test data
- Use `import.meta.env.PROD` to check if in production

### Monitoring and Alerts

Set up monitoring to detect when analytics stops working:

```javascript
// Monitor analytics health
setInterval(() => {
  if (!window.gtag || !window.dataLayer) {
    console.error('Analytics not working properly');
  }
}, 30000);
```

### Contact Support

If issues persist:

1. Check Google Analytics Help Center
2. Verify with Google Analytics support
3. Test with Google Analytics Debugger extension
4. Use Google Tag Assistant for debugging

### Prevention

- Regular monitoring of analytics data
- Automated health checks
- Fallback tracking methods
- User notification when analytics is blocked
