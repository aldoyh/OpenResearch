import { Loader2 } from 'lucide-react';

interface ProcessingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function ProcessingOverlay({ isVisible, message = 'جاري معالجة المحتوى...' }: ProcessingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-xl text-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" />
        <p className="text-gray-700 dark:text-gray-200 font-tajawal">{message}</p>
      </div>
    </div>
  );
}
