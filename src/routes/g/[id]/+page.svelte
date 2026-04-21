<script lang="ts">
  import { page } from '$app/state';
  import ScrollToTop from '$lib/components/ScrollToTop.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const manga = $derived(data.manga);

  const TAG_TYPE_ORDER = ['tag', 'artist', 'language', 'category'];

  const tagGroups = $derived.by(() => {
    const groups = new Map<string, typeof manga.tags>();
    for (const tag of manga.tags) {
      if (!groups.has(tag.type)) groups.set(tag.type, []);
      groups.get(tag.type)!.push(tag);
    }
    const ordered = new Map<string, typeof manga.tags>();
    for (const type of TAG_TYPE_ORDER) {
      if (groups.has(type)) ordered.set(type, groups.get(type)!);
    }
    for (const [type, tags] of groups) {
      if (!ordered.has(type)) ordered.set(type, tags);
    }
    return ordered;
  });

  function capitalize(s: string) {
    const word = s.charAt(0).toUpperCase() + s.slice(1);
    return word.endsWith('y') ? word.slice(0, -1) + 'ies' : word + 's';
  }
</script>

<svelte:head><title>{manga.title} - NHaiku</title></svelte:head>

<div class="min-h-screen text-white">
  <header class="border-b border-zinc-800 px-4 py-3">
    <a
      href={page.url.searchParams.get('from') === 'remote'
        ? '/r/page/1'
        : page.url.searchParams.get('from') === 'local'
          ? '/page/1'
          : '/'}
      class="text-lg font-bold tracking-wide text-white transition-colors hover:text-zinc-300"
      >🌸 NHaiku</a
    >
  </header>

  <main class="mx-auto max-w-5xl px-4 py-6">
    <div class="flex gap-6 rounded-lg bg-[#1c1f2e] p-6">
      <div class="shrink-0">
        <button
          onclick={() => location.reload()}
          class="block cursor-pointer border-0 bg-transparent p-0"
        >
          {#if manga.coverUrl}
            <img
              src={manga.coverUrl}
              alt={manga.title}
              class="w-48 rounded object-cover"
            />
          {:else}
            <div
              class="flex h-72 w-48 items-center justify-center rounded bg-zinc-800 text-sm text-zinc-600"
            >
              No cover
            </div>
          {/if}
        </button>
      </div>

      <div class="min-w-0 flex-1">
        <h1 class="text-xl leading-snug font-semibold text-white">{manga.title}</h1>
        <p class="mt-1 text-sm text-zinc-500">#{manga.media_id}</p>

        <div class="mt-4 space-y-2 text-sm">
          {#each tagGroups as [type, tags]}
            <div class="flex items-start gap-2">
              <span class="w-24 shrink-0 pt-0.5 text-zinc-400">{capitalize(type)}:</span
              >
              <div class="flex flex-1 flex-wrap gap-1.5">
                {#each tags as tag (tag.id)}
                  <span class="rounded bg-zinc-700 px-2 py-0.5 text-xs text-zinc-200"
                    >{tag.slug}</span
                  >
                {/each}
              </div>
            </div>
          {/each}

          <div class="flex items-start gap-2">
            <span class="w-24 shrink-0 pt-0.5 text-zinc-400">Pages:</span>
            <span class="text-zinc-200">{manga.pages}</span>
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button
            class="flex cursor-pointer items-center gap-1.5 rounded bg-rose-700 px-4 py-1.5 text-sm text-white transition-colors hover:bg-rose-600"
          >
            ♥ Votes ({manga.votes})
          </button>
          <button
            class="flex cursor-pointer items-center gap-1.5 rounded bg-zinc-700 px-4 py-1.5 text-sm text-white transition-colors hover:bg-zinc-600"
          >
            ⬇ Re-index
          </button>
        </div>
      </div>
    </div>

    <div class="mt-4">
      {#each manga.page_list as page, i (page.id)}
        <div class="relative">
          <img
            src={page.imageUrl}
            alt="Page {page.number}"
            class="block w-full"
            loading="lazy"
          />
          <span
            class="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-bold tracking-widest select-none"
            style="color: black; -webkit-text-stroke: 3px rgba(255,255,255,0.5); paint-order: stroke fill; opacity: 0.5;"
            >{i + 1} / {manga.page_list.length}</span
          >
        </div>
      {/each}
    </div>
  </main>
</div>

<ScrollToTop />
