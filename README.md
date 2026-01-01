# 🧩 Block Blast - Mobile Puzzle Game

A modern, feature-rich mobile puzzle game built with React, TypeScript, and Framer Motion. Place blocks strategically to clear lines and score points!

![Block Blast](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎮 Game Modes
- **Quick Play**: Jump right into the action with endless gameplay
- **Level System**: 50+ progressively challenging levels with star ratings
- **Daily Challenges**: Complete daily challenges to earn bonus rewards

### 💎 Premium Pass
- **No Ads**: Enjoy uninterrupted gameplay
- **Double Rewards**: Earn 2x coins from all activities
- **Exclusive Pieces**: Access to special block shapes
- **Daily Bonus**: Receive 100 coins every day

### 📱 Mobile-First Design
- Fully responsive design optimized for mobile devices
- Touch-optimized controls with haptic feedback
- Support for iOS safe areas and notches
- PWA-ready for installation on home screen
- Smooth animations with 60 FPS performance

### 🎯 Game Features
- 8x8 game board with beautiful gradients
- 14+ unique block shapes
- 7 vibrant color themes
- Combo system with visual effects
- Score multipliers and bonuses
- Persistent progress saving
- Best score tracking

### 📊 Progression System
- Earn coins by playing and completing challenges
- Unlock new levels as you progress
- Star rating system (1-3 stars per level)
- Track your statistics and achievements

### 💰 Monetization Ready
- Ad banner integration (AdMob-ready)
- Premium pass subscription system
- Coin-based virtual economy
- In-app purchase placeholders

## 🚀 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - State management with persistence
- **Lucide React** - Beautiful icons

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🛠️ Development

```bash
# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Project Structure

```
Block-Blast/
├── src/
│   ├── components/
│   │   ├── game/          # Game components (Board, Cell, Piece)
│   │   ├── ui/            # UI components (Header, Modals, etc.)
│   │   └── ads/           # Ad components (Banner, Interstitial)
│   ├── screens/           # Main screens (Home, Game, Shop, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Zustand state management
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Game logic and utilities
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── public/                # Static assets
└── package.json
```

## 🎯 Game Mechanics

### How to Play
1. Drag blocks from the tray to the board
2. Place blocks to fill rows or columns
3. Complete lines to clear them and score points
4. Game ends when no pieces can be placed

### Scoring System
- **Piece Placement**: 10 points per block
- **Line Clear**: 100 × lines² points
- **Combo Bonus**: 50 points per consecutive clear

### Level Progression
- Complete levels by reaching target scores
- Earn 1-3 stars based on performance
- Unlock new levels sequentially
- Earn coins as rewards

## 🔧 Configuration

### Ad Integration (AdMob)
To integrate real ads, update `/src/components/ads/AdBanner.tsx`:

```typescript
// Replace placeholder with actual AdMob component
import { AdMobBanner } from '@react-native-admob/admob';

<AdMobBanner
  adUnitID="ca-app-pub-xxxxx/xxxxx"
  servePersonalizedAds={true}
/>
```

### Premium Pass Pricing
Update coin cost in `/src/screens/ShopScreen.tsx`:

```typescript
const PREMIUM_PRICE = 1000; // Current price in coins
```

## 🎨 Customization

### Colors
Edit color schemes in `/src/types/game.ts`:
```typescript
export const COLORS: CellColor[] = [
  'blue', 'orange', 'green', 'purple', 'yellow', 'cyan', 'red'
];
```

### Piece Shapes
Add new pieces in `/src/types/game.ts`:
```typescript
export const PIECE_SHAPES: PieceShape[] = [
  [[0,0]], // Your custom shape
];
```

### Difficulty
Adjust level difficulty in `/src/utils/gameLogic.ts`:
```typescript
const baseScore = 500;
const targetScore = baseScore + (levelId - 1) * 200;
```

## 🌐 Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
npm run build
# Deploy dist/ folder
```

## 📄 License

This project is licensed under the MIT License.

## 🎮 Credits

- Game Design: Inspired by classic block puzzle games
- Icons: [Lucide Icons](https://lucide.dev)
- Fonts: [Fredoka by Google Fonts](https://fonts.google.com/specimen/Fredoka)

## 🚀 Future Enhancements

- [ ] Leaderboards with global rankings
- [ ] Social features (share scores, challenge friends)
- [ ] Additional game modes (timed, limited moves)
- [ ] Power-ups and special abilities
- [ ] Seasonal themes and events
- [ ] Sound effects and background music
- [ ] Achievements and badges system
- [ ] Cloud save synchronization
- [ ] Multiplayer mode
- [ ] React Native mobile app

---

Built with ❤️ using React and TypeScript
