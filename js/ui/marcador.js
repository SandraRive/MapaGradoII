// Marcador motivacional: anillo de créditos, nivel, hitos, bloques y logros.
import { BLOQUES, NIVELES, HITOS, MATES, TOTAL_CREDITOS } from "../data/config.js";
import { byId } from "../data/asignaturas.js";
import { state } from "../core/state.js";
import { calcularCreditos, nivelDe } from "../core/progreso.js";
import { $ } from "../core/utils.js";

const pct = (n) => (n / TOTAL_CREDITOS) * 100;

export function renderMarcador() {
  const C = calcularCreditos(true);
  const { real, proyectado } = C;

  $("ring").style.background =
    `conic-gradient(var(--accent) 0 ${pct(real) * 3.6}deg, ` +
    `color-mix(in srgb,var(--accent) 30%,var(--soft)) 0 ${pct(proyectado) * 3.6}deg, var(--soft) 0)`;
  $("r-num").textContent = real;

  const li = nivelDe(real);
  const actual = NIVELES[li];
  const siguiente = NIVELES[li + 1];
  $("lvl-n").textContent = `Nivel ${li + 1} de ${NIVELES.length} · ${Math.round(pct(real))} % del grado`;
  $("lvl-name").textContent = actual[1];

  if (siguiente) {
    const tramo = siguiente[0] - actual[0];
    $("xp-r").style.width = ((real - actual[0]) / tramo) * 100 + "%";
    $("xp-g").style.width = Math.min(100, ((proyectado - actual[0]) / tramo) * 100) + "%";
    const lp = nivelDe(proyectado);
    let texto = `Te faltan ${siguiente[0] - real} créditos para «${siguiente[1]}».`;
    if (proyectado > real) {
      texto += ` Si apruebas tu cesta llegas a ${proyectado}`;
      texto += lp > li ? ` y subes a «${NIVELES[lp][1]}».` : ".";
    }
    $("lvl-next").textContent = texto;
  } else {
    $("xp-r").style.width = "100%";
    $("lvl-next").textContent = "Grado terminado. Enhorabuena, ingeniera.";
  }

  const quedan = TOTAL_CREDITOS - real;
  $("eta").innerHTML = quedan
    ? `<span class="chip">Quedan ${quedan} créditos</span>` +
      `<span class="chip">≈ ${Math.ceil(quedan / 30)} semestres a 30 cr.</span>` +
      `<span class="chip">≈ ${Math.ceil(quedan / 18)} semestres a 18 cr.</span>`
    : "";

  $("road").innerHTML =
    `<div class="base"></div>` +
    `<div class="ghost" style="left:${pct(real)}%;width:${pct(proyectado - real)}%"></div>` +
    `<div class="fill" style="width:${pct(real)}%"></div>` +
    HITOS.map(
      (m) => `<div class="ms${real >= m[0] ? " on" : ""}" style="left:${pct(m[0])}%"><i></i><span>${m[1]}<br>${m[0]}</span></div>`
    ).join("");

  $("blocks").innerHTML = Object.entries(BLOQUES)
    .map(([k, { nombre, creditos }]) => {
      const b = C.porBloque[k];
      return `<div class="blk">
        <div class="blk-h"><span>${nombre}</span><b>${b.rec + b.ok}/${creditos}</b></div>
        <div class="stack">
          <span style="width:${(b.rec / creditos) * 100}%;background:var(--rec)"></span>
          <span style="width:${(b.ok / creditos) * 100}%;background:var(--d1)"></span>
          <span style="width:${(b.cur / creditos) * 100}%;background:var(--accent);opacity:.35"></span>
        </div>
      </div>`;
    })
    .join("");

  const conExamen = [...state.aprobadas].filter((id) => byId[id].ev === "PF").length;
  const basica = C.porBloque.B.rec + C.porBloque.B.ok;
  const logros = [
    ["DAM convalidado", "60 créditos de salida", true],
    ["Primera de la UOC", "Aprueba tu primera asignatura", state.aprobadas.size >= 1],
    ["Sin miedo al examen", "Aprueba 3 con prueba final", conExamen >= 3],
    ["Mates domadas", "Álgebra, Análisis y Estadística", MATES.every((x) => state.aprobadas.has(x))],
    ["Base completa", "Las 60 de formación básica", basica >= 60],
    ["Ecuador", "120 créditos", real >= 120],
    ["TFG a la vista", "180 créditos y Gestión de proyectos", real >= 180 && state.aprobadas.has("gp")],
    ["Ingeniera", "240 créditos", real >= 240],
  ];
  $("badges").innerHTML = logros
    .map(([t, d, on]) => `<div class="badge${on ? " on" : ""}"><b>${on ? "★" : "☆"} ${t}</b>${d}</div>`)
    .join("");
}
