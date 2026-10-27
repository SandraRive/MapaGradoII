// Hero: dibuja el grado como una placa de circuito.
// Cada nodo es una asignatura; cada pista, un requisito. Las columnas son
// la "profundidad" de requisitos (lo que se desbloquea antes, a la izquierda).
import { S, byId } from "../data/asignaturas.js";
import { RECONOCIDAS, NIVELES, TOTAL_CREDITOS } from "../data/config.js";
import { state } from "../core/state.js";
import { calcularCreditos, nivelDe } from "../core/progreso.js";
import { $ } from "../core/utils.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let canvas, ctx, nodes = [], edges = [], colors = {}, visible = true, raf = 0, w = 0, h = 0;

// --- Profundidad de requisitos (columna de cada asignatura) ---
const depthCache = {};
function depth(id, seen = new Set()) {
  if (depthCache[id] !== undefined) return depthCache[id];
  if (seen.has(id)) return 0;
  seen.add(id);
  const s = byId[id];
  const reqs = [...(s.req || []), ...(s.hard || [])].filter((r) => byId[r]);
  const d = reqs.length ? 1 + Math.max(...reqs.map((r) => depth(r, seen))) : 0;
  return (depthCache[id] = d);
}

function readColors() {
  const cs = getComputedStyle(document.documentElement);
  const v = (n) => cs.getPropertyValue(n).trim();
  colors = { rec: v("--h-rec"), ok: v("--h-ok"), cart: v("--h-cart"), todo: v("--h-todo"), trace: v("--h-trace"), glow: v("--h-glow") };
}

function statusOf(id) {
  if (RECONOCIDAS.has(id)) return "rec";
  if (state.aprobadas.has(id)) return "ok";
  if (state.cesta.has(id)) return "cart";
  return "todo";
}

// --- Maquetación: posiciones de nodos y pistas ortogonales ---
function layout() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  w = rect.width; h = rect.height;
  canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const wide = w > 700;
  const x0 = wide ? w * 0.47 : w * 0.05;
  const x1 = w * 0.965;
  const y0 = 34, y1 = h - 34;

  const cols = {};
  S.forEach((s) => { const d = depth(s.id); (cols[d] ||= []).push(s); });
  const maxD = Math.max(...Object.keys(cols).map(Number));

  nodes = [];
  const pos = {};
  Object.entries(cols).forEach(([d, list]) => {
    list.sort((a, b) => a.t.localeCompare(b.t) || a.id.localeCompare(b.id));
    const x = x0 + (maxD ? (d / maxD) : 0.5) * (x1 - x0);
    const n = list.length;
    const step = (y1 - y0) / Math.max(1, n);
    const offset = (Number(d) % 2) * step * 0.5;
    list.forEach((s, i) => {
      const y = y0 + step * (i + 0.5) + (offset - step * 0.25);
      const node = { id: s.id, x, y, r: s.cr === 12 ? 6.5 : 4.5 };
      nodes.push(node);
      pos[s.id] = node;
    });
  });

  edges = [];
  let k = 0;
  S.forEach((s) => {
    [...(s.req || []), ...(s.hard || [])].forEach((r) => {
      const a = pos[r], b = pos[s.id];
      if (!a || !b) return;
      const mid = a.x + (b.x - a.x) * (0.35 + ((k++ * 37) % 30) / 100);
      const pts = [[a.x, a.y], [mid, a.y], [mid, b.y], [b.x, b.y]];
      let len = 0;
      for (let i = 1; i < pts.length; i++) len += Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]);
      edges.push({ from: r, to: s.id, pts, len, phase: Math.random() });
    });
  });
}

function pointAt(e, t) {
  let dist = t * e.len;
  for (let i = 1; i < e.pts.length; i++) {
    const [ax, ay] = e.pts[i - 1], [bx, by] = e.pts[i];
    const seg = Math.abs(bx - ax) + Math.abs(by - ay);
    if (dist <= seg) { const f = seg ? dist / seg : 0; return [ax + (bx - ax) * f, ay + (by - ay) * f]; }
    dist -= seg;
  }
  return e.pts[e.pts.length - 1];
}

// --- Dibujo ---
function draw(time = 0) {
  ctx.clearRect(0, 0, w, h);

  // rejilla de puntos de fondo
  ctx.fillStyle = colors.trace;
  for (let x = 12; x < w; x += 24) for (let y = 12; y < h; y += 24) ctx.fillRect(x, y, 1, 1);

  // pistas
  ctx.lineWidth = 1.3;
  ctx.lineJoin = "round";
  edges.forEach((e) => {
    const lit = statusOf(e.from) !== "todo";
    ctx.strokeStyle = lit ? colors[statusOf(e.from)] : colors.trace;
    ctx.globalAlpha = lit ? 0.45 : 0.9;
    ctx.beginPath();
    e.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
    // vías en las esquinas
    ctx.globalAlpha = lit ? 0.7 : 0.6;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fillRect(e.pts[1][0] - 1.5, e.pts[1][1] - 1.5, 3, 3);
    ctx.fillRect(e.pts[2][0] - 1.5, e.pts[2][1] - 1.5, 3, 3);
  });
  ctx.globalAlpha = 1;

  // pulsos de "datos" saliendo de lo que ya tienes hecho
  if (!reduceMotion) {
    edges.forEach((e) => {
      const st = statusOf(e.from);
      if (st === "todo") return;
      const t = ((time / 2600) + e.phase) % 1;
      const [x, y] = pointAt(e, t);
      ctx.shadowColor = colors[st];
      ctx.shadowBlur = 10;
      ctx.fillStyle = colors[st];
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
    });
    ctx.shadowBlur = 0;
  }

  // nodos
  nodes.forEach((n) => {
    const st = statusOf(n.id);
    const c = colors[st];
    if (st === "todo") {
      ctx.strokeStyle = c; ctx.lineWidth = 1.5; ctx.fillStyle = "transparent";
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.stroke();
    } else {
      const pulse = st === "cart" && !reduceMotion ? 1 + 0.25 * Math.sin(time / 400) : 1;
      ctx.shadowColor = c; ctx.shadowBlur = 14;
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }
  });
}

function loop(t) {
  if (visible) draw(t);
  raf = requestAnimationFrame(loop);
}

// --- Texto de la "terminal" ---
function updateTerminal() {
  const { real } = calcularCreditos(false);
  const li = nivelDe(real);
  $("hero-out").textContent = `${real}/${TOTAL_CREDITOS} créditos · nivel ${li + 1} · ${NIVELES[li][1]}`;
}

export function initHero() {
  canvas = $("hero-canvas");
  if (!canvas || !canvas.getContext) return;
  ctx = canvas.getContext("2d");
  readColors();
  layout();
  new ResizeObserver(() => { layout(); if (reduceMotion) draw(); }).observe(canvas);
  if ("IntersectionObserver" in window)
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(canvas);
  if (reduceMotion) draw();
  else raf = requestAnimationFrame(loop);
  updateTerminal();
}

// Llamar cuando cambie el progreso o la cesta
export function updateHero() {
  if (!ctx) return;
  updateTerminal();
  if (reduceMotion) draw();
}
