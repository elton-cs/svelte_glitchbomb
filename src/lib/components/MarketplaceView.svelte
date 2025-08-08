<script lang="ts">
  import { purchaseOrb } from '../game/game.js';
  import type { GameState } from '../game/types.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();
  let holdTimeouts: { [key: string]: NodeJS.Timeout | null } = {};
  let progressIntervals: { [key: string]: NodeJS.Timeout | null } = {};
  let progressDelayTimeouts: { [key: string]: NodeJS.Timeout | null } = {};
  let holdProgress: { [key: string]: number } = $state({});
  let mousePosition = $state({ x: 0, y: 0 });
  let activeHold: string | null = $state(null);

  function handleSinglePurchase(orbType: 'health' | 'point') {
    purchaseOrb(gameState, orbType, 1);
  }

  function handleMouseDown(event: MouseEvent, orbType: 'health' | 'point') {
    // Clear any existing timeouts/intervals
    if (holdTimeouts[orbType]) {
      clearTimeout(holdTimeouts[orbType]);
    }
    if (progressIntervals[orbType]) {
      clearInterval(progressIntervals[orbType]);
    }
    if (progressDelayTimeouts[orbType]) {
      clearTimeout(progressDelayTimeouts[orbType]);
    }
    
    // Track mouse position
    mousePosition.x = event.clientX;
    mousePosition.y = event.clientY;
    holdProgress[orbType] = 0;
    activeHold = null; // Clear any existing progress bar
    
    const startTime = Date.now();
    const duration = 1000; // 1 second
    const progressDelay = 300; // 0.3 second delay before showing progress
    
    // Delay before showing progress bar and starting progress
    progressDelayTimeouts[orbType] = setTimeout(() => {
      // Only start if we're still holding (timeout hasn't been cleared)
      if (holdTimeouts[orbType]) {
        activeHold = orbType;
        
        // Update progress every 16ms (~60fps)
        progressIntervals[orbType] = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const adjustedElapsed = Math.max(0, elapsed - progressDelay);
          holdProgress[orbType] = Math.min((adjustedElapsed / duration) * 100, 100);
          
          if (elapsed >= duration + progressDelay) {
            clearInterval(progressIntervals[orbType]!);
            progressIntervals[orbType] = null;
          }
        }, 16);
      }
      progressDelayTimeouts[orbType] = null;
    }, progressDelay);
    
    // Set timeout for hold-to-buy-all (1 second + delay)
    holdTimeouts[orbType] = setTimeout(() => {
      const cost = orbType === 'health' ? gameState.marketplace.healthOrbCost : gameState.marketplace.pointOrbCost;
      const maxQuantity = Math.floor(gameState.playerStats.cheddah / cost);
      if (maxQuantity > 0) {
        purchaseOrb(gameState, orbType, maxQuantity);
      }
      holdTimeouts[orbType] = null;
      activeHold = null;
      holdProgress[orbType] = 0;
    }, 1000 + progressDelay);
  }

  function handleMouseUp(orbType: 'health' | 'point') {
    if (holdTimeouts[orbType]) {
      clearTimeout(holdTimeouts[orbType]);
      holdTimeouts[orbType] = null;
      
      // Only execute single purchase if progress is minimal (< 10%)
      // This prevents accidental purchases when someone starts holding but releases early
      if ((holdProgress[orbType] || 0) < 10) {
        handleSinglePurchase(orbType);
      }
    }
    
    // Clean up all timers and progress
    if (progressIntervals[orbType]) {
      clearInterval(progressIntervals[orbType]);
      progressIntervals[orbType] = null;
    }
    if (progressDelayTimeouts[orbType]) {
      clearTimeout(progressDelayTimeouts[orbType]);
      progressDelayTimeouts[orbType] = null;
    }
    activeHold = null;
    holdProgress[orbType] = 0;
  }

  function handleMouseLeave(orbType: 'health' | 'point') {
    if (holdTimeouts[orbType]) {
      clearTimeout(holdTimeouts[orbType]);
      holdTimeouts[orbType] = null;
    }
    
    // Clean up all timers and progress
    if (progressIntervals[orbType]) {
      clearInterval(progressIntervals[orbType]);
      progressIntervals[orbType] = null;
    }
    if (progressDelayTimeouts[orbType]) {
      clearTimeout(progressDelayTimeouts[orbType]);
      progressDelayTimeouts[orbType] = null;
    }
    activeHold = null;
    holdProgress[orbType] = 0;
  }

  const canPurchaseHealth = $derived(gameState.playerStats.cheddah >= gameState.marketplace.healthOrbCost);
  const canPurchasePoint = $derived(gameState.playerStats.cheddah >= gameState.marketplace.pointOrbCost);

  // Market items - 2 available, 4 locked placeholders
  const marketItems = $derived([
    {
      id: 'health',
      name: 'Health',
      description: '+1 HP',
      cost: gameState.marketplace.healthOrbCost,
      icon: '♥',
      color: 'text-red-500',
      borderColor: 'border-red-500 hover:border-red-700',
      available: true,
      canPurchase: canPurchaseHealth
    },
    {
      id: 'point',
      name: 'Point',
      description: '+5 pts',
      cost: gameState.marketplace.pointOrbCost,
      icon: '★',
      color: 'text-purple-500',
      borderColor: 'border-purple-500 hover:border-purple-700',
      available: true,
      canPurchase: canPurchasePoint
    },
    {
      id: 'locked1',
      name: 'Locked',
      description: '???',
      cost: 0,
      icon: '🔒',
      color: 'text-gray-400',
      bgColor: 'bg-gray-300',
      available: false,
      canPurchase: false
    },
    {
      id: 'locked2',
      name: 'Locked',
      description: '???',
      cost: 0,
      icon: '🔒',
      color: 'text-gray-400',
      bgColor: 'bg-gray-300',
      available: false,
      canPurchase: false
    },
    {
      id: 'locked3',
      name: 'Locked',
      description: '???',
      cost: 0,
      icon: '🔒',
      color: 'text-gray-400',
      bgColor: 'bg-gray-300',
      available: false,
      canPurchase: false
    },
    {
      id: 'locked4',
      name: 'Locked',
      description: '???',
      cost: 0,
      icon: '🔒',
      color: 'text-gray-400',
      bgColor: 'bg-gray-300',
      available: false,
      canPurchase: false
    }
  ]);
