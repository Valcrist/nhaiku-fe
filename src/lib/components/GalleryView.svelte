<script lang="ts">
  import { goto } from '$app/navigation';
  import { page as currentPage } from '$app/state';
  import { untrack } from 'svelte';
  import {
    ChevronsDown,
    Database,
    Eraser,
    FilterX,
    Globe,
    RotateCcw,
    Search,
    X,
  } from 'lucide-svelte';
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

  const rawQuery = $derived(currentPage.url.searchParams.get('q') ?? '');

  const parsedQuery = $derived.by(() => {
    const tags: Array<{ type: string; slug: string; raw: string }> = [];
    let remaining = rawQuery;
    const tagPattern = /(\w+):"([^"]+)"/g;
    let match;
    while ((match = tagPattern.exec(rawQuery)) !== null) {
      tags.push({ type: match[1], slug: match[2], raw: match[0] });
      remaining = remaining.replace(match[0], '').trim();
    }
    let bare = remaining.replace(/\s+/g, ' ').trim();
    if (bare.startsWith('"') && bare.endsWith('"')) bare = bare.slice(1, -1);
    return { tags, bare };
  });

  let showPanel = $state(untrack(() => !!rawQuery));
  let localBare = $state(untrack(() => parsedQuery.bare));
  let localTags = $state(untrack(() => parsedQuery.tags));

  function buildCurrentQuery() {
    const tagPart = localTags.map((t) => t.raw).join(' ');
    const b = localBare.trim();
    const parts = [tagPart, b ? (b.includes(' ') ? `"${b}"` : b) : ''];
    return parts.filter(Boolean).join(' ');
  }

  function navigate(newQ: string, base?: string) {
    const params = new URLSearchParams(currentPage.url.search);
    if (newQ) params.set('q', newQ);
    else params.delete('q');
    const dest = base ?? (galleryId === 'remote' ? '/r/page/1' : '/page/1');
    goto(`${dest}?${params}`);
  }

  function removeTag(raw: string) {
    localTags = localTags.filter((t) => t.raw !== raw);
  }

  function clearFilters() {
    localTags = [];
  }

  function resetFilters() {
    localTags = parsedQuery.tags;
  }

  function clearBare() {
    localBare = '';
  }

  function searchLocal() {
    navigate(buildCurrentQuery(), '/page/1');
  }

  function searchRemote() {
    navigate(buildCurrentQuery(), '/r/page/1');
  }

  function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
</script>

<div class="min-h-screen text-white">
  <header class="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
    <a
      href={logoHref}
      class="text-lg font-bold tracking-wide text-white transition-colors hover:text-zinc-300"
      >🌸 NHaiku{#if subtitle}<span class="font-normal text-zinc-400">{subtitle}</span
        >{/if}</a
    >
    <button
      onclick={() => (showPanel = !showPanel)}
      class="action-btn"
      title="Toggle search panel"
    ><Search size={16} /></button>
  </header>

  <main class="px-4 py-4">
    <!-- search panel -->
    {#if showPanel}
      <div class="mb-4 rounded-lg bg-[#141926] p-4">
        <h2 class="mb-3 text-sm font-semibold tracking-wide text-zinc-400">Search</h2>
        <div class="mb-3 flex items-center gap-2">
            <input
              class="min-w-0 flex-1 border-b border-zinc-500 bg-transparent text-base leading-snug text-white outline-none"
              style="font-size: 16px"
              bind:value={localBare}
              onkeydown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape')
                  (e.currentTarget as HTMLInputElement).blur();
              }}
            />
            <button onclick={clearBare} class="info-icon-btn" title="Clear"
              ><Eraser size={14} /></button
            >
            <button
              onclick={() => (localBare = parsedQuery.bare)}
              class="info-icon-btn"
              title="Reset"><RotateCcw size={14} /></button
            >
          </div>

        {#if localTags.length > 0}
          <div class="flex flex-wrap gap-1.5 text-[13px]">
            {#each localTags as tag (tag.raw)}
              <div class="flex items-center gap-1 rounded bg-[#1e2a38] px-2 py-1">
                <span class="text-zinc-400">{tag.type}:</span>
                <span class="text-zinc-200">{tag.slug}</span>
                <button
                  onclick={() => removeTag(tag.raw)}
                  class="info-icon-btn ml-1"
                  title="Remove"><X size={11} /></button
                >
              </div>
            {/each}
          </div>
        {/if}

        <div class="mt-3 flex items-center justify-end gap-2">
          <button onclick={resetFilters} class="action-btn" title="Reset filters"
            ><RotateCcw size={16} /></button
          >
          <button onclick={clearFilters} class="action-btn" title="Clear filters"
            ><FilterX size={16} /></button
          >
          <span class="divider">|</span>
          <button onclick={searchLocal} class="action-btn" title="Search local"
            ><Database size={16} /></button
          >
          <button onclick={searchRemote} class="action-btn" title="Search remote"
            ><Globe size={16} /></button
          >
          <span class="divider">|</span>
          <button onclick={scrollToBottom} class="action-btn" title="Scroll to bottom"
            ><ChevronsDown size={16} /></button
          >
        </div>
      </div>
    {/if}

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
          <p class="mt-1 line-clamp-5 text-[13px] leading-snug text-zinc-300">
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

<style>
  .info-icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    background-color: transparent;
    color: #999;
    transition:
      background-color 0.15s,
      color 0.15s;
  }

  .info-icon-btn:hover {
    background-color: #2a5080;
    color: #fff;
  }

  .action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    background-color: #1e2a38;
    color: #ccc;
    transition:
      background-color 0.15s,
      color 0.15s;
  }

  .action-btn:hover {
    background-color: #2a5080;
    color: #fff;
  }


  .divider {
    color: #3f4558;
    padding: 0 2px;
    user-select: none;
  }
</style>
