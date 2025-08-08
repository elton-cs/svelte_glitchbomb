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
- **Build Tool**: Vite with @sveltejs/vite-plugin-svelte
- **Type Checking**: TypeScript with svelte-check

### Project Structure
```
src/
├── main.ts          # Application entry point
├── App.svelte       # Root component (currently placeholder)
├── app.css          # Global styles
├── lib/             # Reusable components
└── assets/          # Static assets
```

### Game Implementation Requirements

Based on `specs.md`, the game needs to implement:

1. **State Management**: 
   - Persistent stats (moonrocks)
   - Game session stats (cheddah)  
   - Level stats (health, points)

2. **Core Game Systems**:
   - Orb bag management (Health, Point, Bomb orbs)
   - Random orb pulling with consumption tracking
   - 5-level progression system (10→20→30→40→50 points)
   - Marketplace system for purchasing orbs between levels

3. **Economic Systems**:
   - Moonrock costs for game/level entry
   - Cheddah earnings and spending
   - Cash-out mechanics at multiple decision points

4. **UI Components Needed**:
   - Game state display (health, points, moonrocks, cheddah)
   - Orb bag visualization and pulling interface
   - Marketplace for orb purchases
   - Cash-out confirmation dialogs
   - Level progression indicators

### Current State
The project is currently a fresh Svelte template with placeholder content. The actual Glitch Bomb game implementation needs to be built from scratch according to the specifications.

### TypeScript Configuration
- Uses TypeScript project references with separate configs for app and node
- Svelte 5 syntax and APIs
- Vite client types included