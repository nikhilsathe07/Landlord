import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './utils/i18n.js';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <App />
          <Toaster position="top-right" />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);