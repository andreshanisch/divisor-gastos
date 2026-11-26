import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@fontsource-variable/archivo/wdth.css';
import './styles.css';
import { aplicarTema, leerTema } from './ui/tema';

// El tema se aplica antes del primer dibujo, para que no haya un parpadeo claro.
aplicarTema(leerTema());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
