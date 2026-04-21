import { API_KEY, API_URL } from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const res = await fetch(`${API_URL}/manga/nuke/${params.id}`, {
    headers: { 'X-API-Key': API_KEY },
  });
  return new Response(await res.text(), { status: res.status });
};
