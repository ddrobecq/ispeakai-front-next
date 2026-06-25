import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

const THEME_CHANGE_EVENT = 'theme-mode-change';

export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Check if user has a saved preference
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode | null;
    if (savedMode === 'dark' || savedMode === 'light') {
      setMode(savedMode);
    } else {
      // Otherwise, detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }

    // Listen for custom theme change events
    const handleThemeChange = (e: any) => {
      setMode(e.detail.mode);
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const newMode = e.matches ? 'dark' : 'light';
      setMode(newMode);
      localStorage.setItem('theme-mode', newMode);
      dispatchThemeChange(newMode);
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, []);

  const toggleMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', newMode);
      dispatchThemeChange(newMode);
      return newMode;
    });
  };

  return { mode, toggleMode, isMounted };
}

function dispatchThemeChange(mode: ThemeMode) {
  // Delay dispatch to avoid React rendering conflicts
  queueMicrotask(() => {
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { mode } }));
  });
}
