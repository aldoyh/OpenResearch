import { describe, it, expect } from 'vitest';
import OpenAI from 'openai';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

describe('Groq API Connectivity', () => {
  it('should successfully connect to Groq API', async () => {
    expect(GROQ_API_KEY).toBeDefined();
    console.log('Testing Groq connection with API key:', GROQ_API_KEY ? 'Present' : 'Missing');

    try {
      const openai = new OpenAI({
        apiKey: GROQ_API_KEY,
        baseURL: "https://api.groq.com/v1",
        dangerouslyAllowBrowser: true
      });

      const completion = await openai.chat.completions.create({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: 'Hello! This is a test message.'
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      });

      console.log('Response data:', JSON.stringify(completion, null, 2));

      expect(completion.choices[0]?.message?.content).toBeDefined();
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
