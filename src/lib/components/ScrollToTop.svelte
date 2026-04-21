<script lang="ts">
  let show = $state(false);

  function handleScroll() {
    show = window.scrollY > 300;
  }
</script>

<svelte:window onscroll={handleScroll} />

{#if show}
  <button
    onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    class="fixed right-6 bottom-6 grid h-[30px] w-[30px] cursor-pointer place-items-center rounded-full border-[3px] border-[#2a5080] bg-transparent text-[#2a5080] opacity-50 shadow-lg transition-all hover:border-[#133B6E] hover:text-[#133B6E] hover:opacity-80"
    aria-label="Scroll to top"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-3 w-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  </button>
{/if}
