/**
 * js/team.js — lógica exclusiva de equipo.html
 * Depende de: CARDS/RARITY (data/cards.js), SYNERGIES (data/synergies.js),
 * State (core/state.js), cardThumb/CardModal (core/cardModal.js).
 */
function renderTeam() {
  const slotsEl = document.getElementById("team-slots");
  slotsEl.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const cardId = State.team[i];
    const card = cardId ? CARDS.find((c) => c.id === cardId) : null;
    const slot = document.createElement("div");
    slot.className = "team-slot" + (card ? " filled" : "");
    if (card) slot.style.setProperty("--rarity-color", rarityColor(card.rarity));
    slot.textContent = card ? card.emoji : "+";
    slot.onclick = () => {
      if (!card) return;
      State.team[i] = null;
      State.save();
      renderTeam();
    };
    slotsEl.appendChild(slot);
  }

  const activeCharIds = State.team.filter(Boolean).map((id) => CARDS.find((c) => c.id === id).characterId);
  const synergyEl = document.getElementById("synergy-list");
  synergyEl.innerHTML = "";
  const active = SYNERGIES.filter((s) => s.members.filter((m) => activeCharIds.includes(m)).length >= 2);
  if (!active.length) {
    synergyEl.innerHTML = `<p class="synergy-empty">Ninguna sinergia activa todavía. Combina personajes relacionados.</p>`;
  } else {
    active.forEach((s) => {
      const d = document.createElement("div");
      d.className = "synergy-active";
      d.innerHTML = `<b>${s.name}</b><br>${s.bonusLabel}`;
      synergyEl.appendChild(d);
    });
  }

  const pool = document.getElementById("team-pool-grid");
  pool.innerHTML = "";
  CARDS.filter((c) => State.owned.has(c.id)).forEach((card) => {
    pool.appendChild(cardThumb(card, {
      onClick: () => {
        if (State.team.includes(card.id)) return CardModal.open(card.id);
        const emptyIndex = State.team.findIndex((x) => !x);
        const idx = emptyIndex === -1 ? State.team.length : emptyIndex;
        if (idx >= 5) return alert("Tu equipo ya tiene 5 integrantes.");
        State.team[idx] = card.id;
        State.save();
        renderTeam();
      },
    }));
  });
}

// Antes: document.addEventListener("DOMContentLoaded", () => setTimeout(renderTeam, 0))
// Igual que en cards.js, ahora se sincroniza con el evento "state:ready".
document.addEventListener("state:ready", renderTeam);
