#!/usr/bin/env node
// Fase 0 (docs/seo-improvement-2026-10-09) — reconciliación reproducible de
// los exports de Search Console del 2026-10-09.
//
// Lee los CSV originales SIN modificarlos y recalcula: totales por export
// (gráfico, páginas, consultas, países, dispositivos), CTR = clics/impresiones,
// posición ponderada por impresiones, ventanas de 28 días, meses completos y
// la serie de indexación (primer/último conteo completo, escalones, motivos).
//
// Uso:
//   node scripts/seo-improvement/reconcile-gsc.mjs "<carpeta ANALISI-09-10-2026>"
// Escribe reports/seo-improvement-2026-10-09/gsc-reconciliation.json

import { readFileSync, readdirSync, writeFileSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

const SRC = process.argv[2];
if (!SRC) {
  console.error('Falta la ruta de la carpeta de exports.');
  process.exit(1);
}
const OUT_DIR = join(process.cwd(), 'reports', 'seo-improvement-2026-10-09');

// Parser CSV mínimo que respeta comillas dobles, comillas escapadas ("") y
// saltos de línea dentro de campos. Distingue celda vacía ('') de cero.
function parseCsv(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else field += ch;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  const [header, ...data] = rows;
  return { header, rows: data.map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? '']))) };
}

const num = v => (v === '' || v === undefined ? null : Number(String(v).replace('%', '')));

function load(rel) {
  const path = join(SRC, rel);
  const buf = readFileSync(path);
  return { ...parseCsv(buf.toString('utf8')), sha256: createHash('sha256').update(buf).digest('hex'), bytes: buf.length };
}

// Agrega filas con columnas Clics/Impresiones/Posición.
function aggregate(rows) {
  let clicks = 0, impressions = 0, posWeighted = 0;
  for (const r of rows) {
    const c = num(r['Clics']) ?? 0;
    const i = num(r['Impresiones']) ?? 0;
    const p = num(r['Posición']);
    clicks += c; impressions += i;
    if (p !== null) posWeighted += p * i;
  }
  return {
    filas: rows.length,
    clics: clicks,
    impresiones: impressions,
    ctr_pct: impressions ? +(100 * clicks / impressions).toFixed(2) : null,
    posicion_ponderada: impressions ? +(posWeighted / impressions).toFixed(2) : null,
  };
}

function windowed(chartRows, from, to) {
  return aggregate(chartRows.filter(r => r['Fecha'] >= from && r['Fecha'] <= to));
}

function performance(dir) {
  const chart = load(`${dir}/Gráfico.csv`);
  const pages = load(`${dir}/Páginas.csv`);
  const queries = load(`${dir}/Consultas.csv`);
  const countries = load(`${dir}/Países.csv`);
  const devices = load(`${dir}/Dispositivos.csv`);
  const filters = load(`${dir}/Filtros.csv`);
  const appearance = load(`${dir}/Aparición en búsquedas.csv`);
  const dates = chart.rows.map(r => r['Fecha']).sort();
  return {
    filtros: filters.rows,
    rango_grafico: { desde: dates[0], hasta: dates[dates.length - 1], dias: dates.length },
    grafico: aggregate(chart.rows),
    tabla_paginas: aggregate(pages.rows),
    tabla_consultas_visibles: aggregate(queries.rows),
    paises: aggregate(countries.rows),
    dispositivos: Object.fromEntries(devices.rows.map(r => [r['Dispositivo'], aggregate([r])])),
    aparicion: appearance.rows,
    agosto: windowed(chart.rows, '2026-08-01', '2026-08-31'),
    septiembre: windowed(chart.rows, '2026-09-01', '2026-09-30'),
    ventana_28_anterior: { desde: '2026-08-12', hasta: '2026-09-08', ...windowed(chart.rows, '2026-08-12', '2026-09-08') },
    ventana_28_ultima: { desde: '2026-09-09', hasta: '2026-10-06', ...windowed(chart.rows, '2026-09-09', '2026-10-06') },
    hashes: Object.fromEntries([chart, pages, queries, countries, devices, filters, appearance].map((f, i) =>
      [['Gráfico', 'Páginas', 'Consultas', 'Países', 'Dispositivos', 'Filtros', 'Aparición'][i], f.sha256])),
  };
}

