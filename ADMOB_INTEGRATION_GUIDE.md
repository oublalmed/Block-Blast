# 📱 AdMob Integration Guide (Android)

This project uses **Google AdMob** for all ads. Google Play policies require AdMob (or another Google-approved ad SDK) for in-app advertising.

---

## ✅ What is included

- Banner ads (for free users)
- Interstitial ads with frequency limits
- Rewarded ads that grant coins
- Automatic ad disablement for premium users

---

## 1) Create AdMob app + ad units

1. Go to https://admob.google.com
2. Create a new app (Android)
3. Create ad units:
   - Banner
   - Interstitial
   - Rewarded

---

## 2) Install the SDK

Already included in `package.json`:

```bash
npm install react-native-google-mobile-ads
```

---

## 3) Configure the AdMob App ID

Add your AdMob App ID to Android:

**AndroidManifest.xml**
```xml
<meta-data
  android:name="com.google.android.gms.ads.APPLICATION_ID"
  android:value="ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy" />
```

Or configure via `app.json` if you use RN config plugins.

---

## 4) Update Ad Unit IDs

Set your production ad unit IDs in:

```
/src/config/monetization.ts
```

The app uses **Google test IDs** automatically when `__DEV__` is true.

---

## 5) Initialize ads

Ads are initialized in `App.tsx`:

```ts
await initializeAds();
```

This loads AdMob and preloads interstitials.

---

## 6) Where ads show

- **Banner**: `AdBanner` component (hidden for premium users)
- **Interstitial**: `AdInterstitial` with frequency limits
- **Rewarded**: `showRewardedAd()` grants coins

---

## ✅ Policy compliance checklist

- Premium users see no ads
- Interstitials are limited by time + game count
- Rewarded ads are optional and user-triggered

---

## Test IDs (Google)

- Banner: `ca-app-pub-3940256099942544/6300978111`
- Interstitial: `ca-app-pub-3940256099942544/1033173712`
- Rewarded: `ca-app-pub-3940256099942544/5224354917`

---

**AdMob is now ready for Google Play review.**
