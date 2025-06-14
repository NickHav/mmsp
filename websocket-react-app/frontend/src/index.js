import React from 'react';
import ReactDOM from 'react-dom/client'; // Use the new ReactDOM client API
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(
  <BrowserRouter>
    <App />
    <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js"></script>
    
  </BrowserRouter>,
);