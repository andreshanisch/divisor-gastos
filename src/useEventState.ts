import { useCallback, useEffect, useRef, useState } from 'react';
import { loadEvent, saveEvent } from './storage';
import type { EventState } from './logic/types';

// `update` se ejecuta de forma síncrona en quien llama: si tira (p. ej. validaciones
// de logic/event.ts), el error le llega a ese llamador y el estado queda sin cambios.
export function useEventState(): [EventState, (update: (e: EventState) => EventState) => void] {
  const [evento, setEvento] = useState<EventState>(() => loadEvent());
  const ultimo = useRef(evento);

  useEffect(() => {
    saveEvent(evento);
  }, [evento]);

  const actualizar = useCallback((update: (e: EventState) => EventState) => {
    const siguiente = update(ultimo.current);
    ultimo.current = siguiente;
    setEvento(siguiente);
  }, []);

  return [evento, actualizar];
}
