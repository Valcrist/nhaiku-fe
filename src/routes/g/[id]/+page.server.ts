import { API_KEY, API_URL } from '$env/static/private';
import { getManga } from '$lib/server/api';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);
  if (!id) throw error(400, 'Invalid ID');

  const manga = await getManga(API_URL, API_KEY, id);

  function mapListItem(item: (typeof manga.same_artist)[number]) {
    return { ...item, thumbUrl: item.thumbnail ? `/media/thumb/${item.thumbnail}` : '' }
  }

  return {
    manga: {
      ...manga,
      coverUrl: manga.cover_file ? `/media/cover/${manga.cover_file}` : null,
      page_list: manga.page_list
        .filter((p) => p.page_file)
        .sort((a, b) => a.number - b.number)
        .map((p) => ({ ...p, imageUrl: `/media/image/${p.page_file}` })),
      same_artist: manga.same_artist.map(mapListItem),
      same_group: manga.same_group.map(mapListItem),
      similar_titles: manga.similar_titles.map(mapListItem),
    },
  };
};
