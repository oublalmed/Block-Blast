import { loadStripe, Stripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG, PREMIUM_PASS, COIN_PACKS } from '../config/payment';

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Initialize Stripe
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);
  }
  return stripePromise;
};

/**
 * Create Stripe Checkout Session for Premium Pass
 * @returns Checkout session URL or null if failed
 */
export const createPremiumCheckoutSession = async (): Promise<string | null> => {
  try {
    // In production, you would call your backend API to create a checkout session
    // For now, we'll use Stripe's Payment Links feature (create in Stripe Dashboard)

    // Option 1: Use Stripe Payment Links (Recommended for quick setup)
    // Create a Payment Link in your Stripe Dashboard for the Premium Pass
    // Replace this URL with your actual Payment Link
    const paymentLinkUrl = `https://buy.stripe.com/test_YOUR_PAYMENT_LINK_ID`;

    // Option 2: Call your backend to create a checkout session
    // const response = await fetch('/api/create-checkout-session', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     priceId: PREMIUM_PASS.priceId,
    //     quantity: 1,
    //   }),
    // });
    // const session = await response.json();
    // return session.url;

    return paymentLinkUrl;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return null;
  }
};

/**
 * Create Stripe Checkout Session for Coin Packs
 * @param packId - The coin pack ID
 * @returns Checkout session URL or null if failed
 */
export const createCoinPackCheckoutSession = async (packId: string): Promise<string | null> => {
  try {
    const pack = COIN_PACKS.find(p => p.id === packId);
    if (!pack) {
      throw new Error('Invalid pack ID');
    }

    // Create Payment Link in Stripe Dashboard for each coin pack
    // Replace with your actual Payment Links
    const paymentLinks: Record<string, string> = {
      coins_500: 'https://buy.stripe.com/test_YOUR_PAYMENT_LINK_500',
      coins_1200: 'https://buy.stripe.com/test_YOUR_PAYMENT_LINK_1200',
      coins_3000: 'https://buy.stripe.com/test_YOUR_PAYMENT_LINK_3000',
      coins_10000: 'https://buy.stripe.com/test_YOUR_PAYMENT_LINK_10000',
    };

    return paymentLinks[packId] || null;
  } catch (error) {
    console.error('Error creating coin pack checkout session:', error);
    return null;
  }
};

/**
 * Handle successful payment
 * This should be called after payment is confirmed (via webhook)
 * For client-side validation, check URL parameters after redirect
 */
export const handlePaymentSuccess = (sessionId: string) => {
  // Track the purchase
  trackPurchase('premium_pass', PREMIUM_PASS.price);

  // In production, verify with your backend before activating
  console.log('Payment successful:', sessionId);
};

/**
 * Track purchase event for analytics
 */
const trackPurchase = (itemId: string, value: number) => {
  // Google Analytics 4 e-commerce tracking
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'purchase', {
      transaction_id: Date.now().toString(),
      value: value,
      currency: 'USD',
      items: [{
        item_id: itemId,
        item_name: itemId === 'premium_pass' ? 'Premium Pass' : 'Coin Pack',
        price: value,
        quantity: 1,
      }],
    });
  }
};

/**
 * Verify payment on the client side (basic validation)
 * In production, always verify on the server side!
 */
export const verifyPayment = async (sessionId: string): Promise<boolean> => {
  try {
    // In production, call your backend to verify the payment
    // const response = await fetch(`/api/verify-payment/${sessionId}`);
    // const data = await response.json();
    // return data.valid;

    // For demo purposes, we'll assume payment is valid if sessionId exists
    return !!sessionId;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
};

/**
 * Check if payment was successful from URL parameters
 */
export const checkPaymentStatus = (): { success: boolean; sessionId: string | null } => {
  if (typeof window === 'undefined') {
    return { success: false, sessionId: null };
  }

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');
  const success = params.get('success') === 'true';

  return { success, sessionId };
};