</script>

{#if gameState.phase === 'marketplace' && gameState.marketplace.available}
  <div class="bg-white p-3 rounded-lg shadow-sm border">
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-lg font-bold">Marketplace</h2>
      <div class="text-right">
        <div class="text-lg font-bold text-green-600">{gameState.playerStats.cheddah}</div>
        <div class="text-xs text-gray-600">Cheddah</div>
      </div>
    </div>
    
    <!-- 2x3 Grid Layout -->
    <div class="grid grid-cols-2 gap-2">
      {#each marketItems as item}
        <button
          disabled={!item.available || !item.canPurchase}
          onmousedown={item.available ? (e) => handleMouseDown(e, item.id as 'health' | 'point') : undefined}
          onmouseup={item.available ? () => handleMouseUp(item.id as 'health' | 'point') : undefined}
          onmouseleave={item.available ? () => handleMouseLeave(item.id as 'health' | 'point') : undefined}
          class="p-2 rounded font-medium transition-colors select-none flex items-center gap-2 text-left border-2
                 {item.available && item.canPurchase
                   ? `${item.borderColor} bg-white active:scale-95` 
                   : 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'}"
        >
          <div class="text-lg {item.color}">{item.icon}</div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium truncate">{item.name}</div>
            <div class="text-xs opacity-75 truncate">{item.description}</div>
            {#if item.available}
              <div class="text-xs opacity-90">{item.cost} cheddah</div>
            {/if}
          </div>
        </button>
      {/each}
    </div>
    
    <div class="mt-3 text-xs text-gray-500 text-center">
      Click to buy one • Hold 1s to buy max
    </div>
    
    {#if gameState.playerStats.cheddah === 0}
      <p class="text-xs text-gray-500 text-center mt-2">
        No cheddah remaining
      </p>
    {/if}
  </div>
{/if}

<!-- Circular Progress Indicator -->
{#if activeHold}
  <div 
    class="fixed pointer-events-none z-50"
    style="left: {mousePosition.x - 25}px; top: {mousePosition.y - 25}px;"
  >
    <div class="relative w-12 h-12">
      <!-- White background circle -->
      <div class="absolute inset-0 bg-white rounded-full border-2 border-gray-300"></div>
      
      <!-- Progress SVG -->
      <svg class="w-12 h-12 -rotate-90 absolute inset-0" viewBox="0 0 36 36">
        <!-- Progress circle -->
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="{activeHold === 'health' ? '#ef4444' : '#a855f7'}"
          stroke-width="3"
          stroke-dasharray="{holdProgress[activeHold] || 0}, 100"
          stroke-linecap="round"
          class="transition-all duration-75 ease-linear"
        />
      </svg>
      
      <!-- Center icon -->
      <div class="absolute inset-0 flex items-center justify-center text-lg {activeHold === 'health' ? 'text-red-500' : 'text-purple-500'}">
        {activeHold === 'health' ? '♥' : '★'}
      </div>
    </div>
  </div>
{/if}