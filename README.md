# Glitch Bomb

A bag-building, luck-based game built with Svelte 5 and TypeScript. Manage your orb collection, survive bomb draws, and progress through increasingly challenging levels to earn moonrocks.

## Game Overview

Glitch Bomb is a strategic luck game where you pull orbs from a bag to score points and reach level milestones. Balance risk and reward as you decide when to cash out your progress or push forward for bigger payouts.

## Core Game Features

### 🎯 **Enhanced Orb Bag System**
- Start with 12 orbs (1 Health, 3 Point, 5 Bomb, 3 Special)
- Pull random orbs with different effects
- **NEW**: Visual square representation with hover tooltips
- **NEW**: 8 different orb types with unique mechanics

### 🏆 **Level Progression** 
- 5 levels with increasing difficulty
- Progressive point milestones: 10 → 20 → 30 → 40 → 50
- Entry costs increase per level [10, 15, 25, 35, 45 moonrocks]
- Level multipliers affect scoring
- **NEW**: Confirmation phase with cash out vs continue choice

### 💰 **Economic System**
- Start with 1000 moonrocks (persistent across sessions)
- Level entry costs: 10, 15, 25, 35, 45 moonrocks
- Cash out mid-level or after completion (1:1 points to moonrocks)
- **NEW**: Cheddah currency accumulates across levels within same game
- **NEW**: 10 moonrocks restart option from game over screen

### 🛒 **Advanced Shop System** *(NEW in v0.1.2)*
- **Tier-based Items**: Common (7 items), Rare (4 items), Cosmic (2 items)
- **Dynamic Pricing**: Prices increase 20% with each purchase
- **Strategic Selection**: 3 Common + 2 Rare + 1 Cosmic per level
- **Persistent Pricing**: Price increases persist across levels within same game

### 📊 **Multi-View Interface** *(ENHANCED in v0.1.3)*
- **Data View**: Complete 5-section dashboard with all game stats and controls
- **Player View**: Simplified interface (coming soon)
- **Playground**: Development/testing environment with orb selection
- **Real-time Game Log**: Track all actions with timestamps
- **Visual Orb Bag**: Square-based representation with calculation tooltips
- **Responsive Design**: Mobile-friendly tab navigation and layouts

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

## What's New in v0.1.3

### 🎮 **Game Flow & Player Experience**
- **Confirmation Phase System**: New phase between level completion and marketplace with choice to cash out or continue
- **Player Commitment Logic**: Once committed to next level, cash out is disabled in marketplace
- **Restart Button**: Quick restart from game over screen for 10 moonrocks (no menu navigation needed)
- **Enhanced Cash Out**: Removed double penalty - mid-level cash out now gives full points value

### 💰 **Economic System Improvements**
- **Cheddah Accumulation**: Cheddah now properly accumulates across levels instead of resetting
- **Point Conversion Choice**: Players choose when to convert points to cheddah (on CONTINUE action)
- **Fair Cash Out Logic**: Consistent 1:1 points-to-moonrocks conversion for all cash out methods
- **Moonrocks Preview**: Mid-level cash out button shows accurate moonrocks gain

### 🎨 **Visual & UI Enhancements**
- **Orb Bag Redesign**: Visual square representation with hover tooltips for calculations
- **Right-aligned Orb Display**: Clean column layout with proper visual hierarchy
- **Tab Navigation**: Three-tab system (Data View, Player View, Playground) with highlighted selection
- **Button Styling**: Consistent white styling for all clickable elements, inverted colors for active states
- **Shop Display**: Compact single-line pricing with strikethrough for original costs

### 🔧 **Technical Fixes & Improvements**
- **Combo Orb Calculation**: Fixed off-by-one error in points calculation
- **Orb Bag State**: Delayed reset until player commits to marketplace (better decision visibility)
- **Shop Item Sorting**: Items now sorted by cost for better UX
- **Playground Mode**: Complete testing environment with orb selection and stat tracking
- **State Persistence**: Proper cheddah and moonrocks persistence across game sessions

### 🎯 **Quality of Life**
- **Visual Orb Grouping**: Orbs grouped by type and amount with distinct squares for each variant
- **Calculation Tooltips**: Hover over special orbs to see point calculations
- **Consumed Orb Visualization**: Grayed-out squares show used orbs vs available ones
- **Phase-specific Actions**: Context-aware button availability based on game phase
- **Responsive Tab Design**: Mobile-friendly abbreviations (D, P, PG) for smaller screens

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