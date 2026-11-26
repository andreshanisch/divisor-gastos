import { useCallback, useEffect, useState } from 'react';
import { aplicarTema, guardarTema, leerTema, type Tema } from './ui/tema';

export function useTema(): [Tema, () => void] {
  const [tema, setTema] = useState<Tema>(() => leerTema());

  useEffect(() => {
    aplicarTema(tema);
  }, [tema]);

  const alternar = useCallback(() => {
    setTema((actual) => {
      const siguiente: Tema = actual === 'oscuro' ? 'claro' : 'oscuro';
      guardarTema(siguiente);
      return siguiente;
    });
  }, []);

  return [tema, alternar];
}
