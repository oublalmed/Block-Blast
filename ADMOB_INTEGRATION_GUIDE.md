# 📱 Google AdMob Integration Guide

Complete guide for integrating Google AdMob ads into Block Blast game for Android (Google Play).

**IMPORTANT:** This guide covers AdMob ONLY. AdSense is NOT allowed in mobile apps.

---

## 🎯 Overview

Google AdMob is the **ONLY** ad platform allowed for monetizing apps on Google Play.

### Ad Types Supported

| Ad Type | Description | Revenue (CPM) |
|---------|-------------|---------------|
| **Banner** | Small ad at bottom of screen | $0.50 - $3.00 |
| **Interstitial** | Full-screen ad between levels | $5.00 - $15.00 |
| **Rewarded** | User watches ad for rewards | $10.00 - $30.00 |

**Premium users see NO ADS.**

---

## 🚀 Quick Setup

### Step 1: Sign Up for AdMob

1. Go to https://apps.admob.com
2. Sign up with your Google account
3. Accept terms and conditions

### Step 2: Add Your App

1. Click **"Apps"** → **"Add app"**
2. Select **"Android"**
3. Enter app name: Block Blast
4. Note your **App ID**: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`

### Step 3: Create Ad Units

#### Banner Ad:
1. **Ad units** → **Add ad unit** → **Banner**
2. Name: "Block Blast Banner"
3. Copy the Ad unit ID

#### Interstitial Ad:
1. **Add ad unit** → **Interstitial**
2. Name: "Block Blast Interstitial"
3. Copy the Ad unit ID

#### Rewarded Ad:
1. **Add ad unit** → **Rewarded**
2. Name: "Block Blast Rewarded"
3. Reward: 25 coins
4. Copy the Ad unit ID

### Step 4: Configure Environment

Add to your `.env` file:

```env
VITE_ADMOB_ENABLED=true
VITE_ADMOB_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
VITE_ADMOB_BANNER_ID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
VITE_ADMOB_INTERSTITIAL_ID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
VITE_ADMOB_REWARDED_ID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
```

### Step 5: Update AndroidManifest.xml

Add your App ID to `android/app/src/main/AndroidManifest.xml`:

```xml
<application>
    <meta-data
        android:name="com.google.android.gms.ads.APPLICATION_ID"
        android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>
</application>
```

---

## 🧪 Test Ad Unit IDs

Use these official Google test IDs during development:

```env
# Test App ID
VITE_ADMOB_APP_ID=ca-app-pub-3940256099942544~3347511713

# Test Ad Unit IDs
VITE_ADMOB_BANNER_ID=ca-app-pub-3940256099942544/6300978111
VITE_ADMOB_INTERSTITIAL_ID=ca-app-pub-3940256099942544/1033173712
VITE_ADMOB_REWARDED_ID=ca-app-pub-3940256099942544/5224354917
```

**⚠️ NEVER use production ad IDs during development!**

---

## 🎮 Ad Placement Strategy

### Banner Ads
- **Location**: Bottom of game screen
- **When**: Always visible during gameplay
- **Behavior**: Hidden for premium users

### Interstitial Ads
- **When to show**:
  - After game over (every 3 games)
  - After completing a level
  - At natural break points
- **Frequency limit**: Max 1 per minute
- **Session limit**: Max 10 per session

### Rewarded Ads
- **When**: User-initiated (Watch Ad for Coins button)
- **Reward**: 25 coins for watching complete ad
- **Note**: Available to all users (including premium)

### When NOT to Show Ads

❌ During active gameplay
❌ To premium users (except rewarded)
❌ On first game (bad UX)
❌ More than once per minute
❌ Right after app launch

---

## 💡 Implementation Details

### Initialize AdMob

```typescript
// src/services/ads.ts
import { Capacitor } from '@capacitor/core';

