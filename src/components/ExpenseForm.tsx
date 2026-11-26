import { useState, type CSSProperties } from 'react';
import { formatARS, parseAmount } from '../logic/money';
import type { EventState, Expense } from '../logic/types';
import { colorDe } from '../ui/colors';

interface Props {
  event: EventState;
  initial?: Expense;
  onSave: (x: Omit<Expense, 'id'>) => void;
  onCancel: () => void;
}

export default function ExpenseForm({ event, initial, onSave, onCancel }: Props) {
  const [descripcion, setDescripcion] = useState(initial?.description ?? '');
  // Al editar se precarga el monto formateado, sin el "$".
  const [montoTexto, setMontoTexto] = useState(initial ? formatARS(initial.amount).slice(1) : '');
  const [pagadorId, setPagadorId] = useState(initial?.payerId ?? event.participants[0]?.id ?? '');
  const [marcados, setMarcados] = useState<string[]>(
    initial?.participantIds ?? event.participants.map((p) => p.id),
  );
  const [error, setError] = useState<string | null>(null);

  // El pagador efectivo: si el elegido ya no está (o nunca hubo), cae al primero que quede.
  const pagadorEfectivo = event.participants.some((p) => p.id === pagadorId)
    ? pagadorId
    : (event.participants[0]?.id ?? '');

  function alternar(id: string) {
    setMarcados((actuales) => (actuales.includes(id) ? actuales.filter((x) => x !== id) : [...actuales, id]));
  }

  function guardar() {
    const monto = parseAmount(montoTexto);
    if (monto === null) {
      setError('Escribí un monto válido, por ejemplo 18.000,50');
      return;
    }
    try {
      onSave({
        description: descripcion,
        amount: monto,
        payerId: pagadorEfectivo,
        // Siempre en el orden de carga de los participantes.
        participantIds: event.participants.filter((p) => marcados.includes(p.id)).map((p) => p.id),
      });
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <form
      className="gasto-form"
      onSubmit={(ev) => {
        ev.preventDefault();
        guardar();
      }}
    >
      <label>
        Descripción
        <input
          autoFocus={!initial}
          autoComplete="off"
          enterKeyHint="next"
          placeholder="Cena, nafta, súper…"
          value={descripcion}
          onChange={(ev) => setDescripcion(ev.target.value)}
        />
      </label>
      <label>
        Monto
        <input
          type="text"
          inputMode="decimal"
          placeholder="18.000,50"
          value={montoTexto}
          onChange={(ev) => setMontoTexto(ev.target.value)}
        />
      </label>
      <label>
        Pagó
        <select value={pagadorEfectivo} onChange={(ev) => setPagadorId(ev.target.value)}>
          {event.participants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <fieldset className="entre">
        <legend>Entre quiénes</legend>
        <div className="entre-opciones">
          {event.participants.map((p) => (
            <label key={p.id} className="check" style={{ '--c': colorDe(event, p.id) } as CSSProperties}>
              <input type="checkbox" checked={marcados.includes(p.id)} onChange={() => alternar(p.id)} />
              {p.name}
            </label>
          ))}
        </div>
      </fieldset>
      {error && <p role="alert" className="error">{error}</p>}
      <div className="form-acciones">
        <button type="submit" className="boton-principal">Guardar</button>
        <button type="button" className="boton-secundario" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
