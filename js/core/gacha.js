/**
 * js/core/gacha.js
 * Lógica pura de apertura de cofres (sin tocar el DOM).
 * Lee directamente el arreglo global CARDS de js/data/cards.js.
 */
const CHEST_ODDS = {
  wood:   { COMMON: 0.80, UNCOMMON: 0.15, RARE: 0.5 },
  silver: { COMMON: 0.35, UNCOMMON: 0.35, RARE: 0.22, EPIC: 0.08 },
  king:   { RARE: 0.40, EPIC: 0.40, LEGENDARY: 0.18, MYTHIC: 0.02 },
};

const RARITY_ORDER = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"];

function raritiesWithCards() {
  return new Set(CARDS.map((c) => c.rarity));
}

function availableOdds(oddsTable) {
  const existing = raritiesWithCards();
  const filtered = Object.fromEntries(
    Object.entries(oddsTable).filter(([r]) => existing.has(r))
  );
  const total = Object.values(filtered).reduce((a, b) => a + b, 0);
  if (total <= 0) return null;
  return Object.fromEntries(Object.entries(filtered).map(([r, p]) => [r, p / total]));
}

function weightedRandom(oddsTable) {
  const roll = Math.random();
  let acc = 0;
  for (const [rarity, prob] of Object.entries(oddsTable)) {
    acc += prob;
    if (roll <= acc) return rarity;
  }
  return Object.keys(oddsTable)[0];
}

function weightedAtLeast(chestType, minRarity) {
  const minIndex = RARITY_ORDER.indexOf(minRarity);
  const existing = raritiesWithCards();
  const filtered = Object.fromEntries(
    Object.entries(CHEST_ODDS[chestType]).filter(
      ([r]) => RARITY_ORDER.indexOf(r) >= minIndex && existing.has(r)
    )
  );
  const total = Object.values(filtered).reduce((a, b) => a + b, 0);
  if (total <= 0) {
    return weightedRandom(availableOdds(CHEST_ODDS[chestType]));
  }
  const normalized = Object.fromEntries(
    Object.entries(filtered).map(([r, p]) => [r, p / total])
  );
  return weightedRandom(normalized);
}

function pickRarity(chestType, pity) {
  if (pity.sinceEpic >= 9) return weightedAtLeast(chestType, "EPIC");
  if (pity.sinceLegendary >= 49) return "LEGENDARY";
  return weightedRandom(availableOdds(CHEST_ODDS[chestType]));
}

const GachaSystem = {
  openChest(chestType, pity) {
    const rarity = pickRarity(chestType, pity);
    const pool = CARDS.filter((c) => c.rarity === rarity);
    const card = pool.length
      ? pool[Math.floor(Math.random() * pool.length)]
      : CARDS[Math.floor(Math.random() * CARDS.length)];

    pity.sinceEpic =
      ["EPIC", "LEGENDARY", "MYTHIC"].includes(card.rarity) ? 0 : pity.sinceEpic + 1;
    pity.sinceLegendary =
      ["LEGENDARY", "MYTHIC"].includes(card.rarity) ? 0 : pity.sinceLegendary + 1;

    return { card, rarity: card.rarity, pity };
  },

  newPityState() {
    return { sinceEpic: 0, sinceLegendary: 0 };
  },
};
