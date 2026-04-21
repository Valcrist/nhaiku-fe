import type { GalleryPage, MangaDetail } from '$lib/types';

export async function localSearchManga(
  apiUrl: string,
  apiKey: string,
  page: number,
  query: string[] = [],
  sort = 'date'
): Promise<GalleryPage> {
  const res = await fetch(`${apiUrl}/manga/local/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({ page, query, sort }),
  });
  if (!res.ok) throw new Error(`local manga search failed: ${res.status}`);
  return res.json();
}

export async function getManga(
  apiUrl: string,
  apiKey: string,
  mangaId: number
): Promise<MangaDetail> {
  const res = await fetch(`${apiUrl}/manga/${mangaId}`, {
    headers: { 'X-API-Key': apiKey },
  });
  if (!res.ok) throw new Error(`manga fetch failed: ${res.status}`);
  return res.json();
}

export async function remoteSearchManga(
  apiUrl: string,
  apiKey: string,
  page: number,
  query: string[] = [],
  sort = 'date'
): Promise<GalleryPage> {
  const res = await fetch(`${apiUrl}/manga/remote/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({ page, query, sort }),
  });
  if (!res.ok) throw new Error(`manga search failed: ${res.status}`);
  return res.json();
}
