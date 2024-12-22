export type SearchSource = 'search' | 'images' | 'videos' | 'places' | 'news' | 'shopping' | 'scholar' | 'patents';

export interface SearchResult {
  title: string;
  link: string;
  // Add other properties as needed
}