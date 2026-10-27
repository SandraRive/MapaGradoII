// Ranking de asignaturas con filtros.
import { S, byId } from "../data/asignaturas.js";
import { IT, TIPOS, NIVELES_DIFICULTAD, RECONOCIDAS } from "../data/config.js";
import { state, hecha, dificultad } from "../core/state.js";
import { esc, colorDificultad, creditosDe, $ } from "../core/utils.js";

function evaluacionHTML(s) {
  if (s.ev === "EC")
    return `<span class="evwrap"><span class="evbar"><span style="width:100%"></span><span style="width:0"></span></span>100 % EC</span>`;
  if (s.ev === "PF")
    return `<span class="evwrap"><span class="evbar"><span style="width:${s.ec}%"></span><span style="width:${s.pf}%"></span></span>EC ${s.ec} · PF ${s.pf} (mín. 4)</span>`;
  return `<span class="evwrap">evaluación por confirmar</span>`;
}

const nombreReq = (h) => `${byId[h].n}${hecha(h) ? " ✓" : ""}`;

function pasaFiltros(s) {
  const f = state.filtros;
  const q = f.busqueda.trim().toLowerCase();
  return (
    (f.verTodo || !hecha(s.id)) &&
    (f.tipo === "all" || s.t === f.tipo || (f.tipo === "Op" && s.t === "TFG")) &&
    (f.evaluacion === "all" || s.ev === f.evaluacion) &&
    (!q || s.n.toLowerCase().includes(q) || s.c.includes(q))
  );
}

function fila(s) {
  const d = dificultad(s);
  const enCesta = state.cesta.has(s.id);
  const esRec = RECONOCIDAS.has(s.id);
  const esOk = state.aprobadas.has(s.id);

  const tags = [`<span class="tag">${TIPOS[s.t]} · ${creditosDe(s)} cr.</span>`];
  (s.it || []).forEach((i) => tags.push(`<span class="tag">${IT[i]}</span>`));
  if (s.sem) tags.push(`<span class="tag">solo ${s.sem}</span>`);
  if (s.nf && !esRec) tags.push(`<span class="tag warn">sin ficha en el PDF</span>`);
  if (s.m && !esRec) tags.push(`<span class="tag m">mates${state.perfilMates ? " · +1 por tu perfil" : ""}</span>`);
  if (s.hard) tags.push(`<span class="tag ${s.hard.every(hecha) ? "ok" : "warn"}">exige aprobada: ${s.hard.map(nombreReq).join(", ")}</span>`);
  if (s.req && !esRec) tags.push(`<span class="tag">antes, mejor: ${s.req.map(nombreReq).join(", ")}</span>`);

  let acciones;
  if (esRec) acciones = `<span class="recbox">Reconocida · DAM</span>`;
  else if (s.blk) acciones = `<span class="recbox" style="color:var(--muted);border-color:var(--line)">No disponible</span>`;
  else
    acciones =
      (esOk ? "" : `<button class="add" data-id="${s.id}" aria-pressed="${enCesta}">${enCesta ? "En cesta ✓" : "+ Matricular"}</button>`) +
      `<button class="pass" data-pass="${s.id}" aria-pressed="${esOk}">${esOk ? "Aprobada ✓" : "Marcar aprobada"}</button>`;

  const texto = esRec
    ? "La tienes reconocida por el ciclo de DAM."
    : s.blk
    ? esc(s.blk)
    : `${esc(s.why)} <span class="tip">${esc(s.tip)}</span>`;

  return `<article class="row${esRec || esOk || s.blk ? " done" : ""}" style="--c:${colorDificultad(d)}">
    <div class="score">
      <span class="num">${esRec ? "✓" : d}</span>
      <span class="bar5">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= d ? "on" : ""}"></i>`).join("")}</span>
      <span class="lbl">${esRec ? "Hecha" : NIVELES_DIFICULTAD[d]}</span>
    </div>
    <div style="min-width:0">
      <div class="title"><h3>${esc(s.n)}</h3><span class="code">${s.c}</span></div>
      <div class="tags">${esRec ? "" : evaluacionHTML(s)}${tags.join("")}</div>
    </div>
    <div class="acts">${acciones}</div>
    <p class="why">${texto}</p>
  </article>`;
}

export function renderRanking() {
  const signo = state.filtros.orden === "asc" ? 1 : -1;
  const lista = S.filter(pasaFiltros).sort(
    (a, b) =>
      hecha(a.id) - hecha(b.id) ||
      !!a.blk - !!b.blk ||
      signo * (dificultad(a) - dificultad(b)) ||
      a.n.localeCompare(b.n, "es")
  );
  $("list").innerHTML = lista.length
    ? lista.map(fila).join("")
    : `<div class="empty">Ninguna asignatura con esos filtros. Prueba a quitar alguno.</div>`;
}
