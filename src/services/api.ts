import { SearchSource, SearchResult } from '../types';

const SERPER_API_KEY = import.meta.env.VITE_SERPER_API_KEY;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const OLLAMA_BASE_URL = 'http://localhost:11434';

// AI Provider types
export type AIProvider = 'ollama' | 'groq';

// Storage keys
const STORAGE_KEYS = {
  AI_PROVIDER: 'openresearch_ai_provider',
  OLLAMA_MODEL: 'openresearch_ollama_model',
  GROQ_MODEL: 'openresearch_groq_model',
};

// Default models
const DEFAULT_GROQ_MODEL = 'mixtral-8x7b-32768';
const DEFAULT_OLLAMA_MODEL = 'mistral:latest';

// Check if Ollama is available
export async function checkOllamaAvailability(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });
    return response.ok;
  } catch (error) {
    console.log('[AI] Ollama not available:', error);
    return false;
  }
}

// Fetch available Ollama models
export async function fetchOllamaModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) throw new Error('Failed to fetch Ollama models');
    const data = await response.json();
    return (data.models || []).map((m: any) => m.name);
  } catch (error) {
    console.error('[AI] Failed to fetch Ollama models:', error);
    return [];
  }
}

// Get or initialize AI provider
export async function getAIProvider(): Promise<{ provider: AIProvider; model: string }> {
  // Check localStorage first
  const storedOllamaModel = localStorage.getItem(STORAGE_KEYS.OLLAMA_MODEL);
  const storedGroqModel = localStorage.getItem(STORAGE_KEYS.GROQ_MODEL);

  // Check if Ollama is available
  const ollamaAvailable = await checkOllamaAvailability();

  if (ollamaAvailable) {
    // Ollama is available - use it
    const models = await fetchOllamaModels();
    const selectedModel = storedOllamaModel && models.includes(storedOllamaModel) 
      ? storedOllamaModel 
      : models[0] || DEFAULT_OLLAMA_MODEL;
    
    // Persist the selection
    localStorage.setItem(STORAGE_KEYS.AI_PROVIDER, 'ollama');
    localStorage.setItem(STORAGE_KEYS.OLLAMA_MODEL, selectedModel);
    
    return { provider: 'ollama', model: selectedModel };
  } else {
    // Ollama not available - fall back to Groq
    const selectedModel = storedGroqModel || DEFAULT_GROQ_MODEL;
    
    // Persist the selection
    localStorage.setItem(STORAGE_KEYS.AI_PROVIDER, 'groq');
    localStorage.setItem(STORAGE_KEYS.GROQ_MODEL, selectedModel);
    
    return { provider: 'groq', model: selectedModel };
  }
}

// Set AI provider manually
export function setAIProvider(provider: AIProvider, model: string): void {
  localStorage.setItem(STORAGE_KEYS.AI_PROVIDER, provider);
  if (provider === 'ollama') {
    localStorage.setItem(STORAGE_KEYS.OLLAMA_MODEL, model);
  } else {
    localStorage.setItem(STORAGE_KEYS.GROQ_MODEL, model);
  }
}

// Call Ollama API
async function callOllamaAPI(prompt: string, model: string): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model, stream: false }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const text = await response.text();
    // Ollama returns JSONL by default, parse each line
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    let lastData: any = null;
    
    for (const line of lines) {
      try {
        lastData = JSON.parse(line);
      } catch (e) {
        console.error('[AI] Failed to parse Ollama response line:', e);
      }
    }
    
    if (!lastData) {
      throw new Error('Invalid Ollama response');
    }
    
    return lastData.response || lastData.message || 'No response from Ollama';
  } catch (error) {
    console.error('[AI] Ollama API error:', error);
    throw error;
  }
}

// Call Groq API
async function callGroqAPI(prompt: string, model: string): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key not configured');
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: 'You are a helpful research assistant that creates well-formatted markdown summaries.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response from Groq';
  } catch (error) {
    console.error('[AI] Groq API error:', error);
    throw error;
  }
}

