import { API_KEY, API_URL } from '$env/static/private';
import { remoteSearchManga } from '$lib/server/api';
import { parseSearchParams } from '$lib/server/search';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
  const { page, query, sort } = parseSearchParams(params, url);

  const gallery = await remoteSearchManga(API_URL, API_KEY, page, query, sort);

  const items = gallery.result.map((item) => ({
    ...item,
    thumbUrl: `/media/thumb/${item.thumbnail}`,
  }));

  return {
    items,
    currPage: gallery.curr_page,
    numPages: gallery.num_pages,
  };
};
