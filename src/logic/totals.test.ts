import { describe, expect, it } from 'vitest';
import { computePaid, totalSpent } from './totals';
import type { EventState } from './types';

const evento: EventState = {
  version: 1,
  name: 'Cena del viernes',
  participants: [
    { id: 'a', name: 'Andres' },
    { id: 'b', name: 'Juan' },
    { id: 'c', name: 'Sofi' },
  ],
  expenses: [
    { id: 'x', description: 'Pizza', amount: 1800000, payerId: 'a', participantIds: ['a', 'b', 'c'] },
    { id: 'y', description: 'Cerveza', amount: 900000, payerId: 'b', participantIds: ['b', 'c'] },
    { id: 'z', description: 'Helado', amount: 300050, payerId: 'a', participantIds: ['a'] },
  ],
};

describe('totalSpent', () => {
  it('suma todos los gastos en centavos', () => {
    expect(totalSpent(evento)).toBe(3000050);
  });

  it('evento sin gastos: 0', () => {
    expect(totalSpent({ ...evento, expenses: [] })).toBe(0);
  });
});

describe('computePaid', () => {
  it('lo que pagó cada uno, en orden de carga, incluido quien no pagó nada', () => {
    const pagado = computePaid(evento);
    expect([...pagado]).toEqual([
      ['a', 2100050],
      ['b', 900000],
      ['c', 0],
    ]);
  });

  it('la suma de lo pagado es el total', () => {
    const suma = [...computePaid(evento).values()].reduce((s, v) => s + v, 0);
    expect(suma).toBe(totalSpent(evento));
  });
});
