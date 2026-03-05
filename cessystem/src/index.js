import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// This is the entry point of react project it relates to root.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
