// Apartado del curso English B1 annual: reglas, calendario de entregas y recursos.
import { INGLES, REGLAS, PRUEBA_FINAL, ACTIVIDADES, UNIDADES, HERRAMIENTAS } from "../data/ingles.js";
import { state } from "../core/state.js";
import { esc, $ } from "../core/utils.js";

const DIA = 86400000;
const fecha = (iso) => new Date(iso + "T23:59:59");
const corta = (iso) =>
  new Date(iso + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" }).replace(".", "");
const TIPO = { task: "Task", tandem: "Tandem", quiz: "Quiz" };

function hoy() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function estado(a, ahora) {
  if (state.ingles.has(a.id)) return "hecha";
  const fin = fecha(a.fin);
  const ini = new Date(a.ini + "T00:00:00");
  if (fin < ahora) return "atrasada";
  if (ini <= ahora) return "abierta";
  return "futura";
}

export function renderIngles() {
  const ahora = hoy();
  const lista = ACTIVIDADES.slice().sort((a, b) => a.fin.localeCompare(b.fin) || a.ini.localeCompare(b.ini));
  const hechas = lista.filter((a) => state.ingles.has(a.id)).length;
  const proxima = lista.find((a) => !state.ingles.has(a.id) && fecha(a.fin) >= ahora);
  const atrasadas = lista.filter((a) => estado(a, ahora) === "atrasada").length;

  // Cabecera: próxima entrega
  let prox = `<b>Curso completado</b>`;
  if (proxima) {
    const dias = Math.round((fecha(proxima.fin) - ahora) / DIA);
    const cuando = dias <= 0 ? "hoy" : dias === 1 ? "mañana" : `en ${dias} días`;
    prox = `<span class="eyebrow">Próxima entrega</span><b>${esc(proxima.n)}</b><span class="ing-when${dias <= 3 ? " urgent" : ""}">${cuando} · ${corta(proxima.fin)}</span>`;
  }
  $("ing-next").innerHTML = prox;
  $("ing-count").textContent = `${hechas}/${lista.length}`;
  $("ing-bar").style.width = (hechas / lista.length) * 100 + "%";
  $("ing-late").textContent = atrasadas ? `${atrasadas} con la fecha pasada sin marcar` : "";
  $("ing-late").hidden = !atrasadas;

  // Calendario agrupado por mes de entrega
  const meses = {};
  lista.forEach((a) => {
    const k = a.fin.slice(0, 7);
    (meses[k] ||= []).push(a);
  });
  $("ing-timeline").innerHTML = Object.entries(meses)
    .map(([k, acts]) => {
      const nombreMes = new Date(k + "-15T12:00:00").toLocaleDateString("es-ES", { month: "long", year: "numeric" });
      return `<div class="ing-month">
        <div class="ing-month-n">${nombreMes}</div>
        <div class="ing-acts">${acts
          .map((a) => {
            const st = estado(a, ahora);
            const esProx = proxima && a.id === proxima.id;
            return `<button class="ing-act ${st}${esProx ? " next" : ""}" data-ing="${a.id}" aria-pressed="${st === "hecha"}">
              <span class="ing-check" aria-hidden="true">${st === "hecha" ? "✓" : ""}</span>
              <span class="ing-name">${esc(a.n)}</span>
              <span class="ing-meta"><span class="ing-type ${a.tipo}">${TIPO[a.tipo]}</span>${corta(a.ini)} → <b>${corta(a.fin)}</b></span>
            </button>`;
          })
          .join("")}</div>
      </div>`;
    })
    .join("");
}

// Partes estáticas: se pintan una vez
export function initIngles() {
  $("ing-rules").innerHTML = REGLAS.map((r) => `<div class="ing-rule"><b>${esc(r.t)}</b><span>${esc(r.d)}</span></div>`).join("");
  $("ing-pf").innerHTML = PRUEBA_FINAL.map(
    ([n, p]) => `<div class="ing-skill"><span>${n}</span><div class="ing-skill-bar"><i style="width:${p * 4}%"></i></div><b>${p} %</b></div>`
  ).join("");
  const quizzes = new Set(ACTIVIDADES.filter((a) => a.tipo === "quiz").map((a) => a.n.split(": ")[1].toLowerCase().replace(/\s|-/g, "")));
  $("ing-units").innerHTML =
    UNIDADES.map((u) => {
      const q = quizzes.has(u.toLowerCase().replace(/\s|-/g, ""));
      return `<span class="ing-unit${q ? " quiz" : ""}">${esc(u)}${q ? " · quiz" : ""}</span>`;
    }).join("") +
    HERRAMIENTAS.map((h) => `<span class="ing-unit tool">${esc(h)}</span>`).join("");
  $("ing-ec").style.width = INGLES.ec + "%";
  $("ing-pfw").style.width = INGLES.pf + "%";
}
