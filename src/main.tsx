import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker for Offline Mode
if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Ignored if service worker cannot be registered in certain iframes
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />);

