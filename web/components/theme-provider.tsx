'use client';

import { useEffect } from 'react';

const THEMES = [
  'default',
  'violet',
  'yellow',
  'blue',
  'green',
  'orange',
  'rose',
  'red',
  'black'
] as const;

type Theme = typeof THEMES[number];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 获取当前主题
    const colorTheme = localStorage.getItem('color-theme') as Theme || 'default';
    
    // 移除所有主题类
    THEMES.forEach(theme => {
      document.documentElement.classList.remove(`theme-${theme}`);
    });

    // 如果不是默认主题，添加对应的主题类
    if (colorTheme !== 'default') {
      document.documentElement.classList.add(`theme-${colorTheme}`);
    }

    // 动态加载主题CSS
    const loadThemeCSS = async (theme: Theme) => {
      if (theme === 'default') return;
      
      try {
        await import(`@/app/themes/globals-${theme}.css`);
        // CSS 模块会被自动处理
      } catch (error) {
        console.error(`Failed to load theme: ${theme}`, error);
      }
    };

    loadThemeCSS(colorTheme);
  }, []);

  return <>{children}</>;
} 