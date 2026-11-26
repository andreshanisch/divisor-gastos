# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Una sola persona carga todo: Andres, en su propio celular. El resto del grupo nunca ve la app; recibe el resultado como texto por WhatsApp. Los otros participantes existen en la app solo como nombres.

## Product Purpose

Cerrar las cuentas de un evento grupal suelto (un viaje, una salida, una comida). Se carga quién pagó qué y entre quiénes se divide cada gasto, y la página dice quién le transfiere a quién y cuánto, con pocas transferencias. Éxito: que cargar y cerrar las cuentas sea más rápido que hacer la cuenta a mano y que los números siempre cierren al centavo.

## Positioning

Sin cuentas, sin login, sin backend: una página que abre al instante, guarda el evento en el propio navegador y devuelve un texto listo para pegar en WhatsApp.

## Operating Context

- Uso principal en viajes: varios días, muchos gastos que se acumulan, a veces al aire libre y con sol.
- También al día siguiente, tranquilo, repasando lo que se gastó.
- Se usa con una mano, en el celular. El resultado sale por "Copiar para WhatsApp".

## Capabilities and Constraints

- Un solo evento a la vez, guardado en `localStorage`; "Nuevo evento" lo borra previa confirmación.
- Participantes: agregar y quitar; no se puede quitar a quien pagó o participa en un gasto.
- Gasto: descripción, monto, quién pagó y entre quiénes (todos por defecto); se divide en partes iguales. Se puede editar y borrar (con confirmación).
- Montos en pesos argentinos, en centavos enteros, formato `$18.000,50`. Los centavos sobrantes van a los primeros en orden de carga.
- Transferencias por algoritmo greedy, como mucho n − 1.
- Stack existente: React + TypeScript + Vite, CSS simple en un solo archivo, sin librería de UI. Deploy a GitHub Pages.
- No objetivos: varios usuarios cargando, historial de eventos, varias monedas, gastos con varios pagadores o partes desiguales.
- Abierto: el nombre de la app. Hoy es "Divisor de gastos"; el dueño pidió propuestas.

## Brand Commitments

Idioma: español rioplatense ("Agregá", "Elegí", "sacalo"). No hay logo ni identidad previa.

## Evidence on Hand

Ninguna: no hay testimonios, usuarios ni capturas. No inventarlos.

## Product Principles

1. Los números cierran siempre: nada de centavos que aparecen o desaparecen.
2. Nunca perder la cuenta: lo cargado sobrevive a recargas y cierres de pestaña.
3. Más rápido que hacerlo a mano: pocos toques por gasto, con una mano.
4. El resultado es lo que se comparte: tiene que leerse claro y copiarse sin fricción.

## Accessibility & Inclusion

Legible al sol y con una mano: contraste alto y objetivos táctiles de al menos 44px.
