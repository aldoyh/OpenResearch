import { SearchSource, SearchResult } from '../types';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

async function callOllamaAPI(prompt: string): Promise<string> {
  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || 'No response from Ollama API';
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    throw error;
  }
}

export async function generateAIResponse(
  query: string,
  results: SearchResult[],
  source: SearchSource
): Promise<string> {
  const prompt = `Query: "${query}" (${source})\nResults: ${JSON.stringify(results)}`;
  return await callOllamaAPI(prompt);
}

