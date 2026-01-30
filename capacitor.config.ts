import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor Configuration
 * 
 * This app is configured for Google Play with:
 * - Google Play Billing for in-app purchases
 * - Google AdMob for advertisements
 */
const config: CapacitorConfig = {
  appId: 'com.blockblast.game',
  appName: 'Block Blast',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    // Disable for production builds
    webContentsDebuggingEnabled: process.env.NODE_ENV !== 'production'
  },
  plugins: {
    // AdMob configuration would go here when using a Capacitor AdMob plugin
    // Example with @nicklasonz/capacitor-admob:
    // AdMob: {
    //   appId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
    //   requestTrackingAuthorization: true,
    // }
  }
};

export default config;
