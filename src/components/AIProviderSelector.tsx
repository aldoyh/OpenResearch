import React from 'react';

interface AIProviderSelectorProps {
    selectedProvider: 'ollama' | 'groq';
    onProviderChange: (provider: 'ollama' | 'groq') => void;
}

export function AIProviderSelector({ selectedProvider, onProviderChange }: AIProviderSelectorProps) {
    return (
        <div className="flex flex-col gap-2 my-4">
            <label className="text-lg font-medium mb-2">AI Provider</label>
            <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="ai-provider"
                        value="ollama"
                        checked={selectedProvider === 'ollama'}
                        onChange={(e) => onProviderChange('ollama')}
                        className="w-4 h-4 text-blue-600"
                    />
                    <span>Ollama (Mistral)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="ai-provider"
                        value="groq"
                        checked={selectedProvider === 'groq'}
                        onChange={(e) => onProviderChange('groq')}
                        className="w-4 h-4 text-blue-600"
                    />
                    <span>Groq</span>
                </label>
            </div>
        </div>
    );
}