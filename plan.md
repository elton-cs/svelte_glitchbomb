# Glitch Bomb - Production Architecture Plan

## Overview
This plan outlines a production-ready implementation of Glitch Bomb following best practices, strong TypeScript typing, and composable architecture. The implementation remains framework-agnostic (except for Tailwind CSS) and maintains the existing minimal black/white design with selective orb colors.

## Architecture Principles
- **Strong TypeScript Types**: Every function has explicit input/output types
- **Composable Functions**: Small, single-purpose functions that combine to create features
- **Immutable State Updates**: Never mutate state directly, always return new state
- **Error Handling**: Consistent Result<T, Error> pattern for operations that can fail
- **Testability**: Pure functions with no side effects where possible
- **Minimal Dependencies**: Keep external dependencies to a minimum

## Simplified File Structure
```
src/
├── core/               # Pure game logic (no UI dependencies)
│   ├── types.ts       # All TypeScript types/interfaces
│   ├── config.ts      # Game configuration constants
│   ├── orbs.ts        # Orb system logic
│   ├── economy.ts     # Economic calculations
│   ├── levels.ts      # Level progression logic
│   └── game.ts        # Main game orchestration
├── state/             # State management
│   ├── store.ts       # Central state store
│   └── actions.ts     # State mutation actions
├── ui/                # UI Components (framework-agnostic)
│   ├── components/    # Reusable UI components
│   └── views/         # Page-level views
├── utils/             # Shared utilities
│   ├── result.ts      # Result<T, E> type for error handling
│   └── random.ts      # Random number utilities
└── main.ts           # Application entry point
```

---

## Phase 1: Core Types & Configuration
*Build the foundation with strong types and configuration*

### Task 1.1: Define Result Type for Error Handling
- [ ] Create `utils/result.ts` with Result<T, E> type
- [ ] Add `Ok(value)` and `Err(error)` constructor functions
- [ ] Add `isOk()` and `isErr()` type guards
- [ ] Add `unwrap()`, `unwrapOr(default)`, and `map()` methods

### Task 1.2: Define Core Game Types
- [ ] Create `core/types.ts` file
- [ ] Define `OrbType` enum: `{ Health, Point, Bomb, PointsPerAnyOrb, PointsPerBombPulled, Multiplier }`
- [ ] Define `Orb` interface: `{ id: string, type: OrbType }`
- [ ] Define `OrbCollection` type: `{ available: Orb[], consumed: Orb[] }`
- [ ] Define `OrbBag` type: `Record<OrbType, OrbCollection>`

### Task 1.3: Define Game State Types
- [ ] Add `GamePhase` enum: `{ NotStarted, Playing, Marketplace, GameOver, Victory }`
- [ ] Add `PlayerStats` interface: `{ health: number, points: number, bombsPulled: number }`
- [ ] Add `LevelInfo` interface: `{ current: number, target: number, orbsDrawn: number }`
- [ ] Add `GameState` interface combining all state pieces
- [ ] Add `MarketplaceItem` interface for orb shop items

### Task 1.4: Define Configuration Types
- [ ] Create `core/config.ts` file
- [ ] Define `GameConfig` interface with all game constants
- [ ] Define `LevelConfig` interface: `{ level: number, target: number, entryCost: number }`
- [ ] Create `DEFAULT_CONFIG` constant with all game values
- [ ] Add orb prices, level costs, and reward amounts

### Task 1.5: Create Random Number Utilities
- [ ] Create `utils/random.ts` file
- [ ] Add `randomInt(min, max)` function
- [ ] Add `randomChoice<T>(array: T[])` function
- [ ] Add `shuffleArray<T>(array: T[])` function
- [ ] Add seed-based random for testing (optional)

---

## Phase 2: Core Game Logic
*Implement pure game logic functions without UI dependencies*

### Task 2.1: Implement Orb Factory Functions
- [ ] Create `core/orbs.ts` file
- [ ] Add `createOrb(type: OrbType): Orb` function
- [ ] Add `createInitialBag(): OrbBag` function (5 of each basic orb)
- [ ] Add `countAvailableOrbs(bag: OrbBag): number` function
- [ ] Add `countOrbsByType(bag: OrbBag, type: OrbType): number` function

