/**
 * js/core/state.js
 * Estado del jugador, compartido entre TODAS las páginas mediante localStorage
 * (porque cada página es un archivo .html distinto, no hay memoria compartida
 * en RAM como en una SPA). Cada página incluye este script y llama a
 * State.load() al iniciar y State.save() cuando algo cambia.
 *
 * IMPORTANTE: en producción esto debe validarse en un backend — un jugador
 * podría editar localStorage manualmente. Para la demo/prototipo está bien.
 *
 * IMPORTANTE (localStorage entre páginas): si estás probando el juego
 * abriendo los .html directamente con doble clic (protocolo file://),
 * algunos navegadores NO comparten localStorage entre archivos locales.
 * Para que el progreso se vea igual en todas las páginas, sirve la carpeta
 * con un servidor local, por ejemplo:
 *   python3 -m http.server 8000
 * y abre http://localhost:8000/index.html — así todas las páginas comparten
 * el mismo origen y el mismo localStorage.
 */
const State = {
  owned: new Set(),
  team: [],
  pity: { sinceEpic: 0, sinceLegendary: 0 },
  gems: 120,
  gold: 2400,
  quizAnswered: 0,       // total de preguntas respondidas (intentos, correctos o no)
  quizCorrect: 0,        // total de ACIERTOS (para el bono de gemas cada 10)
  quizSolvedIds: [],     // ids de preguntas ya acertadas — no vuelven a salir
  cardProgress: {},      // { [cardId]: { level: 1, fragments: 0 } }

  init() {
    this.load();
    // Primera vez: regalar las cartas marcadas owned:true en cards.js
    if (this.owned.size === 0) {
      CARDS.filter((c) => c.owned).forEach((c) => this.owned.add(c.id));
      this.save();
    }
    // Asegura que toda carta poseída tenga progreso inicial (nivel 1, 0 fragmentos)
    let changed = false;
    this.owned.forEach((id) => {
      if (!this.cardProgress[id]) {
        this.cardProgress[id] = { level: 1, fragments: 0 };
        changed = true;
      }
    });
    if (changed) this.save();
    this.renderTopbar();
  },

  save() {
    localStorage.setItem("pergamino_state", JSON.stringify({
      owned: [...this.owned], team: this.team, pity: this.pity,
      gems: this.gems, gold: this.gold, quizAnswered: this.quizAnswered,
      quizCorrect: this.quizCorrect, quizSolvedIds: this.quizSolvedIds,
      cardProgress: this.cardProgress,
    }));
  },

  load() {
    const raw = localStorage.getItem("pergamino_state");
    if (!raw) return;
    const s = JSON.parse(raw);
    this.owned = new Set(s.owned || []);
    this.team = s.team || [];
    this.pity = s.pity || { sinceEpic: 0, sinceLegendary: 0 };
    this.gems = s.gems ?? 120;
    this.gold = s.gold ?? 2400;
    this.quizAnswered = s.quizAnswered ?? 0;
    this.quizCorrect = s.quizCorrect ?? 0;
    this.quizSolvedIds = s.quizSolvedIds || [];
    this.cardProgress = s.cardProgress || {};
  },

  addGold(n) { this.gold += n; this.save(); this.renderTopbar(); },
  addGems(n) { this.gems += n; this.save(); this.renderTopbar(); },
  spendGold(n) { if (this.gold < n) return false; this.gold -= n; this.save(); this.renderTopbar(); return true; },
  spendGems(n) { if (this.gems < n) return false; this.gems -= n; this.save(); this.renderTopbar(); return true; },

  getLevel(cardId) { return this.cardProgress[cardId]?.level || 1; },
  getFragments(cardId) { return this.cardProgress[cardId]?.fragments || 0; },

  /**
   * Registra la obtención de una carta desde un cofre (nueva o duplicada).
   * - Si es NUEVA: se desbloquea (owned) a nivel 1.
   * - Si YA se tenía: el duplicado se convierte en 1 fragmento de mejora.
   *   Al llegar al costo de esa rareza (UPGRADE_COST, definido en
   *   data/cards.js) sube de nivel. Puede subir más de un nivel de una
   *   sola vez si sobran fragmentos. No hay tope de nivel (infinito).
   * Devuelve datos para mostrar en la pantalla de revelación del cofre.
   */
  addCardCopy(card) {
    const isNew = !this.owned.has(card.id);
    const cost = UPGRADE_COST[card.rarity] || 20;

    if (isNew) {
      this.owned.add(card.id);
      this.cardProgress[card.id] = { level: 1, fragments: 0 };
      this.save();
      return { isNew: true, leveledUp: false, level: 1, fragments: 0, cost };
    }

    const prog = this.cardProgress[card.id] || (this.cardProgress[card.id] = { level: 1, fragments: 0 });
    prog.fragments += 1;
    let leveledUp = false;
    while (prog.fragments >= cost) {
      prog.fragments -= cost;
      prog.level += 1;
      leveledUp = true;
    }
    this.save();
    return { isNew: false, leveledUp, level: prog.level, fragments: prog.fragments, cost };
  },

  // Actualiza los chips de recursos del topbar (presente en todas las páginas)
  renderTopbar() {
    const gemsEl = document.getElementById("res-gems");
    const goldEl = document.getElementById("res-gold");
    if (gemsEl) gemsEl.textContent = this.gems;
    if (goldEl) goldEl.textContent = this.gold > 999 ? (this.gold / 1000).toFixed(1) + "k" : this.gold;
  },
};

document.addEventListener("DOMContentLoaded", () => {
  State.init();
  // Avisa a los scripts de cada página que el estado ya está cargado y
  // listo para leer (reemplaza el viejo patrón de setTimeout(fn, 0), que
  // era una carrera de tiempos y podía renderizar antes de tiempo).
  document.dispatchEvent(new CustomEvent("state:ready"));
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((err) => console.warn("SW error:", err));
  });
}