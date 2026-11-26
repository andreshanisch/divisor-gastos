# Divisor de gastos — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Una página estática, mobile-first, que carga participantes y gastos de un evento grupal y calcula quién le transfiere a quién, con el resultado copiable para WhatsApp.

**Architecture:** La lógica vive en `src/logic/`, módulos puros en TypeScript sin dependencias de React, desarrollados con TDD. Trabajan con montos en centavos enteros y con un único objeto `EventState` inmutable. La interfaz es una sola página React que mantiene ese `EventState` en un hook, lo guarda en `localStorage` con cada cambio y recalcula el resultado en cada render.

**Tech Stack:** Vite, React 18+, TypeScript, Vitest + jsdom + Testing Library, GitHub Actions → GitHub Pages. Node 22 (instalado: v22.15.0).

**Spec:** `docs/superpowers/specs/2026-11-25-divisor-gastos-design.md`

## Global Constraints

- **Git: nunca ejecutar `git commit`, `git push` ni nada que cree commits, ramas remotas o PRs.** Los pasos "Proponer commit" significan: detenerse, listar los archivos y un mensaje, y esperar a que Andres haga el commit. Sin `Co-Authored-By` ni menciones a Claude en mensajes, código o documentación.
- Respuestas y textos de la app en español (rioplatense).
- Montos **siempre en centavos, como enteros** (`number` entero). Ningún cálculo de reparto o saldo usa decimales.
- Reparto: partes iguales; los centavos sobrantes se asignan de a uno a los primeros participantes **en orden de carga del evento** (orden de `event.participants`), no en el orden en que se marcaron.
- Transferencias: greedy (mayor deudor contra mayor acreedor), como mucho n − 1 transferencias.
- Formato de moneda argentino: `$18.000,50`; si no hay centavos, `$18.000` (sin `,00`).
- Sin librería de UI; CSS simple en un solo archivo.
- Persistencia: un solo evento en `localStorage`, guardado con cada cambio.
- Sin backend, sin login, una sola moneda.
- Deploy: GitHub Pages vía GitHub Actions al pushear a `main`. `base: './'` en Vite para que funcione con cualquier nombre de repo.

## Review Focus

1. **Montos escritos a la argentina.** Alguien tipea `18.000`, `18000,5` o `1.234,56` en el celular. Se espera que `18.000` sea dieciocho mil pesos, no dieciocho. → tests de `parseAmount` en Task 1.
2. **`localStorage` corrupto, de otra forma o no disponible** (JSON roto, Safari en modo privado que tira excepción). Se espera que la app abra con un evento nuevo, sin pantalla en blanco. → tests de `loadEvent`/`saveEvent` en Task 5.
3. **El que pagó no participa del gasto** (Andres paga un taxi de Juan y Sofi). Se espera que Andres cobre el total y no se le descuente nada. → test en Task 2.
4. **Participante agregado después de cargar gastos.** Se espera que los gastos viejos no cambien (el recién llegado no consumió eso) y que el gasto ya no muestre "entre: todos". → tests en Task 4 y Task 7.
5. **Portapapeles no disponible** (navegador viejo, permiso denegado). Se espera ver el texto para copiarlo a mano, no un botón que no hace nada. → test en Task 8.

---

## Estructura de archivos

```
package.json, tsconfig.json, vite.config.ts, index.html
src/
  main.tsx                 monta <App/>
  App.tsx                  compone las secciones; usa useEventState
  styles.css               estilos mobile-first
  test-setup.ts            importa @testing-library/jest-dom/vitest
  logic/
    types.ts               tipos de dominio
    money.ts               parseAmount, formatARS
    split.ts               splitExpense
    balances.ts            computeBalances
    settle.ts              settle
    event.ts               operaciones puras sobre EventState
    share.ts               formatShareText
    *.test.ts              tests de cada módulo
  storage.ts (+ .test.ts)  loadEvent, saveEvent
  useEventState.ts         hook: estado + persistencia
  components/
    EventHeader.tsx        nombre editable + "Nuevo evento"
    Participants.tsx       chips + agregar/quitar
    Expenses.tsx           lista de gastos
    ExpenseForm.tsx        alta/edición de gasto
    Result.tsx             transferencias + copiar
    *.test.tsx
.github/workflows/deploy.yml
README.md
```

### Tipos de dominio (`src/logic/types.ts`, se crean en Task 2)

