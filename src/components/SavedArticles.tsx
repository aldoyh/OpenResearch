import { useState, useEffect } from 'react';
import { BookMarked, Download, Trash2, X, Calendar, ExternalLink } from 'lucide-react';
import { getSavedArticles, deleteSavedArticle, downloadMarkdown } from '../services/contentProcessor';

interface SavedArticle {
  title: string;
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export function SavedArticles() {
  const [isOpen, setIsOpen] = useState(false);
  const [articles, setArticles] = useState<Record<string, SavedArticle>>({});
  const [selectedArticle, setSelectedArticle] = useState<{ filename: string; article: SavedArticle } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadArticles();
    }
  }, [isOpen]);

  const loadArticles = () => {
    const savedArticles = getSavedArticles();
    setArticles(savedArticles);
  };

  const handleDelete = (filename: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      deleteSavedArticle(filename);
      loadArticles();
      if (selectedArticle?.filename === filename) {
        setSelectedArticle(null);
      }
    }
  };

  const handleDownload = (filename: string, content: string) => {
    downloadMarkdown(content, filename);
  };

  const articleCount = Object.keys(articles).length;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-40 flex items-center gap-2"
        title="View Saved Articles"
      >
        <BookMarked className="w-6 h-6" />
        {articleCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {articleCount}
          </span>
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-surface rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <BookMarked className="w-6 h-6" />
                Saved Articles ({articleCount})
              </h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedArticle(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex">
              {/* Articles List */}
              <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                {articleCount === 0 ? (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No saved articles yet. Save articles using the Save button on search results.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {Object.entries(articles).map(([filename, article]) => (
                      <div
                        key={filename}
                        className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                          selectedArticle?.filename === filename ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                        onClick={() => setSelectedArticle({ filename, article })}
                      >
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(article.timestamp).toLocaleDateString()}
                        </div>
                        {article.metadata?.url && (
                          <a
                            href={article.metadata.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Original
                          </a>
                        )}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(filename, article.content);
                            }}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(filename);
                            }}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Article Preview */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedArticle ? (
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                      {selectedArticle.article.title}
                    </h1>
                    {selectedArticle.article.metadata && (
                      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Metadata</h3>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          {Object.entries(selectedArticle.article.metadata).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">{key}:</span>{' '}
                              {key === 'url' ? (
                                <a href={value as string} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                                  {value as string}
                                </a>
                              ) : Array.isArray(value) ? (
                                (value as any[]).join(', ')
                              ) : (
                                String(value)
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="prose dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300">
                        {selectedArticle.article.content}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    Select an article to view its content
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
