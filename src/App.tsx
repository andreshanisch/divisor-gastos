import EventHeader from './components/EventHeader';
import Expenses from './components/Expenses';
import Participants from './components/Participants';
import Result from './components/Result';
import {
  addExpense,
  addParticipant,
  createEvent,
  removeExpense,
  removeParticipant,
  renameEvent,
  updateExpense,
} from './logic/event';
import { useEventState } from './useEventState';

export default function App() {
  const [evento, actualizar, guardadoFallo] = useEventState();

  return (
    <main className="app">
      {guardadoFallo && (
        <p role="alert" className="aviso">
          No se pudo guardar en este navegador: si recargás la página se pierde lo cargado.
        </p>
      )}
      <EventHeader
        event={evento}
        onRename={(nombre) => actualizar((e) => renameEvent(e, nombre))}
        onNewEvent={() => actualizar(() => createEvent())}
      />
      <Participants
        event={evento}
        onAdd={(nombre) => actualizar((e) => addParticipant(e, crypto.randomUUID(), nombre))}
        onRemove={(id) => actualizar((e) => removeParticipant(e, id))}
      />
      <Expenses
        event={evento}
        onAdd={(x) => actualizar((e) => addExpense(e, { ...x, id: crypto.randomUUID() }))}
        onUpdate={(x) => actualizar((e) => updateExpense(e, x))}
        onRemove={(id) => actualizar((e) => removeExpense(e, id))}
      />
      <Result event={evento} />
    </main>
  );
}
