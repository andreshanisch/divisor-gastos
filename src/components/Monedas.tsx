// Emblema del billete del total: dos monedas apiladas con el signo $, en la grilla de 64×64
// de los animales y con el mismo rayado de grabado.

interface Props {
  relleno: string; // url(#...) del rayado
  fondo: string; // color del billete, para el signo calado
}

const canto = { fill: 'none', stroke: '#fff', strokeWidth: 1.8, strokeDasharray: '0.7 1.1' } as const;

export default function Monedas({ relleno, fondo }: Props) {
  return (
    <g>
      {/* Moneda de atrás */}
      <circle cx="44" cy="38" r="17.6" {...canto} />
      <circle cx="44" cy="38" r="16.4" fill={relleno} stroke="#fff" strokeWidth="0.7" />
      <circle cx="44" cy="38" r="13" fill="none" stroke="#fff" strokeWidth="0.6" />

      {/* Moneda del frente, con el signo $ calado */}
      <circle cx="27" cy="31" r="22.4" fill={fondo} />
      <circle cx="27" cy="31" r="22" {...canto} />
      <circle cx="27" cy="31" r="20.6" fill={relleno} stroke="#fff" strokeWidth="0.8" />
      <circle cx="27" cy="31" r="16.4" fill={fondo} stroke="#fff" strokeWidth="0.7" />
      <path
        d="M31.6 22.6C30.2 21.2 28.4 20.6 26.6 20.6 23.6 20.6 21.4 22.4 21.4 25 21.4 28 24.2 29 27 29.8 30 30.6 32.8 31.6 32.8 34.8 32.8 37.8 30.2 39.6 27 39.6 24.6 39.6 22.6 38.6 21.2 36.8M27 17.4V44.6"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}
