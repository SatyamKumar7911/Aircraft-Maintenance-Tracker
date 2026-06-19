import React, { createContext, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDarkMode } from '../hooks/useDarkMode';

export const ThemeContext = createContext();

export const AppThemeProvider = ({ children }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0'
          },
          secondary: {
            main: '#0d47a1',
            light: '#1a73e8',
            dark: '#0d47a1'
          },
          success: {
            main: '#2e7d32',
            light: '#4caf50',
            dark: '#1b5e20'
          },
          warning: {
            main: '#ed6c02',
            light: '#ff9800',
            dark: '#e65100'
          },
          error: {
            main: '#d32f2f',
            light: '#f44336',
            dark: '#c62828'
          },
          background: {
            default: isDarkMode ? '#121212' : '#fafafa',
            paper: isDarkMode ? '#1e1e1e' : '#ffffff'
          },
          text: {
            primary: isDarkMode ? '#ffffff' : '#000000',
            secondary: isDarkMode ? '#b0b0b0' : '#666666'
          }
        },
        typography: {
          fontFamily: 'Roboto, sans-serif',
          h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            letterSpacing: '-0.015625em'
          },
          h2: {
            fontSize: '2rem',
            fontWeight: 700,
            letterSpacing: '-0.0083333333em'
          },
          h3: {
            fontSize: '1.75rem',
            fontWeight: 500
          },
          h4: {
            fontSize: '1.5rem',
            fontWeight: 500
          },
          h5: {
            fontSize: '1.25rem',
            fontWeight: 500
          },
          h6: {
            fontSize: '1rem',
            fontWeight: 500
          }
        },
        shape: {
          borderRadius: 8
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: isDarkMode
                  ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                  : '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: isDarkMode
                    ? '0 8px 24px rgba(0, 0, 0, 0.4)'
                    : '0 8px 24px rgba(0, 0, 0, 0.15)'
                }
              }
            }
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 8,
                padding: '10px 24px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              },
              contained: {
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
                }
              }
            }
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 600
              }
            }
          }
        }
      }),
    [isDarkMode]
  );

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
