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
    expect(screen.getByText('Juan')).toBeInTheDocument();
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

  it('el botón quitar de alguien con gastos está deshabilitado y explica por qué', () => {
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
    expect(usado).toBeDisabled();
    expect(usado).toHaveAttribute('title', 'Primero sacalo de sus gastos');
    expect(screen.getByRole('button', { name: 'Quitar Ana' })).toBeEnabled();
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
