import { useState } from 'react';
import { isSplitAmongAll } from '../logic/event';
import { formatARS } from '../logic/money';
import type { EventState, Expense } from '../logic/types';
import ExpenseForm from './ExpenseForm';

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
    <section>
      <h2>Gastos</h2>
      <ul className="gastos" aria-label="Gastos">
        {event.expenses.map((x) => (
          <li key={x.id} className="gasto">
            <div className="gasto-info">
              <div className="fila gasto-linea">
                <strong>{x.description}</strong>
                <span>{formatARS(x.amount)}</span>
              </div>
              <div>{nombreDe(x.payerId)}</div>
              <div className="gasto-entre">{entre(x)}</div>
            </div>
            <button type="button" aria-label={`Editar ${x.description}`} onClick={() => setAbierto(x.id)}>
              ✎
            </button>
            <button type="button" aria-label={`Borrar ${x.description}`} onClick={() => onRemove(x.id)}>
              🗑
            </button>
          </li>
        ))}
      </ul>
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
        <button
          type="button"
          className="secundario"
          disabled={event.participants.length === 0}
          onClick={() => setAbierto('nuevo')}
        >
          + Agregar gasto
        </button>
      )}
    </section>
  );
}
