<script lang="ts">
  import { createInitialPlaygroundState } from '../game/playgroundState.js';
  import PlaygroundOrbSelector from './PlaygroundOrbSelector.svelte';
  import PlaygroundTestingArea from './PlaygroundTestingArea.svelte';
  
  let playgroundState = $state(createInitialPlaygroundState());
</script>

<div class="bg-black p-3">
  <div class="max-w-7xl mx-auto">
    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-120px)]">
      <!-- Left Column: Orb Selection -->
      <div class="h-full">
        <PlaygroundOrbSelector {playgroundState} />
      </div>
      
      <!-- Right Column: Testing Area -->
      <div class="h-full">
        <PlaygroundTestingArea {playgroundState} />
      </div>
    </div>
  </div>
</div>
