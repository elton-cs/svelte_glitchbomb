<script lang="ts">
  let count: number = $state(0)
  const increment = () => {
    count += 1
  }
</script>

<button 
  onclick={increment}
  class="px-6 py-3 bg-gray-800 border border-transparent rounded-lg text-base font-medium transition-colors hover:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400/50"
>
  count is {count}
</button>
