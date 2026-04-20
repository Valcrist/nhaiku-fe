let cache: { servers: string[]; expiry: number } | null = null

export async function getThumbServers(apiUrl: string): Promise<string[]> {
    if (cache && Date.now() < cache.expiry) return cache.servers
    const res = await fetch(`${apiUrl}/service/thumb_servers`)
    if (!res.ok) throw new Error(`thumb_servers fetch failed: ${res.status}`)
    const servers: string[] = await res.json()
    cache = { servers, expiry: Date.now() + 3_600_000 }
    return servers
}
