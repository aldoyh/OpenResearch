import React from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export function SearchBar({ query, onQueryChange, onSearch, isLoading }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[#1877F2]" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="ماذا تريد أن تبحث عنه؟"
          className="w-full pl-12 pr-20 py-5 text-lg rounded-2xl border border-gray-200 focus:border-[#1877F2] focus:ring-4 focus:ring-[#1877F2]/20 transition-all bg-white shadow-lg hover:shadow-xl text-right font-tajawal"
          dir="rtl"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          title="Search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-[#1877F2] to-[#0d5cb6] text-white rounded-xl hover:from-[#0d5cb6] hover:to-[#0a4a94] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
}