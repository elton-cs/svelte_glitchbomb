<script lang="ts">
  import {
    game_state,
    back_to_menu,
    restart_game,
    enter_shop_and_pay,
    cash_out_after_win,
  } from "../state/game_state.svelte";
  import { get_level_cost, can_afford_level } from "../state/helpers";
  import Button from "./Button.svelte";

  interface Props {
    is_win: boolean;
    points: number;
  }

  let { is_win, points }: Props = $props();

  // Calculate button availability
  let game = $derived(game_state.current_game!);
  let next_level = $derived(game.level + 1);
  let next_level_cost = $derived(get_level_cost(next_level));
  let can_afford_next_level = $derived(
    can_afford_level(game_state.player, next_level),
  );

  // Restart game calculations (level 1 cost)
  let restart_cost = $derived(get_level_cost(1));
  let can_afford_restart = $derived(can_afford_level(game_state.player, 1));
</script>

<div class="bg-black p-6 rounded-lg border-2 border-white">
  <div class="text-center">
    {#if is_win}
      <h2 class="text-4xl font-bold text-green-400 mb-2">VICTORY!</h2>
      <p class="text-white text-lg mb-2">You reached the milestone!</p>
      <div class="bg-yellow-900 border border-yellow-600 rounded p-3 mb-4">
        <p class="text-yellow-300 text-sm">You earned <span class="font-bold">{points} points</span></p>
        <p class="text-yellow-300 text-xs">Cash out for <span class="font-bold">{points} moonrocks</span> or continue to shop</p>
      </div>

      <!-- Win buttons -->
      <div class="space-y-3">
        {#if game.level < 7}
          <!-- For levels 1-6: Next Level or Cash Out -->
          <Button
            onclick={enter_shop_and_pay}
            disabled={!can_afford_next_level}
            size="large"
          >
            {can_afford_next_level
              ? `Next Level (-${next_level_cost} moonrocks)`
              : `Insufficient Moonrocks (-${next_level_cost})`}
          </Button>
          <Button
            onclick={cash_out_after_win}
          >
            Cash Out (+{points} moonrocks)
          </Button>
        {:else}
          <!-- For level 7: Only cash out since game is complete -->
          <Button
            onclick={cash_out_after_win}
            size="large"
          >
            Cash Out (+{points} moonrocks)
          </Button>
        {/if}
      </div>
    {:else}
      <h2 class="text-4xl font-bold text-red-400 mb-2">GAME OVER</h2>
      <p class="text-white text-lg mb-2">Your health reached zero!</p>
      <div class="bg-red-900 border border-red-600 rounded p-3 mb-4">
        <p class="text-red-300 text-sm">All moonrocks spent are lost!</p>
        {#if points > 0}
          <p class="text-red-300 text-xs">You earned <span class="font-bold">{points} points</span> but cannot cash them out</p>
        {:else}
          <p class="text-red-300 text-xs">No points earned this round</p>
        {/if}
      </div>

      <!-- Loss buttons -->
      <div class="space-y-3">
        <Button
          onclick={restart_game}
          disabled={!can_afford_restart}
          size="large"
        >
          {can_afford_restart
            ? `Restart Game (-${restart_cost} moonrocks)`
            : `Insufficient Moonrocks (-${restart_cost})`}
        </Button>

        <Button
          onclick={back_to_menu}
        >
          Back to Menu
        </Button>
      </div>
    {/if}
  </div>
</div>