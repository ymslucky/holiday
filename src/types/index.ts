export type Language = 'zh' | 'en';

export type Theme = 'light' | 'dark';

export interface Translation {
    holiday: string;
    tx: string;
    weekend: string;
    today: string;
    month: string;
    year: string;
    language: string;
    theme: string;
    light: string;
    dark: string;
    system: string;
}

export interface ThemeConfig {
    name: string;
    background: string;
    text: string;
    holiday: string;
    tx: string;
    weekend: string;
    today: string;
    border: string;
    shadow: string;
} 