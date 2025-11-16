# Glitch Bomb

A bag-building, luck-based game built with Svelte 5 and TypeScript. Manage your command collection, survive bomb draws, and progress through increasingly challenging levels to earn moonrocks.

## Game Overview

Glitch Bomb is a strategic luck game where you pull commands from a bag to score points and reach level milestones. Balance risk and reward as you decide when to cash out your progress or push forward for bigger payouts.

**v0.2.0 introduces dual implementations:**
- **Data View**: Original comprehensive dashboard with full feature set and multi-view interface
- **Player View**: New mobile-first game reimplementation optimized for streamlined gameplay

## Core Game Features

### 🎯 **Enhanced Command System**
- Start with 15 commands (1 Health, 3 Point, 5 Bomb, 6 Special)
- Pull random commands with different effects
- **NEW**: Visual square representation with hover tooltips
- **NEW**: 8 different command types with unique mechanics

### 🏆 **Level Progression** 
- 7 levels with increasing difficulty
- Progressive point milestones: 12 → 18 → 28 → 44 → 70 → 100 → 150
- Entry costs per level [10, 1, 2, 4, 6, 9, 13 glitchbytes]
- Level multipliers affect scoring
- **NEW**: Confirmation phase with cash out vs continue choice

### 💰 **Economic System**
- Start with 0 glitchbytes (build up through gameplay)
- Level entry costs: 10, 1, 2, 4, 6, 9, 13 glitchbytes
- Cash out mid-level or after completion (1:1 points to glitchbytes)
- **NEW**: Chips currency accumulates across levels within same game
- **NEW**: 10 glitchbytes restart option from game over screen

### 🛒 **Advanced Shop System** *(NEW in v0.1.2)*
- **Tier-based Items**: Common (7 items), Rare (4 items), Cosmic (2 items)
- **Dynamic Pricing**: Prices increase 20% with each purchase
- **Strategic Selection**: 3 Common + 2 Rare + 1 Cosmic per level
- **Persistent Pricing**: Price increases persist across levels within same game

### 📊 **Multi-View Interface** *(ENHANCED in v0.1.4)*
- **Data View**: Complete 5-section dashboard with all game stats and controls
- **Player View**: Simplified interface (coming soon)
- **Playground**: Development/testing environment with orb selection
- **Real-time Game Log**: Track all actions with timestamps
- **Visual Orb Bag**: Square-based representation with calculation tooltips
- **Profit/Loss Chart**: Real-time performance tracking across game sessions
- **Responsive Design**: Mobile-friendly tab navigation and layouts

## Complete Command Types

### Original Commands
- **Health Commands** ♥: Restore 1-3 health points
- **Point Commands** ★: Award points toward milestones  
- **Bomb Commands** 💥: Deal 1-3 damage, end turn
- **Points Per Any Command** ⚡: Bonus points for each remaining command
- **Points Per Bomb Pulled** 🎯: Bonus points for bomb count this level
- **Multiplier Commands** ⭐: Increase level scoring multiplier

### New Commands *(v0.1.2)*
- **Chip Commands** 💾: Award chips currency directly
- **Glitchbyte Commands** 👽: Award glitchbytes currency directly

### Advanced Modifiers *(v0.2.0)*
- **Points Per Point Orb** 🔗: Bonus points based on point orbs remaining in bag
- **GlitchChips** 💾: Direct chip rewards when orb is pulled
- **Moonrocks** 🌙: Direct moonrocks rewards when orb is pulled
- **Rewind Point** ⏪: Returns lowest-value point orb back to bag
- **Bomb Immunity** 🛡️: 3-turn protection from bomb damage with stacking

## Shop Items by Rarity

### **COMMON** (Cost 5-9 chips)
- **POINT 5** - Cost: 5 - +5 PTS
- **CHIPS 15** - Cost: 5 - +15 chips  
- **4 PTS PER BOMB** - Cost: 6 - +4 per bomb
- **POINT 7** - Cost: 8 - +7 PTS
- **GLITCH BYTES 15** - Cost: 8 - +15 glitchbytes
- **HEALTH 1** - Cost: 9 - +1 HP
- **+0.5X MULTIPLIER** - Cost: 9 - +0.5x mult

