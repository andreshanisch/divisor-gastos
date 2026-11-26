import type { EventState, Expense } from './types';

export function createEvent(): EventState {
  return { version: 1, name: 'Nuevo evento', participants: [], expenses: [] };
}

export function renameEvent(e: EventState, name: string): EventState {
  const limpio = name.trim();
  return limpio === '' ? { ...e } : { ...e, name: limpio };
}

export function addParticipant(e: EventState, id: string, name: string): EventState {
  const limpio = name.trim();
  if (limpio === '') throw new Error('Escribí un nombre');
  const clave = limpio.toLowerCase();
  if (e.participants.some((p) => p.name.trim().toLowerCase() === clave)) {
    throw new Error('Ya hay alguien con ese nombre');
  }
  return { ...e, participants: [...e.participants, { id, name: limpio }] };
}

export function isParticipantInUse(e: EventState, id: string): boolean {
  return e.expenses.some((x) => x.payerId === id || x.participantIds.includes(id));
}

export function removeParticipant(e: EventState, id: string): EventState {
  if (isParticipantInUse(e, id)) throw new Error('Primero sacalo de sus gastos');
  return { ...e, participants: e.participants.filter((p) => p.id !== id) };
}

export function validateExpense(e: EventState, x: Omit<Expense, 'id'>): string | null {
  if (x.description.trim() === '') return 'Poné una descripción';
  if (!Number.isInteger(x.amount) || x.amount <= 0) return 'El monto tiene que ser mayor a 0';
  const ids = new Set(e.participants.map((p) => p.id));
  if (!ids.has(x.payerId)) return 'Elegí quién pagó';
  if (x.participantIds.length === 0) return 'Elegí al menos una persona';
  const repetidos = new Set(x.participantIds).size !== x.participantIds.length;
  if (repetidos || x.participantIds.some((id) => !ids.has(id))) {
    return 'Hay personas que no están en el evento';
  }
  return null;
}

export function addExpense(e: EventState, expense: Expense): EventState {
  const error = validateExpense(e, expense);
  if (error !== null) throw new Error(error);
  const nuevo = { ...expense, description: expense.description.trim() };
  return { ...e, expenses: [...e.expenses, nuevo] };
}

export function updateExpense(e: EventState, expense: Expense): EventState {
  if (!e.expenses.some((x) => x.id === expense.id)) throw new Error('No existe ese gasto');
  const error = validateExpense(e, expense);
  if (error !== null) throw new Error(error);
  const nuevo = { ...expense, description: expense.description.trim() };
  return { ...e, expenses: e.expenses.map((x) => (x.id === expense.id ? nuevo : x)) };
}

export function removeExpense(e: EventState, id: string): EventState {
  return { ...e, expenses: e.expenses.filter((x) => x.id !== id) };
}

// El gasto incluye a todos los participantes actuales del evento.
export function isSplitAmongAll(e: EventState, x: Expense): boolean {
  return e.participants.every((p) => x.participantIds.includes(p.id));
}
