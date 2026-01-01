# 📱 AdMob & Ad Integration Guide

Complete guide for integrating ads into Block Blast game.

## 🎯 Overview

This game supports **two ad integration paths**:

1. **Web App** → Google AdSense
2. **Mobile App (React Native)** → Google AdMob

---

## 🌐 OPTION 1: Web App - Google AdSense

### Step 1: Sign Up for Google AdSense

1. Go to [Google AdSense](https://www.google.com/adsense)
2. Sign up with your Google account
3. Submit your website for review
4. Wait for approval (1-3 days)

### Step 2: Get Your Publisher ID

Once approved:
1. Login to AdSense dashboard
2. Go to **Ads** → **Overview**
3. Copy your **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)

### Step 3: Create Ad Units

1. Go to **Ads** → **By ad unit** → **Display ads**
2. Click **+ New ad unit**
3. Choose **Display ads**
4. Name: "Block Blast Banner"
5. Ad size: **Responsive**
6. Click **Create**
7. Copy the **Ad slot ID** (10-digit number)

### Step 4: Update index.html

Add AdSense script to `/index.html`:

```html
<head>
  <!-- ... existing tags ... -->

  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
       crossorigin="anonymous"></script>
</head>
```

### Step 5: Update AdBanner.tsx

Edit `/src/components/ads/AdBanner.tsx`:

```typescript
// Line 73: Uncomment this line
<GoogleAdSenseBanner onAdLoaded={() => setAdLoaded(true)} />

// Line 138-139: Replace with your IDs
data-ad-client="ca-pub-1234567890123456" // Your publisher ID
data-ad-slot="1234567890" // Your ad slot ID
```

### Step 6: Test

