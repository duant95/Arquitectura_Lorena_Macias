import { projectYear, ESTADOS, normalizeEstado } from './projectShape';

export { ESTADOS, ESTADO_LABEL, normalizeEstado } from './projectShape';

// "Orden" vacío o inválido = 99 (al final de su grupo). El 0 es válido.
export const ORDEN_DEFAULT = 99;
export function ordenNum(v) {
  if (v === null || v === undefined || v === '') return ORDEN_DEFAULT;
  const n = Number(v);
  return Number.isFinite(n) ? n : ORDEN_DEFAULT;
}

// Orden de los proyectos (página pública y lista del panel):
//   1) por estado: Finalizado → En proceso → Anteproyecto
//   2) dentro de cada estado, por "orden" (menor = primero)
//   3) a igual número, el más reciente primero (año y fecha de carga)
export function compareProjects(a, b) {
  return (
    ESTADOS.indexOf(normalizeEstado(a.estado)) - ESTADOS.indexOf(normalizeEstado(b.estado)) ||
    ordenNum(a.orden) - ordenNum(b.orden) ||
    projectYear(b.anio) - projectYear(a.anio) ||
    new Date(b.created_at || 0) - new Date(a.created_at || 0)
  );
}