export const initializeAds = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('AdMob only works on native platforms');
    return false;
  }

  // Initialize AdMob SDK
  // await AdMob.initialize();
  
  return true;
};
```

### Show Banner Ad

```typescript
export const showBanner = async () => {
  if (!shouldShowAds()) return false;

  // await AdMob.showBanner({
  //   adId: 'ca-app-pub-XXX/XXX',
  //   adSize: BannerAdSize.ADAPTIVE_BANNER,
  //   position: BannerAdPosition.BOTTOM_CENTER,
  // });

  return true;
};
```

### Show Interstitial Ad

```typescript
export const showInterstitial = async () => {
  if (!shouldShowAds()) return false;

  // Check cooldown
  const now = Date.now();
  if (now - lastInterstitialTime < 60000) {
    return false; // 1 minute cooldown
  }

  // await AdMob.showInterstitial();
  lastInterstitialTime = now;
  
  return true;
};
```

### Show Rewarded Ad

```typescript
export const showRewardedAd = async (onReward) => {
  // await AdMob.showRewardedAd({
  //   adId: 'ca-app-pub-XXX/XXX',
  // });

  // When user completes watching
  onReward({ type: 'coins', amount: 25 });
  
  return true;
};
```

---

## 📊 Revenue Optimization

### Maximize Revenue

1. **Rewarded ads have highest CPM** - Encourage users to watch for rewards
2. **Limit interstitial frequency** - Don't frustrate users
3. **Smart placement** - Show ads at natural break points
4. **A/B test** - Try different frequencies

### Expected Revenue

With **10,000 Daily Active Users**:

| Ad Type | Impressions/Day | CPM | Revenue/Day |
|---------|-----------------|-----|-------------|
| Banner | 50,000 | $1.50 | $75 |
| Interstitial | 10,000 | $8.00 | $80 |
| Rewarded | 5,000 | $20.00 | $100 |
| **Total** | | | **$255/day** |

**Monthly**: ~$7,650 from ads alone

---

## 🔒 Privacy & Compliance

### GDPR (European Users)

1. Get consent before showing personalized ads
2. Offer option for non-personalized ads
3. Use Google's User Messaging Platform (UMP)

```typescript
// Check for consent
const consentStatus = await UMP.getConsentStatus();
if (consentStatus === 'REQUIRED') {
  await UMP.showConsentForm();
}
```

### Data Safety (Google Play)

Complete the Data Safety form in Play Console:
- Declare what data your app collects
- Explain how ads use device identifiers
- Disclose data sharing with Google

---

## ✅ Pre-Launch Checklist

- [ ] Replace test ad IDs with production IDs
- [ ] App ID added to AndroidManifest.xml
- [ ] Premium users don't see ads
- [ ] Interstitial frequency limits working
- [ ] Rewarded ads grant coins correctly
- [ ] Privacy policy mentions ad networks
- [ ] Data Safety form completed
- [ ] Tested on real device (not emulator)

---

## 🆘 Troubleshooting

### Ads Not Showing

1. **Check App ID** - Must be in AndroidManifest.xml
2. **Check Ad Unit IDs** - Must match exactly
3. **Wait 24-48 hours** - New ad units need time
4. **Use signed builds** - Debug builds may not work
5. **Check AdMob dashboard** - Look for errors

### Common Errors

**"The ad request was successful, but no ad was returned"**
- Normal during testing
- Low fill rate in your region
- Try again later

**"Ad failed to load: 3"**
- No fill - try again later
- Check internet connection
- Verify ad unit ID

**"Ad failed to load: 0"**
- Internal error
- Update Google Play Services
- Check AdMob dashboard

---

## 📚 Resources

- **AdMob Help**: https://support.google.com/admob
- **AdMob Policies**: https://support.google.com/admob/answer/6128543
- **Mobile Ads SDK**: https://developers.google.com/admob/android/quick-start
- **UMP SDK**: https://developers.google.com/admob/ump/android/quick-start

---

## 🎉 Summary

1. **Sign up** at apps.admob.com
2. **Create ad units** (Banner, Interstitial, Rewarded)
3. **Configure** App ID and Ad Unit IDs
4. **Test** with test IDs first
5. **Replace** with production IDs before launch
6. **Submit** to Google Play

**Your game is now monetized with AdMob! 💰🎮**
