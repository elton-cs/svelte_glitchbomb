<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
</script>

<main class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
  <div class="flex space-x-8 mb-8">
    <a href="https://vite.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#ff3e00aa]" alt="Svelte Logo" />
    </a>
  </div>
  
  <h1 class="text-5xl font-bold mb-8 leading-tight">Vite + Svelte</h1>

  <div class="p-8 mb-6">
    <Counter />
  </div>

  <p class="mb-4">
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer" class="font-medium text-blue-400 hover:text-blue-300 transition-colors">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="text-gray-400">
    Click on the Vite and Svelte logos to learn more
  </p>
</main>
