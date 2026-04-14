"""
KS Promocionales — Fix All Categories
Scrapes all 34 categories in order (catch-alls first, specific last)
so that specific categories win dedup via force_category=True.

Run: python scripts/fix_all_categories.py
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
import os
from urllib.parse import urljoin
from collections import Counter

BASE_URL  = "https://www.catalogospromocionales.com"
DELAY     = 1.5
MAX_PAGES = 50

ROOT          = os.path.join(os.path.dirname(__file__), '..')
PRODUCTS_FILE = os.path.join(ROOT, 'data', 'products.json')
CATEGORIES_FILE = os.path.join(ROOT, 'data', 'categories.json')

SESSION = requests.Session()
SESSION.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'es-EC,es;q=0.9',
})

# Catch-alls first → specific last so specific categories win force_category
ORDERED_CATS = [
    # Catch-alls first
    ('novedades',          'https://www.catalogospromocionales.com/promocionales/novedades.html'),
    ('variedades',         'https://www.catalogospromocionales.com/promocionales/variedades.html'),
    ('hogar',              'https://www.catalogospromocionales.com/promocionales/hogar.html'),
    ('oficina',            'https://www.catalogospromocionales.com/promocionales/oficina.html'),
    ('tecnologia',         'https://www.catalogospromocionales.com/promocionales/tecnologia.html'),
    ('ecologia',           'https://www.catalogospromocionales.com/promocionales/ecologia.html'),
    # Mid-level
    ('maletines',          'https://www.catalogospromocionales.com/promocionales/maletines.html'),
    ('mugs',               'https://www.catalogospromocionales.com/promocionales/mugs.html'),
    ('escritura',          'https://www.catalogospromocionales.com/promocionales/articulos-escritura.html'),
    ('herramientas',       'https://www.catalogospromocionales.com/promocionales/herramientas.html'),
    ('llaveros',           'https://www.catalogospromocionales.com/promocionales/llaveros.html'),
    ('paraguas',           'https://www.catalogospromocionales.com/promocionales/paraguas.html'),
    ('cuidado-personal',   'https://www.catalogospromocionales.com/promocionales/cuidado-personal.html'),
    ('produccion-nacional','https://www.catalogospromocionales.com/promocionales/produccion-nacional.html'),
    ('confeccion',         'https://www.catalogospromocionales.com/promocionales/confeccion.html'),
    ('infantil',           'https://www.catalogospromocionales.com/promocionales/infantil.html'),
    ('juegos',             'https://www.catalogospromocionales.com/promocionales/juegos.html'),
    # Most specific last (these win)
    ('deportes',           'https://www.catalogospromocionales.com/promocionales/deportes.html'),
    ('bicicleta',          'https://www.catalogospromocionales.com/promocionales/bicicleta.html'),
    ('gorras',             'https://www.catalogospromocionales.com/promocionales/gorras.html'),
    ('golf',               'https://www.catalogospromocionales.com/promocionales/golf.html'),
    ('iluminacion',        'https://www.catalogospromocionales.com/promocionales/iluminacion.html'),
    ('medicos',            'https://www.catalogospromocionales.com/promocionales/medicos.html'),
    ('calculadoras',       'https://www.catalogospromocionales.com/promocionales/calculadoras.html'),
    ('relojes',            'https://www.catalogospromocionales.com/promocionales/relojes.html'),
    ('memorias-usb',       'https://www.catalogospromocionales.com/promocionales/memorias-usb.html'),
    ('econature',          'https://www.catalogospromocionales.com/promocionales/econature.html'),
    ('automovil',          'https://www.catalogospromocionales.com/promocionales/automovil.html'),
    ('antimicrobianos',    'https://www.catalogospromocionales.com/promocionales/antimicrobianos.html'),
    ('reflectivos',        'https://www.catalogospromocionales.com/promocionales/reflectivos.html'),
    ('antiestres',         'https://www.catalogospromocionales.com/promocionales/antiestres.html'),
    ('bar-y-vino',         'https://www.catalogospromocionales.com/promocionales/bar-y-vino.html'),
    ('master-line',        'https://www.catalogospromocionales.com/promocionales/master-line.html'),
    ('precio-bomba',       'https://www.catalogospromocionales.com/Catalogo/Default.aspx?id=434'),
]


def slugify(text):
    text = text.lower().strip()
    for src, dst in [('á','a'),('é','e'),('í','i'),('ó','o'),('ú','u'),('ñ','n'),('ü','u')]:
        text = text.replace(src, dst)
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')


def get_page(url, retries=3):
    for attempt in range(retries):
        try:
            r = SESSION.get(url, timeout=20)
            r.raise_for_status()
            return r.text
        except Exception as e:
            if attempt == retries - 1:
                print(f"  [ERROR] {url}: {e}")
                return None
            time.sleep(3)
    return None


def clean_name(raw):
    name = re.sub(r'\[.*?\]', '', raw)
    name = re.sub(r'\s*-?\s*PRECIO BOMBA\s*', '', name, flags=re.I)
    return re.sub(r'\s+', ' ', name).strip()


def title_case(text):
    return ' '.join(
        w.capitalize() if len(w) > 2 else w.lower()
        for w in text.split()
    )


def normalise_img(src):
    url = urljoin(BASE_URL, src)
    return ('https:' + url) if url.startswith('//') else url


def extract_prod_id(img_url):
    m = re.search(r'/productos[-s]*/(\d+)', img_url)
    return m.group(1) if m else None


def find_next_page_url(soup, current_page):
    next_page_num = str(current_page + 1)
    page_links = soup.find_all('a', href=re.compile(r'[Pp]age=\d+'))
    for link in page_links:
        href = link.get('href', '')
        m = re.search(r'[Pp]age=(\d+)', href)
        if m and m.group(1) == next_page_num:
            return urljoin(BASE_URL, href)
    next_link = soup.find('a', string=re.compile(r'siguiente|next|[›»>]', re.I))
    if next_link and next_link.get('href'):
        return urljoin(BASE_URL, next_link['href'])
    return None


def scrape_category(cat_id, cat_url):
    products  = []
    seen_imgs = set()
    current_url = cat_url
    page = 1

    while page <= MAX_PAGES:
        html = get_page(current_url)
        if not html:
            break

        soup = BeautifulSoup(html, 'lxml')
        found_on_page = 0

        back_table = soup.find(id='backTable')
        items = back_table.find_all('div', class_='itemProducto-') if back_table else []

        if items:
            for item in items:
                link = item.find('a', class_='img-producto')
                if not link:
                    continue
                img = link.find('img')
                if not img:
                    continue
                img_src = img.get('src') or img.get('data-src', '')
                if not img_src:
                    continue
                img_url = normalise_img(img_src)
                if img_url in seen_imgs:
                    continue

                name = clean_name(img.get('alt', '').strip())
                if not name or len(name) < 3:
                    h3 = item.find('h3')
                    name = clean_name(h3.get_text(strip=True)) if h3 else ''
                if not name or len(name) < 3:
                    continue

                seen_imgs.add(img_url)
                products.append(build_product(name, img_url, cat_id))
                found_on_page += 1

        else:
            # Fallback: full-size product images only
            for img in soup.find_all('img', src=re.compile(r'/images/productos/\d+', re.I)):
                img_url = normalise_img(img['src'])
                if img_url in seen_imgs:
                    continue
                name = clean_name(img.get('alt', '').strip())
                if not name or len(name) < 3:
                    parent = img.find_parent(['a', 'div', 'li'])
                    if parent:
                        h3 = parent.find(['h3', 'h4', 'h2', 'strong', 'b'])
                        if h3:
                            name = clean_name(h3.get_text(strip=True))
                if name and len(name) >= 3:
                    seen_imgs.add(img_url)
                    products.append(build_product(name, img_url, cat_id))
                    found_on_page += 1

        print(f"    page {page}: {found_on_page} products")

        if found_on_page == 0:
            break

        next_url = find_next_page_url(soup, page)
        if not next_url:
            break

        current_url = next_url
        page += 1
        time.sleep(DELAY)

    return products


def build_product(raw_name, img_original_url, cat_id):
    clean = title_case(clean_name(raw_name))
    name_slug = slugify(clean)
    prod_id = extract_prod_id(img_original_url)
    slug = f"{name_slug}-{prod_id}" if prod_id else f"{cat_id}-{name_slug}"

    local_img = f"/img/productos/{slug}.jpg"

    desc_templates = [
        f"{clean} personalizado con logo. Producto promocional para empresas en Ecuador y Colombia.",
        f"Cotiza {clean} con impresión de logo. Artículo promocional versátil para eventos y campañas.",
        f"{clean} con tu marca impresa. Regalo corporativo ideal para ferias y lanzamientos.",
    ]
    desc_idx = int(prod_id) % 3 if prod_id and prod_id.isdigit() else 0
    descripcion = desc_templates[desc_idx]

    name_lower = clean.lower()
    seo_kw = (
        f"{name_lower}, {name_lower} personalizado, {name_lower} promocional, "
        f"{name_lower} con logo, {name_lower} ecuador, {name_lower} corporativo, "
        f"{cat_id}, regalo corporativo ecuador, merchandising quito, "
        f"productos promocionales guayaquil, ks promocionales, artículos publicitarios"
    )

    return {
        'id':                  slug,
        'slug':                slug,
        'categoryId':          cat_id,
        'name':                clean,
        'description':         descripcion,
        'images':              [local_img],
        'imagen_original_url': img_original_url,
        'seoTitle':            f"{clean} Personalizado Ecuador | KS Promocionales",
        'seoDescription':      f"{descripcion} Envíos a Quito, Guayaquil, Bogotá y Medellín.",
        'seoKeywords':         seo_kw,
        'whatsappMessage':     f"Hola, me interesa cotizar {clean} personalizado con el logo de mi empresa.",
    }


def merge_products(existing, new_products, force_category=True):
    img_to_idx = {}
    for idx, p in enumerate(existing):
        for img_url in p.get('images', []):
            img_to_idx[img_url] = idx

    existing_slugs = {p.get('slug') for p in existing if p.get('slug')}
    added = reassigned = 0

    for p in new_products:
        images = p.get('images', [])
        if not images:
            continue
        img0 = images[0]

        # Also check imagen_original_url as secondary key
        matched_idx = img_to_idx.get(img0)
        if matched_idx is None:
            orig_url = p.get('imagen_original_url', '')
            for idx, ep in enumerate(existing):
                if ep.get('imagen_original_url') == orig_url:
                    matched_idx = idx
                    break

        if matched_idx is not None:
            if force_category:
                ep = existing[matched_idx]
                if ep.get('categoryId') != p.get('categoryId'):
                    ep['categoryId'] = p['categoryId']
                    ep['id']         = p['id']
                    ep['slug']       = p['slug']
                    reassigned += 1
        else:
            slug = p.get('slug')
            if slug and slug in existing_slugs:
                # Slug collision — make unique with index
                slug = f"{slug}-{len(existing)}"
                p['slug'] = slug
                p['id']   = slug
            existing.append(p)
            for img_url in images:
                img_to_idx[img_url] = len(existing) - 1
            existing_slugs.add(p.get('slug'))
            added += 1

    if reassigned:
        print(f"  Reassigned category for {reassigned} products")
    return existing, added


def main():
    print("=" * 60)
    print("KS Promocionales — Fix All Categories")
    print("=" * 60)

    with open(PRODUCTS_FILE, encoding='utf-8') as f:
        products = json.load(f)
    with open(CATEGORIES_FILE, encoding='utf-8') as f:
        categories = json.load(f)

    # Build cat_id → cat name lookup
    cat_name_map = {}
    for cat in categories:
        cid = cat.get('id') or cat.get('slug', '')
        cat_name_map[cid] = cat.get('name') or cat.get('nombre', cid)

    print(f"Starting products: {len(products)}")
    print(f"Categories to process: {len(ORDERED_CATS)}")

    total_added = 0
    for idx, (cat_id, cat_url) in enumerate(ORDERED_CATS, 1):
        cat_name = cat_name_map.get(cat_id, cat_id)
        print(f"\n[{idx}/{len(ORDERED_CATS)}] {cat_name} ({cat_id})")
        print(f"  URL: {cat_url}")

        new_prods = scrape_category(cat_id, cat_url)
        # Tag with categoria field too for compat
        for p in new_prods:
            p['categoria'] = cat_name

        products, added = merge_products(products, new_prods, force_category=True)
        total_added += added
        print(f"  Scraped: {len(new_prods)}  |  New added: {added}  |  Total: {len(products)}")
        time.sleep(DELAY)

    print(f"\nTotal new products added: {total_added}")
    print(f"Final total: {len(products)}")

    # Save products
    with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    print("Saved data/products.json")

    # Update productCount in categories.json
    counts = Counter(p.get('categoryId', '') for p in products)
    for cat in categories:
        cid = cat.get('id') or cat.get('slug', '')
        cat['productCount'] = counts.get(cid, 0)
    with open(CATEGORIES_FILE, 'w', encoding='utf-8') as f:
        json.dump(categories, f, ensure_ascii=False, indent=2)
    print("Saved data/categories.json")

    print("\nCategory breakdown:")
    for cid, count in sorted(counts.items(), key=lambda x: -x[1]):
        print(f"  {cid:<35} {count:>5}")

    print("\nDone.")


if __name__ == '__main__':
    main()
