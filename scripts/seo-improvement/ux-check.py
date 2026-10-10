"""Verificación UX/UI y móvil sin servidor (docs/ux-improvement-2026-10-09).

Sirve out/ interceptando las peticiones dentro de Playwright (page.route), así
no hace falta un proceso de servidor aparte. Comprueba:
  1. Móvil 320/375/390 + 768/1366: nada fuera del viewport, CTA de producto
     y su posición respecto al banner, viewport real.
  2. Teclado: mega-menú (Enter abre, Escape cierra y devuelve foco), drawer
     móvil (foco al cerrar, inert), vista rápida (diálogo, foco, Escape).
  3. Buscador: búsqueda por sinónimo, por referencia, orden A–Z sobre toda la
     categoría, Atrás restaura el estado, cero resultados.
  4. Cotización: añadir desde la ficha, contador en header, validación de
     cantidad y fecha, sin datos personales en localStorage.
  5. Cookies: reabrir preferencias desde el pie.

Uso: python scripts/seo-improvement/ux-check.py [carpeta-capturas]
"""
import json
import mimetypes
import sys

sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
from urllib.parse import urlparse, unquote

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2] / "out"
BASE = "http://ksp.local"
SHOTS = Path(sys.argv[1] if len(sys.argv) > 1 else "ux-shots")
SHOTS.mkdir(parents=True, exist_ok=True)
results = []


def serve(route):
    url = urlparse(route.request.url)
    if url.netloc != "ksp.local":
        return route.fulfill(status=204, body="")  # externos (GA, imágenes CDN) fuera
    path = unquote(url.path)
    if path.startswith("/.netlify/images"):
        return route.fulfill(status=204, body="")
    candidates = [ROOT / path.lstrip("/")]
    if path.endswith("/"):
        candidates = [ROOT / path.lstrip("/") / "index.html"]
    elif "." not in path.split("/")[-1]:
        candidates += [ROOT / (path.lstrip("/") + "/index.html"), ROOT / (path.lstrip("/") + ".html")]
    for c in candidates:
        if c.is_file():
            ctype = mimetypes.guess_type(str(c))[0] or "application/octet-stream"
            if c.suffix == ".html":
                ctype = "text/html; charset=utf-8"
            return route.fulfill(status=200, body=c.read_bytes(), headers={"content-type": ctype})
    return route.fulfill(status=404, body=(ROOT / "404.html").read_bytes(), headers={"content-type": "text/html; charset=utf-8"})


def record(name, ok, detail=""):
    results.append({"check": name, "ok": bool(ok), "detail": detail})
    print(f"{'OK  ' if ok else 'FAIL'} {name} {detail}")


OVERFLOW_JS = """() => { const vw = innerWidth; let n = 0; const ex = [];
  for (const el of document.querySelectorAll('main h1, main h2, main p, main li, main a, main span, main button, main input, main select')) {
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    if (el.closest('[aria-hidden="true"], [class*="snap-x"], [class*="overflow-x-auto"]')) continue;
    if (r.right > vw + 1 || r.left < -1) { n++; if (ex.length < 3) ex.push(el.tagName + ':' + (el.textContent || '').trim().slice(0, 30)); } }
  return {vw, sw: document.documentElement.scrollWidth, n, ex}; }"""

