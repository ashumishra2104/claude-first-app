import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import App from './App.jsx';

const theme = {
  colors: {
    bg: '#F3F0FF',
    surface: '#FFFFFF',
    primary: '#6D28D9',
    primaryLight: '#8B5CF6',
    text: '#1E1B4B',
    textMuted: '#6B7280',
    border: '#E5E7EB',
    danger: '#EF4444',
    accents: [
      '#7C3AED', '#0D9488', '#DC4E41', '#D97706',
      '#0284C7', '#DB2777', '#059669', '#475569',
    ],
  },
  radii: { card: '18px', modal: '26px', pill: '999px' },
  shadows: {
    card: '0 2px 8px rgba(109,40,217,0.08)',
    cardHover: '0 8px 24px rgba(109,40,217,0.16)',
    float: '0 16px 48px rgba(109,40,217,0.22)',
  },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
