# 💰 Block Blast - Monetization Setup Guide

Complete guide to configure real payments and ad revenue for Block Blast game.

---

## 🎯 Overview

Your Block Blast game now has **real monetization** integrated:

✅ **Stripe Payments** - Accept real credit card payments for Premium Pass ($3.99)
✅ **Google AdSense** - Display real ads and earn revenue
✅ **Google Analytics 4** - Track revenue and conversions

---

## 📋 Quick Setup Checklist

- [ ] Create Stripe account and get API keys
- [ ] Set up Stripe products and payment links
- [ ] Create Google AdSense account
- [ ] Configure ad units
- [ ] Set up Google Analytics 4
- [ ] Configure environment variables
- [ ] Test payment flow
- [ ] Deploy and start earning!

---

## 💳 PART 1: Stripe Payment Setup

### Step 1: Create Stripe Account

1. Go to https://stripe.com
2. Click "Start now" and create an account
3. Complete the business verification process
4. Navigate to **Dashboard** → **Developers** → **API keys**

### Step 2: Get Your API Keys

1. In the Stripe Dashboard, go to **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. Save it - we'll use it in the `.env` file

**⚠️ IMPORTANT:** Use test keys during development, switch to live keys only when ready for production!

### Step 3: Create Premium Pass Product

1. Go to **Products** in Stripe Dashboard
2. Click **+ Add product**
3. Fill in:
   - **Name:** Premium Pass
   - **Description:** Unlock all premium features: No ads, 2x rewards, exclusive pieces, daily bonuses
   - **Price:** $3.99 USD
   - **Type:** One-time payment
4. Click **Save product**
5. Copy the **Price ID** (starts with `price_`)

### Step 4: Create Payment Link (Easiest Option)

1. In your Premium Pass product, click **Create payment link**
2. Configure:
   - **After payment:** Redirect to your game URL with `?success=true&session_id={CHECKOUT_SESSION_ID}`
   - **Collect customer email:** Yes (optional)
3. Click **Create link**
4. Copy the payment link URL

### Step 5: Update Stripe Configuration

In `/src/services/stripe.ts`, update the `createPremiumCheckoutSession` function:

```typescript
const paymentLinkUrl = `https://buy.stripe.com/YOUR_PAYMENT_LINK_ID`;
```

Replace `YOUR_PAYMENT_LINK_ID` with your actual payment link ID from Step 4.

### Step 6: Optional - Set Up Webhooks (Recommended for Production)

For production, you should verify payments server-side:

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Add endpoint: `https://yourdomain.com/api/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. Copy the webhook secret
5. Implement webhook handler in your backend (see Backend Setup section)

---

## 📢 PART 2: Google AdSense Setup

### Step 1: Create AdSense Account

