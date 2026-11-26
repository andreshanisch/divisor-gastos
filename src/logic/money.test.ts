import { describe, it, expect } from 'vitest';
import { parseAmount, formatARS } from './money';

describe('parseAmount', () => {
  it.each([
    ['18000', 1800000], ['18.000', 1800000], ['18000,5', 1800050],
    ['18.000,50', 1800050], ['1.234.567,89', 123456789], ['0,01', 1],
    [' 9000 ', 900000], ['$ 9.000', 900000], ['12.5', 1250], ['12.50', 1250],
  ])('%s → %i centavos', (text, cents) => expect(parseAmount(text)).toBe(cents));

  it('acepta 12 dígitos en la parte entera', () => {
    expect(parseAmount('999.999.999.999')).toBe(99999999999900);
  });

  it('rechaza más de 12 dígitos en la parte entera', () => {
    expect(parseAmount('9999999999999')).toBeNull();
    expect(parseAmount('99999999999999')).toBeNull();
  });

  it.each(['', 'abc', '0', '0,00', '-5', '1,234', '1.2.3', '18.00.0', '1,5,0'])(
    'rechaza %s', (text) => expect(parseAmount(text)).toBeNull());
});

describe('formatARS', () => {
  it.each([
    [1800000, '$18.000'], [1800050, '$18.000,50'], [1, '$0,01'],
    [0, '$0'], [123456789, '$1.234.567,89'], [150000, '$1.500'], [1250, '$12,50'],
  ])('%i → %s', (cents, text) => expect(formatARS(cents)).toBe(text));
});
