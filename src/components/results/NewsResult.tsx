import { SearchResult } from '../../types';
import { Repeat, PenTool, Save, Loader2, FileText, ExternalLink } from 'lucide-react';
import { extractContent, rephraseContent, rewriteContent, saveToMarkdown } from '../../services/contentProcessor';

export function NewsResult({ result }: { result: SearchResult }) {
  // Type guard for NewsResult
  if (!('snippet' in result && 'imageUrl' in result)) return null;
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex dark:bg-dark-surface">
      {result.imageUrl && (
        <div className="w-48 flex-shrink-0">
          <img 
            src={result.imageUrl} 
            alt={result.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}