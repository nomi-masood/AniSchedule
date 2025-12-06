// Jikan API Types
export interface AnimeImage {
    jpg: {
        image_url: string;
        large_image_url: string;
    };
    webp: {
        image_url: string;
        large_image_url: string;
    };
}

export interface AnimeTitle {
    type: string;
    title: string;
}

export interface AnimeDate {
    day: number;
    month: number;
    year: number;
}

export interface AnimeProp {
    from: AnimeDate;
    to: AnimeDate;
}

export interface AnimeAired {
    from: string;
    to: string;
    prop: AnimeProp;
    string: string;
}

export interface AnimeGenre {
    mal_id: number;
    type: string;
    name: string;
    url: string;
}

export interface AnimeTrailer {
    youtube_id: string;
    url: string;
    embed_url: string;
    images: {
        image_url: string;
        small_image_url: string;
        medium_image_url: string;
        large_image_url: string;
        maximum_image_url: string;
    };
}

export interface Anime {
    mal_id: number;
    url: string;
    images: AnimeImage;
    trailer: AnimeTrailer;
    approved: boolean;
    titles: AnimeTitle[];
    title: string;
    title_english: string;
    title_japanese: string;
    type: string;
    source: string;
    episodes: number;
    status: string;
    airing: boolean;
    aired: AnimeAired;
    duration: string;
    rating: string;
    score: number;
    scored_by: number;
    rank: number;
    popularity: number;
    members: number;
    favorites: number;
    synopsis: string;
    background: string;
    season: string;
    year: number;
    broadcast: {
        day: string;
        time: string;
        timezone: string;
        string: string;
    };
    genres: AnimeGenre[];
    studios: AnimeGenre[];
}

export interface APIResponse<T> {
    data: T;
    pagination: {
        last_visible_page: number;
        has_next_page: boolean;
        current_page: number;
        items: {
            count: number;
            total: number;
            per_page: number;
        };
    };
}

export interface WatchlistItem {
    mal_id: number;
    title: string;
    image_url: string;
    added_at: number;
}
