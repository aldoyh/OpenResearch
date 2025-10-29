import { SearchSource, SearchResult } from '../types';
import OpenAI from 'openai';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const OLLAMA_TAGS_URL = 'http://localhost:11434/api/tags';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Accept model as parameter and always send it
export async function callOllamaAPI(prompt: string, model: string): Promise<string> {
  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model }),
    });

    const text = await response.text();
    // Ollama returns streaming JSONL, so parse each line
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    let lastData: any = null;
    for (const line of lines) {
      try {
        lastData = JSON.parse(line);
      } catch (jsonErr) {
        console.error('Ollama API: Failed to parse JSONL line:', jsonErr, line);
      }
    }
    if (!lastData) {
      console.error('Ollama API: No valid JSON object found in response:', text);
      throw new Error('Ollama API: Invalid JSONL response.');
    }
    if (!response.ok) {
      console.error('Ollama API: Error response:', lastData);
      throw new Error(`Ollama API error: ${response.statusText} - ${lastData.error || text}`);
    }
    return lastData.response || lastData.message || 'No response from Ollama API';
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
  aiProvider: 'ollama' | 'groq',
  ollamaModel: string
): Promise<string> {
  const prompt = `Query: "${query}" (${source})\nResults: ${JSON.stringify(results)}`;

  if (aiProvider === 'ollama') {
    return await callOllamaAPI(prompt, ollamaModel);
  } else if (aiProvider === 'groq') {
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not defined. Please set it in your .env file.');
    }
    const openai = new OpenAI({
      apiKey: GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
      dangerouslyAllowBrowser: true
    });

    const completion = await openai.chat.completions.create({
      model: 'mixtral-8x7b-32768', // Or another suitable Groq model
      messages: [
        { role: 'system', content: 'You are a helpful assistant that summarizes search results.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    return completion.choices[0]?.message?.content || 'No response from Groq API';
  } else {
    throw new Error('Invalid AI provider selected.');
  }
}

