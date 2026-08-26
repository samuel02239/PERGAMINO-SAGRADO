/**
 * js/data/cards.js
 * ÚNICA fuente de verdad de las cartas.
 *
 * Cada carta ahora tiene DOS posibles fuentes de imagen:
 *   - "image"    -> ruta al archivo en la carpeta local imagenes/, nombrado
 *                   igual que el id de la carta (ej. imagenes/david_guerrero.png).
 *   - "imageUrl" -> link público (Google Drive, Imgur, GitHub, etc.) que se
 *                   usa como respaldo si el archivo local no existe o no carga.
 *
 * Orden de carga (lo resuelve getCardImageSources / el <img onerror> en
 * cardModal.js): 1) carpeta local  2) imageUrl (link público)  3) emoji.
 * Así no hay que tocar código al subir el arte: si ya subiste el .png a la
 * carpeta imagenes/, se usa esa; si no, y pegaste un link en "imageUrl",
 * se usa ese; si ninguna existe, se ve el emoji como siempre.
 */

const RARITY = {
  COMMON:    { code: "C",   stars: 1, color: "#9AA0A6", label: "Común" },
  UNCOMMON:  { code: "UC",  stars: 2, color: "#4CAF50", label: "Poco común" },
  RARE:      { code: "R",   stars: 3, color: "#3E8FE0", label: "Rara" },
  EPIC:      { code: "EP",  stars: 4, color: "#B36BD4", label: "Épica" },
  LEGENDARY: { code: "LEG", stars: 5, color: "#D4AF37", label: "Legendaria" },
  MYTHIC:    { code: "MIT", stars: 6, color: "#C0392B", label: "Mítica" },
};

/**
 * Fragmentos de mejora necesarios por CADA nivel, según rareza.
 * El costo es fijo en cada mejora (no sube con el nivel) y no hay
 * tope de nivel — se puede seguir mejorando indefinidamente mientras
 * sigan cayendo duplicados de esa carta en los cofres.
 */
const UPGRADE_COST = {
  COMMON: 15,
  UNCOMMON: 10,
  RARE: 8,
  EPIC: 5,
  LEGENDARY: 3,
  MYTHIC: 1,
};

/**
 * Porcentaje de aumento de ESTADÍSTICAS (ataque, defensa, vida, velocidad)
 * que gana la carta en CADA mejora de nivel, según su rareza.
 * Es acumulativo: nivel 3 = base * (1 + bonus)^2, nivel 4 = base * (1 + bonus)^3, etc.
 */
const UPGRADE_BONUS = {
  COMMON: 0.10,     // +10% por mejora
  UNCOMMON: 0.15,   // +15% por mejora
  RARE: 0.20,       // +20% por mejora
  EPIC: 0.25,       // +25% por mejora
  LEGENDARY: 0.30,  // +30% por mejora
  MYTHIC: 0.40,     // +40% por mejora
};

/**
 * Calcula las estadísticas REALES de una carta según su nivel actual,
 * aplicando el bonus acumulado de UPGRADE_BONUS según su rareza.
 * level 1 = estadísticas base (sin bonus).
 */
function getEffectiveStats(card, level) {
  const bonus = UPGRADE_BONUS[card.rarity] || 0;
  const multiplier = Math.pow(1 + bonus, Math.max(0, level - 1));
  return {
    atk: Math.round(card.stats.atk * multiplier),
    def: Math.round(card.stats.def * multiplier),
    hp: Math.round(card.stats.hp * multiplier),
    spd: Math.round(card.stats.spd * multiplier),
  };
}

const ROLE_ICON = {
  attacker: "⚔️", tank: "🛡️", healer: "❤️", support: "✨",
  control: "🏹", dps: "🔥", buffer: "🧙",
};

function img(base) {
  return `imagenes/${base}.png`;
}

/**
 * Devuelve, en orden, las fuentes de imagen a intentar para una carta:
 * 1) la ruta local (carpeta imagenes/)
 * 2) el link público (imageUrl), si se definió
 * cardModal.js debe usar esto junto con un onerror que vaya probando
 * cada fuente de la lista, y si todas fallan, mostrar card.emoji.
 *
 * Uso típico en cardModal.js:
 *   const sources = getCardImageSources(card);
 *   // <img src={sources[0]} onerror="probar sources[1], luego emoji" />
 */
function getCardImageSources(card) {
  const sources = [];
  if (card.image) sources.push(card.image);
  if (card.imageUrl) sources.push(card.imageUrl);
  return sources;
}

/**
 * Helper listo para pegar en cardModal.js: dado el <img>, intenta cargar
 * cada fuente en orden y, si todas fallan, deja que se muestre el emoji.
 * Ejemplo de uso en el HTML/JS del modal:
 *
 *   const imgEl = document.querySelector('.card-image');
 *   attachImageFallback(imgEl, card, () => mostrarEmoji(card));
 */
function attachImageFallback(imgElement, card, onAllFail) {
  const sources = getCardImageSources(card);
  let index = 0;

  function tryNext() {
    if (index >= sources.length) {
      imgElement.style.display = "none";
      if (typeof onAllFail === "function") onAllFail();
      return;
    }
    imgElement.src = sources[index];
    index++;
  }

  imgElement.onerror = tryNext;
  tryNext(); // intenta la primera fuente (local) de una vez
}

