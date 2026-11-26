import { describe, it, expect } from 'vitest';
import { computeBalances } from './balances';
import type { EventState, Expense } from './types';

type E = Omit<Expense, 'id' | 'description'>;

// Arma un evento con ids iguales a los nombres.
function ev(names: string[], expenses: E[] = []): EventState {
  return {
    version: 1,
    name: 'test',
    participants: names.map((n) => ({ id: n, name: n })),
    expenses: expenses.map((e, i) => ({ id: `e${i}`, description: `gasto ${i}`, ...e })),
  };
}

describe('computeBalances', () => {
  it('ejemplo del spec', () => {
    const b = computeBalances(
      ev(['Andres', 'Juan', 'Sofi'], [
        { amount: 1800000, payerId: 'Andres', participantIds: ['Andres', 'Juan', 'Sofi'] },
        { amount: 900000, payerId: 'Juan', participantIds: ['Juan', 'Sofi'] },
      ]),
    );
    expect([...b]).toEqual([['Andres', 1200000], ['Juan', -150000], ['Sofi', -1050000]]);
  });

  it('el sobrante va al primero en orden de carga, no de selección', () => {
    const names = ['a', 'b', 'c'];
    const b1 = computeBalances(ev(names, [{ amount: 100, payerId: 'a', participantIds: ['c', 'b'] }]));
    expect(b1.get('b')).toBe(-50);
    expect(b1.get('c')).toBe(-50);
    const b2 = computeBalances(ev(names, [{ amount: 101, payerId: 'a', participantIds: ['c', 'b'] }]));
    expect(b2.get('b')).toBe(-51);
    expect(b2.get('c')).toBe(-50);
  });

  it('el que pagó no participa', () => {
    const b = computeBalances(ev(['a', 'b', 'c'], [{ amount: 900, payerId: 'a', participantIds: ['b', 'c'] }]));
    expect([...b]).toEqual([['a', 900], ['b', -450], ['c', -450]]);
  });

  it('alguien sin gastos queda en 0 y aparece en el mapa', () => {
    const b = computeBalances(ev(['a', 'b', 'c'], [{ amount: 500, payerId: 'a', participantIds: ['a', 'b'] }]));
    expect(b.has('c')).toBe(true);
    expect(b.get('c')).toBe(0);
  });

  it('evento sin gastos: todos en 0', () => {
    const b = computeBalances(ev(['a', 'b']));
    expect([...b]).toEqual([['a', 0], ['b', 0]]);
  });

  it('la suma de balances es 0', () => {
    const eventos = [
      ev(['a', 'b', 'c'], [{ amount: 1000, payerId: 'a', participantIds: ['a', 'b', 'c'] }]),
      ev(['a', 'b', 'c', 'd'], [
        { amount: 1001, payerId: 'b', participantIds: ['a', 'b', 'c'] },
        { amount: 7, payerId: 'd', participantIds: ['d', 'a', 'b', 'c'] },
        { amount: 12345, payerId: 'c', participantIds: ['d', 'c'] },
      ]),
      ev(['x', 'y'], [{ amount: 1, payerId: 'x', participantIds: ['x', 'y'] }]),
    ];
    for (const e of eventos) {
      const total = [...computeBalances(e).values()].reduce((s, v) => s + v, 0);
      expect(total).toBe(0);
    }
  });
});
