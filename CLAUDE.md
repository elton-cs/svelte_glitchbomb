# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start development server (Vite + HMR)
npm run build    # Build for production
npm run preview  # Preview production build
npm run check    # Type checking with svelte-check and TypeScript
```

## Project Architecture

This is **Glitch Bomb**, a bag-building luck-based game built with Svelte 5, TypeScript, and Tailwind CSS v4. The game features orb collection mechanics, level progression, and an economic system with moonrocks currency.

### Core Architecture

- **Framework**: Svelte 5 with runes-based reactivity
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite plugin)
- **Build Tool**: Vite with TypeScript support
- **State Management**: Reactive state using Svelte runes ($state, $derived, etc.)

### Key Directory Structure

```
src/lib/
├── components/          # Svelte UI components (10 components)
│   ├── GameDashboard.svelte    # Main game container (5-section horizontal layout)
│   ├── ActionsPanel.svelte     # Game action buttons
│   ├── PlayerStatsSection.svelte
│   ├── OrbBagSection.svelte
│   ├── GameLogSection.svelte
│   ├── MarketplaceView.svelte  # Shop system
│   └── Playground*.svelte      # Testing/dev components
├── game/               # Core game logic (TypeScript)
│   ├── types.ts       # All game types and interfaces
│   ├── state.ts       # Game state management and persistence
│   ├── constants.ts   # Game configuration
│   ├── orbs.ts        # Orb system logic
│   ├── economics.ts   # Economic calculations
│   ├── levels.ts      # Level progression
│   ├── shopItems.ts   # Shop/marketplace system
│   └── game.ts        # Main game orchestration
└── utils/             # Shared utilities
    ├── random.ts      # Random number utilities
    └── validation.ts  # Input validation
```

### Game Systems Overview

1. **Orb System**: 8 orb types (health, point, bomb, points_per_anyorb, points_per_bombpulled, multiplier, cheddah, moonrocks)
2. **Level Progression**: 5 levels with increasing difficulty and entry costs
3. **Economic System**: Moonrocks (persistent currency), Cheddah (session currency)
4. **Shop System**: Tier-based items (Common/Rare/Cosmic) with dynamic pricing
5. **State Persistence**: Moonrocks persist in localStorage, game state is session-based

### Important Implementation Details

- **State Management**: Uses Svelte 5 runes ($state, $derived) for reactive state
- **Persistence**: Only moonrocks persist across sessions via localStorage (state.ts:6-22)
- **Component Architecture**: Main dashboard has 5-section horizontal layout
- **Game Phases**: menu → level → marketplace → (gameover|victory)
- **Type Safety**: Comprehensive TypeScript types in types.ts
- **Immutable Updates**: State mutations follow immutable patterns

### Key Files to Understand

- `src/lib/game/types.ts` - Complete type definitions for the entire game
- `src/lib/game/state.ts` - State initialization, persistence, and game log utilities  
- `src/lib/components/GameDashboard.svelte` - Main UI container and game orchestration
- `src/lib/game/game.ts` - Core game logic and state transitions
- `src/lib/game/constants.ts` - All game configuration values

### Testing & Development

- **Type Checking**: Run `npm run check` before commits to catch TypeScript errors
- **MANDATORY Git Workflow**: YOU MUST COMMIT AFTER EVERY CODEBASE CHANGE. This is not optional - it is a strict requirement. Use concise one-line messages and DO NOT sign commits as authored by Claude Code
- **Commit Message Format**: ALWAYS use conventional commit prefixes: `feat:` (new features), `fix:` (bug fixes), `refactor:` (code restructuring), `chore:` (maintenance), `docs:` (documentation), `style:` (formatting), `test:` (testing)
- **Game Balance**: Configuration values are centralized in constants.ts
- **Playground Components**: Development/testing components available for isolated testing
- **Logging**: Game actions are logged with timestamps (max 30 entries)

### Shop System Architecture

The shop uses a "ShopDeck" system where:
- Items are pre-generated with base costs
- Prices increase 20% per purchase (persistent within game session)
- 3 Common + 2 Rare + 1 Cosmic items available per level
- Purchase counts and price increases persist across levels within the same game

### Performance Considerations

- Game log is capped at 30 entries to prevent memory growth
- State updates use reactive patterns optimized for Svelte 5
- Build uses Vite's optimized bundling and tree-shaking
