# 🎮 Google Play Setup Guide

This guide walks you through setting up your Block Blast game for Google Play distribution with proper monetization.

## ⚠️ Important: Google Play Policies

**Google Play requires ALL payments to go through Google Play Billing.** External payment processors are NOT allowed:

- ❌ Stripe
- ❌ PayPal  
- ❌ Direct credit card processing
- ❌ Web checkout links
- ❌ External payment flows

**For ads, use Google AdMob (NOT AdSense):**
- ❌ Google AdSense (web-only)
- ✅ Google AdMob (mobile apps)

---

## 📋 Prerequisites

1. **Google Play Console Account** ($25 one-time fee)
   - https://play.google.com/console

2. **Google AdMob Account** (free)
   - https://admob.google.com

3. **Android Studio** (for building)
   - https://developer.android.com/studio

---

## Step 1: Create Google Play Console App

1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in:
   - App name: "Block Blast"
   - Default language: English (US)
   - App or game: Game
   - Free or paid: Free
4. Accept Developer Program Policies
5. Click "Create app"

---

## Step 2: Configure In-App Products

Navigate to: **Monetize > Products > In-app products**

### Create Premium Pack (Non-Consumable)

Click "Create product" and fill in:

| Field | Value |
|-------|-------|
| Product ID | `premium_pack` |
| Name | Premium Pack |
| Description | Remove all ads, get 2x coins, exclusive pieces, and daily bonuses forever! |
| Price | $3.99 USD |

**IMPORTANT:** Product ID must be exactly `premium_pack` (lowercase, underscore).

### Create Coin Packs (Consumable)

Create three consumable products:

**Coin Pack 1:**
| Field | Value |
|-------|-------|
| Product ID | `coins_100` |
| Name | 100 Coins |
| Description | A starter pack of coins for power-ups |
| Price | $0.99 USD |

**Coin Pack 2:**
| Field | Value |
|-------|-------|
| Product ID | `coins_500` |
| Name | 500 Coins |
| Description | A medium pack of coins |
| Price | $2.99 USD |

**Coin Pack 3:**
| Field | Value |
|-------|-------|
| Product ID | `coins_1200` |
| Name | 1200 Coins |
| Description | Best value! Extra coins included |
| Price | $4.99 USD |

### Activate Products

After creating each product:
1. Click on the product
2. Click "Activate"
3. Confirm activation

---

## Step 3: Set Up Google AdMob

1. Go to [Google AdMob](https://admob.google.com)
2. Sign in with your Google account
3. Accept Terms of Service

### Add Your App

1. Click "Apps" in sidebar
2. Click "Add app"
3. Platform: Android
4. "Is your app listed on Google Play?": No (not yet)
5. App name: "Block Blast"
6. Click "Add"
7. **Save your App ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)

### Create Ad Units

Click "Ad units" and create:

**1. Banner Ad:**
| Field | Value |
|-------|-------|
| Ad format | Banner |
| Ad unit name | "Block Blast Banner" |

Save the Ad unit ID.

**2. Interstitial Ad:**
| Field | Value |
|-------|-------|
| Ad format | Interstitial |
| Ad unit name | "Block Blast Interstitial" |

Save the Ad unit ID.

**3. Rewarded Ad:**
| Field | Value |
|-------|-------|
| Ad format | Rewarded |
| Ad unit name | "Block Blast Rewarded" |
| Reward amount | 25 |
| Reward item | Coins |

Save the Ad unit ID.

### Update Your .env File

```env
VITE_ADMOB_APP_ID_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
VITE_ADMOB_BANNER_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
VITE_ADMOB_INTERSTITIAL_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
VITE_ADMOB_REWARDED_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
```

---

## Step 4: Build for Android

### Build Web Assets

```bash
npm run build
```

### Sync to Android Project

```bash
npx cap sync android
```

### Open in Android Studio

```bash
npx cap open android
```

### Configure Signing

1. Build > Generate Signed Bundle/APK
2. Choose "Android App Bundle"
3. Create new keystore or use existing
4. Fill in keystore details
5. **SAVE YOUR KEYSTORE SECURELY**

### Build Release

1. Select "release" build variant
2. Click "Finish"
3. APK/AAB will be in `android/app/release/`

---

## Step 5: Test Purchases

### Add Test Accounts

In Play Console > Setup > License testing:

1. Add tester email addresses
2. Set license response to "RESPOND_NORMALLY"

### Test on Device

1. Sign into device with test account
2. Install your app
3. Test purchases (won't be charged)

### Test Scenarios

- [ ] Purchase premium pack
- [ ] Verify ads are hidden after premium purchase
- [ ] Purchase coin packs
- [ ] Verify coins are added
- [ ] Uninstall and reinstall
- [ ] Verify purchase restoration works

---

## Step 6: Upload to Play Console

### Create Release

1. Go to Production > Create new release
2. Upload your AAB file
3. Add release notes
4. Review warnings

### Complete Store Listing

Required:
- [ ] App title and description
- [ ] Screenshots (phone and tablet)
- [ ] Feature graphic (1024x500)
- [ ] App icon (512x512)
- [ ] Privacy policy URL
- [ ] Content rating
- [ ] Target audience

### Submit for Review

1. Review all sections are complete
2. Click "Send for review"
3. Wait 1-7 days for approval

---

## 🔧 Troubleshooting

### Purchases Not Working

**Error: "Item not found"**
- Verify product IDs match exactly
- Wait 24 hours after creating products
- Ensure products are activated

**Error: "This version of the app is not configured for billing"**
- Upload APK to any track (internal testing OK)
- Use same signing key as uploaded APK

### Ads Not Showing

**No ads appearing:**
- Wait 24-48 hours after creating ad units
- Verify ad unit IDs are correct
- Check AdMob account status

**Using test ads:**
- Test IDs work immediately
- Production IDs need account approval

### Build Errors

```bash
# Clean and rebuild
cd android && ./gradlew clean && cd ..
npm run build
npx cap sync android
```

---

## 📊 Revenue Tracking

### In Google Play Console
- Revenue reports under "Financial"
- Real-time data under "Statistics"

### In AdMob
- Revenue reports under "Reports"
- Real-time estimates available

### Tips for Maximizing Revenue

1. **Rewarded ads**: Users choose to watch, higher engagement
2. **Interstitial timing**: After game over, not during gameplay
3. **Premium pricing**: $2.99-$4.99 converts well
4. **Coin pack values**: Make higher tiers better value

---

## ✅ Launch Checklist

Before launching:

- [ ] All in-app products created and activated
- [ ] AdMob account approved
- [ ] Production ad unit IDs configured
- [ ] Privacy policy URL added
- [ ] Terms of service URL added
- [ ] App content rating completed
- [ ] Store listing complete
- [ ] Screenshots uploaded
- [ ] Test purchases working
- [ ] Test ads displaying
- [ ] Premium removes ads correctly
- [ ] Purchase restoration working

---

## 📞 Support Resources

- [Google Play Billing Documentation](https://developer.android.com/google/play/billing)
- [AdMob Documentation](https://developers.google.com/admob)
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [AdMob Help](https://support.google.com/admob)

---

**Good luck with your launch! 🚀**
