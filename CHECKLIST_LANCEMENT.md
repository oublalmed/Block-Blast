# ✅ CHECKLIST DE LANCEMENT - Block Blast

Guide rapide pour déployer et monétiser votre jeu en 1 journée !

---

## 📋 PHASE 1 : DÉPLOIEMENT (30 minutes)

### ☐ Vercel / Netlify
```bash
□ Créer compte sur Vercel.com ou Netlify.com
□ Connecter GitHub
□ Importer le repository "Block-Blast"
□ Configurer la branche: claude/rebuild-block-blast-react-2eS9C
□ Déployer (cliquer "Deploy")
□ Noter l'URL : https://________.vercel.app
□ Tester le jeu en ligne
```

**✅ RÉSULTAT :** Votre jeu est en ligne et accessible partout !

---

## 💳 PHASE 2 : STRIPE (1 heure)

### ☐ Créer Compte Stripe
```bash
□ S'inscrire sur stripe.com
□ Vérifier l'email
□ Remplir informations business
□ Ajouter compte bancaire (pour recevoir l'argent)
```

### ☐ Créer Produit Premium Pass
```bash
□ Aller dans "Products" → "Add product"
□ Nom: Premium Pass
□ Prix: $3.99 USD
□ Type: One time
□ Sauvegarder
```

### ☐ Créer Payment Link
```bash
□ Dans le produit, cliquer "Create payment link"
□ After payment → Redirect to: https://votre-jeu.vercel.app/?success=true&session_id={CHECKOUT_SESSION_ID}
□ Créer le lien
□ Copier l'URL: https://buy.stripe.com/test/______
```

### ☐ Obtenir les Clés API
```bash
□ Aller dans "Developers" → "API keys"
□ Mode: Test (pour l'instant)
□ Copier Publishable key: pk_test_________________
```

### ☐ Configurer le Code
```bash
□ Créer fichier .env dans le projet
□ Ajouter: VITE_STRIPE_PUBLISHABLE_KEY=pk_test_____
□ Modifier src/services/stripe.ts ligne 41
□ Remplacer par votre URL Payment Link
```

### ☐ Déployer avec Stripe
```bash
□ Dans Vercel → Settings → Environment Variables
□ Ajouter: VITE_STRIPE_PUBLISHABLE_KEY
□ Valeur: pk_test_________________
□ Sauvegarder
□ Redéployer (automatique)
```

### ☐ Tester
```bash
□ Aller sur votre jeu en ligne
□ Shop → Upgrade to Premium
□ Carte de test: 4242 4242 4242 4242
□ Vérifier que ça fonctionne !
```

**✅ RÉSULTAT :** Les paiements fonctionnent (mode test) !

---

## 📢 PHASE 3 : GOOGLE ADSENSE (2-3 jours)

### ☐ Créer Compte AdSense
```bash
□ S'inscrire sur google.com/adsense
□ Entrer l'URL de votre jeu
□ Soumettre le site pour approbation
□ Attendre email d'approbation (1-3 jours)
```

### ☐ Créer Unités Publicitaires
```bash
□ Attendre approbation ✅
□ Aller dans "Ads" → "By ad unit"
□ Créer "Bottom Banner" (Display, Responsive)
□ Noter l'ID: ca-pub-________/________
□ Copier juste la partie après le slash: ________
```

### ☐ Configurer le Code
```bash
□ Dans .env, ajouter:
  VITE_ADSENSE_CLIENT_ID=ca-pub-________
  VITE_ADSENSE_SLOT_BOTTOM=________
  VITE_ADSENSE_ENABLED=true
```

### ☐ Déployer avec AdSense
```bash
□ Dans Vercel → Environment Variables
□ Ajouter les 3 variables AdSense
□ Redéployer
```

### ☐ Tester
```bash
□ Attendre 24-48h après déploiement
□ Vérifier que les pubs s'affichent
□ Jouer sans Premium Pass
```

**✅ RÉSULTAT :** Les publicités génèrent des revenus !

---

## 📊 PHASE 4 : GOOGLE ANALYTICS (15 minutes)

### ☐ Créer Propriété GA4
```bash
□ Aller sur analytics.google.com
□ Admin → Create Property
□ Nom: Block Blast
□ Time zone: [Votre zone]
□ Currency: USD
```

### ☐ Créer Flux Web
```bash
□ Ajouter flux → Web
□ URL: https://votre-jeu.vercel.app
□ Créer
□ Noter Measurement ID: G-__________
```

### ☐ Configurer le Code
```bash
□ Dans .env, ajouter:
  VITE_GA4_MEASUREMENT_ID=G-__________
  VITE_REVENUE_TRACKING_ENABLED=true
```

### ☐ Déployer avec Analytics
```bash
□ Dans Vercel → Environment Variables
□ Ajouter les 2 variables GA4
□ Redéployer
```

### ☐ Tester
```bash
□ Dans GA4 → Reports → Realtime
□ Ouvrir votre jeu
□ Vérifier que vous apparaissez en temps réel
```

**✅ RÉSULTAT :** Vous suivez tous vos utilisateurs et revenus !

---

## 📝 PHASE 5 : DOCUMENTS LÉGAUX (1 heure)

### ☐ Politique de Confidentialité
```bash
□ Utiliser freeprivacypolicy.com ou termsfeed.com
□ Générer la politique
□ Créer page /privacy dans votre jeu
□ Ajouter lien dans le footer
```

### ☐ Conditions d'Utilisation
```bash
□ Générer sur termsfeed.com
□ Créer page /terms
□ Ajouter lien dans le footer
```

