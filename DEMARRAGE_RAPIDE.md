# 🚀 Démarrage Rapide - Block Blast (Google Play)

Guide express pour lancer votre jeu sur Google Play.

**IMPORTANT :** Cette app utilise UNIQUEMENT :
- ✅ Google Play Billing (achats in-app)
- ✅ Google AdMob (publicités)
- ❌ PAS de Stripe, PayPal, ou paiements externes

---

## ⏱️ TEMPS NÉCESSAIRE

```
┌───────────────────┬───────────────────────────────────┐
│  TEMPS            │  TÂCHE                            │
├───────────────────┼───────────────────────────────────┤
│  00:00 - 00:30    │  🛠️ Configuration locale          │
│  00:30 - 01:30    │  📺 ADMOB                         │
│  01:30 - 03:30    │  🎮 PLAY CONSOLE                  │
│  03:30 - ??       │  ⏳ Attente revue (1-7 jours)     │
└───────────────────┴───────────────────────────────────┘
```

**Total actif : ~3-4 heures**

---

## 📋 PRÉ-REQUIS

- [ ] Node.js 18+
- [ ] Android Studio
- [ ] Compte Google
- [ ] $25 pour Play Developer

---

## ÉTAPE 1 : Test Local (30 min)

```bash
# Cloner et installer
git clone [repo]
cd Block-Blast
npm install

# Lancer en local
npm run dev

# Ouvrir http://localhost:5173
```

**Vérifier :**
- [ ] Le jeu se charge
- [ ] On peut jouer
- [ ] Le shop s'ouvre

---

## ÉTAPE 2 : AdMob (1h)

### 2.1 Créer le compte

```
# 1. apps.admob.com → Sign up
# 2. Ajouter app → Android → "Block Blast"
# 3. Noter l'App ID: ca-app-pub-XXXX~XXXX
```

### 2.2 Créer les ad units

```
Banner:       ca-app-pub-XXXX/XXXX
Interstitial: ca-app-pub-XXXX/XXXX
Rewarded:     ca-app-pub-XXXX/XXXX
```

### 2.3 Configurer

```bash
cp .env.example .env
```

Fichier: .env
```
VITE_ADMOB_ENABLED=true
VITE_ADMOB_APP_ID=ca-app-pub-XXXX~XXXX
VITE_ADMOB_BANNER_ID=ca-app-pub-XXXX/XXXX
VITE_ADMOB_INTERSTITIAL_ID=ca-app-pub-XXXX/XXXX
VITE_ADMOB_REWARDED_ID=ca-app-pub-XXXX/XXXX
```

### 2.4 AndroidManifest.xml

Ajouter dans `android/app/src/main/AndroidManifest.xml`:
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXX~XXXX"/>
```

---

## ÉTAPE 3 : Play Console (2h)

### 3.1 Créer le compte

```
# 1. play.google.com/console → Sign up
# 2. Payer $25 (une fois)
# 3. Vérifier l'identité
```

### 3.2 Créer l'app

```
Create app → Block Blast → Game → Free
```

### 3.3 Créer les produits

```
Monetize → Products → In-app products

premium_pack  | $3.99 | Non-consumable | ACTIVER
coins_100     | $0.99 | Consumable     | ACTIVER
coins_500     | $2.99 | Consumable     | ACTIVER
coins_1200    | $4.99 | Consumable     | ACTIVER
```

### 3.4 License testing

```
Setup → License testing → Ajouter votre email
```

---

## ÉTAPE 4 : Build et Upload

```bash
# Build
npm run build
npx cap sync android
npx cap open android

# Dans Android Studio:
# Build → Generate Signed Bundle → AAB

# Dans Play Console:
# Release → Production → Upload AAB
```

---

## 🧪 IDs DE TEST (Développement)

```env
VITE_ADMOB_APP_ID=ca-app-pub-3940256099942544~3347511713
VITE_ADMOB_BANNER_ID=ca-app-pub-3940256099942544/6300978111
VITE_ADMOB_INTERSTITIAL_ID=ca-app-pub-3940256099942544/1033173712
VITE_ADMOB_REWARDED_ID=ca-app-pub-3940256099942544/5224354917
```

---

## ❓ FAQ RAPIDE

**Q: Combien de temps pour la revue ?**
A: 1-7 jours (généralement 2-3 jours)

**Q: Combien je peux gagner ?**
A: Avec 10,000 utilisateurs actifs/jour :
   - Premium (2%) : ~$2,400/mois
   - Coins (1%) : ~$600/mois
   - AdMob : ~$2,000-5,000/mois
   - **Total : $5,000-8,000/mois**

**Q: Quand je reçois l'argent ?**
A: 
   - Play Store : mensuel (seuil $0)
   - AdMob : mensuel (seuil $100)

---

## 🔗 LIENS UTILES

- **Play Console** : https://play.google.com/console
- **AdMob** : https://apps.admob.com
- **Guide Complet** : `CHECKLIST_LANCEMENT.md`

---

**Prêt ? Lancez-vous ! 🚀🎮**
