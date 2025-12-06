import { APIResponse, Anime, AnimeGenre } from '../types';

const BASE_URL = 'https://api.jikan.moe/v4';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, retries = 2): Promise<any> {
  try {
    const response = await fetch(url);
    if (response.status === 429) {
      if (retries > 0) {
        await wait(1000);
        return fetchWithRetry(url, retries - 1);
      }
      throw new Error('Rate limit exceeded');
    }
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    throw error;
  }
}

export const jikanService = {
  getTopAnime: async (filter: 'upcoming' | 'airing' | 'bypopularity' | 'favorite' = 'airing'): Promise<APIResponse<Anime[]>> => {
    return fetchWithRetry(`${BASE_URL}/top/anime?filter=${filter}&limit=20`);
  },

  getSeasonNow: async (): Promise<APIResponse<Anime[]>> => {
    return fetchWithRetry(`${BASE_URL}/seasons/now?limit=24`);
  },

  getSchedule: async (day?: string): Promise<APIResponse<Anime[]>> => {
    const dayQuery = day ? `?filter=${day}` : '';
    return fetchWithRetry(`${BASE_URL}/schedules${dayQuery}`);
  },

  getAnimeDetails: async (id: number): Promise<{ data: Anime }> => {
    return fetchWithRetry(`${BASE_URL}/anime/${id}/full`);
  },

  getAnimeGenres: async (): Promise<APIResponse<AnimeGenre[]>> => {
    return fetchWithRetry(`${BASE_URL}/genres/anime`);
  },

  searchAnime: async (
    query: string, 
    type?: string, 
    status?: string, 
    genreId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<APIResponse<Anime[]>> => {
    const params = new URLSearchParams();
    
    if (query) params.append('q', query);
    params.append('limit', '24');
    
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    if (genreId) params.append('genres', genreId);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    // Default sorting logic
    if (!query) {
        // When filtering without a query, sort by popularity (members) descending
        params.append('order_by', 'members');
        params.append('sort', 'desc');
    }

    return fetchWithRetry(`${BASE_URL}/anime?${params.toString()}`);
  },

  getRecommendations: async (id: number): Promise<APIResponse<{ entry: { mal_id: number; url: string; images: any; title: string } }[]>> => {
      return fetchWithRetry(`${BASE_URL}/anime/${id}/recommendations`);
  }
};
