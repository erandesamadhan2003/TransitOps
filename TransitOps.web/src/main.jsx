import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import api from '@/api/axios'
import { registerInterceptors } from '@/api/interceptors'

// Register axios interceptors once before rendering
registerInterceptors(api)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
