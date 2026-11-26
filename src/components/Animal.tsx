// Ilustraciones propias de la serie de fauna, en una grilla de 64×64.
// Se rellenan con un rayado fino (como un grabado) que llega por `relleno`.

interface Props {
  indice: number; // posición del participante; se repite cada diez
  relleno: string; // url(#...) del rayado
  fondo: string; // color de la celda, para las manchas del yaguareté
}

const trazo = { stroke: '#fff', strokeWidth: 0.7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

function Guanaco({ relleno }: { relleno: string }) {
  return (
    <g fill={relleno} {...trazo}>
      <path d="M15 11.8 15.6 7.4 16.9 11.6ZM16.9 12 18.3 8 18.9 12.4Z" />
      <path d="M8.6 14.6C9 12.4 11.6 11.4 14.4 11.6 16.6 11.8 18.4 13 18.4 15 18.4 16.6 17 17.4 15 17.4L11 17.6C9.4 17.6 8.4 16.4 8.6 14.6Z" />
      <path d="M14.6 16.4C16.2 15.6 18 15.8 18.6 17.2L22.6 30 17.2 32.6Z" />
      <path d="M19.5 34C19.5 28.4 28 25.6 38 26 44 26.4 50 26.6 53 29.5 55.5 32 55 37 52 39.5 49 41.5 44 41.6 40 41.2H26C22 41 19.5 38.4 19.5 34Z" />
      <path d="M53 30.5C55.6 29.6 57.6 31 57 33.6 56.6 35 55.4 35.4 54.4 34.6Z" />
      <path d="M22 39H23.8L23.4 48 23.9 57.5H22.2L21.8 48ZM27 40H28.8L28.6 48.6 29.2 57.5H27.4L27 48.6ZM44.6 40H46.6L47.2 47.6 46.4 57.5H44.7L45.2 47.8ZM49.6 39H51.6L52.4 47 51.6 57.5H49.9L50.4 47.2Z" />
    </g>
  );
}

function Taruca({ relleno }: { relleno: string }) {
  return (
    <g>
      <path
        d="M14.4 13.6C13.4 10.4 12.6 8 11.2 5.4M12.6 9.4C11 8.6 9.6 8.4 8.4 8.8M16 13.4C17 10.2 18.6 7.8 20.6 5.8M18.4 9C19.8 8.2 21.2 8 22.4 8.4"
        fill="none"
        stroke="#fff"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <g fill={relleno} {...trazo}>
        <path d="M11.8 13.8 9.6 11.6 13 12.6ZM17.4 13.4 20 11.4 17 12.2Z" />
        <path d="M8.4 18.6C8.6 15.8 11 13.6 14 13.6 16.6 13.6 18.6 15.2 18.6 17.6 18.6 19.4 17.4 20.4 15.6 20.8L11.4 21.6C9.6 21.8 8.2 20.6 8.4 18.6Z" />
        <path d="M14 19.4C15.8 18.4 18 18.6 18.8 20.2L23.4 31.4 17.6 33.6Z" />
        <path d="M18 34.2C18 28.6 25.4 26.6 33.4 26.8 41 27 47.4 26.8 50.6 29.4 53.2 31.6 53.2 36.2 50.6 38.8 48.2 41 44 41.4 40.4 41.2H25C20.8 41 18 38.4 18 34.2Z" />
        <path d="M50.4 29.2C52.4 27.6 54.6 27.4 55.6 28.6 55 30.4 53 31.2 51.2 31Z" />
        <path d="M21.6 39.4H23.2L23 48.6 23.6 57.6H22L21.4 48.6ZM26.6 40.2H28.2L28.2 48.8 28.8 57.6H27.2L26.6 48.8ZM42.4 40.4H44.2L45 48.2 44.2 57.6H42.6L43.2 48.4ZM47.4 39.6H49.2L50.2 47.6 49.4 57.6H47.8L48.4 47.8Z" />
      </g>
    </g>
  );
}

function Yaguarete({ relleno, fondo }: { relleno: string; fondo: string }) {
  return (
    <g>
      <path d="M53.4 32.4C58.6 34 61.6 30 60.4 25.4 59.8 23.2 58.2 22.2 56.8 22.8" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <g fill={relleno} {...trazo}>
        <path d="M7.6 25.4 8.4 22.4 10.8 24.2ZM14.2 24.2 16.4 22.2 17.2 25.2Z" />
        <path d="M4.6 30.6C4.6 26.4 7.8 23.8 11.6 23.8 15.6 23.8 18.4 26.6 18.4 30.2 18.4 33.6 15.8 36 12 36 8 36 4.6 34 4.6 30.6Z" />
        <path d="M14 33C15 27.4 21 24.6 28 25 36 25.4 44 24.6 50 27 54 28.8 55.4 33 54 36.6 52.6 40 48.6 41 44 41H22C17 41 13.6 37.8 14 33Z" />
        <path d="M17 38.6H21.6L21.4 47.6 22.6 53.4H17.8L17.4 47.6ZM24.4 39.4H28.8L28.4 47.6 29.6 53.4H24.8L24.4 47.6ZM40.8 39.4H45.2L46.2 46.8 45.6 53.4H41L41.6 47ZM47 38.6H51.6L52.8 46.4 52 53.4H47.4L48 46.6Z" />
      </g>
      <g fill={fondo}>
        <circle cx="24.5" cy="30" r="1.6" /><circle cx="30.4" cy="33.4" r="1.6" /><circle cx="36.4" cy="29" r="1.6" />
        <circle cx="42.4" cy="33" r="1.6" /><circle cx="28" cy="37.4" r="1.3" /><circle cx="38" cy="36.8" r="1.3" />
        <circle cx="47.6" cy="30" r="1.3" /><circle cx="20.4" cy="34.4" r="1.2" /><circle cx="11.6" cy="31.4" r="0.9" />
      </g>
    </g>
  );
}

function Hornero({ relleno }: { relleno: string }) {
  return (
    <g>
      <rect x="4" y="48" width="56" height="2.6" rx="1.3" fill="#fff" />
      <path d="M28 40.6 27 48.2M33.5 40.6 34.5 48.2" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      <g fill={relleno} {...trazo}>
        <path d="M20.2 36.4 8.2 43.4 11.6 45.6 22.6 39.4Z" />
        <path d="M18.5 34.5C18.5 28 24 24.4 31 24.4 38 24.4 43.4 27.6 43.4 33 43.4 38.6 37.6 41.4 31 41.4 24 41.4 18.5 39.6 18.5 34.5Z" />
        <circle cx="42.4" cy="23.6" r="5.4" />
        <path d="M47 22.2 53.4 23.8 47 25.6Z" />
      </g>
      <circle cx="43.6" cy="22.6" r="0.9" fill="#fff" />
    </g>
  );
}

function Condor({ relleno }: { relleno: string }) {
  return (
    <g fill={relleno} {...trazo}>
      <path d="M32 26.4C26 22 15.6 20.2 3.6 24.4L10 26.4 5.6 29.6H13L8.8 33.6 18 31.4C24 31.2 28.2 32.4 32 34.6 35.8 32.4 40 31.2 46 31.4L55.2 33.6 51 29.6H58.4L54 26.4 60.4 24.4C48.4 20.2 38 22 32 26.4Z" />
      <ellipse cx="32" cy="32.4" rx="4.2" ry="7.4" />
      <circle cx="32" cy="22.6" r="3.2" />
      <path d="M29 38.6 32 45.2 35 38.6Z" />
    </g>
  );
}

function Ballena({ relleno }: { relleno: string }) {
  return (
    <g>
      <g fill={relleno} {...trazo}>
        <path d="M31.6 45C31 37 30 30.6 26 24.8 22 20.4 14 18.4 7.6 20.2 13.6 21.4 18 24.2 21.8 28.2 25.6 31.8 28.6 35 29.6 45Z" />
        <path d="M32.4 45C33 37 34 30.6 38 24.8 42 20.4 50 18.4 56.4 20.2 50.4 21.4 46 24.2 42.2 28.2 38.4 31.8 35.4 35 34.4 45Z" />
      </g>
      <path
        d="M5 48.6C11 45.6 17 51.6 23 48.6S35 45.6 41 48.6 53 51.6 59 48.6M11 53.4C16 51 21 55.8 26 53.4S36 51 41 53.4 51 55.8 54 53.4"
        fill="none"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </g>
  );
}

function Pinguino({ relleno, fondo }: { relleno: string; fondo: string }) {
  return (
    <g>
      <g fill={relleno} {...trazo}>
        <path d="M30 13.6C24.4 13.6 21.2 18.6 21.2 25.6 19.2 33.6 19.4 43.6 22 51.6 23.8 56.8 27.6 59 32 59 37 59 40.8 56 42 50.4 44 42.4 43.4 32 40.4 24.2 39 18 35.8 13.6 30 13.6Z" />
        <path d="M21.4 19.6 15 21.4 21.4 23.2Z" />
        <path d="M24.2 31.6C19.8 37.6 18.6 43.8 19.4 48.6 22.4 44.6 24.6 39.4 25.8 34Z" />
        <path d="M25.4 57.6 20.6 60.6H29.2ZM35.4 57.6 30.8 60.6H39.4Z" />
      </g>
      <path d="M24.6 29.6C28.6 33 35 33.2 39.4 29.8M23.6 36.4C28.6 39.6 35.4 39.6 40.6 36.6" fill="none" stroke={fondo} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="25.6" cy="19.6" r="1" fill={fondo} />
    </g>
  );
}

function Carpincho({ relleno, fondo }: { relleno: string; fondo: string }) {
  return (
    <g>
      <g fill={relleno} {...trazo}>
        <circle cx="15.4" cy="22.8" r="1.8" />
        <path d="M18 32C18 26 25 23 34 23 44 23 52 26 54 32 56 38 52 43 45 43H24C20 43 18 38 18 32Z" />
        <path d="M5.6 30C5.6 26 9 23.4 14 23.4 18.2 23.4 21.2 26 21.2 30L20 37C18 39 14 39.6 10 38.6 7.4 37.8 5.6 34.6 5.6 30Z" />
        <path d="M22 41H26L25.6 50H22.4ZM28 41.4H32L31.6 50H28.4ZM42 41.4H46L45.8 50H42.4ZM48 41H52L51.8 50H48.4Z" />
      </g>
      <circle cx="11.6" cy="28" r="0.9" fill={fondo} />
      <path d="M6.4 31.8H9" stroke={fondo} strokeWidth="1" strokeLinecap="round" />
    </g>
  );
}

function Nandu({ relleno }: { relleno: string }) {
  return (
    <g>
      <path d="M35.4 42 34 59.6M40.6 42 43 59.6M31.4 59.8H35.6M41.4 59.8H45.6" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <g fill={relleno} {...trazo}>
        <path d="M24 30.6C24 24.4 31.6 21.4 40 22 48 22.6 54 28 53 34 52 40 45.4 43.2 38 43.2 30 43.2 24 38.4 24 30.6Z" />
        <path d="M52 31.6C56 33.6 57.4 37.8 55.4 41.2 53.4 39.4 52 37.2 51 35Z" />
        <path d="M15.6 13.6C17.2 12.4 19.6 12.6 20.6 14.2L28.6 28.4 23.4 30.8Z" />
        <ellipse cx="15.4" cy="11.6" rx="3.6" ry="2.7" />
        <path d="M12.2 10.8 8.2 11.9 12.2 13Z" />
      </g>
    </g>
  );
}

function Tatu({ relleno, fondo }: { relleno: string; fondo: string }) {
  return (
    <g>
      <g fill={relleno} {...trazo}>
        <path d="M14.2 35.8 13 31.8 15.8 35Z" />
        <path d="M16.4 37C13.4 35.6 9.2 35.8 5 38.6 8.6 40.6 12.6 41.4 16.4 40.4Z" />
        <path d="M51.6 37.6C56 38.6 59 41 61 44.4 57 43.4 54 42.4 51.2 41Z" />
        <path d="M16 41C16 30.6 24 24 34 24 44 24 52 30.6 52 41Z" />
        <path d="M20 40.6H23.6L23.2 46.4H20.2ZM44.8 40.6H48.4L48.2 46.4H45Z" />
      </g>
      <path
        d="M27.6 25.6C26.2 30.4 26.2 36.4 27 41M34 24.2V41M40.4 25.6C41.8 30.4 41.8 36.4 41 41M21.4 30.4C20.6 33.6 20.6 37.6 21 41M46.6 30.4C47.4 33.6 47.4 37.6 47 41"
        fill="none"
        stroke={fondo}
        strokeWidth="1"
      />
    </g>
  );
}

export const ANIMALES = [
  'guanaco',
  'taruca',
  'yaguareté',
  'hornero',
  'cóndor',
  'ballena franca',
  'pingüino de Magallanes',
  'carpincho',
  'ñandú',
  'tatú',
] as const;

export default function Animal({ indice, relleno, fondo }: Props) {
  switch (indice % ANIMALES.length) {
    case 0:
      return <Guanaco relleno={relleno} />;
    case 1:
      return <Taruca relleno={relleno} />;
    case 2:
      return <Yaguarete relleno={relleno} fondo={fondo} />;
    case 3:
      return <Hornero relleno={relleno} />;
    case 4:
      return <Condor relleno={relleno} />;
    case 5:
      return <Ballena relleno={relleno} />;
    case 6:
      return <Pinguino relleno={relleno} fondo={fondo} />;
    case 7:
      return <Carpincho relleno={relleno} fondo={fondo} />;
    case 8:
      return <Nandu relleno={relleno} />;
    default:
      return <Tatu relleno={relleno} fondo={fondo} />;
  }
}
