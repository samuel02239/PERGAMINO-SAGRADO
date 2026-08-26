/**
 * js/cards.js — lógica exclusiva de cartas.html
 * Depende de: CARDS/RARITY (data/cards.js), State (core/state.js),
 * cardThumb/CardModal (core/cardModal.js).
 */
function renderCollection() {
  const grid = document.getElementById("collection-grid");
  grid.innerHTML = "";
  CARDS.forEach((card) => {
    const owned = State.owned.has(card.id);
    grid.appendChild(cardThumb(card, {
      locked: !owned,
      onClick: () => owned && CardModal.open(card.id),
    }));
  });
}

// Antes: document.addEventListener("DOMContentLoaded", () => setTimeout(renderCollection, 0))
// Ese patrón "esperaba un poco" con la esperanza de que State ya hubiera
// cargado localStorage, pero no era una garantía real. Ahora se escucha
// el evento "state:ready" que core/state.js dispara justo después de
// terminar de cargar — así la colección siempre se pinta con los datos
// correctos y actualizados (incluye cartas recién desbloqueadas en cofres).
document.addEventListener("state:ready", renderCollection);
