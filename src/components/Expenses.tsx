import { useState, type CSSProperties } from 'react';
import { isSplitAmongAll } from '../logic/event';
import { formatARS } from '../logic/money';
import type { EventState, Expense } from '../logic/types';
import { colorDe } from '../ui/colors';
import ExpenseForm from './ExpenseForm';
import Icon from './Icon';

interface Props {
  event: EventState;
  onAdd: (x: Omit<Expense, 'id'>) => void;
  onUpdate: (expense: Expense) => void;
  onRemove: (id: string) => void;
}

// Un solo formulario abierto a la vez: null = cerrado, 'nuevo' = alta, id = edición.
type Abierto = null | 'nuevo' | string;

export default function Expenses({ event, onAdd, onUpdate, onRemove }: Props) {
  const [abierto, setAbierto] = useState<Abierto>(null);
  const nombreDe = (id: string) => event.participants.find((p) => p.id === id)?.name ?? '?';
  const enEdicion = abierto && abierto !== 'nuevo' ? event.expenses.find((x) => x.id === abierto) : undefined;
  // Un id que ya no existe, o un alta sin participantes, cuenta como formulario cerrado.
  const formAbierto = (abierto === 'nuevo' && event.participants.length > 0) || enEdicion !== undefined;
  // Ajuste de estado durante el render (no un efecto): si quedó apuntando a algo que ya no existe, se cierra.
  if (abierto !== null && !formAbierto) setAbierto(null);

  function entre(x: Expense): string {
    if (isSplitAmongAll(event, x)) return 'entre: todos';
    const nombres = event.participants.filter((p) => x.participantIds.includes(p.id)).map((p) => p.name);
    return `entre: ${nombres.join(', ')}`;
  }

  return (
    <section className="seccion" aria-labelledby="titulo-gastos">
      <h2 id="titulo-gastos">Gastos</h2>
      <ul className="gastos" aria-label="Gastos">
        {event.expenses.map((x) => (
          <li
            key={x.id}
            className={x.id === abierto ? 'gasto gasto-editando' : 'gasto'}
            style={{ '--c': colorDe(event, x.payerId) } as CSSProperties}
          >
            <div className="gasto-info">
              <strong className="gasto-desc">{x.description}</strong>
              <span className="gasto-monto">{formatARS(x.amount)}</span>
              <span className="gasto-pago">
                <span className="punto" aria-hidden="true" />
                <span className="sr-solo">pagó </span>
                <span>{nombreDe(x.payerId)}</span>
              </span>
              <span className="gasto-entre">{entre(x)}</span>
            </div>
            <div className="gasto-acciones">
              <button
                type="button"
                className="icono-boton"
                aria-label={`Editar ${x.description}`}
                onClick={() => setAbierto(x.id)}
              >
                <Icon nombre="editar" />
              </button>
              <button
                type="button"
                className="icono-boton"
                aria-label={`Borrar ${x.description}`}
                onClick={() => {
                  if (window.confirm(`¿Borrar "${x.description}"?`)) onRemove(x.id);
                }}
              >
                <Icon nombre="borrar" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {event.expenses.length === 0 && !formAbierto && (
        <p className="vacio">
          {event.participants.length === 0
            ? 'Primero sumá a la gente; después cargás lo que pagó cada uno.'
            : 'Todavía no hay gastos.'}
        </p>
      )}
      {abierto === 'nuevo' && formAbierto && (
        <ExpenseForm
          event={event}
          onSave={(x) => {
            onAdd(x);
            setAbierto(null);
          }}
          onCancel={() => setAbierto(null)}
        />
      )}
      {enEdicion && (
        <ExpenseForm
          key={enEdicion.id}
          event={event}
          initial={enEdicion}
          onSave={(x) => {
            onUpdate({ ...x, id: enEdicion.id });
            setAbierto(null);
          }}
          onCancel={() => setAbierto(null)}
        />
      )}
      {!formAbierto && (
        // Fija abajo, al alcance del pulgar, sin importar cuántos gastos haya.
        <div className="barra-accion">
          <button
            type="button"
            className="boton-principal"
            disabled={event.participants.length === 0}
            onClick={() => setAbierto('nuevo')}
          >
            + Agregar gasto
          </button>
        </div>
      )}
    </section>
  );
}
