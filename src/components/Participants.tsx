import { useState } from 'react';
import { isParticipantInUse } from '../logic/event';
import type { EventState } from '../logic/types';

interface Props {
  event: EventState;
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
}

export default function Participants({ event, onAdd, onRemove }: Props) {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState<string | null>(null);

  // La lógica tira Error con mensaje listo para mostrar; el estado queda intacto.
  function intentar(accion: () => void): boolean {
    try {
      accion();
      setError(null);
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  }

  function agregar() {
    if (intentar(() => onAdd(nombre))) setNombre('');
  }

  return (
    <section>
      <h2>Participantes</h2>
      <ul className="chips">
        {event.participants.map((p) => {
          const enUso = isParticipantInUse(event, p.id);
          return (
            <li key={p.id} className="chip">
              <span>{p.name}</span>
              <button
                type="button"
                aria-label={`Quitar ${p.name}`}
                aria-disabled={enUso ? 'true' : undefined}
                onClick={() => intentar(() => onRemove(p.id))}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
      <form
        className="fila"
        onSubmit={(ev) => {
          ev.preventDefault();
          agregar();
        }}
      >
        <input
          aria-label="Nuevo participante"
          placeholder="Nombre"
          value={nombre}
          onChange={(ev) => setNombre(ev.target.value)}
        />
        <button type="submit" aria-label="Agregar participante">
          +
        </button>
      </form>
      {error && <p role="alert" className="error">{error}</p>}
    </section>
  );
}