```ts
export type Cents = number;
export interface Participant { id: string; name: string }
export interface Expense {
  id: string;
  description: string;
  amount: Cents;            // > 0
  payerId: string;
  participantIds: string[]; // no vacío
}
export interface EventState {
  version: 1;
  name: string;
  participants: Participant[];
  expenses: Expense[];
}
export interface Transfer { from: string; to: string; amount: Cents } // ids
```

Los ids los genera la UI con `crypto.randomUUID()`; las funciones de lógica los reciben como argumento para seguir siendo puras.

---

### Task 1: Proyecto base y manejo de montos

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/test-setup.ts`, `.gitignore`
- Create: `src/logic/money.ts`
- Test: `src/logic/money.test.ts`

**Interfaces:**
- Produces: `parseAmount(text: string): Cents | null` y `formatARS(cents: Cents): string`; scripts `npm test`, `npm run build`, `npm run dev`.

- [ ] **Step 1: Armar el proyecto**

`npm init -y`, luego `npm install react react-dom` y `npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom`.
Scripts: `"dev": "vite"`, `"build": "tsc --noEmit && vite build"`, `"preview": "vite preview"`, `"test": "vitest run"`. `"type": "module"`.
`vite.config.ts`: plugin react, `base: './'`, `test: { environment: 'jsdom', setupFiles: './src/test-setup.ts' }` (con `/// <reference types="vitest/config" />`).
`tsconfig.json`: `strict: true`, `jsx: "react-jsx"`, `moduleResolution: "bundler"`, `noEmit: true`, `include: ["src", "vite.config.ts"]`. Sin globals: los tests importan `describe/it/expect` de `vitest`. `src/test-setup.ts`: `import '@testing-library/jest-dom/vitest'`.
`index.html`: `lang="es"`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, título "Divisor de gastos". `App.tsx` provisorio que renderiza `<h1>Divisor de gastos</h1>`.
`.gitignore`: `node_modules`, `dist`.

- [ ] **Step 2: Escribir los tests de montos**

```ts
describe('parseAmount', () => {
  it.each([
    ['18000', 1800000], ['18.000', 1800000], ['18000,5', 1800050],
    ['18.000,50', 1800050], ['1.234.567,89', 123456789], ['0,01', 1],
    [' 9000 ', 900000], ['$ 9.000', 900000], ['12.5', 1250], ['12.50', 1250],
  ])('%s → %i centavos', (text, cents) => expect(parseAmount(text)).toBe(cents));

  it.each(['', 'abc', '0', '0,00', '-5', '1,234', '1.2.3', '18.00.0', '1,5,0'])(
    'rechaza %s', (text) => expect(parseAmount(text)).toBeNull());
});

describe('formatARS', () => {
  it.each([
    [1800000, '$18.000'], [1800050, '$18.000,50'], [1, '$0,01'],
    [0, '$0'], [123456789, '$1.234.567,89'], [150000, '$1.500'], [1250, '$12,50'],
  ])('%i → %s', (cents, text) => expect(formatARS(cents)).toBe(text));
});
```

- [ ] **Step 3: Correr y ver que fallan**

Run: `npm test -- src/logic/money.test.ts`
Expected: FAIL, no existe `./money`.

- [ ] **Step 4: Implementar `parseAmount` y `formatARS` en `src/logic/money.ts`**

`parseAmount`: quitar espacios y `$`. Aceptar solo `^\d{1,3}(\.\d{3})+(,\d{1,2})?$` (con miles), `^\d+(,\d{1,2})?$` (sin miles) o `^\d+\.\d{1,2}$` (punto decimal con 1–2 dígitos, para teclados que no tienen coma). Convertir con aritmética de strings (parte entera × 100 + decimales rellenados a 2), nunca `parseFloat`. Devolver `null` si no matchea o si el resultado es 0.
`formatARS`: armado manual (no `Intl`, para que no dependa del ICU del navegador): miles con `.`, decimales con `,` solo si `cents % 100 !== 0`.

- [ ] **Step 5: Correr y ver que pasan; verificar build**

Run: `npm test` → PASS. Run: `npm run build` → termina sin errores y crea `dist/`.

- [ ] **Step 6: Proponer commit (no ejecutar)**

Archivos: `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore`, `src/`. Mensaje: `feat: proyecto base con Vite y manejo de montos en centavos`.

---

### Task 2: Reparto de gastos y balances

