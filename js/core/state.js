// Estado de la aplicación y guardado en el navegador (localStorage).
import { byId } from "../data/asignaturas.js";
import { RECONOCIDAS, CESTA_INICIAL, CLAVE_GUARDADO } from "../data/config.js";

export const state = {
  filtros: { tipo: "all", evaluacion: "all", orden: "asc", busqueda: "", verTodo: false },
  perfilMates: true,
  cesta: new Set(CESTA_INICIAL),
  aprobadas: new Set(),
  ingles: new Set(), // actividades del curso de inglés entregadas
  esEjemplo: true,
};

export const hecha = (id) => RECONOCIDAS.has(id) || state.aprobadas.has(id);

export const dificultad = (s) => (state.perfilMates && s.m ? Math.min(5, s.d + 1) : s.d);

export function guardar() {
  const datos = {
    aprobadas: [...state.aprobadas],
    cesta: [...state.cesta],
    perfilMates: state.perfilMates,
    ingles: [...state.ingles],
  };
  try {
    localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(datos));
  } catch (e) {
    /* modo privado o almacenamiento bloqueado: se sigue sin guardar */
  }
}

export function cargar() {
  let datos = null;
  try {
    datos = JSON.parse(localStorage.getItem(CLAVE_GUARDADO) || "null");
  } catch (e) {
    return;
  }
  if (!datos) return;
  // Compatibilidad con el formato antiguo (apr / cart / p)
  const apr = datos.aprobadas || datos.apr;
  const cesta = datos.cesta || datos.cart;
  const perfil = datos.perfilMates ?? datos.p;
  if (Array.isArray(apr)) state.aprobadas = new Set(apr.filter((x) => byId[x] && !RECONOCIDAS.has(x)));
  if (Array.isArray(cesta)) {
    state.cesta = new Set(cesta.filter((x) => byId[x] && !hecha(x)));
    state.esEjemplo = false;
  }
  if (typeof perfil === "boolean") state.perfilMates = perfil;
  if (Array.isArray(datos.ingles)) state.ingles = new Set(datos.ingles);
}
