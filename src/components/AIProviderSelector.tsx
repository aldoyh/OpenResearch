import React from 'react';
import { Bot, Cpu, Cloud } from 'lucide-react';

interface AIProviderSelectorProps {
    selectedProvider: 'ollama' | 'groq';
    onProviderChange: (provider: 'ollama' | 'groq') => void;
    ollamaStatusIndicator?: React.ReactNode;
}

export function AIProviderSelector({ selectedProvider, onProviderChange, ollamaStatusIndicator }: AIProviderSelectorProps) {
    // Placeholder for future AI provider indicators
    // Example: Add a status indicator for Groq (simulate always green for now)
    const groqStatusIndicator = (
        <span className="ml-1 align-middle">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" title="Groq available"></span>
        </span>
    );

    return (
        <div className="flex flex-col gap-3 my-6">
            <label className="text-lg font-semibold text-gray-800 dark:text-gray-200">مقدم الخدمة الذكية</label>
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={() => onProviderChange('ollama')}
                    className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ${
                        selectedProvider === 'ollama'
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20">
                        <Cpu className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <div className="font-medium">Ollama</div>
                        <div className="text-xs opacity-80">تشغيل محلي</div>
                    </div>
                    {ollamaStatusIndicator}
                </button>
                
                <button
                    onClick={() => onProviderChange('groq')}
                    className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ${
                        selectedProvider === 'groq'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20">
                        <Cloud className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <div className="font-medium">Groq</div>
                        <div className="text-xs opacity-80">سحابة سريعة</div>
                    </div>
                    {groqStatusIndicator}
                </button>
            </div>
        </div>
    );
}