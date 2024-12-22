import { describe, it, expect } from 'vitest';
import OpenAI from 'openai';

const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;

describe('X.ai API Connectivity', () => {
  it('should successfully connect to X.ai API', async () => {
    expect(XAI_API_KEY).toBeDefined();
    console.log('Testing X.ai connection with API key:', XAI_API_KEY ? 'Present' : 'Missing');

    try {
      const openai = new OpenAI({
        apiKey: XAI_API_KEY,
        baseURL: "https://api.x.ai/v1",
        dangerouslyAllowBrowser: true
      });

      const completion = await openai.chat.completions.create({
        model: "grok-2-1212",
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
