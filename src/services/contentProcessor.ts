import OpenAI from 'openai';
import { saveAs } from 'file-saver';

const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;

const openai = new OpenAI({
  apiKey: XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export async function processWebContent(url: string): Promise<string> {
  try {
    const response = await fetch(`/api/process?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Content processing error:', error);
    throw new Error('Failed to process content');
  }
}

function cleanHtml(html: string): string {
  // Remove scripts, styles, and other unnecessary elements
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Remove unwanted elements
  const elementsToRemove = tempDiv.querySelectorAll('script, style, link, meta, iframe');
  elementsToRemove.forEach(el => el.remove());

  // Extract main content
  const mainContent = tempDiv.querySelector('main, article, .content, #content, .main')?.textContent
    || tempDiv.querySelector('body')?.textContent
    || '';

  return mainContent.trim();
}

function saveToMarkdown(url: string, content: string) {
  const filename = `processed_${new Date().toISOString().slice(0, 10)}_${url.replace(/[^a-z0-9]/gi, '_')}.md`;
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, filename);
}
