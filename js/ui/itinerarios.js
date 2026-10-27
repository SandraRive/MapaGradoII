// Comparativa de itinerarios y combinaciones propuestas.
import { byId } from "../data/asignaturas.js";
import { IT, ITINERARIOS, COMBOS } from "../data/config.js";
import { hecha, dificultad } from "../core/state.js";
import { esc, fmt, colorDificultad, $ } from "../core/utils.js";

export function renderItinerarios() {
  const filas = Object.entries(ITINERARIOS)
    .map(([k, ids]) => {
      const todas = ids.map((i) => byId[i]);
      const resto = todas.filter((s) => !hecha(s.id));
      const media = resto.length ? resto.reduce((x, s) => x + dificultad(s), 0) / resto.length : 0;
      const sinExamen = resto.filter((s) => s.ev === "EC").length;
      const masDura = resto.slice().sort((x, y) => dificultad(y) - dificultad(x))[0];
      return { k, media, sinExamen, total: todas.length, tienes: todas.length - resto.length, quedan: resto.length, masDura };
    })
    .sort((x, y) => x.media - y.media);

  $("itins").innerHTML = filas
    .map(
      (r) => `<div class="itin">
        <div>
          <b style="font-family:var(--f-display)">${IT[r.k]}</b>
          <small>Ya tienes ${r.tienes} de ${r.total} · ${r.sinExamen} de las ${r.quedan} restantes sin examen${r.masDura ? ` · la más dura: ${esc(r.masDura.n)}` : ""}</small>
        </div>
        <div class="track"><span style="width:${(r.media / 5) * 100}%;background:${colorDificultad(r.media)}"></span></div>
        <b>${r.quedan ? fmt(r.media) : "✓"}</b>
      </div>`
    )
    .join("");
}

export function renderCombos() {
  $("combos").innerHTML = COMBOS.map(
    (c, i) => `<div class="combo">
      <h3>${c.nombre}</h3>
      <p>${c.texto}</p>
      <ol>${c.ids.map((id) => `<li>${esc(byId[id].n)} <span class="code">(${dificultad(byId[id])})</span></li>`).join("")}</ol>
      <button class="add" data-combo="${i}">Cargar en la cesta</button>
    </div>`
  ).join("");
}