with sync_playwright() as p:
    browser = p.chromium.launch()

    def new_page(w, h, mobile):
        ctx = browser.new_context(viewport={"width": w, "height": h}, is_mobile=mobile, has_touch=mobile, device_scale_factor=2 if mobile else 1)
        ctx.route("**/*", serve)
        return ctx, ctx.new_page()

    # 1. Móvil y layout
    pages = {"home": "/", "gorras": "/categorias/gorras-personalizadas/", "producto": "/productos/paraguas-kahlo-23-nuevo-13532/",
             "buscar": "/buscar/?categoria=mugs-y-termos-personalizados&orden=nombre_asc", "cotizacion": "/cotizacion/", "catalogos": "/catalogos-digitales/"}
    for name, path in pages.items():
        for w in (320, 375, 390, 768, 1366):
            mobile = w < 768
            ctx, pg = new_page(w, 812 if mobile else 900, mobile)
            pg.goto(BASE + path, wait_until="networkidle")
            pg.wait_for_timeout(400)
            m = pg.evaluate(OVERFLOW_JS)
            record(f"layout {name} {w}", m["vw"] == w and m["sw"] <= w and m["n"] == 0, json.dumps(m, ensure_ascii=False))
            if name == "producto" and mobile:
                info = pg.evaluate("""() => { const c = document.querySelector('main a[aria-label="Cotizar por WhatsApp"]'); const r = c.getBoundingClientRect();
                  const b = document.querySelector('[aria-label="Consentimiento de cookies"]'); const bh = b ? b.getBoundingClientRect().height : 0;
                  return {ctaTop: Math.round(r.top), ctaBottom: Math.round(r.bottom), vh: innerHeight, banner: Math.round(bh)}; }""")
                record(f"CTA producto en primer viewport (sin banner) {w}", info["ctaBottom"] <= info["vh"], json.dumps(info))
                record(f"CTA producto sobre el banner {w}", info["ctaBottom"] <= info["vh"] - info["banner"], json.dumps(info))
                if w == 375:
                    pg.screenshot(path=str(SHOTS / f"producto_{w}_fold.png"))
            if w in (375, 1366):
                pg.screenshot(path=str(SHOTS / f"{name}_{w}.png"))
            ctx.close()

    # 2. Teclado: mega-menú
    ctx, pg = new_page(1366, 900, False)
    pg.goto(BASE + "/", wait_until="networkidle")
    btn = pg.locator('button[aria-controls="header-categorias-menu"]')
    btn.focus(); pg.keyboard.press("Enter"); pg.wait_for_timeout(150)
    record("mega-menú abre con Enter", btn.get_attribute("aria-expanded") == "true" and pg.locator("#header-categorias-menu").is_visible())
    pg.keyboard.press("Escape"); pg.wait_for_timeout(150)
    focused = pg.evaluate("document.activeElement && document.activeElement.getAttribute('aria-controls')")
    record("mega-menú cierra con Escape y devuelve foco", btn.get_attribute("aria-expanded") == "false" and focused == "header-categorias-menu")
    record("enlaces del mega-menú en el HTML estático", pg.locator("#header-categorias-menu a").count() >= 12)
    ctx.close()

    # Drawer móvil
    ctx, pg = new_page(375, 812, True)
    pg.goto(BASE + "/", wait_until="networkidle")
    record("drawer cerrado es inert", pg.evaluate("document.querySelector('#header-mobile-drawer').parentElement.hasAttribute('inert')"))
    ham = pg.locator('button[aria-controls="header-mobile-drawer"]')
    ham.click(); pg.wait_for_timeout(400)
    record("drawer abierto: foco en Cerrar", pg.evaluate("document.activeElement.getAttribute('aria-label')") == "Cerrar menú")
    pg.keyboard.press("Escape"); pg.wait_for_timeout(400)
    record("drawer: Escape cierra y devuelve foco a la hamburguesa", pg.evaluate("document.activeElement.getAttribute('aria-controls')") == "header-mobile-drawer")
    ctx.close()

    # Vista rápida (home, escritorio)
    ctx, pg = new_page(1366, 900, False)
    pg.goto(BASE + "/", wait_until="networkidle")
    qv = pg.locator('button[title="Vista rápida"]').first
    if qv.count():
        qv.focus(); pg.keyboard.press("Enter"); pg.wait_for_timeout(400)
        dlg = pg.locator('[role="dialog"][aria-modal="true"][aria-labelledby="quick-view-title"]')
        record("vista rápida: role=dialog con título", dlg.count() == 1)
        record("vista rápida: foco en cerrar", pg.evaluate("document.activeElement.getAttribute('aria-label')") == "Cerrar vista rápida")
        for _ in range(12):
            pg.keyboard.press("Tab")
        record("vista rápida: Tab se mantiene dentro", pg.evaluate("!!document.activeElement.closest('[role=dialog]')"))
        pg.keyboard.press("Escape"); pg.wait_for_timeout(300)
        record("vista rápida: Escape cierra y devuelve foco", dlg.count() == 0 and pg.evaluate("document.activeElement.getAttribute('title')") == "Vista rápida")
    else:
        record("vista rápida: botón presente", False, "no se encontró en el home")
    ctx.close()

    # 3. Buscador
    ctx, pg = new_page(1366, 900, False)
    pg.goto(BASE + "/buscar/", wait_until="networkidle")
    pg.fill("#buscar-q", "esfero"); pg.keyboard.press("Enter"); pg.wait_for_timeout(500)
    status = pg.locator('p[role="status"]').first.inner_text()
    record("búsqueda por sinónimo (esfero → bolígrafos)", "para «esfero»" in status and not status.startswith("0 "), status)
    pg.fill("#buscar-q", "13537"); pg.keyboard.press("Enter"); pg.wait_for_timeout(500)
    record("búsqueda por referencia 13537", pg.locator('a[href="/productos/candado-de-clave-tsa-nuevo-13537/"]').count() > 0)
    pg.fill("#buscar-q", "zzzxqw"); pg.keyboard.press("Enter"); pg.wait_for_timeout(500)
    record("cero resultados con salida", pg.get_by_text("No encontramos productos").count() == 1 and pg.get_by_role("button", name="Quitar filtros").count() == 1)
    pg.goto(BASE + "/buscar/?categoria=boligrafos-publicitarios&orden=nombre_asc", wait_until="networkidle"); pg.wait_for_timeout(500)
    names = pg.evaluate("[...document.querySelectorAll('main article h3')].map(h => h.textContent.trim())")
    total = pg.locator('p[role="status"]').first.inner_text()
    in_order = pg.evaluate("() => { const c = new Intl.Collator('es', {sensitivity: 'base', numeric: true}); const n = [...document.querySelectorAll('main article h3')].map(h => h.textContent.trim()); return n.every((x, i) => i === 0 || c.compare(n[i - 1], x) <= 0); }")
    record("orden A–Z correcto en la primera página (collation es)", in_order, f"{names[:4]} … {total}")
    pg.select_option("#buscar-orden", "nombre_desc"); pg.wait_for_timeout(300)
    pg.go_back(); pg.wait_for_timeout(500)
    record("Atrás restaura el orden anterior", pg.input_value("#buscar-orden") == "nombre_asc" and "orden=nombre_asc" in pg.url, pg.url)
    ctx.close()

    # 4. Cotización
    ctx, pg = new_page(375, 812, True)
    pg.goto(BASE + "/productos/paraguas-kahlo-23-nuevo-13532/", wait_until="networkidle")
    pg.get_by_role("button", name="Añadir a mi cotización").click(); pg.wait_for_timeout(300)
    record("añadir a cotización confirma con role=status", "Añadido" in pg.locator('main p[role="status"]').first.inner_text())
    record("header muestra contador", pg.locator('a[href="/cotizacion/"][aria-label*="1 producto"]').count() == 1)
    stored = pg.evaluate("localStorage.getItem('ks_quote_list')")
    record("localStorage solo guarda slug y cantidad", stored is not None and set(json.loads(stored)["items"][0].keys()) == {"slug", "quantity"}, stored)
    pg.goto(BASE + "/cotizacion/", wait_until="networkidle"); pg.wait_for_timeout(500)
    qty = pg.locator('input[id^="qty-"]').first
    qty.fill("-3")
    pg.get_by_role("button", name="Copiar lista").click(); pg.wait_for_timeout(300)
    record("cantidad inválida muestra error enlazado", qty.get_attribute("aria-invalid") == "true" and pg.locator('main [role="alert"]').count() == 1)
    qty.fill("200"); pg.fill("#date", "2020-01-01")
    pg.get_by_role("button", name="Copiar lista").click(); pg.wait_for_timeout(300)
    record("fecha pasada rechazada", pg.locator("#date").get_attribute("aria-invalid") == "true")
    pg.fill("#city", "Quito")
    stored2 = pg.evaluate("localStorage.getItem('ks_quote_list')")
    record("ciudad/fecha no se guardan en localStorage", "Quito" not in (stored2 or "") and "2020" not in (stored2 or ""), stored2)
    pg.screenshot(path=str(SHOTS / "cotizacion_375.png"), full_page=True)
    ctx.close()

    # 5. Cookies
    ctx, pg = new_page(1366, 900, False)
    pg.goto(BASE + "/", wait_until="networkidle")
    pg.get_by_role("button", name="Rechazar").click(); pg.wait_for_timeout(300)
    pg.get_by_role("button", name="Preferencias de cookies").click(); pg.wait_for_timeout(300)
    banner = pg.locator('[aria-label="Consentimiento de cookies"]')
    record("preferencias de cookies se reabren con estado actual", banner.count() == 1 and "rechazadas" in banner.inner_text())
    ctx.close()

    browser.close()

(SHOTS / "ux-check-results.json").write_text(json.dumps(results, indent=1, ensure_ascii=False), encoding="utf-8")
fails = [r for r in results if not r["ok"]]
print(f"\n{len(results) - len(fails)}/{len(results)} OK")
sys.exit(1 if fails else 0)
