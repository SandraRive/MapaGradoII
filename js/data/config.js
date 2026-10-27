// Configuración del grado y de la parte motivacional.

export const IT = {
  IC: "Ing. de computadores",
  IS: "Ing. del software",
  CO: "Computación",
  TI: "Tecnologías de la información",
  SI: "Sistemas de información",
};

export const TIPOS = { B: "Básica", O: "Obligatoria", Op: "Optativa", TFG: "TFG" };
export const NIVELES_DIFICULTAD = ["", "Muy fácil", "Fácil", "Media", "Difícil", "Muy difícil"];

// Asignaturas reconocidas por el ciclo de DAM (60 créditos).
export const RECONOCIDAS = new Set(["is", "fp", "ter", "pp", "dpoo", "ubd", "dbd", "ie", "pe"]);

export const MATES = ["alg", "ana", "est"];

// Asignaturas que forman cada itinerario (plan de estudios).
export const ITINERARIOS = {
  IC: ["arso", "ac", "aca", "dso", "erc", "srd", "sem", "sd"],
  IS: ["adp", "ded", "is", "iscsd", "ir", "ipo", "pds"],
  CO: ["apc", "ag", "comp", "ded", "gc", "ia", "md", "rc"],
  TI: ["arso", "abd", "ce", "drc", "fsi", "isi", "ipo", "srd"],
  SI: ["fsi", "is", "gp", "gfs", "ie", "isi", "pue", "usi"],
};

// Créditos que hay que reunir en cada bloque (240 en total).
export const BLOQUES = {
  B: { nombre: "Formación básica", creditos: 60 },
  O: { nombre: "Obligatorias", creditos: 96 },
  Op: { nombre: "Optativas (incluye itinerario)", creditos: 72 },
  TFG: { nombre: "Trabajo final de grado", creditos: 12 },
};
export const TOTAL_CREDITOS = 240;

export const NIVELES = [
  [0, "Hola, mundo"],
  [30, "Compilando café"],
  [60, "Depuradora en prácticas"],
  [90, "Arquitecta de bits"],
  [120, "Ecuador del grado"],
  [150, "Domadora de grafos"],
  [180, "TFG desbloqueado"],
  [210, "Última milla"],
  [240, "Ingeniera Informática"],
];

export const HITOS = [[0, "Inicio"], [60, "DAM"], [120, "Mitad"], [180, "TFG"], [240, "Título"]];

export const CESTA_INICIAL = ["imi", "cc", "ipo", "ago", "fco"];

export const COMBOS = [
  {
    nombre: "Febrero 2027: arranque suave",
    texto: "Mi propuesta para empezar. Iniciación a las matemáticas te prepara Álgebra sin sumar riesgo, y el resto son de 1–2. Tres de cinco sin examen o con la EC pesando mucho.",
    ids: CESTA_INICIAL,
  },
  {
    nombre: "Septiembre 2027: entrar en materia",
    texto: "Con la base de mates hecha: Álgebra (la que más rinde de las de mates), Lógica y la rama de computadores, equilibradas con Gestión de proyectos e Inglés I.",
    ids: ["alg", "log", "ec", "gp", "in1"],
  },
  {
    nombre: "Itinerario Sistemas de información",
    texto: "Todo dificultad 2 y sin examen. Con Ingeniería del software e Iniciativa emprendedora reconocidas, este bloque te deja el itinerario casi cerrado.",
    ids: ["fsi", "usi", "gfs", "isi", "pue"],
  },
];

export const CLAVE_GUARDADO = "uoc-mapa-v2";