### ☐ Politique de Remboursement
```bash
□ Créer page /refund
□ Préciser: Remboursement sous 14 jours si problème
□ Email de contact
```

**✅ RÉSULTAT :** Vous êtes conforme légalement !

---

## 🚀 PHASE 6 : PASSER EN LIVE (30 minutes)

### ☐ Stripe Live Mode
```bash
□ Finaliser vérification Stripe (documents d'identité)
□ Toggle de "Test" à "Live" dans Stripe
□ Créer nouveau Payment Link en mode Live
□ Copier nouvelle URL: https://buy.stripe.com/live/______
□ Copier Publishable key Live: pk_live_________
□ Modifier src/services/stripe.ts avec URL Live
□ Modifier variables Vercel avec clé Live
□ Commit et push
```

### ☐ AdSense Finalisé
```bash
□ Vérifier compte approuvé
□ Ajouter informations de paiement
□ Attendre le premier paiement ($100 minimum)
```

### ☐ Tester en Production
```bash
□ Faire un vrai achat avec votre carte
□ Vérifier que l'argent arrive sur Stripe
□ Vérifier que Premium fonctionne
□ Tester toutes les fonctionnalités
```

**✅ RÉSULTAT :** Vous acceptez de vrais paiements !

---

## 📣 PHASE 7 : PROMOTION (En continu)

### ☐ Réseaux Sociaux
```bash
□ Poster sur Reddit: r/WebGames, r/incremental_games
□ Twitter/X avec hashtags #indiegame #mobilegame
□ TikTok avec gameplay
□ YouTube Shorts
```

### ☐ Plateformes de Lancement
```bash
□ Product Hunt (producthunt.com)
□ Indie Hackers (indiehackers.com)
□ Hacker News (news.ycombinator.com)
```

### ☐ SEO et Indexation
```bash
□ Soumettre à Google Search Console
□ Créer sitemap.xml
□ Optimiser meta tags
```

**✅ RÉSULTAT :** Les joueurs arrivent !

---

## 📊 PHASE 8 : SUIVI DES REVENUS

### ☐ Dashboards à Vérifier Quotidiennement

**Stripe Dashboard**
```
□ Vérifier paiements du jour
□ Checker taux de conversion
□ Analyser échecs de paiement
```

**AdSense Dashboard**
```
□ Revenus estimés du jour
□ Impressions et clics
□ CTR et CPC
```

**Google Analytics**
```
□ Utilisateurs actifs
□ Taux de conversion
□ Pages les plus visitées
```

---

## 🎯 OBJECTIFS PAR ÉTAPE

### Semaine 1
```
□ 100+ joueurs
□ 1-2 Premium Pass vendus
□ $5-10 de revenus publicitaires
Total: ~$15
```

### Mois 1
```
□ 1,000+ joueurs
□ 20+ Premium Pass vendus
□ $50+ de revenus publicitaires
Total: ~$130
```

### Mois 3
```
□ 5,000+ joueurs
□ 100+ Premium Pass vendus
□ $300+ de revenus publicitaires
Total: ~$700/mois
```

### Objectif 6 Mois
```
□ 10,000+ joueurs/jour
□ 200+ Premium Pass/mois
□ $1,000+ publicités/mois
Total: ~$1,800/mois 💰
```

---

## ⚠️ PROBLÈMES COURANTS

### Paiement ne fonctionne pas
```
✓ Vérifier URL de redirection dans Stripe
✓ Vérifier variables d'environnement dans Vercel
✓ Vérifier console navigateur (F12)
✓ Tester avec carte de test d'abord
```

### Publicités ne s'affichent pas
```
✓ Attendre 24-48h après activation
✓ Vérifier compte AdSense approuvé
✓ Vérifier variables d'environnement
✓ Tester sans Premium Pass
```

### Analytics ne track pas
```
✓ Vérifier Measurement ID correct
✓ Vérifier variables d'environnement
✓ Désactiver bloqueur de pub
✓ Tester en navigation privée
```

---

## 📞 RESSOURCES D'AIDE

**Support Officiel**
- Stripe: https://support.stripe.com
- AdSense: https://support.google.com/adsense
- Analytics: https://support.google.com/analytics

**Vos Guides**
- `GUIDE_DEPLOIEMENT_MONETISATION.md` - Guide complet détaillé
- `GUIDE_RAPIDE_FR.md` - Guide rapide
- `README.md` - Vue d'ensemble

**Communautés**
- r/gamedev - Conseils de développement
- r/indiegames - Marketing et promotion
- Indie Hackers - Monétisation

---

## ✅ VALIDATION FINALE

Avant de vous considérer "lancé", vérifiez :

```
□ Jeu accessible en ligne
□ Paiements Stripe fonctionnels (mode Live)
□ Publicités AdSense affichées
□ Analytics tracking actif
□ Documents légaux en place
□ Email de support configuré
□ Au moins 1 vrai paiement test réussi
□ Jeu partagé sur 3+ plateformes
□ Premiers utilisateurs réels testent
□ Dashboards de suivi configurés
```

**Quand tout est ✅ : FÉLICITATIONS ! 🎉**

**Votre jeu est officiellement lancé et génère des revenus ! 💰🚀**

---

## 🎮 BON LANCEMENT !

**Temps total estimé :**
- Déploiement : 30 min
- Stripe : 1h
- AdSense : 15 min (+ 2-3j d'approbation)
- Analytics : 15 min
- Documents légaux : 1h
- **Total : ~3h de travail actif + 2-3j d'attente**

**Vous pouvez commencer à gagner de l'argent dans quelques jours ! 💰**
