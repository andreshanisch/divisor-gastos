import { useId, type ReactNode } from 'react';

// Roseta de guilloché: una hipotrocoide (como las que dibuja un torno de guilloché), centrada en 0,0.
function roseta(radio: number, R: number, r: number, d: number): string {
  const vueltas = (2 * Math.PI * r) / mcd(R, r);
  const escala = radio / (R - r + d);
  const pasos = 720;
  const puntos: string[] = [];
  for (let i = 0; i <= pasos; i++) {
    const t = (vueltas * i) / pasos;
    const x = escala * ((R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t));
    const y = escala * ((R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t));
    puntos.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `M${puntos.join('L')}Z`;
}

function mcd(a: number, b: number): number {
  return b === 0 ? a : mcd(b, a % b);
}

// Malla de guilloché: varias hipotrocoides concéntricas y giradas, como el fondo de seguridad.
// Se calcula una sola vez y se reubica con transform en cada billete.
const MALLA = [
  { d: roseta(44, 9, 4, 6.2), giro: 0 },
  { d: roseta(40, 9, 4, 6.2), giro: 10 },
  { d: roseta(36, 11, 5, 7), giro: 4 },
  { d: roseta(30, 11, 5, 7), giro: 16 },
  { d: roseta(22, 7, 3, 3.4), giro: 0 },
  { d: roseta(14, 7, 3, 3.4), giro: 25 },
];
const MICROTEXTO = 'DIVISOR DE GASTOS · '.repeat(20);
const ALTO = 100;

interface Props {
  color: string; // color de fondo del billete (denominación o tinta)
  // Emblema de la marca de agua en una grilla de 64×64; recibe el rayado de grabado.
  motivo: (relleno: string) => ReactNode;
  ancho?: number; // ancho del viewBox (alto fijo de 100): sigue la proporción del billete
  lado?: 'izquierda' | 'derecha'; // de qué lado va la marca de agua con el emblema
  opacidad?: number; // del emblema; más baja donde el texto pasa por encima
}

// Fondo de billete: marco con microtexto, malla de guilloché, marca de agua con el emblema
// e hilo de seguridad. Es decorativo: no lleva información que no esté en el texto.
export default function BilleteFondo({ color, motivo, ancho = 160, lado = 'izquierda', opacidad = 0.72 }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const rayado = `rayado-${id}`;
  const marca = `marca-${id}`;
  const marco = `marco-${id}`;

  const izquierda = lado === 'izquierda';
  const centroMalla = izquierda ? ancho - 38 : 64;
  const marcaX = izquierda ? 31 : ancho - 33;
  const emblemaX = izquierda ? -4 : ancho - 66;
  const hiloX = izquierda ? 63 : ancho - 72;
  const m = 6.2; // margen del microtexto
  const marcoD = `M${m + 2.3} ${m}H${ancho - m - 2.3}Q${ancho - m} ${m} ${ancho - m} ${m + 2.3}V${ALTO - m - 2.3}Q${ancho - m} ${ALTO - m} ${ancho - m - 2.3} ${ALTO - m}H${m + 2.3}Q${m} ${ALTO - m} ${m} ${ALTO - m - 2.3}V${m + 2.3}Q${m} ${m} ${m + 2.3} ${m}Z`;

  return (
    <svg
      className="billete-fondo"
      viewBox={`0 0 ${ancho} ${ALTO}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={rayado} width="1.25" height="1.25" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <line x1="0" y1="0" x2="0" y2="1.25" stroke="#fff" strokeWidth="0.6" />
        </pattern>
        <radialGradient id={marca}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.26" />
          <stop offset="0.7" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <path id={marco} d={marcoD} />
      </defs>

      <g fill="none" stroke="#fff" strokeOpacity="0.13" strokeWidth="0.25">
        {MALLA.map((malla, i) => (
          <path key={i} d={malla.d} transform={`translate(${centroMalla} 50) rotate(${malla.giro})`} />
        ))}
      </g>

      <ellipse cx={marcaX} cy="60" rx="27" ry="34" fill={`url(#${marca})`} />

      <g transform={`translate(${emblemaX} 27) scale(1.08)`} opacity={opacidad}>
        {motivo(`url(#${rayado})`)}
      </g>

      <rect x={hiloX} y="0" width="2.2" height={ALTO} fill="#fff" fillOpacity="0.32" />
      <line x1={hiloX + 1.1} y1="0" x2={hiloX + 1.1} y2={ALTO} stroke={color} strokeWidth="0.9" strokeDasharray="2.4 3.6" />

      <rect x="3" y="3" width={ancho - 6} height={ALTO - 6} rx="5" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="0.5" />
      <text fill="#fff" fillOpacity="0.4" fontSize="2.3" fontWeight="700" letterSpacing="0.25">
        <textPath href={`#${marco}`}>{MICROTEXTO}</textPath>
      </text>
    </svg>
  );
}
