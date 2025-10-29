import { SearchSource, SearchResult } from '../types';

// Serper.dev API key (must be prefixed with VITE_ in .env to be exposed to the client)
const SERPER_API_KEY = (import.meta as any).env?.VITE_SERPER_API_KEY as string | undefined;

// Map our source to Serper.dev endpoint path
function getSerperEndpointPath(source: SearchSource): string {
  switch (source) {
    case 'images':
      return 'images';
    case 'videos':
      return 'videos';
    case 'news':
      return 'news';
    case 'shopping':
      return 'shopping';
    case 'scholar':
      return 'scholar';
    case 'places':
      return 'places';
    case 'patents':
      return 'patents';
    default:
      return 'search';
  }
}

export async function search(query: string, source: SearchSource): Promise<SearchResult[]> {
  if (!SERPER_API_KEY) {
    throw new Error('VITE_SERPER_API_KEY is not defined. Please set it in your .env file.');
  }

  const endpoint = `https://google.serper.dev/${getSerperEndpointPath(source)}`;

  // Localized search: respect saved language if present
  const lang = (typeof window !== 'undefined' 
    ? (localStorage.getItem('language') as 'ar' | 'en')
    : undefined) || 'ar';
  // Choose a sensible default geo for Arabic vs English
  const gl = lang === 'ar' ? 'sa' : 'us';
  const hl = lang === 'ar' ? 'ar' : 'en';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': SERPER_API_KEY,
      },
      body: JSON.stringify({ q: query, gl, hl, num: 10 })
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Serper API error ${response.status}: ${response.statusText} ${text}`.trim());
    }

    const data = await response.json();

    // Transform Serper results to our SearchResult format
    let results: SearchResult[] = [];

    switch (source) {
      case 'images': {
        const items = (data.images || data.images_results || []) as any[];
        results = items.map((item: any) => ({
          title: item.title || item.source || 'Untitled',
          link: item.link || item.imageUrl || item.thumbnailUrl,
          imageUrl: item.thumbnailUrl || item.imageUrl || '',
        }));
        break;
      }

      case 'videos': {
        const items = (data.videos || data.video_results || []) as any[];
        results = items.map((item: any) => ({
          title: item.title,
          link: item.link || item.url,
          thumbnail: item.thumbnail || item.thumbnailUrl || '',
          duration: item.duration || '',
          channel: item.channel || item.source || '',
          views: item.views || '',
        }));
        break;
      }

      case 'news': {
        const items = (data.news || data.news_results || []) as any[];
        results = items.map((item: any) => ({
          title: item.title,
          link: item.link || item.url,
          snippet: item.snippet || item.summary || '',
          imageUrl: item.imageUrl || item.thumbnail || '',
        }));
        break;
      }

      case 'shopping': {
        const items = (data.shopping || data.shopping_results || []) as any[];
        results = items.map((item: any) => ({
          title: item.title,
          link: item.link || item.url,
          price: item.price || item.priceFormatted || '',
          rating: item.rating || item.stars || 0,
          imageUrl: item.imageUrl || item.thumbnail || '',
        }));
        break;
      }

      case 'scholar': {
        const items = (data.organic || data.scholar || []) as any[];
        results = items.map((item: any) => ({
          title: item.title,
          link: item.link || item.url,
          snippet: item.snippet || item.description || '',
          authors: item.authors || [],
          year: item.year ? String(item.year) : '',
          publisher: item.publication || item.publisher || '',
        }));
        break;
      }

      case 'places':
      case 'patents':
      default: {
        const items = (data.organic || data.organic_results || []) as any[];
        results = items.map((item: any) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet || item.description || '',
        }));
        break;
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
}