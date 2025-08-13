# Glitch Bomb

A bag-building, luck-based game built with Svelte 5 and TypeScript. Manage your orb collection, survive bomb draws, and progress through increasingly challenging levels to earn moonrocks.

## Game Overview

Glitch Bomb is a strategic luck game where you pull orbs from a bag to score points and reach level milestones. Balance risk and reward as you decide when to cash out your progress or push forward for bigger payouts.

## Core Game Features

### 🎯 **Enhanced Orb Bag System**
- Start with 15 orbs (5 Health, 5 Point, 5 Bomb)
- Pull random orbs with different effects
- Track available vs consumed orbs
- **NEW**: 8 different orb types with unique mechanics

### 🏆 **Level Progression** 
- 5 levels with increasing difficulty
- Progressive point milestones: 10 → 20 → 30 → 40 → 50
- Entry costs increase per level [0, 15, 25, 35, 45 moonrocks]
- Level multipliers affect scoring

### 💰 **Economic System**
- Start with 1000 moonrocks (session-based)
- Game entry costs 5 moonrocks
- Cash out mid-level or after completion
- Victory rewards up to 150 total moonrocks

### 🛒 **Advanced Shop System** *(NEW in v0.1.2)*
- **Tier-based Items**: Common (7 items), Rare (4 items), Cosmic (2 items)
- **Dynamic Pricing**: Prices increase 20% with each purchase
- **Strategic Selection**: 3 Common + 2 Rare + 1 Cosmic per level
- **Persistent Pricing**: Price increases persist across levels within same game

### 📊 **Game Dashboard & Logging** *(NEW in v0.1.2)*
- **Horizontal Layout**: Responsive 5-section dashboard design
- **Real-time Game Log**: Track all actions with timestamps
- **Visual Status**: Clear enable/disable states with opacity
- **Consistent Styling**: Black/white theme with tier-based accent colors

## Complete Orb Types

### Original Orbs
- **Health Orbs** ♥: Restore 1-3 health points
- **Point Orbs** ★: Award points toward milestones  
- **Bomb Orbs** 💥: Deal 1-3 damage, end turn
- **Points Per Any Orb** ⚡: Bonus points for each remaining orb
- **Points Per Bomb Pulled** 🎯: Bonus points for bomb count this level
- **Multiplier Orbs** ⭐: Increase level scoring multiplier

### New Orbs *(v0.1.2)*
- **Cheddah Orbs** 🧀: Award cheddah currency directly
- **Moonrocks Orbs** 🌙: Award moonrocks currency directly

## Shop Items by Rarity

### **COMMON** (Cost 5-9 cheddah)
- **POINT 5** - Cost: 5 - +5 PTS
- **CHEDDAH 15** - Cost: 5 - +15 cheddah  
- **4 PTS PER BOMB** - Cost: 6 - +4 per bomb
- **POINT 7** - Cost: 8 - +7 PTS
- **MOONROCKS 15** - Cost: 8 - +15 moonrocks
- **HEALTH 1** - Cost: 9 - +1 HP
- **+0.5X MULTIPLIER** - Cost: 9 - +0.5x mult

### **RARE** (Cost 11-16 cheddah)
- **POINTS 8** - Cost: 11 - +8 PTS
- **POINTS 9** - Cost: 13 - +9 PTS
- **+1.0X MULTIPLIER** - Cost: 14 - +1.0x mult
- **1.5X MULTIPLIER** - Cost: 16 - +1.5x mult

### **COSMIC** (Cost 21-23 cheddah)
- **COSMIC HEALTH** - Cost: 21 - Gain 3 Health
- **COSMIC MOON** - Cost: 23 - Gain 40 Moon Rocks

## Tech Stack

- **Frontend**: Svelte 5 with TypeScript
- **Styling**: Tailwind CSS v4
- **Build**: Vite
- **State**: Reactive runes-based state management

## Development

```bash
npm run dev      # Start development server  
npm run build    # Build for production
npm run preview  # Preview production build
npm run check    # Type checking
```

## Project Structure

```
src/
├── lib/
│   ├── components/     # UI components (5 main sections)
│   ├── game/          # Core game logic
│   └── utils/         # Utility functions
└── assets/            # Static assets
```

## What's New in v0.1.2

### Major Features
- **Complete Shop System Overhaul**: Tier-based items with dynamic pricing
- **New Orb Types**: Cheddah and Moonrocks orbs for direct currency rewards
- **Horizontal Dashboard Layout**: Responsive 5-section design
- **Real-time Game Logging**: Track all player actions with timestamps
- **Enhanced Visual Design**: Consistent black/white theme with tier accents

### Technical Improvements
- **ShopDeck Architecture**: Centralized price tracking and persistence
- **Improved State Management**: Better reactive updates and validation
- **Component Restructuring**: Modular 5-section dashboard architecture
- **Enhanced UI/UX**: Clear visual states and consistent styling

### Quality of Life
- **Action Logging**: Complete history of game interactions
- **Visual Feedback**: Clear enabled/disabled states
- **Better Organization**: Logical component separation
- **Responsive Design**: Works across different screen sizes

---

**Total Shop Items**: 13 (7 Common, 4 Rare, 2 Cosmic)
**Total Orb Types**: 8 unique mechanics
**Game Sessions**: Fully persistent moonrocks with session-based resets