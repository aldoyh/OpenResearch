import { SearchResult } from '../../types';

export function WebResult({ result }: { result: SearchResult }) {
  // Type guard for WebResult
  if (!('snippet' in result)) return null;
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-dark-surface">
      <a href={result.link} target="_blank" rel="noopener noreferrer" className="block">
        <h3 className="text-lg font-semibold text-[#1877F2] mb-2 hover:underline dark:text-blue-400">
          {result.title}
        </h3>
        <p className="text-gray-600 mb-3 dark:text-gray-300">{result.snippet}</p>
        <span className="text-sm text-green-700 hover:underline mt-2 block dark:text-green-400">
          {result.link}
        </span>
      </a>
    </div>
  );
}