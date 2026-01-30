import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor Configuration for Block Blast
 * 
 * This app is designed for Google Play distribution with:
 * - Google Play Billing for in-app purchases
 * - Google AdMob for mobile ads
 */
const config: CapacitorConfig = {
  // App identifier - must match Google Play Console
  appId: 'com.blockblast.game',
  
  // App name shown on device
  appName: 'Block Blast',
  
  // Build output directory
  webDir: 'dist',
  
  // Server configuration
  server: {
    // Use HTTPS scheme for Android
    androidScheme: 'https',
  },
  
  // Android-specific configuration
  android: {
    // Allow loading mixed content (http/https)
    allowMixedContent: false,
    
    // Capture input for game controls
    captureInput: true,
    
    // Enable WebView debugging (disable for production!)
    webContentsDebuggingEnabled: process.env.NODE_ENV !== 'production',
    
    // Minimum SDK version (Android 7.0+)
    minWebViewVersion: '55',
  },
  
  // Plugin configuration
  plugins: {
    // Note: AdMob and IAP plugins are configured via their respective
    // native implementations. See android/app/build.gradle for details.
  },
};

export default config;
