<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { untrack } from 'svelte';
  import ScrollToTop from '$lib/components/ScrollToTop.svelte';
  import type { Tag } from '$lib/types';
  import {
    ChevronsDown,
    Database,
    FilterX,
    Globe,
    Heart,
    RefreshCw,
    RotateCcw,
    ThumbsDown,
    ThumbsUp,
    Trash2,
    Eraser,
    X,
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const manga = $derived(data.manga);

  const TAG_TYPE_ORDER = ['artist', 'group', 'tag'];

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

  let currentVotes = $state(untrack(() => data.manga.votes));
  let showNukeModal = $state(false);
  let showVotePanel = $state(false);
  let heartHovered = $state(false);
  let showHeart = $state(false);
  let selectedTags = $state(new Set<string>());
  let titleEditing = $state(false);
  let titleQuery = $state('');
  let localSort = $state<'title' | 'date' | 'pages' | 'votes' | null>(null);
  let remoteSort = $state<
    'date' | 'popular' | 'popular-today' | 'popular-week' | 'popular-month' | null
  >(null);

  function toggleTag(tag: Tag) {
    const key = `${tag.type}:"${tag.slug}"`;
    const next = new Set(selectedTags);
    next.has(key) ? next.delete(key) : next.add(key);
    selectedTags = next;
  }

  function isTagSelected(tag: Tag) {
    return selectedTags.has(`${tag.type}:"${tag.slug}"`);
  }

  function startTitleEdit() {
    if (!titleQuery) titleQuery = manga.title;
    titleEditing = true;
  }

  function commitTitleEdit() {
    titleEditing = false;
  }

  function cancelTitleEdit() {
    titleQuery = '';
    titleEditing = false;
  }

  function buildQueryString() {
    const parts = [...selectedTags];
    const t = titleQuery.trim();
    if (t) parts.push(t.includes(' ') ? `"${t}"` : t);
    return parts.join(' ');
  }

  function getLocalUrl() {
    const params = new URLSearchParams();
    if (localSort) params.set('sort', localSort);
    const q = buildQueryString();
    if (q) params.set('q', q);
    return `/page/1?${params}`;
  }

  function getRemoteUrl() {
    const params = new URLSearchParams();
    if (remoteSort) params.set('sort', remoteSort);
    const q = buildQueryString();
    if (q) params.set('q', q);
    return `/r/page/1?${params}`;
  }

  let suppressNextClick = false;
  let longPressTimer: ReturnType<typeof setTimeout> | null = null;

  function startLongPress(getUrl: () => string) {
    longPressTimer = setTimeout(() => {
      suppressNextClick = true;
      window.open(getUrl(), '_blank');
    }, 1000);
  }

  function cancelLongPress() {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function searchLocal(e: MouseEvent) {
    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }
    const url = getLocalUrl();
    if (e.ctrlKey || e.metaKey) window.open(url, '_blank');
    else goto(url);
  }

  function searchRemote(e: MouseEvent) {
    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }
    const url = getRemoteUrl();
    if (e.ctrlKey || e.metaKey) window.open(url, '_blank');
    else goto(url);
  }

  async function vote(direction: 'up' | 'down') {
    const res = await fetch(`/api/vote/${direction}/${manga.id}`);
    if (res.ok) {
      const result = await res.json();
      const val = Object.values(result)[0];
      if (typeof val === 'number') currentVotes = val;
    }
  }

  function scrollBy(distance: number, duration = 200) {
    const start = window.scrollY;
    const startTime = performance.now();
    function step(now: number) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      window.scrollTo(0, start + distance * eased);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  function handleScroll() {
    showHeart = window.scrollY > 300;
    showVotePanel = false;
  }

  const backHref = $derived(
    page.url.searchParams.get('from') === 'remote' ? '/r/page/1' : '/page/1'
  );

  async function confirmNuke() {
    await fetch(`/api/nuke/${manga.id}`);
    goto(backHref);
  }

  function focusOnMount(node: HTMLElement) {
    node.focus();
  }

  const relatedSections = $derived<
    Array<{ label: string; items: typeof manga.same_artist }>
  >([
    { label: 'Similar Titles', items: manga.similar_titles },
    { label: 'Related Titles', items: manga.related_titles },
    { label: 'Same Artist', items: manga.same_artist },
    { label: 'Same Group', items: manga.same_group },
  ]);

  const LOCAL_SORTS = ['title', 'date', 'pages', 'votes'] as const;
  const REMOTE_SORTS = [
    'date',
    'popular',
    'popular-today',
    'popular-week',
    'popular-month',
  ] as const;
</script>

<svelte:head><title>{manga.title} - NHaiku</title></svelte:head>
<svelte:window onscroll={handleScroll} />

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
    <!-- info panel -->
    <div class="rounded-lg bg-[#141926] p-6">
      {#if titleEditing}
        <div class="flex items-center gap-2">
          <input
            class="min-w-0 flex-1 border-b border-zinc-500 bg-transparent text-xl leading-snug font-semibold text-white outline-none"
            bind:value={titleQuery}
            onkeydown={(e) => {
              if (e.key === 'Enter') commitTitleEdit();
              else if (e.key === 'Escape') cancelTitleEdit();
            }}
            use:focusOnMount
          />
          <button
            class="icon-btn ml-2 shrink-0"
            onclick={() => (titleQuery = '')}
            title="Clear"><Eraser size={14} /></button
          >
          <button
            class="icon-btn shrink-0"
            onclick={() => (titleQuery = manga.title)}
            title="Reset"><RotateCcw size={14} /></button
          >
          <button class="icon-btn shrink-0" onclick={cancelTitleEdit} title="Cancel"
            ><X size={14} /></button
          >
        </div>
      {:else}
        <button
          class="w-full cursor-pointer border-none bg-transparent p-0 text-left text-xl leading-snug font-semibold text-white hover:text-zinc-300"
          onclick={startTitleEdit}>{manga.title}</button
        >
      {/if}
      {#if manga.title_jp}
        <p class="mt-1 text-sm text-zinc-500">{manga.title_jp}</p>
      {/if}

      <div class="mt-4 space-y-2 text-sm">
        {#each tagGroups as [type, tags]}
          <div class="flex items-start gap-2">
            <span class="w-24 shrink-0 pt-0.5 text-zinc-400">{capitalize(type)}:</span>
            <div class="flex flex-1 flex-wrap gap-1.5">
              {#each tags as tag (tag.id)}
                <button
                  onclick={() => toggleTag(tag)}
                  class="tag-pill"
                  class:active={isTagSelected(tag)}>{tag.slug}</button
                >
              {/each}
            </div>
          </div>
        {/each}

        <div class="flex items-start gap-2">
          <span class="w-24 shrink-0 pt-0.5 text-zinc-400">Pages:</span>
          <span class="text-zinc-200">{manga.pages}</span>
        </div>

        <div class="flex items-start gap-2">
          <span class="w-24 shrink-0 pt-0.5 text-zinc-400">Votes:</span>
          <span class="text-zinc-200">{currentVotes}</span>
        </div>
      </div>

      <hr class="my-4 border-zinc-700" />

      <div class="space-y-2 text-sm">
        <div class="flex items-center gap-2">
          <span class="w-24 shrink-0 text-zinc-400">Local Sort:</span>
          <div class="flex flex-wrap gap-1.5">
            {#each LOCAL_SORTS as s}
              <button
                onclick={() => (localSort = localSort === s ? null : s)}
                class="tag-pill"
                class:active={localSort === s}>{s}</button
              >
            {/each}
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="w-24 shrink-0 text-zinc-400">Remote Sort:</span>
          <div class="flex flex-wrap gap-1.5">
            {#each REMOTE_SORTS as s}
              <button
                onclick={() => (remoteSort = remoteSort === s ? null : s)}
                class="tag-pill"
                class:active={remoteSort === s}>{s}</button
              >
            {/each}
          </div>
        </div>
      </div>

      <!-- button panel -->
      <div class="mt-4 flex items-center justify-end gap-2">
        <button onclick={() => (showNukeModal = true)} class="icon-btn"
          ><Trash2 size={16} /></button
        >

        <span class="divider">|</span>

        <button onclick={() => vote('up')} class="icon-btn"
          ><ThumbsUp size={16} /></button
        >
        <button onclick={() => vote('down')} class="icon-btn"
          ><ThumbsDown size={16} /></button
        >

        <span class="divider">|</span>

        <button class="icon-btn"><RefreshCw size={16} /></button>

        <span class="divider">|</span>

        <button onclick={() => (selectedTags = new Set())} class="icon-btn"
          ><FilterX size={16} /></button
        >
        <button
          onclick={searchLocal}
          ontouchstart={() => startLongPress(getLocalUrl)}
          ontouchend={cancelLongPress}
          ontouchmove={cancelLongPress}
          class="icon-btn"><Database size={16} /></button
        >
        <button
          onclick={searchRemote}
          ontouchstart={() => startLongPress(getRemoteUrl)}
          ontouchend={cancelLongPress}
          ontouchmove={cancelLongPress}
          class="icon-btn"><Globe size={16} /></button
        >

        <span class="divider">|</span>

        <button onclick={scrollToBottom} class="icon-btn"
          ><ChevronsDown size={16} /></button
        >
      </div>
    </div>

    <div class="mt-4">
      {#each manga.page_list as page, i (page.id)}
        <div class="relative">
          <button
            type="button"
            class="block w-full cursor-pointer border-none bg-transparent p-0"
            onclick={() => scrollBy(window.innerHeight * 0.8)}
          >
            <img
              src={page.imageUrl}
              alt="Page {page.number}"
              class="pointer-events-none block w-full select-none"
              draggable="false"
              loading="lazy"
            />
          </button>
          <span
            class="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] tracking-widest select-none"
            style="color: black; -webkit-text-stroke: 3px rgba(255,255,255,0.5); paint-order: stroke fill; opacity: 0.5;"
            >{i + 1} / {manga.page_list.length}</span
          >
        </div>
      {/each}
    </div>

    <!-- related sections -->
    {#if manga.similar_titles.length > 0}
      <div class="mt-4 rounded-lg bg-[#1a2235] px-6 py-3">
        <p class="text-center text-base font-semibold tracking-wide text-zinc-400">
          {manga.title}
        </p>
      </div>
    {/if}
    {#each relatedSections as { label, items } (label)}
      {#if items.length > 0}
        <div class="mt-4 rounded-lg bg-[#1a2235] p-6">
          <h2 class="mb-4 text-sm font-semibold tracking-wide text-zinc-400">
            {label}
          </h2>
          <div
            class="grid justify-start gap-2"
            style="grid-template-columns: repeat(auto-fill, 150px)"
          >
            {#each items as item (item.id)}
              <a href="/g/{item.id}" class="group block">
                <div class="relative overflow-hidden rounded">
                  {#if item.thumbUrl}
                    <img
                      src={item.thumbUrl}
                      alt={item.title}
                      width="150"
                      height="225"
                      class="aspect-[2/3] w-full object-cover transition-all duration-200 group-hover:brightness-110"
                      loading="lazy"
                    />
                  {:else}
                    <div class="aspect-[2/3] w-full bg-zinc-800"></div>
                  {/if}
                </div>
                <p class="mt-1 line-clamp-5 text-[13px] leading-snug text-zinc-300">
                  [{item.pages}] {item.title}
                </p>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    {/each}
  </main>
</div>

{#if showNukeModal}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    use:focusOnMount
    onclick={(e) => {
      if (e.target === e.currentTarget) showNukeModal = false;
    }}
    onkeydown={(e) => {
      if (e.key === 'Escape') showNukeModal = false;
    }}
  >
    <div
      class="flex w-full max-w-sm flex-col items-center gap-8 rounded-lg bg-[#141926] p-8 text-white"
    >
      <h2 class="text-center text-base font-bold">
        Are you sure you want to nuke {manga.media_id}?
      </h2>

      <div class="flex flex-col items-center gap-2">
        {#if manga.coverUrl}
          <img
            src={manga.coverUrl}
            alt="Cover"
            class="max-h-64 rounded object-contain"
          />
        {/if}
        <p class="text-center text-sm font-normal text-zinc-400">{manga.title}</p>
      </div>

      <div class="flex gap-4">
        <button onclick={confirmNuke} class="nuke-btn">Confirm</button>
        <button onclick={() => (showNukeModal = false)} class="nuke-btn">Cancel</button>
      </div>
    </div>
  </div>
{/if}

<ScrollToTop opacity={30} />

{#if showHeart}
  <!-- vote panel -->
  <div class="fixed top-6 left-6 flex items-center gap-2">
    <button
      onclick={() => (showVotePanel = !showVotePanel)}
      onmouseenter={() => (heartHovered = true)}
      onmouseleave={() => (heartHovered = false)}
      class="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] border-none bg-[#1e2a38] text-[#ccc] shadow-lg transition-colors hover:bg-[#2a5080] hover:text-white"
      style="opacity: {showVotePanel || heartHovered ? 1 : 0.3}"
      aria-label="Toggle vote panel"
    >
      <Heart size={16} />
    </button>

    <div class="vote-panel" class:visible={showVotePanel}>
      <button onclick={() => vote('up')} class="vote-btn"><ThumbsUp size={14} /></button
      >
      <span class="vote-panel-count">{currentVotes}</span>
      <button onclick={() => vote('down')} class="vote-btn"
        ><ThumbsDown size={14} /></button
      >
    </div>
  </div>
{/if}

<style>
  .tag-pill {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    font-size: 0.75rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    background-color: #1e2a38;
    color: #ccc;
    transition: background-color 0.15s;
    line-height: 1.5;
  }

  .tag-pill:hover {
    background-color: #2a5080;
  }

  .tag-pill.active {
    background-color: #1e3a5a;
    color: #fff;
  }

  .icon-btn {
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
    transition: background-color 0.15s;
    text-decoration: none;
  }

  .icon-btn:hover {
    background-color: #2a5080;
    color: #fff;
  }

  .nuke-btn {
    padding: 8px 24px;
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    background-color: #1e2a38;
    color: #ccc;
    transition: background-color 0.15s;
  }

  .nuke-btn:hover {
    background-color: #2a5080;
    color: #fff;
  }

  .divider {
    color: #3f4558;
    padding: 0 2px;
    user-select: none;
  }

  .vote-panel {
    display: flex;
    align-items: center;
    gap: 4px;
    align-self: stretch;
    padding: 0;
    background-color: #1a2235;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    overflow: hidden;
    max-width: 0;
    opacity: 0;
    transition:
      max-width 0.25s ease,
      opacity 0.2s ease;
    white-space: nowrap;
  }

  .vote-panel.visible {
    max-width: 150px;
    opacity: 1;
  }

  .vote-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    background-color: transparent;
    color: #ccc;
    transition:
      background-color 0.15s,
      color 0.15s;
    flex-shrink: 0;
  }

  .vote-btn:hover {
    background-color: #2a5080;
    color: #fff;
  }

  .vote-panel-count {
    font-size: 0.8rem;
    color: #ccc;
    min-width: 28px;
    text-align: center;
    flex-shrink: 0;
    user-select: none;
  }
</style>
