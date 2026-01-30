# 💰 Block Blast - Guide de Monétisation Google Play (Français)

## 🎉 Bienvenue !

Ce guide vous accompagne pour configurer la monétisation de votre jeu Block Blast pour **Google Play Store**.

**IMPORTANT :** Ce jeu utilise UNIQUEMENT :
- ✅ **Google Play Billing** - Achats in-app
- ✅ **Google AdMob** - Publicités
- ❌ **PAS de Stripe, PayPal** ou paiements externes
- ❌ **PAS d'AdSense** (web uniquement, interdit dans les apps)

---

## ✅ Ce qui est Configuré

### 💳 Google Play Billing (Achats In-App)

| Produit | Type | Description |
|---------|------|-------------|
| `premium_pack` | Non-consommable | Pack Premium - sans pubs, 2x pièces |
| `coins_100` | Consommable | 100 Pièces |
| `coins_500` | Consommable | 500 Pièces (Populaire) |
| `coins_1200` | Consommable | 1200 Pièces (Meilleure Valeur) |

### 📺 Google AdMob (Publicités)

| Type | Quand | Récompense |
|------|-------|------------|
| Bannière | Pendant le jeu | - |
| Interstitiel | Toutes les 3 parties | - |
| Récompensée | Sur demande | 25 pièces |

**Les utilisateurs Premium ne voient AUCUNE publicité.**

---

## 🚀 Configuration en 5 Étapes

### Étape 1 : Créer un Compte Google Play Developer

1. Allez sur https://play.google.com/console
2. Payez les frais d'inscription de 25$ (une seule fois)
3. Complétez la vérification d'identité

### Étape 2 : Configurer AdMob

1. Allez sur https://apps.admob.com
2. Créez un compte avec votre compte Google
3. Ajoutez votre application Android
4. Créez 3 unités publicitaires :
   - **Bannière** (pour le gameplay)
   - **Interstitiel** (entre les niveaux)
   - **Récompensée** (pour gagner des pièces)

5. Notez votre **App ID** : `ca-app-pub-XXXX~XXXX`
6. Notez vos **Ad Unit IDs**

### Étape 3 : Configurer le Fichier .env

```bash
cp .env.example .env
```

Remplissez avec vos vraies valeurs :

```env
# Google AdMob
VITE_ADMOB_ENABLED=true
VITE_ADMOB_APP_ID=ca-app-pub-VOTRE_APP_ID
VITE_ADMOB_BANNER_ID=ca-app-pub-VOTRE_BANNER_ID
VITE_ADMOB_INTERSTITIAL_ID=ca-app-pub-VOTRE_INTERSTITIAL_ID
VITE_ADMOB_REWARDED_ID=ca-app-pub-VOTRE_REWARDED_ID
```

### Étape 4 : Créer les Produits dans Play Console

1. Allez dans **Monétiser** → **Produits** → **Produits intégrés**
2. Créez ces produits avec les **IDs exacts** :

```
premium_pack - 3,99 $ - Non-consommable
coins_100    - 0,99 $ - Consommable
coins_500    - 2,99 $ - Consommable
coins_1200   - 4,99 $ - Consommable
```

3. **Activez** chaque produit

### Étape 5 : Builder et Tester

```bash
# Builder l'application
npm run build

# Synchroniser avec Android
npx cap sync android

# Ouvrir dans Android Studio
npx cap open android
```

Dans Android Studio :
1. Générez un APK signé
2. Uploadez sur la piste de test interne
3. Testez les achats et publicités

---

## 🧪 Test des Achats

### Ajouter des Testeurs de Licence

1. Play Console → **Configuration** → **Tests de licence**
2. Ajoutez votre email Google
3. Les achats seront gratuits pour les testeurs

### IDs de Test AdMob (Développement)

Utilisez ces IDs pendant le développement :

```env
VITE_ADMOB_APP_ID=ca-app-pub-3940256099942544~3347511713
VITE_ADMOB_BANNER_ID=ca-app-pub-3940256099942544/6300978111
VITE_ADMOB_INTERSTITIAL_ID=ca-app-pub-3940256099942544/1033173712
VITE_ADMOB_REWARDED_ID=ca-app-pub-3940256099942544/5224354917
```

---

## 📊 Suivre Vos Revenus

### Google Play Console
- https://play.google.com/console
- Revenus des achats in-app
- Statistiques de téléchargements

### Google AdMob
- https://apps.admob.com
- Revenus publicitaires
- Impressions et clics

---

## ⚠️ Points Importants

### Ce qui est INTERDIT sur Google Play

❌ Paiements externes (Stripe, PayPal)
❌ Liens vers des checkouts web
❌ Encourager les utilisateurs à payer ailleurs
❌ AdSense (uniquement pour les sites web)

### Ce qui est REQUIS

✅ Google Play Billing pour tous les achats numériques
✅ AdMob pour les publicités mobiles
✅ Politique de confidentialité
✅ Formulaire de sécurité des données

---

## 🆘 Problèmes Courants

### Les achats ne fonctionnent pas ?

1. Vérifiez que l'app est signée (release, pas debug)
2. Vérifiez que les produits sont activés
3. Ajoutez des testeurs de licence
4. Utilisez la piste de test interne

### Les pubs ne s'affichent pas ?

1. Vérifiez l'App ID dans AndroidManifest.xml
2. Vérifiez les Ad Unit IDs
3. Attendez 24-48h pour les nouvelles unités
4. Utilisez des IDs de test en développement

---

## 📝 Documents Légaux Requis

Avant de publier sur Google Play :

1. **Politique de Confidentialité** - Obligatoire
2. **Sécurité des Données** - Formulaire à remplir dans Play Console
3. **Évaluation du Contenu** - Questionnaire à compléter

---

## 🎉 Félicitations !

Votre jeu Block Blast est maintenant prêt pour Google Play avec :

✅ Google Play Billing pour les achats
✅ Google AdMob pour les publicités
✅ 100% conforme aux règles Google Play

**Commencez à gagner de l'argent ! 💰🎮**

---

## 📚 Ressources

- **Guide Complet** : `MONETIZATION_SETUP.md`
- **Google Play Billing** : https://developer.android.com/google/play/billing
- **Google AdMob** : https://developers.google.com/admob

---

**Bonne chance ! 🚀**
