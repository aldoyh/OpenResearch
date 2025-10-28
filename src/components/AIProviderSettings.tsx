import { useState, useEffect } from 'react';
import { Brain, Check, AlertCircle } from 'lucide-react';
import {
  AIProvider,
  checkOllamaAvailability,
  fetchOllamaModels,
  getAIProvider,
  setAIProvider,
} from '../services/api';

const GROQ_MODELS = [
  'mixtral-8x7b-32768',
  'llama2-70b-4096',
  'gemma-7b-it',
];

export function AIProviderSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<AIProvider>('groq');
  const [currentModel, setCurrentModel] = useState('');
  const [ollamaAvailable, setOllamaAvailable] = useState(false);
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentSettings();
  }, []);

  const loadCurrentSettings = async () => {
    setLoading(true);
    try {
      const { provider, model } = await getAIProvider();
      setCurrentProvider(provider);
      setCurrentModel(model);

      // Check Ollama availability
      const available = await checkOllamaAvailability();
      setOllamaAvailable(available);

      if (available) {
        const models = await fetchOllamaModels();
        setOllamaModels(models);
      }
    } catch (error) {
      console.error('[AISettings] Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderChange = async (provider: AIProvider) => {
    setCurrentProvider(provider);
    
    if (provider === 'ollama') {
      const models = ollamaModels.length > 0 ? ollamaModels : await fetchOllamaModels();
      const model = models[0] || 'mistral:latest';
      setCurrentModel(model);
      setAIProvider(provider, model);
    } else {
      const model = GROQ_MODELS[0];
      setCurrentModel(model);
      setAIProvider(provider, model);
    }
  };

  const handleModelChange = (model: string) => {
    setCurrentModel(model);
    setAIProvider(currentProvider, model);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-dark-surface shadow-sm hover:shadow-md transition-all"
        title="AI Provider Settings"
      >
        <Brain className="w-5 h-5 text-purple-600" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {currentProvider === 'ollama' ? 'Ollama' : 'Groq'}
        </span>
        <span
          className={`w-2 h-2 rounded-full ${
            currentProvider === 'ollama' && ollamaAvailable
              ? 'bg-green-500'
              : currentProvider === 'groq'
              ? 'bg-blue-500'
              : 'bg-red-500'
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-dark-surface rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              AI Provider Settings
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Ollama Option */}
                <div
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    currentProvider === 'ollama'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                  }`}
                  onClick={() => ollamaAvailable && handleProviderChange('ollama')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        Ollama (Local)
                      </span>
                      {ollamaAvailable ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  {!ollamaAvailable && (
                    <p className="text-xs text-red-600 dark:text-red-400 mb-2">
                      Not available. Make sure Ollama is running.
                    </p>
                  )}
                  {currentProvider === 'ollama' && ollamaModels.length > 0 && (
                    <select
                      value={currentModel}
                      onChange={(e) => handleModelChange(e.target.value)}
                      className="w-full mt-2 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {ollamaModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Groq Option */}
                <div
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    currentProvider === 'groq'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  }`}
                  onClick={() => handleProviderChange('groq')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        Groq (Cloud)
                      </span>
                      <Check className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                  {currentProvider === 'groq' && (
                    <select
                      value={currentModel}
                      onChange={(e) => handleModelChange(e.target.value)}
                      className="w-full mt-2 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {GROQ_MODELS.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Current: <strong>{currentProvider}</strong> - <strong>{currentModel}</strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
