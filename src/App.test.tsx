import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { STORAGE_KEY } from './storage';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('encabezado y participantes', () => {
  it('agrega un participante con el botón + y con Enter', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByLabelText('Nuevo participante');

    await user.type(input, 'Juan');
    await user.click(screen.getByRole('button', { name: 'Agregar participante' }));
    expect(screen.getByRole('button', { name: 'Quitar Juan' })).toBeInTheDocument();
    expect(input).toHaveValue('');

    await user.type(input, 'Ana{Enter}');
    expect(screen.getByText('Ana')).toBeInTheDocument();
  });

  it('muestra "Ya hay alguien con ese nombre" al repetir un nombre', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByLabelText('Nuevo participante');

    await user.type(input, 'Juan{Enter}');
    await user.type(input, 'juan{Enter}');
    expect(screen.getByRole('alert')).toHaveTextContent('Ya hay alguien con ese nombre');

    await user.type(input, 'Ana{Enter}');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('si no se puede guardar, muestra el aviso arriba', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    render(<App />);
    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo guardar en este navegador');
  });

  it('quitar a alguien con gastos muestra por qué no se puede y lo deja en la lista', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        name: 'Asado',
        participants: [
          { id: 'a', name: 'Juan' },
          { id: 'b', name: 'Ana' },
        ],
        expenses: [{ id: 'x', description: 'Carne', amount: 1000, payerId: 'a', participantIds: ['a'] }],
      }),
    );
    render(<App />);
    const usado = screen.getByRole('button', { name: 'Quitar Juan' });
    expect(usado).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', { name: 'Quitar Ana' })).not.toHaveAttribute('aria-disabled');

    await user.click(usado);
    expect(screen.getByRole('alert')).toHaveTextContent('Primero sacalo de sus gastos');
    expect(screen.getByRole('button', { name: 'Quitar Juan' })).toBeInTheDocument();
  });

  it('quita a un participante sin gastos', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText('Nuevo participante'), 'Juan{Enter}');
    await user.click(screen.getByRole('button', { name: 'Quitar Juan' }));
    expect(screen.queryByText('Juan')).not.toBeInTheDocument();
  });

  it('el nombre del evento se edita y persiste al volver a montar <App/>', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await user.click(screen.getByRole('button', { name: 'Editar nombre' }));
    const input = screen.getByLabelText('Nombre del evento');
    await user.clear(input);
    await user.type(input, 'Asado del sábado{Enter}');
    expect(screen.getByRole('heading', { name: 'Asado del sábado' })).toBeInTheDocument();

    unmount();
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Asado del sábado' })).toBeInTheDocument();
  });

  it('"Nuevo evento" pide confirmación (window.confirm) y si se acepta deja el evento vacío', async () => {
    const user = userEvent.setup();
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<App />);
    await user.type(screen.getByLabelText('Nuevo participante'), 'Juan{Enter}');

    await user.click(screen.getByRole('button', { name: 'Nuevo evento' }));
    expect(confirmar).toHaveBeenCalledWith('¿Borrar el evento actual y empezar uno nuevo?');
    expect(screen.queryByText('Juan')).not.toBeInTheDocument();
  });

  it('si se cancela la confirmación no cambia nada', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<App />);
    await user.type(screen.getByLabelText('Nuevo participante'), 'Juan{Enter}');

    await user.click(screen.getByRole('button', { name: 'Nuevo evento' }));
    expect(screen.getByText('Juan')).toBeInTheDocument();
  });
});

describe('modo oscuro', () => {
  it('el botón alterna el tema, lo marca en el documento y lo recuerda', async () => {
    const user = userEvent.setup();
    localStorage.setItem('divisor-gastos:tema', 'claro');
    render(<App />);
    const boton = screen.getByRole('button', { name: 'Modo oscuro' });
    expect(boton).toHaveAttribute('aria-pressed', 'false');

    await user.click(boton);
    expect(boton).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement.dataset.tema).toBe('oscuro');
    expect(localStorage.getItem('divisor-gastos:tema')).toBe('oscuro');

    await user.click(boton);
    expect(document.documentElement.dataset.tema).toBe('claro');
    expect(localStorage.getItem('divisor-gastos:tema')).toBe('claro');
  });

  it('arranca con el tema guardado', () => {
    localStorage.setItem('divisor-gastos:tema', 'oscuro');
    render(<App />);
    expect(screen.getByRole('button', { name: 'Modo oscuro' })).toHaveAttribute('aria-pressed', 'true');
  });
});
