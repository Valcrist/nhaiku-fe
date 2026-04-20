<script lang="ts">
    import { goto, afterNavigate } from '$app/navigation'
    import GalleryView from '$lib/components/GalleryView.svelte'
    import type { PageData } from './$types'

    let { data }: { data: PageData } = $props()

    afterNavigate(() => {
        window.scrollTo({ top: 0 })
    })

    function goToPage(page: number) {
        if (page === data.currPage) return
        goto(`/page/${page}`)
    }
</script>

<svelte:head><title>Local Gallery - NHaiku</title></svelte:head>

<GalleryView items={data.items} currPage={data.currPage} numPages={data.numPages} onPageChange={goToPage} logoHref="/r/page/1" />