### **RARE** (Cost 11-16 chips)
- **POINTS 8** - Cost: 11 - +8 PTS
- **POINTS 9** - Cost: 13 - +9 PTS
- **+1.0X MULTIPLIER** - Cost: 14 - +1.0x mult
- **1.5X MULTIPLIER** - Cost: 16 - +1.5x mult

### **COSMIC** (Cost 21-23 chips)
- **COSMIC HEALTH** - Cost: 21 - Gain 3 Health
- **COSMIC GLITCH BYTES** - Cost: 23 - Gain 40 Glitch Bytes

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
│   ├── components/     # Original UI components (5 main dashboard sections)
│   ├── game/          # Original core game logic
│   ├── new_game/      # Mobile-first reimplementation (v0.2.0)
│   │   ├── components/    # Mobile UI components
│   │   ├── views/         # Game views (Home, Shop, Game, Victory)
│   │   └── state/         # Game state management with helpers
│   └── utils/         # Shared utility functions
└── assets/            # Static assets
```

## What's New in v0.2.0

### 🚀 **Complete Mobile Game Reimplementation** *(NEW)*
- **New Game Architecture**: Complete mobile-first reimplementation in `src/lib/new_game/` using modern Svelte 5 runes
- **Player View Integration**: Access the new mobile game through the "Player View" tab in the main application
- **Snake Case Convention**: Consistent snake_case naming throughout the new implementation for better code clarity
- **Mobile-Optimized UI**: 400px max-width design specifically optimized for mobile devices with vertical layouts

### 🎯 **Enhanced Modifier System** *(EXPANDED)*
- **11 Modifier Types**: Expanded from 6 to 11 modifier types including new strategic options:
  - **PointsPerPointOrb**: Awards points based on point orbs remaining in bag
  - **GlitchChips**: Direct chip currency rewards when orb is pulled
  - **Moonrocks**: Direct moonrocks currency rewards when orb is pulled
  - **RewindPoint**: Returns lowest-value point orb back to bag
  - **BombImmunity**: 3-turn protection from bomb damage with stacking support
- **Advanced Status Effects**: Bomb immunity system with turn-based countdown and visual indicators
- **Intelligent Calculations**: All point calculations now use Math.floor for consistent integer results

### 💰 **Moonrocks Economy Revolution** *(NEW)*
- **Persistent Currency**: Moonrocks replace glitchbytes as the primary persistent currency across game sessions
- **Pay-Upfront Model**: Level costs (10 moonrocks for level 1) deducted when entering shop, not when leaving
- **Cash Out System**: Convert accumulated points to moonrocks at 1:1 ratio during gameplay
- **Economic Balance**: Restart games cost 10 moonrocks (same as starting new), game over results in full loss

### 🛒 **Sophisticated Shop Redesign** *(ENHANCED)*
- **16 Total Items**: 9 Common, 4 Rare, 3 Cosmic items with strategic variety
- **Dynamic Pricing**: 20% price increases persist across levels within same game session
- **Visual Shop Redesign**: Card-based layout with descriptive item names instead of rarity-based naming
- **ChipIcon Integration**: Custom SVG chip icons replace text representations throughout shop interface
- **Affordability Feedback**: Clear visual indicators for purchasable vs unaffordable items

### 🎮 **Enhanced Mobile Game Experience**
- **Circular Orb Visualization**: Converted square orb displays to circles for better mobile aesthetics
- **Pulled Orbs Timeline**: Horizontal scrollable display showing chronological order of pulled orbs
- **Visual Health/Bomb Displays**: Custom SVG-based vertical health and bomb counters
- **Auto-Scroll Features**: Automatically scroll to show latest pulled orb for better user experience
- **Status Effects Display**: Real-time bomb immunity and other effect indicators

### 🎨 **User Interface Improvements**
- **Popup Game Results**: Victory/loss screens now overlay the game view instead of replacing it
- **Interactive Result Screens**: Game over popups include restart and return to menu buttons
- **Button Standardization**: Consistent black/white button theming with hover states across entire application
- **Mobile Layout Optimization**: Flexible layouts that work seamlessly across different screen sizes
- **Enhanced Visual Hierarchy**: Better spacing, typography, and component organization

### 🏆 **7-Level Progression System** *(MAINTAINED)*
- **Level Progression**: Maintained 7-level system with victory screen at completion
- **Shop Between Levels**: Purchase modifiers between each level for strategic progression
- **Balanced Difficulty**: Progressive challenges while maintaining mobile-friendly gameplay

### 🔧 **Technical Architecture Improvements**
- **Modern Svelte 5**: Full utilization of `$state`, `$derived`, and `$effect` runes for better reactivity
- **Clean Code Architecture**: Strict separation between components and game logic in `state/helpers.ts`
- **Type Safety**: Comprehensive TypeScript type system with proper interfaces and enums
- **Component Reusability**: Modular component design with reusable Button, ChipIcon, and display components
- **State Management**: Centralized game state management with localStorage persistence for moonrocks

### 🎯 **Quality of Life Enhancements**
- **Visual Command Categories**: Color-coded orb categories (Bomb, Health, Point, Multiplier, Special)
- **Progress Visualization**: Real-time progress bars and status displays
- **Consistent Iconography**: Unified emoji and icon system throughout the interface
- **Responsive Design**: Optimized for both mobile and desktop viewing
- **Error Prevention**: Proper validation and affordability checks throughout the game flow

## What's New in v0.1.9

### 🎯 **Matrix Disarray System** *(NEW)*
- **Difficulty Escalation**: After completing Level 3, players face a critical decision point
- **Warning Modal**: Dramatic ⚠️ Matrix Disarray warning with looping alarm sound (alarmloop.wav)
- **Persistent Challenge**: Accepting disarray adds a permanent 2-damage bomb orb to the glitch rift for Levels 4-7
- **Strategic Choice**: Players can cache out safely at Level 3 or accept the increased difficulty for higher rewards
- **Visual Drama**: Red-themed warning modal with system overload messaging and thematic terminology

### 🛒 **Shop System Terminology Updates**
- **Simplified Naming**: All shop items that provide points (including DANGER items) now display as "POINTS"
- **Consistent Interface**: Streamlined shop item names for better clarity and user experience
- **Maintained Functionality**: All underlying mechanics remain the same, only display names updated

### 📊 **Enhanced Command Log System**
- **Improved Notation**: Changed "/C" to "/RC" (Remaining Commands) for better clarity
- **Visual Consistency**: Updated command log formatting to use consistent notation across all point calculations
- **Better Readability**: Enhanced command pull descriptions with clearer multiplier and calculation displays

### 🎨 **Visual Interface Improvements**
- **Chip Icon Integration**: Replaced "B" text with custom chip SVG icons in the Glitch Rift view
- **Consistent Iconography**: Better visual consistency across all chip/bits displays
- **Enhanced Color Coding**: Improved visual distinction between available and consumed commands

### 🔧 **Technical Improvements**
- **State Persistence**: Matrix Disarray state properly persists across level transitions
- **Audio Integration**: New alarm sound system for dramatic warning moments
- **Component Architecture**: New MatrixDisarrayWarning component with proper cleanup and audio management
- **Game Balance**: Maintained existing difficulty curve while adding optional increased challenge path

## What's New in v0.1.8

### 🎵 **Complete Audio System Integration**
- **Background Music**: Looping thematic soundtrack (thepilot.mp3) with automatic user interaction detection
- **Comprehensive Sound Effects**: 10+ unique sound effects for different game actions
  - Click sounds for all button interactions
  - Buy sounds for marketplace purchases  
  - Points bar sound for score increases
  - Bomb explosion sound for health damage
  - Multiplier boost sound for stat increases
  - Special pull sound for currency rewards
  - Level progression sounds (levelup, nextlevel)
  - Endgame sound for dramatic game over moments
- **Smart Audio Logic**: Context-aware sound selection based on game state and action type
- **Volume Balance**: Carefully tuned volume levels for each sound type to create cohesive audio experience

### 🎨 **Visual Identity & Typography Overhaul**  
- **Custom Typography**: Integrated JetBrains Mono font for enhanced code/terminal aesthetic
- **Icon System Refinement**: Consistent use of alien monster emoji (👾) and chip SVG icons throughout
- **Visual Polish**: Updated progress bar styling, improved font sizing, and enhanced visual hierarchy

### 📊 **Enhanced Command History System**
- **Complete Log Formatter Rewrite**: Comprehensive categorization system with color-coded command types
  - Health commands: Red highlighting with proper HP notation
  - Point commands: Green highlighting with multiplier context
  - Bomb commands: Orange highlighting with damage indication
  - System messages: Cyan highlighting for game state changes
  - Shop purchases: Orange highlighting with item and cost details
  - Special commands: Yellow highlighting for currency rewards
- **Improved Message Parsing**: Fixed formatting issues and prevented incorrect categorization
- **Game Over Handling**: Proper "SYSTEM > Game over" display instead of uncategorized errors

### 🎯 **User Experience Improvements**
- **Audio Feedback**: Every player action now provides appropriate audio feedback
- **Font Readability**: Increased command history font size from text-xs to text-sm for better visibility
- **Consistent Theming**: Maintained cohesive black and white design with strategic color accents
- **Error Prevention**: Fixed health log formatter to prevent false positive matches

### 🔧 **Technical Audio Infrastructure**
- **AudioManager Class**: Centralized audio management with proper error handling and cleanup
- **Browser Compatibility**: Automatic handling of browser autoplay restrictions
- **Performance Optimization**: Efficient audio preloading and memory management
- **State Integration**: Audio system properly integrated with game state for context-aware sound selection

## What's New in v0.1.7

### 🎯 **Dashboard Layout Optimization**
- **Panel Position Swaps**: Reorganized dashboard for better visual hierarchy
  - Swapped Glitch Rift (Command Bag) with Profit/Loss panel positions
  - Chips and Level elements repositioned in Player Stats panel for better balance
- **Improved Information Flow**: More logical arrangement of game data and controls

### 🎮 **Enhanced Actions Panel**
- **Status Bar Integration**: Consolidated phase display and debug controls into single horizontal bar
- **Space Optimization**: Moved phase status to same row as debug button to save vertical space
- **Consistent Theme**: Maintained black and white styling throughout status elements
- **Enhanced Status Messages**: Improved contextual messages with cleaner formatting

### 🛒 **Mod Shop Visual Improvements**
- **Enhanced Balance Display**: Made chip balance more prominent with yellow highlighting
- **Improved Typography**: Balance label matches title font while keeping chip value emphasized
- **Better Visual Hierarchy**: Larger chip icon (md size) and number display for better visibility

### 🎨 **UI Polish & User Experience**
- **Button Interaction Fixes**: Fixed chip icon color inversion on continue button hover
- **Terminology Update**: Renamed "Cash Out" to "Cache Out" for thematic consistency
- **Consistent Theming**: Maintained cohesive black and white design language across all elements

### ⚖️ **Game Balance Refinements**
- **Starting Command Adjustment**: Reduced starting "Points Per Any Command" from 2 to 1 for better balance
- **Improved Early Game**: More strategic decision-making with adjusted starting configuration

### 🔧 **Technical Improvements**
- **Layout Efficiency**: Optimized dashboard space utilization with strategic panel repositioning
- **Consistent Styling**: Unified status bar design with action button theme
- **Enhanced Visual Feedback**: Better hover states and interaction responses throughout UI

## What's New in v0.1.6

### 🎮 **Terminology & Visual Identity Overhaul**
- **Command System**: Rebranded "orbs" to "commands" throughout the interface
- **Chip Currency**: Renamed "bits" to "chips" for clearer game terminology
- **Alien Monster Emoji**: Replaced all glitchbytes references with 👽 alien monster emoji
- **Chip Icon**: Introduced custom SVG chip icon ⚙️ to replace gear emoji for better visual consistency
- **Favicon Update**: Replaced default Vite favicon with alien monster emoji for brand consistency

### 🎯 **Interface Layout & UX Improvements**
- **Top Bar Integration**: Moved glitchbytes display to prominent top bar with game title
- **Panel Reorganization**: Reordered dashboard sections for better information hierarchy
  - Top row: Actions | Player Stats | Command Bag (formerly Orb Bag)
  - Bottom row: Mod Shop | P/L Chart | Game Log
- **Responsive Design**: Implemented flexible layouts optimized for both mobile and desktop
- **Glitch Rift Display**: Enhanced command visualization with better category ordering (bomb, health, points, mult, special)
- **Clean Empty States**: Removed 'NONE' placeholder boxes, grey out empty category titles instead

### 🛒 **Enhanced Shop Experience**
- **Card Layout Optimization**: Fixed 2x3 grid with improved spacing and sizing
- **Balance Display**: Added prominent "BALANCE:" prefix in mod shop header
- **Visual Card Improvements**: Enhanced shop item cards with inner command display and category colors
- **Hover State Refinements**: Improved card interaction states and disabled card handling
- **Space Utilization**: Moved balance to header row to maximize shop display area

### ⚡**Game Balance Updates**
- **Combo Command Boost**: Increased combo points per any command from 1 to 2 points for better progression
- **Command Log Revamp**: Complete overhaul of action history display and formatting
- **Dev Tools Integration**: Streamlined development controls into glitch bytes bar

### 🎨 **Quality of Life Enhancements**
- **Consumed Command Visualization**: Always show consumed commands instead of empty placeholders
- **Layout Constraints**: Prevented Command Log from expanding panels with proper height constraints
- **Button Improvements**: Enhanced claim and reset button layouts with better text display
- **Mobile Responsiveness**: Improved flex layouts for various screen sizes

### 🔧 **Technical Improvements**
- **Consistent Iconography**: Standardized emoji usage throughout the interface
- **Layout Stability**: Fixed panel expansion issues and improved responsive behavior
- **Visual Hierarchy**: Better spacing, alignment, and color consistency across all sections
- **Performance Optimization**: Improved hover states and card interaction responsiveness

## What's New in v0.1.5

### 🎮 **Enhanced Game Balance & Progression**
- **Expanded Level System**: Now 7 levels instead of 5, with progressive difficulty scaling
- **Rebalanced Progression**: New point milestones (12 → 18 → 28 → 44 → 70 → 100 → 150)
- **Restructured Economy**: Level costs reduced and rebalanced [10, 1, 2, 4, 6, 9, 13 GB]
- **Starting Configuration**: Increased points per bomb orbs from 1 to 4 for better early game balance
- **Zero Starting Glitchbytes**: Players now start with 0 GB and earn through gameplay

### 🎯 **Advanced Orb Bag Interface**
- **Vertical Column Layout**: Space-efficient columnar display with emoji headers
- **Color-Coded Categories**: 
  - Green fonts for all point-giving orbs (Points, Combo, Danger)
  - Yellow fonts for Special orbs category
  - Blue fonts for Multiplier orbs
- **Percentage Display**: Shows each orb category as percentage of total available orbs
- **Smart Orb Notation**: Enhanced notation system (number for points, number/C for combo, number/B for bomb-pulled)
- **Visual Grouping**: Points, Combo, and Danger orbs consolidated into single POINTS category
- **Special Category**: Chips and Glitchbytes commands combined into unified SPECIAL category with crown emoji (👑)

### 🎨 **Interface Improvements**
- **Consistent Typography**: Larger, more readable fonts across orb bag display
- **Enhanced Visual Hierarchy**: Better spacing and alignment for improved readability
- **Crown Iconography**: Special orbs section uses crown emoji for premium feel
- **Standardized Display**: GB notation consistent throughout interface
- **Improved Placeholder Text**: "NONE" displayed in all caps for better visibility
- **Column Color Consistency**: Available/total counts use matching category colors

### 🔧 **Technical Enhancements**
- **Configuration-Based Orbs**: All starting orb counts now use GAME_CONFIG values instead of hardcoded numbers
- **Better Code Organization**: Cleaner separation between orb categories and display logic
- **Responsive Layout**: Improved mobile-friendly column layouts
- **Performance Optimizations**: More efficient orb grouping and percentage calculations

## What's New in v0.1.4

### 📊 **Performance Tracking System**
- **Profit/Loss Chart**: Real-time graph tracking performance across all levels within a game session
- **Dynamic Scaling**: Chart scales based on level milestones for better visualization
- **Cumulative Cost Tracking**: Accurate profit/loss calculation including all level entry costs
- **Visual Performance Feedback**: Black background with white borders for clear data visualization

### 🛒 **Enhanced Shop Experience**
- **Purchase Count Badges**: Visual indicators showing how many times each item has been purchased
- **Smart Badge Positioning**: Bottom-left corner placement with hover color flip effects
- **Improved Button Layout**: Two-column design with vertical price display to prevent overflow
- **Inline Pricing**: Strikethrough base cost displayed alongside current price for space efficiency
- **Font Size Optimization**: Larger fonts for better readability and visual balance

### 🎯 **Orb Bag Improvements**  
- **Calculation Display**: Header shows real-time calculation summaries for special orbs
- **Interactive Tooltips**: Hover over orbs to see detailed point calculations
- **Single Column Layout**: Cleaner visual hierarchy with right-aligned orb squares
- **Instructional Text**: Helpful placeholder text when no calculations are available
- **Smart Tooltip Positioning**: Tooltips positioned to avoid panel border cutoffs

### 🎨 **UI Polish & Accessibility**
- **Emoji Integration**: Moon (🌙) and floppy disk (💾) emojis replace text in key UI elements
- **Enhanced Grid Layouts**: 2x3 grids for player stats with thicker progress bars for better visibility
- **Responsive Typography**: Increased font sizes across actions panel and shop buttons
- **Consistent Spacing**: Reduced padding and optimized layouts for better space utilization
- **Disabled State Styling**: Purchase count badges match button disabled states

### 🧪 **Playground Mode Enhancements**
- **Complete Testing Environment**: Full orb selection and stat tracking capabilities
- **Glitchbytes Integration**: 500 default glitchbytes for comprehensive testing
- **Compact Orb Selector**: Space-efficient layout for better user experience
- **State Machine Fixes**: Resolved invalid states and improved reset functionality

### 🔧 **Technical Improvements**
- **Chart Overflow Prevention**: Proper boundary handling for profit/loss visualization
- **Orb Type Display**: Reusable components with improved layout consistency
- **Responsive Design**: Better handling of window resize events
- **Performance Optimization**: Efficient chart rendering and state management

## What's New in v0.1.3

### 🎮 **Game Flow & Player Experience**
- **Confirmation Phase System**: New phase between level completion and marketplace with choice to cash out or continue
- **Player Commitment Logic**: Once committed to next level, cash out is disabled in marketplace
- **Restart Button**: Quick restart from game over screen for 10 glitchbytes (no menu navigation needed)
- **Enhanced Cash Out**: Removed double penalty - mid-level cash out now gives full points value

### 💰 **Economic System Improvements**
- **Chips Accumulation**: Chips now properly accumulates across levels instead of resetting
- **Point Conversion Choice**: Players choose when to convert points to chips (on CONTINUE action)
- **Fair Cash Out Logic**: Consistent 1:1 points-to-glitchbytes conversion for all cash out methods
- **Glitchbytes Preview**: Mid-level cash out button shows accurate glitchbytes gain

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
- **State Persistence**: Proper bits and glitchbytes persistence across game sessions

### 🎯 **Quality of Life**
- **Visual Orb Grouping**: Orbs grouped by type and amount with distinct squares for each variant
- **Calculation Tooltips**: Hover over special orbs to see point calculations
- **Consumed Orb Visualization**: Grayed-out squares show used orbs vs available ones
- **Phase-specific Actions**: Context-aware button availability based on game phase
- **Responsive Tab Design**: Mobile-friendly abbreviations (D, P, PG) for smaller screens

## What's New in v0.1.2

### Major Features
- **Complete Shop System Overhaul**: Tier-based items with dynamic pricing
- **New Command Types**: Chips and Glitchbytes commands for direct currency rewards
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
**Total Command Types**: 8 unique mechanics
**Game Sessions**: Fully persistent glitchbytes with session-based resets