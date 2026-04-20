<script lang="ts">
    let show = $state(false)

    function handleScroll() {
        show = window.scrollY > 300
    }
</script>

<svelte:window onscroll={handleScroll} />

{#if show}
    <button
        onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        class="fixed bottom-6 right-6 w-[30px] h-[30px] bg-transparent border-[3px] border-[#2a5080] hover:border-[#133B6E] rounded-full grid place-items-center transition-all shadow-lg cursor-pointer opacity-50 hover:opacity-80 text-[#2a5080] hover:text-[#133B6E]"
        aria-label="Scroll to top"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
    </button>
{/if}