export async function searchSerper(query: string, source: SearchSource): Promise<SearchResult[]> {
  const endpoint = `https://google.serper.dev/${source}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: query,
      gl: 'world',
      hl: 'ar',
    }),
  });

  if (!response.ok) {
    throw new Error('فشل في جلب نتائج البحث');
  }

  const data = await response.json();
  return formatResults(data, source);
}

export async function generateAIResponse(query: string, results: SearchResult[], source: SearchSource): Promise<string> {
  const prompts = {
    search: `إنشاء ملخص شامل بتنسيق markdown يتضمن:
      ## الملخص
      ### النتائج الرئيسية
      ### المصادر
      ### الخاتمة`,

    images: `تحليل مجموعة الصور وإنشاء ملخص بتنسيق markdown يتضمن:
      ## تحليل بصري
      ### المواضيع المشتركة
      ### العناصر البارزة
      ### التفاصيل التقنية (الدقة، النمط، إلخ)`,

    videos: `تحليل مجموعة الفيديوهات وإنشاء ملخص بتنسيق markdown يتضمن:
      ## نظرة عامة على المحتوى
      ### القنوات الشائعة
      ### تحليل المدة
      ### إحصائيات المشاهدات
      ### المواضيع الرئيسية`,

    news: `إنشاء تحليل إخباري بتنسيق markdown يتضمن:
      ## ملخص الأخبار
      ### القصة الرئيسية
      ### التطورات ذات الصلة
      ### المصادر
      ### الجدول الزمني`,

    shopping: `إنشاء تحليل للمنتجات بتنسيق markdown يتضمن:
      ## نظرة عامة على السوق
      ### تحليل نطاق الأسعار
      ### العلامات التجارية الشائعة
      ### الميزات الرئيسية
      ### أفضل الخيارات قيمةً`,

    scholar: `إنشاء ملخص أكاديمي بتنسيق markdown يتضمن:
      ## نظرة عامة على البحث
      ### النتائج الرئيسية
      ### أنماط المنهجية
      ### تأثير البحث
      ### التوجهات المستقبلية`,

    patents: `إنشاء تحليل للبراءات بتنسيق markdown يتضمن:
      ## نظرة عامة على الابتكار
      ### التقنيات الرئيسية
      ### أصحاب البراءات
      ### مجالات التطبيق
      ### التأثير في السوق`,

    places: `إنشاء تحليل للموقع بتنسيق markdown يتضمن:
      ## نظرة عامة على المنطقة
      ### الأماكن الشائعة
      ### تحليل التقييمات
      ### مميزات الموقع
      ### نصائح للزوار`
  };

  const systemPrompt = `أنت مساعد بحث خبير يقوم بإنشاء ملخصات منسقة بـ markdown. التنسيق يشمل:
    - **غامق** للتأكيد
    - *مائل* للمصطلحات
    - > اقتباسات للنصوص المهمة
    - \`كود\` للمصطلحات التقنية
    - قوائم (- أو 1.) للنقاط المتعددة
    قم بتضمين الإحصائيات ذات الصلة واستشهد بالمصادر باستخدام تنسيق [النص](الرابط)`;

  const userPrompt = `إنشاء تحليل ${source} لـ "${query}" باستخدام هذه النتائج: ${JSON.stringify(results)}.
اتبع هذا الهيكل:

${prompts[source]}

${systemPrompt}`;

  // Get the active AI provider
  const { provider, model } = await getAIProvider();
  
  console.log(`[AI] Using ${provider} with model ${model}`);

  try {
    if (provider === 'ollama') {
      return await callOllamaAPI(userPrompt, model);
    } else {
      return await callGroqAPI(userPrompt, model);
    }
  } catch (error) {
    console.error(`[AI] ${provider} failed, attempting fallback...`, error);
    
    // If primary provider fails, try the other one
    if (provider === 'ollama') {
      console.log('[AI] Falling back to Groq');
      const groqModel = localStorage.getItem(STORAGE_KEYS.GROQ_MODEL) || DEFAULT_GROQ_MODEL;
      return await callGroqAPI(userPrompt, groqModel);
    } else {
      // If Groq fails, check if Ollama is available
      const ollamaAvailable = await checkOllamaAvailability();
      if (ollamaAvailable) {
        console.log('[AI] Falling back to Ollama');
        const models = await fetchOllamaModels();
        const ollamaModel = models[0] || DEFAULT_OLLAMA_MODEL;
        return await callOllamaAPI(userPrompt, ollamaModel);
      }
      throw error; // No fallback available
    }
  }
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