import React from 'react';
import ReactDOM from 'react-dom/client'; // Asegúrate de usar ReactDOM v18
import App from './App';
import './index.css'; // O cualquier archivo de estilo global

const rootElement = document.getElementById('root'); // Obtén el contenedor 'root'
const root = ReactDOM.createRoot(rootElement); // Para React 18 o superior

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
