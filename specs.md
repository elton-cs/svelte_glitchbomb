# Glitch Bomb - Game Specifications

## Overview
Glitch Bomb is a bag-building, luck-based game where players must strategically manage orbs to progress through increasingly challenging levels while balancing risk and reward.

## Player Stats

### Persistent Stats (carry over between games)
- **Moonrocks**: Starting currency for games
  - Initial value: 100
  - Cost per game: 5 moonrocks (initial game entry)
  - Victory reward: 100 moonrocks + Level 5 points (150 total for completing all 5 levels)

### Game Session Stats (reset each game)
- **Cheddah**: In-game currency for purchasing orbs
  - Initial value: 0
  - Earned: Equal to points scored in each completed level
  - Used for: Purchasing orbs in marketplace between levels

### Level Stats (reset each level)
- **Health**: Player's life points
  - Initial value: 5 (at start of each level)
  - Maximum value: 5 (capped)
  - Game over condition: Reaches 0
- **Points**: Score for current level
  - Initial value: 0 (at start of each level)
  - Win condition: Must reach level milestone before health reaches 0

## Game Structure

### Levels and Milestones
The game consists of 5 levels with escalating point requirements:
1. Level 1: 10 points
2. Level 2: 20 points
3. Level 3: 30 points
4. Level 4: 40 points
5. Level 5: 50 points

### Moonrock Costs
- **Game Entry**: 5 moonrocks to start a new game
- **Level Entry**: Additional moonrocks required to enter each level:
  - Level 1: Included in game entry cost
  - Level 2: 15 moonrocks
  - Level 3: 25 moonrocks
  - Level 4: 35 moonrocks
  - Level 5: 45 moonrocks

### Victory Conditions
- **Level Victory**: Reach the point milestone before health reaches 0 and before running out of orbs
- **Game Victory**: Complete all 5 levels
- **Game Loss**: Health reaches 0 OR fail to reach point milestone when no more orbs remain

### Cash-Out Mechanics
Players have strategic exit options at multiple points:

#### Mid-Level Cash-Out
- **Trigger**: Player can quit anytime during a level
- **Conversion**: Points earned convert to moonrocks (1:1 ratio)
- **Cost**: Player loses moonrocks paid to enter that level
- **Effect**: Game ends, return to main menu

#### Post-Level Cash-Out
- **Trigger**: After successfully completing a level
- **Options**: 
  - **Continue**: Proceed to marketplace → next level (traditional path)
  - **Cash-Out**: Convert earned points to moonrocks and end game
- **Conversion**: Points earned convert to moonrocks (1:1 ratio)
- **Effect**: Game ends, return to main menu

## Core Mechanics

### Orb System

#### Starting Orb Bag
Each game begins with a bag containing:
- 5 Health Orbs
- 5 Point Orbs  
- 5 Bomb Orbs
- **Total**: 15 orbs

#### Orb Types and Effects
- **Health Orb**: +1 health (capped at 5 maximum health)
- **Point Orb**: +5 points
- **Bomb Orb**: -2 health (damage)

#### Orb Mechanics
- Orbs are pulled randomly from the bag during gameplay
- Once pulled during a level, orbs are consumed and cannot be pulled again in that level
- Consumed orbs reset and become available again when entering the next level
- New orbs purchased in marketplace are added to the bag for subsequent levels

### Level Gameplay Loop
1. **Level Start**: Health resets to 5, points reset to 0
2. **Orb Pulling Phase**: 
   - Player pulls orbs from bag (random selection)
   - Apply orb effects immediately
   - Consumed orbs are removed from available pool for remainder of level
3. **Level Resolution**:
   - **Success**: Reach point milestone → earn cheddah equal to points scored → proceed to marketplace
   - **Failure**: Health reaches 0 OR run out of orbs before reaching milestone → game over

### Marketplace Phase
- **Trigger**: After successfully completing a level
- **Currency**: Spend cheddah earned from the completed level
- **Available Purchases**: 
  - Health Orbs: 2 cheddah each
  - Point Orbs: 2 cheddah each
- **Effect**: Purchased orbs are added to the bag and available for all subsequent levels

### Game Flow
```
Start Game (-5 moonrocks)
↓
Level 1 (milestone: 10 points)
↓ (if successful)
Choose: Continue OR Cash-Out Points → Moonrocks
↓ (if continue)
Marketplace (spend cheddah earned)
↓
Pay Level 2 Entry (-15 moonrocks)
↓
Level 2 (milestone: 20 points)
↓ (if successful)
Choose: Continue OR Cash-Out Points → Moonrocks
↓ (if continue)
Marketplace
↓
Pay Level 3 Entry (-25 moonrocks)
↓
Level 3 (milestone: 30 points)
↓ (if successful)
Choose: Continue OR Cash-Out Points → Moonrocks
↓ (if continue)
Marketplace
↓
Pay Level 4 Entry (-35 moonrocks)
↓
Level 4 (milestone: 40 points)
↓ (if successful)
Choose: Continue OR Cash-Out Points → Moonrocks
↓ (if continue)
Marketplace
↓
Pay Level 5 Entry (-45 moonrocks)
↓
Level 5 (milestone: 50 points)
↓ (if successful)
Victory (+100 moonrocks + 50 points = 150 total)

Note: Players can also cash-out mid-level at any point
```

## Core Game Mechanics - Clarified

### Orb Pulling
- **Selection**: Random orb pulled from bag
- **Consumption**: Orbs pulled are consumed for the current level only
- **Frequency**: Players can continue pulling orbs until they either:
  - Reach the level's point milestone (success)
  - Health reaches 0 (failure)
  - Run out of orbs in the bag (failure)

### Marketplace Economics
- **Orb Costs**: All orbs cost 2 cheddah each (Health Orbs and Point Orbs)
- **Cheddah Management**: All cheddah is reset to 0 at the start of each marketplace phase
- **Purchasing**: Players must spend all earned cheddah in the current marketplace or lose it

### Bag State Management
- **Level Reset**: All consumed orbs become available again when starting a new level
- **Marketplace Additions**: New purchased orbs are added to the bag and available for subsequent levels
- **Bag Composition**: Each level starts with the full bag (original orbs + all previously purchased orbs)

## Strategic Implications

### Risk/Reward Balance
- **Early Cash-Out vs Progression**: Players must weigh immediate moonrock gains against potential for larger rewards
- **Level Entry Costs**: Escalating costs create higher stakes for later levels
- **Insufficient Funds**: Players may be forced to cash-out if they can't afford next level entry

### Economic Pressure
- **Total Investment**: Full game completion requires 125 moonrocks (5+15+25+35+45) vs 150 moonrock reward (25 moonrock profit)
- **Break-Even Points**: Each level offers +5 moonrock profit increment, making progression increasingly rewarding
- **Bankruptcy Risk**: Poor early performance could strand players without enough moonrocks for future games

## Technical Considerations
- Random number generation for orb pulls
- Bag state management (available vs consumed orbs)
- Player progression persistence (moonrocks)
- UI for bag contents, current stats, marketplace, and cash-out options
- Game state serialization for save/load functionality
- Moonrock sufficiency validation before level entry
- Point-to-moonrock conversion calculations
- Cash-out confirmation dialogs to prevent accidental exits