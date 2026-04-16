"""
KS Promocionales — Quality Marker
Lee data/products.json y añade is_ai_optimized: true a los productos cuyo
'story' supera el umbral de calidad mínimo (no es la plantilla básica del scraper).

Criterios para is_ai_optimized: true
  - story con más de 250 caracteres, Y
  - story no contiene la frase exacta del template básico del daily-scraper

Productos que quedan como is_ai_optimized: false (o sin el campo)
serán excluidos del sitemap hasta que pasen por el pipeline de enriquecimiento.

Uso:
    python scripts/mark-quality-products.py

Flags opcionales:
    --dry-run   Muestra el recuento sin modificar el archivo
"""

import json
import sys
import os

ROOT = os.path.join(os.path.dirname(__file__), '..')
PRODUCTS_FILE = os.path.join(ROOT, 'data', 'products.json')

# Frase exclusiva del template básico generado por build_product() en daily-scraper.py
BASIC_TEMPLATE_PHRASE = "que tus clientes conservarán. Personalización incluida sin costo adicional."

# Longitud mínima de story para considerar que tiene contenido real
MIN_STORY_LEN = 250

dry_run = '--dry-run' in sys.argv


def is_quality(product):
    story = product.get('story', '')
    if not story:
        return False
    if len(story) < MIN_STORY_LEN:
        return False
    if BASIC_TEMPLATE_PHRASE in story:
        return False
    return True


def main():
    with open(PRODUCTS_FILE, encoding='utf-8') as f:
        products = json.load(f)

    optimized = 0
    thin = 0
    already_marked = 0

    for p in products:
        quality = is_quality(p)
        if quality:
            if p.get('is_ai_optimized'):
                already_marked += 1
            else:
                optimized += 1
            p['is_ai_optimized'] = True
        else:
            p['is_ai_optimized'] = False
            thin += 1

    total = len(products)
    print(f"Total productos         : {total}")
    print(f"Marcados is_ai_optimized: {optimized + already_marked} ({(optimized + already_marked)/total*100:.1f}%)")
    print(f"  — ya estaban marcados  : {already_marked}")
    print(f"  — marcados ahora       : {optimized}")
    print(f"Excluidos (thin content): {thin} ({thin/total*100:.1f}%)")

    if dry_run:
        print("\n[dry-run] Archivo no modificado.")
        return

    with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print(f"\nGuardado: {PRODUCTS_FILE}")
    print(f"El sitemap incluirá {optimized + already_marked} páginas de producto (excluye {thin} thin).")


if __name__ == '__main__':
    main()
