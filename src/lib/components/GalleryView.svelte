<script lang="ts">
    import Pagination from './Pagination.svelte'
    import ScrollToTop from './ScrollToTop.svelte'
    import type { GalleryItem } from '$lib/types'

    let {
        items,
        currPage,
        numPages,
        onPageChange,
        logoHref = '/'
    }: {
        items: GalleryItem[]
        currPage: number
        numPages: number
        onPageChange: (page: number) => void
        logoHref?: string
    } = $props()
</script>

<div class="min-h-screen text-white">
    <header class="px-4 py-3 border-b border-zinc-800">
        <a href={logoHref} class="text-lg font-bold tracking-wide text-white hover:text-zinc-300 transition-colors">🌸 NHaiku</a>
    </header>

    <main class="px-4 py-4">
        <Pagination {currPage} {numPages} {onPageChange} />

        <div
            class="grid gap-2 justify-center mt-6"
            style="grid-template-columns: repeat(auto-fill, 150px)"
        >
            {#each items as item (item.id)}
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
            <Pagination {currPage} {numPages} {onPageChange} />
        </div>
    </main>
</div>

<ScrollToTop />
