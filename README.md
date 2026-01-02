# 🎮 Block Blast - Professional Mobile Game

A fully-featured, mobile-optimized Block Blast game built with React, TypeScript, and Tailwind CSS. **Ready to generate real revenue** through Stripe payments and Google AdSense!

![Block Blast Game](https://img.shields.io/badge/Game-Block%20Blast-blue)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue)
![Monetization](https://img.shields.io/badge/Monetization-Ready-green)

---

## ✨ Features

### 🎯 Core Gameplay
- **Classic Block Blast Mechanics** - Drag and drop blocks to clear lines
- **50+ Progressive Levels** - Increasing difficulty with star ratings
- **Quick Play Mode** - Endless gameplay for high scores
- **Daily Challenges** - Fresh challenges every day with bonus rewards
- **Power-Ups System** - Undo, Hint, Bomb, and Shuffle power-ups
- **Combo System** - Score multipliers for consecutive clears
- **Sound Effects** - Immersive audio feedback

### 🏆 Progression System
- **Achievement System** - 30+ achievements across 6 categories
- **Badge Collection** - Hidden achievements and special rewards
- **Level Progression** - Stars, targets, and difficulty scaling
- **Best Score Tracking** - Personal records and statistics
- **Coin Economy** - Earn and spend coins on power-ups

### 💎 Premium Features
- **Premium Pass** ($3.99) - One-time purchase via Stripe
  - ✅ Remove all ads
  - ✅ 2x coin rewards
  - ✅ Exclusive block designs
  - ✅ Daily bonus coins
  - ✅ Early access to new features

### 💰 Monetization (Ready to Use!)
- **Stripe Payments** - Accept real credit card payments
- **Google AdSense** - Display ads and earn revenue
- **Google Analytics 4** - Track revenue and conversions
- **Revenue Dashboard** - Monitor earnings in real-time

### 📱 Mobile Optimization
- **Fully Responsive** - Optimized for all screen sizes
- **Touch-Optimized** - Large touch targets and gestures
- **PWA Ready** - Installable as a mobile app
- **Offline Support** - Play without internet connection
- **Safe Area Support** - iPhone notch and navigation bar friendly

### 🎨 User Interface
- **Modern Design** - Glassmorphism and gradient effects
- **Smooth Animations** - Framer Motion powered transitions
- **Dark Theme** - Beautiful dark mode design
- **Visual Feedback** - Particle effects and celebrations
- **Professional Polish** - Production-ready UI/UX

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Block-Blast.git
   cd Block-Blast
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 💵 Monetization Setup

Your game is **ready to generate real revenue**! Follow these guides to configure payments and ads:

### Quick Setup (3 Steps)

1. **Create accounts** (free)
   - Stripe: https://stripe.com
   - Google AdSense: https://google.com/adsense
   - Google Analytics: https://analytics.google.com

2. **Get your API keys** and create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. **Fill in your keys** in `.env`:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   VITE_ADSENSE_CLIENT_ID=ca-pub-your_id
   VITE_GA4_MEASUREMENT_ID=G-your_id
   ```

### 📚 Detailed Guides

- **🇫🇷 French Guide**: [`GUIDE_RAPIDE_FR.md`](./GUIDE_RAPIDE_FR.md)
- **🇬🇧 English Guide**: [`MONETIZATION_SETUP.md`](./MONETIZATION_SETUP.md)

Both guides include:
- ✅ Step-by-step account creation
- ✅ API key configuration
- ✅ Testing with test cards
- ✅ Going live checklist
- ✅ Troubleshooting tips

---

## 🎮 How to Play

1. **Drag blocks** from the bottom tray onto the 9x9 grid
2. **Clear lines** horizontally or vertically to score points
3. **Create combos** by clearing multiple lines at once
4. **Use power-ups** strategically to maximize your score
5. **Complete levels** to unlock new challenges
6. **Collect achievements** and earn rewards!

### Power-Ups

- **↩️ Undo** - Undo your last move (50 coins)
- **💡 Hint** - Show the best placement (30 coins)
- **💣 Bomb** - Clear a 3x3 area (100 coins)
- **🔄 Shuffle** - Get new pieces (75 coins)

---

## 🛠️ Development

### Project Structure

```
Block-Blast/
├── src/
│   ├── components/       # React components
│   │   ├── ads/         # Ad components (AdSense)
│   │   ├── game/        # Game components (Board, Pieces, etc.)
│   │   └── ui/          # UI components (Headers, Modals, etc.)
│   ├── screens/         # Screen components
│   ├── services/        # External services (Stripe, Ads, etc.)
│   ├── store/          # Zustand state management
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── config/         # Configuration files
├── public/             # Static assets
└── docs/              # Documentation
```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion
- **State Management**: Zustand with persist
- **Payments**: Stripe
- **Ads**: Google AdSense
- **Analytics**: Google Analytics 4

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
   VITE_ADSENSE_CLIENT_ID=ca-pub-...
   VITE_GA4_MEASUREMENT_ID=G-...
   ```
4. Deploy! 🚀

### Deploy to Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables
5. Deploy! 🚀

### Other Hosting

Build the project and serve the `dist` folder:
```bash
npm run build
# Serve the dist/ folder with any static host
```

---

## 💰 Revenue Streams

Your game has **3 revenue streams**:

### 1. Premium Pass ($3.99)
- One-time purchase via Stripe
- Removes ads permanently
- Unlocks premium features
- **You keep ~97%** of revenue (Stripe fees ~3%)

### 2. Ad Revenue (Google AdSense)
- Display banner ads to free users
- Earn money per impression/click
- **Typical CPM**: $0.50 - $5.00
- **Monthly payments** when you reach $100

### 3. Power-Up Purchases (Coming Soon)
- Optional: Sell coin packs via Stripe
- Already integrated, just need to enable
- Additional revenue stream

### Revenue Example

With **10,000 daily active users**:
- Premium conversions (2%): 200 × $3.99 = **$798/day**
- Ad impressions (9,800 users): ~**$50-200/day**
- **Potential**: $25k - $30k/month 💰

---

## 📊 Analytics & Tracking

Monitor your game's performance:

### Stripe Dashboard
- Real-time payment tracking
- Revenue reports and exports
- Customer management
- https://dashboard.stripe.com

### Google AdSense
- Ad performance metrics
- Earnings reports
- Optimization suggestions
- https://adsense.google.com

### Google Analytics 4
- User behavior tracking
- Conversion funnels
- Revenue attribution
- Custom event tracking
- https://analytics.google.com

---

## 🎯 Roadmap

- [x] Core gameplay mechanics
- [x] 50+ progressive levels
- [x] Achievement system (30+ achievements)
- [x] Power-ups (Undo, Hint, Bomb, Shuffle)
- [x] Daily challenges
- [x] Premium Pass
- [x] Stripe payment integration
- [x] Google AdSense integration
- [x] Mobile-first responsive design
- [x] PWA support
- [ ] Leaderboards (global rankings)
- [ ] Multiplayer mode
- [ ] Social sharing
- [ ] Custom themes
- [ ] Seasonal events
- [ ] More power-ups

---

## 📝 License & Legal

### Before Going Live

⚠️ **Required Legal Documents**:
1. **Privacy Policy** - Required by law and AdSense
2. **Terms of Service** - Required for payments
3. **Refund Policy** - Required by Stripe
4. **Cookie Policy** - Required for EU users (GDPR)

### Business Setup

Consider:
- Registering as a business (if required in your jurisdiction)
- Setting up proper accounting for taxes
- Consulting with a lawyer and accountant

### Code License

This project is for educational and commercial use. Modify and monetize as you wish!

---

## 🆘 Support & Help

### Documentation
- 📖 [Monetization Guide (English)](./MONETIZATION_SETUP.md)
- 📖 [Guide de Monétisation (Français)](./GUIDE_RAPIDE_FR.md)

### External Resources
- **Stripe Docs**: https://stripe.com/docs
- **AdSense Help**: https://support.google.com/adsense
- **GA4 Help**: https://support.google.com/analytics
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com

### Common Issues

**Ads not showing?**
- Check that `VITE_ADSENSE_ENABLED=true`
- Wait 24-48 hours after creating ad units
- Ensure AdSense account is approved

**Payment not working?**
- Verify Stripe keys are correct
- Check that payment link URL is set
- Use test cards for testing

**Build errors?**
- Run `npm install` to update dependencies
- Clear cache: `rm -rf node_modules .cache dist`
- Reinstall: `npm install`

---

## 🎉 Success Stories

Ready to launch your own Block Blast game and start earning? You have everything you need:

✅ Professional, mobile-optimized game
✅ Real payment processing via Stripe
✅ Ad revenue via Google AdSense
✅ Complete analytics and tracking
✅ PWA support for mobile installation
✅ Production-ready code

**Start earning today! 💰🎮🚀**

---

## 🙏 Credits

Built with:
- React + TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- Stripe
- Google AdSense
- Google Analytics 4

---

## 📧 Contact

Questions or need help? Create an issue or reach out!

**Happy Gaming and Happy Earning! 🎮💰**

---

Made with ❤️ for game developers who want to monetize their passion
