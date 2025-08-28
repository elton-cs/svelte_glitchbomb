# Glitch Bomb

A bag-building, luck-based game built with Svelte 5 and TypeScript. Manage your command collection, survive bomb draws, and progress through increasingly challenging levels to earn glitchbytes.

## Game Overview

Glitch Bomb is a strategic luck game where you pull commands from a bag to score points and reach level milestones. Balance risk and reward as you decide when to cash out your progress or push forward for bigger payouts.

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
│   ├── components/     # UI components (5 main dashboard sections)
│   ├── game/          # Core game logic
│   └── utils/         # Utility functions
└── assets/            # Static assets
```

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