/**
 * js/data/synergies.js
 * Combinaciones bíblicas: si el equipo activo contiene a estos characterId,
 * se activa el bono. Igual que cards.js: agregar una sinergia nueva es
 * agregar un objeto aquí, sin tocar la lógica de core/gacha.js ni app.js.
 *
 * Generado automáticamente a partir de los synergyTags presentes en
 * cards.js (todas las cartas que tenías hasta el momento).
 */
const SYNERGIES = [
  {
    id: "hombres_de_david",
    name: "Hombres de David",
    members: ["david", "jonatan", "absalon_rebelde", "betsabe_reina", "rut_moabita", "salomon_rey"],
    bonusLabel: "+15% ataque, +10% velocidad",
    apply: (stats) => ({ ...stats, atk: stats.atk * 1.15, spd: stats.spd * 1.10 }),
  },
  {
    id: "reyes_de_israel",
    name: "Reyes de Israel",
    members: ["david", "juda_hijo_jacob", "samuel_profeta", "saul_rey", "betsabe_reina", "ester_reina", "ezequias_rey", "salomon_rey"],
    bonusLabel: "+20% defensa",
    apply: (stats) => ({ ...stats, def: stats.def * 1.20 }),
  },
  {
    id: "profetas",
    name: "Profetas",
    members: [
      "daniel", "samuel_profeta", "naaman_comandante", "jonas_profeta", "balaam_vidente",
      "miriam_profetisa", "debora_jueza", "juan_bautista", "ana_madre_samuel",
      "elias_profeta", "eliseo_profeta", "isaias_profeta", "jeremias_profeta", "ezequiel_profeta",
    ],
    bonusLabel: "+25% poder de habilidades",
    apply: (stats) => ({ ...stats, abilityPower: (stats.abilityPower || 1) * 1.25 }),
  },
  {
    id: "mujeres_de_fe",
    name: "Mujeres de Fe",
    members: [
      "samaritana_pozo", "viuda_generosa", "sirvienta_naaman", "maria_betania",
      "betsabe_reina", "miriam_profetisa", "rahab_espia", "debora_jueza", "ester_reina",
      "rut_moabita", "ana_madre_samuel",
    ],
    bonusLabel: "+15% curación, +10% vida máxima",
    apply: (stats) => ({ ...stats, healing: (stats.healing || 1) * 1.15, hp: stats.hp * 1.10 }),
  },
  {
    id: "sacerdotes_levitas",
    name: "Sacerdotes y Levitas",
    members: ["levi_hijo_jacob", "bezaleel_artesano", "aaron_sacerdote"],
    bonusLabel: "+20% defensa, +10% poder de habilidades",
    apply: (stats) => ({ ...stats, def: stats.def * 1.20, abilityPower: (stats.abilityPower || 1) * 1.10 }),
  },
  {
    id: "doce_tribus",
    name: "Doce Tribus de Israel",
    members: [
      "ruben", "simeon_hijo_jacob", "levi_hijo_jacob", "juda_hijo_jacob", "isacar_hijo_jacob",
      "zabulon_hijo_jacob", "dan_hijo_jacob", "gad_hijo_jacob", "aser_hijo_jacob", "neftali_hijo_jacob",
      "jose_hijo_jacob", "benjamin_hijo_jacob", "caleb_guerrero", "jacob_patriarca", "jose_gobernador_egipto",
    ],
    bonusLabel: "+10% a todas las estadísticas",
    apply: (stats) => ({
      ...stats,
      atk: stats.atk * 1.10,
      def: stats.def * 1.10,
      hp: stats.hp * 1.10,
      spd: stats.spd * 1.10,
    }),
  },
  {
    id: "apostoles",
    name: "Apóstoles y Discípulos",
    members: ["cornelio_centurion", "felipe_evangelista", "silas_companero", "timoteo_discipulo", "pedro_apostol", "pablo_apostol"],
    bonusLabel: "+15% velocidad, +10% ataque",
    apply: (stats) => ({ ...stats, spd: stats.spd * 1.15, atk: stats.atk * 1.10 }),
  },
  {
    id: "jueces",
    name: "Jueces de Israel",
    members: ["gedeon_juez", "debora_jueza", "sanson_juez"],
    bonusLabel: "+25% ataque",
    apply: (stats) => ({ ...stats, atk: stats.atk * 1.25 }),
  },
  {
    id: "patriarcas",
    name: "Patriarcas",
    members: ["isaac_patriarca", "jacob_patriarca", "jose_gobernador_egipto", "adan_primer_hombre", "abraham_patriarca", "noe_constructor"],
    bonusLabel: "+20% vida máxima, +10% defensa",
    apply: (stats) => ({ ...stats, hp: stats.hp * 1.20, def: stats.def * 1.10 }),
  },
];