import { Brain } from 'lucide-react';

/**
 * NOTE: This component is currently not in use.
 * AI Provider selection is handled through AIProviderSelector component.
 * This component is kept for potential future use.
 */

export function AIProviderSettings() {
  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-dark-surface shadow-sm hover:shadow-md transition-all"
        title="AI Provider Settings"
      >
        <Brain className="w-5 h-5 text-purple-600" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Settings
        </span>
      </button>
    </div>
  );
}
