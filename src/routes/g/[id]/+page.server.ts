import { API_KEY, API_URL } from '$env/static/private';
import { getManga } from '$lib/server/api';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);
  if (!id) throw error(400, 'Invalid ID');

  const manga = await getManga(API_URL, API_KEY, id);

  return {
    manga: {
      ...manga,
      coverUrl: manga.cover_file ? `${API_URL}/cover/${manga.cover_file}` : null,
      page_list: manga.page_list
        .filter((p) => p.page_file)
        .sort((a, b) => a.number - b.number)
        .map((p) => ({ ...p, imageUrl: `${API_URL}/image/${p.page_file}` })),
    },
  };
};
