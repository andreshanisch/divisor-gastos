import { afterEach, describe, expect, it, vi } from 'vitest';
import { createEvent } from './logic/event';
import type { EventState } from './logic/types';
import { STORAGE_KEY, loadEvent, saveEvent } from './storage';

function almacenFalso(inicial?: string) {
  const datos = new Map<string, string>();
  if (inicial !== undefined) datos.set(STORAGE_KEY, inicial);
  return {
    getItem: (k: string) => datos.get(k) ?? null,
    setItem: (k: string, v: string) => void datos.set(k, v),
  };
}

const evento: EventState = {
  version: 1,
  name: 'Asado',
  participants: [
    { id: 'a', name: 'Ana' },
    { id: 'b', name: 'Beto' },
  ],
  expenses: [
    { id: 'g1', description: 'Carne', amount: 10000, payerId: 'a', participantIds: ['a', 'b'] },
  ],
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('persistencia', () => {
  it('guarda y recupera el mismo evento', () => {
    const s = almacenFalso();
    saveEvent(evento, s);
    expect(loadEvent(s)).toEqual(evento);
  });

  it('sin datos → evento nuevo', () => {
    expect(loadEvent(almacenFalso())).toEqual(createEvent());
  });

  it.each([
    ['JSON roto', '{no es json'],
    ['texto', '"texto"'],
    ['null', 'null'],
    ['versión 2', '{"version":2}'],
    ['participants no es array', '{"version":1,"name":"x","participants":"no","expenses":[]}'],
    ['name no es string', '{"version":1,"name":3,"participants":[],"expenses":[]}'],
    [
      'ids de participantes repetidos',
      '{"version":1,"name":"x","participants":[{"id":"a","name":"A"},{"id":"a","name":"B"}],"expenses":[]}',
    ],
    [
      'gasto con payerId inexistente',
      '{"version":1,"name":"x","participants":[{"id":"a","name":"A"}],"expenses":[{"id":"g","description":"d","amount":100,"payerId":"zzz","participantIds":["a"]}]}',
    ],
    [
      'gasto con participante inexistente',
      '{"version":1,"name":"x","participants":[{"id":"a","name":"A"}],"expenses":[{"id":"g","description":"d","amount":100,"payerId":"a","participantIds":["a","q"]}]}',
    ],
    [
      'gasto con monto no entero',
      '{"version":1,"name":"x","participants":[{"id":"a","name":"A"}],"expenses":[{"id":"g","description":"d","amount":1.5,"payerId":"a","participantIds":["a"]}]}',
    ],
    [
      'gasto con monto como string',
      '{"version":1,"name":"x","participants":[{"id":"a","name":"A"}],"expenses":[{"id":"g","description":"d","amount":"100","payerId":"a","participantIds":["a"]}]}',
    ],
    [
      'gasto null',
      '{"version":1,"name":"x","participants":[],"expenses":[null]}',
    ],
  ])('datos inválidos (%s) → evento nuevo', (_nombre, crudo) => {
    expect(loadEvent(almacenFalso(crudo))).toEqual(createEvent());
  });

  it('getItem que tira → evento nuevo', () => {
    const s = {
      getItem: () => {
        throw new Error('bloqueado');
      },
      setItem: () => {},
    };
    expect(loadEvent(s)).toEqual(createEvent());
  });

  it('setItem que tira → no tira y avisa con warn', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const s = {
      getItem: () => null,
      setItem: () => {
        throw new Error('cuota llena');
      },
    };
    expect(() => saveEvent(evento, s)).not.toThrow();
    expect(warn).toHaveBeenCalled();
  });

  it('si acceder a localStorage tira, loadEvent y saveEvent no tiran', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('denegado', 'SecurityError');
      },
    });
    try {
      expect(loadEvent()).toEqual(createEvent());
      expect(() => saveEvent(evento)).not.toThrow();
      expect(warn).toHaveBeenCalled();
    } finally {
      if (original) Object.defineProperty(globalThis, 'localStorage', original);
    }
  });
});
