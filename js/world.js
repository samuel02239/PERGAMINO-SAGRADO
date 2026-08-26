/**
 * js/world.js
 * Sistema de mazmorras con combate por turnos contra jefes finales.
 * El jefe tiene vida INFINITA: la batalla no se gana agotando su HP.
 * En cambio, cuanto más daño acumulado le han sacado, más FURIOSO
 * se pone y más fuerte ataca (su daño crece con el daño recibido).
 *
 * El combate es de EQUIPO COMPLETO: todos los campeones del jugador
 * entran a la vez contra el jefe. En cada ronda:
 *   1) Cada campeón vivo ataca al jefe, uno por uno.
 *   2) El jefe contraataca a TODOS los campeones vivos por igual
 *      (cada uno recibe su propio golpe, no se reparte el daño).
 *   3) Los campeones con menos vida caen primero; los demás siguen
 *      luchando hasta que caen todos o el jugador se retira.
 *
 * La recompensa (gemas y oro) se calcula según el daño TOTAL infligido
 * al jefe durante todo el combate — a más daño, mejor recompensa.
 * Depende de: WORLDS, BOSSES, CARDS, RARITY, State
 */

let currentBattle = null;
let pendingWorldId = null;

// ─────────────────────────────────────────────────────────────
// Renderizado de lista de mazmorras
// ─────────────────────────────────────────────────────────────

function renderWorlds() {
  const el = document.getElementById("worlds-list");
  el.innerHTML = "";

  WORLDS.forEach((world) => {
    const isUnlocked = isWorldUnlockedToday(world.id);
    const row = document.createElement("div");
    row.className = "world-card" + (isUnlocked ? "" : " locked-world");

    const unlockInfo = isUnlocked
      ? "✅ Disponible hoy"
      : `🔒 Se desbloquea el ${getDayNameForWorld(world.id)}`;

    row.innerHTML = `
      <div class="wc-icon">${world.icon}</div>
      <div class="wc-info">
        <div class="wc-name">Mundo ${world.id} · ${world.name}</div>
        <div class="wc-theme">${world.theme}</div>
        <div class="wc-desc">${world.description}</div>
        <div class="wc-unlock">${unlockInfo}</div>
      </div>
      <div class="wc-rewards">
        <div class="reward-item">💎 ${world.rewards.gems}</div>
        <div class="reward-item">🪙 ${(world.rewards.gold / 1000).toFixed(1)}k</div>
      </div>
    `;

    if (isUnlocked) {
      row.onclick = () => startBattle(world.id);
      row.style.cursor = "pointer";
    }

    el.appendChild(row);
  });
}

// ─────────────────────────────────────────────────────────────
// Sistema de combate
// ─────────────────────────────────────────────────────────────

function startBattle(worldId) {
  const world = WORLDS.find((w) => w.id === worldId);
  const boss = getBossByWorldId(worldId);

  if (!world || !boss) return;

  pendingWorldId = worldId;

  // Cambiar vistas: de la lista de mazmorras a la presentación del jefe
  document.getElementById("worlds-view").style.display = "none";
  document.getElementById("world-intro-view").style.display = "block";
  document.getElementById("battle-view").style.display = "none";

  // Cabecera y datos del jefe (imagen desde imagenes/<archivo-del-boss>.png, ver bosses.js)
  document.getElementById("intro-title").textContent = `${world.name} — ${boss.name}`;
  document.getElementById("intro-boss-name").textContent = boss.name;
  document.getElementById("intro-boss-fury").textContent = "🔥 Furia: x1.00";
  document.getElementById("intro-boss-desc").textContent = boss.description;
  document.getElementById("intro-footer-text").innerHTML =
    `¡${boss.name} aparece con poder infinito!<br>Todo tu equipo luchará junto contra él.`;

  const bossImg = document.getElementById("intro-boss-img");
  bossImg.src = boss.image;
  bossImg.alt = boss.name;
  bossImg.onerror = function () { this.style.display = "none"; };
  bossImg.style.display = "block";

  renderIntroChampions();
  updateStartButton();
}

