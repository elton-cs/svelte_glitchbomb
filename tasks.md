# Glitch Bomb Implementation Tasks

## Phase 1: Core Foundation

### 1. Data Layer Setup
- [x] Create `src/lib/game/types.ts` - Define all TypeScript interfaces
  - GameState, PlayerStats, OrbBag, LevelConfig, MarketplaceState
  - Orb types (Health, Point, Bomb), GamePhase enum
- [x] Create `src/lib/game/constants.ts` - Game configuration constants
  - Level milestones [10,20,30,40,50], level costs [0,15,25,35,45]
  - Starting values, orb costs, victory rewards
- [x] Create `src/lib/game/state.ts` - Reactive state management
  - Global game state with Svelte runes
  - State initialization and reset functions

### 2. Core Game Logic
- [x] Create `src/lib/game/orbs.ts` - Orb system logic
  - `createInitialBag()` - Generate starting orb bag (5/5/5)
  - `pullRandomOrb(bag)` - Random orb selection and consumption
  - `resetConsumedOrbs(bag)` - Level reset functionality
  - `addOrbsToBag(bag, orbs)` - Marketplace purchases
- [x] Create `src/lib/game/economics.ts` - Economic calculations
  - `canAffordGame(moonrocks)` - Validate game entry
  - `canAffordLevel(moonrocks, level)` - Validate level entry  
  - `calculateCashOut(points, levelCost)` - Cash-out calculations
  - `processLevelReward(points)` - Convert points to cheddah
- [x] Create `src/lib/game/levels.ts` - Level management
  - `getLevelMilestone(level)` - Get point requirements
  - `getLevelCost(level)` - Get moonrock costs
  - `checkLevelComplete(points, level)` - Victory condition
  - `checkGameOver(health, orbs)` - Failure conditions

### 3. Utility Functions  
- [x] Create `src/lib/utils/random.ts` - Deterministic randomization
  - `getRandomOrbFromBag(bag)` - Weighted random selection
- [x] Create `src/lib/utils/validation.ts` - Input validation
  - `validatePurchase(cheddah, cost)` - Marketplace validation
- [x] Create `src/lib/game/persistence.ts` - Data persistence
  - `saveMoonrocks(amount)` - Local storage save
  - `loadMoonrocks()` - Local storage load with fallback to 100

## Phase 2: Game Controller

### 4. Game Flow Management
- [x] Create `src/lib/game/gameStates.ts` - State machine
  - GamePhase enum: MENU, LEVEL, MARKETPLACE, GAMEOVER, VICTORY
  - State transition validation
- [x] Create `src/lib/game/game.ts` - Main game controller
  - `startNewGame()` - Initialize game session
  - `enterLevel(level)` - Level entry with cost validation  
  - `pullOrb()` - Execute orb pull and apply effects
  - `completeLevel()` - Level completion processing
  - `cashOutMidLevel()` - Mid-level exit processing
  - `cashOutPostLevel()` - Post-level exit processing
  - `enterMarketplace()` - Marketplace transition
  - `purchaseOrb(type, quantity)` - Marketplace purchases
  - `proceedToNextLevel()` - Continue game progression

## Phase 3: UI Components

### 5. Core UI Components
- [x] Create `src/lib/components/StatsDisplay.svelte` - Stats dashboard
  - Moonrocks, cheddah, health, points display
  - Current level and milestone progress
- [x] Create `src/lib/components/BagView.svelte` - Orb bag interface
  - Display available orbs by type with counts
  - Show consumed orbs (grayed out)
  - Pull orb button with availability state
- [x] Create `src/lib/components/ActionsPanel.svelte` - Game controls
  - Start game button (with cost validation)
  - Cash out buttons (mid-level and post-level)
  - Continue to next level button
- [x] Create `src/lib/components/MarketplaceView.svelte` - Marketplace
  - Available cheddah display
  - Purchase buttons for health/point orbs
  - Purchase quantity controls

### 6. Main Game Interface
- [x] Create `src/lib/components/GameDashboard.svelte` - Main dashboard
  - Single-page layout with all components
  - Responsive grid layout using Tailwind
  - Conditional rendering based on game phase
- [x] Update `src/App.svelte` - Replace template with game
  - Import and render GameDashboard
  - Remove placeholder content

## Phase 4: Integration & Polish

### 7. Game Integration
- [ ] Connect all components to game state
  - Bind UI components to reactive state
  - Implement all button click handlers
  - Add proper state validation for all actions
- [ ] Implement persistence integration
  - Auto-save moonrocks after each game
  - Load moonrocks on app start
- [ ] Add comprehensive error handling
  - Insufficient funds validation
  - Invalid action prevention
  - Edge case handling (empty bag, etc.)

### 8. Testing & Refinement
- [ ] Test complete game flow end-to-end
  - Full 5-level progression
  - Cash-out scenarios (mid-level and post-level)
  - Marketplace purchases and bag updates
  - Edge cases: bankruptcy, empty bag, maximum health
- [ ] Verify all economic calculations
  - Level costs and rewards
  - Cash-out conversions
  - Marketplace transactions
- [ ] UI/UX refinements
  - Clear visual feedback for all states
  - Disabled states for invalid actions  
  - Responsive layout adjustments

## Phase 5: Final Polish

### 9. Code Quality
- [ ] Run type checking: `npm run check`
- [ ] Clean up any TypeScript errors
- [ ] Add JSDoc comments to key functions
- [ ] Remove any unused imports or code

### 10. Documentation
- [ ] Update CLAUDE.md with final architecture notes
- [ ] Add gameplay instructions to README (if requested)

## Implementation Notes

- Keep UI simple and data-heavy - everything visible on one page
- Use minimal Tailwind styling - grays, simple borders, clean layout
- Focus on functionality over aesthetics
- All components should be reactive to state changes
- Validate all user actions before state mutations
- Handle edge cases gracefully (empty bag, insufficient funds, etc.)