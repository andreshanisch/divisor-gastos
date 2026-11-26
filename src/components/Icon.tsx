// Íconos propios: trazo de 2px, puntas redondeadas, grilla de 24.
const TRAZOS = {
  editar: 'M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4',
  borrar: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13M10 11v6M14 11v6',
  quitar: 'M7 7l10 10M17 7L7 17',
  mas: 'M12 5v14M5 12h14',
  copiar: 'M9 9h10v10H9zM5 15V5h10',
  flecha: 'M5 12h14M13 6l6 6-6 6',
} as const;

export type NombreIcono = keyof typeof TRAZOS;

export default function Icon({ nombre }: { nombre: NombreIcono }) {
  return (
    <svg
      className="icono"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={TRAZOS[nombre]} />
    </svg>
  );
}
