import { describe, expect, it } from 'vitest';
import { computeBalances } from './balances';
import { settle } from './settle';
import { formatShareText } from './share';
import type { EventState } from './types';

const ejemploSpec: EventState = {
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
  ],
};

describe('formatShareText', () => {
  it('arma el texto con el nombre del evento y una línea por transferencia', () => {
    expect(formatShareText(ejemploSpec, settle(computeBalances(ejemploSpec)))).toBe(
      'Cena del viernes\n\nSofi → Andres: $10.500\nJuan → Andres: $1.500',
    );
  });

  it('sin transferencias avisa que no hay nada que saldar', () => {
    const sinGastos = { ...ejemploSpec, expenses: [] };
    expect(formatShareText(sinGastos, [])).toBe('Cena del viernes\n\nNo hay nada que saldar.');
  });
});
