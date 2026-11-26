import EventHeader from './components/EventHeader';
import Participants from './components/Participants';
import { addParticipant, createEvent, removeParticipant, renameEvent } from './logic/event';
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
    </main>
  );
}
