"""Verificación móvil real (docs/seo-improvement-2026-10-09, Lote 2).

Requiere Playwright para Python y un servidor estático sobre out/:
    node scripts/serve-static.mjs 5099
    python scripts/seo-improvement/mobile-check.py http://localhost:5099 <carpeta-capturas>

Para cada página y ancho mide con JS (no por el nombre del archivo): el ancho
real del viewport, elementos de texto cuyo rectángulo se sale del viewport
(el overflow:hidden del hero oculta el recorte a scrollWidth), altura del
banner de cookies, posición del CTA de cotización y si otro elemento lo
intercepta (elementFromPoint), y posición del botón flotante. Prueba además
aceptar/rechazar cookies y el menú móvil abierto.

Nota: en local las imágenes pasan por el loader de Netlify (/.netlify/images)
y no cargan; el layout reserva su espacio igual (fill/aspect-ratio).
"""
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:5099"
SHOTS = Path(sys.argv[2] if len(sys.argv) > 2 else "mobile-shots")
SHOTS.mkdir(parents=True, exist_ok=True)

PAGES = {
    "home": "/",
    "gorras": "/categorias/gorras-personalizadas/",
    "paginada": "/categorias/boligrafos-publicitarios/pagina/2/",
    "producto": "/productos/paraguas-kahlo-23-nuevo-13532/",
    "blog": "/blog/como-elegir-promocionales-segun-tu-tipo-de-cliente-2026/",
}
WIDTHS = [320, 375, 390, 768, 1366]

MEASURE = """
() => {
  const vw = window.innerWidth, vh = window.innerHeight;
  const overflow = [];
  for (const el of document.querySelectorAll('main h1, main h2, main p, main li, main a, main span')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const st = getComputedStyle(el);
    if (st.visibility === 'hidden' || st.display === 'none') continue;
    if (el.closest('[aria-hidden="true"], .marquee, [class*="ticker"], [class*="snap-x"], [class*="overflow-x-auto"]')) continue;
    if (r.right > vw + 1 || r.left < -1) overflow.push({tag: el.tagName, text: (el.textContent||'').trim().slice(0,50), left: Math.round(r.left), right: Math.round(r.right)});
  }
  const h1 = document.querySelector('main h1');
  const h1r = h1 && h1.getBoundingClientRect();
  const banner = document.querySelector('[aria-label="Consentimiento de cookies"]');
  const bannerH = banner ? Math.round(banner.getBoundingClientRect().height) : 0;
  const cta = document.querySelector('main a[aria-label="Cotizar por WhatsApp"]') || document.querySelector('main a[href*="wa.me"]');
  let ctaInfo = null;
  if (cta) {
    const r = cta.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const hit = (cy >= 0 && cy <= vh) ? document.elementFromPoint(cx, cy) : null;
    ctaInfo = {top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height),
               visibleAboveBanner: r.bottom <= vh - bannerH, intercepted: hit ? !(cta === hit || cta.contains(hit)) : null,
               interceptedBy: hit && !(cta === hit || cta.contains(hit)) ? (hit.closest('[aria-label]')?.getAttribute('aria-label') || hit.tagName) : null};
  }
  const fl = document.querySelector('.wa-float');
  let float = null;
  if (fl) { const r = fl.getBoundingClientRect(); float = {top: Math.round(r.top), bottom: Math.round(r.bottom), overlapsBanner: bannerH ? r.bottom > vh - bannerH : false, opacity: getComputedStyle(fl).opacity}; }
  return {innerWidth: vw, innerHeight: vh, scrollWidth: document.documentElement.scrollWidth,
          h1: h1r ? {left: Math.round(h1r.left), right: Math.round(h1r.right), top: Math.round(h1r.top), fontSize: getComputedStyle(h1).fontSize} : null,
          overflow: overflow.slice(0, 8), overflowCount: overflow.length, bannerH, cta: ctaInfo, float};
}
"""

results = []
with sync_playwright() as p:
    browser = p.chromium.launch()
    for name, path in PAGES.items():
        for w in WIDTHS:
            mobile = w < 768
            h = 812 if w < 768 else (1024 if w == 768 else 768)
            ctx = browser.new_context(viewport={"width": w, "height": h}, is_mobile=mobile, has_touch=mobile, device_scale_factor=2 if mobile else 1)
            page = ctx.new_page()
            page.goto(BASE + path, wait_until="networkidle")
            page.wait_for_timeout(700)
            page.evaluate("window.scrollTo(0,0)")
            m = page.evaluate(MEASURE)
            shot = SHOTS / f"{name}_{w}_banner_fold.png"
            page.screenshot(path=str(shot))
            m.update(page=name, width=w, state="banner", screenshot=shot.name)
            results.append(m)
            if name == "producto" and mobile:
                page.click("text=Aceptar")
                page.wait_for_timeout(400)
                m2 = page.evaluate(MEASURE)
                m2.update(page=name, width=w, state="aceptado", consent=page.evaluate("localStorage.getItem('ks_cookie_consent')"))
                shot2 = SHOTS / f"{name}_{w}_aceptado_fold.png"
                page.screenshot(path=str(shot2)); m2["screenshot"] = shot2.name
                results.append(m2)
                ctx2 = browser.new_context(viewport={"width": w, "height": h}, is_mobile=True, has_touch=True)
                pg2 = ctx2.new_page(); pg2.goto(BASE + path, wait_until="networkidle"); pg2.wait_for_timeout(500)
                pg2.click("text=Rechazar"); pg2.wait_for_timeout(300)
                results.append({"page": name, "width": w, "state": "rechazado", "consent": pg2.evaluate("localStorage.getItem('ks_cookie_consent')"),
                                "bannerVisible": pg2.locator('[aria-label="Consentimiento de cookies"]').count()})
                pg2.reload(wait_until="networkidle"); pg2.wait_for_timeout(400)
                results.append({"page": name, "width": w, "state": "rechazado_recarga", "bannerVisible": pg2.locator('[aria-label="Consentimiento de cookies"]').count()})
                # Menú móvil abierto: el flotante no debe quedar encima del drawer.
                pg2.click('button[aria-label*="menú" i], button[aria-label*="menu" i]')
                pg2.wait_for_timeout(500)
                results.append({"page": name, "width": w, "state": "menu_abierto",
                                "dataMenuOpen": pg2.evaluate("document.documentElement.hasAttribute('data-menu-open')"),
                                "floatOpacity": pg2.evaluate("(()=>{const f=document.querySelector('.wa-float');return f?getComputedStyle(f).opacity:null})()")})
                shot3 = SHOTS / f"{name}_{w}_menu_abierto.png"; pg2.screenshot(path=str(shot3))
                ctx2.close()
            ctx.close()
    browser.close()

out = SHOTS / "mobile-check-results.json"
out.write_text(json.dumps(results, indent=1, ensure_ascii=False), encoding="utf-8")
for r in results:
    if r.get("state") in ("banner", "aceptado"):
        cta = r.get("cta") or {}
        print(f"{r['page']:9} {r['width']:5} {r['state']:9} vw={r['innerWidth']} sw={r['scrollWidth']} h1={r['h1'] and (r['h1']['right'], r['h1']['fontSize'])} overflow={r['overflowCount']} banner={r['bannerH']} cta_top={cta.get('top')} cta_ok={cta.get('visibleAboveBanner')} intercept={cta.get('interceptedBy')} float={r.get('float')}")
    else:
        print(f"{r['page']:9} {r['width']:5} {r['state']:17} {json.dumps({k: v for k, v in r.items() if k not in ('page', 'width', 'state')}, ensure_ascii=False)}")
print("guardado:", out)
