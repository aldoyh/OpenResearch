import { SearchSource, SearchResult } from '../types';

const SERPER_API_KEY = import.meta.env.VITE_SERPER_API_KEY;

export async function search(query: string, source: SearchSource): Promise<SearchResult[]> {
  if (!SERPER_API_KEY) {
    throw new Error('SERPER_API_KEY is not defined. Please set it in your .env file.');
  }

  // Map sources to Serper API endpoints
  const endpoint = 'https://serpapi.com/search';
  
  // Prepare the search parameters based on source
  const params: Record<string, string> = {
    q: query,
    api_key: SERPER_API_KEY,
  };

  // Adjust parameters based on source type
  switch (source) {
    case 'images':
      params.tbm = 'isch';
      break;
    case 'videos':
      params.tbm = 'vid';
      break;
    case 'news':
      params.tbm = 'nws';
      break;
    case 'shopping':
      params.tbm = 'shop';
      break;
    default:
      // Default web search
      break;
  }

  try {
    // For sources that Serper doesn't directly support, we'll use web search
    // and filter/transform results as needed
    const response = await fetch(`https://serpapi.com/search.json?${new URLSearchParams(params)}`);
    
    if (!response.ok) {
      throw new Error(`Serper API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform Serper results to our SearchResult format
    let results: SearchResult[] = [];
    
    switch (source) {
      case 'images':
        results = (data.images_results || []).map((item: any) => ({
          title: item.title || 'Untitled',
          link: item.link,
          imageUrl: item.thumbnail,
        }));
        break;
        
      case 'videos':
        results = (data.video_results || []).map((item: any) => ({
          title: item.title,
          link: item.link,
          thumbnail: item.thumbnail,
          duration: item.duration || '',
          channel: item.channel || '',
          views: item.views || '',
        }));
        break;
        
      case 'news':
        results = (data.news_results || []).map((item: any) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet || '',
          imageUrl: item.thumbnail,
        }));
        break;
        
      case 'shopping':
        results = (data.shopping_results || []).map((item: any) => ({
          title: item.title,
          link: item.link,
          price: item.price || '',
          rating: item.rating || 0,
          imageUrl: item.thumbnail,
        }));
        break;
        
      default:
        // Web search results
        results = (data.organic_results || []).map((item: any) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet || '',
        }));
        break;
    }
    
    return results;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
}