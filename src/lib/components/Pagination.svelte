<script lang="ts">
    let {
        currPage,
        numPages,
        onPageChange
    }: {
        currPage: number
        numPages: number
        onPageChange: (page: number) => void
    } = $props()

    function getPageRange(curr: number, total: number): number[] {
        if (total <= 1) return [1]
        let start = Math.max(1, curr - 2)
        let end = Math.min(total, start + 4)
        start = Math.max(1, end - 4)
        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }

    const pageRange = $derived(getPageRange(currPage, numPages))
    const atFirst = $derived(currPage <= 1)
    const atLast = $derived(currPage >= numPages)
</script>

{#if numPages > 1}
    <div class="pagination-bar">
        <button onclick={() => onPageChange(1)} disabled={atFirst} aria-label="First page">❮❮</button>
        <button onclick={() => onPageChange(currPage - 1)} disabled={atFirst} aria-label="Previous page">❮</button>

        {#each pageRange as page (page)}
            <button
                onclick={() => onPageChange(page)}
                class:active={page === currPage}
                aria-current={page === currPage ? 'page' : undefined}
            >{page}</button>
        {/each}

        <button onclick={() => onPageChange(currPage + 1)} disabled={atLast} aria-label="Next page">❯</button>
        <button onclick={() => onPageChange(numPages)} disabled={atLast} aria-label="Last page">❯❯</button>
    </div>
{/if}

<style>
    .pagination-bar {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 8px;
        margin: 20px 0;
    }

    .pagination-bar button {
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        min-width: 44px;
        height: 36px;
        padding: 0 8px;
        color: #ccc;
        font-size: 16px;
        font-weight: 700;
        line-height: 1;
        border-radius: 8px;
        background-color: #162233;
        cursor: pointer;
        border: none;
        transition: background-color 0.15s;
        flex-shrink: 0;
    }

    .pagination-bar button:hover:not(:disabled) {
        background-color: #2a5080;
    }

    .pagination-bar button.active {
        background-color: #1e3a5a;
        color: #fff;
    }

    .pagination-bar button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
</style>
