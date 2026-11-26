import type { Cents } from './types';

// Reparte `amount` en partes iguales entre `orderedIds`; el sobrante
// se da de a un centavo a los primeros de la lista.
export function splitExpense(amount: Cents, orderedIds: string[]): Map<string, Cents> {
  const n = orderedIds.length;
  const base = Math.floor(amount / n);
  const resto = amount % n;
  const result = new Map<string, Cents>();
  orderedIds.forEach((id, i) => result.set(id, base + (i < resto ? 1 : 0)));
  return result;
}