**Files:**
- Create: `src/logic/types.ts` (tipos de arriba), `src/logic/split.ts`, `src/logic/balances.ts`
- Test: `src/logic/split.test.ts`, `src/logic/balances.test.ts`

**Interfaces:**
- Consumes: `Cents` y demás tipos.
- Produces: `splitExpense(amount: Cents, orderedIds: string[]): Map<string, Cents>` y `computeBalances(event: EventState): Map<string, Cents>` (un entry por cada participante del evento, en orden de carga; positivo = le deben).

- [ ] **Step 1: Escribir los tests**

Helper de test `ev(names: string[], expenses)` que arma un `EventState` con ids iguales a los nombres.

```ts
// split
expect([...splitExpense(1000, ['a','b','c'])]).toEqual([['a',334],['b',333],['c',333]]);
expect([...splitExpense(1001, ['a','b','c'])]).toEqual([['a',334],['b',334],['c',333]]);
expect([...splitExpense(900, ['a'])]).toEqual([['a',900]]);
// propiedad: para amounts 1..500 y 1..7 personas, la suma de partes === amount
// y max − min ≤ 1

// balances
it('ejemplo del spec', ...) // Pizza 1800000 pagó Andres entre todos;
                            // Cerveza 900000 pagó Juan entre Juan, Sofi
  // → Andres 1200000, Juan -150000, Sofi -1050000
it('sobrante va al primero en orden de carga, no de selección')
  // participants [a,b,c]; gasto 100 pagó a, participantIds ['c','b'] → b -50, c -50;
  // gasto 101 participantIds ['c','b'] → b -51, c -50
it('el que pagó no participa') // a paga 900 entre b,c → a 900, b -450, c -450
it('alguien sin gastos queda en 0 y aparece en el mapa')
it('evento sin gastos: todos en 0')
it('la suma de balances es 0') // varios eventos de prueba, incluido montos no exactos
```

- [ ] **Step 2: Correr y ver que fallan**

Run: `npm test -- src/logic/split.test.ts src/logic/balances.test.ts` → FAIL.

- [ ] **Step 3: Implementar `splitExpense` y `computeBalances`**

`splitExpense`: `base = Math.floor(amount / n)`, `resto = amount % n`, los primeros `resto` de `orderedIds` reciben `base + 1`.
`computeBalances`: inicializa todos en 0; por gasto suma `amount` al pagador, ordena `participantIds` según el índice en `event.participants` y resta cada parte de `splitExpense`.

- [ ] **Step 4: Correr y ver que pasan**

Run: `npm test` → PASS.

- [ ] **Step 5: Proponer commit (no ejecutar)**

Archivos: `src/logic/types.ts`, `split.ts`, `balances.ts` y sus tests. Mensaje: `feat: reparto de gastos y cálculo de balances`.

---

### Task 3: Transferencias para saldar

**Files:**
- Create: `src/logic/settle.ts`
- Test: `src/logic/settle.test.ts`

**Interfaces:**
- Consumes: `computeBalances` (en los tests), `Transfer`.
- Produces: `settle(balances: Map<string, Cents>): Transfer[]`. No muta el mapa de entrada.

- [ ] **Step 1: Escribir los tests**

```ts
it('ejemplo del spec', () =>
  expect(settle(new Map([['Andres',1200000],['Juan',-150000],['Sofi',-1050000]])))
    .toEqual([{ from:'Sofi', to:'Andres', amount:1050000 },
              { from:'Juan', to:'Andres', amount:150000 }]));
it('todos en 0 → sin transferencias');
it('mapa vacío → sin transferencias');
it('desempate determinístico: a igual monto gana el primero en orden del mapa');
// propiedad, sobre eventos generados con un PRNG con semilla fija (200 casos,
// 1–8 participantes, 0–10 gastos, montos 1–10.000.000, subconjuntos aleatorios no vacíos):
it('aplicar las transferencias deja a todos en 0');
it('a lo sumo n − 1 transferencias, todas con amount > 0 y from !== to');
```

- [ ] **Step 2: Correr y ver que fallan**

Run: `npm test -- src/logic/settle.test.ts` → FAIL.

- [ ] **Step 3: Implementar `settle`**

Copiar a dos listas (deudores con monto positivo adeudado, acreedores). En cada vuelta tomar el de mayor monto de cada lista (empate: el que aparece primero en el mapa), transferir `min(deuda, crédito)`, descontar y sacar a quien llegó a 0. Repetir hasta vaciar.

