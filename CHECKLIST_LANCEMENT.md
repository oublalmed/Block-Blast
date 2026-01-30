# ✅ Checklist de Lancement - Block Blast (Google Play)

Guide étape par étape pour lancer votre jeu sur Google Play Store.

**IMPORTANT :** Cette app utilise UNIQUEMENT :
- ✅ Google Play Billing (achats in-app)
- ✅ Google AdMob (publicités)
- ❌ PAS de Stripe, PayPal, ou paiements externes
- ❌ PAS d'AdSense (web uniquement)

---

## ⏱️ TIMELINE ESTIMÉE

| Phase | Durée | Description |
|-------|-------|-------------|
| Phase 1 | 30 min | Configuration locale |
| Phase 2 | 1 heure | Configuration AdMob |
| Phase 3 | 2 heures | Configuration Play Console |
| Phase 4 | 1-7 jours | Revue Google Play |

**Total actif : ~3-4 heures**
**Attente : 1-7 jours**

---

## 🛠️ PHASE 1 : CONFIGURATION LOCALE (30 min)

### ☐ Environnement de Développement

□ Node.js 18+ installé
□ Android Studio installé
□ JDK 17+ installé
□ npm install exécuté
□ npm run dev fonctionne

### ☐ Test Local

□ Jouer une partie complète
□ Vérifier le Shop s'ouvre
□ Vérifier les achievements fonctionnent
□ Vérifier les power-ups fonctionnent

---

## 📺 PHASE 2 : GOOGLE ADMOB (1 heure)

### ☐ Créer Compte AdMob

□ S'inscrire sur apps.admob.com
□ Accepter les conditions
□ Compléter la configuration du compte

### ☐ Ajouter l'Application

□ Apps → Add app → Android
□ Nom : Block Blast
□ Noter l'App ID : ca-app-pub-XXXX~XXXX

### ☐ Créer les Unités Publicitaires

**Banner :**
□ Add ad unit → Banner
□ Nom : Block Blast Banner
□ Copier l'Ad Unit ID

**Interstitial :**
□ Add ad unit → Interstitial
□ Nom : Block Blast Interstitial
□ Copier l'Ad Unit ID

**Rewarded :**
□ Add ad unit → Rewarded
□ Nom : Block Blast Rewarded
□ Reward : 25 coins
□ Copier l'Ad Unit ID

### ☐ Configuration du Projet

□ Copier .env.example vers .env
□ Ajouter les IDs AdMob dans .env :
```
VITE_ADMOB_ENABLED=true
VITE_ADMOB_APP_ID=ca-app-pub-XXXX~XXXX
VITE_ADMOB_BANNER_ID=ca-app-pub-XXXX/XXXX
VITE_ADMOB_INTERSTITIAL_ID=ca-app-pub-XXXX/XXXX
VITE_ADMOB_REWARDED_ID=ca-app-pub-XXXX/XXXX
```

□ Ajouter l'App ID dans AndroidManifest.xml

---

## 🎮 PHASE 3 : GOOGLE PLAY CONSOLE (2 heures)

### ☐ Créer Compte Play Developer

□ S'inscrire sur play.google.com/console
□ Payer les frais ($25 une fois)
□ Compléter la vérification d'identité

### ☐ Créer l'Application

□ Create app
□ Nom : Block Blast
□ Langue : Anglais
□ Type : Jeu
□ Gratuit

### ☐ Store Listing

□ Titre (30 caractères max)
□ Description courte (80 caractères)
□ Description complète (4000 caractères)
□ Icône (512x512 PNG)
□ Feature graphic (1024x500)
□ Screenshots (min 2)
□ Catégorie : Puzzle

### ☐ Créer les Produits In-App

□ Monetize → Products → In-app products

**Premium Pack :**
□ Product ID : premium_pack
□ Type : Non-consommable
□ Prix : $3.99
□ Activer

**Coins 100 :**
□ Product ID : coins_100
□ Type : Consommable
□ Prix : $0.99
□ Activer

**Coins 500 :**
□ Product ID : coins_500
□ Type : Consommable
□ Prix : $2.99
□ Activer

**Coins 1200 :**
□ Product ID : coins_1200
□ Type : Consommable
□ Prix : $4.99
□ Activer

### ☐ License Testing

□ Setup → License testing
□ Ajouter votre email Google
□ Response : RESPOND_NORMALLY

### ☐ Data Safety

□ Policy → App content → Data safety
□ Compléter le formulaire
□ Déclarer l'utilisation des identifiants publicitaires

### ☐ Content Rating

□ Policy → App content → Content rating
□ Compléter le questionnaire
□ Obtenir la classification

### ☐ Privacy Policy

□ Créer une page privacy policy
□ Ajouter l'URL dans Play Console

---

## 🔨 PHASE 4 : BUILD ET SOUMISSION

### ☐ Générer le Build

```bash
# Build l'application web
npm run build

# Synchroniser avec Android
npx cap sync android

# Ouvrir Android Studio
npx cap open android
```

### ☐ Dans Android Studio

□ Build → Generate Signed Bundle/APK
□ Créer ou utiliser une keystore
□ Générer un AAB (Android App Bundle)

### ☐ Upload et Soumission

□ Play Console → Release → Production
□ Create new release
□ Upload l'AAB
□ Ajouter les notes de version
□ Review release
□ Start rollout to Production

---

## ⏳ PHASE 5 : ATTENTE ET SUIVI

### ☐ Pendant la Revue (1-7 jours)

□ Vérifier les emails de Google
□ Répondre rapidement aux demandes
□ Surveiller le statut dans Play Console

### ☐ Après Approbation

□ Vérifier l'app sur le Play Store
□ Tester les achats avec un testeur de licence
□ Vérifier que les pubs s'affichent

---

## 📊 SUIVI DES REVENUS

### Google Play Console
- Statistiques de téléchargements
- Revenus des achats in-app
- Évaluations et commentaires

### AdMob Dashboard
- Impressions et clics
- Revenus estimés
- Fill rate

### Google Analytics (optionnel)
- Comportement utilisateurs
- Conversions
- Engagement

---

## 🆘 PROBLÈMES COURANTS

### Les achats ne fonctionnent pas

□ Vérifier que l'app est signée
□ Vérifier que les produits sont activés
□ Vérifier les testeurs de licence
□ Utiliser la piste de test interne

### Les pubs ne s'affichent pas

□ Vérifier l'App ID dans AndroidManifest.xml
□ Vérifier les Ad Unit IDs
□ Attendre 24-48h pour les nouvelles unités
□ Utiliser des IDs de test en dev

### Build échoue

□ npm run build → vérifier les erreurs
□ npx cap sync android → synchroniser
□ Android Studio → Sync Gradle

---

## 📚 RESSOURCES

- **Google Play Console** : https://play.google.com/console
- **Google AdMob** : https://apps.admob.com
- **Play Billing** : https://developer.android.com/google/play/billing
- **AdMob Docs** : https://developers.google.com/admob

---

## 🎉 RÉCAPITULATIF

### Avant de Soumettre

□ Tous les tests passent
□ AdMob configuré
□ Produits créés et activés
□ Build signé généré
□ Store listing complet
□ Privacy policy en place
□ Data safety complété

### Revenus Attendus (10,000 DAU)

| Source | Estimation/Mois |
|--------|-----------------|
| Premium Pack (2%) | ~$2,400 |
| Coin Packs (1%) | ~$600 |
| AdMob | ~$2,000-5,000 |
| **Total** | **$5,000-8,000** |

---

**Bonne chance pour le lancement ! 🚀🎮**
