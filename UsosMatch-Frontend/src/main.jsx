import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Importujemy "Router"
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Otaczamy całą aplikację BrowserRouterem.
        Dzięki temu wszystkie komponenty w środku (App)
        będą wiedziały, na jakiej podstronie jesteśmy. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)