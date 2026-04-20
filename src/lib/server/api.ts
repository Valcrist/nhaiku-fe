import type { GalleryPage } from '$lib/types'

export async function remoteSearchManga(
    apiUrl: string,
    apiKey: string,
    page: number
): Promise<GalleryPage> {
    const res = await fetch(`${apiUrl}/manga/remote/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey
        },
        body: JSON.stringify({ page })
    })
    if (!res.ok) throw new Error(`manga search failed: ${res.status}`)
    return res.json()
}