- [ ] **Step 4: Correr y ver que pasan**

Run: `npm test` → PASS.

- [ ] **Step 5: Proponer commit (no ejecutar)**

Archivos: `src/logic/settle.ts`, `src/logic/settle.test.ts`. Mensaje: `feat: cálculo de transferencias con algoritmo greedy`.

---

### Task 4: Operaciones sobre el evento

**Files:**
- Create: `src/logic/event.ts`
- Test: `src/logic/event.test.ts`

**Interfaces:**
- Consumes: tipos de Task 2.
- Produces (todas puras, devuelven un `EventState` nuevo; las que validan tiran `Error` con mensaje en español para la UI):
  - `createEvent(): EventState` → `{ version: 1, name: 'Nuevo evento', participants: [], expenses: [] }`
  - `renameEvent(e, name: string): EventState` — recorta espacios; si queda vacío, deja el nombre anterior.
  - `addParticipant(e, id: string, name: string): EventState` — recorta; tira `'Escribí un nombre'` si vacío y `'Ya hay alguien con ese nombre'` si repetido (sin distinguir mayúsculas ni espacios de los bordes).
  - `isParticipantInUse(e, id: string): boolean` — pagó o está en algún `participantIds`.
  - `removeParticipant(e, id: string): EventState` — tira `'Primero sacalo de sus gastos'` si `isParticipantInUse`.
  - `addExpense(e, expense: Expense): EventState`, `updateExpense(e, expense: Expense): EventState` (reemplaza por id), `removeExpense(e, id: string): EventState`.
  - `validateExpense(e, x: Omit<Expense,'id'>): string | null` — devuelve el mensaje de error o `null`: descripción vacía → `'Poné una descripción'`; `amount` no entero o ≤ 0 → `'El monto tiene que ser mayor a 0'`; pagador inexistente → `'Elegí quién pagó'`; `participantIds` vacío → `'Elegí al menos una persona'`. `addExpense`/`updateExpense` tiran ese mensaje si no es `null`.
  - `isSplitAmongAll(e, x: Expense): boolean` — el gasto incluye a todos los participantes actuales.

- [ ] **Step 1: Escribir los tests**

Un test por cada validación y mensaje de arriba, más:
```ts
it('no permite quitar a quien pagó un gasto');
it('no permite quitar a quien participa de un gasto sin haberlo pagado');
it('permite quitarlo después de sacarlo del gasto (updateExpense) y de borrar el que pagó');
it('agregar un participante no cambia los gastos existentes', () => {
  // después de addParticipant, expenses es igual (toEqual) al anterior
  // e isSplitAmongAll pasa de true a false
});
it('no muta el evento de entrada'); // Object.freeze profundo del input
```

- [ ] **Step 2: Correr y ver que fallan**

Run: `npm test -- src/logic/event.test.ts` → FAIL.

- [ ] **Step 3: Implementar las funciones en `src/logic/event.ts`**

- [ ] **Step 4: Correr y ver que pasan**

Run: `npm test` → PASS.

- [ ] **Step 5: Proponer commit (no ejecutar)**

Archivos: `src/logic/event.ts`, `src/logic/event.test.ts`. Mensaje: `feat: operaciones sobre el evento con validaciones`.

---

### Task 5: Persistencia en localStorage

**Files:**
- Create: `src/storage.ts`, `src/useEventState.ts`
- Test: `src/storage.test.ts`

**Interfaces:**
- Consumes: `createEvent`, `EventState`.
- Produces:
  - `STORAGE_KEY = 'divisor-gastos:evento'`
  - `loadEvent(storage: Storage = localStorage): EventState` — si no hay nada, el JSON es inválido, `version !== 1`, la forma no coincide (validar a mano los campos y tipos, incluidos que los ids referenciados existan) o `getItem` tira, devuelve `createEvent()`.
  - `saveEvent(e: EventState, storage: Storage = localStorage): void` — si `setItem` tira, lo ignora (`console.warn`).
  - `useEventState(): [EventState, (update: (e: EventState) => EventState) => void]` — estado inicial con `loadEvent()`, guarda con `saveEvent` en un `useEffect` en cada cambio.

- [ ] **Step 1: Escribir los tests**

