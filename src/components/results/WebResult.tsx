import { SearchResult } from '../../types';
import { Repeat, PenTool, Save, Loader2, FileText, ExternalLink } from 'lucide-react';
import { extractContent, rephraseContent, rewriteContent, saveToMarkdown } from '../../services/contentProcessor';

export function WebResult({ result }: { result: SearchResult }) {
  // Type guard for WebResult
  if (!('snippet' in result)) return null;
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-dark-surface">
      <a href={result.link} target="_blank" rel="noopener noreferrer" className="block">
        <h3 className="text-lg font-semibold text-[#1877F2] mb-2 hover:underline dark:text-blue-400">
          {result.title}
          <ExternalLink className="w-4 h-4 opacity-50" />
        </h3>
        <p className="text-gray-600 mb-3 dark:text-gray-300">{result.snippet}</p>
        <span className="text-sm text-green-700 hover:underline mt-2 block dark:text-green-400">
          {result.link}
        </span>
      </a>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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

      {/* Processed Content Display */}
      {showProcessed && processedContent && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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