// Cuadrícula de campeones en la pantalla de presentación: se muestra
// TODO el equipo, ya que todos entrarán juntos al combate (no se elige
// un único campeón).
function renderIntroChampions() {
  const grid = document.getElementById("intro-champs-grid");
  grid.innerHTML = "";

  State.team.forEach((cardId) => {
    const card = CARDS.find((c) => c.id === cardId);
    if (!card) return;

    const level = State.getLevel(cardId);
    const stats = getEffectiveStats(card, level);
    const rarityColor = (typeof RARITY !== "undefined" && RARITY[card.rarity]) ? RARITY[card.rarity].color : "#D4AF37";

    const el = document.createElement("div");
    el.className = "intro-champ-card selected";
    el.style.setProperty("--card-color", rarityColor);
    el.innerHTML = `
      <div class="ic-art">
        <img src="${card.image}" alt="${card.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="ic-art-emoji" style="display:none;">${card.emoji}</div>
        <div class="ic-check">✓</div>
      </div>
      <div class="ic-name">${card.name}</div>
      <div class="ic-role">${ROLE_ICON[card.role] || "?"}</div>
      <div class="ic-level">Nv. ${level}</div>
      <div class="ic-atk">⚔️ ${stats.atk}</div>
    `;
    grid.appendChild(el);
  });
}

function updateStartButton() {
  const btn = document.getElementById("intro-start-battle");
  if (State.team.length > 0) {
    btn.textContent = "⚔️ Iniciar Batalla";
    btn.classList.add("ready");
  } else {
    btn.textContent = "No tienes campeones en tu equipo";
    btn.classList.remove("ready");
  }
}

function backToWorldsFromIntro() {
  pendingWorldId = null;
  document.getElementById("world-intro-view").style.display = "none";
  document.getElementById("worlds-view").style.display = "block";
}

// Confirma y arranca el combate real: TODO el equipo entra a la vez.
function confirmStartBattle() {
  if (!pendingWorldId || State.team.length === 0) return;

  const worldId = pendingWorldId;
  const world = WORLDS.find((w) => w.id === worldId);
  const boss = getBossByWorldId(worldId);
  if (!world || !boss) return;

  // Construir el equipo completo con su vida y ataque actuales
  const team = State.team
    .map((cardId) => {
      const card = CARDS.find((c) => c.id === cardId);
      if (!card) return null;
      const level = State.getLevel(cardId);
      const stats = getEffectiveStats(card, level);
      return {
        id: cardId,
        name: card.name,
        emoji: card.emoji,
        image: card.image,
        role: card.role,
        rarity: card.rarity,
        level,
        stats,
        hp: stats.hp,
        maxHp: stats.hp,
        defeated: false,
      };
    })
    .filter(Boolean);

  if (team.length === 0) return;

  // Inicializar batalla. boss.maxHp se conserva únicamente como
  // referencia de escala para calcular la recompensa y la furia
  // (el jefe ya no pierde vida real: es invencible).
  currentBattle = {
    worldId,
    world,
    boss: {
      ...boss,
      maxHp: boss.stats.hp,
    },
    team,
    totalDamage: 0,
    log: [],
    finished: false,
  };

  document.getElementById("world-intro-view").style.display = "none";
  document.getElementById("battle-view").style.display = "block";
  document.getElementById("battle-result").style.display = "none";
  document.getElementById("battle-stats-bar").style.display = "flex";

  const playerInfoEl = document.getElementById("player-info");
  if (playerInfoEl) playerInfoEl.style.display = "none";

  document.getElementById("battle-title").textContent = `${world.name} — ${boss.name}`;
  renderBattleArena();
  addBattleLog(`¡${boss.name} aparece con poder infinito!`);
  addBattleLog(`Tu equipo de ${team.length} campeón${team.length === 1 ? "" : "es"} entra en combate junto.`);
  updateBattleStatsUI();

  // Arranca la primera ronda: todo el equipo ataca al jefe.
  setTimeout(() => startRound(), 900);
}

function renderBattleArena() {
  const boss = currentBattle.boss;

  // Renderizar boss (vida infinita: barra siempre llena)
  document.getElementById("boss-name").textContent = boss.name;
  document.getElementById("boss-hp-text").textContent = "♾️ Ilimitada";

  // Mostrar imagen del boss, centrada en su recuadro
  const bossArtEl = document.getElementById("boss-art");
  bossArtEl.innerHTML = `<img src="${boss.image}" alt="${boss.name}" onerror="this.style.display='none'; this.parentElement.textContent='${boss.emoji}'">`;

  // Renderizar TODAS las cartas del equipo con su vida actual: ya no
  // se elige una sola, todas luchan simultáneamente contra el jefe.
  const teamEl = document.getElementById("team-cards");
  teamEl.innerHTML = "";

  currentBattle.team.forEach((hero) => {
    const rarityColor = (typeof RARITY !== "undefined" && RARITY[hero.rarity]) ? RARITY[hero.rarity].color : "#D4AF37";
    const hpPct = Math.max(0, (hero.hp / hero.maxHp) * 100);

    const cardEl = document.createElement("div");
    cardEl.id = `hero-card-${hero.id}`;
    cardEl.className = "battle-card" + (hero.defeated ? " defeated" : "");
    cardEl.style.setProperty("--card-color", rarityColor);
    cardEl.innerHTML = `
      <div class="bc-art">
        <img src="${hero.image}" alt="${hero.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="bc-art-emoji" style="display:none;">${hero.emoji}</div>
      </div>
      <div class="bc-name">${hero.name}</div>
      ${hero.defeated
        ? `<div class="bc-defeated-tag">☠️ Caído</div>`
        : `<div class="bc-role">${ROLE_ICON[hero.role] || "?"}</div>
           <div class="bc-hp-bar"><div class="bc-hp-fill" style="width:${hpPct}%;"></div></div>
           <div class="bc-hp-text">${hero.hp} / ${hero.maxHp}</div>`}
    `;
    teamEl.appendChild(cardEl);
  });

  updateBattleStatsUI();
}

