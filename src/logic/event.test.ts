import { describe, it, expect } from 'vitest';
import {
  createEvent,
  renameEvent,
  addParticipant,
  isParticipantInUse,
  removeParticipant,
  addExpense,
  updateExpense,
  removeExpense,
  validateExpense,
  isSplitAmongAll,
} from './event';
import type { EventState, Expense } from './types';

function deepFreeze<T>(obj: T): T {
  if (obj && typeof obj === 'object') {
    Object.values(obj as object).forEach(deepFreeze);
    Object.freeze(obj);
  }
  return obj;
}

function baseEvent(): EventState {
  let e = createEvent();
  e = addParticipant(e, 'a', 'Ana');
  e = addParticipant(e, 'b', 'Beto');
  e = addParticipant(e, 'c', 'Caro');
  return e;
}

const gasto = (over: Partial<Expense> = {}): Expense => ({
  id: 'g1',
  description: 'Asado',
  amount: 3000,
  payerId: 'a',
  participantIds: ['a', 'b', 'c'],
  ...over,
});

describe('createEvent / renameEvent', () => {
  it('crea un evento vacío', () => {
    expect(createEvent()).toEqual({ version: 1, name: 'Nuevo evento', participants: [], expenses: [] });
  });
  it('renombra recortando espacios', () => {
    expect(renameEvent(createEvent(), '  Viaje  ').name).toBe('Viaje');
  });
  it('si el nombre queda vacío deja el anterior', () => {
    expect(renameEvent(createEvent(), '   ').name).toBe('Nuevo evento');
  });
});

describe('addParticipant', () => {
  it('agrega recortando el nombre', () => {
    const e = addParticipant(createEvent(), 'a', '  Ana ');
    expect(e.participants).toEqual([{ id: 'a', name: 'Ana' }]);
  });
  it('tira si el nombre está vacío', () => {
    expect(() => addParticipant(createEvent(), 'a', '   ')).toThrow('Escribí un nombre');
  });
  it('tira si el nombre está repetido sin distinguir mayúsculas ni bordes', () => {
    const e = addParticipant(createEvent(), 'a', 'Ana');
    expect(() => addParticipant(e, 'b', ' ANA ')).toThrow('Ya hay alguien con ese nombre');
  });
});

describe('quitar participantes', () => {
  it('no permite quitar a quien pagó un gasto', () => {
    const e = addExpense(baseEvent(), gasto({ participantIds: ['b'] }));
    expect(isParticipantInUse(e, 'a')).toBe(true);
    expect(() => removeParticipant(e, 'a')).toThrow('Primero sacalo de sus gastos');
  });
  it('no permite quitar a quien participa de un gasto sin haberlo pagado', () => {
    const e = addExpense(baseEvent(), gasto());
    expect(isParticipantInUse(e, 'b')).toBe(true);
    expect(() => removeParticipant(e, 'b')).toThrow('Primero sacalo de sus gastos');
  });
  it('permite quitarlo después de sacarlo del gasto (updateExpense) y de borrar el que pagó', () => {
    let e = addExpense(baseEvent(), gasto());
    e = updateExpense(e, gasto({ participantIds: ['a', 'c'] }));
    expect(removeParticipant(e, 'b').participants.map((p) => p.id)).toEqual(['a', 'c']);
    e = removeExpense(e, 'g1');
    expect(removeParticipant(e, 'a').participants.map((p) => p.id)).toEqual(['b', 'c']);
  });
  it('quitar un id inexistente devuelve un evento igual', () => {
    const e = baseEvent();
    expect(removeParticipant(e, 'zzz')).toEqual(e);
  });
});

describe('validateExpense', () => {
  const e = baseEvent();
  const { id: _id, ...ok } = gasto();

  it('devuelve null si es válido', () => {
    expect(validateExpense(e, ok)).toBeNull();
  });
  it('descripción vacía (tras recortar)', () => {
    expect(validateExpense(e, { ...ok, description: '   ' })).toBe('Poné una descripción');
  });
  it('monto no entero o menor o igual a 0', () => {
    const msg = 'El monto tiene que ser mayor a 0';
    expect(validateExpense(e, { ...ok, amount: 0 })).toBe(msg);
    expect(validateExpense(e, { ...ok, amount: -5 })).toBe(msg);
    expect(validateExpense(e, { ...ok, amount: 10.5 })).toBe(msg);
    expect(validateExpense(e, { ...ok, amount: NaN })).toBe(msg);
  });
  it('pagador inexistente', () => {
    expect(validateExpense(e, { ...ok, payerId: 'zzz' })).toBe('Elegí quién pagó');
  });
  it('participantIds vacío', () => {
    expect(validateExpense(e, { ...ok, participantIds: [] })).toBe('Elegí al menos una persona');
  });
  it('participantIds con id ajeno al evento o repetido', () => {
    const msg = 'Hay personas que no están en el evento';
    expect(validateExpense(e, { ...ok, participantIds: ['a', 'zzz'] })).toBe(msg);
    expect(validateExpense(e, { ...ok, participantIds: ['a', 'a'] })).toBe(msg);
  });
});

describe('gastos', () => {
  it('addExpense guarda la descripción recortada', () => {
    const e = addExpense(baseEvent(), gasto({ description: '  Asado ' }));
    expect(e.expenses[0].description).toBe('Asado');
  });
  it('addExpense tira el mensaje de validación', () => {
    expect(() => addExpense(baseEvent(), gasto({ description: '' }))).toThrow('Poné una descripción');
  });
  it('updateExpense reemplaza por id y recorta', () => {
    let e = addExpense(baseEvent(), gasto());
    e = updateExpense(e, gasto({ description: ' Cena ', amount: 500 }));
    expect(e.expenses).toHaveLength(1);
    expect(e.expenses[0]).toMatchObject({ description: 'Cena', amount: 500 });
  });
  it('updateExpense tira si no existe', () => {
    expect(() => updateExpense(baseEvent(), gasto())).toThrow('No existe ese gasto');
  });
  it('updateExpense tira el mensaje de validación', () => {
    const e = addExpense(baseEvent(), gasto());
    expect(() => updateExpense(e, gasto({ amount: 0 }))).toThrow('El monto tiene que ser mayor a 0');
  });
  it('removeExpense quita por id y con id inexistente devuelve algo igual', () => {
    const e = addExpense(baseEvent(), gasto());
    expect(removeExpense(e, 'g1').expenses).toEqual([]);
    expect(removeExpense(e, 'zzz')).toEqual(e);
  });
});

describe('isSplitAmongAll', () => {
  it('agregar un participante no cambia los gastos existentes', () => {
    const e1 = addExpense(baseEvent(), gasto());
    expect(isSplitAmongAll(e1, e1.expenses[0])).toBe(true);
    const e2 = addParticipant(e1, 'd', 'Dani');
    expect(e2.expenses).toEqual(e1.expenses);
    expect(isSplitAmongAll(e2, e2.expenses[0])).toBe(false);
  });
});

describe('inmutabilidad', () => {
  it('no muta el evento de entrada', () => {
    const e = deepFreeze(addExpense(baseEvent(), gasto()));
    expect(() => {
      renameEvent(e, 'Otro');
      addParticipant(e, 'd', 'Dani');
      removeParticipant(e, 'zzz');
      addExpense(e, gasto({ id: 'g2' }));
      updateExpense(e, gasto({ amount: 100 }));
      removeExpense(e, 'g1');
      validateExpense(e, gasto());
      isParticipantInUse(e, 'a');
      isSplitAmongAll(e, e.expenses[0]);
    }).not.toThrow();
  });
});
