import React from 'react';
import { SearchResult } from '../../types';

export function WebResult({ result }: { result: SearchResult }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
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