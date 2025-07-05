import { SearchSource, SearchResult } from '../types';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const OLLAMA_TAGS_URL = 'http://localhost:11434/api/tags';


// Accept model as parameter and always send it
export async function callOllamaAPI(prompt: string, model: string): Promise<string> {
  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, model }),
    });

    const text = await response.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      // Debug: log the raw response if JSON parsing fails
      console.error('Ollama API: Failed to parse JSON:', jsonErr);
      console.error('Ollama API: Raw response text:', text);
      throw new Error('Ollama API: Invalid JSON response.');
    }

    if (!response.ok) {
      // Debug: log the parsed error response
      console.error('Ollama API: Error response:', data);
      throw new Error(`Ollama API error: ${response.statusText} - ${data.error || text}`);
    }

    return data.response || 'No response from Ollama API';
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    throw error;
  }
}

// Fetch available models from Ollama
export async function fetchOllamaModels(): Promise<string[]> {
  try {
    const response = await fetch(OLLAMA_TAGS_URL);
    if (!response.ok) throw new Error('Failed to fetch Ollama models');
    const data = await response.json();
    return (data.models || []).map((m: any) => m.name);
  } catch (e) {
    return [];
  }
}

export async function generateAIResponse(
  query: string,
  results: SearchResult[],
  source: SearchSource,
  model: string
): Promise<string> {
  const prompt = `Query: "${query}" (${source})\nResults: ${JSON.stringify(results)}`;
  return await callOllamaAPI(prompt, model);
}

