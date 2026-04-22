<script lang="ts">
  import { ChevronsUp } from 'lucide-svelte';

  let { opacity = 80 }: { opacity?: number } = $props();

  let show = $state(false);
  let hovered = $state(false);

  function handleScroll() {
    show = window.scrollY > 300;
  }
</script>

<svelte:window onscroll={handleScroll} />

{#if show}
  <button
    onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    class="fixed right-6 bottom-6 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[6px] border-none bg-[#273446] text-[#ccc] shadow-lg transition-[colors,opacity] hover:bg-[#2a5080] hover:text-white"
    style="opacity: {hovered ? 1 : opacity / 100}"
    onmouseenter={() => (hovered = true)}
    onmouseleave={() => (hovered = false)}
    aria-label="Scroll to top"
  >
    <ChevronsUp size={16} />
  </button>
{/if}
