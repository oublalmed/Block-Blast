# 📱 AdMob Integration Guide (Google Play)

This project is **Android-only** and **Google Play compliant**:
- Ads use **Google AdMob** (no AdSense scripts).
- Payments use **Google Play Billing**.

---

## ✅ 1) Create your AdMob account + app

1. Sign up at https://admob.google.com
2. Create a new app for Android.
3. Copy the **AdMob App ID** (format: `ca-app-pub-XXXX~YYYY`).

---

## ✅ 2) Create Ad Units

Create the following ad units in AdMob:
- **Banner**
- **Interstitial**
- **Rewarded**

Copy each **Ad Unit ID** (format: `ca-app-pub-XXXX/ZZZZ`).

---

## ✅ 3) Configure react-native-google-mobile-ads

Install (already included in this repo):
```bash
npm install react-native-google-mobile-ads
```

Configure your Android App ID in native config (example `app.json`):
```json
{
  "react-native-google-mobile-ads": {
    "android_app_id": "ca-app-pub-XXXX~YYYY"
  }
}
```

---

## ✅ 4) Update Ad Unit IDs

Edit `src/config/monetization.ts`:
```ts
export const ADMOB_AD_UNIT_IDS = {
  banner: "ca-app-pub-XXXX/ZZZZ",
  interstitial: "ca-app-pub-XXXX/ZZZZ",
  rewarded: "ca-app-pub-XXXX/ZZZZ"
};
```

---

## ✅ 5) How Ads Are Used

This app already wires AdMob into:
- **Banner ads** via `AdBanner`
- **Interstitial ads** via `AdInterstitial` (limited frequency)
- **Rewarded ads** via `showRewardedAd()` to grant coins

Premium users see **no ads**.

---

## ✅ 6) Testing

In development, the app uses **AdMob test IDs** automatically.
For release, replace them with your real Ad Unit IDs.

---

## 🔒 Google Play Compliance

- No AdSense scripts
- No external ad SDKs
- AdMob only

Your app is ready for Google Play review when these steps are complete. ✅
