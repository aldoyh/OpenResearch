// --- Search Logging ---
// Only import logSearch if running in Node.js/Electron (not in browser)
let logSearch: ((query: string, source: string, aiProvider: string) => void) | undefined = undefined;
if (typeof window === 'undefined') {
  // @ts-ignore
  logSearch = require('./services/searchLog').logSearch;
}
import { useEffect, useState } from "react";
import { SearchResult, SearchSource, AIProvider } from './types';

function OllamaStatusIndicator({
  selectedModel,
  onModelChange
}: {
  selectedModel: string;
  onModelChange: (model: string) => void;
}) {
  const [reachable, setReachable] = useState(true);
  const [models, setModels] = useState<string[]>([]);
  // modelOk is only used for logic, not needed as a state variable
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function checkOllama() {
      try {
        // Check reachability
        const res = await fetch("http://localhost:11434/api/tags");
        if (!res.ok) throw new Error();
        const data = await res.json();
        const availableModels = (data.models || []).map((m: any) => m.name);
        if (isMounted) {
          setModels(availableModels);
          setReachable(true);
          if (!availableModels.includes(selectedModel)) {
            setShowDropdown(true);
          } else {
            setShowDropdown(false);
          }
        }
      } catch {
        if (isMounted) {
          setReachable(false);
        }
      }
    }
    checkOllama();
    // Optionally poll every 30s
    const interval = setInterval(checkOllama, 30000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [selectedModel]);

  if (!reachable) {
    return (
      <span className="ml-1 align-middle">
        <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Ollama not reachable"></span>
      </span>
    );
  }

  if (showDropdown && models.length > 0) {
    return (
      <span className="ml-2">
        <select
          className="border border-red-400 text-xs rounded px-2 py-1 bg-white text-red-700 animate-pulse"
          value={selectedModel}
          onChange={e => onModelChange(e.target.value)}
        >
          <option value="">Select Model</option>
          {models.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse ml-1" title="Model not found"></span>
      </span>
    );
  }

  // Model is OK and Ollama reachable
  return (
    <span className="ml-1 align-middle">
      <span className="inline-block w-2 h-2 rounded-full bg-green-500" title="Ollama and model OK"></span>
    </span>
  );
}


import { generateAIResponse } from "./services/api";
import { SearchBar } from "./components/SearchBar";
import { SourceSelector } from "./components/SourceSelector";
import { SearchResults } from "./components/SearchResults";
import { AIResponse } from "./components/AIResponse";
import { Globe } from "lucide-react";
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageToggle } from './components/LanguageToggle';
import { AIProviderSelector } from './components/AIProviderSelector';
import { ProcessingOverlay } from './components/ProcessingOverlay';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useApp } from './contexts/AppContext';

