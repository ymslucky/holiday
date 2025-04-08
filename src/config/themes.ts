import {Theme, ThemeConfig} from '../types';

export const themes: Record<Theme, ThemeConfig> = {
  light: {
    name: '浅色',
    background: '#ffffff',
    text: '#000000',
    holiday: '#ff4d4f',
    tx: '#ffa940',
    weekend: '#ffa940',
    today: '#1890ff',
    border: '#d9d9d9',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  dark: {
    name: '深色',
    background: '#141414',
    text: '#ffffff',
    holiday: '#ff7875',
    tx: '#ffc069',
    weekend: '#ffc069',
    today: '#69c0ff',
    border: '#434343',
    shadow: 'rgba(0, 0, 0, 0.2)'
  }
};

export type Theme = keyof typeof themes;
export type ThemeValue = typeof themes['light']; 