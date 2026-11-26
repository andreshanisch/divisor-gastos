import { useState } from 'react';
import { computeBalances } from '../logic/balances';
import { formatARS } from '../logic/money';
import { settle } from '../logic/settle';
import { formatShareText } from '../logic/share';
import type { EventState } from '../logic/types';

type Copia = { texto: string; estado: 'copiado' | 'manual' } | null;

export default function Result({ event }: { event: EventState }) {
  const [copia, setCopia] = useState<Copia>(null);
  // Se recalcula en cada render: es barato y evita datos desactualizados.
  const transfers = settle(computeBalances(event));
  const texto = formatShareText(event, transfers);
  const nombre = (id: string) => event.participants.find((p) => p.id === id)?.name ?? '?';

  // El estado vale solo mientras el texto no cambie; si cambia, se vuelve a intentar.
  const vigente = copia !== null && copia.texto === texto ? copia.estado : null;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopia({ texto, estado: 'copiado' });
    } catch {
      // Sin portapapeles (o permiso denegado): que lo copie a mano.
      setCopia({ texto, estado: 'manual' });
    }
  }

  return (
    <section aria-labelledby="titulo-resultado">
      <h2 id="titulo-resultado">Resultado</h2>
      {transfers.length === 0 ? (
        <p>No hay nada que saldar.</p>
      ) : (
        <ul className="transferencias" aria-label="Transferencias">
          {transfers.map((t) => (
            <li key={`${t.from}-${t.to}`} className="transferencia">
              <span>{`${nombre(t.from)} → ${nombre(t.to)}`}</span>
              <strong>{formatARS(t.amount)}</strong>
            </li>
          ))}
        </ul>
      )}
      <button type="button" onClick={copiar}>Copiar para WhatsApp</button>
      {vigente === 'copiado' && <p role="status" className="copiado">¡Copiado!</p>}
      {vigente === 'manual' && (
        <div className="copia-manual">
          <p>Copialo a mano:</p>
          <textarea readOnly autoFocus onFocus={(e) => e.currentTarget.select()} aria-label="Texto para copiar" value={texto} rows={Math.max(3, texto.split('\n').length)} />
        </div>
      )}
    </section>
  );
}
