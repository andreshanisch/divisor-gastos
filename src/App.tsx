import EventHeader from './components/EventHeader';
import Expenses from './components/Expenses';
import Participants from './components/Participants';
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
  const [evento, actualizar] = useEventState();

  return (
    <main className="app">
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
    </main>
  );
}
