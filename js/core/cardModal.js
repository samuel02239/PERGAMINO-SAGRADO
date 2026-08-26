/**
 * js/core/cardModal.js
 * Modal de detalle de carta. Lo usan cartas.html y equipo.html
 * (ambas páginas incluyen <div id="card-modal">...</div> en su HTML
 * y este script). Depende de RARITY/UPGRADE_COST/UPGRADE_BONUS/
 * getEffectiveStats/getCardImageSources (data/cards.js) y de State (core/state.js).
 */
function rarityColor(rarityKey) { return RARITY[rarityKey]?.color || "#D4AF37"; }
function starRow(n) { return "★".repeat(n) + "☆".repeat(6 - n); }

/**
 * Maneja el fallback de imagen de una carta: si la fuente actual falla
 * (onerror), prueba la siguiente fuente guardada en data-fallbacks.
 * Si ya no quedan fuentes por probar, oculta el <img> y muestra el
 * emoji (el elemento hermano inmediatamente después del <img>).
 */
function cardImgFallback(imgEl) {
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

/**
 * Genera el HTML de un <img> de carta con fallback en cadena:
 * 1) imagenes/ (local)  2) imageUrl (link público)  3) emoji (vía onerror final)
 * extraAttrs permite agregar atributos extra al <img> (ej. alt ya viene incluido).
 */
function cardImgTag(card, extraAttrs = "") {
  const sources = getCardImageSources(card); // ej: [image, imageUrl] filtrando vacíos
  const first = sources.shift() || "";
  const fallbacksJson = JSON.stringify(sources).replace(/"/g, "&quot;");
  return `<img src="${first}" data-fallbacks='${fallbacksJson}' alt="${card.name}" ${extraAttrs} onerror="cardImgFallback(this)">`;
}

(function injectCardArtStyles() {
  const prev = document.getElementById("card-art-style");
  if (prev) prev.remove();
  const style = document.createElement("style");
  style.id = "card-art-style";
  style.textContent = `
    .card-art { position: relative; overflow: hidden; border-radius: 10px; border: 2px solid var(--rarity-color, #D4AF37); }
    .card-art img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .card-art-emoji { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 34px; }

    .card { position: relative; }
    .card-level-tag {
      position: absolute; top: 6px; left: 6px; z-index: 2;
      background: rgba(0,0,0,0.65); color: #fff; font-size: 11px; font-weight: 700;
      padding: 2px 6px; border-radius: 6px; border: 1px solid var(--rarity-color, #D4AF37);
    }

    .cd-art {
      position: relative;
      overflow: hidden;
      border-radius: 14px;
      border: 2px solid var(--rarity-color, #D4AF37);
      width: 100%;
      max-width: 220px;
      aspect-ratio: 512 / 896;
      margin: 0 auto 14px;
      background: rgba(0,0,0,0.15);
    }
    .cd-art img { width: 100%; height: 100%; object-fit: contain; display: block; }
    .cd-art-emoji { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 64px; }

    .cd-level-row { display: flex; align-items: center; gap: 8px; margin: 10px 0 4px; }
    .cd-level-badge {
      flex-shrink: 0; font-size: 12px; font-weight: 700; color: #fff;
      background: var(--rarity-color, #D4AF37); padding: 3px 8px; border-radius: 8px;
    }
    .cd-frag-bar { flex: 1; height: 8px; border-radius: 4px; background: rgba(255,255,255,0.12); overflow: hidden; }
    .cd-frag-fill { height: 100%; background: var(--rarity-color, #D4AF37); transition: width .2s ease; }
    .cd-frag-text { flex-shrink: 0; font-size: 11px; color: var(--ink-dim, #b9b6cf); }
  `;
  document.head.appendChild(style);
})();

const CardModal = {
  open(cardId) {
    const card = CARDS.find((c) => c.id === cardId);
    if (!card) return;
    const owned = State.owned.has(card.id);
    const level = State.getLevel(card.id);
    const fragments = State.getFragments(card.id);
    const cost = UPGRADE_COST[card.rarity] || 20;
    // Estadísticas YA con el bonus de mejora aplicado según el nivel actual.
    // Si la carta aún no se posee, se muestra la base (nivel 1) como vista previa.
    const stats = owned ? getEffectiveStats(card, level) : card.stats;

    const content = document.getElementById("card-modal-content");
    content.style.setProperty("--rarity-color", rarityColor(card.rarity));
    content.innerHTML = `
      <div class="cd-art">
        ${cardImgTag(card)}
        <div class="cd-art-emoji" style="display:none;">${card.emoji}</div>
      </div>
      <div class="cd-body">
        <h3 class="cd-title">${card.name}</h3>
        <div class="cd-sub">${card.version} · ${starRow(RARITY[card.rarity].stars)}</div>
        ${owned ? `
        <div class="cd-level-row">
          <span class="cd-level-badge">Nv. ${level}</span>
          <div class="cd-frag-bar"><div class="cd-frag-fill" style="width:${Math.min(100, (fragments / cost) * 100)}%"></div></div>
          <span class="cd-frag-text">${fragments}/${cost} fragmentos</span>
        </div>` : ""}
        <div class="cd-stats">
          <div class="cd-stat"><div class="v">${stats.atk}</div><div class="l">Ataque</div></div>
          <div class="cd-stat"><div class="v">${stats.def}</div><div class="l">Defensa</div></div>
          <div class="cd-stat"><div class="v">${stats.hp}</div><div class="l">Vida</div></div>
          <div class="cd-stat"><div class="v">${stats.spd}</div><div class="l">Vel.</div></div>
        </div>
        <div class="cd-block"><h4>Habilidad — ${card.ability.name}</h4><p>${card.ability.desc}</p></div>
        ${card.ultimate ? `<div class="cd-block"><h4>Definitiva — ${card.ultimate.name}</h4><p>${card.ultimate.desc}</p></div>` : ""}
        <div class="cd-block"><h4>Historia bíblica</h4><p>${card.lore.story}</p></div>
        <div class="cd-block"><p class="cd-verse">${card.lore.verse}</p></div>
        <div class="cd-block"><h4>Dato bíblico</h4><p>${card.lore.fact}</p></div>
        <button class="cd-close" onclick="CardModal.close()">Cerrar</button>
      </div>`;
    document.getElementById("card-modal").classList.add("active");
  },
  close() { document.getElementById("card-modal").classList.remove("active"); },
};

function cardThumb(card, { locked = false, onClick = null } = {}) {
  const div = document.createElement("div");
  div.className = "card" + (locked ? " locked" : "");
  div.style.setProperty("--rarity-color", rarityColor(card.rarity));
  const level = !locked ? State.getLevel(card.id) : null;
  div.innerHTML = `
    <span class="rarity-tag">${RARITY[card.rarity].code}</span>
    ${level ? `<span class="card-level-tag">Nv.${level}</span>` : ""}
    <div class="card-art">
      ${locked
        ? `<div class="card-art-emoji">❓</div>`
        : `${cardImgTag(card)}
           <div class="card-art-emoji" style="display:none;">${card.emoji}</div>`}
    </div>
    <div class="card-foot">
      <div class="card-name">${card.name}</div>
      <div class="card-stars">${starRow(RARITY[card.rarity].stars)}</div>
    </div>`;
  if (onClick) div.addEventListener("click", onClick);
  return div;
}