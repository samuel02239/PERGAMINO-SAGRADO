/**
 * js/data/worlds.js
 * Mundos de la campaña (mazmorras). Sistema de desbloqueo por días:
 * - Lunes: Génesis
 * - Martes: Éxodo
 * - Miércoles: Conquista
 * - Jueves: Los Reyes
 * - Viernes: Los Profetas
 * - Sábado: Los Evangelios
 * - Domingo: Todos disponibles
 */

const WORLD_UNLOCK_DAY = {
  1: 1, // Lunes (Monday = 1)
  2: 2, // Martes
  3: 3, // Miércoles
  4: 4, // Jueves
  5: 5, // Viernes
  6: 6, // Sábado
};

function isWorldUnlockedToday(worldId) {
  const today = new Date().getDay();
  const unlockDay = WORLD_UNLOCK_DAY[worldId];

  // Domingo (0) = todos desbloqueados
  if (today === 0) return true;

  // Solo la mazmorra cuyo día de desbloqueo es EXACTAMENTE hoy está abierta.
  // Las demás permanecen cerradas (ya no se acumulan las de días anteriores).
  return today === unlockDay;
}

function getDayNameForWorld(worldId) {
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return days[WORLD_UNLOCK_DAY[worldId]];
}

const WORLDS = [
  {
    id: 1,
    name: "Génesis",
    icon: "🌳",
    theme: "Paraíso Perdido",
    description: "La creación y las primeras pruebas de fe",
    unlockDay: 1,
    rewards: { gems: 50, gold: 500 },
  },
  {
    id: 2,
    name: "Éxodo",
    icon: "🔥",
    theme: "La Liberación",
    description: "Escapar de la esclavitud en Egipto",
    unlockDay: 2,
    rewards: { gems: 75, gold: 750 },
  },
  {
    id: 3,
    name: "Conquista",
    icon: "⚔️",
    theme: "Tierra Prometida",
    description: "La conquista de Canaán",
    unlockDay: 3,
    rewards: { gems: 100, gold: 1000 },
  },
  {
    id: 4,
    name: "Los Reyes",
    icon: "👑",
    theme: "El Reino Unido",
    description: "Era de los grandes reyes de Israel",
    unlockDay: 4,
    rewards: { gems: 125, gold: 1250 },
  },
  {
    id: 5,
    name: "Los Profetas",
    icon: "📜",
    theme: "Voces en el Desierto",
    description: "Mensajeros divinos en tiempos oscuros",
    unlockDay: 5,
    rewards: { gems: 150, gold: 1500 },
  },
  {
    id: 6,
    name: "Los Evangelios",
    icon: "✝️",
    theme: "La Redención",
    description: "La venida del Salvador",
    unlockDay: 6,
    rewards: { gems: 200, gold: 2000 },
  },
];