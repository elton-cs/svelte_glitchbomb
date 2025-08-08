# Glitch Bomb

A bag-building, luck-based game built with Svelte 5 and TypeScript. Manage your orb collection, survive bomb draws, and progress through increasingly challenging levels to earn moonrocks.

## Game Overview

Glitch Bomb is a strategic luck game where you pull orbs from a bag to score points and reach level milestones. Balance risk and reward as you decide when to cash out your progress or push forward for bigger payouts.

## Core Game Features

### 🎯 **Orb Bag System**
- Start with 15 orbs (5 Health, 5 Point, 5 Bomb)
- Pull random orbs with different effects
- Track available vs consumed orbs
- Advanced orb types with special mechanics

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

### 🛒 **Marketplace**
- Buy Health Orbs (30 moonrocks) 
- Buy Point Orbs (20 moonrocks)
- Available between levels
- Strategic orb management

### 📊 **Game States & UI**
- Single-page dashboard with real-time stats
- Health and progress tracking
- Visual orb bag display
- Confirmation dialogs for major decisions

## Orb Types

- **Health Orbs** ♥: Restore 1-3 health points
- **Point Orbs** ★: Award 3-7 points toward milestones  
- **Bomb Orbs** 💥: Deal 1-3 damage, end turn
- **Points Per Any Orb** ⚡: Bonus points for each orb pulled
- **Points Per Bomb Pulled** 🎯: Bonus points for bomb count this level
- **Multiplier Orbs** ⭐: Increase level scoring multiplier

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
│   ├── components/     # UI components
│   ├── game/          # Core game logic
│   └── utils/         # Utility functions
└── assets/            # Static assets
```
