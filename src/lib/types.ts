export interface GalleryItem {
    id: number
    english_title: string
    thumbnail: string
    num_pages: number
    thumbUrl: string
}

export interface GalleryPage {
    curr_page: number
    num_pages: number
    per_page: number
    result: Array<{
        id: number
        english_title: string
        thumbnail: string
        num_pages: number
    }>
}
