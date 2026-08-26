/**
 * js/data/bosses.js
 * Jefes finales de cada mundo/mazmorra.
 * Cada jefe tiene estadísticas base similares a las cartas (atk, def, hp, spd).
 * Las imágenes van en carpeta imagenes/ con el nombre del boss.
 */

const BOSSES = [
  {
    id: "boss_genesis",
    worldId: 1,
    name: "Serpiente del Edén",
    emoji: "🐍",
    image: "imagenes/boss_genesis.png",
    stats: {
      atk: 480,
      def: 600,
      hp: 3500,
      spd: 65,
    },
    description: "La serpiente tentadora del Jardín del Edén",
  },
  {
    id: "boss_exodus",
    worldId: 2,
    name: "Faraón de Egipto",
    emoji: "👑",
    image: "imagenes/boss_exodus.png",
    stats: {
      atk: 880,
      def: 1220,
      hp: 9200,
      spd: 60,
    },
    description: "El poderoso Faraón que esclavizaba al pueblo de Israel",
  },
  {
    id: "boss_conesqut",
    worldId: 3,
    name: "Rey de Jericó",
    emoji: "🏰",
    image: "imagenes/boss_conesqut.png",
    stats: {
      atk: 920,
      def: 1350,
      hp: 9500,
      spd: 55,
    },
    description: "Gobernante de la ciudad amurallada de Jericó",
  },
  {
    id: "boss_kings",
    worldId: 4,
    name: "Goliat",
    emoji: "⚒️",
    image: "imagenes/boss_kings.png",
    stats: {
      atk: 940,
      def: 1420,
      hp: 5800,
      spd: 50,
    },
    description: "El gigante filisteo de más de tres metros de altura",
  },
  {
    id: "boss_prophets",
    worldId: 5,
    name: "Baal",
    emoji: "⚡",
    image: "imagenes/boss_prophets.png",
    stats: {
      atk: 1040,
      def: 1500,
      hp: 4000,
      spd: 75,
    },
    description: "Dios falso adorado por los pueblos paganos",
  },
  {
    id: "boss_gospels",
    worldId: 6,
    name: "Satanás",
    emoji: "👿",
    image: "imagenes/boss_gospels.png",
    stats: {
      atk: 1200,
      def: 1600,
      hp: 8000,
      spd: 100,
    },
    description: "El enemigo final, tentador y adversario del bien",
  },
];

/**
 * Obtiene el jefe de un mundo específico.
 */
function getBossByWorldId(worldId) {
  return BOSSES.find((b) => b.worldId === worldId);
}
