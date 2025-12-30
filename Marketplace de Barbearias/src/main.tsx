import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // Importe seu App
// Assumindo que seu CSS global (Tailwind) está sendo importado aqui:
import './styles/globals.css'; 

const rootElement = document.getElementById('root');

if (rootElement) {
  // Cria a "raiz" do React e renderiza o componente App
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}