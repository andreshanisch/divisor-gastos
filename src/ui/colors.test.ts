import { describe, expect, it } from 'vitest';
import { ANIMALES } from '../components/Animal';
import type { EventState } from '../logic/types';
import { colorDe, DENOMINACIONES } from './colors';

const evento = (n: number): EventState => ({
  version: 1,
  name: 'x',
  participants: Array.from({ length: n }, (_, i) => ({ id: `p${i}`, name: `P${i}` })),
  expenses: [],
});

describe('denominaciones', () => {
  it('hay diez colores y diez animales, uno por color', () => {
    expect(DENOMINACIONES).toHaveLength(10);
    expect(ANIMALES).toHaveLength(10);
    expect(new Set(DENOMINACIONES).size).toBe(10);
  });

  it('el color va por orden de carga y se repite desde la undécima persona', () => {
    const e = evento(12);
    expect(colorDe(e, 'p0')).toBe(DENOMINACIONES[0]);
    expect(colorDe(e, 'p9')).toBe(DENOMINACIONES[9]);
    expect(colorDe(e, 'p10')).toBe(DENOMINACIONES[0]);
  });
});
