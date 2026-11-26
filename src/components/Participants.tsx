import { useState, type CSSProperties } from 'react';
import { isParticipantInUse } from '../logic/event';
import { formatARS } from '../logic/money';
import { computePaid } from '../logic/totals';
import type { EventState } from '../logic/types';
import { colorDe } from '../ui/colors';
import Animal from './Animal';
import BilleteFondo from './BilleteFondo';
import Icon from './Icon';

interface Props {
  event: EventState;
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
}

export default function Participants({ event, onAdd, onRemove }: Props) {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState<string | null>(null);
  const pagado = computePaid(event);
  // Una sola escala para todas las barras: la de quien más puso.
  const escala = Math.max(1, ...pagado.values());

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
    <section className="seccion" aria-labelledby="titulo-participantes">
      <h2 id="titulo-participantes">Participantes</h2>
      {event.participants.length > 0 && (
        <ul className="personas">
          {event.participants.map((p, i) => {
            const enUso = isParticipantInUse(event, p.id);
            const puso = pagado.get(p.id) ?? 0;
            const color = colorDe(event, p.id);
            return (
              <li key={p.id} className="persona" style={{ '--c': color } as CSSProperties}>
                <BilleteFondo
                  color={color}
                  motivo={(relleno) => <Animal indice={i} relleno={relleno} fondo={color} />}
                />
                <span className="persona-nombre">{p.name}</span>
                <button
                  type="button"
                  className="icono-boton persona-quitar"
                  aria-label={`Quitar ${p.name}`}
                  aria-disabled={enUso ? 'true' : undefined}
                  onClick={() => intentar(() => onRemove(p.id))}
                >
                  <Icon nombre="quitar" />
                </button>
                <span className="persona-puso">
                  <span className="persona-etiqueta">puso</span>
                  <span className="persona-numeral">{formatARS(puso)}</span>
                </span>
                <span className="barra" aria-hidden="true">
                  <span className="barra-relleno" style={{ width: `${(puso / escala) * 100}%` }} />
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <form
        className="sumar"
        onSubmit={(ev) => {
          ev.preventDefault();
          agregar();
        }}
      >
        <input
          aria-label="Nuevo participante"
          placeholder="Sumar a alguien"
          autoComplete="off"
          enterKeyHint="done"
          value={nombre}
          onChange={(ev) => setNombre(ev.target.value)}
        />
        <button type="submit" className="icono-boton icono-boton-lleno" aria-label="Agregar participante">
          <Icon nombre="mas" />
        </button>
      </form>
      {error && <p role="alert" className="error">{error}</p>}
    </section>
  );
}