1. Deploy to production (ads won't show on localhost)
2. Visit your website
3. Verify ads are loading

---

## 📱 OPTION 2: Mobile App - Google AdMob

### Prerequisites

You need to convert your React web app to React Native first.

### Step 1: Sign Up for AdMob

1. Go to [Google AdMob](https://admob.google.com)
2. Sign up with your Google account
3. Create a new app

### Step 2: Get App IDs

1. In AdMob dashboard, go to **Apps**
2. Click on your app
3. Copy **App ID** for Android (format: `ca-app-pub-xxxxx~xxxxx`)
4. Copy **App ID** for iOS (format: `ca-app-pub-xxxxx~xxxxx`)

### Step 3: Create Ad Units

#### Banner Ad:
1. Go to **Ad units** → **Add ad unit**
2. Select **Banner**
3. Name: "Block Blast Banner"
4. Copy the **Ad unit ID**

#### Interstitial Ad:
1. Click **Add ad unit** again
2. Select **Interstitial**
3. Name: "Block Blast Interstitial"
4. Copy the **Ad unit ID**

### Step 4: Install React Native Google Mobile Ads

```bash
npm install react-native-google-mobile-ads
cd ios && pod install && cd ..
```

### Step 5: Configure app.json

```json
{
  "react-native-google-mobile-ads": {
    "android_app_id": "ca-app-pub-xxxxx~xxxxx",
    "ios_app_id": "ca-app-pub-xxxxx~xxxxx",
    "delay_app_measurement_init": true
  }
}
```

### Step 6: Initialize in App

Edit `/src/App.tsx`:

```typescript
import mobileAds from 'react-native-google-mobile-ads';

function App() {
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('AdMob initialized');
      });
  }, []);

  // ... rest of your app
}
```

### Step 7: Update AdBanner Component

Edit `/src/components/ads/AdBanner.tsx`:

1. **Uncomment lines 151-181** (AdMob component)
2. **Replace line 162** with your Banner ad unit ID:
```typescript
const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-1234567890123456/1234567890'; // Your banner ad unit ID
```
3. **Uncomment line 76**:
```typescript
<AdMobBannerAd onAdLoaded={() => setAdLoaded(true)} />
```

### Step 8: Setup Interstitial Ads

Edit `/src/components/ads/AdInterstitial.tsx`:

1. **Uncomment lines 52-92** (AdMob interstitial code)
2. **Replace line 59** with your Interstitial ad unit ID
3. **Initialize in App.tsx**:

```typescript
import { initializeInterstitialAd } from './components/ads/AdInterstitial';

function App() {
  useEffect(() => {
    initializeInterstitialAd();
  }, []);
}
```

### Step 9: Test with Test IDs

Use these test IDs during development:

**Android:**
- Banner: `ca-app-pub-3940256099942544/6300978111`
- Interstitial: `ca-app-pub-3940256099942544/1033173712`

**iOS:**
- Banner: `ca-app-pub-3940256099942544/2934735716`
- Interstitial: `ca-app-pub-3940256099942544/4411468910`

### Step 10: Build and Test

```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

---

## 🎮 Ad Placement Strategy

### Banner Ads (Always Visible)
- ✅ Bottom of game screen
- ✅ Automatically hidden for premium users
- ✅ Closeable by user

### Interstitial Ads (Full Screen)
Show at these moments:
- ✅ After game over (every 3 games)
- ✅ After completing a level
- ✅ When starting a new level
- ✅ After watching tutorial

### When NOT to Show Ads
- ❌ Premium users (Premium Pass active)
- ❌ During active gameplay
- ❌ On first game (bad UX)
- ❌ More than once per minute

---

## 💰 Monetization Strategy

### Free Users
- Banner ads on all screens
- Interstitial ads every 3 games
- Can purchase Premium Pass to remove ads

### Premium Users ($4.99/month)
- **No ads** (all ad components automatically hide)
- 2x coin rewards
- Exclusive pieces
- Daily bonus

### Revenue Optimization
1. **Ad Frequency**: Show interstitials every 3-5 games
2. **Placement**: Banner at bottom (doesn't block gameplay)
3. **Timing**: Show ads after natural breaks (game over, level complete)
4. **Premium Upsell**: Offer ad removal + benefits in Premium Pass

---

## 📊 Expected Revenue (Estimates)

### AdMob CPM (Cost Per 1000 Impressions)
- **Banner Ads**: $0.50 - $3.00
- **Interstitial Ads**: $5.00 - $15.00

### Example: 10,000 Daily Active Users
- 100,000 daily game sessions
- 50,000 banner impressions = $25 - $150/day
- 10,000 interstitial impressions = $50 - $150/day
- **Total: $75 - $300/day** ($2,250 - $9,000/month)

### Premium Pass Revenue
- 2% conversion rate = 200 users
- $4.99/month × 200 = **$998/month**

### Combined: **$3,000 - $10,000/month** potential

---

## 🧪 Testing Checklist

- [ ] Ads load correctly
- [ ] Ads don't show for premium users
- [ ] Ads respect user's "Do Not Track" settings
- [ ] Interstitials don't show too frequently
- [ ] Ad close button works
- [ ] Game continues after interstitial closes
- [ ] No performance issues with ads
- [ ] GDPR/CCPA compliance (if applicable)

---

## 🔒 Privacy & Compliance

### GDPR (Europe)
If targeting EU users:
1. Use Google's Consent Management Platform (CMP)
2. Request user consent before showing personalized ads
3. Allow users to opt-out

```typescript
// In AdMob configuration
requestOptions: {
  requestNonPersonalizedAdsOnly: !userHasConsented
}
```

### COPPA (USA - Children's Apps)
If app is for children under 13:
```typescript
requestOptions: {
  tagForChildDirectedTreatment: true
}
```

### Add Privacy Policy
Create `/public/privacy-policy.html` with:
- What data you collect
- How ads use data
- User's rights
- Contact information

---

## 🚀 Going Live

### Before Launch Checklist
1. ✅ Replace ALL test ad IDs with production IDs
2. ✅ Test on real devices (not emulator)
3. ✅ Verify premium users see no ads
4. ✅ Add privacy policy link
5. ✅ Submit app for AdMob review
6. ✅ Wait 24-48 hours for ads to start serving

### After Launch
1. Monitor AdMob dashboard for metrics
2. Adjust ad frequency based on user retention
3. A/B test different ad placements
4. Track premium conversion rate

---

## 📞 Support & Resources

### Official Documentation
- [Google AdSense](https://support.google.com/adsense)
- [Google AdMob](https://support.google.com/admob)
- [React Native Google Mobile Ads](https://docs.page/invertase/react-native-google-mobile-ads)

### Need Help?
- Check AdMob dashboard for error messages
- Review ad approval status
- Ensure app complies with AdMob policies

---

## 🎯 Quick Start Summary

**For Web (AdSense):**
```bash
1. Sign up at google.com/adsense
2. Add script to index.html
3. Update AdBanner.tsx with your IDs
4. Deploy and test
```

**For Mobile (AdMob):**
```bash
1. Sign up at admob.google.com
2. npm install react-native-google-mobile-ads
3. Configure app.json
4. Update ad components with your IDs
5. Build and test on device
```

---

**Your game is now ad-ready! 🎉**
