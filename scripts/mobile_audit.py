from playwright.sync_api import sync_playwright
import json

URL_HOME = "https://www.kronosolopromocionales.com"
URL_VAR  = "https://www.kronosolopromocionales.com/categorias/variedades/"

def audit_page(page, url, label):
    page.goto(url, wait_until="networkidle", timeout=60000)

    result = {"label": label, "url": url}

    # --- tap target sizes for interactive elements ---
    tap_data = page.evaluate("""() => {
        const targets = Array.from(document.querySelectorAll('a, button, input, select, [role="button"]'));
        return targets.map(el => {
            const bb = el.getBoundingClientRect();
            const txt = (el.innerText || el.value || el.getAttribute('aria-label') || '').trim().slice(0, 50);
            return {text: txt, w: Math.round(bb.width), h: Math.round(bb.height), y: Math.round(bb.top)};
        }).filter(t => t.w > 0 && t.h > 0);
    }""")
    small_targets = [t for t in tap_data if (t['w'] < 48 or t['h'] < 48) and t['y'] >= 0 and t['y'] < 900]
    result["small_tap_targets"] = small_targets[:15]
    result["total_interactive"] = len(tap_data)
    result["small_tap_count"] = len([t for t in tap_data if t['w'] < 48 or t['h'] < 48])

    # --- horizontal overflow check ---
    overflow = page.evaluate("""() => {
        const body = document.body;
        const html = document.documentElement;
        return {
            bodyScrollWidth: body.scrollWidth,
            windowWidth: window.innerWidth,
            hasHScroll: body.scrollWidth > window.innerWidth
        };
    }""")
    result["horizontal_overflow"] = overflow

    # --- font sizes of key text nodes ---
    fonts = page.evaluate("""() => {
        const sel = 'p, li, span, a, button, h1, h2, h3';
        const els = Array.from(document.querySelectorAll(sel)).slice(0, 30);
        return els.map(el => {
            const s = window.getComputedStyle(el);
            const bb = el.getBoundingClientRect();
            return {
                tag: el.tagName,
                text: el.innerText.trim().slice(0, 40),
                fontSize: s.fontSize,
                y: Math.round(bb.top)
            };
        }).filter(e => e.text && e.y >= 0 && e.y < 1200);
    }""")
    small_fonts = [f for f in fonts if float(f['fontSize'].replace('px','')) < 14]
    result["small_font_nodes"] = small_fonts[:10]

    # --- CTA above fold (within 812px viewport) ---
    cta_above = page.evaluate("""() => {
        const btns = Array.from(document.querySelectorAll('a[href], button'));
        return btns.filter(b => {
            const bb = b.getBoundingClientRect();
            return bb.top >= 0 && bb.bottom <= 812 && b.innerText.trim().length > 0;
        }).map(b => ({text: b.innerText.trim().slice(0, 60), y: Math.round(b.getBoundingClientRect().top), h: Math.round(b.getBoundingClientRect().height)}));
    }""")
    result["ctas_above_fold_mobile"] = cta_above[:10]

    # --- WhatsApp button DOM presence and visibility ---
    wa_info = page.evaluate("""() => {
        const wa = document.querySelector('a[href*="whatsapp"], [class*="whatsapp"], [class*="WhatsApp"]');
        if (!wa) return {found: false};
        const bb = wa.getBoundingClientRect();
        const style = window.getComputedStyle(wa);
        return {
            found: true,
            visible: style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0,
            bbox: {x: Math.round(bb.x), y: Math.round(bb.y), w: Math.round(bb.width), h: Math.round(bb.height)},
            href: wa.href ? wa.href.slice(0,80) : null
        };
    }""")
    result["whatsapp_button"] = wa_info

    # --- nav link count and contacto presence ---
    nav_info = page.evaluate("""() => {
        const nav = document.querySelector('nav, header');
        if (!nav) return {found: false};
        const links = Array.from(nav.querySelectorAll('a'));
        const texts = links.map(l => l.innerText.trim()).filter(Boolean);
        return {
            count: texts.length,
            has_contacto: texts.some(t => t.toLowerCase().includes('contact')),
            links: texts.slice(0, 20)
        };
    }""")
    result["nav_info"] = nav_info

    return result

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Mobile homepage
    page = browser.new_page(viewport={"width": 375, "height": 812})
    home_mobile = audit_page(page, URL_HOME, "Homepage Mobile 375x812")
    page.close()

    # Mobile variedades
    page = browser.new_page(viewport={"width": 375, "height": 812})
    var_mobile = audit_page(page, URL_VAR, "Variedades Mobile 375x812")
    page.close()

    # Desktop homepage
    page = browser.new_page(viewport={"width": 1366, "height": 768})
    home_desk = audit_page(page, URL_HOME, "Homepage Desktop 1366x768")
    page.close()

    browser.close()

output = [home_mobile, var_mobile, home_desk]
with open("E:/coding/proyectos-personales/archivados/ksp-segunda-version/kspromocionales-tienda/screenshots/mobile_audit.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("mobile_audit.json written")
for r in output:
    print(f"\n=== {r['label']} ===")
    print(f"  Horizontal overflow: {r['horizontal_overflow']}")
    print(f"  Small tap targets (<48px): {r['small_tap_count']} of {r['total_interactive']}")
    print(f"  Small fonts (<14px): {len(r['small_font_nodes'])}")
    print(f"  WhatsApp: {r['whatsapp_button']}")
    print(f"  Nav contacto: {r['nav_info']}")
    print(f"  CTAs above fold: {r['ctas_above_fold_mobile'][:5]}")