### Task 2.2: Implement Orb Bag Operations
- [ ] Add `pullRandomOrb(bag: OrbBag): Result<[Orb, OrbBag], string>` function
- [ ] Add `consumeOrb(bag: OrbBag, orb: Orb): Result<OrbBag, string>` function
- [ ] Add `resetOrbs(bag: OrbBag): OrbBag` function (move consumed to available)
- [ ] Add `addOrb(bag: OrbBag, type: OrbType): OrbBag` function
- [ ] Add `hasAvailableOrbs(bag: OrbBag): boolean` function

### Task 2.3: Implement Score Calculation
- [ ] Add `calculateOrbValue(orb: Orb, stats: PlayerStats): number` function
- [ ] Add `applyPointsPerAnyOrb(basePoints: number, count: number): number` function
- [ ] Add `applyPointsPerBombPulled(basePoints: number, bombsPulled: number, count: number): number` function
- [ ] Add `applyMultiplier(points: number, multiplierCount: number): number` function
- [ ] Add `calculateTotalScore(orb: Orb, stats: PlayerStats, bag: OrbBag): number` function

### Task 2.4: Implement Level Progression Logic
- [ ] Create `core/levels.ts` file
- [ ] Add `getLevelConfig(level: number): LevelConfig` function
- [ ] Add `canEnterLevel(moonrocks: number, level: number): boolean` function
- [ ] Add `isLevelComplete(points: number, target: number): boolean` function
- [ ] Add `calculateLevelProgress(points: number, target: number): number` function (percentage)
- [ ] Add `getNextLevelCost(level: number): number` function

### Task 2.5: Implement Economic System
- [ ] Create `core/economy.ts` file
- [ ] Add `calculateCashOut(points: number, target: number, isComplete: boolean): number` function
- [ ] Add `calculateVictoryReward(level: number): number` function
- [ ] Add `canAffordGame(moonrocks: number): boolean` function
- [ ] Add `canAffordOrb(moonrocks: number, type: OrbType): boolean` function
- [ ] Add `getOrbPrice(type: OrbType): number` function

### Task 2.6: Implement Main Game Operations
- [ ] Create `core/game.ts` file
- [ ] Add `startNewGame(moonrocks: number): Result<GameState, string>` function
- [ ] Add `pullOrb(state: GameState): Result<GameState, string>` function
- [ ] Add `cashOut(state: GameState): Result<GameState, string>` function
- [ ] Add `enterNextLevel(state: GameState): Result<GameState, string>` function
- [ ] Add `purchaseOrb(state: GameState, type: OrbType): Result<GameState, string>` function

### Task 2.7: Add Game State Validation
- [ ] Add `validateGameState(state: GameState): Result<GameState, string[]>` function
- [ ] Add `canPullOrb(state: GameState): boolean` function
- [ ] Add `canCashOut(state: GameState): boolean` function
- [ ] Add `canEnterMarketplace(state: GameState): boolean` function
- [ ] Add `isGameOver(state: GameState): boolean` function

---

## Phase 3: State Management
*Create centralized state management system*

### Task 3.1: Create State Store
- [ ] Create `state/store.ts` file
- [ ] Define `Store<T>` interface with `get()`, `set()`, `update()`, `subscribe()` methods
- [ ] Implement `createStore<T>(initial: T): Store<T>` function
- [ ] Create `gameStore: Store<GameState>` with initial state
- [ ] Add `moonrocksStore: Store<number>` for persistent moonrocks

### Task 3.2: Create State Actions
- [ ] Create `state/actions.ts` file
- [ ] Add `initializeGame()` action
- [ ] Add `startGame()` action
- [ ] Add `drawOrb()` action
- [ ] Add `performCashOut()` action
- [ ] Add `proceedToNextLevel()` action

### Task 3.3: Add Marketplace Actions
- [ ] Add `enterMarketplace()` action
- [ ] Add `exitMarketplace()` action
- [ ] Add `buyOrb(type: OrbType)` action
- [ ] Add `canBuyOrb(type: OrbType): boolean` helper
- [ ] Add `getAffordableOrbs(): OrbType[]` helper

### Task 3.4: Add State Selectors
- [ ] Add `selectPlayerStats()` selector
- [ ] Add `selectOrbBag()` selector
- [ ] Add `selectCurrentLevel()` selector
- [ ] Add `selectGamePhase()` selector
- [ ] Add `selectMoonrocks()` selector

### Task 3.5: Add Computed State Values
- [ ] Add `selectTotalAvailableOrbs()` computed value
- [ ] Add `selectLevelProgress()` computed value
- [ ] Add `selectPotentialCashOut()` computed value
- [ ] Add `selectCanPullOrb()` computed value
- [ ] Add `selectIsGameActive()` computed value

