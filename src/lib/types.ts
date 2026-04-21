export interface Tag {
  id: number;
  type: string;
  slug: string;
}

export interface PageItem {
  id: string;
  number: number;
  page_file: string | null;
}

export interface MangaDetail {
  id: number;
  media_id: string;
  title: string;
  title_full: string;
  title_jp: string | null;
  pages: number;
  votes: number;
  cover_file: string | null;
  tags: Tag[];
  page_list: PageItem[];
}

export interface GalleryItem {
  id: number;
  english_title: string;
  thumbnail: string;
  num_pages: number;
  thumbUrl: string;
}

export interface GalleryPage {
  curr_page: number;
  num_pages: number;
  per_page: number;
  result: Array<{
    id: number;
    english_title: string;
    thumbnail: string;
    num_pages: number;
  }>;
}
