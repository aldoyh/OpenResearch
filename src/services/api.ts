import { SearchSource, SearchResult } from '../types';

const SERPER_API_KEY = import.meta.env.VITE_SERPER_API_KEY;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;

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

export async function generateXAIResponse(query: string, results: SearchResult[], source: SearchSource): Promise<string> {
  const response = await fetch('https://api.x.ai/v1', {
    method: 'POST',
    headers: {
      'X-API-KEY': XAI_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'grok-2-1212',
      query,
      results,
      source,
    }),
  });

  if (!response.ok) {
    throw new Error('فشل في إنشاء استجابة الذكاء الاصطناعي' + response.statusText);
  }

  const data = await response.json();
  return data.response;
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

${prompts[source]}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error('فشل في إنشاء استجابة الذكاء الاصطناعي');
  }

  const data = await response.json();
  return data.choices[0].message.content;
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