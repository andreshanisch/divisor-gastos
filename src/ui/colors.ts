import type { EventState } from '../logic/types';

// Colores de denominación (serie de fauna), oscurecidos para que el texto blanco
// sea legible al sol (contraste ≥ 4.5:1). Se asignan por orden de carga y se repiten.
export const DENOMINACIONES = [
  '#B23A30', // guanaco
  '#5E4391', // taruca
  '#2A6E4D', // yaguareté
  '#A4501A', // hornero
  '#3B566E', // cóndor
  '#1D6A7A', // ballena
] as const;

export function colorDe(event: EventState, id: string): string {
  const i = event.participants.findIndex((p) => p.id === id);
  return i < 0 ? '#4C5A52' : DENOMINACIONES[i % DENOMINACIONES.length];
}
