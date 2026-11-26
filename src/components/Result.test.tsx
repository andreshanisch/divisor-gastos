import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { STORAGE_KEY } from '../storage';

const personas = [
  { id: 'a', name: 'Andres' },
  { id: 'b', name: 'Juan' },
  { id: 'c', name: 'Sofi' },
];
const pizza = { id: 'x', description: 'Pizza', amount: 1800000, payerId: 'a', participantIds: ['a', 'b', 'c'] };
const cerveza = { id: 'y', description: 'Cerveza', amount: 900000, payerId: 'b', participantIds: ['b', 'c'] };

function sembrar(expenses: unknown[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: 1, name: 'Cena del viernes', participants: personas, expenses }),
  );
}

const textoEjemplo = 'Cena del viernes\n\nSofi → Andres: $10.500\nJuan → Andres: $1.500';
const clipboardOriginal = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

function stubClipboard(value: unknown) {
  Object.defineProperty(navigator, 'clipboard', { value, configurable: true });
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  if (clipboardOriginal) Object.defineProperty(navigator, 'clipboard', clipboardOriginal);
  else Reflect.deleteProperty(navigator, 'clipboard');
});

describe('resultado', () => {
  it('muestra las transferencias del ejemplo del spec y se actualiza al agregar un gasto', async () => {
    const user = userEvent.setup();
    sembrar([pizza, cerveza]);
    render(<App />);

    const lista = screen.getByRole('list', { name: 'Transferencias' });
    const items = within(lista).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Sofi → Andres');
    expect(items[0]).toHaveTextContent('$10.500');
    expect(items[1]).toHaveTextContent('Juan → Andres');
    expect(items[1]).toHaveTextContent('$1.500');

    await user.click(screen.getByRole('button', { name: '+ Agregar gasto' }));
    await user.type(screen.getByLabelText('Descripción'), 'Hielo');
    await user.type(screen.getByLabelText('Monto'), '3000');
    await user.selectOptions(screen.getByLabelText('Pagó'), 'Sofi');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    const nuevas = within(screen.getByRole('list', { name: 'Transferencias' })).getAllByRole('listitem');
    expect(screen.getByText('Sofi → Andres')).toBeInTheDocument();
    expect(screen.getByText('$8.500')).toBeInTheDocument();
  });

  it('sin gastos muestra "No hay nada que saldar."', () => {
    sembrar([]);
    render(<App />);
    expect(screen.getByText('No hay nada que saldar.')).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Transferencias' })).not.toBeInTheDocument();
  });

  it('"Copiar para WhatsApp" llama a navigator.clipboard.writeText con el texto y muestra "¡Copiado!"', async () => {
    const user = userEvent.setup();
    sembrar([pizza, cerveza]);
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard({ writeText });
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Copiar para WhatsApp' }));
    expect(writeText).toHaveBeenCalledWith(textoEjemplo);
    expect(await screen.findByRole('status')).toHaveTextContent('¡Copiado!');
    expect(screen.queryByLabelText('Texto para copiar')).not.toBeInTheDocument();
  });

  it('si clipboard no existe, muestra un <textarea> de solo lectura con el texto', async () => {
    const user = userEvent.setup();
    sembrar([pizza, cerveza]);
    stubClipboard(undefined);
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Copiar para WhatsApp' }));
    const area = await screen.findByLabelText('Texto para copiar');
    expect(area).toHaveValue(textoEjemplo);
    expect(area).toHaveAttribute('readonly');
    expect(screen.getByText('Copialo a mano:')).toBeInTheDocument();
  });

  it('si writeText rechaza, muestra un <textarea> de solo lectura con el texto', async () => {
    const user = userEvent.setup();
    sembrar([pizza, cerveza]);
    stubClipboard({ writeText: vi.fn().mockRejectedValue(new Error('denegado')) });
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Copiar para WhatsApp' }));
    const area = await screen.findByLabelText('Texto para copiar');
    expect(area).toHaveValue(textoEjemplo);
    expect(area).toHaveAttribute('readonly');
    expect(screen.queryByText('¡Copiado!')).not.toBeInTheDocument();
  });

  it('"¡Copiado!" desaparece al cambiar el evento, y lo mismo el aviso de copia manual', async () => {
    const user = userEvent.setup();
    sembrar([pizza, cerveza]);
    stubClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Copiar para WhatsApp' }));
    expect(await screen.findByRole('status')).toHaveTextContent('¡Copiado!');
    await user.click(screen.getByRole('button', { name: 'Borrar Cerveza' }));
    expect(screen.queryByText('¡Copiado!')).not.toBeInTheDocument();

    stubClipboard(undefined);
    await user.click(screen.getByRole('button', { name: 'Copiar para WhatsApp' }));
    expect(await screen.findByLabelText('Texto para copiar')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Borrar Pizza' }));
    expect(screen.queryByLabelText('Texto para copiar')).not.toBeInTheDocument();
    expect(screen.queryByText('Copialo a mano:')).not.toBeInTheDocument();
  });

  it('sin gastos el botón sigue visible y copia el aviso', async () => {
    const user = userEvent.setup();
    sembrar([]);
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard({ writeText });
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Copiar para WhatsApp' }));
    expect(writeText).toHaveBeenCalledWith('Cena del viernes\n\nNo hay nada que saldar.');
    expect(await screen.findByRole('status')).toHaveTextContent('¡Copiado!');
  });
});
