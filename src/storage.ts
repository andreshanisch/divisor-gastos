import { createEvent, validateExpense } from './logic/event';
import type { EventState } from './logic/types';

export const STORAGE_KEY = 'divisor-gastos:evento';

type Almacen = Pick<Storage, 'getItem' | 'setItem'>;

function esObjeto(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

function esArrayDeStrings(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((v) => typeof v === 'string');
}

// Valida a mano la forma y luego reutiliza validateExpense para las referencias.
function esEventoValido(x: unknown): x is EventState {
  if (!esObjeto(x) || x.version !== 1 || typeof x.name !== 'string') return false;
  if (!Array.isArray(x.participants) || !Array.isArray(x.expenses)) return false;

  const ids = new Set<string>();
  for (const p of x.participants) {
    if (!esObjeto(p) || typeof p.id !== 'string' || typeof p.name !== 'string') return false;
    if (ids.has(p.id)) return false;
    ids.add(p.id);
  }

  for (const g of x.expenses) {
    if (
      !esObjeto(g) ||
      typeof g.id !== 'string' ||
      typeof g.description !== 'string' ||
      typeof g.payerId !== 'string' ||
      typeof g.amount !== 'number' ||
      !esArrayDeStrings(g.participantIds)
    ) {
      return false;
    }
  }

  const evento = x as unknown as EventState;
  return evento.expenses.every((g) => validateExpense(evento, g) === null);
}

export function loadEvent(storage?: Almacen): EventState {
  try {
    // Tocar localStorage puede tirar (almacenamiento deshabilitado), por eso va dentro del try.
    const crudo = (storage ?? localStorage).getItem(STORAGE_KEY);
    if (crudo === null) return createEvent();
    const dato: unknown = JSON.parse(crudo);
    return esEventoValido(dato) ? dato : createEvent();
  } catch {
    return createEvent();
  }
}

export function saveEvent(e: EventState, storage?: Almacen): void {
  try {
    (storage ?? localStorage).setItem(STORAGE_KEY, JSON.stringify(e));
  } catch (error) {
    console.warn('No se pudo guardar el evento', error);
  }
}
