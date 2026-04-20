<script lang="ts">
    import { goto, afterNavigate } from '$app/navigation'
    import Pagination from '$lib/components/Pagination.svelte'
    import type { PageData } from './$types'

    let { data }: { data: PageData } = $props()

    let showScrollTop = $state(false)

    afterNavigate(() => {
        window.scrollTo({ top: 0 })
    })

    function handleScroll() {
        showScrollTop = window.scrollY > 300
    }

    function goToPage(page: number) {
        if (page === data.currPage) return
        goto(`/r/page/${page}`)
    }
</script>

<svelte:window onscroll={handleScroll} />

<div class="min-h-screen text-white">
    <header class="px-4 py-3 border-b border-zinc-800">
        <span class="text-lg font-bold tracking-wide text-white">🌸 NHaiku</span>
    </header>

    <main class="px-4 py-4">
        <Pagination currPage={data.currPage} numPages={data.numPages} onPageChange={goToPage} />

        <div
            class="grid gap-2 justify-center mt-6"
            style="grid-template-columns: repeat(auto-fill, 150px)"
        >
            {#each data.items as item (item.id)}
                <a href="/g/{item.id}" class="group block">
                    <div class="overflow-hidden rounded">
                        <img
                            src={item.thumbUrl}
                            alt={item.english_title}
                            width="150"
                            height="225"
                            class="w-full aspect-[2/3] object-cover transition-all duration-200 group-hover:brightness-110"
                            loading="lazy"
                        />
                    </div>
                    <p class="mt-1 text-[13px] text-zinc-300 line-clamp-2 leading-snug">
                        [{item.num_pages}] {item.english_title}
                    </p>
                </a>
            {/each}
        </div>

        <div class="mt-6">
            <Pagination currPage={data.currPage} numPages={data.numPages} onPageChange={goToPage} />
        </div>
    </main>
</div>

{#if showScrollTop}
    <button
        onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        class="fixed bottom-6 right-6 w-10 h-10 bg-zinc-700 hover:bg-zinc-500 rounded-full flex items-center justify-center text-lg transition-colors shadow-lg"
        aria-label="Scroll to top"
    >↑</button>
{/if}