---

## Phase 4: UI Components
*Build reusable UI components with Tailwind CSS*

### Task 4.1: Create Base UI Components
- [ ] Create `ui/components/Button.ts` with consistent styling
- [ ] Create `ui/components/Card.ts` for content containers
- [ ] Create `ui/components/Badge.ts` for orb counts
- [ ] Create `ui/components/ProgressBar.ts` for level progress
- [ ] Create `ui/components/Modal.ts` for confirmations

### Task 4.2: Create Orb Display Component
- [ ] Create `ui/components/OrbDisplay.ts`
- [ ] Add orb type to color mapping
- [ ] Add orb icon/symbol rendering
- [ ] Add available/consumed state styling
- [ ] Add hover and disabled states

### Task 4.3: Create Stats Display Components
- [ ] Create `ui/components/HealthBar.ts` with heart icons
- [ ] Create `ui/components/PointsDisplay.ts` with current/target
- [ ] Create `ui/components/MoonrocksDisplay.ts` with icon
- [ ] Create `ui/components/LevelIndicator.ts` with progress
- [ ] Create `ui/components/BombCounter.ts` for bombs pulled

### Task 4.4: Create Orb Bag Component
- [ ] Create `ui/components/OrbBag.ts`
- [ ] Add grid layout for orb display
- [ ] Add available orbs section
- [ ] Add consumed orbs section (grayed out)
- [ ] Add orb count badges for each type

### Task 4.5: Create Action Panel Component
- [ ] Create `ui/components/ActionPanel.ts`
- [ ] Add "Pull Orb" button with disabled state
- [ ] Add "Cash Out" button with confirmation
- [ ] Add "Next Level" button when level complete
- [ ] Add "Enter Marketplace" button
- [ ] Add current cash-out value display

### Task 4.6: Create Marketplace Component
- [ ] Create `ui/components/Marketplace.ts`
- [ ] Add orb item grid with prices
- [ ] Add purchase buttons with affordability check
- [ ] Add moonrocks balance display
- [ ] Add "Exit Marketplace" button
- [ ] Add purchase confirmation modal

---

## Phase 5: View Composition
*Compose components into complete views*

### Task 5.1: Create Game Dashboard View
- [ ] Create `ui/views/GameDashboard.ts`
- [ ] Add header with moonrocks and game title
- [ ] Add stats panel (health, points, level)
- [ ] Add orb bag display
- [ ] Add action panel
- [ ] Add responsive layout with Tailwind grid

### Task 5.2: Create Start Screen View
- [ ] Create `ui/views/StartScreen.ts`
- [ ] Add game title and description
- [ ] Add "Start Game" button (costs 5 moonrocks)
- [ ] Add moonrocks balance display
- [ ] Add game rules summary
- [ ] Add insufficient funds message when needed

### Task 5.3: Create Game Over View
- [ ] Create `ui/views/GameOver.ts`
- [ ] Add game over message
- [ ] Add final stats display
- [ ] Add moonrocks earned (if any)
- [ ] Add "Play Again" button
- [ ] Add "Return to Start" button

### Task 5.4: Create Victory View
- [ ] Create `ui/views/Victory.ts`
- [ ] Add victory celebration message
- [ ] Add reward amount (150 moonrocks)
- [ ] Add final stats summary
- [ ] Add "Play Again" button
- [ ] Add victory animation/effects

### Task 5.5: Create Main App View
- [ ] Create `ui/views/App.ts`
- [ ] Add view routing based on game phase
- [ ] Add transition animations between views
- [ ] Add error boundary for graceful failures
- [ ] Add loading states where needed

---

## Phase 6: Integration & Polish
*Wire everything together and add polish*

### Task 6.1: Wire Up State to UI
- [ ] Connect store to UI components
- [ ] Add subscription handlers for state updates
- [ ] Add action dispatchers to buttons
- [ ] Add computed values to displays
- [ ] Test state flow through entire game

### Task 6.2: Add Sound Effects (Optional)
- [ ] Add orb pull sound
- [ ] Add bomb explosion sound
- [ ] Add cash register sound for cash out
- [ ] Add victory fanfare
- [ ] Add button click sounds

### Task 6.3: Add Animations
- [ ] Add orb pull animation
- [ ] Add points counting animation
- [ ] Add health decrease animation
- [ ] Add level progress animation
- [ ] Add marketplace transition

