import { useState, type CSSProperties } from 'react';
import { formatARS } from '../logic/money';
import { totalSpent } from '../logic/totals';
import type { EventState } from '../logic/types';
import BilleteFondo from './BilleteFondo';
import Icon from './Icon';
import Monedas from './Monedas';

// La tinta del billete mayor (igual a --tinta en styles.css).
const TINTA = '#1e2a24';

interface Props {
  event: EventState;
  onRename: (name: string) => void;
  onNewEvent: () => void;
}

export default function EventHeader({ event, onRename, onNewEvent }: Props) {
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState(event.name);
  const total = totalSpent(event);
  const personas = event.participants.length;
  const gastos = event.expenses.length;

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
    <header className="billete">
      <BilleteFondo
        color={TINTA}
        ancho={178}
        lado="derecha"
        opacidad={0.5}
        motivo={(relleno) => <Monedas relleno={relleno} fondo={TINTA} />}
      />
      <div className="billete-cabeza">
        {editando ? (
          <form
            className="billete-nombre"
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
          <div className="billete-nombre">
            <h1>{event.name}</h1>
            <button type="button" className="icono-boton" aria-label="Editar nombre" onClick={empezar}>
              <Icon nombre="editar" />
            </button>
          </div>
        )}
        <button
          type="button"
          className="boton-texto"
          onClick={() => {
            if (window.confirm('¿Borrar el evento actual y empezar uno nuevo?')) onNewEvent();
          }}
        >
          Nuevo evento
        </button>
      </div>
      <p
        className="billete-total"
        aria-label={`Total gastado: ${formatARS(total)}`}
        // Los totales largos achican el numeral para que no pise la marca de agua.
        style={{ '--largo': Math.max(7, formatARS(total).length - 1) } as CSSProperties}
      >
        <span className="billete-signo">$</span>
        {formatARS(total).slice(1)}
      </p>
      <p className="billete-pie">
        {personas === 0
          ? 'Sumá a la gente para empezar'
          : `gastado entre ${personas} ${personas === 1 ? 'persona' : 'personas'} · ${gastos} ${gastos === 1 ? 'gasto' : 'gastos'}`}
      </p>
    </header>
  );
}
