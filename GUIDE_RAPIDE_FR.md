# 🇫🇷 Guide rapide - Monetisation Google Play

Ce projet est conforme Google Play :

- Paiements via **Google Play Billing**
- Publicites via **Google AdMob**

---

## ✅ Produits a creer (Play Console)

- Non consommable : `premium_pack`
- Consommables : `coins_100`, `coins_500`, `coins_1200`

---

## ✅ Configuration code

1. Ouvrir `/src/config/monetization.ts`
2. Renseigner les IDs produits et les IDs AdMob

---

## ✅ AdMob

Suivre le guide :
```
ADMOB_INTEGRATION_GUIDE.md
```

---

## ✅ Restauration des achats

Les achats sont restaurés au demarrage via `restorePurchases()` dans `App.tsx`.

---

## ✅ Conformite Google Play

- Aucun lien de paiement externe
- Achats via Play Billing uniquement
- Ads uniquement via AdMob

Pret pour la review Google Play.
