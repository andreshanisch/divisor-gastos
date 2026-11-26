import { describe, it, expect } from 'vitest';
import { settle } from './settle';
import { computeBalances } from './balances';
import type { EventState, Expense } from './types';

// PRNG con semilla fija (mulberry32).
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function eventoAleatorio(rand: () => number): EventState {
  const int = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));
  const n = int(1, 8);
  const ids = Array.from({ length: n }, (_, i) => `p${i}`);
  const cantidad = int(0, 10);
  const expenses: Expense[] = [];
  for (let i = 0; i < cantidad; i++) {
    let participantIds = ids.filter(() => rand() < 0.5);
    if (participantIds.length === 0) participantIds = [ids[int(0, n - 1)]];
    expenses.push({
      id: `e${i}`,
      description: `gasto ${i}`,
      amount: int(1, 10000000),
      payerId: ids[int(0, n - 1)],
      participantIds,
    });
  }
  return { version: 1, name: 'prop', participants: ids.map((id) => ({ id, name: id })), expenses };
}

describe('settle', () => {
  it('ejemplo del spec', () => {
    expect(
      settle(new Map([['Andres', 1200000], ['Juan', -150000], ['Sofi', -1050000]])),
    ).toEqual([
      { from: 'Sofi', to: 'Andres', amount: 1050000 },
      { from: 'Juan', to: 'Andres', amount: 150000 },
    ]);
  });

  it('todos en 0 → sin transferencias', () => {
    expect(settle(new Map([['a', 0], ['b', 0]]))).toEqual([]);
  });

  it('mapa vacío → sin transferencias', () => {
    expect(settle(new Map())).toEqual([]);
  });

  it('desempate determinístico: a igual monto gana el primero en orden del mapa', () => {
    const r = settle(new Map([['a', 100], ['b', 100], ['c', -100], ['d', -100]]));
    expect(r).toEqual([
      { from: 'c', to: 'a', amount: 100 },
      { from: 'd', to: 'b', amount: 100 },
    ]);
  });

  it('no muta el mapa de entrada', () => {
    const m = new Map([['a', 50], ['b', -50]]);
    settle(m);
    expect([...m]).toEqual([['a', 50], ['b', -50]]);
  });

  describe('propiedades (PRNG con semilla fija)', () => {
    const rand = mulberry32(12345);
    const casos = Array.from({ length: 200 }, () => eventoAleatorio(rand));

    it('aplicar las transferencias deja a todos en 0', () => {
      for (const evento of casos) {
        const balances = computeBalances(evento);
        const final = new Map(balances);
        for (const t of settle(balances)) {
          final.set(t.from, (final.get(t.from) ?? 0) + t.amount);
          final.set(t.to, (final.get(t.to) ?? 0) - t.amount);
        }
        for (const v of final.values()) expect(v).toBe(0);
      }
    });

    it('a lo sumo n − 1 transferencias, todas con amount > 0 y from !== to', () => {
      for (const evento of casos) {
        const ts = settle(computeBalances(evento));
        expect(ts.length).toBeLessThanOrEqual(Math.max(0, evento.participants.length - 1));
        for (const t of ts) {
          expect(t.amount).toBeGreaterThan(0);
          expect(t.from).not.toBe(t.to);
        }
      }
    });
  });
});
