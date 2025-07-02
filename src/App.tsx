import { useState, useEffect } from "react";
import { SearchSource, SearchResult } from "./types";
import { searchSerper, generateAIResponse } from "./services/api";
import { SearchBar } from "./components/SearchBar";
import { SourceSelector } from "./components/SourceSelector";
import { SearchResults } from "./components/SearchResults";
import { AIResponse } from "./components/AIResponse";
import { Globe } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageToggle } from './components/LanguageToggle';
import { AIProviderSelector } from './components/AIProviderSelector';
import { useApp } from './contexts/AppContext';

export function App() {
  const { language, aiProvider, setAIProvider } = useApp();
  console.log('App Context:', { language, aiProvider });
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<SearchSource>("search");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiResponse, setAIResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSourceChange = (newSource: SearchSource) => {
    setSource(newSource);
    setResults([]);
    setAIResponse("");
    setError("");
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      console.log('Search query is empty');
      return;
    }

    setLoading(true);
    setError("");

    try {
      const searchResults = await searchSerper(query, source);
      setResults(searchResults);

      const response = await generateAIResponse(query, searchResults, source);
      setAIResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Rendering App with state:', { query, source, results, aiResponse, loading, error });
  }, [query, source, results, aiResponse, loading, error]);

  console.log('Rendering App with state:', { query, source, results, aiResponse, loading, error });
  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-b from-[#F0F2F5] to-white dark:from-dark-bg dark:to-dark-surface ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-dark-surface shadow-sm animate-on-load">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-[#1877F2] dark:text-blue-400 text-right mb-4 font-tajawal">
              {translations[language].title}
            </h1>
            <div className="flex items-center gap-4">
              <AIProviderSelector
                selectedProvider={aiProvider as "ollama" | "groq"}
                onProviderChange={setAIProvider}
              />
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <LanguageToggle />
              </div>
            </div>
            <Analytics />
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              onSearch={handleSearch}
              isLoading={loading}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex-grow dark:bg-dark-bg dark:text-dark-text openresearch-header animate-on-load">
        <div className="max-w-6xl mx-auto">
          {/* Source Selector */}
          <SourceSelector
            selectedSource={source}
            onSourceChange={handleSourceChange}
          />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-right">
              {error === 'Failed to fetch search results' ? 'فشل في جلب نتائج البحث' : error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1877F2]"></div>
            </div>
          )}

          {/* Results */}
          <div className="space-y-6">
            {aiResponse && !loading && <AIResponse response={aiResponse} />}

            {results.length > 0 && !loading && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {translations[language].searchResults}
                </h2>
                <SearchResults results={results} source={source} />
              </>
            )}

            {/* Empty State */}
            {!loading && !results.length && !error && (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {translations[language].emptyState}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky dark:border-dark-surface inset-x-0 bottom-0 bg-slate-950 bg-opacity-90 animate-on-load">
        <div className="container mx-auto px-4 py-6 text-center text-xs" id="footer-pane">
          <p className="text-gray-500 dark:text-dark-text text-xs">
            {translations[language].footer} {new Date().getFullYear()}
          </p>
          <p className="text-gray-500 dark:text-dark-text">
            {translations[language].translationCredit}<a href="https://github.com/aldoyh" className="text-[#1877F2] dark:text-blue-400">aldoyh</a>
          </p>
          <p className="text-gray-500 dark:text-dark-text">
            {translations[language].mitLicense}<a href="https://github.com/Justmalhar/OpenResearch" target="_blank" rel="noopener noreferrer" className="text-[#1877F2] dark:text-blue-400">Justmalhar</a>
          </p>
          <p className="text-gray-500 dark:text-dark-text letter-spacing-8">
            OPENRESEARCH.AI
          </p>
        </div>
      </footer>

      {/* Saved Articles Floating Button */}
      <SavedArticles />

      <Analytics />
    </div>
  );
}

export default App;
