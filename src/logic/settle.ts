import type { Cents, Transfer } from './types';

// Transferencias para saldar (greedy): el mayor deudor paga al mayor acreedor.
// No muta el mapa de entrada.
export function settle(balances: Map<string, Cents>): Transfer[] {
  const debtors: { id: string; amount: Cents }[] = [];
  const creditors: { id: string; amount: Cents }[] = [];
  for (const [id, b] of balances) {
    if (b < 0) debtors.push({ id, amount: -b });
    else if (b > 0) creditors.push({ id, amount: b });
  }

  // Mayor monto; en empate, el primero en orden del mapa (índice más bajo).
  const indexOfMax = (list: { amount: Cents }[]): number => {
    let best = 0;
    for (let i = 1; i < list.length; i++) if (list[i].amount > list[best].amount) best = i;
    return best;
  };

  const transfers: Transfer[] = [];
  while (debtors.length > 0 && creditors.length > 0) {
    const di = indexOfMax(debtors);
    const ci = indexOfMax(creditors);
    const d = debtors[di];
    const c = creditors[ci];
    const amount = Math.min(d.amount, c.amount);
    transfers.push({ from: d.id, to: c.id, amount });
    d.amount -= amount;
    c.amount -= amount;
    if (d.amount === 0) debtors.splice(di, 1);
    if (c.amount === 0) creditors.splice(ci, 1);
  }
  return transfers;
}
