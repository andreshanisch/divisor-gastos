import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addParticipant, createEvent, renameEvent } from './logic/event';
import { loadEvent, saveEvent } from './storage';
import { useEventState } from './useEventState';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useEventState', () => {
  it('guardadoFallo es false si se guarda bien y true si setItem tira', () => {
    const { result } = renderHook(() => useEventState());
    expect(result.current[2]).toBe(false);

    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    act(() => result.current[1]((e) => renameEvent(e, 'Asado')));
    expect(result.current[2]).toBe(true);
  });

  it('carga el evento guardado al montar', () => {
    saveEvent({ ...createEvent(), name: 'Guardado' });
    const { result } = renderHook(() => useEventState());
    expect(result.current[0].name).toBe('Guardado');
  });

  it('guarda cada actualización', () => {
    const { result } = renderHook(() => useEventState());
    act(() => result.current[1]((e) => renameEvent(e, 'Asado')));
    expect(result.current[0].name).toBe('Asado');
    expect(loadEvent().name).toBe('Asado');
  });

  it('los errores de update llegan a quien llama y el estado no cambia', () => {
    const { result } = renderHook(() => useEventState());
    const antes = result.current[0];
    expect(() => act(() => result.current[1]((e) => addParticipant(e, 'x', '')))).toThrow(
      'Escribí un nombre',
    );
    expect(result.current[0]).toEqual(antes);
  });

  it('dos actualizaciones seguidas en el mismo act se aplican ambas', () => {
    const { result } = renderHook(() => useEventState());
    act(() => {
      result.current[1]((e) => addParticipant(e, 'a', 'Ana'));
      result.current[1]((e) => addParticipant(e, 'b', 'Beto'));
    });
    expect(result.current[0].participants.map((p) => p.id)).toEqual(['a', 'b']);
  });
});
