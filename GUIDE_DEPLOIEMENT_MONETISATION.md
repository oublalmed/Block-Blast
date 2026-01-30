# 📦 Guide de deploiement - Monetisation Google Play

Ce guide utilise Google Play Billing et AdMob.

---

## 1) Play Console

1. Creer votre application Android
2. Ajouter les produits in-app :
   - `premium_pack` (non consommable)
   - `coins_100`, `coins_500`, `coins_1200` (consommables)
3. Activer chaque produit

---

## 2) AdMob

1. Creer votre application dans AdMob
2. Creer les unites :
   - Banner
   - Interstitial
   - Rewarded
3. Mettre a jour `/src/config/monetization.ts`

---

## 3) Build Android

1. Build AAB release
2. Upload sur Play Console
3. Tester en "Internal testing"

---

## ✅ Conformite

- Paiements uniquement via Play Billing
- Publicites uniquement via AdMob
- Aucun lien externe

Pret pour la review Google Play.
