import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor Configuration
 * 
 * This app is configured for Google Play with:
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
    // AdMob plugin uses native config (AndroidManifest/strings.xml).
    // See ADMOB_INTEGRATION_GUIDE.md for setup steps.
  }
};

export default config;
