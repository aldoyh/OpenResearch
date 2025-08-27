import React, { useState, useEffect } from 'react';
import { SearchResult, SearchSource } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { WebResult } from './results/WebResult';
import { ImageResult } from './results/ImageResult';
import { VideoResult } from './results/VideoResult';
import { PlaceResult } from './results/PlaceResult';
import { NewsResult } from './results/NewsResult';
import { ShoppingResult } from './results/ShoppingResult';
import { ScholarResult } from './results/ScholarResult';
import { processWebContent } from '../services/contentProcessor';
import { ProcessingOverlay } from './ProcessingOverlay';

interface SearchResultsProps {
  results: SearchResult[];
  source: SearchSource;
}

export function SearchResults({ results, source }: SearchResultsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedContent, setProcessedContent] = useState<string | null>(null);
  const [arabicContent, setArabicContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingResultId, setProcessingResultId] = useState<string | null>(null);

  useEffect(() => {
    console.log('SearchResults mounted with:', { results, source });
  }, [results, source]);

  const handleLinkClick = async (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingResultId(url); // Set the ID of the result being processed
    setError(null);

    try {
      const content = await processWebContent(url);
      setProcessedContent(content);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error processing content:', error);
    } finally {
      setIsProcessing(false);
    setProcessingResultId(null);
    }
  };

  const saveToMarkdown = (content: string, title: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `${title.slice(0, 30)}-${timestamp}.md`;
    const markdown = `# ${title}\n\n${content}`;

    try {
      localStorage.setItem(fileName, markdown);
      console.log('Saved to markdown:', fileName);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const processAndTranslate = async (result: SearchResult) => {
    setIsProcessing(true);
    setProcessingResultId(result.link); // Set the ID of the result being processed
    setError(null);
    const url = result.link;

    try {
      // First get the content
      const content = await processWebContent(url);

      // Extract title and body (you'll need to implement this based on your content structure)
      const title = content.match(/<h1>(.*?)<\/h1>/)?.[1] || 'Untitled';
      const body = content.replace(/<[^>]*>/g, '').trim();

      // Call X.AI API to translate and rewrite (implement this according to your API)
      const response = await fetch('YOUR_XAI_API_ENDPOINT', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `${title}\n\n${body}` })
      });

      const arabicVersion = await response.json();

      setProcessedContent(content);
      setArabicContent(arabicVersion);
      saveToMarkdown(arabicVersion, title);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error processing content:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getResultComponent = (result: SearchResult) => {
    switch (source) {
      case 'search':
        return <WebResult result={result} />;
      case 'images':
        return <ImageResult result={result} />;
      case 'videos':
        return <VideoResult result={result} />;
      case 'places':
        return <PlaceResult result={result} />;
      case 'news':
        return <NewsResult result={result} />;
      case 'shopping':
        return <ShoppingResult result={result} />;
      case 'scholar':
      case 'patents':
        return <ScholarResult result={result} />;
      default:
        return <WebResult result={result} />;
    }
  };

  const getGridClass = () => {
    switch (source) {
      case 'images':
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      case 'videos':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8';
      case 'shopping':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      default:
        return 'grid-cols-1';
    }
  };

  if (!results || results.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-500">
        No results found
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ProcessingOverlay isVisible={isProcessing} />

      {error && (
        <div className="text-red-500 dark:text-red-400 p-4">
          {error}
        </div>
      )}

      {processedContent ? (
        <div className="prose dark:prose-dark max-w-none">
          <div dangerouslySetInnerHTML={{ __html: processedContent }} />
          {arabicContent && (
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Arabic Version</h2>
              <div className="text-right" dir="rtl">{arabicContent}</div>
            </div>
          )}
        </div>
      ) : (
        <div className={`grid gap-6 ${getGridClass()}`}>
          <AnimatePresence>
            {results.map((result, index) => {
              const isCurrentResultProcessing = processingResultId === result.link;
              return (
                <motion.div
                  key={`${result.link}-${index}`}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                  className="h-full relative"
                >
                  <div className="flex gap-2">
                  <a
                    href={result.link}
                    onClick={(e) => handleLinkClick(e, result.link)}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <h3 className="text-lg font-semibold mb-2">{result.title}</h3>
                  </a>
                  <button
                    onClick={() => processAndTranslate(result)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-900"
                  >
                    Translate & Save
                  </button>
                </div>
                {getResultComponent(result)}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}