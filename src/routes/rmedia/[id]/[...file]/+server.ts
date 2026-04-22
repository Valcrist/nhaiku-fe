import { API_URL } from '$env/static/private';
import { getThumbServers } from '$lib/server/thumbCache';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const servers = await getThumbServers(API_URL);
  const id = Number(params.id);
  const server = servers[((id * 2654435761) >>> 0) % servers.length];
  const url = `${server}/${params.file}`;
  // console.log('[rmedia proxy]', url)
  const res = await fetch(url);
  if (!res.ok) return new Response(null, { status: res.status });
  return new Response(res.body, {
    headers: {
      'content-type': res.headers.get('content-type') ?? 'image/webp',
      'cache-control': 'public, max-age=604800, immutable',
    },
  });
};
