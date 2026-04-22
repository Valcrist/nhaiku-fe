import { API_KEY, API_URL } from '$env/static/private';
import { remoteSearchManga } from '$lib/server/api';
import { parseSearchParams } from '$lib/server/search';
import { getThumbServers } from '$lib/server/thumbCache';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
  const { page, query, sort } = parseSearchParams(params, url);

  const [servers, gallery] = await Promise.all([
    getThumbServers(API_URL),
    remoteSearchManga(API_URL, API_KEY, page, query, sort),
  ]);

  const items = gallery.result.map((item) => ({
    ...item,
    thumbUrl: `${servers[((item.id * 2654435761) >>> 0) % servers.length]}/${item.thumbnail}`,
  }));

  return {
    items,
    currPage: gallery.curr_page,
    numPages: gallery.num_pages,
  };
};
