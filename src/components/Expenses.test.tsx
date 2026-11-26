import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { STORAGE_KEY } from '../storage';

beforeEach(() => {
  localStorage.clear();
});

const personas = [
  { id: 'a', name: 'Andres' },
  { id: 'b', name: 'Juan' },
  { id: 'c', name: 'Sofi' },
];

function sembrar(expenses: unknown[] = [], participants = personas) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: 1, name: 'Asado', participants, expenses }),
  );
}

const pizza = { id: 'x', description: 'Pizza', amount: 1800000, payerId: 'a', participantIds: ['a', 'b', 'c'] };

describe('gastos', () => {
  it('agrega un gasto: descripción, monto "18.000", pagador; todos marcados por defecto', async () => {
    const user = userEvent.setup();
    sembrar();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '+ Agregar gasto' }));
    await user.type(screen.getByLabelText('Descripción'), 'Pizza');
    await user.type(screen.getByLabelText('Monto'), '18.000');
    expect(screen.getByLabelText('Pagó')).toHaveValue('a');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    const lista = screen.getByRole('list', { name: 'Gastos' });
    expect(within(lista).getByText('Pizza')).toBeInTheDocument();
    expect(within(lista).getByText('$18.000')).toBeInTheDocument();
    expect(within(lista).getByText('Andres')).toBeInTheDocument();
    expect(within(lista).getByText('entre: todos')).toBeInTheDocument();
    expect(screen.queryByLabelText('Descripción')).not.toBeInTheDocument();
  });

  it('desmarcar personas muestra "entre: Juan, Sofi" (en orden de carga)', async () => {
    const user = userEvent.setup();
    sembrar();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '+ Agregar gasto' }));
    await user.type(screen.getByLabelText('Descripción'), 'Birra');
    await user.type(screen.getByLabelText('Monto'), '5000');
    await user.click(screen.getByRole('checkbox', { name: 'Andres' }));
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(screen.getByText('entre: Juan, Sofi')).toBeInTheDocument();
  });

  it('monto inválido muestra el error y no guarda', async () => {
    const user = userEvent.setup();
    sembrar();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '+ Agregar gasto' }));
    await user.type(screen.getByLabelText('Descripción'), 'Pizza');
    await user.type(screen.getByLabelText('Monto'), 'abc');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Escribí un monto válido, por ejemplo 18.000,50');
    expect(screen.getByLabelText('Descripción')).toBeInTheDocument();
    expect(screen.queryByText('entre: todos')).not.toBeInTheDocument();
    expect(within(screen.getByRole('list', { name: 'Gastos' })).queryAllByRole('listitem')).toHaveLength(0);
  });

  it('sin personas marcadas muestra "Elegí al menos una persona"', async () => {
    const user = userEvent.setup();
    sembrar();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '+ Agregar gasto' }));
    await user.type(screen.getByLabelText('Descripción'), 'Pizza');
    await user.type(screen.getByLabelText('Monto'), '100');
    for (const p of personas) await user.click(screen.getByRole('checkbox', { name: p.name }));
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Elegí al menos una persona');
    expect(screen.getByLabelText('Descripción')).toBeInTheDocument();
  });

  it('editar un gasto reemplaza sus datos', async () => {
    const user = userEvent.setup();
    sembrar([pizza]);
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Editar Pizza' }));
    expect(screen.getByLabelText('Monto')).toHaveValue('18.000');
    const desc = screen.getByLabelText('Descripción');
    await user.clear(desc);
    await user.type(desc, 'Empanadas');
    await user.selectOptions(screen.getByLabelText('Pagó'), 'Juan');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(screen.queryByText('Pizza')).not.toBeInTheDocument();
    const lista = screen.getByRole('list', { name: 'Gastos' });
    expect(within(lista).getByText('Empanadas')).toBeInTheDocument();
    expect(within(lista).getByText('Juan')).toBeInTheDocument();
    expect(within(lista).getByText('$18.000')).toBeInTheDocument();
  });

  it('cancelar cierra el formulario sin guardar', async () => {
    const user = userEvent.setup();
    sembrar([pizza]);
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Editar Pizza' }));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByLabelText('Descripción')).not.toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
  });

  it('borrar un gasto lo saca de la lista', async () => {
    const user = userEvent.setup();
    sembrar([pizza]);
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Borrar Pizza' }));
    expect(screen.queryByText('Pizza')).not.toBeInTheDocument();
  });

  it('tras agregar un participante, un gasto viejo pasa a mostrar la lista de nombres en vez de "entre: todos"', async () => {
    const user = userEvent.setup();
    sembrar([pizza]);
    render(<App />);
    expect(screen.getByText('entre: todos')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Nuevo participante'), 'Ana{Enter}');
    expect(screen.queryByText('entre: todos')).not.toBeInTheDocument();
    expect(screen.getByText('entre: Andres, Juan, Sofi')).toBeInTheDocument();
  });

  it('"+ Agregar gasto" está deshabilitado sin participantes', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: '+ Agregar gasto' })).toBeDisabled();
  });

  it('borrar el gasto que se está editando cierra el formulario y vuelve el botón de agregar', async () => {
    const user = userEvent.setup();
    sembrar([pizza]);
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Editar Pizza' }));
    await user.click(screen.getByRole('button', { name: 'Borrar Pizza' }));
    expect(screen.queryByLabelText('Descripción')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Agregar gasto' })).toBeEnabled();
  });

  it('"Nuevo evento" con el formulario abierto lo cierra, y al sumar a alguien se puede agregar un gasto', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    sembrar();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '+ Agregar gasto' }));
    await user.click(screen.getByRole('button', { name: 'Nuevo evento' }));
    expect(screen.queryByLabelText('Descripción')).not.toBeInTheDocument();

    await user.type(screen.getByLabelText('Nuevo participante'), 'Ana{Enter}');
    expect(screen.queryByLabelText('Descripción')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Agregar gasto' })).toBeEnabled();
  });

  it('si se quita al pagador con el formulario abierto, se guarda con el que muestra el select', async () => {
    const user = userEvent.setup();
    sembrar();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '+ Agregar gasto' }));
    await user.click(screen.getByRole('button', { name: 'Quitar Andres' }));
    expect(screen.getByLabelText('Pagó')).toHaveValue('b');

    await user.type(screen.getByLabelText('Descripción'), 'Hielo');
    await user.type(screen.getByLabelText('Monto'), '2000');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    const lista = screen.getByRole('list', { name: 'Gastos' });
    expect(within(lista).getByText('Hielo')).toBeInTheDocument();
    expect(within(lista).getByText('Juan')).toBeInTheDocument();
    expect(within(lista).getByText('entre: todos')).toBeInTheDocument();
  });
});
