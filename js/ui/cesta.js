// Simulador de matrícula: veredicto, estadísticas y avisos de requisitos.
import { byId } from "../data/asignaturas.js";
import { MATES } from "../data/config.js";
import { state, hecha, dificultad } from "../core/state.js";
import { calcularCreditos } from "../core/progreso.js";
import { esc, fmt, colorDificultad, creditosDe, $ } from "../core/utils.js";

function veredicto(carga, dificiles, vacia) {
  if (vacia) return ["Cesta vacía", "var(--muted)"];
  if (carga <= 10 && dificiles <= 1) return ["Semestre cómodo", "var(--d1)"];
  if (carga <= 15 && dificiles <= 2) return ["Exigente pero asumible", "var(--d3)"];
  return ["Demasiado arriesgado", "var(--d5)"];
}

function avisos(lista, creditos, examenes, dificiles) {
  const { cesta, aprobadas } = state;
  const fuertes = [];
  const suaves = [];

  if (dificiles >= 3) fuertes.push(`${dificiles} asignaturas de dificultad 4 o 5 a la vez. Mi regla: máximo dos por semestre.`);
  if (creditos > 30) fuertes.push(`${creditos} créditos es más que un semestre a tiempo completo. Compaginando con la oposición, 18–24 es más realista.`);
  if (cesta.has("imi") && MATES.some((x) => cesta.has(x))) fuertes.push("Iniciación a las matemáticas no se puede cursar a la vez que Álgebra, Análisis o Estadística.");
  if (cesta.has("imi") && MATES.some((x) => aprobadas.has(x))) fuertes.push("Iniciación a las matemáticas ya no se puede matricular si has aprobado Álgebra, Análisis o Estadística.");
  if (cesta.has("tfg") && calcularCreditos(false).real < 180) fuertes.push("El TFG pide tener 180 créditos aprobados antes de matricularlo.");

  lista.forEach((s) => {
    (s.hard || []).forEach((h) => {
      if (!hecha(h)) fuertes.push(`${s.n} exige tener ya aprobada ${byId[h].n}.`);
    });
    const juntas = (s.req || []).filter((h) => cesta.has(h));
    const faltan = (s.req || []).filter((h) => !hecha(h) && !cesta.has(h));
    if (juntas.length) fuertes.push(`${s.n} se recomienda después de ${juntas.map((h) => byId[h].n).join(" y ")}, y las tienes juntas.`);
    if (faltan.length) suaves.push(`${s.n}: antes conviene ${faltan.map((h) => byId[h].n).join(", ")}.`);
  });

  if (examenes >= 4) fuertes.push(`${examenes} exámenes finales: revisa que las fechas no se te junten con la oposición.`);
  return { fuertes, suaves };
}

export function renderCesta() {
  const lista = [...state.cesta].map((id) => byId[id]);
  const creditos = lista.reduce((a, s) => a + creditosDe(s), 0);
  const examenes = lista.filter((s) => s.ev === "PF").length;
  const media = lista.length ? lista.reduce((a, s) => a + dificultad(s), 0) / lista.length : 0;
  const dificiles = lista.filter((s) => dificultad(s) >= 4).length;
  const carga = lista.reduce((a, s) => a + (dificultad(s) * creditosDe(s)) / 6, 0);

  $("s-cr").textContent = creditos;
  $("s-ex").textContent = examenes;
  $("s-avg").textContent = lista.length ? fmt(media) : "–";

  const [texto, color] = veredicto(carga, dificiles, !lista.length);
  $("verdict").textContent = texto;
  $("verdict").style.color = color;
  $("meter").style.width = Math.min(100, (carga / 20) * 100) + "%";
  $("meter").style.background = color;

  $("cart").innerHTML = lista.length
    ? lista
        .slice()
        .sort((a, b) => dificultad(b) - dificultad(a))
        .map(
          (s) =>
            `<li><span><b style="color:${colorDificultad(dificultad(s))};font-family:var(--f-display)">${dificultad(s)}</b> ${esc(s.n)}</span>` +
            `<button data-rm="${s.id}" aria-label="Quitar ${esc(s.n)}">quitar</button></li>`
        )
        .join("")
    : `<li class="note">Pulsa «+ Matricular» en cualquier asignatura.</li>`;

  const { fuertes, suaves } = avisos(lista, creditos, examenes, dificiles);
  $("alerts").innerHTML =
    fuertes.length || suaves.length
      ? fuertes.map((a) => `<div class="alert">${esc(a)}</div>`).join("") +
        suaves.map((a) => `<div class="alert soft">${esc(a)}</div>`).join("")
      : lista.length
      ? `<div class="alert ok">Sin choques de requisitos ni incompatibilidades.</div>`
      : "";

  $("cart-note").hidden = !state.esEjemplo;
}