Usar un `Storage` falso (objeto con `getItem/setItem`) o `localStorage` de jsdom.
```ts
it('guarda y recupera el mismo evento (toEqual)');
it('sin datos → evento nuevo');
it.each(['{no es json', '"texto"', 'null', '{"version":2}',
         '{"version":1,"name":"x","participants":"no","expenses":[]}',
         /* gasto con payerId que no existe */ ])('datos inválidos %s → evento nuevo');
it('getItem que tira → evento nuevo');
it('setItem que tira → no tira');
```

- [ ] **Step 2: Correr y ver que fallan**

Run: `npm test -- src/storage.test.ts` → FAIL.

- [ ] **Step 3: Implementar `loadEvent`, `saveEvent` y `useEventState`**

- [ ] **Step 4: Correr y ver que pasan**

Run: `npm test` → PASS.

- [ ] **Step 5: Proponer commit (no ejecutar)**

Archivos: `src/storage.ts`, `src/storage.test.ts`, `src/useEventState.ts`. Mensaje: `feat: guardar el evento en localStorage`.

---

### Task 6: Encabezado y participantes

**Files:**
- Create: `src/components/EventHeader.tsx`, `src/components/Participants.tsx`, `src/styles.css`
- Modify: `src/App.tsx` (usa `useEventState` y compone las secciones), `src/main.tsx` (importa `styles.css`)
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `useEventState`, funciones de `event.ts`.
- Produces: `<EventHeader event onRename onNewEvent />`, `<Participants event onAdd(name) onRemove(id) />`. Las props callbacks reciben valores ya validados por la lógica; los componentes muestran el `Error.message` que tira la lógica.

- [ ] **Step 1: Escribir los tests (render de `<App/>` con `localStorage.clear()` en `beforeEach`)**

```ts
it('agrega un participante con el botón + y con Enter');
it('muestra "Ya hay alguien con ese nombre" al repetir un nombre');
it('el botón quitar de alguien con gastos está deshabilitado y explica por qué');
  // (sembrar localStorage con un evento con gasto)
it('el nombre del evento se edita y persiste al volver a montar <App/>');
it('"Nuevo evento" pide confirmación (window.confirm) y si se acepta deja el evento vacío');
it('si se cancela la confirmación no cambia nada');
```

- [ ] **Step 2: Correr y ver que fallan**

Run: `npm test -- src/App.test.tsx` → FAIL.

- [ ] **Step 3: Implementar los componentes**

Mobile-first: botones e inputs de al menos 44px de alto, ancho máximo ~480px centrado, un solo `styles.css`. Encabezado: nombre como texto con botón ✎ que lo vuelve input (guardar en blur/Enter). Participantes: chips con × y un input + botón "+".

- [ ] **Step 4: Correr y ver que pasan**

Run: `npm test` → PASS.

- [ ] **Step 5: Proponer commit (no ejecutar)**

Archivos: `src/App.tsx`, `src/main.tsx`, `src/styles.css`, `src/components/EventHeader.tsx`, `src/components/Participants.tsx`, `src/App.test.tsx`. Mensaje: `feat: nombre del evento y participantes`.

---

### Task 7: Gastos

**Files:**
- Create: `src/components/Expenses.tsx`, `src/components/ExpenseForm.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/Expenses.test.tsx`

**Interfaces:**
- Consumes: `parseAmount`, `formatARS`, `validateExpense`, `addExpense`, `updateExpense`, `removeExpense`, `isSplitAmongAll`.
- Produces: `<Expenses event onAdd onUpdate onRemove />`; `<ExpenseForm event initial?: Expense onSave(x: Omit<Expense,'id'>) onCancel />`.

- [ ] **Step 1: Escribir los tests**

```ts
it('agrega un gasto: descripción, monto "18.000", pagador; todos marcados por defecto');
  // la lista muestra "Pizza", "$18.000", "Andres" y "entre: todos"
it('desmarcar personas muestra "entre: Juan, Sofi" (en orden de carga)');
it('monto inválido muestra el error y no guarda');
it('sin personas marcadas muestra "Elegí al menos una persona"');
it('editar un gasto reemplaza sus datos');
it('borrar un gasto lo saca de la lista');
it('tras agregar un participante, un gasto viejo pasa a mostrar la lista de nombres en vez de "entre: todos"');
it('"+ Agregar gasto" está deshabilitado sin participantes');
```

- [ ] **Step 2: Correr y ver que fallan**