1. Go to https://www.google.com/adsense
2. Click **Sign up now**
3. Enter your website URL (your game's deployed URL)
4. Complete the application and wait for approval (can take 1-3 days)

### Step 2: Get Your Publisher ID

1. Once approved, go to **AdSense Dashboard**
2. Navigate to **Account** → **Settings** → **Account information**
3. Copy your **Publisher ID** (starts with `ca-pub-`)

### Step 3: Create Ad Units

1. Go to **Ads** → **Ad units**
2. Click **+ New ad unit**
3. Create two display ad units:

   **Bottom Banner:**
   - Name: "Block Blast Bottom Banner"
   - Type: Display ads
   - Size: Responsive
   - Copy the Ad unit ID

   **Top Banner (optional):**
   - Name: "Block Blast Top Banner"
   - Type: Display ads
   - Size: Responsive
   - Copy the Ad unit ID

4. Save both Ad unit IDs

### Step 4: Add AdSense Code to Your Site

The code is already integrated! AdSense will be automatically initialized when users visit your game.

### Step 5: Enable Ads in Production

Ads will only show for non-premium users. Premium Pass users see no ads.

---

## 📊 PART 3: Google Analytics 4 Setup

### Step 1: Create GA4 Property

1. Go to https://analytics.google.com
2. Click **Admin** → **Create Property**
3. Fill in property details:
   - **Property name:** Block Blast
   - **Time zone:** Your time zone
   - **Currency:** USD

### Step 2: Get Measurement ID

1. After creating property, go to **Admin** → **Data Streams**
2. Click **Add stream** → **Web**
3. Enter your website URL
4. Copy the **Measurement ID** (starts with `G-`)

### Step 3: Enable E-commerce Tracking

1. In your data stream settings, scroll to **Enhanced measurement**
2. Enable these options:
   - ✅ Page views
   - ✅ Scrolls
   - ✅ Outbound clicks
   - ✅ Site search
   - ✅ File downloads

---

## ⚙️ PART 4: Environment Configuration

### Step 1: Create `.env` File

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual values:

```env
# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY
VITE_STRIPE_PREMIUM_PRICE_ID=price_YOUR_ACTUAL_PRICE_ID

# AdSense
VITE_ADSENSE_CLIENT_ID=ca-pub-YOUR_ACTUAL_PUBLISHER_ID
VITE_ADSENSE_SLOT_BOTTOM=1234567890
VITE_ADSENSE_SLOT_TOP=0987654321
VITE_ADSENSE_ENABLED=true

# Google Analytics
VITE_GA4_MEASUREMENT_ID=G-YOUR_ACTUAL_MEASUREMENT_ID
VITE_REVENUE_TRACKING_ENABLED=true
```

### Step 2: Never Commit .env to Git

The `.env` file is already in `.gitignore`. Never commit it!

---

## 🧪 PART 5: Testing

### Test Stripe Payments

1. Use Stripe test cards:
   - **Success:** `4242 4242 4242 4242`
   - **Decline:** `4000 0000 0000 0002`
   - Any future expiry date (e.g., 12/34)
   - Any CVC (e.g., 123)

2. Test flow:
   - Go to Shop
   - Click "Upgrade to Premium"
   - Click "Pay $3.99"
   - Use test card
   - Verify Premium Pass activates after payment
   - Verify ads disappear

### Test AdSense

1. AdSense will show test ads in development
2. Real ads only show after site is approved and live
3. Check browser console for any AdSense errors
4. Test that ads don't show for premium users

### Test Analytics

1. Open browser DevTools → Network tab
2. Filter by "google-analytics"
3. Perform actions (purchase, view pages)
4. Verify analytics requests are being sent
5. Check GA4 Dashboard → Realtime to see events

---

## 🚀 PART 6: Deployment

### For Vercel/Netlify:

1. Push your code to GitHub
2. Connect to Vercel/Netlify
3. Add environment variables in dashboard:
   - Go to Settings → Environment Variables
   - Add all variables from your `.env` file
4. Deploy!

### For Your Own Server:

1. Build the project:
   ```bash
   npm run build
   ```

2. Set environment variables on your server

3. Serve the `dist` folder

---

## 💵 PART 7: Going Live (Production)

### Before Launch Checklist:

- [ ] Stripe account is fully verified
- [ ] Switch Stripe keys from test to live (`pk_live_...`)
- [ ] AdSense account is approved
- [ ] Update payment link URLs to live mode
- [ ] Set production environment variables
- [ ] Test complete payment flow in production
- [ ] Verify webhooks are working (if implemented)
- [ ] Check analytics is tracking correctly
- [ ] Add refund policy to your website
- [ ] Add privacy policy (required for AdSense)
- [ ] Add terms of service

### Switch to Live Mode:

1. In Stripe Dashboard, toggle from **Test mode** to **Live mode** (top right)
2. Get new live API keys and payment links
3. Update environment variables with live keys
4. Redeploy your application

---

## 📱 Optional: Backend API (Recommended for Production)

For maximum security, you should verify payments server-side. Here's a simple Node.js example:

### Create `api/stripe-webhook.js`:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // TODO: Update your database to activate premium for this user
    // You'll need to identify the user from session.client_reference_id
    console.log('Payment successful:', session.id);
  }

  res.json({ received: true });
}
```

---

## 📊 Revenue Tracking

### Monitor Your Earnings:

**Stripe Dashboard:**
- https://dashboard.stripe.com
- View all payments, refunds, and revenue
- Export reports for accounting

**AdSense Dashboard:**
- https://www.google.com/adsense
- View ad impressions, clicks, and estimated earnings
- Payments are sent monthly when you reach $100 threshold

**Google Analytics 4:**
- https://analytics.google.com
- View detailed user behavior and conversion tracking
- Monetization reports show revenue breakdown

---

## 🆘 Troubleshooting

### Stripe Issues:

**Problem:** Payment link redirects but premium doesn't activate
**Solution:** Check that your redirect URL includes `?success=true&session_id={CHECKOUT_SESSION_ID}`

**Problem:** "Invalid publishable key" error
**Solution:** Verify your `.env` file has the correct key starting with `pk_test_` or `pk_live_`

### AdSense Issues:

**Problem:** Ads not showing
**Solution:**
- Check that VITE_ADSENSE_ENABLED=true
- Verify ad units are created and IDs are correct
- Wait 24-48 hours after creating ad units for first ads to appear
- Check browser console for errors

**Problem:** "AdSense account not approved"
**Solution:** Wait for Google's approval email (1-3 days). Ensure your site has quality content and follows AdSense policies.

### Analytics Issues:

**Problem:** Events not showing in GA4
**Solution:**
- Check that Measurement ID is correct
- Look for gtag errors in browser console
- Use GA4 DebugView mode to test events
- Wait 24-48 hours for data to appear in reports

---

## 📧 Support

Need help? Check these resources:

- **Stripe Docs:** https://stripe.com/docs
- **AdSense Help:** https://support.google.com/adsense
- **GA4 Help:** https://support.google.com/analytics

---

## 🎉 Congratulations!

Your Block Blast game is now fully monetized with:

✅ Real credit card payments via Stripe
✅ Ad revenue via Google AdSense
✅ Revenue analytics via Google Analytics 4

**Start earning money from your game! 💰🎮**

---

## 📝 License & Legal

**Important:** Before accepting real payments:

1. **Add a Privacy Policy** (required by law and AdSense)
2. **Add Terms of Service**
3. **Add Refund Policy** (required by Stripe)
4. **Register your business** (if required in your jurisdiction)
5. **Set up proper accounting** for tax purposes

Consult with a lawyer and accountant for your specific situation.

---

**Happy Earning! 🚀**
