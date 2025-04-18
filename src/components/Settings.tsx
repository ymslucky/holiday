import {useState, memo, useMemo, useCallback, ReactElement} from 'react';
import {translations} from '@/config/translations';
import {themes} from '@/config/themes';
import {Language, Theme} from '@/types';
import {Globe, Palette} from 'lucide-react';

interface SettingsProps {
    language: Language;
    theme: Theme;
    onLanguageChange: (language: Language) => void;
    onThemeChange: (theme: Theme) => void;
}

type HoveredMenuType = 'language' | 'theme' | null;

// 使用 memo 包装 Settings 组件
export const Settings = memo(function Settings({language, theme, onLanguageChange, onThemeChange}: SettingsProps): ReactElement {
    const [hoveredMenu, setHoveredMenu] = useState<HoveredMenuType>(null);

    // 使用 useCallback 优化事件处理函数
    const handleLanguageMouseEnter = useCallback((): void => setHoveredMenu('language'), []);
    const handleThemeMouseEnter = useCallback((): void => setHoveredMenu('theme'), []);
    const handleMouseLeave = useCallback((): void => setHoveredMenu(null), []);

    // 使用 useMemo 缓存语言选项
    const languageOptions = useMemo(() => 
        Object.entries(translations).map(([lang, {language: langName}]) => (
            <button
                key={lang}
                className={`w-full px-3 py-2 text-sm text-left transition-colors ${
                    language === lang
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => onLanguageChange(lang as Language)}
                type="button"
            >
                {langName}
            </button>
        )),
        [language, onLanguageChange]
    );

    // 使用 useMemo 缓存主题选项
    const themeOptions = useMemo(() => 
        Object.entries(themes).map(([th, {name}]) => (
            <button
                key={th}
                className={`w-full px-3 py-2 text-sm text-left transition-colors ${
                    theme === th
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => onThemeChange(th as Theme)}
                type="button"
            >
                {name}
            </button>
        )),
        [theme, onThemeChange]
    );

    // 使用 useMemo 缓存语言按钮文本
    const languageButtonText = useMemo(() => 
        translations[language].language,
        [language]
    );

    // 使用 useMemo 缓存主题按钮文本
    const themeButtonText = useMemo(() => 
        themes[theme].name,
        [theme]
    );

    return (
        <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
            {/* 语言切换 */}
            <div
                className="relative group"
                onMouseEnter={handleLanguageMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 transition-colors shadow-sm"
                    aria-label="切换语言"
                    type="button"
                >
                    <Globe size={16}/>
                    <span className="text-sm font-medium">{languageButtonText}</span>
                </button>
                <div
                    className={`absolute right-0 mt-1 w-32 rounded-lg bg-white shadow-lg overflow-hidden transition-all duration-200 ${hoveredMenu === 'language' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    {languageOptions}
                </div>
            </div>

            {/* 主题切换 */}
            <div
                className="relative group"
                onMouseEnter={handleThemeMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 transition-colors shadow-sm"
                    aria-label="切换主题"
                    type="button"
                >
                    <Palette size={16}/>
                    <span className="text-sm font-medium">{themeButtonText}</span>
                </button>
                <div
                    className={`absolute right-0 mt-1 w-32 rounded-lg bg-white shadow-lg overflow-hidden transition-all duration-200 ${hoveredMenu === 'theme' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    {themeOptions}
                </div>
            </div>
        </div>
    );
}); 