<script lang="ts">
    import Pagination from './Pagination.svelte'
    import ScrollToTop from './ScrollToTop.svelte'
    import type { GalleryItem } from '$lib/types'

    let {
        items,
        currPage,
        numPages,
        onPageChange,
        logoHref = '/',
        subtitle = ''
    }: {
        items: GalleryItem[]
        currPage: number
        numPages: number
        onPageChange: (page: number) => void
        logoHref?: string
        subtitle?: string
    } = $props()

    let loadingId = $state<number | null>(null)

    function handleCardClick(e: MouseEvent, id: number) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return
        loadingId = id
    }
</script>

<div class="min-h-screen text-white">
    <header class="px-4 py-3 border-b border-zinc-800">
        <a href={logoHref} class="text-lg font-bold tracking-wide text-white hover:text-zinc-300 transition-colors">🌸 NHaiku{#if subtitle}<span class="text-zinc-400 font-normal">{subtitle}</span>{/if}</a>
    </header>

    <main class="px-4 py-4">
        <Pagination {currPage} {numPages} {onPageChange} />

        <div
            class="grid gap-2 justify-center mt-6"
            style="grid-template-columns: repeat(auto-fill, 150px)"
        >
            {#each items as item (item.id)}
                <a href="/g/{item.id}" class="group block" onclick={(e) => handleCardClick(e, item.id)}>
                    <div class="relative overflow-hidden rounded">
                        <img
                            src={item.thumbUrl}
                            alt={item.english_title}
                            width="150"
                            height="225"
                            class="w-full aspect-[2/3] object-cover transition-all duration-200 group-hover:brightness-110"
                            loading="lazy"
                        />
                        {#if loadingId === item.id}
                            <div class="absolute inset-0 flex items-center justify-center bg-black/50">
                                <div class="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                            </div>
                        {/if}
                    </div>
                    <p class="mt-1 text-[13px] text-zinc-300 line-clamp-2 leading-snug">
                        [{item.num_pages}] {item.english_title}
                    </p>
                </a>
            {/each}
        </div>

        <div class="mt-6">
            <Pagination {currPage} {numPages} {onPageChange} />
        </div>
    </main>
</div>

<ScrollToTop />
