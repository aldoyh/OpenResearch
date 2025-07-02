export type SearchSource = 'search' | 'images' | 'videos' | 'places' | 'news' | 'shopping' | 'scholar' | 'patents';

export type AIProvider = 'ollama' | 'groq' | 'ollama_qwen3';

export interface BaseSearchResult {
  title: string;
  link: string;
}

export interface WebResult extends BaseSearchResult {
  snippet: string;
}

export interface ImageResult extends BaseSearchResult {
  imageUrl: string;
}

export interface VideoResult extends BaseSearchResult {
  thumbnail: string;
  duration: string;
  channel: string;
  views: string;
}

export interface PlaceResult extends BaseSearchResult {
  address: string;
  rating: number;
  reviews: number;
}

export interface NewsResult extends BaseSearchResult {
  snippet: string;
  imageUrl: string;
}

export interface ShoppingResult extends BaseSearchResult {
  price: string;
  rating: number;
  imageUrl: string;
}

export interface ScholarResult extends BaseSearchResult {
  snippet: string;
  authors: string[];
  year: string;
  publisher: string;
}

export type SearchResult =
  | WebResult
  | ImageResult
  | VideoResult
  | PlaceResult
  | NewsResult
  | ShoppingResult
  | ScholarResult;