function getAliveHeroes() {
  return currentBattle.team.filter((h) => !h.defeated);
}

// ─────────────────────────────────────────────────────────────
// Rondas de combate: ataca todo el equipo, luego contraataca el jefe
// ─────────────────────────────────────────────────────────────

function startRound() {
  if (!currentBattle || currentBattle.finished) return;
  if (getAliveHeroes().length === 0) {
    endBattle("defeated");
    return;
  }
  heroAttackSequence(0);
}

// Recorre el equipo en orden y hace atacar a cada campeón vivo, uno
// tras otro, antes de pasar al contraataque del jefe.
function heroAttackSequence(index) {
  if (!currentBattle || currentBattle.finished) return;

  const team = currentBattle.team;
  if (index >= team.length) {
    setTimeout(() => bossAttackAll(), 900);
    return;
  }

  const hero = team[index];
  if (hero.defeated) {
    heroAttackSequence(index + 1);
    return;
  }

  heroAttack(hero);
  setTimeout(() => heroAttackSequence(index + 1), 700);
}

function heroAttack(hero) {
  const boss = currentBattle.boss;

  // Calcular daño (ATK ± 20% de variación)
  const variance = 0.8 + Math.random() * 0.4;
  const damage = Math.round(hero.stats.atk * variance);

  // Aplicar defensa del boss
  const actualDamage = Math.max(1, Math.round(damage - boss.stats.def * 0.3));

  // El jefe es invencible: no pierde vida, pero el daño cuenta
  // para calcular la recompensa final y la furia del jefe.
  currentBattle.totalDamage += actualDamage;

  addBattleLog(`${hero.name} ataca | Daño: ${actualDamage}`);
  animateHeroAttack(hero.id);
  updateBattleStatsUI();
}

// Cuanto más daño acumulado le han sacado al jefe, más furioso se pone:
// su ataque crece proporcionalmente al daño ya infligido (misma escala
// que usa la recompensa, tomando la vida base del jefe como referencia).
function getBossFuryMultiplier() {
  const boss = currentBattle.boss;
  return 1 + currentBattle.totalDamage / boss.maxHp;
}

// El jefe contraataca a TODOS los campeones vivos por igual: cada uno
// recibe su propio golpe (no se reparte el daño entre ellos). Los que
// tengan menos vida restante caerán primero.
function bossAttackAll() {
  if (!currentBattle || currentBattle.finished) return;

  const boss = currentBattle.boss;
  const alive = getAliveHeroes();

  if (alive.length === 0) {
    endBattle("defeated");
    return;
  }

  const fury = getBossFuryMultiplier();
  const variance = 0.8 + Math.random() * 0.4;

  addBattleLog(`${boss.name} ataca a todo el equipo con furia x${fury.toFixed(2)}`);
  animateAttack("boss");

  alive.forEach((hero) => {
    const damage = Math.round(boss.stats.atk * fury * variance);
    const actualDamage = Math.max(1, Math.round(damage - hero.stats.def * 0.3));

    hero.hp = Math.max(0, hero.hp - actualDamage);
    addBattleLog(`${hero.name} recibe ${actualDamage} de daño`);

    if (hero.hp <= 0) {
      hero.defeated = true;
      addBattleLog(`${hero.name} ha caído en combate...`);
    }
  });

  renderBattleArena();

  if (getAliveHeroes().length === 0) {
    setTimeout(() => endBattle("defeated"), 900);
    return;
  }

  // Siguiente ronda: el equipo vuelve a atacar al jefe.
  setTimeout(() => startRound(), 1200);
}

// Actualiza el panel de daño acumulado, la recompensa estimada y la
// furia actual del jefe en vivo.
function updateBattleStatsUI() {
  const reward = computeReward();
  document.getElementById("total-damage").textContent = currentBattle.totalDamage;
  document.getElementById("est-gems").textContent = reward.gems;
  document.getElementById("est-gold").textContent = reward.gold;

  const furyEl = document.getElementById("boss-fury");
  if (furyEl) furyEl.textContent = `🔥 Furia: x${getBossFuryMultiplier().toFixed(2)}`;
}

