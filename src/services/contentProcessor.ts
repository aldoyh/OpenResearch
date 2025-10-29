import { generateAIResponse } from './api';

/**
 * Process and extract content from a URL
 */
export async function extractContent(url: string): Promise<string> {
  try {
    // In a real implementation, you would use a backend API to fetch and parse the content
    // For now, we'll simulate this with a simple fetch
    const response = await fetch(url);
    const html = await response.text();
    
    // Basic HTML stripping - in production, use a proper parser
    const div = document.createElement('div');
    div.innerHTML = html;
    
    // Remove scripts, styles, and other non-content elements
    const scripts = div.querySelectorAll('script, style, nav, header, footer, iframe');
    scripts.forEach(el => el.remove());
    
    // Extract text content
    const content = div.textContent || div.innerText || '';
    return content.trim();
  } catch (error) {
    console.error('[ContentProcessor] Failed to extract content:', error);
    throw new Error('Failed to extract content from URL');
  }
}

/**
 * Rephrase content using AI
 */
export async function rephraseContent(content: string, title: string): Promise<string> {
  const prompt = `Please rephrase the following article in a clear and concise manner while preserving the key information and meaning:

Title: ${title}

Content:
${content.substring(0, 3000)} ${content.length > 3000 ? '...' : ''}

Provide a rephrased version that is easier to understand while maintaining accuracy.`;

  // Create a mock result for the AI API
  const mockResults = [{ title, snippet: content.substring(0, 500), link: '' }];
  return await generateAIResponse(prompt, mockResults, 'search');
}

/**
 * Rewrite content using AI (more comprehensive rewriting)
 */
export async function rewriteContent(content: string, title: string): Promise<string> {
  const prompt = `Please rewrite the following article completely, creating a fresh perspective while preserving the core facts and key information:

Title: ${title}

Content:
${content.substring(0, 3000)} ${content.length > 3000 ? '...' : ''}

Provide a completely rewritten version with improved structure, clarity, and readability.`;

  // Create a mock result for the AI API
  const mockResults = [{ title, snippet: content.substring(0, 500), link: '' }];
  return await generateAIResponse(prompt, mockResults, 'search');
}

/**
 * Summarize content using AI
 */
export async function summarizeContent(content: string, title: string): Promise<string> {
  const prompt = `Please provide a comprehensive summary of the following article:

Title: ${title}

Content:
${content.substring(0, 3000)} ${content.length > 3000 ? '...' : ''}

Provide a well-structured summary that captures the main points and key information.`;

  // Create a mock result for the AI API
  const mockResults = [{ title, snippet: content.substring(0, 500), link: '' }];
  return await generateAIResponse(prompt, mockResults, 'search');
}

/**
 * Save content to localStorage as markdown
 */
export function saveToMarkdown(content: string, title: string, metadata?: Record<string, any>): void {
  const timestamp = new Date().toISOString();
  const filename = `article-${Date.now()}.md`;
  
  let markdown = `# ${title}\n\n`;
  
  if (metadata) {
    markdown += `## Metadata\n`;
    Object.entries(metadata).forEach(([key, value]) => {
      markdown += `- **${key}**: ${value}\n`;
    });
    markdown += `\n`;
  }
  
  markdown += `**Saved**: ${new Date().toLocaleString()}\n\n`;
  markdown += `---\n\n`;
  markdown += content;
  
  // Save to localStorage
  const savedArticles = JSON.parse(localStorage.getItem('saved_articles') || '{}');
  savedArticles[filename] = {
    title,
    content: markdown,
    timestamp,
    metadata
  };
  
  localStorage.setItem('saved_articles', JSON.stringify(savedArticles));
  
  // Also trigger download
  downloadMarkdown(markdown, filename);
}

/**
 * Download content as markdown file
 */
export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get all saved articles from localStorage
 */
export function getSavedArticles(): Record<string, any> {
  return JSON.parse(localStorage.getItem('saved_articles') || '{}');
}

/**
 * Delete a saved article
 */
export function deleteSavedArticle(filename: string): void {
  const savedArticles = getSavedArticles();
  delete savedArticles[filename];
  localStorage.setItem('saved_articles', JSON.stringify(savedArticles));
}
