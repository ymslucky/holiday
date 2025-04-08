import {Language, Translation} from '@/types';

export const translations: Record<Language, Translation> = {
    zh: {
        holiday: '节假日',
        tx: '调休',
        weekend: '周末',
        today: '今天',
        month: '月',
        year: '年',
        language: '中文',
        theme: '主题',
        light: '浅色',
        dark: '深色',
        system: '跟随系统',
    },
    en: {
        holiday: 'Holiday',
        tx: 'Workday',
        weekend: 'Weekend',
        today: 'Today',
        month: 'Month',
        year: 'Year',
        language: 'English',
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        system: 'System',
    },
}; 