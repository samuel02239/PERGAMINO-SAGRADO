/**
 * js/chests.js — lógica exclusiva de cofres.html
 * Depende de: CARDS/RARITY/UPGRADE_COST/getCardImageSources (data/cards.js),
 * State (core/state.js), GachaSystem (core/gacha.js).
 */
function rarityColorChest(rarityKey) { return RARITY[rarityKey]?.color || "#D4AF37"; }

// Esta página no incluye cardModal.js, así que replicamos aquí el mismo
// mecanismo de fallback de imagen (local -> imageUrl -> emoji) para que
// la revelación del cofre se comporte igual que en cartas.html/equipo.html.
function chestImgFallback(imgEl) {
  let remaining = [];
  try { remaining = JSON.parse(imgEl.dataset.fallbacks || "[]"); } catch (e) { remaining = []; }

  if (remaining.length) {
    const next = remaining.shift();
    imgEl.dataset.fallbacks = JSON.stringify(remaining);
    imgEl.src = next;
  } else {
    imgEl.style.display = "none";
    if (imgEl.nextElementSibling) imgEl.nextElementSibling.style.display = "flex";
  }
}

function chestImgTag(card, className) {
  const sources = getCardImageSources(card); // ej: [image, imageUrl] filtrando vacíos
  const first = sources.shift() || "";
  const fallbacksJson = JSON.stringify(sources).replace(/"/g, "&quot;");
  const cls = className ? ` class="${className}"` : "";
  return `<img${cls} src="${first}" data-fallbacks='${fallbacksJson}' alt="${card.name}" onerror="chestImgFallback(this)">`;
}

// Esta página no incluye cardModal.js, así que el marco de imagen
// de la revelación (.cd-art dentro de .reveal-card) se estiliza aquí mismo.
(function injectRevealArtStyles() {
  if (document.getElementById("reveal-art-style")) return;
  const style = document.createElement("style");
  style.id = "reveal-art-style";
  style.textContent = `
    .reveal-card .cd-art { overflow: hidden; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.15); }
    .reveal-card .cd-art img { width: 100%; height: 100%; object-fit: contain; display: block; }
    .reveal-card .cd-art-emoji { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 64px; }
    .reveal-grid-item .cd-art img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .reveal-grid-item .cd-art-emoji { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
  `;
  document.head.appendChild(style);
})();

const ChestFlow = {
  // Cofre del Rey: precio duplicado de 50 a 100 gemas.
  cost: { wood: { gold: 1000 }, silver: { gold: 4000 }, king: { gems: 1000 } },

  // Costo total para abrir `count` cofres de un tipo (por defecto: el costo
  // unitario multiplicado, sin descuento).
  costFor(chestType, count) {
    const unit = this.cost[chestType];
    const total = {};
    if (unit.gold) total.gold = unit.gold * count;
    if (unit.gems) total.gems = unit.gems * count;
    return total;
  },

  canAfford(total) {
    if (total.gold && State.gold < total.gold) return false;
    if (total.gems && State.gems < total.gems) return false;
    return true;
  },

  spend(total) {
    if (total.gold) State.spendGold(total.gold);
    if (total.gems) State.spendGems(total.gems);
  },

  // ── Invocación x1 (comportamiento original) ─────────────────────
  open(chestType) {
    const cost = this.cost[chestType];
    if (cost.gold && State.gold < cost.gold) return alert("No tienes suficiente oro. Ve a Preguntas Bíblicas para ganar más.");
    if (cost.gems && State.gems < cost.gems) return alert("No tienes suficientes gemas.");

    const overlay = document.getElementById("pergamino-overlay");
    overlay.innerHTML = `
      <div class="scroll-seal" id="seal-tap">📜</div>
      <div class="tap-hint">Toca el pergamino para romper el sello</div>`;
    overlay.classList.add("active");

    document.getElementById("seal-tap").onclick = () => {
      this.spend(cost);
      const { card, rarity } = GachaSystem.openChest(chestType, State.pity);
      // Se centraliza en State.addCardCopy() para que SIEMPRE quede
      // guardado (owned + nivel + fragmentos) de la misma forma en
      // todas las páginas, y para manejar duplicados como mejora.
      const result = State.addCardCopy(card);
      this.reveal(card, rarity, result, overlay);
    };
  },

  // ── Invocación x10: abre `count` cofres del mismo tipo de una sola vez
  // y muestra las 10 cartas obtenidas juntas en una grilla. Al cerrar,
  // el overlay queda libre para volver a invocar (x1 o x10) sin límite. ──
  openMulti(chestType, count = 10) {
    const total = this.costFor(chestType, count);
    if (!this.canAfford(total)) {
      const faltante = total.gold ? "oro" : "gemas";
      return alert(`No tienes suficiente ${faltante} para la Invocación x${count}.`);
    }

    const overlay = document.getElementById("pergamino-overlay");
    overlay.innerHTML = `
      <div class="scroll-seal" id="seal-tap">📜</div>
      <div class="tap-hint">Toca el pergamino para invocar ${count} cartas</div>`;
    overlay.classList.add("active");

    document.getElementById("seal-tap").onclick = () => {
      this.spend(total);
      const pulls = [];
      for (let i = 0; i < count; i++) {
        const { card, rarity } = GachaSystem.openChest(chestType, State.pity);
        const result = State.addCardCopy(card);
        pulls.push({ card, rarity, result });
      }
      this.revealMulti(pulls, overlay);
    };
  },

  reveal(card, rarity, result, overlay) {
    const msg = result.isNew
      ? "¡Carta nueva desbloqueada!"
      : result.leveledUp
        ? `¡Mejora! ${card.name} subió a Nivel ${result.level} (${result.fragments}/${result.cost} fragmentos)`
        : `Fragmento de mejora +1 — Nivel ${result.level} (${result.fragments}/${result.cost})`;

    overlay.innerHTML = `
      <div class="reveal-rarity" style="--rarity-color:${rarityColorChest(rarity)}">${RARITY[rarity].label.toUpperCase()}</div>
      <div class="reveal-card">
        <div class="cd-art" style="--rarity-color:${rarityColorChest(rarity)}">
          ${chestImgTag(card)}
          <div class="cd-art-emoji" style="display:none;">${card.emoji}</div>
        </div>
        <div class="name">${card.name} — ${card.version}</div>
        <div style="color:var(--ink-dim);font-size:13px;margin-top:4px">
          ${msg}
        </div>
      </div>
      <button class="reveal-continue" onclick="ChestFlow.close()">Continuar</button>`;
  },

  revealMulti(pulls, overlay) {
    // Mejor carta primero, solo para que la mirada aterrice ahí de una vez.
    const rarityRank = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"];
    const sorted = [...pulls].sort(
      (a, b) => rarityRank.indexOf(b.rarity) - rarityRank.indexOf(a.rarity)
    );

    const itemsHtml = sorted.map(({ card, rarity, result }) => `
      <div class="reveal-grid-item" style="--rarity-color:${rarityColorChest(rarity)}">
        <span class="rg-tag">${RARITY[rarity].code}</span>
        ${result.isNew ? `<span class="rg-new">NUEVA</span>` : ""}
        <div class="cd-art">
          ${chestImgTag(card)}
          <div class="cd-art-emoji" style="display:none;">${card.emoji}</div>
        </div>
        <div class="rg-foot"><div class="rg-name">${card.name}</div></div>
      </div>
    `).join("");

    const nuevas = pulls.filter((p) => p.result.isNew).length;
    const summary = nuevas > 0
      ? `${nuevas} carta${nuevas === 1 ? "" : "s"} nueva${nuevas === 1 ? "" : "s"} · ${pulls.length - nuevas} fragmento${pulls.length - nuevas === 1 ? "" : "s"} de mejora`
      : `${pulls.length} fragmentos de mejora repartidos entre tus cartas`;

    overlay.innerHTML = `
      <div class="reveal-title-multi">Invocación x${pulls.length}</div>
      <div class="reveal-grid">${itemsHtml}</div>
      <div style="color:var(--ink-dim);font-size:12px;margin-top:14px">${summary}</div>
      <button class="reveal-continue" onclick="ChestFlow.close()">Continuar</button>`;
  },

  close() {
    document.getElementById("pergamino-overlay").classList.remove("active");
    renderPity();
  },
};

function renderPity() {
  document.getElementById("pity-epic").textContent = Math.max(0, 9 - State.pity.sinceEpic);
  document.getElementById("pity-leg").textContent = Math.max(0, 49 - State.pity.sinceLegendary);
}

// Antes: document.addEventListener("DOMContentLoaded", () => setTimeout(renderPity, 0))
// Ahora escucha "state:ready", que se dispara justo cuando State ya cargó
// localStorage — sin depender de un setTimeout(0) que podía (en teoría)
// ejecutarse antes de tiempo.
document.addEventListener("state:ready", renderPity);
