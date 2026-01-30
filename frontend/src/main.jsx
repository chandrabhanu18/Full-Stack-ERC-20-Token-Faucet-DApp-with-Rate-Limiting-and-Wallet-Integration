import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './utils/eval'

import './index.css'

if (window.location.pathname !== '/health') {
  createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

