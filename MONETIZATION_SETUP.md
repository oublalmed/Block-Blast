# 💰 Block Blast - Google Play Monetization Setup

This guide uses **Google Play Billing** and **Google AdMob**. These are required for Google Play compliance.

---

## ✅ Products (Play Console)

Create these in-app products in **Google Play Console**:

- **Non-consumable**
  - `premium_pack`
- **Consumable**
  - `coins_100`
  - `coins_500`
  - `coins_1200`

---

## 1) Google Play Billing (react-native-iap)

### Step 1: Enable Billing in Play Console
1. Open **Play Console** → your app
2. Go to **Monetize > Products > In-app products**
3. Create the product IDs listed above
4. Save and **activate** each product

### Step 2: Update product IDs in code
Edit:
```
/src/config/monetization.ts
```

### Step 3: Billing connection + restore
Billing is initialized in `App.tsx` and restored on launch:
```ts
await initializeBilling();
await restorePurchases();
```

### Step 4: Purchases
Premium and coins are purchased in the Shop using:
```ts
await purchaseProduct(productId);
```

Consumables are **consumed** using `finishTransaction({ isConsumable: true })` for Google Play compliance.

---

## 2) Google AdMob (react-native-google-mobile-ads)

Follow the AdMob guide here:
```
ADMOB_INTEGRATION_GUIDE.md
```

Ads are disabled for premium users automatically.

---

## 3) Testing Checklist

- Upload an **internal testing** build to Play Console
- Add your tester account under **Setup > License Testing**
- Use test AdMob IDs during development
- Verify:
  - Premium removes ads
  - Coin packs are consumed correctly
  - Restore purchases works after reinstall

---

## ✅ Google Play Compliance Summary

- No external payment links
- All purchases use Play Billing
- Ads only via AdMob

Your monetization setup is now ready for Google Play review.
