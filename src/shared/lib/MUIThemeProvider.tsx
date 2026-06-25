'use client';

import { ReactNode, useMemo, useEffect, useState } from 'react';
import { ThemeProvider, createTheme, PaletteMode } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

interface MUIThemeProviderProps {
  children: ReactNode;
}

const THEME_CHANGE_EVENT = 'theme-mode-change';

export function MUIThemeProvider({ children }: MUIThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<PaletteMode>('light');

  useEffect(() => {
    // Check localStorage for saved theme
    const savedMode = localStorage.getItem('theme-mode') as PaletteMode | null;
    if (savedMode === 'dark' || savedMode === 'light') {
      setThemeMode(savedMode);
    } else {
      // Otherwise, detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeMode(prefersDark ? 'dark' : 'light');
    }

    // Listen for custom theme change events from useThemeMode
    const handleThemeChange = (e: any) => {
      setThemeMode(e.detail.mode);
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: themeMode,
        ...(themeMode === 'dark'
          ? {
              primary: {
                main: '#90caf9',
              },
              secondary: {
                main: '#f48fb1',
              },
              background: {
                default: '#0a0a0a',
                paper: '#1a1a1a',
              },
              text: {
                primary: '#ffffff',
                secondary: '#b0bec5',
              },
            }
          : {
              primary: {
                main: '#1976d2',
              },
              secondary: {
                main: '#dc004e',
              },
              background: {
                default: '#ffffff',
                paper: '#f5f5f5',
              },
              text: {
                primary: '#000000',
                secondary: '#666666',
              },
            }),
      },
      typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      },
      components: {
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: themeMode === 'dark' ? '#1a1a1a' : '#ffffff',
              color: themeMode === 'dark' ? '#ffffff' : '#000000',
            },
          },
        },
      },
    });
  }, [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: '100vw', height: '100vh', margin: 0, padding: 0, bgcolor: 'background.default', overflow: 'hidden', boxSizing: 'border-box' }}>
        {children}
      </Box>
    </ThemeProvider>
  );
}
