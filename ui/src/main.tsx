import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/root.css'
import App from './App'

// Set initial theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
