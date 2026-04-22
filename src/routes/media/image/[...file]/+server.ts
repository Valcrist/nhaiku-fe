import { API_URL } from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const url = `${API_URL}/image/${params.file}`;
  // console.log('[image proxy]', url);
  const res = await fetch(url);
  if (!res.ok) return new Response(null, { status: res.status });
  const headers: Record<string, string> = {
    'content-type': res.headers.get('content-type') ?? 'image/jpeg',
  };
  const cc = res.headers.get('cache-control');
  if (cc) headers['cache-control'] = cc;
  return new Response(res.body, { headers });
};
