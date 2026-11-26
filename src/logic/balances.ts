import { splitExpense } from './split';
import type { Cents, EventState } from './types';

// Balance por participante (en orden de carga). Positivo = le deben.
export function computeBalances(event: EventState): Map<string, Cents> {
  const balances = new Map<string, Cents>();
  const order = new Map<string, number>();
  event.participants.forEach((p, i) => {
    balances.set(p.id, 0);
    order.set(p.id, i);
  });

  for (const expense of event.expenses) {
    balances.set(expense.payerId, (balances.get(expense.payerId) ?? 0) + expense.amount);
    // El sobrante se asigna según el orden de carga, no el de selección.
    const ordered = [...expense.participantIds].sort((x, y) => (order.get(x) ?? 0) - (order.get(y) ?? 0));
    for (const [id, share] of splitExpense(expense.amount, ordered)) {
      balances.set(id, (balances.get(id) ?? 0) - share);
    }
  }
  return balances;
}