const CARDS = [
  {
    id: "david_guerrero",
    characterId: "david",
    name: "David",
    version: "Guerrero",
    rarity: "LEGENDARY",
    role: "dps",
    emoji: "🗡️",
    image: img("david_guerrero"), imageUrl: "",
    stats: { atk: 1950, def: 620, hp: 4800, spd: 88 },
    ability: { name: "Cinco Piedras", desc: "Lanza una piedra con posibilidad de daño crítico." },
    ultimate: { name: "Frente a Goliat", desc: "Gran aumento de ataque contra enemigos de mayor nivel." },
    lore: {
      story: "Pastor que enfrentó a Goliat con una honda y una piedra, y luego fue rey de Israel.",
      verse: "1 Samuel 17:45-47",
      fact: "David derrotó a Goliat sin usar espada ni lanza.",
    },
    synergyTags: ["hombres_de_david", "reyes_de_israel"],
    level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 50, 150],
    owned: true,
  },
  {
    id: "david_joven_pastor",
    characterId: "david",
    name: "David",
    version: "Joven Pastor",
    rarity: "EPIC",
    role: "support",
    emoji: "🐑",
    image: img("david_joven_pastor"), imageUrl: "",
    stats: { atk: 480, def: 350, hp: 2600, spd: 95 },
    ability: { name: "Cántico del Pastor", desc: "Calma al equipo y restaura algo de vida." },
    ultimate: null,
    lore: {
      story: "Antes de ser guerrero, David cuidaba las ovejas de su padre en Belén.",
      verse: "1 Samuel 16:11-13",
      fact: "Fue el menor de ocho hermanos.",
    },
    synergyTags: ["hombres_de_david"],
    level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 30, 90],
    owned: false,
  },
  {
    id: "josue_conquistador",
    characterId: "josue",
    name: "Josué",
    version: "Conquistador",
    rarity: "RARE",
    role: "tank",
    emoji: "🛡️",
    image: img("josue_conquistador"), imageUrl: "",
    stats: { atk: 400, def: 780, hp: 5200, spd: 60 },
    ability: { name: "Muros de Jericó", desc: "Reduce el daño recibido por el equipo por 2 turnos." },
    ultimate: null,
    lore: {
      story: "Sucesor de Moisés, condujo la conquista de Canaán.",
      verse: "Josué 1:9",
      fact: "Las murallas de Jericó cayeron tras siete vueltas de los israelitas.",
    },
    synergyTags: [],
    level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 25, 75],
    owned: true,
  },
  {
    id: "moises_libertador",
    characterId: "moises",
    name: "Moisés",
    version: "Libertador",
    rarity: "LEGENDARY",
    role: "healer",
    emoji: "🌊",
    image: img("moises_libertador"), imageUrl: "",
    stats: { atk: 1300, def: 500, hp: 5000, spd: 70 },
    ability: { name: "Vara del Mar Rojo", desc: "Cura a todo el equipo un 20% de su vida máxima." },
    ultimate: { name: "Éxodo", desc: "Invulnerabilidad total al equipo durante 1 turno." },
    lore: {
      story: "Liberó al pueblo de Israel de la esclavitud en Egipto.",
      verse: "Éxodo 14:21-22",
      fact: "Dividió el Mar Rojo con su vara.",
    },
    synergyTags: [],
    level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 50, 150],
    owned: false,
  },
  {
    id: "daniel_profeta",
    characterId: "daniel",
    name: "Daniel",
    version: "En el Foso",
    rarity: "EPIC",
    role: "buffer",
    emoji: "🦁",
    image: img("daniel_profeta"), imageUrl: "",
    stats: { atk: 520, def: 610, hp: 3900, spd: 65 },
    ability: { name: "Fe Inquebrantable", desc: "Aumenta la defensa del equipo un 20%." },
    ultimate: null,
    lore: {
      story: "Sobrevivió una noche en el foso de los leones por su fidelidad a Dios.",
      verse: "Daniel 6:22",
      fact: "Los leones no le hicieron ningún daño.",
    },
    synergyTags: ["profetas"],
    level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 30, 90],
    owned: false,
  },
  {
    id: "jonatan_amigo_fiel",
    characterId: "jonatan",
    name: "Jonatán",
    version: "Amigo Fiel",
    rarity: "RARE",
    role: "control",
    emoji: "🏹",
    image: img("jonatan_amigo_fiel"), imageUrl: "",
    stats: { atk: 560, def: 400, hp: 3100, spd: 100 },
    ability: { name: "Flecha de Alianza", desc: "Aturde al enemigo con mayor ataque." },
    ultimate: null,
    lore: {
      story: "Hijo de Saúl y amigo inseparable de David.",
      verse: "1 Samuel 18:3",
      fact: "Hizo un pacto de lealtad eterna con David.",
    },
    synergyTags: ["hombres_de_david"],
    level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 25, 75],
    owned: true,
  },
  {
    id: "soldado_israelita",
    characterId: "soldado_israelita",
    name: "Soldado",
    version: "Israelita",
    rarity: "COMMON",
    role: "attacker",
    emoji: "🗡️",
    image: img("soldado_israelita"), imageUrl: "https://i.ibb.co/Jj0Ltq9c/Gemini-Generated-Image-vtjygsvtjygsvtjy.png",
    stats: { atk: 220, def: 200, hp: 1800, spd: 70 },
    ability: { name: "Golpe de Lanza", desc: "Ataque básico contra un enemigo." },
    ultimate: null,
    lore: { story: "Soldado del ejército de Israel en las campañas de conquista.", verse: "Josué 6:20", fact: "Los ejércitos de Israel marchaban con el arca del pacto al frente." },
    synergyTags: [],
    level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 20, 60],
    owned: false,
  },
  {
    id: "pastor_anonimo",
    characterId: "pastor_anonimo",
    name: "Pastor",
    version: "Del Campo",
    rarity: "COMMON",
    role: "support",
    emoji: "🐑",
    image: img("pastor_anonimo"), imageUrl: "https://i.ibb.co/XZm9gT0M/Gemini-Generated-Image-6qli1o6qli1o6qli.png",
    stats: { atk: 180, def: 220, hp: 2000, spd: 65 },
    ability: { name: "Cayado Protector", desc: "Aumenta ligeramente la defensa del equipo." },
    ultimate: null,
    lore: { story: "Cuidaba los rebaños en los campos de Belén.", verse: "Lucas 2:8", fact: "Los pastores fueron los primeros en recibir la noticia del nacimiento de Jesús." },
    synergyTags: [],
    level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 20, 60],
    owned: false,
  },
  {
    id: "levita_musico",
    characterId: "levita_musico",
    name: "Levita",
    version: "Músico del Templo",
    rarity: "UNCOMMON",
    role: "buffer",
    emoji: "🎵",
    image: img("levita_musico"), imageUrl: "https://i.ibb.co/dsVVQSr8/Gemini-Generated-Image-g2hztng2hztng2hz.png",
    stats: { atk: 260, def: 260, hp: 2400, spd: 75 },
    ability: { name: "Cántico de Alabanza", desc: "Restaura algo de energía al equipo." },
    ultimate: null,
    lore: { story: "Encargado de la música y el canto en el templo de Jerusalén.", verse: "1 Crónicas 15:16", fact: "David organizó coros y músicos levitas para el templo." },
    synergyTags: [],
    level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 18, 54],
    owned: false,
  },
  {
    id: "escriba_fiel",
    characterId: "escriba_fiel",
    name: "Escriba",
    version: "Fiel",
    rarity: "UNCOMMON",
    role: "control",
    emoji: "📜",
    image: img("escriba_fiel"), imageUrl: "https://i.ibb.co/Wpp02ZgC/Gemini-Generated-Image-kuusl2kuusl2kuus.png",
    stats: { atk: 240, def: 240, hp: 2200, spd: 80 },
    ability: { name: "Palabra Escrita", desc: "Reduce el ataque del enemigo por un turno." },
    ultimate: null,
    lore: { story: "Copista y guardián fiel de las Escrituras.", verse: "Esdras 7:6", fact: "Esdras era escriba diligente en la ley de Moisés." },
    synergyTags: [],
    level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 18, 54],
    owned: false,
  },

  // ══════════════════════════════════════════════════════════════
  // COMUNES (20)
  // ══════════════════════════════════════════════════════════════
  {
    id: "centurion_romano", characterId: "centurion_romano", name: "Centurión", version: "Romano",
    rarity: "COMMON", role: "tank", emoji: "🛡️", image: img("centurion_romano"), imageUrl: "https://i.ibb.co/nsYv3Ngg/Gemini-Generated-Image-69zabx69zabx69za.png",
    stats: { atk: 140, def: 280, hp: 2280, spd: 60 },
    ability: { name: "Orden Firme", desc: "Aumenta la defensa propia al recibir un ataque directo." },
    ultimate: null,
    lore: { story: "Oficial romano que mostró una fe notable al pedir a Jesús que sanara a su siervo.", verse: "Mateo 8:10", fact: "Jesús dijo que no había hallado una fe tan grande en todo Israel." },
    synergyTags: [], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 20, 60], owned: false,
  },
  {
    id: "samaritana_pozo", characterId: "samaritana_pozo", name: "Samaritana", version: "Del Pozo",
    rarity: "COMMON", role: "support", emoji: "💧", image: img("samaritana_pozo"), imageUrl: "https://i.ibb.co/TDF61fSK/Gemini-Generated-Image-5cwdh65cwdh65cwd.png",
    stats: { atk: 140, def: 190, hp: 1900, spd: 70 },
    ability: { name: "Agua Viva", desc: "Restaura un poco de energía a un aliado." },
    ultimate: null,
    lore: { story: "Mujer que conversó con Jesús junto al pozo de Jacob y llevó las buenas nuevas a su pueblo.", verse: "Juan 4:28-29", fact: "Fue de las primeras en anunciar a Jesús como el Mesías." },
    synergyTags: ["mujeres_de_fe"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 20, 60], owned: false,
  },
  {
    id: "ciego_nacimiento", characterId: "ciego_nacimiento", name: "Ciego", version: "De Nacimiento",
    rarity: "COMMON", role: "buffer", emoji: "👁️", image: img("ciego_nacimiento"), imageUrl: "https://i.ibb.co/N2PffFmb/Gemini-Generated-Image-mxwncxmxwncxmxwn.png",
    stats: { atk: 150, def: 200, hp: 1900, spd: 67 },
    ability: { name: "Ojos Abiertos", desc: "Aumenta ligeramente la precisión del equipo." },
    ultimate: null,
    lore: { story: "Hombre que nació ciego y fue sanado por Jesús con barro y agua de Siloé.", verse: "Juan 9:6-7", fact: "Su testimonio ante los fariseos se volvió cada vez más firme." },
    synergyTags: [], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 20, 60], owned: false,
  },
  {
    id: "leproso_sanado", characterId: "leproso_sanado", name: "Leproso", version: "Sanado",
    rarity: "COMMON", role: "healer", emoji: "🙏", image: img("leproso_sanado"), imageUrl: "https://i.ibb.co/PsPDmZSM/Gemini-Generated-Image-hxao06hxao06hxao.png",
    stats: { atk: 120, def: 180, hp: 2090, spd: 67 },
    ability: { name: "Gratitud Sincera", desc: "Cura una pequeña cantidad de vida a un aliado." },
    ultimate: null,
    lore: { story: "Uno de los diez leprosos sanados por Jesús, el único que regresó a agradecer.", verse: "Lucas 17:15-16", fact: "Era samaritano, un extranjero para los judíos de su tiempo." },
    synergyTags: [], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 20, 60], owned: false,
  },
  {
    id: "nino_panes", characterId: "nino_panes", name: "Niño", version: "De los Panes",
    rarity: "COMMON", role: "support", emoji: "🍞", image: img("nino_panes"), imageUrl: "https://i.ibb.co/hFgDPcWQ/Gemini-Generated-Image-1rvr9l1rvr9l1rvr.png",
    stats: { atk: 140, def: 190, hp: 1900, spd: 70 },
    ability: { name: "Cinco Panes y Dos Peces", desc: "Restaura energía a todo el equipo levemente." },
    ultimate: null,
    lore: { story: "Muchacho que ofreció su almuerzo, con el que Jesús alimentó a una multitud.", verse: "Juan 6:9", fact: "Sobraron doce cestas después de alimentar a miles." },
    synergyTags: [], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 20, 60], owned: false,
  },
  {
    id: "viuda_generosa", characterId: "viuda_generosa", name: "Viuda", version: "Generosa",
    rarity: "COMMON", role: "buffer", emoji: "🪙", image: img("viuda_generosa"), imageUrl: "https://i.ibb.co/0y3YzwS0/Gemini-Generated-Image-4sqi8w4sqi8w4sqi.png",
    stats: { atk: 150, def: 200, hp: 1900, spd: 67 },
    ability: { name: "Ofrenda de Fe", desc: "Aumenta ligeramente el ataque del equipo." },
    ultimate: null,
    lore: { story: "Viuda que dio dos pequeñas monedas al tesoro del templo, todo lo que tenía.", verse: "Marcos 12:43-44", fact: "Jesús dijo que había dado más que todos los ricos." },
    synergyTags: ["mujeres_de_fe"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 20, 60], owned: false,
  },
  {
    id: "guardia_templo", characterId: "guardia_templo", name: "Guardia", version: "Del Templo",
    rarity: "COMMON", role: "tank", emoji: "🛡️", image: img("guardia_templo"), imageUrl: "https://i.ibb.co/jZrjpLfF/Gemini-Generated-Image-op474wop474wop47.png",
    stats: { atk: 140, def: 280, hp: 2280, spd: 60 },
    ability: { name: "Vigilancia", desc: "Reduce el daño recibido por un turno." },
    ultimate: null,
    lore: { story: "Encargado de proteger el templo de Jerusalén día y noche.", verse: "1 Crónicas 9:27", fact: "Los levitas se turnaban para custodiar las puertas del templo." },
    synergyTags: [], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 20, 60], owned: false,
  },
  {
    id: "mercader_damasco", characterId: "mercader_damasco", name: "Mercader", version: "De Damasco",
    rarity: "COMMON", role: "control", emoji: "🧳", image: img("mercader_damasco"), imageUrl: "https://i.ibb.co/XnL1tQS/Gemini-Generated-Image-6wjq1m6wjq1m6wjq.png",
    stats: { atk: 180, def: 170, hp: 1900, spd: 88 },
    ability: { name: "Regateo Astuto", desc: "Reduce la velocidad del enemigo brevemente." },
    ultimate: null,
    lore: { story: "Comerciante de una de las rutas más antiguas del Cercano Oriente.", verse: "Ezequiel 27:18", fact: "Damasco era famosa por su comercio de vino y lana." },
    synergyTags: [], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 20, 60], owned: false,
  },
  {
    id: "pescador_galilea", characterId: "pescador_galilea", name: "Pescador", version: "De Galilea",
    rarity: "COMMON", role: "attacker", emoji: "🎣", image: img("pescador_galilea"), imageUrl: "https://i.ibb.co/YFHfK6gs/Gemini-Generated-Image-ta0k16ta0k16ta0k.png",
    stats: { atk: 250, def: 170, hp: 1900, spd: 74 },
    ability: { name: "Lanzamiento de Red", desc: "Ataque básico que puede alcanzar a dos enemigos." },
    ultimate: null,
    lore: { story: "Trabajador del mar de Galilea, oficio de varios de los apóstoles antes de seguir a Jesús.", verse: "Mateo 4:18-19", fact: "Jesús llamó a varios pescadores para hacerlos 'pescadores de hombres'." },
    synergyTags: [], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 20, 60], owned: false,
  },
  {
    id: "artesano_nazaret", characterId: "artesano_nazaret", name: "Artesano", version: "De Nazaret",
    rarity: "COMMON", role: "support", emoji: "🔨", image: img("artesano_nazaret"), imageUrl: "https://i.ibb.co/5h7tbrs4/Gemini-Generated-Image-7jfh407jfh407jfh.png",
    stats: { atk: 140, def: 190, hp: 1900, spd: 70 },
    ability: { name: "Manos Hábiles", desc: "Repara una pequeña cantidad de defensa a un aliado." },
    ultimate: null,
    lore: { story: "Trabajador de la madera en el pueblo donde Jesús creció.", verse: "Marcos 6:3", fact: "Nazaret era un pueblo pequeño y poco conocido en Galilea." },
    synergyTags: [], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 20, 60], owned: false,
  },
  {
    id: "agricultor_judea", characterId: "agricultor_judea", name: "Agricultor", version: "De Judá",
    rarity: "COMMON", role: "support", emoji: "🌾", image: img("agricultor_judea"), imageUrl: "https://i.ibb.co/d0K0vdG7/Gemini-Generated-Image-rx6989rx6989rx69.png",
    stats: { atk: 140, def: 190, hp: 1900, spd: 70 },
    ability: { name: "Siembra Paciente", desc: "Aumenta ligeramente la vida máxima del equipo." },
    ultimate: null,
    lore: { story: "Campesino que cultivaba trigo y cebada en las tierras de Judá.", verse: "Rut 2:3", fact: "La cebada se cosechaba en primavera, época del relato de Rut." },
    synergyTags: [], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 20, 60], owned: false,
  },
  {
    id: "sirvienta_naaman", characterId: "sirvienta_naaman", name: "Sirvienta", version: "De Naamán",
    rarity: "COMMON", role: "healer", emoji: "💫", image: img("sirvienta_naaman"), imageUrl: "https://i.ibb.co/MQmwGjs/Gemini-Generated-Image-u3x5bnu3x5bnu3x5.png",
    stats: { atk: 120, def: 180, hp: 2090, spd: 67 },
    ability: { name: "Palabra de Esperanza", desc: "Cura una pequeña cantidad de vida a un aliado." },
    ultimate: null,
    lore: { story: "Joven israelita cautiva que recomendó al profeta Eliseo para sanar a Naamán.", verse: "2 Reyes 5:2-3", fact: "Su consejo llevó a la sanidad milagrosa del comandante sirio." },
    synergyTags: ["mujeres_de_fe"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 20, 60], owned: false,
  },
  {
    id: "carcelero_filipos", characterId: "carcelero_filipos", name: "Carcelero", version: "De Filipos",
    rarity: "COMMON", role: "tank", emoji: "🔑", image: img("carcelero_filipos"), imageUrl: "https://i.ibb.co/wZWjWXYY/Gemini-Generated-Image-yfzzr5yfzzr5yfzz.png",
    stats: { atk: 140, def: 280, hp: 2280, spd: 60 },
    ability: { name: "Guardia Nocturna", desc: "Resiste el primer golpe recibido en la batalla." },
    ultimate: null,
    lore: { story: "Guardián de la prisión donde estaban Pablo y Silas, convertido tras un terremoto.", verse: "Hechos 16:29-31", fact: "Él y toda su familia se bautizaron esa misma noche." },
    synergyTags: [], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 20, 60], owned: false,
  },
  {
    id: "tejedor_templo", characterId: "tejedor_templo", name: "Tejedor", version: "Del Templo",
    rarity: "COMMON", role: "buffer", emoji: "🧵", image: img("tejedor_templo"), imageUrl: "https://i.ibb.co/qLKX0ZGJ/Gemini-Generated-Image-unc3pkunc3pkunc3.png",
    stats: { atk: 150, def: 200, hp: 1900, spd: 67 },
    ability: { name: "Hilo Sagrado", desc: "Aumenta ligeramente la defensa del equipo." },
    ultimate: null,
    lore: { story: "Artesano encargado de tejer las cortinas y vestiduras del templo.", verse: "Éxodo 35:35", fact: "Dios llenó a los artesanos del tabernáculo de sabiduría especial." },
    synergyTags: [], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 20, 60], owned: false,
  },
  {
    id: "alfarero_jerusalen", characterId: "alfarero_jerusalen", name: "Alfarero", version: "De Jerusalén",
    rarity: "COMMON", role: "control", emoji: "🏺", image: img("alfarero_jerusalen"), imageUrl: "https://i.ibb.co/j9zsRCGd/Gemini-Generated-Image-tjs4xktjs4xktjs4.png",
    stats: { atk: 180, def: 170, hp: 1900, spd: 88 },
    ability: { name: "Vasija Moldeada", desc: "Ralentiza al enemigo con mayor velocidad." },
    ultimate: null,
    lore: { story: "Artesano cuyo oficio inspiró una de las imágenes más conocidas de la Escritura.", verse: "Jeremías 18:6", fact: "Dios comparó su poder sobre Israel con el del alfarero sobre el barro." },
    synergyTags: [], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 20, 60], owned: false,
  },

  // ══════════════════════════════════════════════════════════════
  // POCO COMUNES (20)
  // ══════════════════════════════════════════════════════════════
  {
    id: "ruben_primogenito", characterId: "ruben", name: "Rubén", version: "Primogénito",
    rarity: "UNCOMMON", role: "dps", emoji: "⚔️", image: img("ruben_primogenito"), imageUrl: "https://i.ibb.co/VYQdNRNX/Gemini-Generated-Image-37sn7z37sn7z37sn.png",
    stats: { atk: 313, def: 213, hp: 2300, spd: 82 },
    ability: { name: "Fuerza del Primogénito", desc: "Ataque de gran potencia pero pierde algo de precisión." },
    ultimate: null,
    lore: { story: "Hijo primogénito de Jacob, líder de una de las doce tribus de Israel.", verse: "Génesis 49:3", fact: "Perdió su derecho de primogenitura por una falta grave contra su padre." },
    synergyTags: ["doce_tribus"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 18, 54], owned: false,
  },
  {
    id: "simeon_hijo_jacob", characterId: "simeon_hijo_jacob", name: "Simeón", version: "Hijo de Jacob",
    rarity: "UNCOMMON", role: "control", emoji: "🗡️", image: img("simeon_hijo_jacob"), imageUrl: "https://i.ibb.co/RTRjQrc8/Gemini-Generated-Image-do9jo4do9jo4do9j.png",
    stats: { atk: 225, def: 213, hp: 2300, spd: 98 },
    ability: { name: "Ira Contenida", desc: "Reduce el ataque del enemigo por un turno." },
    ultimate: null,
    lore: { story: "Segundo hijo de Jacob, cabeza de otra de las doce tribus de Israel.", verse: "Génesis 34:25", fact: "Su tribu terminó asentada dentro del territorio de Judá." },
    synergyTags: ["doce_tribus"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 18, 54], owned: false,
  },

  {
    id: "cornelio_centurion", characterId: "cornelio_centurion", name: "Cornelio", version: "Centurión",
    rarity: "UNCOMMON", role: "tank", emoji: "🛡️", image: img("cornelio_centurion"), imageUrl: "https://i.ibb.co/scmY7X5/Gemini-Generated-Image-mnozzcmnozzcmnoz.png",
    stats: { atk: 175, def: 350, hp: 2760, spd: 66 },
    ability: { name: "Devoción Constante", desc: "Reduce el daño recibido por un turno." },
    ultimate: null,
    lore: { story: "Centurión romano temeroso de Dios, primer gentil bautizado según el relato de Hechos.", verse: "Hechos 10:2", fact: "Un ángel le indicó que enviara a buscar a Pedro." },
    synergyTags: ["apostoles"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 18, 54], owned: false,
  },
  {
    id: "felipe_evangelista", characterId: "felipe_evangelista", name: "Felipe", version: "El Evangelista",
    rarity: "UNCOMMON", role: "support", emoji: "📖", image: img("felipe_evangelista"), imageUrl: "https://i.ibb.co/JWxwBMkL/Gemini-Generated-Image-6motpg6motpg6mot.png",
    stats: { atk: 175, def: 238, hp: 2300, spd: 78 },
    ability: { name: "Buenas Nuevas", desc: "Restaura energía a un aliado." },
    ultimate: null,
    lore: { story: "Uno de los siete escogidos para servir a la iglesia primitiva, predicó por Samaria.", verse: "Hechos 8:35", fact: "Explicó las Escrituras a un funcionario etíope en el camino a Gaza." },
    synergyTags: ["apostoles"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 18, 54], owned: false,
  },


  // ══════════════════════════════════════════════════════════════
  // RARAS (20)
  // ══════════════════════════════════════════════════════════════
  {
    id: "zaqueo_recaudador", characterId: "zaqueo_recaudador", name: "Zaqueo", version: "Recaudador",
    rarity: "RARE", role: "support", emoji: "🌳", image: img("zaqueo_recaudador"), imageUrl: "https://i.ibb.co/W4zp9GLW/91-B00-FF2-2-CEE-4-D3-A-A5-A3-A9-A17160-FA04.png",
    stats: { atk: 294, def: 399, hp: 2900, spd: 82 },
    ability: { name: "Restitución Generosa", desc: "Restaura energía a todo el equipo levemente." },
    ultimate: null,
    lore: { story: "Recaudador de impuestos que subió a un árbol para ver a Jesús pasar.", verse: "Lucas 19:8", fact: "Prometió devolver cuatro veces lo que había cobrado de más." },
    synergyTags: [], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 25, 75], owned: false,
  },
  {
    id: "nicodemo_maestro", characterId: "nicodemo_maestro", name: "Nicodemo", version: "Maestro de la Ley",
    rarity: "RARE", role: "control", emoji: "🌙", image: img("nicodemo_maestro"), imageUrl: "https://i.ibb.co/whJZRrK7/211-F10-DA-4-D5-B-4-F65-BDE8-E11-FDD7-A3741.png",
    stats: { atk: 378, def: 357, hp: 2900, spd: 103 },
    ability: { name: "Pregunta Profunda", desc: "Reduce la velocidad del enemigo al hacerlo dudar." },
    ultimate: null,
    lore: { story: "Fariseo y maestro de la ley que visitó a Jesús de noche para aprender de él.", verse: "Juan 3:1-2", fact: "Más tarde defendió a Jesús ante el Sanedrín." },
    synergyTags: [], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 25, 75], owned: false,
  },
  {
    id: "maria_betania", characterId: "maria_betania", name: "María", version: "De Betania",
    rarity: "RARE", role: "healer", emoji: "🌸", image: img("maria_betania"), imageUrl: "https://i.ibb.co/TxGt6D04/608-C1030-1229-41-E7-B9-DF-28-C9-F686-A585.png",
    stats: { atk: 252, def: 378, hp: 3190, spd: 78 },
    ability: { name: "Devoción Total", desc: "Cura una cantidad moderada de vida a un aliado." },
    ultimate: null,
    lore: { story: "Hermana de Marta y Lázaro, ungió los pies de Jesús con perfume costoso.", verse: "Juan 12:3", fact: "Jesús elogió su gesto como un acto que sería recordado siempre." },
    synergyTags: ["mujeres_de_fe"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 25, 75], owned: false,
  },
  {
    id: "lazaro_resucitado", characterId: "lazaro_resucitado", name: "Lázaro", version: "El Resucitado",
    rarity: "RARE", role: "tank", emoji: "⚰️", image: img("lazaro_resucitado"), imageUrl: "https://i.ibb.co/S4f3XrsB/Gemini-Generated-Image-8qwbzk8qwbzk8qwb.png",
    stats: { atk: 294, def: 588, hp: 3480, spd: 70 },
    ability: { name: "Vuelto a la Vida", desc: "Resiste el primer ataque letal en la batalla." },
    ultimate: null,
    lore: { story: "Amigo de Jesús que fue resucitado tras cuatro días de haber muerto.", verse: "Juan 11:43-44", fact: "Su resurrección se convirtió en una de las señales más comentadas de Jesús." },
    synergyTags: [], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 25, 75], owned: false,
  },

  {
    id: "timoteo_discipulo", characterId: "timoteo_discipulo", name: "Timoteo", version: "Joven Discípulo",
    rarity: "RARE", role: "support", emoji: "📘", image: img("timoteo_discipulo"), imageUrl: "https://i.ibb.co/hJFJCXcz/Gemini-Generated-Image-9jawzj9jawzj9jaw.png",
    stats: { atk: 294, def: 399, hp: 2900, spd: 82 },
    ability: { name: "Fe Heredada", desc: "Restaura energía a un aliado joven del equipo." },
    ultimate: null,
    lore: { story: "Joven discípulo y colaborador cercano del apóstol Pablo.", verse: "2 Timoteo 1:5", fact: "Su fe fue transmitida primero por su abuela y su madre." },
    synergyTags: ["apostoles"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 25, 75], owned: false,
  },
  {
    id: "bezaleel_artesano", characterId: "bezaleel_artesano", name: "Bezaleel", version: "Artesano del Tabernáculo",
    rarity: "RARE", role: "buffer", emoji: "🔨", image: img("bezaleel_artesano"), imageUrl: "https://i.ibb.co/3YNqgMfn/Gemini-Generated-Image-mchja5mchja5mchj.png",
    stats: { atk: 315, def: 420, hp: 2900, spd: 78 },
    ability: { name: "Sabiduría Artesanal", desc: "Aumenta el ataque del equipo por un turno." },
    ultimate: null,
    lore: { story: "Artesano lleno del Espíritu de Dios para construir el tabernáculo.", verse: "Éxodo 31:2-3", fact: "Fue el primer hombre en la Biblia descrito como lleno del Espíritu de Dios." },
    synergyTags: ["sacerdotes_levitas"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 25, 75], owned: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ÉPICAS (20)
  // ══════════════════════════════════════════════════════════════
  {
    id: "samuel_profeta", characterId: "samuel_profeta", name: "Samuel", version: "Juez y Profeta",
    rarity: "EPIC", role: "control", emoji: "📯", image: img("samuel_profeta"), imageUrl: "",
    stats: { atk: 468, def: 408, hp: 3400, spd: 106 },
    ability: { name: "Voz del Señor", desc: "Reduce el ataque del enemigo al revelar sus planes." },
    ultimate: null,
    lore: { story: "Último juez y primer gran profeta de Israel, ungió a Saúl y David como reyes.", verse: "1 Samuel 3:19-20", fact: "Escuchó el llamado de Dios siendo aún un niño en el tabernáculo." },
    synergyTags: ["profetas", "reyes_de_israel"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 30, 90], owned: false,
  },
  {
    id: "saul_rey", characterId: "saul_rey", name: "Saúl", version: "Primer Rey",
    rarity: "EPIC", role: "tank", emoji: "👑", image: img("saul_rey"), imageUrl: "",
    stats: { atk: 364, def: 672, hp: 4080, spd: 72 },
    ability: { name: "Primer Trono", desc: "Absorbe parte del daño dirigido a un aliado." },
    ultimate: null,
    lore: { story: "Primer rey de Israel, alto y valiente, aunque su reinado terminó en tragedia.", verse: "1 Samuel 10:23-24", fact: "Fue elegido rey por ser 'de los hombros arriba más alto que el pueblo'." },
    synergyTags: ["reyes_de_israel"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 30, 90], owned: false,
  },
  {
    id: "absalon_rebelde", characterId: "absalon_rebelde", name: "Absalón", version: "El Rebelde",
    rarity: "EPIC", role: "dps", emoji: "⚔️", image: img("absalon_rebelde"), imageUrl: "",
    stats: { atk: 650, def: 408, hp: 3400, spd: 89 },
    ability: { name: "Ambición Real", desc: "Ataque de alto daño que se debilita con el tiempo." },
    ultimate: null,
    lore: { story: "Hijo de David, conocido por su belleza y su intento de tomar el trono.", verse: "2 Samuel 14:25", fact: "Su cabello, símbolo de su fama, terminó siendo su perdición." },
    synergyTags: ["hombres_de_david"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 30, 90], owned: false,
  },
  {
    id: "betsabe_reina", characterId: "betsabe_reina", name: "Betsabé", version: "Reina Madre",
    rarity: "EPIC", role: "support", emoji: "👑", image: img("betsabe_reina"), imageUrl: "",
    stats: { atk: 364, def: 456, hp: 3400, spd: 85 },
    ability: { name: "Influencia Real", desc: "Restaura energía a un aliado y aumenta su ataque." },
    ultimate: null,
    lore: { story: "Esposa de David y madre de Salomón, defendió el trono para su hijo.", verse: "1 Reyes 1:15-17", fact: "Fue una figura clave en asegurar que Salomón heredara el reino." },
    synergyTags: ["hombres_de_david", "reyes_de_israel", "mujeres_de_fe"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 30, 90], owned: false,
  },
  {
    id: "naaman_comandante", characterId: "naaman_comandante", name: "Naamán", version: "Comandante Sanado",
    rarity: "EPIC", role: "tank", emoji: "🛡️", image: img("naaman_comandante"), imageUrl: "",
    stats: { atk: 364, def: 672, hp: 4080, spd: 72 },
    ability: { name: "Siete Zambullidas", desc: "Reduce el daño recibido tras curarse parcialmente." },
    ultimate: null,
    lore: { story: "Comandante sirio sanado de lepra al obedecer al profeta Eliseo.", verse: "2 Reyes 5:14", fact: "Su piel quedó como la de un niño tras sumergirse siete veces en el Jordán." },
    synergyTags: ["profetas"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 30, 90], owned: false,
  },
  {
    id: "jonas_profeta", characterId: "jonas_profeta", name: "Jonás", version: "El Profeta Renuente",
    rarity: "EPIC", role: "control", emoji: "🐋", image: img("jonas_profeta"), imageUrl: "",
    stats: { atk: 468, def: 408, hp: 3400, spd: 106 },
    ability: { name: "Tres Días en las Profundidades", desc: "Aturde al enemigo tras sobrevivir un ataque." },
    ultimate: null,
    lore: { story: "Profeta que huyó de su misión y fue tragado por un gran pez antes de obedecer.", verse: "Jonás 1:17", fact: "Ninguna otra profecía bíblica logró un arrepentimiento tan masivo como la suya." },
    synergyTags: ["profetas"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 30, 90], owned: false,
  },
  {
    id: "job_paciente", characterId: "job_paciente", name: "Job", version: "El Paciente",
    rarity: "EPIC", role: "buffer", emoji: "🌪️", image: img("job_paciente"), imageUrl: "",
    stats: { atk: 390, def: 480, hp: 3400, spd: 81 },
    ability: { name: "Paciencia Inquebrantable", desc: "Aumenta la resistencia del equipo tras sufrir daño." },
    ultimate: null,
    lore: { story: "Hombre íntegro que mantuvo su fe pese a perderlo casi todo.", verse: "Job 1:21", fact: "Al final de su historia, Dios le restauró el doble de lo que había perdido." },
    synergyTags: [], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 30, 90], owned: false,
  },
  {
    id: "balaam_vidente", characterId: "balaam_vidente", name: "Balaam", version: "El Vidente",
    rarity: "EPIC", role: "control", emoji: "🐴", image: img("balaam_vidente"), imageUrl: "",
    stats: { atk: 468, def: 408, hp: 3400, spd: 106 },
    ability: { name: "Bendición Forzada", desc: "Invierte parte del efecto de una maldición enemiga." },
    ultimate: null,
    lore: { story: "Vidente contratado para maldecir a Israel, pero que terminó bendiciéndolo.", verse: "Números 23:11-12", fact: "Su propia burra habló para advertirle del peligro en su camino." },
    synergyTags: ["profetas"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 30, 90], owned: false,
  },
  {
    id: "caleb_guerrero", characterId: "caleb_guerrero", name: "Caleb", version: "Guerrero de Fe",
    rarity: "EPIC", role: "dps", emoji: "⚔️", image: img("caleb_guerrero"), imageUrl: "",
    stats: { atk: 650, def: 408, hp: 3400, spd: 89 },
    ability: { name: "Fe de Conquista", desc: "Ataque de gran potencia contra enemigos fortificados." },
    ultimate: null,
    lore: { story: "Uno de los doce espías que creyó que Israel podía conquistar la tierra prometida.", verse: "Números 14:24", fact: "A los ochenta y cinco años seguía pidiendo territorio para conquistar." },
    synergyTags: ["doce_tribus"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 30, 90], owned: false,
  },
  {
    id: "aaron_sacerdote", characterId: "aaron_sacerdote", name: "Aarón", version: "Sumo Sacerdote",
    rarity: "EPIC", role: "buffer", emoji: "🕯️", image: img("aaron_sacerdote"), imageUrl: "",
    stats: { atk: 390, def: 480, hp: 3400, spd: 81 },
    ability: { name: "Bendición Sacerdotal", desc: "Aumenta la defensa del equipo por un turno." },
    ultimate: null,
    lore: { story: "Hermano de Moisés y primer sumo sacerdote de Israel.", verse: "Números 6:24-26", fact: "Su vara floreció milagrosamente para confirmar su llamado." },
    synergyTags: ["sacerdotes_levitas"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 30, 90], owned: false,
  },

  {
    id: "rahab_espia", characterId: "rahab_espia", name: "Rahab", version: "La de Jericó",
    rarity: "EPIC", role: "support", emoji: "🧵", image: img("rahab_espia"), imageUrl: "",
    stats: { atk: 364, def: 456, hp: 3400, spd: 85 },
    ability: { name: "Cuerda Escarlata", desc: "Protege a un aliado de un ataque enemigo." },
    ultimate: null,
    lore: { story: "Mujer de Jericó que escondió a los espías israelitas y salvó a su familia.", verse: "Josué 2:11-13", fact: "Su fe la llevó a formar parte del linaje de David." },
    synergyTags: ["mujeres_de_fe"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 30, 90], owned: false,
  },

  // ══════════════════════════════════════════════════════════════
  // LEGENDARIAS (15)
  // ══════════════════════════════════════════════════════════════
  {
    id: "gedeon_juez", characterId: "gedeon_juez", name: "Gedeón", version: "Los Trescientos",
    rarity: "LEGENDARY", role: "dps", emoji: "⚔️", image: img("gedeon_juez"), imageUrl: "",
    stats: { atk: 1938, def: 553, hp: 4700, spd: 89 },
    ability: { name: "Trescientos Escogidos", desc: "Ataque devastador con un grupo reducido pero eficaz." },
    ultimate: { name: "Trompetas y Antorchas", desc: "Confunde a todos los enemigos, reduciendo su ataque drásticamente." },
    lore: { story: "Juez de Israel que derrotó a un ejército enemigo con solo trescientos hombres.", verse: "Jueces 7:7", fact: "Dios redujo su ejército a propósito para que la victoria fuera claramente suya." },
    synergyTags: ["jueces"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 50, 150], owned: false,
  },
  {
    id: "debora_jueza", characterId: "debora_jueza", name: "Débora", version: "Jueza y Profetisa",
    rarity: "LEGENDARY", role: "control", emoji: "🌴", image: img("debora_jueza"), imageUrl: "",
    stats: { atk: 1675, def: 553, hp: 4700, spd: 106 },
    ability: { name: "Juicio Bajo la Palmera", desc: "Reduce el ataque y la velocidad del enemigo." },
    ultimate: { name: "Llamado a la Batalla", desc: "Aumenta drásticamente el ataque de todo el equipo por un turno." },
    lore: { story: "Única jueza mujer de Israel, profetisa que guio al pueblo a la victoria en batalla.", verse: "Jueces 4:4-5", fact: "El pueblo acudía a ella para resolver disputas bajo una palmera." },
    synergyTags: ["jueces", "mujeres_de_fe", "profetas"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 50, 150], owned: false,
  },
  {
    id: "ester_reina", characterId: "ester_reina", name: "Ester", version: "Reina de Persia",
    rarity: "LEGENDARY", role: "support", emoji: "👑", image: img("ester_reina"), imageUrl: "",
    stats: { atk: 1525, def: 618, hp: 4700, spd: 85 },
    ability: { name: "Para Esto es el Momento", desc: "Protege a todo el equipo de un ataque crítico." },
    ultimate: { name: "Intercesión Real", desc: "Anula un efecto negativo de todo el equipo." },
    lore: { story: "Reina de Persia que arriesgó su vida para salvar a su pueblo de la destrucción.", verse: "Ester 4:14", fact: "Ayunó tres días antes de presentarse ante el rey sin ser llamada." },
    synergyTags: ["mujeres_de_fe", "reyes_de_israel"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 50, 150], owned: false,
  },

  {
    id: "nehemias_constructor", characterId: "nehemias_constructor", name: "Nehemías", version: "El Constructor",
    rarity: "LEGENDARY", role: "tank", emoji: "🧱", image: img("nehemias_constructor"), imageUrl: "",
    stats: { atk: 1525, def: 910, hp: 5640, spd: 72 },
    ability: { name: "Muralla en 52 Días", desc: "Aumenta drásticamente su propia defensa por varios turnos." },
    ultimate: { name: "Espada en una Mano", desc: "Protege a todo el equipo mientras reconstruye sus defensas." },
    lore: { story: "Copero del rey persa que lideró la reconstrucción de las murallas de Jerusalén.", verse: "Nehemías 6:15-16", fact: "Los trabajadores construían con una mano y sostenían un arma con la otra." },
    synergyTags: [], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 50, 150], owned: false,
  },
  {
    id: "ezequias_rey", characterId: "ezequias_rey", name: "Ezequías", version: "Rey Fiel",
    rarity: "LEGENDARY", role: "buffer", emoji: "👑", image: img("ezequias_rey"), imageUrl: "",
    stats: { atk: 1563, def: 650, hp: 4700, spd: 81 },
    ability: { name: "Oración Extendida", desc: "Aumenta la vida máxima del equipo temporalmente." },
    ultimate: { name: "Ángel Liberador", desc: "Elimina de un solo golpe una amenaza enemiga menor." },
    lore: { story: "Rey de Judá reconocido por su fe y por confiar en Dios ante la invasión asiria.", verse: "2 Reyes 19:15-19", fact: "Su oración llevó a la liberación milagrosa de Jerusalén de un asedio." },
    synergyTags: ["reyes_de_israel"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 50, 150], owned: false,
  },

  {
    id: "pedro_apostol", characterId: "pedro_apostol", name: "Pedro", version: "La Roca",
    rarity: "LEGENDARY", role: "tank", emoji: "🗝️", image: img("pedro_apostol"), imageUrl: "",
    stats: { atk: 1525, def: 910, hp: 5640, spd: 72 },
    ability: { name: "La Roca", desc: "Absorbe una gran parte del daño dirigido al equipo." },
    ultimate: { name: "Llaves del Reino", desc: "Otorga un escudo poderoso a todo el equipo." },
    lore: { story: "Pescador llamado por Jesús, se convirtió en líder de los apóstoles y la iglesia primitiva.", verse: "Mateo 16:18", fact: "Su nombre original era Simón, y Jesús le dio el nombre de 'Pedro', que significa roca." },
    synergyTags: ["apostoles"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 50, 150], owned: false,
  },
  {
    id: "pablo_apostol", characterId: "pablo_apostol", name: "Pablo", version: "Apóstol de las Naciones",
    rarity: "LEGENDARY", role: "control", emoji: "✉️", image: img("pablo_apostol"), imageUrl: "",
    stats: { atk: 1675, def: 553, hp: 4700, spd: 106 },
    ability: { name: "Camino a Damasco", desc: "Convierte parte del ataque enemigo en beneficio propio." },
    ultimate: { name: "Carta a las Iglesias", desc: "Fortalece a todo el equipo con sabiduría y resistencia." },
    lore: { story: "Perseguidor de la iglesia transformado en uno de sus más grandes misioneros y escritores.", verse: "Hechos 9:15", fact: "Escribió gran parte de las cartas que conforman el Nuevo Testamento." },
    synergyTags: ["apostoles"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 50, 150], owned: false,
  },
  {
    id: "juan_bautista", characterId: "juan_bautista", name: "Juan el Bautista", version: "Voz en el Desierto",
    rarity: "LEGENDARY", role: "control", emoji: "🌊", image: img("juan_bautista"), imageUrl: "",
    stats: { atk: 1675, def: 553, hp: 4700, spd: 106 },
    ability: { name: "Voz en el Desierto", desc: "Reduce el ataque del enemigo al anunciar la verdad." },
    ultimate: { name: "Preparad el Camino", desc: "Purifica al equipo, eliminando efectos negativos." },
    lore: { story: "Profeta que preparó el camino para Jesús, bautizando en el río Jordán.", verse: "Mateo 3:3", fact: "Vivía en el desierto y se alimentaba de langostas y miel silvestre." },
    synergyTags: ["profetas"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 50, 150], owned: false,
  },


  {
    id: "jose_gobernador_egipto", characterId: "jose_gobernador_egipto", name: "José", version: "Gobernador de Egipto",
    rarity: "LEGENDARY", role: "healer", emoji: "🌾", image: img("jose_gobernador_egipto"), imageUrl: "",
    stats: { atk: 1450, def: 585, hp: 5170, spd: 81 },
    ability: { name: "Provisión en la Hambruna", desc: "Cura vida a todo el equipo." },
    ultimate: { name: "Perdón a mis Hermanos", desc: "Restaura por completo la vida de todo el equipo." },
    lore: { story: "Vendido como esclavo por sus hermanos, llegó a gobernar Egipto y salvó a su familia del hambre.", verse: "Génesis 45:5", fact: "Perdonó a sus hermanos y los proveyó de alimento durante la hambruna." },
    synergyTags: ["doce_tribus", "patriarcas"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 50, 150], owned: false,
  },



  // ══════════════════════════════════════════════════════════════
  // MÍTICAS (10)
  // ══════════════════════════════════════════════════════════════
  {
    id: "adan_primer_hombre", characterId: "adan_primer_hombre", name: "Adán", version: "El Primer Hombre",
    rarity: "MYTHIC", role: "support", emoji: "🌍", image: img("adan_primer_hombre"), imageUrl: "",
    stats: { atk: 3735, def: 808, hp: 6000, spd: 92 },
    ability: { name: "Aliento de Vida", desc: "Restaura una gran cantidad de vida a un aliado." },
    ultimate: { name: "Imagen y Semejanza", desc: "Otorga a todo el equipo un aumento permanente de estadísticas por la batalla." },
    lore: { story: "El primer hombre, formado del polvo de la tierra y puesto en el jardín del Edén.", verse: "Génesis 2:7", fact: "Fue quien puso nombre a todos los animales del jardín." },
    synergyTags: ["patriarcas"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 80, 240], owned: false,
  },
  {
    id: "elias_profeta", characterId: "elias_profeta", name: "Elías", version: "El Tisbita",
    rarity: "MYTHIC", role: "control", emoji: "🔥", image: img("elias_profeta"), imageUrl: "",
    stats: { atk: 3945, def: 723, hp: 6000, spd: 115 },
    ability: { name: "Fuego del Cielo", desc: "Daño masivo a un enemigo, ignorando parte de su defensa." },
    ultimate: { name: "Carro de Fuego", desc: "Elimina todos los efectos negativos del equipo y aturde a los enemigos." },
    lore: { story: "Profeta poderoso que enfrentó a los profetas de Baal y fue llevado al cielo en un torbellino.", verse: "2 Reyes 2:11", fact: "Nunca experimentó la muerte física, fue llevado al cielo en un carro de fuego." },
    synergyTags: ["profetas"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 80, 240], owned: false,
  },
  {
    id: "sanson_juez", characterId: "sanson_juez", name: "Sansón", version: "Fuerza Nazarea",
    rarity: "MYTHIC", role: "dps", emoji: "💪", image: img("sanson_juez"), imageUrl: "",
    stats: { atk: 3013, def: 723, hp: 6000, spd: 97 },
    ability: { name: "Fuerza Sobrehumana", desc: "Ataque de daño masivo a todos los enemigos." },
    ultimate: { name: "Las Columnas del Templo", desc: "Sacrifica parte de su vida para infligir daño devastador a todos los enemigos." },
    lore: { story: "Juez de Israel dotado de una fuerza extraordinaria por su voto nazareo.", verse: "Jueces 16:28-30", fact: "Su fuerza estaba ligada a un voto que incluía nunca cortarse el cabello." },
    synergyTags: ["jueces"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 80, 240], owned: false,
  },
  {
    id: "eliseo_profeta", characterId: "eliseo_profeta", name: "Eliseo", version: "Doble Porción",
    rarity: "MYTHIC", role: "healer", emoji: "✨", image: img("eliseo_profeta"), imageUrl: "",
    stats: { atk: 3060, def: 765, hp: 6600, spd: 87 },
    ability: { name: "Doble Porción", desc: "Cura una gran cantidad de vida a todo el equipo." },
    ultimate: { name: "Manto del Profeta", desc: "Revive a un aliado caído con una parte de su vida restaurada." },
    lore: { story: "Discípulo y sucesor de Elías, pidió una doble porción de su espíritu profético.", verse: "2 Reyes 2:9-10", fact: "Realizó el doble de milagros registrados que su maestro Elías." },
    synergyTags: ["profetas"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 80, 240], owned: false,
  },
  {
    id: "abraham_patriarca", characterId: "abraham_patriarca", name: "Abraham", version: "Padre de la Fe",
    rarity: "MYTHIC", role: "support", emoji: "⭐", image: img("abraham_patriarca"), imageUrl: "",
    stats: { atk: 3735, def: 808, hp: 6000, spd: 92 },
    ability: { name: "Padre de Multitudes", desc: "Fortalece a todo el equipo con una bendición duradera." },
    ultimate: { name: "Pacto Eterno", desc: "Otorga inmunidad temporal a todo el equipo." },
    lore: { story: "Padre de la fe, llamado por Dios a dejar su tierra y convertirse en padre de una gran nación.", verse: "Génesis 12:2-3", fact: "Su nombre fue cambiado de Abram a Abraham, que significa 'padre de multitudes'." },
    synergyTags: ["patriarcas"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 80, 240], owned: false,
  },
  {
    id: "noe_constructor", characterId: "noe_constructor", name: "Noé", version: "Constructor del Arca",
    rarity: "MYTHIC", role: "tank", emoji: "🌈", image: img("noe_constructor"), imageUrl: "",
    stats: { atk: 3735, def: 1190, hp: 7200, spd: 78 },
    ability: { name: "Arca de Salvación", desc: "Protege a todo el equipo de un ataque devastador." },
    ultimate: { name: "Pacto del Arcoíris", desc: "Otorga un escudo masivo a todo el equipo por varios turnos." },
    lore: { story: "Hombre justo que construyó un arca para salvar a su familia y a los animales del diluvio.", verse: "Génesis 6:9", fact: "Tardó décadas en construir el arca antes de que llegara el diluvio." },
    synergyTags: ["patriarcas"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 80, 240], owned: false,
  },
  {
    id: "isaias_profeta", characterId: "isaias_profeta", name: "Isaías", version: "Visión del Trono",
    rarity: "MYTHIC", role: "buffer", emoji: "📜", image: img("isaias_profeta"), imageUrl: "",
    stats: { atk: 3788, def: 850, hp: 6000, spd: 87 },
    ability: { name: "Visión del Trono", desc: "Aumenta drásticamente el ataque y la defensa del equipo." },
    ultimate: { name: "Consolación de Israel", desc: "Restaura vida y energía a todo el equipo por completo." },
    lore: { story: "Uno de los profetas mayores, anunció con gran detalle la venida del Mesías.", verse: "Isaías 6:8", fact: "Escribió uno de los libros proféticos más extensos de la Biblia." },
    synergyTags: ["profetas"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 80, 240], owned: false,
  },

  {
    id: "salomon_rey", characterId: "salomon_rey", name: "Salomón", version: "Sabiduría Suprema",
    rarity: "MYTHIC", role: "buffer", emoji: "👑", image: img("salomon_rey"), imageUrl: "",
    stats: { atk: 3788, def: 850, hp: 6000, spd: 87 },
    ability: { name: "Sabiduría Suprema", desc: "Otorga a todo el equipo un aumento importante de todas sus estadísticas." },
    ultimate: { name: "Templo de Jerusalén", desc: "Fortalece permanentemente a todo el equipo por el resto de la batalla." },
    lore: { story: "Hijo de David, rey de Israel conocido por pedir sabiduría en lugar de riquezas.", verse: "1 Reyes 3:9,12", fact: "Construyó el primer templo de Jerusalén y fue famoso por su sabiduría." },
    synergyTags: ["reyes_de_israel", "hombres_de_david"], level: 1, maxLevel: 3, fragments: 0, fragmentsNeeded: [0, 80, 240], owned: false,
  },

];