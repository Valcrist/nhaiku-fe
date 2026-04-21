import { API_KEY, API_URL } from '$env/static/private';
import { localSearchManga } from '$lib/server/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const page = Math.max(1, Number(params.page) || 1);

  const gallery = await localSearchManga(API_URL, API_KEY, page);

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