Run: `npm test -- src/components/Expenses.test.tsx` → FAIL.

- [ ] **Step 3: Implementar**

Input de monto `type="text" inputMode="decimal"` (para teclado numérico con coma). El pagador por defecto es el primer participante. El formulario se abre inline debajo de la lista; al editar, precarga el monto con `formatARS` sin `$`.

- [ ] **Step 4: Correr y ver que pasan**

Run: `npm test` → PASS.

- [ ] **Step 5: Proponer commit (no ejecutar)**

Archivos: `src/App.tsx`, `src/components/Expenses.tsx`, `src/components/ExpenseForm.tsx`, `src/components/Expenses.test.tsx`. Mensaje: `feat: alta, edición y borrado de gastos`.

---

### Task 8: Resultado y copiar para WhatsApp

**Files:**
- Create: `src/logic/share.ts`, `src/components/Result.tsx`
- Modify: `src/App.tsx`
- Test: `src/logic/share.test.ts`, `src/components/Result.test.tsx`

**Interfaces:**
- Consumes: `computeBalances`, `settle`, `formatARS`.
- Produces: `formatShareText(event: EventState, transfers: Transfer[]): string`; `<Result event />`.

- [ ] **Step 1: Escribir los tests**

```ts
// share
expect(formatShareText(ejemploSpec, settle(computeBalances(ejemploSpec)))).toBe(
  'Cena del viernes\n\nSofi → Andres: $10.500\nJuan → Andres: $1.500');
expect(formatShareText(sinGastos, [])).toBe('Cena del viernes\n\nNo hay nada que saldar.');

// Result
it('muestra las transferencias del ejemplo del spec y se actualiza al agregar un gasto');
it('sin gastos muestra "No hay nada que saldar."');
it('"Copiar para WhatsApp" llama a navigator.clipboard.writeText con el texto y muestra "¡Copiado!"');
it('si clipboard no existe o writeText rechaza, muestra un <textarea> de solo lectura con el texto');
```

- [ ] **Step 2: Correr y ver que fallan**

Run: `npm test -- src/logic/share.test.ts src/components/Result.test.tsx` → FAIL.

- [ ] **Step 3: Implementar**

`Result` calcula en cada render `settle(computeBalances(event))` (es barato; no hace falta memo) y traduce ids a nombres.

- [ ] **Step 4: Correr y ver que pasan; probar a mano**

Run: `npm test` → PASS. Run: `npm run dev`, abrir en el navegador con viewport móvil (375×812), cargar el ejemplo del spec, recargar la página y confirmar que sigue todo y que el resultado es Sofi → Andres $10.500, Juan → Andres $1.500.

- [ ] **Step 5: Proponer commit (no ejecutar)**

Archivos: `src/logic/share.ts`, `src/logic/share.test.ts`, `src/components/Result.tsx`, `src/components/Result.test.tsx`, `src/App.tsx`. Mensaje: `feat: resultado y copiar para WhatsApp`.

---

### Task 9: Deploy a GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`

**Interfaces:**
- Consumes: `npm ci`, `npm test`, `npm run build` → `dist/`.

- [ ] **Step 1: Escribir el workflow**

Trigger `push` a `main` y `workflow_dispatch`. `permissions: { contents: read, pages: write, id-token: write }`, `concurrency: { group: pages, cancel-in-progress: true }`. Job `build`: `actions/checkout@v4`, `actions/setup-node@v4` con `node-version: 22` y `cache: npm`, `npm ci`, `npm test`, `npm run build`, `actions/upload-pages-artifact@v3` con `path: dist`. Job `deploy` (`needs: build`, `environment: github-pages`): `actions/deploy-pages@v4`.

- [ ] **Step 2: Escribir `README.md`**

Qué hace, `npm install` / `npm run dev` / `npm test`, y el paso manual: en GitHub, Settings → Pages → Source: **GitHub Actions**.

- [ ] **Step 3: Verificar localmente**

Run: `npm ci && npm test && npm run build && npm run preview` → tests en verde y la app carga desde `dist/` con rutas relativas (sin 404 de assets en la consola).

- [ ] **Step 4: Proponer commit (no ejecutar)**

Archivos: `.github/workflows/deploy.yml`, `README.md`. Mensaje: `ci: deploy a GitHub Pages`. Recordarle a Andres que el push a `main` dispara el deploy y que antes tiene que elegir "GitHub Actions" como fuente de Pages.
