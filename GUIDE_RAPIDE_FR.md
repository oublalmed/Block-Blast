# 💰 Block Blast - Guide de Monétisation (Français)

## 🎉 Félicitations !

Votre jeu Block Blast est maintenant équipé d'un **système de monétisation complet** vous permettant de gagner de l'argent réel !

---

## ✅ Ce qui a été configuré

### 💳 Paiements Stripe (Premium Pass - 3.99$)
- ✅ Intégration complète avec Stripe pour accepter les cartes bancaires
- ✅ Flux d'achat sécurisé et conforme PCI
- ✅ Activation automatique du Premium Pass après paiement
- ✅ Système de vérification des paiements
- ✅ Support pour les achats de packs de pièces (à venir)

### 📢 Publicités Google AdSense
- ✅ Intégration Google AdSense pour afficher des publicités réelles
- ✅ Bannières publicitaires en bas de l'écran de jeu
- ✅ Suivi des impressions publicitaires
- ✅ Les publicités n'apparaissent PAS pour les utilisateurs Premium
- ✅ Mode test pour le développement

### 📊 Suivi des Revenus (Google Analytics 4)
- ✅ Suivi complet des achats et conversions
- ✅ Suivi des revenus publicitaires
- ✅ Tableaux de bord analytiques en temps réel
- ✅ Attribution des revenus par source

---

## 🚀 Comment configurer (3 étapes principales)

### 1️⃣ Stripe (Paiements)

**Créer un compte Stripe :**
1. Allez sur https://stripe.com
2. Créez un compte et vérifiez votre entreprise
3. Allez dans **Développeurs** → **Clés API**
4. Copiez votre clé publique (`pk_test_...` pour les tests)

**Créer le produit Premium Pass :**
1. Allez dans **Produits** → **Ajouter un produit**
2. Nom : "Premium Pass"
3. Prix : 3,99 $ USD
4. Type : Paiement unique
5. Créez un **Lien de paiement** (Payment Link)
6. Copiez l'URL du lien de paiement

### 2️⃣ Google AdSense (Publicités)

**Créer un compte AdSense :**
1. Allez sur https://www.google.com/adsense
2. Inscrivez-vous et soumettez votre site
3. Attendez l'approbation (1-3 jours)
4. Copiez votre **ID éditeur** (`ca-pub-...`)

**Créer des unités publicitaires :**
1. Allez dans **Annonces** → **Blocs d'annonces**
2. Créez un bloc pour "Bannière du bas"
3. Type : Annonces display responsives
4. Copiez l'**ID de bloc d'annonce**

### 3️⃣ Google Analytics 4 (Analytics)

**Créer une propriété GA4 :**
1. Allez sur https://analytics.google.com
2. **Admin** → **Créer une propriété**
3. Nom : "Block Blast"
4. Créez un flux de données Web
5. Copiez l'**ID de mesure** (`G-...`)

---

## ⚙️ Configuration de l'environnement

### Créer votre fichier .env

1. Copiez le fichier exemple :
   ```bash
   cp .env.example .env
   ```

2. Remplissez avec vos vraies valeurs :

```env
# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_CLE_ICI
VITE_STRIPE_PREMIUM_PRICE_ID=price_VOTRE_PRICE_ID

# AdSense
VITE_ADSENSE_CLIENT_ID=ca-pub-VOTRE_ID_EDITEUR
VITE_ADSENSE_SLOT_BOTTOM=VOTRE_ID_BLOC_ANNONCE
VITE_ADSENSE_ENABLED=true

# Google Analytics
VITE_GA4_MEASUREMENT_ID=G-VOTRE_MEASUREMENT_ID
VITE_REVENUE_TRACKING_ENABLED=true
```

3. **IMPORTANT :** Ne commitez JAMAIS votre fichier `.env` sur Git !

---

## 🧪 Tester les paiements

### Cartes de test Stripe :

**Paiement réussi :**
- Numéro : `4242 4242 4242 4242`
- Date : N'importe quelle date future (ex: 12/34)
- CVC : N'importe quel code (ex: 123)

**Paiement refusé :**
- Numéro : `4000 0000 0000 0002`

### Flux de test :

1. Ouvrez le jeu → Allez dans la Boutique
2. Cliquez sur "Upgrade to Premium"
3. Cliquez sur "Pay $3.99"
4. Utilisez une carte de test
5. Vérifiez que le Premium Pass s'active
6. Vérifiez que les publicités disparaissent

---

## 💵 Mettre en production

### Avant de lancer :

- [ ] Compte Stripe complètement vérifié
- [ ] Basculez de test à live mode dans Stripe
- [ ] Compte AdSense approuvé
- [ ] Ajoutez une Politique de confidentialité (obligatoire)
- [ ] Ajoutez des Conditions d'utilisation
- [ ] Ajoutez une Politique de remboursement
- [ ] Configurez les variables d'environnement en production
- [ ] Testez tout le flux de paiement

### Déploiement sur Vercel/Netlify :

1. Poussez votre code sur GitHub
2. Connectez à Vercel/Netlify
3. Ajoutez les variables d'environnement dans le tableau de bord
4. Déployez !

---

## 📊 Suivre vos revenus

### Tableau de bord Stripe :
- https://dashboard.stripe.com
- Voyez tous les paiements en temps réel
- Exportez des rapports pour la comptabilité

### Tableau de bord AdSense :
- https://www.google.com/adsense
- Voyez les impressions et revenus publicitaires
- Paiements mensuels quand vous atteignez 100 $

### Google Analytics 4 :
- https://analytics.google.com
- Rapports de monétisation détaillés
- Comportement des utilisateurs et conversions

---

## 📝 Fichiers importants

- **`MONETIZATION_SETUP.md`** - Guide complet en anglais (très détaillé)
- **`.env.example`** - Template des variables d'environnement
- **`src/config/payment.ts`** - Configuration des paiements
- **`src/services/stripe.ts`** - Service Stripe
- **`src/services/ads.ts`** - Service AdSense et Analytics

---

## 🆘 Besoin d'aide ?

**Documentation :**
- Stripe : https://stripe.com/docs
- AdSense : https://support.google.com/adsense
- GA4 : https://support.google.com/analytics

**Guide détaillé :**
Consultez `MONETIZATION_SETUP.md` pour des instructions complètes étape par étape.

---

## 🎯 Prochaines étapes

1. ✅ Suivez ce guide pour configurer Stripe, AdSense et GA4
2. ✅ Créez votre fichier `.env` avec vos vraies clés
3. ✅ Testez les paiements avec les cartes de test
4. ✅ Testez que les publicités s'affichent correctement
5. ✅ Déployez votre jeu
6. ✅ Commencez à gagner de l'argent ! 💰

---

## 💡 Conseils

- **Utilisez les clés de test** pendant le développement
- **Ne partagez jamais** vos clés API ou secrets
- **Ajoutez une politique de confidentialité** avant d'accepter des paiements
- **Testez tout** avant de passer en production
- **Configurez les webhooks Stripe** pour la sécurité maximale
- **Suivez vos revenus** régulièrement

---

## 🎉 C'est parti !

Votre jeu Block Blast est maintenant prêt à générer des revenus réels via :

✅ **Paiements Stripe** - Premium Pass à 3,99 $
✅ **Publicités AdSense** - Revenus publicitaires
✅ **Analytics GA4** - Suivi complet des revenus

**Bonne chance et bon succès avec votre jeu ! 🚀💰🎮**

---

*Pour toute question technique, consultez le guide complet en anglais : `MONETIZATION_SETUP.md`*
