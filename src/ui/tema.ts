export type Tema = 'claro' | 'oscuro';

export const TEMA_KEY = 'divisor-gastos:tema';

// La preferencia guardada gana; si no hay (o no se puede leer), se sigue al sistema.
export function leerTema(): Tema {
  try {
    const guardado = localStorage.getItem(TEMA_KEY);
    if (guardado === 'claro' || guardado === 'oscuro') return guardado;
  } catch {
    // localStorage bloqueado: se usa la preferencia del sistema.
  }
  const oscuro = typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
  return oscuro ? 'oscuro' : 'claro';
}

export function guardarTema(tema: Tema): void {
  try {
    localStorage.setItem(TEMA_KEY, tema);
  } catch {
    // Si no se puede guardar, el tema vale solo para esta visita.
  }
}

// Color de la barra del navegador en el celular, a tono con el papel de cada tema.
const COLOR_BARRA: Record<Tema, string> = { claro: '#F2F4EE', oscuro: '#111714' };

export function aplicarTema(tema: Tema): void {
  document.documentElement.dataset.tema = tema;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COLOR_BARRA[tema]);
}
