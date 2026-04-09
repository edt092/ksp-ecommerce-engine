from playwright.sync_api import sync_playwright
import json, time

SHOTS = [
    # (url, filename, width, height, label)
    ("https://www.kronosolopromocionales.com", "homepage_desktop_1920.png", 1920, 1080, "Homepage Desktop 1920x1080"),
    ("https://www.kronosolopromocionales.com", "homepage_laptop_1366.png", 1366, 768, "Homepage Laptop 1366x768"),
    ("https://www.kronosolopromocionales.com", "homepage_mobile_375.png", 375, 812, "Homepage Mobile 375x812"),
    ("https://www.kronosolopromocionales.com/categorias/variedades/", "variedades_desktop.png", 1920, 1080, "Variedades Desktop"),
    ("https://www.kronosolopromocionales.com/categorias/variedades/", "variedades_mobile.png", 375, 812, "Variedades Mobile"),
    ("https://www.kronosolopromocionales.com", "homepage_tablet_768.png", 768, 1024, "Homepage Tablet 768x1024"),
]

OUT = "E:/coding/proyectos-personales/archivados/ksp-segunda-version/kspromocionales-tienda/screenshots"
results = []

with sync_playwright() as p:
    browser = p.chromium.launch()
    for url, fname, w, h, label in SHOTS:
        print(f"Capturing {label}...")
        page = browser.new_page(viewport={"width": w, "height": h})
        try:
            page.goto(url, wait_until="networkidle", timeout=60000)
            time.sleep(1)  # allow any JS animations to settle
            path = f"{OUT}/{fname}"
            page.screenshot(path=path, full_page=False)
            print(f"  Saved: {path}")

            # --- collect DOM metrics while on the page ---
            meta = {}

            # H1 text + bounding box
            h1 = page.query_selector("h1")
            if h1:
                meta["h1_text"] = h1.inner_text().strip()
                bb = h1.bounding_box()
                meta["h1_bbox"] = bb
                meta["h1_in_viewport"] = bb["y"] + bb["height"] <= h if bb else None
            else:
                meta["h1_text"] = None

            # Nav links
            nav_links = page.eval_on_selector_all("nav a, header a", "els => els.map(e => e.innerText.trim()).filter(Boolean)")
            meta["nav_links"] = nav_links

            # CTA buttons (above fold)
            ctas = page.eval_on_selector_all("a[href*='whatsapp'], a[href*='catalogo'], button, .btn, [class*='cta']",
                "els => els.slice(0,6).map(e => ({text: e.innerText.trim().slice(0,60), tag: e.tagName}))")
            meta["ctas_sample"] = ctas

            # WhatsApp button presence
            wa = page.query_selector("a[href*='whatsapp'], [class*='whatsapp'], [class*='WhatsApp']")
            meta["whatsapp_visible"] = wa is not None

            # Hero image alts
            img_alts = page.eval_on_selector_all("img", "imgs => imgs.slice(0,10).map(i => ({alt: i.alt, src: i.src.slice(0,80)}))")
            meta["img_alts_sample"] = img_alts

            # Font size of body text (approximation)
            body_font = page.evaluate("() => window.getComputedStyle(document.body).fontSize")
            meta["body_font_size"] = body_font

            results.append({"label": label, "url": url, "viewport": f"{w}x{h}", "file": path, "meta": meta})
        except Exception as e:
            print(f"  ERROR: {e}")
            results.append({"label": label, "url": url, "viewport": f"{w}x{h}", "file": None, "error": str(e)})
        finally:
            page.close()

    browser.close()

with open(f"{OUT}/analysis.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("\nDone. analysis.json written.")
