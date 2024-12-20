import { Sun, Moon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function ThemeToggle() {
    const { isDarkMode, toggleDarkMode, language } = useApp();

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
            title={language === 'ar' ? 'تبديل المظهر' : 'Toggle theme'}
        >
            {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
                <Moon className="w-5 h-5 text-gray-600" />
            )}
        </button>
    );
}