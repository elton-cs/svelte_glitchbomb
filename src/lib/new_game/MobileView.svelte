<script lang="ts">
  import HomeScreen from './views/HomeScreen.svelte';
  import { gameState } from './state/game_state.svelte';
  import { GameView } from './state/types';
</script>

<div class="mobile-view-container">
  {#if gameState.currentView === GameView.Menu}
    <HomeScreen />
  {:else if gameState.currentView === GameView.Shop}
    <!-- Shop view will go here -->
    <div class="p-4">
      <h2 class="text-2xl font-bold">Shop</h2>
    </div>
  {:else if gameState.currentView === GameView.Game}
    <!-- Game view will go here -->
    <div class="p-4">
      <h2 class="text-2xl font-bold">Game</h2>
    </div>
  {:else if gameState.currentView === GameView.Win}
    <!-- Win view will go here -->
    <div class="p-4">
      <h2 class="text-2xl font-bold">Victory!</h2>
    </div>
  {:else if gameState.currentView === GameView.Lose}
    <!-- Lose view will go here -->
    <div class="p-4">
      <h2 class="text-2xl font-bold">Game Over</h2>
    </div>
  {/if}
</div>