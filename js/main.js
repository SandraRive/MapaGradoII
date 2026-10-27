// Punto de entrada: carga el progreso guardado, pinta la página y gestiona los clics.
import { COMBOS } from "./data/config.js";
import { state, hecha, guardar, cargar } from "./core/state.js";
import { $ } from "./core/utils.js";
import { renderMarcador } from "./ui/marcador.js";
import { renderRanking } from "./ui/ranking.js";
import { renderCesta } from "./ui/cesta.js";
import { renderItinerarios, renderCombos } from "./ui/itinerarios.js";
import { initHero, updateHero } from "./ui/hero.js";

function renderTodo() {
  renderRanking();
  renderMarcador();
  renderCesta();
  renderItinerarios();
  renderCombos();
  updateHero();
  $("perfil").setAttribute("aria-pressed", state.perfilMates);
  $("vertodo").setAttribute("aria-pressed", state.filtros.verTodo);
}

function marcarGrupo(selector, boton) {
  document.querySelectorAll(selector).forEach((x) => x.setAttribute("aria-pressed", x === boton));
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const { cesta, aprobadas, filtros } = state;
  const ds = b.dataset;

  // Filtros: solo repintan el ranking
  if (ds.t) { filtros.tipo = ds.t; marcarGrupo("[data-t]", b); return renderRanking(); }
  if (ds.e) { filtros.evaluacion = ds.e; marcarGrupo("[data-e]", b); return renderRanking(); }
  if (ds.o) { filtros.orden = ds.o; marcarGrupo("[data-o]", b); return renderRanking(); }
  if (b.id === "vertodo") { filtros.verTodo = !filtros.verTodo; return renderTodo(); }
  if (b.id === "perfil") { state.perfilMates = !state.perfilMates; guardar(); return renderTodo(); }

  // Acciones que cambian el progreso o la cesta
  if (ds.id) {
    cesta.has(ds.id) ? cesta.delete(ds.id) : cesta.add(ds.id);
  } else if (ds.pass) {
    if (aprobadas.has(ds.pass)) aprobadas.delete(ds.pass);
    else { aprobadas.add(ds.pass); cesta.delete(ds.pass); }
  } else if (ds.rm) {
    cesta.delete(ds.rm);
  } else if (ds.combo) {
    state.cesta = new Set(COMBOS[+ds.combo].ids.filter((x) => !hecha(x)));
  } else {
    return;
  }
  state.esEjemplo = false;
  guardar();
  renderTodo();
});

$("q").addEventListener("input", (e) => {
  state.filtros.busqueda = e.target.value;
  renderRanking();
});

cargar();
initHero();
renderTodo();
