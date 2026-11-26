import { useState } from 'react';
import type { EventState } from '../logic/types';

interface Props {
  event: EventState;
  onRename: (name: string) => void;
  onNewEvent: () => void;
}

export default function EventHeader({ event, onRename, onNewEvent }: Props) {
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState(event.name);

  function empezar() {
    setBorrador(event.name);
    setEditando(true);
  }

  // Guarda al confirmar (Enter) o al perder el foco; un nombre vacío se ignora en la lógica.
  function guardar() {
    onRename(borrador);
    setEditando(false);
  }

  return (
    <header className="encabezado">
      {editando ? (
        <form
          className="fila"
          onSubmit={(ev) => {
            ev.preventDefault();
            guardar();
          }}
        >
          <input
            aria-label="Nombre del evento"
            value={borrador}
            autoFocus
            onChange={(ev) => setBorrador(ev.target.value)}
            onBlur={guardar}
          />
        </form>
      ) : (
        <div className="fila">
          <h1>{event.name}</h1>
          <button type="button" aria-label="Editar nombre" onClick={empezar}>
            ✎
          </button>
        </div>
      )}
      <button
        type="button"
        className="secundario"
        onClick={() => {
          if (window.confirm('¿Borrar el evento actual y empezar uno nuevo?')) onNewEvent();
        }}
      >
        Nuevo evento
      </button>
    </header>
  );
}
