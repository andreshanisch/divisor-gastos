import type { Cents, EventState } from './types';

// Total gastado en el evento, en centavos.
export function totalSpent(event: EventState): Cents {
  return event.expenses.reduce((suma, x) => suma + x.amount, 0);
}

// Lo que pagó cada participante, en orden de carga (incluye a quien no pagó nada).
export function computePaid(event: EventState): Map<string, Cents> {
  const pagado = new Map<string, Cents>(event.participants.map((p) => [p.id, 0]));
  for (const x of event.expenses) {
    if (pagado.has(x.payerId)) pagado.set(x.payerId, (pagado.get(x.payerId) ?? 0) + x.amount);
  }
  return pagado;
}
