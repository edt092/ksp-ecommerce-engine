const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'data', 'products.json');
const OUT = path.join(__dirname, '..', 'data', 'products.json.CANDIDATE');

const data = JSON.parse(fs.readFileSync(SRC, 'utf8'));

const CITY_RE_SRC = '(Bogot[aá]|Medell[ií]n|Cartagena|Barranquilla|\\bCali\\b)';
const ANY_TRACE_RE = /colombia|bogot[aá]|medell[ií]n|cartagena|barranquilla|\bcali\b/i;

function deleteCityFromList(s) {
  let out = s;
  out = out.replace(new RegExp(',\\s*' + CITY_RE_SRC, 'gi'), '');
  out = out.replace(new RegExp(CITY_RE_SRC + ',\\s*', 'gi'), '');
  out = out.replace(new RegExp('\\s+o\\s+' + CITY_RE_SRC, 'gi'), '');
  out = out.replace(new RegExp(CITY_RE_SRC + '\\s+o\\s+', 'gi'), '');
  out = out.replace(new RegExp('\\s+y\\s+' + CITY_RE_SRC, 'gi'), '');
  out = out.replace(new RegExp(CITY_RE_SRC + '\\s+y\\s+', 'gi'), '');
  out = out.replace(new RegExp(CITY_RE_SRC, 'gi'), 'Cuenca');
  return out;
}

// Only touch strings that actually contain a Colombia trace; never mutate unrelated text.
function cleanProse(s) {
  if (typeof s !== 'string' || !ANY_TRACE_RE.test(s)) return s;
  let out = s;
  out = out.replace(/Ecuador\s+y\s+Colombia/gi, 'Ecuador');
  out = out.replace(/Colombia\s+y\s+Ecuador/gi, 'Ecuador');
  out = out.replace(/\s*,?\s*y\s+Colombia\b/gi, '');
  out = out.replace(/Colombia\s+y\s+/gi, '');
  out = out.replace(/colombianas/gi, 'ecuatorianas');
  out = out.replace(/colombianos/gi, 'ecuatorianos');
  out = out.replace(/colombiana/gi, 'ecuatoriana');
  out = out.replace(/colombiano/gi, 'ecuatoriano');
  out = out.replace(/Colombia/g, 'Ecuador');
  out = out.replace(/colombia/g, 'Ecuador');
  if (new RegExp(CITY_RE_SRC, 'i').test(out)) {
    out = deleteCityFromList(out);
  }
  // Safe, whitespace-anchored grammar cleanup only (no bare \b, which false-triggers
  // after any word ending in a non-ASCII accented vowel, e.g. "consultoría o" or "envío.").
  out = out.replace(/\s+o(?=[.,]|\s*$)/gm, '');   // dangling " o" before punctuation/end
  out = out.replace(/\s+y(?=[.,]|\s*$)/gm, '');   // dangling " y" before punctuation/end
  out = out.replace(/,\s*,/g, ',');                // double commas
  out = out.replace(/\s+,/g, ',');                 // space before comma
  out = out.replace(/\s+\./g, '.');                // space before period
  out = out.replace(/,(\s*)\./g, '.');             // ", ." -> "."
  out = out.replace(/ +/g, ' ');                   // double spaces
  out = out.replace(/\.\.+/g, '.');                // double periods
  out = out.replace(/,(\s*)$/gm, '.');             // trailing dangling comma at end -> period
  return out;
}

function cleanKeywordList(s) {
  if (typeof s !== 'string') return s;
  const parts = s.split(',').map(t => t.trim()).filter(Boolean);
  const seen = new Set();
  const kept = [];
  for (const t of parts) {
    if (ANY_TRACE_RE.test(t)) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    kept.push(t);
  }
  return kept.join(', ');
}

const KEYWORD_FIELDS = new Set(['keywords', 'seoKeywords']);
const SKIP_FIELDS = new Set(['id', 'slug', 'name']);

let changedCount = 0;
for (const p of data) {
  let touched = false;
  for (const key of Object.keys(p)) {
    if (SKIP_FIELDS.has(key)) continue;
    const val = p[key];
    if (typeof val === 'string' && ANY_TRACE_RE.test(val)) {
      const after = KEYWORD_FIELDS.has(key) ? cleanKeywordList(val) : cleanProse(val);
      if (after !== val) { p[key] = after; touched = true; }
    } else if (Array.isArray(val)) {
      // Only remap items that individually contain a trace; cleanProse is a no-op otherwise.
      const newArr = val.map((item) => cleanProse(item));
      if (JSON.stringify(newArr) !== JSON.stringify(val)) { p[key] = newArr; touched = true; }
    }
  }
  if (touched) changedCount++;
}

console.log('Products touched:', changedCount);
fs.writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Wrote candidate file:', OUT);