### Task 6.4: Add Keyboard Shortcuts
- [ ] Add 'Space' for pull orb
- [ ] Add 'C' for cash out
- [ ] Add 'M' for marketplace
- [ ] Add 'Enter' for confirmations
- [ ] Add 'Escape' for cancel/back

### Task 6.5: Add Dev Tools
- [ ] Add dev mode toggle (Shift+D)
- [ ] Add moonrocks cheat (+1000)
- [ ] Add instant win cheat
- [ ] Add orb bag reset
- [ ] Add state inspector

### Task 6.6: Add Error Handling
- [ ] Add global error handler
- [ ] Add user-friendly error messages
- [ ] Add retry mechanisms for failed operations
- [ ] Add error logging
- [ ] Add crash recovery from localStorage

---

## Phase 7: Testing
*Ensure everything works correctly*

### Task 7.1: Unit Test Core Logic
- [ ] Test orb bag operations
- [ ] Test score calculations
- [ ] Test level progression
- [ ] Test economic calculations
- [ ] Test game state transitions

### Task 7.2: Test State Management
- [ ] Test store operations
- [ ] Test action dispatchers
- [ ] Test selectors
- [ ] Test computed values
- [ ] Test state persistence

### Task 7.3: Integration Testing
- [ ] Test complete game flow
- [ ] Test marketplace purchases
- [ ] Test cash out scenarios
- [ ] Test game over conditions
- [ ] Test victory conditions

### Task 7.4: UI Testing
- [ ] Test button interactions
- [ ] Test modal confirmations
- [ ] Test responsive layout
- [ ] Test keyboard shortcuts
- [ ] Test accessibility

### Task 7.5: Performance Testing
- [ ] Test with large orb bags
- [ ] Test rapid clicking
- [ ] Test memory usage
- [ ] Test render performance
- [ ] Optimize bottlenecks

---

## Phase 8: Production Preparation
*Prepare for deployment*

### Task 8.1: Build Optimization
- [ ] Configure production build
- [ ] Enable tree shaking
- [ ] Minimize bundle size
- [ ] Optimize assets
- [ ] Add source maps

### Task 8.2: Add Analytics (Optional)
- [ ] Add game start tracking
- [ ] Add level completion tracking
- [ ] Add purchase tracking
- [ ] Add game over tracking
- [ ] Add performance metrics

### Task 8.3: Add Progressive Web App Support
- [ ] Add manifest.json
- [ ] Add service worker
- [ ] Add offline support
- [ ] Add install prompt
- [ ] Add app icons

### Task 8.4: Documentation
- [ ] Add inline code documentation
- [ ] Create API documentation
- [ ] Add deployment guide
- [ ] Add configuration guide
- [ ] Add troubleshooting guide

### Task 8.5: Final Polish
- [ ] Review all user-facing text
- [ ] Ensure consistent styling
- [ ] Fix any console errors/warnings
- [ ] Validate accessibility
- [ ] Cross-browser testing

---

## Implementation Notes

### TypeScript Best Practices
- Use `readonly` for immutable properties
- Use discriminated unions for state variants
- Use branded types for IDs
- Avoid `any`, use `unknown` when needed
- Enable strict mode in tsconfig

### State Management Best Practices
- Never mutate state directly
- Use immutable update patterns
- Keep state normalized
- Derive computed values, don't store them
- Use selectors for state access

### UI Best Practices
- Keep components pure when possible
- Use composition over inheritance
- Extract reusable styles to utilities
- Use semantic HTML
- Ensure keyboard accessibility

### Performance Considerations
- Use memoization for expensive calculations
- Batch state updates
- Use virtual scrolling for large lists
- Lazy load non-critical features
- Profile and optimize render cycles

### Error Handling Strategy
- Use Result<T, E> for operations that can fail
- Provide meaningful error messages
- Log errors for debugging
- Gracefully degrade functionality
- Never crash the entire app

### Testing Strategy
- Test behavior, not implementation
- Use test data builders
- Mock external dependencies
- Test edge cases
- Maintain high test coverage

---

## Success Metrics
- [ ] All game mechanics work as specified
- [ ] No TypeScript errors or warnings
- [ ] 80%+ test coverage
- [ ] Page load under 2 seconds
- [ ] Smooth 60fps gameplay
- [ ] Works on all modern browsers
- [ ] Accessible via keyboard only
- [ ] Mobile responsive
- [ ] No memory leaks
- [ ] Clean, maintainable code