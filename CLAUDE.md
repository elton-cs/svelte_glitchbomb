# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Svelte + TypeScript + Vite project for implementing **Glitch Bomb**, a bag-building, luck-based game. The game specifications are detailed in `specs.md`.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run type checking with svelte-check and TypeScript compiler

## Project Architecture

### Core Stack
- **Frontend**: Svelte 5 with TypeScript
- **Styling**: Tailwind CSS v4 with @tailwindcss/vite plugin
- **Build Tool**: Vite with @sveltejs/vite-plugin-svelte
- **Type Checking**: TypeScript with svelte-check

### Project Structure
```
src/
├── main.ts                      # Application entry point
├── App.svelte                   # Root component - renders GameDashboard
├── app.css                      # Global styles
├── lib/
│   ├── components/              # UI Components
│   │   ├── GameDashboard.svelte # Main dashboard layout
│   │   ├── StatsDisplay.svelte  # Player stats and progress
│   │   ├── BagView.svelte       # Orb bag interface
│   │   ├── ActionsPanel.svelte  # Game control buttons
│   │   └── MarketplaceView.svelte # Orb purchasing interface
│   ├── game/                    # Core Game Logic
│   │   ├── types.ts            # TypeScript interfaces
│   │   ├── constants.ts        # Game configuration
│   │   ├── state.ts            # Reactive state management
│   │   ├── orbs.ts             # Orb bag system
│   │   ├── economics.ts        # Economic calculations
│   │   ├── pricing.ts          # Extensible dynamic pricing system
│   │   ├── levels.ts           # Level management
│   │   ├── gameStates.ts       # Game state machine
│   │   └── game.ts             # Main game controller
│   └── utils/                   # Utility Functions
│       ├── random.ts           # Random number generation
│       └── validation.ts       # Input validation
└── assets/                      # Static assets
```

### Implemented Game Systems

All systems from `specs.md` have been implemented:

1. **State Management** ✅: 
   - Session-only moonrocks (resets to 1000 on refresh)
   - Reactive game state with Svelte 5 runes
   - Proper state transitions and validation

2. **Core Game Systems** ✅:
   - Full orb bag system (15 starting orbs: 5/5/5)
   - Random orb pulling with consumption tracking
   - 5-level progression (10→20→30→40→50 points)
   - Complete marketplace system

3. **Economic Systems** ✅:
   - Game entry cost (5 moonrocks)
   - Level entry costs [0,15,25,35,45]
   - Cash-out mechanics (mid-level and post-level)
   - Victory reward (150 moonrocks total)
   - Extensible dynamic pricing with escalating marketplace costs

4. **UI Components** ✅:
   - Single-page dashboard with all information visible
   - Real-time stats display with progress bars
   - Visual orb bag with availability indicators
   - Marketplace with purchase controls
   - Confirmation dialogs for cash-out actions

### Current State
The project is now a fully functional Glitch Bomb game. All core mechanics have been implemented and tested according to the specifications. The game uses a simple, data-heavy UI with minimal styling focused on functionality.

### TypeScript Configuration
- Uses TypeScript project references with separate configs for app and node
- Svelte 5 syntax and APIs
- Vite client types included

## Development Workflow

**Development Guidelines**: 
1. NEVER use `npm run dev` during development - only use `npm run build` for testing
2. Always run `npm run build` to check for errors before committing any changes
3. Create a simple, one-line commit message and commit immediately after completing any feature or making code changes
4. Use descriptive but concise messages that explain what was changed, not why
5. Follow the existing commit message style - single line only, no multi-line messages