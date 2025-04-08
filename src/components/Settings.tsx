import {useState} from 'react';
import {translations} from '../config/translations';
import {themes} from '../config/themes';
import {Language, Theme} from '../types';
import {Globe, Palette} from 'lucide-react';

interface SettingsProps {
    language: Language;
    theme: Theme;
    onLanguageChange: (language: Language) => void;
    onThemeChange: (theme: Theme) => void;
}

export function Settings({language, theme, onLanguageChange, onThemeChange}: SettingsProps) {
    const [hoveredMenu, setHoveredMenu] = useState<'language' | 'theme' | null>(null);

    return (
        <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
            {/* 语言切换 */}
            <div
                className="relative group"
                onMouseEnter={() => setHoveredMenu('language')}
                onMouseLeave={() => setHoveredMenu(null)}
            >
                <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 transition-colors shadow-sm"
                    aria-label="切换语言"
                >
                    <Globe size={16} />
                    <span className="text-sm font-medium">{translations[language].language}</span>
                </button>
                <div className={`absolute right-0 mt-1 w-32 rounded-lg bg-white shadow-lg overflow-hidden transition-all duration-200 ${hoveredMenu === 'language' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    {Object.entries(translations).map(([lang, {language: langName}]) => (
                        <button
                            key={lang}
                            className={`w-full px-3 py-2 text-sm text-left transition-colors ${
                                language === lang
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                            onClick={() => onLanguageChange(lang as Language)}
                        >
                            {langName}
                        </button>
                    ))}
                </div>
            </div>

            {/* 主题切换 */}
            <div
                className="relative group"
                onMouseEnter={() => setHoveredMenu('theme')}
                onMouseLeave={() => setHoveredMenu(null)}
            >
                <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 transition-colors shadow-sm"
                    aria-label="切换主题"
                >
                    <Palette size={16} />
                    <span className="text-sm font-medium">{themes[theme].name}</span>
                </button>
                <div className={`absolute right-0 mt-1 w-32 rounded-lg bg-white shadow-lg overflow-hidden transition-all duration-200 ${hoveredMenu === 'theme' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    {Object.entries(themes).map(([th, {name}]) => (
                        <button
                            key={th}
                            className={`w-full px-3 py-2 text-sm text-left transition-colors ${
                                theme === th
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                            onClick={() => onThemeChange(th as Theme)}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
} 