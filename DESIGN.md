---
name: Divisor de gastos
description: Las cuentas de un evento grupal, impresas como papel moneda.
colors:
  tinta: "#1e2a24"
  tinta-suave: "#4a5a51"
  papel: "#f2f4ee"
  papel-hondo: "#e6eae0"
  blanco: "#fdfdfb"
  filete: "#c9d1c6"
  guanaco: "#b23a30"
  taruca: "#5e4391"
  yaguarete: "#2a6e4d"
  hornero: "#a4501a"
  condor: "#3b566e"
  ballena: "#1d6a7a"
  pinguino: "#2b3f8c"
  carpincho: "#6b4a2b"
  nandu: "#59631e"
  tatu: "#7d2448"
  peligro: "#a32a20"
  aviso: "#6e4a00"
  aviso-fondo: "#fbefc8"
typography:
  display:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "clamp(3.75rem, 19vw, 5.5rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
    fontVariation: "'wdth' 62"
  numeral-lg:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 900
    lineHeight: 1
    fontFeature: "tnum"
    fontVariation: "'wdth' 65"
  numeral-md:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 850
    lineHeight: 1
    fontFeature: "tnum"
    fontVariation: "'wdth' 70"
  numeral-sm:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 850
    lineHeight: 1.1
    fontFeature: "tnum"
    fontVariation: "'wdth' 70"
  headline:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 750
  title:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 700
  body:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.4
  body-sm:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
  label:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 800
    letterSpacing: "0.08em"
rounded:
  barra: "3px"
  radio: "10px"
  billete: "14px"
  ficha: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  seccion: "28px"
components:
  boton-principal:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
    typography: "{typography.title}"
    rounded: "{rounded.radio}"
    padding: "0 20px"
    height: "52px"
  boton-principal-deshabilitado:
    backgroundColor: "{colors.papel-hondo}"
    textColor: "#7d8a82"
  boton-secundario:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    typography: "{typography.title}"
    rounded: "{rounded.radio}"
    padding: "0 20px"
    height: "52px"
  boton-secundario-activo:
    backgroundColor: "{colors.papel-hondo}"
  icono-boton:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    rounded: "{rounded.radio}"
    size: "44px"
  icono-boton-lleno:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
    rounded: "{rounded.radio}"
    size: "48px"
  campo:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.radio}"
    padding: "0 14px"
    height: "48px"
  billete:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
    rounded: "{rounded.billete}"
    padding: "14px 18px 18px"
  celda-persona:
    backgroundColor: "{colors.guanaco}"
    textColor: "#ffffff"
    rounded: "{rounded.radio}"
    padding: "10px 6px 12px 14px"
    height: "96px"
  ficha-entre:
    backgroundColor: "transparent"
    textColor: "{colors.guanaco}"
    rounded: "{rounded.ficha}"
    padding: "0 14px 0 12px"
    height: "44px"
  ficha-entre-marcada:
    backgroundColor: "{colors.guanaco}"
    textColor: "#ffffff"
  formulario-gasto:
    backgroundColor: "{colors.blanco}"
    rounded: "{rounded.billete}"
    padding: "16px"
  aviso:
    backgroundColor: "{colors.aviso-fondo}"
    textColor: "{colors.aviso}"
    rounded: "{rounded.radio}"
    padding: "10px 14px"
---

# Design System: Divisor de gastos

## Overview

**Creative North Star: "El billete argentino"**

La pantalla se imprime como papel moneda: un papel frío y apenas verdoso, tinta verde casi negra, y un color de denominación por persona sacado de la serie de fauna (guanaco, taruca, yaguareté, hornero, cóndor, ballena, pingüino, carpincho, ñandú, tatú). Cada participante es un billete: una celda entera en su color, con guilloché fino y lo que puso en numeral condensado. El total del evento es el billete mayor, arriba de todo, en tinta.

La densidad es de una mano y al sol: una sola columna de 480px como máximo, objetivos táctiles de 44px o más, contraste alto en todo (texto blanco sobre cada denominación supera 5:1). Los números mandan: los montos van siempre en Archivo condensado y pesado, con cifras tabulares; el texto queda en Archivo de ancho normal. El dato se dibuja: las barras tienen una sola escala para toda la pantalla, y el estado de una transferencia se lee por la forma del filete, no solo por el color.

Se rechaza explícitamente la lista gris con avatares de iniciales y el verde menta de las apps de dividir gastos, y también parecer banco o juguete.

