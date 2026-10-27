// Utilidades pequeñas compartidas por la interfaz.

export const esc = (x) =>
  String(x).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));

export const fmt = (n) => n.toFixed(1).replace(".", ",");

export const colorDificultad = (d) => `var(--d${Math.max(1, Math.min(5, Math.round(d)))})`;

export const creditosDe = (s) => s.cr || 6;

export const $ = (id) => document.getElementById(id);
