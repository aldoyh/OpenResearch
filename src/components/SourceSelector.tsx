import React from 'react';
import { Search, Image, Youtube, MapPin, Newspaper, ShoppingBag, BookOpen, FileText } from 'lucide-react';
import { SearchSource } from '../types';

interface SourceSelectorProps {
  selectedSource: SearchSource;
  onSourceChange: (source: SearchSource) => void;
}

export function SourceSelector({ selectedSource, onSourceChange }: SourceSelectorProps) {
  const sources: { id: SearchSource; label: string; icon: React.ReactNode }[] = [
    { id: 'search', label: 'الويب', icon: <Search className="w-5 h-5" /> },
    { id: 'images', label: 'الصور', icon: <Image className="w-5 h-5" /> },
    { id: 'videos', label: 'الفيديو', icon: <Youtube className="w-5 h-5" /> },
    { id: 'places', label: 'الأماكن', icon: <MapPin className="w-5 h-5" /> },
    { id: 'news', label: 'الأخبار', icon: <Newspaper className="w-5 h-5" /> },
    { id: 'shopping', label: 'التسوق', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'scholar', label: 'البحث العلمي', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'patents', label: 'براءات الاختراع', icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {sources.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => onSourceChange(id)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 ${
            selectedSource === id
              ? 'bg-gradient-to-r from-[#1877F2] to-[#0d5cb6] text-white shadow-lg'
              : 'bg-white text-[#65676B] hover:bg-gray-100 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20">
            {icon}
          </div>
          <span className="font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}