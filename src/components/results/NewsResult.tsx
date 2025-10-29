import { useState } from 'react';
import { SearchResult } from '../../types';
import { Repeat, PenTool, Save, Loader2, FileText, ExternalLink } from 'lucide-react';
import { extractContent, rephraseContent, rewriteContent, saveToMarkdown } from '../../services/contentProcessor';

export function NewsResult({ result }: { result: SearchResult }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedContent, setProcessedContent] = useState<string | null>(null);
  const [processingType, setProcessingType] = useState<'rephrase' | 'rewrite' | null>(null);
  const [showProcessed, setShowProcessed] = useState(false);

  const handleRephrase = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProcessing(true);
    setProcessingType('rephrase');
    try {
      const content = await extractContent(result.link);
      const rephrased = await rephraseContent(content, result.title);
      setProcessedContent(rephrased);
      setShowProcessed(true);
    } catch (error) {
      console.error('Error rephrasing:', error);
      alert('Failed to rephrase content. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
    }
  };

  const handleRewrite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProcessing(true);
    setProcessingType('rewrite');
    try {
      const content = await extractContent(result.link);
      const rewritten = await rewriteContent(content, result.title);
      setProcessedContent(rewritten);
      setShowProcessed(true);
    } catch (error) {
      console.error('Error rewriting:', error);
      alert('Failed to rewrite content. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const contentToSave = processedContent || result.snippet || 'No content available';
      saveToMarkdown(contentToSave, result.title, {
        url: result.link,
        source: 'news',
        imageUrl: result.imageUrl,
        originalSnippet: result.snippet || ''
      });
      alert('Article saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save article. Please try again.');
    }
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col md:flex-row">
        {result.imageUrl && (
          <div className="w-full md:w-48 flex-shrink-0 h-48 md:h-auto">
            <img 
              src={result.imageUrl} 
              alt={result.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="p-6 flex-grow">
          <a href={result.link} target="_blank" rel="noopener noreferrer" className="block mb-4">
            <h3 className="text-lg font-semibold text-[#1877F2] dark:text-blue-400 mb-2 hover:underline flex items-center gap-2">
              {result.title}
              <ExternalLink className="w-4 h-4 opacity-50" />
            </h3>
            <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{result.snippet}</p>
          </a>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleRephrase}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Rephrase this article using AI"
            >
              {isProcessing && processingType === 'rephrase' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
              <span>Rephrase</span>
            </button>

            <button
              onClick={handleRewrite}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Rewrite this article using AI"
            >
              {isProcessing && processingType === 'rewrite' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PenTool className="w-4 h-4" />
              )}
              <span>Rewrite</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Save this article"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Processed Content Display */}
      {showProcessed && processedContent && (
        <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {processingType === 'rephrase' ? 'Rephrased Version' : 'Rewritten Version'}
            </h4>
            <button
              onClick={() => setShowProcessed(false)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Hide
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {processedContent}
          </div>
        </div>
      )}
    </div>
  );
}