// Calcula la recompensa según el daño total infligido, tomando como
// referencia de escala la vida base del jefe (world.rewards = 100% de
// referencia cuando el daño acumulado iguala esa vida base).
function computeReward() {
  const world = currentBattle.world;
  const boss = currentBattle.boss;
  const multiplier = currentBattle.totalDamage / boss.maxHp;
  const gems = Math.max(currentBattle.totalDamage > 0 ? 1 : 0, Math.round(world.rewards.gems * multiplier));
  const gold = Math.max(currentBattle.totalDamage > 0 ? 1 : 0, Math.round(world.rewards.gold * multiplier));
  return { gems, gold, multiplier };
}

function animateHeroAttack(heroId) {
  const el = document.getElementById(`hero-card-${heroId}`);
  if (el) {
    el.classList.add("attacking");
    setTimeout(() => el.classList.remove("attacking"), 600);
  }
}

function animateAttack(source) {
  if (source === "boss") {
    const bossArt = document.getElementById("boss-art");
    if (bossArt) {
      bossArt.classList.add("attack-animation");
      setTimeout(() => bossArt.classList.remove("attack-animation"), 600);
    }
  }
}

function addBattleLog(message) {
  const log = document.getElementById("battle-log");
  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.textContent = message;
  log.appendChild(entry);

  // Scroll automático al final
  log.scrollTop = log.scrollHeight;

  // Guardar en estado de batalla
  if (currentBattle) {
    currentBattle.log.push(message);
  }
}

// Retirada voluntaria: cobra la recompensa acumulada sin necesidad
// de que caiga todo el equipo.
function attemptRetreat() {
  if (!currentBattle || currentBattle.finished) return;
  if (getAliveHeroes().length === 0) return;
  endBattle("retreat");
}

function endBattle(reason) {
  currentBattle.finished = true;
  currentBattle.endReason = reason;

  const boss = currentBattle.boss;

  if (reason === "defeated") {
    // La caída del último campeón ya quedó registrada en bossAttackAll().
    addBattleLog(`Tu equipo ha sido derrotado por completo ante ${boss.name}.`);
  } else {
    addBattleLog(`Te retiras del combate ante ${boss.name} con honor.`);
  }

  const reward = computeReward();
  addBattleLog(`Recompensa obtenida por el daño infligido: 💎 ${reward.gems} · 🪙 ${reward.gold}`);

  // Dar recompensas (siempre proporcionales al daño hecho)
  State.addGems(reward.gems);
  State.addGold(reward.gold);

  // Mostrar resultado
  setTimeout(() => showBattleResult(reason, reward), 1500);
}

function showBattleResult(reason, reward) {
  const resultEl = document.getElementById("battle-result");
  const statusEl = document.getElementById("result-status");
  const rewardsEl = document.getElementById("result-rewards");

  if (reason === "retreat") {
    statusEl.innerHTML = `<div class="result-victory">🏳️ Retirada con Honor</div>`;
  } else {
    statusEl.innerHTML = `<div class="result-defeat">💀 Equipo Derrotado</div>`;
  }

  rewardsEl.innerHTML = `
    <p class="defeat-message">Daño total infligido: <b>${currentBattle.totalDamage}</b></p>
    <div class="rewards-list">
      <div class="reward-row">💎 ${reward.gems} Gemas</div>
      <div class="reward-row">🪙 ${reward.gold} Monedas</div>
    </div>
  `;

  resultEl.style.display = "flex";
}

// Volver a lista de mundos
function backToWorlds() {
  currentBattle = null;
  document.getElementById("worlds-view").style.display = "block";
  document.getElementById("battle-view").style.display = "none";
  document.getElementById("battle-log").innerHTML = "";
  document.getElementById("team-cards").innerHTML = "";
  const playerInfoEl = document.getElementById("player-info");
  if (playerInfoEl) playerInfoEl.style.display = "none";
  document.getElementById("battle-stats-bar").style.display = "none";
}

document.addEventListener("state:ready", () => {
  renderWorlds();
});

document.getElementById("intro-back").addEventListener("click", backToWorldsFromIntro);
document.getElementById("intro-start-battle").addEventListener("click", confirmStartBattle);
document.getElementById("battle-back").addEventListener("click", backToWorlds);
document.getElementById("battle-retreat").addEventListener("click", attemptRetreat);
document.getElementById("result-continue").addEventListener("click", backToWorlds);