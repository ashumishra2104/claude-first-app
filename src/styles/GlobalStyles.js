import { createGlobalStyle, keyframes } from 'styled-components';

const bgShift = keyframes`
  0%   { background-position: 0% 0%; }
  50%  { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
`;

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background-color: #F3F0FF;
    background-image:
      radial-gradient(circle at 0% 0%, rgba(139,92,246,0.12) 0%, transparent 50%),
      radial-gradient(circle at 100% 100%, rgba(109,40,217,0.1) 0%, transparent 50%),
      radial-gradient(circle, rgba(109,40,217,0.05) 1px, transparent 1px);
    background-size: 100% 100%, 100% 100%, 28px 28px;
    background-attachment: fixed;
    color: ${({ theme }) => theme.colors.text};
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
    font-size: inherit;
  }

  input {
    font-family: inherit;
    font-size: inherit;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: rgba(109,40,217,0.25);
    border-radius: 999px;
  }
`;

export default GlobalStyles;
