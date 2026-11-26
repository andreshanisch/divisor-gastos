import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { aplicarTema, guardarTema, leerTema, TEMA_KEY } from './tema';

function stubPreferencia(oscuro: boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: oscuro && q.includes('dark'), media: q }));
}

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.tema;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('tema', () => {
  it('sin preferencia guardada sigue al sistema', () => {
    stubPreferencia(true);
    expect(leerTema()).toBe('oscuro');
    stubPreferencia(false);
    expect(leerTema()).toBe('claro');
  });

  it('la preferencia guardada gana sobre el sistema', () => {
    stubPreferencia(true);
    guardarTema('claro');
    expect(localStorage.getItem(TEMA_KEY)).toBe('claro');
    expect(leerTema()).toBe('claro');
  });

  it('un valor guardado inválido se ignora', () => {
    stubPreferencia(false);
    localStorage.setItem(TEMA_KEY, 'violeta');
    expect(leerTema()).toBe('claro');
  });

  it('si localStorage tira, no rompe', () => {
    stubPreferencia(false);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    expect(leerTema()).toBe('claro');
    expect(() => guardarTema('oscuro')).not.toThrow();
  });

  it('aplicarTema marca el documento', () => {
    aplicarTema('oscuro');
    expect(document.documentElement.dataset.tema).toBe('oscuro');
    aplicarTema('claro');
    expect(document.documentElement.dataset.tema).toBe('claro');
  });
});
