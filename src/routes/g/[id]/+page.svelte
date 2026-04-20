<script lang="ts">
    import ScrollToTop from '$lib/components/ScrollToTop.svelte'
    import type { PageData } from './$types'

    let { data }: { data: PageData } = $props()

    const manga = $derived(data.manga)

    const TAG_TYPE_ORDER = ['tag', 'artist', 'language', 'category']

    const tagGroups = $derived.by(() => {
        const groups = new Map<string, typeof manga.tags>()
        for (const tag of manga.tags) {
            if (!groups.has(tag.type)) groups.set(tag.type, [])
            groups.get(tag.type)!.push(tag)
        }
        const ordered = new Map<string, typeof manga.tags>()
        for (const type of TAG_TYPE_ORDER) {
            if (groups.has(type)) ordered.set(type, groups.get(type)!)
        }
        for (const [type, tags] of groups) {
            if (!ordered.has(type)) ordered.set(type, tags)
        }
        return ordered
    })

    function capitalize(s: string) {
        return s.charAt(0).toUpperCase() + s.slice(1) + 's'
    }

</script>

<svelte:head><title>{manga.title} - NHaiku</title></svelte:head>

<div class="min-h-screen text-white">
    <header class="px-4 py-3 border-b border-zinc-800">
        <a href="/" class="text-lg font-bold tracking-wide text-white hover:text-zinc-300 transition-colors">🌸 NHaiku</a>
    </header>

    <main class="px-4 py-6 max-w-5xl mx-auto">
        <div class="bg-[#1c1f2e] rounded-lg p-6 flex gap-6">
            <div class="shrink-0">
                <button onclick={() => location.reload()} class="cursor-pointer p-0 border-0 bg-transparent block">
                    {#if manga.coverUrl}
                        <img
                            src={manga.coverUrl}
                            alt={manga.title}
                            class="w-48 rounded object-cover"
                        />
                    {:else}
                        <div class="w-48 h-72 bg-zinc-800 rounded flex items-center justify-center text-zinc-600 text-sm">No cover</div>
                    {/if}
                </button>
            </div>

            <div class="flex-1 min-w-0">
                <h1 class="text-xl font-semibold text-white leading-snug">{manga.title}</h1>
                <p class="text-zinc-500 text-sm mt-1">#{manga.media_id}</p>

                <div class="mt-4 space-y-2 text-sm">
                    {#each tagGroups as [type, tags]}
                        <div class="flex gap-2 flex-wrap items-baseline">
                            <span class="text-zinc-400 shrink-0 w-24">{capitalize(type)}:</span>
                            <div class="flex gap-1.5 flex-wrap">
                                {#each tags as tag (tag.id)}
                                    <span class="bg-zinc-700 text-zinc-200 px-2 py-0.5 rounded text-xs">{tag.slug}</span>
                                {/each}
                            </div>
                        </div>
                    {/each}

                    <div class="flex gap-2 items-baseline">
                        <span class="text-zinc-400 shrink-0 w-24">Pages:</span>
                        <span class="text-zinc-200">{manga.pages}</span>
                    </div>
                </div>

                <div class="mt-6 flex gap-3">
                    <button class="flex items-center gap-1.5 bg-rose-700 hover:bg-rose-600 text-white text-sm px-4 py-1.5 rounded transition-colors cursor-pointer">
                        ♥ Votes ({manga.votes})
                    </button>
                    <button class="flex items-center gap-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-sm px-4 py-1.5 rounded transition-colors cursor-pointer">
                        ⬇ Re-index
                    </button>
                </div>
            </div>
        </div>

        <div class="mt-4">
            {#each manga.page_list as page (page.id)}
                <img
                    src={page.imageUrl}
                    alt="Page {page.number}"
                    class="w-full block"
                    loading="lazy"
                />
            {/each}
        </div>
    </main>
</div>

<ScrollToTop />
