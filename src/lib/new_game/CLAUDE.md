# new_game Directory

This directory contains a simplified, mobile-first reimplementation of the Glitch Bomb game using modern Svelte 5 architecture with runes-based reactivity.

## Overview

The `new_game` implementation is a streamlined version of the main game that focuses on:
- Mobile-optimized UI design
- Simplified game mechanics (4 orb types: Point, Health, Bomb, Multiplier)
- Modern Svelte 5 syntax with `$state`, `$derived`, and `$effect` runes
- Snake_case naming convention throughout

## Architecture Rules

• **State Management**: All functions that read or modify game state MUST be placed in `state/helpers.ts`
• **Component Purity**: Svelte components and views must NOT contain game logic functions - they must import all needed functions
• **Naming Convention**: ALL variables and function names MUST use snake_case (not camelCase)
• **Type Safety**: Use proper TypeScript types from `state/types.ts` instead of `any`

## Directory Structure

```
new_game/
├── state/
│   ├── types.ts           # Game types and enums
│   ├── game_state.svelte.ts # Reactive game state management
│   └── helpers.ts         # ALL game logic functions go here
├── components/
│   ├── CurrentView.svelte      # View state display
│   ├── GameResult.svelte       # Win/lose messages
│   └── PlaygroundOrbs.svelte   # Orb visualization
├── views/
│   ├── HomeView.svelte    # Menu screen
│   └── GameView.svelte    # Main gameplay interface
└── MobileView.svelte      # Main view router
```

## Integration with Main App

The new_game directory is integrated into the main Svelte app through:
- **PlayerView component**: The main app's Player View tab can display the mobile game
- **Isolated state**: Game state is completely separate from the main game implementation
- **Reusable patterns**: Serves as a testing ground for new UI patterns and game mechanics

## Key Features

• Orb system with categories (Bomb, Health, Point, Multiplier, Special)
• Win/lose conditions with restart functionality
• Playground orb visualization showing upcoming orbs
• Mobile-optimized black/white aesthetic with border-based design
• Reactive progress bars for points and health

## Development Guidelines

• Place ALL game logic in `state/helpers.ts`
• Import functions into components - never define them inline
• Follow snake_case naming consistently
• Use Svelte 5 runes for reactivity
• Maintain mobile-first responsive design principles
• **MANDATORY**: Always commit changes with small and concise git commit messages describing the changes