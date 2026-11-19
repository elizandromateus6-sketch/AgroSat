import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { FarmProvider } from './contexts/FarmContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <FarmProvider>
        <App />
      </FarmProvider>
    </ErrorBoundary>
  </StrictMode>,
);
