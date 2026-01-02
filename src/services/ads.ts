import { ADSENSE_CONFIG } from '../config/payment';

/**
 * Initialize Google AdSense
 * Call this once when the app loads
 */
export const initializeAdSense = () => {
  if (!ADSENSE_CONFIG.enabled || typeof window === 'undefined') {
    return;
  }

  // Check if AdSense script is already loaded
  if (document.querySelector('script[src*="adsbygoogle.js"]')) {
    return;
  }

  // Load AdSense script
  const script = document.createElement('script');
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.clientId}`;
  script.async = true;
  script.crossOrigin = 'anonymous';

  // Add test parameter in test mode
  if (ADSENSE_CONFIG.testMode) {
    script.setAttribute('data-ad-test', 'on');
  }

  document.head.appendChild(script);

  console.log('AdSense initialized:', ADSENSE_CONFIG.clientId);
};

/**
 * Load an ad unit
 * @param slotId - The ad slot ID
 */
export const loadAd = (slotId: string) => {
  if (!ADSENSE_CONFIG.enabled || typeof window === 'undefined') {
    return;
  }

  try {
    // Push ad to AdSense queue
    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
  } catch (error) {
    console.error('Error loading ad:', error);
  }
};

/**
 * Track ad impression for analytics
 */
export const trackAdImpression = (position: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'ad_impression', {
      ad_position: position,
      timestamp: Date.now(),
    });
  }
};

/**
 * Track ad revenue (called via AdSense callbacks)
 */
export const trackAdRevenue = (value: number, currency: string = 'USD') => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'ad_revenue', {
      value: value,
      currency: currency,
    });
  }
};

/**
 * Check if user should see ads (not premium)
 */
export const shouldShowAds = (isPremium: boolean): boolean => {
  return !isPremium && ADSENSE_CONFIG.enabled;
};

/**
 * Get ad unit configuration
 */
export const getAdUnitConfig = (position: 'top' | 'bottom') => {
  return {
    client: ADSENSE_CONFIG.clientId,
    slot: ADSENSE_CONFIG.adSlots[position],
    format: 'auto',
    responsive: true,
    testMode: ADSENSE_CONFIG.testMode,
  };
};

/**
 * Initialize Google Analytics 4 for revenue tracking
 */
export const initializeAnalytics = (measurementId: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  // Load Google Analytics 4
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize gtag
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = gtag;

  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: true,
  });

  console.log('Google Analytics initialized:', measurementId);
};
