# Pergamino Sagrado — Estructura modular por sección

Cada pantalla del juego es un **archivo .html independiente**, con su propio
CSS y su propio JS. Así puedes programar/mejorar una sección sin tocar las
demás.

## Mapa de módulos

| Sección | HTML | CSS propio | JS propio | Depende de (conexiones) |
|---|---|---|---|---|
| Inicio | `index.html` | `css/home.css` | `js/home.js` | `data/cards.js`, `core/state.js` |
| Cartas | `cartas.html` | `css/cards.css` | `js/cards.js` | `data/cards.js`, `core/state.js`, `core/cardModal.js` |
| Cofres | `cofres.html` | `css/chests.css` | `js/chests.js` | `data/cards.js`, `core/state.js`, `core/gacha.js` |
| Equipo | `equipo.html` | `css/team.css` | `js/team.js` | `data/cards.js`, `data/synergies.js`, `core/state.js`, `core/cardModal.js` |
| Mundo | `mundo.html` | `css/world.css` | `js/world.js` | `data/worlds.js`, `core/state.js` |
| Preguntas Bíblicas | `preguntas.html` | `css/quiz.css` | `js/quiz.js` | `data/quiz-questions.js`, `core/state.js` |

**Todas** las páginas cargan `css/base.css` (variables, topbar, nav inferior,
tarjetas, modal) y `js/core/state.js` (recursos, colección, guardado).

## Carpeta `js/core/` — lo compartido, nunca se duplica

- `state.js` → gemas, oro, cartas obtenidas, equipo, progreso del quiz. Se guarda en `localStorage` y por eso "viaja" entre páginas aunque sean archivos distintos.
- `gacha.js` → probabilidades de cofres + sistema de garantía (pity). Solo lo usa `cofres.html`.
- `cardModal.js` → la ventana de detalle de una carta y la función `cardThumb()` que dibuja una carta en cualquier grid. Lo usan `cartas.html` y `equipo.html`.

## Carpeta `js/data/` — solo datos, cero lógica

- `cards.js` → todas las cartas (agregar una = agregar un objeto).
- `synergies.js` → combinaciones bíblicas.
- `worlds.js` → mundos de campaña.
- `quiz-questions.js` → banco de preguntas bíblicas.

## 🪙💎 Cómo funciona "Preguntas Bíblicas"

1. Aparece una pregunta de `data/quiz-questions.js` con 4 opciones.
2. Si aciertas → ganas las monedas de esa pregunta (`coins`, hoy 15 por defecto) y se suman a `State.gold`.
3. Cada 10 preguntas **respondidas** (acertadas o no) → bono automático de **10 gemas** (`QUIZ_GEMS_PER_10` en `js/quiz.js`, ajustable).
4. El contador se guarda en `State.quizAnswered`, así que la racha persiste aunque cierres la app.
5. Para agregar preguntas nuevas: solo edita `js/data/quiz-questions.js`, no hay que tocar `quiz.js`.

## Cómo seguir programando sin mezclar todo

- ¿Vas a mejorar el combate de la campaña? Solo tocas `mundo.html`, `css/world.css`, `js/world.js` y `js/data/worlds.js`.
- ¿Vas a rediseñar cómo se ven las cartas? Solo tocas `css/base.css` (sección "Tarjetas") — como es compartido, el cambio se refleja en `cartas.html` y `equipo.html` a la vez.
- ¿Vas a agregar más preguntas? Solo `js/data/quiz-questions.js`.
- Si necesitas que dos secciones compartan algo nuevo (por ejemplo, un sistema de niveles de jugador), ese código va en `js/core/`, no dentro de una sección específica.

## Probar y convertir a APK

Igual que antes: sube toda la carpeta a Netlify/Vercel/GitHub Pages (HTTPS) →
pega esa URL en **pwabuilder.com** → pestaña Android → genera el paquete.
El `manifest.json` y `sw.js` ya están actualizados con las 6 páginas.

## Pendiente para producción real

- Backend con autoridad de RNG (para el gacha) y de puntuación (para el quiz) — hoy todo corre y se guarda en el propio teléfono.
- Sistema de combate real en `mundo.html` (hoy solo lista los mundos).
- Reemplazar los emojis por el arte final de cada carta en `assets/cards/full/{id}.png`.