export function App() {
  const { language, aiProvider, setAIProvider } = useApp();
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<SearchSource>("search");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiResponse, setAIResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAI, setShowAI] = useState(false);
  // --- Ollama Model Selection ---
  const [ollamaModel, setOllamaModel] = useState("mistral:latest");

  const translations = {
    ar: {
      title: 'الباحث الذكي - محرك بحث معزز بالذكاء الاصطناعي',
      searchPlaceholder: 'ماذا تريد أن تبحث عنه؟',
      searchResults: 'نتائج البحث',
      emptyState: 'عن ماذا تريد أن تبحث؟ اكتب سؤالك وسأساعدك في العثور على إجابة',
      footer: 'الباحث الذكي - جميع الحقوق محفوظة ©',
      translationCredit: 'تمت الترجمة بكل حب ♥️ من البحرين 🇧🇭 | بواسطة: ',
      mitLicense: 'جميع الحقوق مفتوحة المصدر ومرخصة بموجب رخصة MIT | وبجهود المطور '
    },
    en: {
      title: 'Smart Search - AI-Enhanced Search Engine',
      searchPlaceholder: 'What would you like to search for?',
      searchResults: 'Search Results',
      emptyState: 'What would you like to search for? Type your question and I\'ll help you find an answer',
      footer: 'Smart Search - All rights Reserved ©',
      translationCredit: 'Translated with love ♥️ from Bahrain 🇧🇭 | By: ',
      mitLicense: 'All rights are open source and licensed under the MIT license | Developed by '
    }
  };

  // --- AI Provider Selection: Persist and Immediate Effect ---
  const handleAIProviderChange = (provider: 'ollama' | 'groq') => {
    setAIProvider(provider);
    localStorage.setItem('aiProvider', provider);
    setResults([]);
    setAIResponse("");
    setShowAI(false);
    setError("");
  };

  const handleOllamaModelChange = (model: string) => {
    setOllamaModel(model);
    localStorage.setItem('ollamaModel', model);
    setResults([]);
    setAIResponse("");
    setShowAI(false);
    setError("");
  };

  const handleSourceChange = (src: SearchSource) => {
    setSource(src);
    setResults([]);
    setAIResponse("");
    setShowAI(false);
    setError("");
  };

  // Simulate search API (replace with real API call)
  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    setAIResponse("");
    setShowAI(false);
    try {
      // TODO: Replace with real search API
      const fakeResults: SearchResult[] = [
        {
          title: 'مثال نتيجة بحث',
          link: 'https://open-research.ai',
          snippet: 'هذه نتيجة بحث تجريبية.'
        }
      ];
      setResults(fakeResults);
      // Log search to SQLite (only if running in Node.js/Electron)
      if (typeof window === 'undefined' && logSearch) {
        try {
          logSearch(query, source, aiProvider);
        } catch (e) {
          // Ignore if not supported
        }
      }
      // Introduce a delay before calling AI to allow initial results to render
      setTimeout(async () => {
        try {
          const aiText = await generateAIResponse(query, fakeResults, source, aiProvider as 'ollama' | 'groq', ollamaModel);
          setAIResponse(aiText);
          setShowAI(true);
        } catch (aiError: any) {
          setError(aiError.message || 'Error generating AI response.');
        }
      }, 500); // 500ms delay
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء البحث.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-b from-[#F0F2F5] to-white dark:from-dark-bg dark:to-dark-surface ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <header className="w-full py-4 px-4 flex items-center justify-between bg-white/80 dark:bg-dark-bg/80 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <img src="/images/oo-ai.png" alt="OpenResearch Logo" className="h-10 w-10 rounded-full shadow" />
          <span className="font-bold text-xl tracking-widest text-[#1877F2]">OPENRESEARCH.AI</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 flex-grow dark:bg-dark-bg dark:text-dark-text openresearch-header animate-on-load">
        <div className="max-w-3xl mx-auto">
          <ErrorBoundary>
            <AIProviderSelector
              selectedProvider={aiProvider === 'ollama_qwen3' ? 'ollama' : aiProvider}
              onProviderChange={handleAIProviderChange}
              ollamaStatusIndicator={aiProvider === 'ollama' ? (
                <OllamaStatusIndicator selectedModel={ollamaModel} onModelChange={handleOllamaModelChange} />
              ) : null}
            />
            <SourceSelector selectedSource={source} onSourceChange={handleSourceChange} />
            <SearchBar query={query} onQueryChange={setQuery} onSearch={handleSearch} isLoading={loading} />
            <ProcessingOverlay isVisible={loading} message={language === 'ar' ? 'جاري التحميل...' : 'Loading...'} />
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-4 my-6 text-center animate-pulse">
                {error}
              </div>
            )}
            {/* AI Response */}
            {showAI && aiResponse && (
              <AIResponse response={aiResponse} />
            )}
            {/* Search Results */}
            {results.length > 0 && !loading && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 dark:text-dark-text">
                  {translations[language]?.searchResults || 'نتائج البحث'}
                </h2>
                <SearchResults results={results} source={source} />
              </>
            )}
            {/* Empty State */}
            {!loading && !results.length && !error && (
              <div className="text-center py-12 animate-fade-in">
                <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {translations[language]?.emptyState || 'ابدأ البحث الآن!'}
                </p>
              </div>
            )}
          </ErrorBoundary>
        </div>
      </main>
      {/* Footer */}
      <footer className="sticky dark:border-dark-surface inset-x-0 bottom-0 bg-slate-950 bg-opacity-90 animate-on-load">
        <div className="container mx-auto px-4 py-6 text-center text-xs" id="footer-pane">
          <p className="text-gray-500 dark:text-dark-text text-xs">
            {translations[language]?.footer || 'جميع الحقوق محفوظة'} {new Date().getFullYear()}
          </p>
          <p className="text-gray-500 dark:text-dark-text">
            {translations[language]?.translationCredit}<a href="https://github.com/aldoyh" className="text-[#1877F2] dark:text-blue-400">aldoyh</a>
          </p>
          <p className="text-gray-500 dark:text-dark-text">
            {translations[language]?.mitLicense}<a href="https://github.com/Justmalhar/OpenResearch" target="_blank" rel="noopener noreferrer" className="text-[#1877F2] dark:text-blue-400">Justmalhar</a>
          </p>
          <p className="text-gray-500 dark:text-dark-text letter-spacing-8">
            OPENRESEARCH.AI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
