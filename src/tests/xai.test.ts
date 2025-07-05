import { describe, it, expect } from 'vitest';
import OpenAI from 'openai';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

describe('Groq API', () => {
  it('should connect and generate a chat completion', async () => {
    expect(GROQ_API_KEY).toBeDefined();
    const openai = new OpenAI({
      apiKey: GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1', // Per Groq docs as of July 2025
      dangerouslyAllowBrowser: true
    });
    const completion = await openai.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello! This is a test message.' }
      ],
      temperature: 0.7,
      max_tokens: 100
    });
    expect(completion.choices[0]?.message?.content).toBeDefined();
  });

  it('should list available models', async () => {
    expect(GROQ_API_KEY).toBeDefined();
    const openai = new OpenAI({
      apiKey: GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
      dangerouslyAllowBrowser: true
    });
    const models = await openai.models.list();
    expect(Array.isArray(models.data)).toBe(true);
    expect(models.data.length).toBeGreaterThan(0);
    // Optionally log model ids
    console.log('Groq available models:', models.data.map((m: any) => m.id));
  });
});

// Ollama API tests
describe('Ollama API', () => {
  const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
  const OLLAMA_TAGS_URL = 'http://localhost:11434/api/tags';

  it('should connect and generate a response', async () => {
    // Use a default model name, e.g., "mistral:latest" or "llama2:latest"
    const model = 'mistral:latest';
    const prompt = 'Hello! This is a test message.';
    const res = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt })
    });
    expect(res.ok).toBe(true);
    const text = await res.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch (e) {
      // Ollama may return streaming JSONL, so fallback to first line
      const firstLine = text.split('\n').find(line => line.trim().length > 0);
      if (firstLine) data = JSON.parse(firstLine);
    }
    expect(data && (data.response || data.message)).toBeDefined();
  });

  it('should list all available models', async () => {
    const res = await fetch(OLLAMA_TAGS_URL);
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(Array.isArray(data.models)).toBe(true);
    expect(data.models.length).toBeGreaterThan(0);
    // Optionally log model names
    console.log('Ollama available models:', data.models.map((m: any) => m.name));
  });
});
