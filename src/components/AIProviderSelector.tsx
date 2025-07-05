import React from 'react';


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
        <div className="flex flex-col gap-2 my-4">
            <label className="text-lg font-medium mb-2">AI Provider</label>
            <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="ai-provider"
                        value="ollama"
                        checked={selectedProvider === 'ollama'}
                        onChange={() => onProviderChange('ollama')}
                        className="w-4 h-4 text-blue-600"
                    />
                    <span>Ollama (Mistral)</span>
                    {ollamaStatusIndicator}
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="ai-provider"
                        value="groq"
                        checked={selectedProvider === 'groq'}
                        onChange={() => onProviderChange('groq')}
                        className="w-4 h-4 text-blue-600"
                    />
                    <span>Groq</span>
                    {groqStatusIndicator}
                </label>
            </div>
        </div>
    );
}