// Cálculo de créditos y niveles.
import { S } from "../data/asignaturas.js";
import { RECONOCIDAS, BLOQUES, NIVELES } from "../data/config.js";
import { state } from "./state.js";
import { creditosDe } from "./utils.js";

/**
 * Créditos por bloque: reconocidos (rec), aprobados en la UOC (ok) y en la cesta (cur).
 * Cada bloque se limita a los créditos que pide el plan.
 */
export function calcularCreditos(incluirCesta = true) {
  const porBloque = {};
  for (const k in BLOQUES) porBloque[k] = { rec: 0, ok: 0, cur: 0 };

  S.forEach((s) => {
    const b = porBloque[s.t];
    if (RECONOCIDAS.has(s.id)) b.rec += creditosDe(s);
    else if (state.aprobadas.has(s.id)) b.ok += creditosDe(s);
    else if (incluirCesta && state.cesta.has(s.id)) b.cur += creditosDe(s);
  });

  let real = 0;
  let proyectado = 0;
  for (const k in porBloque) {
    const b = porBloque[k];
    const tope = BLOQUES[k].creditos;
    const conseguidos = Math.min(tope, b.rec + b.ok);
    b.rec = Math.min(b.rec, tope);
    b.ok = conseguidos - b.rec;
    b.cur = Math.min(tope - conseguidos, b.cur);
    real += conseguidos;
    proyectado += conseguidos + b.cur;
  }
  return { porBloque, real, proyectado };
}

export function nivelDe(creditos) {
  let i = 0;
  NIVELES.forEach((n, k) => {
    if (creditos >= n[0]) i = k;
  });
  return i;
}
