import { API_KEY, API_URL } from '$env/static/private';
import { localSearchManga } from '$lib/server/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
  const page = Math.max(1, Number(params.page) || 1);
  const rawQ = url.searchParams.get('q') ?? '';
  const query = rawQ ? rawQ.split(' ') : [];
  const sort = url.searchParams.get('sort') ?? 'date';

  const gallery = await localSearchManga(API_URL, API_KEY, page, query, sort);

  const items = gallery.result.map((item) => ({
    ...item,
    thumbUrl: `${API_URL}/thumb/${item.thumbnail}`,
  }));

  return {
    items,
    currPage: gallery.curr_page,
    numPages: gallery.num_pages,
  };
};
