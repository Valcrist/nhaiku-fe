import { API_KEY, API_URL } from '$env/static/private'
import { remoteSearchManga } from '$lib/server/api'
import { getThumbServers } from '$lib/server/thumbCache'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
    const page = Math.max(1, Number(params.page) || 1)

    const [servers, gallery] = await Promise.all([
        getThumbServers(API_URL),
        remoteSearchManga(API_URL, API_KEY, page)
    ])

    const items = gallery.result.map((item, i) => ({
        ...item,
        thumbUrl: `${servers[i % servers.length]}/${item.thumbnail}`
    }))

    return {
        items,
        currPage: gallery.curr_page,
        numPages: gallery.num_pages
    }
}
