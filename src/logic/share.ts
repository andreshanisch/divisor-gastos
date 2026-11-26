import { formatARS } from './money';
import type { EventState, Transfer } from './types';

// Texto listo para pegar en WhatsApp: nombre del evento y una línea por transferencia.
export function formatShareText(event: EventState, transfers: Transfer[]): string {
  if (transfers.length === 0) return `${event.name}\n\nNo hay nada que saldar.`;
  const nombre = (id: string) => event.participants.find((p) => p.id === id)?.name ?? '?';
  const lineas = transfers.map((t) => `${nombre(t.from)} → ${nombre(t.to)}: ${formatARS(t.amount)}`);
  return `${event.name}\n\n${lineas.join('\n')}`;
}
