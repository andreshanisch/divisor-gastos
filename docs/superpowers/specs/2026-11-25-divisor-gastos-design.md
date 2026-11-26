# Divisor de gastos grupales — Diseño

Fecha: 2026-11-25
Estado: aprobado

## Intención

Una página web para cerrar las cuentas de un evento grupal suelto (un viaje, una salida, una comida). Se carga quién pagó qué y entre quiénes se divide cada gasto, y la página dice quién le transfiere a quién y cuánto.

El primer objetivo es tener un ejercicio para probar el flujo completo de desarrollo (diseño, plan, TDD, revisión). Si funciona bien, Andres la va a usar seguido desde el celular. El repo es público en su GitHub.

## Objetivos

- Cargar participantes y gastos desde el celular, cómodo con una mano.
- Cada gasto tiene una descripción, un monto y quién lo pagó, y se divide en partes iguales entre un subconjunto de participantes (por defecto, todos).
- Calcular las transferencias para saldar: pocas y claras.
- Compartir el resultado por WhatsApp.

## No objetivos (por ahora)

- Varios usuarios cargando desde su propio celular. Puede venir más adelante; el diseño no debe impedirlo.
- Historial de eventos o saldos que se arrastran entre eventos.
- Login, cuentas o backend.
- Varias monedas en un mismo evento.
- Gastos pagados entre varias personas o divididos en partes desiguales.

## Anti-objetivos (cosas que la harían fracasar aunque "funcione")

- Perder la cuenta a mitad de la salida porque se recargó o se cerró la pestaña.
- Que los números no cierren: transferencias que no suman lo que corresponde o centavos que aparecen o desaparecen por redondeo.
- Que en el celular sea más lento que hacer la cuenta a mano.

## Restricciones

- Hosting gratuito y sin servidor: GitHub Pages.
- **Andres hace todos los commits y pushes.** Quien construya escribe archivos pero no ejecuta comandos de git. En cada punto donde corresponda un commit, propone qué incluir y un mensaje, y Andres decide.

## Enfoques considerados

1. **Página estática en React + TypeScript (Vite), en GitHub Pages.** Lógica en un módulo puro con tests. **Elegido.** No necesita servidor y anda rápido en el celular. React ya lo usa en otro proyecto. El módulo de cálculo se puede reutilizar si algún día hay backend.
2. **Backend en Python (FastAPI) + interfaz web.** Descartado por ahora: hoy no hace falta servidor, y los hostings gratuitos "se duermen" y tardan en responder justo cuando se usa la app.
3. **Python en el navegador (PyScript/Pyodide).** Descartado: obliga a bajar varios MB en el celular antes de poder usarla, y es una tecnología de nicho.

## Diseño

### Lógica (módulo puro, sin dependencias de React)

- Los montos se manejan **en centavos, como enteros**, para evitar errores de punto flotante.
- **Balance de cada persona** = lo que pagó − lo que le corresponde pagar.
- **Reparto de un gasto:** se divide en partes iguales entre sus participantes. Si sobran centavos, se asignan de a uno a los primeros participantes en orden de carga. Así el reparto es determinístico y siempre suma exactamente el total. *(Decisión de Claude)*
- **Transferencias:** algoritmo greedy. Se toma al que más debe y al que más tiene que cobrar, se salda lo que se pueda y se repite. Garantiza como mucho n − 1 transferencias. Encontrar el mínimo exacto es un problema computacionalmente difícil, y el greedy es la solución estándar para grupos chicos. *(Decisión de Claude)*
- Invariantes que los tests tienen que cubrir:
  - la suma de todos los balances es 0;
  - aplicar las transferencias deja a todos en 0.
- Casos borde a testear:
  - alguien que no pagó nada;
  - alguien que no participa en ningún gasto;
  - gastos con un solo participante;
  - montos que no se dividen exacto;
  - evento sin gastos;
  - borrar a un participante que tiene gastos (bloqueado, ver abajo).

### Interfaz (mobile-first, una sola página)

```
┌─────────────────────────────┐
│ Cena del viernes        [✎] │
├─────────────────────────────┤
│ Participantes               │
│ [Andres] [Juan] [Sofi] [+]  │
├─────────────────────────────┤
│ Gastos                      │
│ Pizza      $18.000  Andres  │
│   entre: todos              │
│ Cerveza     $9.000  Juan    │
│   entre: Juan, Sofi         │
│ [+ Agregar gasto]           │
├─────────────────────────────┤
│ Resultado                   │
│ Sofi → Andres   $10.500     │
│ Juan → Andres    $1.500     │
│ [Copiar para WhatsApp]      │
└─────────────────────────────┘
```

- Nombre del evento editable.
- Participantes: agregar y quitar. No se puede quitar a alguien que pagó o participa en algún gasto sin antes sacarlo de esos gastos. *(Decisión de Claude)*
- Gasto: descripción, monto, quién pagó y entre quiénes (todos marcados por defecto). Se puede editar y borrar.
- El resultado se recalcula solo con cada cambio.
- "Copiar para WhatsApp" copia un texto plano con el nombre del evento y la lista de transferencias. *(Decisión de Claude)*
- "Nuevo evento" borra el actual, previa confirmación.
- Moneda: pesos, con formato argentino ($18.000,50). *(Decisión de Claude)*

### Persistencia

- El evento en curso se guarda en `localStorage` con cada cambio y se recupera al abrir la página. Hay un solo evento a la vez. *(Decisión de Claude)*

### Herramientas

- Vite + React + TypeScript.
- Tests con Vitest. La lógica se desarrolla con TDD.
- Deploy a GitHub Pages con un workflow de GitHub Actions que se dispara al pushear a `main`.

## Queda a criterio de quien construya

- Estructura de componentes y estilos (sin librería de UI pesada; CSS simple alcanza).
- Nombre del repo y de la app.
- Mensajes de error y validaciones menores (montos vacíos o negativos, nombres repetidos).
