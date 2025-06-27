// index.js
// Entry point of the React app. This file mounts the App component to the root DOM node.

import React from 'react';                      // Import React for JSX rendering
import ReactDOM from 'react-dom/client';        // ReactDOM for mounting the app
import App from './App';                        // Main App component
import './index.css';                           // Global styles

const root = ReactDOM.createRoot(document.getElementById('root')); // Create root for React 18+

root.render(
  <React.StrictMode>   
    <App />             
  </React.StrictMode>
);
