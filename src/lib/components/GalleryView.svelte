<script lang="ts">
  import Pagination from './Pagination.svelte';
  import ScrollToTop from './ScrollToTop.svelte';
  import type { GalleryItem } from '$lib/types';

  let {
    items,
    currPage,
    numPages,
    onPageChange,
    logoHref = '/',
    subtitle = '',
    galleryId = 'local',
  }: {
    items: GalleryItem[];
    currPage: number;
    numPages: number;
    onPageChange: (page: number) => void;
    logoHref?: string;
    subtitle?: string;
    galleryId?: 'local' | 'remote';
  } = $props();

  let loadingId = $state<number | null>(null);

  function handleCardClick(e: MouseEvent, id: number) {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;
    loadingId = id;
  }
</script>

<div class="min-h-screen text-white">
  <header class="border-b border-zinc-800 px-4 py-3">
    <a
      href={logoHref}
      class="text-lg font-bold tracking-wide text-white transition-colors hover:text-zinc-300"
      >🌸 NHaiku{#if subtitle}<span class="font-normal text-zinc-400">{subtitle}</span
        >{/if}</a
    >
  </header>

  <main class="px-4 py-4">
    <Pagination {currPage} {numPages} {onPageChange} />

    <div
      class="mt-6 grid justify-center gap-2"
      style="grid-template-columns: repeat(auto-fill, 150px)"
    >
      {#each items as item (item.id)}
        <a
          href="/g/{item.id}?from={galleryId}"
          class="group block"
          onclick={(e) => handleCardClick(e, item.id)}
        >
          <div class="relative overflow-hidden rounded">
            <img
              src={item.thumbUrl}
              alt={item.english_title}
              width="150"
              height="225"
              class="aspect-[2/3] w-full object-cover transition-all duration-200 group-hover:brightness-110"
              loading="lazy"
            />
            {#if loadingId === item.id}
              <div
                class="absolute inset-0 flex items-center justify-center bg-black/50"
              >
                <div
                  class="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white"
                ></div>
              </div>
            {/if}
          </div>
          <p class="mt-1 line-clamp-2 text-[13px] leading-snug text-zinc-300">
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
