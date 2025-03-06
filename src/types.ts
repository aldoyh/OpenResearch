export type SearchSource = 'search' | 'images' | 'videos' | 'places' | 'news' | 'shopping' | 'scholar' | 'patents';

export type AIProvider = 'ollama' | 'groq';

export interface SearchResult {
  title: string;
  link: string;
  // Add other properties as needed
}