**Key Characteristics:**
- Papel frío y tinta verde muy oscura como base; el color vive en las personas.
- Un color de denominación por persona, asignado por orden de carga y repetido en todos los lugares donde aparece esa persona.
- Numerales Archivo condensados (wdth 62 a 70) en peso 850 a 900; texto Archivo normal.
- Guilloché solo en el billete del total y en las celdas de persona.
- Íconos SVG propios: trazo de 2px, puntas redondeadas, grilla de 24.
- Plano por defecto; solo flota lo que se superpone al contenido.

## Colors

Una base monocroma de papel y tinta verdosa, con diez colores de denominación saturados y oscurecidos que identifican personas.

### Primary
- **Tinta de emisión** (tinta): texto principal, fondo del billete del total, botón principal, botón de ícono lleno, anillo de foco y selección de texto. Es el único color de acción.

### Secondary
- **Serie de fauna** (guanaco, taruca, yaguareté, hornero, cóndor, ballena, pingüino, carpincho, ñandú, tatú): uno por participante, en ese orden de carga, y se repiten desde el primero al pasar de diez. Fondo de la celda de persona, punto del pagador en cada gasto, ficha de "Entre quiénes" y relleno de la barra del receptor en cada transferencia. Están oscurecidos para que el blanco sea legible al sol. Si un id no se encuentra, se usa un gris verdoso neutro (#4c5a52).

### Tertiary
- **Rojo sello** (peligro): mensajes de error en línea.
- **Ocre de aviso** (aviso sobre aviso-fondo): avisos de guardado, en una franja de esquinas suaves.

### Neutral
- **Papel moneda** (papel): fondo de la página y texto sobre tinta.
- **Papel hondo** (papel-hondo): estado presionado de botones, gasto en edición, riel de las barras de transferencia, botón principal deshabilitado.
- **Blanco de marca de agua** (blanco): fondo de campos y del formulario de gasto, lo único que se levanta del papel.
- **Tinta suave** (tinta-suave): títulos de sección, "entre: ..." de cada gasto y textos vacíos.
- **Filete** (filete): bordes de campos y separadores entre gastos y transferencias.

### Named Rules
**La Regla de la Denominación.** El color de denominación identifica a una persona y a nada más. Una persona tiene el mismo color en su celda, en su punto de pagador, en su ficha y en las barras. Nunca se usa para acciones, estados ni decoración.

**La Regla del Guilloché.** El guilloché (una malla de hipotrocoides blancas al 13%) aparece solo sobre los billetes: el del total y los de persona. Ninguna otra superficie lo lleva. El blanco puro (#fff) es la tinta de esos grabados y del texto sobre denominación.

## Typography

**Display Font:** Archivo Variable con eje de ancho, autoalojada (con system-ui, sans-serif)
**Body Font:** Archivo Variable (con system-ui, -apple-system, Segoe UI, sans-serif)

**Character:** Una sola familia en dos registros: condensada y negrísima para los montos, como el numeral impreso de un billete; de ancho normal y firme para todo lo que se lee.

### Hierarchy
- **Display** (900, min(19vw, 5.5rem) hasta 7 caracteres, 0.9, wdth 62): el total gastado, dentro del billete. Con más caracteres se achica en proporción (piso de 2.25rem) para no pisar la marca de agua. El signo "$" va a 0.45em, elevado.
- **Numeral grande** (900, 2rem, 1, wdth 65): monto de cada transferencia en el resultado.
- **Numeral medio** (900, 1.625rem, 0.95, wdth 66): lo que puso cada persona, como numeral de esquina de su billete.
- **Numeral chico** (850, 1.375rem, 1.1, wdth 70): monto de cada gasto, alineado a la derecha.
- **Headline** (750, 1.25rem): nombre del evento en el billete, balanceado.
- **Title** (700, 1.0625rem): nombres de persona (750 en la celda), descripción del gasto, "quién → quién", texto de botones.
- **Body** (400, 1rem, 1.4): texto corrido.
- **Body chico** (600 a 700, 0.9375rem): pagador, etiquetas de campos, pie del billete; 0.875rem para "entre: ...".
- **Label** (800, 0.875rem, 0.08em, mayúsculas): el título de cada sección (Participantes, Gastos, Resultado), en tinta suave.

### Named Rules
**La Regla del Numeral Condensado.** Todo monto de dinero va en Archivo condensado (wdth 62 a 70), peso 850 o más, con cifras tabulares. El texto nunca se condensa; un monto nunca va en ancho normal.

## Layout

Una sola columna centrada de 480px como máximo, con 16px de margen lateral y 12px arriba. No hay breakpoints: en escritorio la misma columna queda centrada sobre el papel. Abajo se reservan 104px más el área segura para que la barra de acción fija no tape el último elemento.

El ritmo usa pasos de 4, 8, 12, 16 y 20px; 28px separa secciones; 8px es el espacio entre celdas, fichas y botones vecinos. Las personas van en una grilla estricta de dos columnas iguales, de celdas enteras. Los gastos y las transferencias son filas de dos columnas: texto a la izquierda, monto contra el borde derecho; en los gastos las acciones quedan debajo del monto.

La acción principal ("Agregar gasto") vive en una barra fija abajo, al ancho de la columna, con un fundido de 18px desde el papel transparente.

### Named Rules
**La Regla de la Escala Única.** Todas las barras de la pantalla (lo que puso cada persona y cada transferencia) comparten una sola escala: lo que puso quien más puso. El largo de una barra es el monto, comparable con cualquier otra.

## Elevation & Depth

Plano por defecto: la profundidad se da por tono (papel, papel hondo, blanco, tinta) y por filetes. Solo hay sombra en lo que flota sobre el contenido: el formulario de gasto abierto y el botón de la barra de acción fija. Ambas son difusas y teñidas de tinta, nunca negras ni desplazadas.

### Shadow Vocabulary
- **Hoja levantada** (`box-shadow: 0 1px 2px rgb(30 42 36 / 0.08), 0 8px 24px rgb(30 42 36 / 0.1)`): formulario de gasto, la única superficie blanca que se apoya sobre el papel.
- **Acción flotante** (`box-shadow: 0 6px 18px rgb(30 42 36 / 0.22)`): botón principal dentro de la barra fija inferior.
- **Anillo de foco de campo** (`box-shadow: 0 0 0 3px rgb(30 42 36 / 0.18)`): campos con foco, junto con el borde en tinta.

### Named Rules
**La Regla del Papel Plano.** Una superficie lleva sombra solo si se superpone al contenido. Celdas, billete y filas son planas.

## Shapes

Esquinas suavemente redondeadas (10px) en todo lo que se toca: campos, botones, celdas de persona, avisos. Las piezas mayores (billete del total y formulario de gasto) suben a 14px. Las fichas de "Entre quiénes" son píldoras completas; las barras usan 3px y el punto del pagador es un cuadradito de 10px con 2px de radio, como una muestra de color.

Los bordes son de 1.5px en campos y botones secundarios. Los separadores de filas son filetes: 1px pleno entre gastos; 2px punteado entre transferencias pendientes; 2px pleno en tinta arriba y abajo cuando no hay nada que saldar.

### Named Rules
**La Regla del Filete.** El estado se lee por la forma de la línea: punteado es pendiente, pleno es saldado. El color nunca es la única señal.

## Components

### Buttons
Firmes y de tinta, sin brillo.
- **Shape:** esquinas suaves (10px), 52px de alto mínimo (56px en la barra fija), ícono y texto separados por 8px.
- **Principal:** fondo tinta, texto papel, peso 700 a 1.0625rem. Al presionar se achica a 0.98 en 120ms con la curva de salida (cubic-bezier(0.16, 1, 0.3, 1)). Deshabilitado: papel hondo con texto gris verdoso.
- **Secundario:** contorno de 1.5px en tinta, fondo transparente; al presionar se rellena de papel hondo. Se usa para "Cancelar" y "Copiar para WhatsApp".
- **Texto:** subrayado de 1px con 4px de separación, papel al 85%, solo sobre el billete ("Nuevo evento").
- **De ícono:** 44px cuadrado, transparente, fondo papel hondo al presionar (blanco al 12 a 15% sobre tinta o denominación). La variante llena es de 48px en tinta, para "Agregar participante".
- **Foco:** contorno de 3px en tinta con 2px de separación, en todos los controles.

### Chips
- **Style:** ficha de "Entre quiénes": píldora de 44px de alto con borde de 1.5px y texto en el color de denominación de esa persona; casilla de 18px con radio de 5px y borde de 2px.
- **State:** marcada se rellena con el color de la persona, texto blanco y tilde blanca dibujada en SVG. Transición de 120ms en fondo y color.

### Cards / Containers
- **Billete del total:** el billete mayor, con el mismo modelo que los de persona (ver "Celda de persona: el billete") pero en tinta, en proporción 178:100 y con la marca de agua a la derecha. Su emblema son dos monedas apiladas con el signo $ calado y canto estriado (`Monedas`), al 50% porque el numeral pasa cerca. Esquinas de 14px y margen lateral del 6.5% del ancho, para no pisar el microtexto. Contiene nombre del evento con editar, "Nuevo evento", el numeral display y el pie "gastado entre N personas · M gastos".
- **Formulario de gasto:** blanco, esquinas de 14px, 16px de relleno, 14px entre campos, sombra "Hoja levantada". Acciones en grilla 2:1 (Guardar, Cancelar).
- **Aviso:** franja ocre de esquinas de 10px, texto en peso 600.

### Inputs / Fields
- **Style:** fondo blanco, borde de 1.5px en filete, esquinas de 10px, 48px de alto, texto de 1.0625rem. Etiqueta arriba, peso 700 a 0.9375rem. El select dibuja su propia flecha con dos degradados en tinta.
- **Focus:** borde en tinta más anillo de 3px de tinta al 18%.
- **Sobre el billete:** el campo del nombre del evento usa blanco al 10% con borde blanco al 40% y texto papel.
- **Error:** mensaje en rojo sello, peso 600, 8px debajo.

### Celda de persona: el billete
La pieza firma. Cada persona es un billete de la serie de fauna, en proporción 16:10, sobre el color de su denominación, con esquinas de 10px. El fondo es un SVG decorativo (`BilleteFondo`, viewBox 160×100, oculto a lectores de pantalla) con cinco capas:
- **Malla de guilloché:** seis hipotrocoides concéntricas y giradas, centradas a la derecha, en trazo blanco de 0.25 al 13%.
- **Marca de agua:** óvalo claro a la izquierda (degradado radial blanco del 26% al 0%) con el animal adentro.
- **Animal de la denominación:** ilustración propia rellena con un rayado blanco a 40° (cada 1.25 unidades, como un grabado), al 72%. Uno por color, por orden de carga: guanaco (rojo), taruca (violeta), yaguareté (verde), hornero (naranja), cóndor (pizarra), ballena franca (petróleo), pingüino de Magallanes (índigo), carpincho (marrón), ñandú (oliva) y tatú (bordó); a partir de la undécima persona se repiten.
- **Hilo de seguridad:** franja vertical blanca al 32% a 40% del ancho, con un punteado del color de la denominación.
- **Marco con microtexto:** filete blanco al 45% a 3 unidades del borde y, por dentro, "DIVISOR DE GASTOS ·" repetido en letra de 2.3 al 40%.

Encima va el contenido en grilla: el nombre (750, con una sombra de texto en tinta al 35%) arriba a la izquierda y el botón de quitar arriba a la derecha; abajo a la derecha, "puso" (700, 0.875rem) sobre el monto como numeral de esquina (900, wdth 66, 1.625rem, el numeral medio); al pie, del hilo hacia la derecha, la barra de 5px. Si la persona no se puede quitar, la cruz queda al 45%.

**La Regla del Billete Propio.** El billete evoca la serie de fauna sin copiarla: ni el nombre del emisor, ni leyendas oficiales, ni imágenes de billetes reales. El microtexto dice el nombre de la app y los animales son ilustraciones propias.

### Barras
Una barra mide un monto en la escala única. El relleno crece desde cero al aparecer y, al cambiar un monto, se estira desde su largo anterior: transición de ancho de 600ms con la curva de salida. En el resultado, el riel es papel hondo y el relleno es el color de quien recibe. Con movimiento reducido, la transición es instantánea.

### Fila de gasto
Descripción en title, monto en numeral chico contra la derecha, pagador con su punto de color, "entre: ..." en tinta suave, y editar y borrar como íconos debajo del monto. En edición, la fila toma fondo papel hondo con esquinas de 10px.

## Do's and Don'ts

### Do:
- **Do** asignar a cada persona su color de denominación por orden de carga y repetirlo en toda aparición de esa persona.
- **Do** escribir todo monto en Archivo condensado (wdth 62 a 70), peso 850 a 900, con cifras tabulares.
- **Do** dibujar las barras en la escala única de lo que puso quien más puso.
- **Do** marcar el estado con la forma del filete: punteado pendiente, pleno saldado.
- **Do** mantener objetivos táctiles de 44px o más y contraste de al menos 4.5:1, también al sol.
- **Do** usar los íconos SVG propios (trazo de 2px, puntas redondeadas, grilla de 24) para toda acción con ícono.

### Don't:
- **Don't** usar la lista gris con avatares de iniciales ni el verde menta de las apps de dividir gastos.
- **Don't** usar un color de denominación para botones, estados o decoración.
- **Don't** poner guilloché fuera del billete del total y las celdas de persona.
- **Don't** poner sombras en superficies que no flotan sobre el contenido; nada de sombras negras ni desplazadas.
- **Don't** escribir un monto en Archivo de ancho normal ni condensar el texto corrido.
