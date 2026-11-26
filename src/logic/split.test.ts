import { describe, it, expect } from 'vitest';
import { splitExpense } from './split';

describe('splitExpense', () => {
  it('reparte en partes iguales cuando es exacto salvo un centavo', () => {
    expect([...splitExpense(1000, ['a', 'b', 'c'])]).toEqual([['a', 334], ['b', 333], ['c', 333]]);
  });

  it('reparte el sobrante de a un centavo a los primeros', () => {
    expect([...splitExpense(1001, ['a', 'b', 'c'])]).toEqual([['a', 334], ['b', 334], ['c', 333]]);
  });

  it('una sola persona se queda con todo', () => {
    expect([...splitExpense(900, ['a'])]).toEqual([['a', 900]]);
  });

  it('propiedad: la suma de partes es el monto y la diferencia máxima es 1', () => {
    for (let amount = 1; amount <= 500; amount++) {
      for (let n = 1; n <= 7; n++) {
        const ids = Array.from({ length: n }, (_, i) => `p${i}`);
        const parts = [...splitExpense(amount, ids).values()];
        const sum = parts.reduce((s, x) => s + x, 0);
        expect(sum).toBe(amount);
        expect(Math.max(...parts) - Math.min(...parts)).toBeLessThanOrEqual(1);
      }
    }
  });
});
