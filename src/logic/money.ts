import type { Cents } from './types';

const CON_MILES = /^\d{1,3}(\.\d{3})+(,\d{1,2})?$/;
const SIN_MILES = /^\d+(,\d{1,2})?$/;
const PUNTO_DECIMAL = /^\d+\.\d{1,2}$/;

/**
 * Convierte un texto tipeado ("18.000,50", "$ 9000", "12.5") a centavos.
 * Usa aritmética de strings, nunca parseFloat. Devuelve null si el texto
 * es inválido o el monto es cero.
 */
export function parseAmount(text: string): Cents | null {
  const limpio = text.replace(/[\s$]/g, '');

  let entero: string;
  let decimales: string;
  if (CON_MILES.test(limpio) || SIN_MILES.test(limpio)) {
    const [parteEntera, parteDecimal = ''] = limpio.split(',');
    entero = parteEntera.replace(/\./g, '');
    decimales = parteDecimal;
  } else if (PUNTO_DECIMAL.test(limpio)) {
    [entero, decimales] = limpio.split('.');
  } else {
    return null;
  }

  // Tope: 12 dígitos de pesos (de sobra para cualquier evento) y que entre como entero seguro.
  if (entero.replace(/^0+(?=\d)/, '').length > 12) return null;
  const cents = Number(entero) * 100 + Number(decimales.padEnd(2, '0'));
  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
}

/** Formatea centavos como pesos argentinos: "$18.000" o "$18.000,50". */
export function formatARS(cents: Cents): string {
  const pesos = Math.floor(cents / 100);
  const resto = cents % 100;
  const miles = String(pesos).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const decimales = resto !== 0 ? `,${String(resto).padStart(2, '0')}` : '';
  return `$${miles}${decimales}`;
}
