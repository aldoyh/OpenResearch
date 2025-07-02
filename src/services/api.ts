import { SearchSource, SearchResult } from '../types';
import OpenAI from 'openai';

const SERPER_API_KEY = import.meta.env.VITE_SERPER_API_KEY;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Initialize OpenAI configurations for different providers
const ollamaConfig = {
  apiKey: 'ollama',
  baseURL: 'http://localhost:11434/api/generate',
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
};

const ollamaQwen3Config = {
  apiKey: 'ollama',
  baseURL: 'http://localhost:11434/api/generate',
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
};

const groqConfig = {
  apiKey: GROQ_API_KEY,
  baseURL: 'https://api.groq.com/v1',
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
};

// Add retry logic and better error handling
async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error('All retry attempts failed');
}

interface APIError {
  message: string;
  code: string;
}

export async function searchSerper(query: string, source: SearchSource): Promise<SearchResult[]> {
  try {
    const endpoint = `https://google.serper.dev/${source}`;
    const response = await fetchWithRetry(endpoint, {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        gl: 'world',
        hl: 'ar',
        num: 10, // Limit results
      }),
    });

    const data = await response.json();
    if ('error' in data) {
      throw new Error(`API Error: ${(data as APIError).message}`);
    }

    return formatResults(data, source);
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('فشل في جلب نتائج البحث - يرجى المحاولة مرة أخرى');
  }
}

export async function generateAIResponse(
  query: string,
  results: SearchResult[],
  source: SearchSource,
  provider: 'ollama' | 'groq'
): Promise<string> {
  const providers = [
    { name: 'groq', config: groqConfig, model: 'mixtral-8x7b-32768', enabled: !!GROQ_API_KEY },
    { name: 'ollama', config: ollamaConfig, model: 'mistral', enabled: true },
    { name: 'ollama_qwen3', config: ollamaQwen3Config, model: 'qwen3', enabled: true }
  ];

  // Start with the selected provider, then fallback
  const initialProviderIndex = providers.findIndex(p => p.name === provider);
  const providerQueue = [...providers.slice(initialProviderIndex), ...providers.slice(0, initialProviderIndex)];

  for (const p of providerQueue) {
    if (!p.enabled) continue;

    try {
      const openai = new OpenAI(p.config);
      const completion = await openai.chat.completions.create({
        model: p.model,
        messages: [
          {
            role: 'system',
            content: 'You are an AI research assistant that provides analysis in Arabic.'
          },
          {
            role: 'user',
            content: `Query: "${query}" (${source})\nResults: ${JSON.stringify(results)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 7000,
      });

      if (completion.choices?.[0]?.message?.content) {
        return completion.choices[0].message.content;
      }
    } catch (error: any) {
      console.error(`${p.name} API error:`, error.message);
    }
  }

  throw new Error('All AI providers failed to generate a response.');
}

function formatResults(data: any, source: SearchSource): SearchResult[] {
  switch (source) {
    case 'search':
      return data.organic?.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      })) ?? [];

    case 'images':
      return data.images?.map((item: any) => ({
        title: item.title,
        link: item.link,
        imageUrl: item.imageUrl,
      })) ?? [];

    case 'videos':
      return data.videos?.map((item: any) => ({
        title: item.title,
        link: item.link,
        thumbnail: item.thumbnail,
        duration: item.duration,
        channel: item.channel,
        views: item.views,
      })) ?? [];

    case 'places':
      return data.places?.map((item: any) => ({
        title: item.title,
        link: item.link,
        address: item.address,
        rating: item.rating,
        reviews: item.reviews,
      })) ?? [];

    case 'news':
      return data.news?.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        imageUrl: item.imageUrl,
      })) ?? [];

    case 'shopping':
      return data.shopping?.map((item: any) => ({
        title: item.title,
        link: item.link,
        price: item.price,
        rating: item.rating,
        imageUrl: item.imageUrl,
      })) ?? [];

    case 'scholar':
    case 'patents':
      return data.organic?.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        authors: item.authors,
        year: item.year,
        publisher: item.publisher,
      })) ?? [];

    default:
      return [];
  }
}