function indexing() {
  const chart = load('Paginas-no-index/Gráfico.csv');
  const critical = load('Paginas-no-index/Problemas críticos.csv');
  const nonCritical = load('Paginas-no-index/Problemas no críticos.csv');
  const meta = load('Paginas-no-index/Metadatos.csv');
  const complete = chart.rows.filter(r => r['Indexadas'] !== '' && r['Sin indexar'] !== '');
  const first = complete[0];
  const last = complete[complete.length - 1];
  const steps = [];
  for (let i = 1; i < complete.length; i++) {
    const d = num(complete[i]['Indexadas']) - num(complete[i - 1]['Indexadas']);
    if (d !== 0) steps.push({ fecha: complete[i]['Fecha'], delta_indexadas: d, indexadas: num(complete[i]['Indexadas']), sin_indexar: num(complete[i]['Sin indexar']) });
  }
  const reasons = critical.rows.map(r => ({ motivo: r['Motivo'], fuente: r['Fuente'], validacion: r['Validación'], paginas: num(r['Páginas']) }));
  const sum = reasons.reduce((a, r) => a + r.paginas, 0);
  return {
    metadatos: meta.rows,
    filas_sin_conteo: chart.rows.length - complete.length,
    primera_completa: { fecha: first['Fecha'], indexadas: num(first['Indexadas']), sin_indexar: num(first['Sin indexar']), conocidas: num(first['Indexadas']) + num(first['Sin indexar']) },
    ultima: { fecha: last['Fecha'], indexadas: num(last['Indexadas']), sin_indexar: num(last['Sin indexar']), conocidas: num(last['Indexadas']) + num(last['Sin indexar']) },
    caida_neta_indexadas: num(last['Indexadas']) - num(first['Indexadas']),
    caida_pct: +(100 * (num(first['Indexadas']) - num(last['Indexadas'])) / num(first['Indexadas'])).toFixed(1),
    escalones: steps,
    motivos: reasons,
    suma_motivos: sum,
    coincide_con_sin_indexar_final: sum === num(last['Sin indexar']),
    problemas_no_criticos_filas: nonCritical.rows.length,
  };
}

const ec = performance('rendimiento-3-meses-ecuador');
const global = performance('rendimiento-3-meses-todos-los-paises');
const idx = indexing();

const inventory = [];
for (const d of readdirSync(SRC)) {
  const p = join(SRC, d);
  if (!statSync(p).isDirectory()) continue;
  for (const f of readdirSync(p)) {
    const buf = readFileSync(join(p, f));
    inventory.push({ archivo: `${d}/${f}`, bytes: buf.length, sha256: createHash('sha256').update(buf).digest('hex') });
  }
}

const result = {
  generado: new Date().toISOString(),
  fuente: SRC,
  inventario: inventory,
  ecuador: ec,
  global,
  cuota_ecuador_clics_pct: +(100 * ec.grafico.clics / global.grafico.clics).toFixed(1),
  cuota_ecuador_impresiones_pct: +(100 * ec.grafico.impresiones / global.grafico.impresiones).toFixed(1),
  indexacion: idx,
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'gsc-reconciliation.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify({
  archivos: inventory.length,
  ecuador: { grafico: ec.grafico, paginas: ec.tabla_paginas, consultas: ec.tabla_consultas_visibles, paises: ec.paises, ult28: ec.ventana_28_ultima, ant28: ec.ventana_28_anterior, disp: ec.dispositivos },
  global: { grafico: global.grafico, paginas: global.tabla_paginas, consultas: global.tabla_consultas_visibles, paises: global.paises, ult28: global.ventana_28_ultima, ant28: global.ventana_28_anterior },
  cuotas: [result.cuota_ecuador_clics_pct, result.cuota_ecuador_impresiones_pct],
  indexacion: { ...idx, escalones: idx.escalones.filter(s => Math.abs(s.delta_indexadas) >= 50) },
}, null, 1));
