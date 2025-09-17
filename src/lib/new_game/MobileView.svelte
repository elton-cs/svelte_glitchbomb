<script lang="ts">
  import HomeView from './views/HomeView.svelte';
  import GameViewComponent from './views/GameView.svelte';
  import ShopView from './views/ShopView.svelte';
  import VictoryView from './views/VictoryView.svelte';
  import { game_state } from './state/game_state.svelte';
  import { GameView } from './state/types';
</script>

<div class="mobile-view-container w-full flex justify-center">
  {#if game_state.current_view === GameView.Menu}
    <HomeView />
  {:else if game_state.current_view === GameView.Shop}
    <ShopView />
  {:else if game_state.current_view === GameView.Game}
    <GameViewComponent />
  {:else if game_state.current_view === GameView.Win}
    <!-- Win view will go here -->
    <div class="bg-black p-6 rounded-lg border border-white max-w-md mx-auto">
      <h2 class="text-2xl font-bold text-green-400 text-center">VICTORY!</h2>
    </div>
  {:else if game_state.current_view === GameView.Lose}
    <!-- Lose view will go here -->
    <div class="bg-black p-6 rounded-lg border border-white max-w-md mx-auto">
      <h2 class="text-2xl font-bold text-red-400 text-center">GAME OVER</h2>
    </div>
  {:else if game_state.current_view === GameView.Victory}
    <VictoryView />
  {/if}
</div>