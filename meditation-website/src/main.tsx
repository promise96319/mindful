import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './i18n'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import LoginModal from './components/LoginModal'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <App />
        <LoginModal />
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
)
