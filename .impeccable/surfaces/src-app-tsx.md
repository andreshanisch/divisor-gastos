---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/styles.css"]
---

# Surface brief: pantalla principal (única)

Scope: la única pantalla de la app (src/App.tsx y sus componentes). Mode: Operate.
Audience/job: Andres, solo, en su celular durante un viaje (a veces al sol) y al día siguiente; carga gastos y cierra cuentas para pasarlas por WhatsApp. Cargar y ver el resultado pesan lo mismo.
Constraints: no parecer banco ni juguete; no sumar toques ni scroll; mostrar el total gastado y cuánto puso cada uno. Conservar etiquetas accesibles, textos y comportamiento existentes (los tests dependen de ellos).

## Direction contract

THESIS: Cada persona es un billete. Rechaza la lista gris con avatares de iniciales y verde menta de las apps de dividir gastos.

OWN-WORLD: Papel moneda frío (#F2F4EE) con tinta verde muy oscura (#1E2A24); cada participante recibe, en orden de carga, un color de denominación de la serie de fauna (guanaco rojo, taruca violeta, yaguareté verde, hornero naranja, cóndor pizarra, ballena petróleo), oscurecidos para texto blanco legible. Numerales Archivo condensado 900; texto Archivo normal. Guilloché fino solo en el billete del total y en las celdas de participantes. Íconos SVG propios de trazo uniforme.

STORY: Al abrir se entiende cuánto se gastó y cuánto puso cada uno; se agrega un gasto sin buscar; se ve quién le paga a quién y se copia para WhatsApp.

FIRST VIEWPORT: Arriba, el billete del total: nombre del evento con editar, numeral gigante del total, línea "gastado entre N personas · M gastos" (sin monto por cabeza: los gastos se dividen entre subconjuntos, así que un promedio no es lo que debe nadie), y "Nuevo evento" discreto. Debajo, grilla de 2 columnas de celdas enteras por persona, en su color, con lo que puso y una barra a escala compartida; campo para sumar persona. Luego la lista de gastos; "+ Agregar gasto" grande en tinta, fijo abajo al alcance del pulgar.

FORM: Billete argentino, candidato 5 de la lista propia (seed: 49b6e702bdc59778). Raises: longitud = monto exacto (partitura); una sola escala para todas las barras (lámina botánica); estado por forma de línea, punteada pendiente y sólida saldado (riel de emisión); celdas enteras en grilla estricta (catálogo de convención). Movimiento firma: las barras crecen desde cero al aparecer y, al cambiar un monto, se estiran desde su largo anterior (se ve cuánto cambió).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
