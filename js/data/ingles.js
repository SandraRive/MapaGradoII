// English B1 annual (UOC, 00.175) — datos del plan docente 2026-1.
// Los recursos marcados (CAT) en el plan están omitidos: solo se listan una vez.

export const INGLES = {
  codigo: "00.175",
  nombre: "English B1 annual",
  inicio: "2026-10-14",
  fin: "2027-06-30",
  creditos: "4 cr. por semestre · 8 ECTS en todo el curso",
  ec: 70,
  pf: 30,
};

export const REGLAS = [
  { t: "Las 11 unidades cuentan", d: "Si no haces una sola, suspendes el curso aunque hayas aprobado las otras 10." },
  { t: "Nunca 3 semanas parada", d: "Tres semanas seguidas sin participar en la EC = suspenso. Tampoco puedes faltar las tres primeras." },
  { t: "Speaking y writing, los dos", d: "Si una actividad tiene parte oral y escrita, hay que aprobar ambas. Si no, cuenta la nota más baja." },
  { t: "Nada de IA ni traductores", d: "Todo texto y grabación debe ser tuyo. Detectarlo es suspenso directo del curso." },
  { t: "Cámara y cara visible", d: "Las tareas orales se entregan en vídeo mostrando la cara. Necesitas webcam y micrófono." },
  { t: "Trabajo en parejas", d: "Los Tandem se graban con un compañero: reserva tiempo para coordinaros." },
  { t: "Máx. 2 entregas por semana", d: "El profesorado no corrige más de dos actividades entregadas en el mismo periodo de 7 días." },
  { t: "Examen sin apoyos", d: "En la prueba final no se permite diccionario ni consultar materiales ni tus propias actividades." },
];

export const PRUEBA_FINAL = [
  ["Reading", 25],
  ["Listening", 25],
  ["Writing", 25],
  ["Speaking", 25],
];

// tipo: task · tandem · quiz
export const ACTIVIDADES = [
  { id: "ca1t1", n: "CA1 Task 1", tipo: "task", ini: "2026-10-22", fin: "2026-10-28" },
  { id: "ca1t2", n: "CA1 Task 2", tipo: "task", ini: "2026-10-29", fin: "2026-11-05" },
  { id: "ca2t1", n: "CA2 Task 1", tipo: "task", ini: "2026-11-09", fin: "2026-11-15" },
  { id: "ca2t2", n: "CA2 Task 2", tipo: "task", ini: "2026-11-16", fin: "2026-11-22" },
  { id: "ca3t3", n: "CA3 Task 3", tipo: "task", ini: "2026-12-10", fin: "2026-12-13" },
  { id: "ca4", n: "CA4 Tandem", tipo: "tandem", ini: "2026-12-24", fin: "2027-01-10" },
  { id: "ca5t1", n: "CA5 Task 1", tipo: "task", ini: "2027-01-15", fin: "2027-01-22" },
  { id: "lq1", n: "Listening Quiz: Moviegoers", tipo: "quiz", ini: "2027-01-11", fin: "2027-01-31" },
  { id: "ca5t2", n: "CA5 Task 2", tipo: "task", ini: "2027-01-23", fin: "2027-01-31" },
  { id: "ca6", n: "CA6 Tandem", tipo: "tandem", ini: "2027-02-11", fin: "2027-02-21" },
  { id: "rq1", n: "Reading Quiz: Healthy Living", tipo: "quiz", ini: "2027-02-01", fin: "2027-02-21" },
  { id: "ca7t1", n: "CA7 Task 1", tipo: "task", ini: "2027-02-26", fin: "2027-03-05" },
  { id: "ca7t2", n: "CA7 Task 2", tipo: "task", ini: "2027-03-06", fin: "2027-03-14" },
  { id: "ca8t1", n: "CA8 Task 1", tipo: "task", ini: "2027-03-19", fin: "2027-03-30" },
  { id: "ca8t2", n: "CA8 Task 2", tipo: "task", ini: "2027-03-31", fin: "2027-04-08" },
  { id: "ca9t3", n: "CA9 Task 3", tipo: "task", ini: "2027-04-23", fin: "2027-04-25" },
  { id: "lq2", n: "Listening Quiz: Technology", tipo: "quiz", ini: "2027-04-09", fin: "2027-04-25" },
  { id: "ca10", n: "CA10 Tandem", tipo: "tandem", ini: "2027-05-03", fin: "2027-05-09" },
  { id: "rq2", n: "Reading Quiz: House-Hunting", tipo: "quiz", ini: "2027-05-10", fin: "2027-05-30" },
  { id: "ca11", n: "CA11 Tandem", tipo: "tandem", ini: "2027-05-20", fin: "2027-05-30" },
];

// Recursos de aprendizaje (versión ES; las versiones (CAT) no se incluyen)
export const UNIDADES = [
  "Crime Watch",
  "Friends and social networks",
  "Healthy living",
  "House - hunting",
  "Money, money, money",
  "Moviegoers",
  "Technology",
  "The food experience",
  "The right job",
  "The world of television",
  "Travelling the globe",
];

export const HERRAMIENTAS = ["Grammar", "English Toolkit", "Pronunciation Module"];
