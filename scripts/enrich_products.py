"""
KS Promocionales — Orquestador de Enriquecimiento de Productos
Lee data/products.json, envía los productos thin al pipeline de 4 agentes
y guarda el resultado incrementalmente (cada SAVE_EVERY productos).

Uso:
    python scripts/enrich_products.py                 # enriquece todos los thin
    python scripts/enrich_products.py --limit 50      # solo los primeros 50
    python scripts/enrich_products.py --priority      # primero los de categorías top
    python scripts/enrich_products.py --model sonnet  # usa Sonnet en vez de Haiku
    python scripts/enrich_products.py --dry-run       # muestra cuántos procesaría
    python scripts/enrich_products.py --resume        # salta los ya enriquecidos

Flags combinables:
    python scripts/enrich_products.py --priority --limit 200 --model sonnet

Estimación de costo (Claude Haiku 4.5, precio aproximado a abril 2026):
    Input:  $1.00 / 1M tokens  (~500 tokens/producto x 3 llamadas = 1,500 input)
    Output: $5.00 / 1M tokens  (~300 tokens/producto x 3 llamadas = 900 output)
    Por producto: ~$0.0060
    3,244 productos Haiku: ~$19.46 USD total
    200 productos Sonnet:  ~$4.20 USD

Dependencias:
    pip install anthropic
    Variable de entorno: ANTHROPIC_API_KEY
"""

import os
import sys
import json
import time
import argparse
from datetime import datetime, timezone

# Cargar variables de entorno desde .env (en la raíz del proyecto)
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
except ImportError:
    pass  # python-dotenv no instalado, se asume que las vars ya están en el entorno

# Asegurar que scripts/ esté en el path para importaciones relativas
sys.path.insert(0, os.path.dirname(__file__))

from agent_pipeline import ProductPipeline, DEFAULT_MODEL, PRIORITY_MODEL
from content_evaluator import ContentEvaluator

# ── Config ────────────────────────────────────────────────────────────────────
ROOT          = os.path.join(os.path.dirname(__file__), "..")
PRODUCTS_FILE = os.path.join(ROOT, "data", "products.json")
SAVE_EVERY    = 10   # guardar progreso cada N productos procesados

# Categorías con mayor intención comercial — se procesan primero con --priority
PRIORITY_CATEGORIES = [
    "mugs", "escritura", "tecnologia", "memorias-usb", "maletines",
    "oficina", "precio-bomba", "ecologia", "cuidado-personal", "relojes",
]


def load_products() -> list[dict]:
    with open(PRODUCTS_FILE, encoding="utf-8") as f:
        return json.load(f)


def save_products(products: list[dict]):
    with open(PRODUCTS_FILE, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)


def select_targets(
    products: list[dict],
    resume: bool,
    priority: bool,
    limit: int,
) -> list[int]:
    """
    Retorna una lista de índices (en el array original) de los productos
    que deben ser enriquecidos, en el orden correcto.
    """
    evaluator = ContentEvaluator()

    indices_thin = []
    indices_priority = []

    for i, p in enumerate(products):
        # --resume: saltar productos ya enriquecidos exitosamente
        if resume and p.get("is_ai_optimized") is True:
            continue

        result = evaluator.evaluate(p)
        if result.passed:
            # Ya tiene calidad suficiente — solo aseguramos que tenga el campo
            continue

        if priority and p.get("categoryId") in PRIORITY_CATEGORIES:
            indices_priority.append(i)
        else:
            indices_thin.append(i)

    # Orden: primero los prioritarios, luego el resto
    ordered = indices_priority + indices_thin

    if limit > 0:
        ordered = ordered[:limit]

    return ordered


def estimate_cost(count: int, model: str) -> str:
    """Cálculo aproximado de costo USD."""
    # ~1,500 tokens input + ~900 tokens output por producto (3 llamadas)
    if "haiku" in model:
        cost = count * (1500 * 1.00 + 900 * 5.00) / 1_000_000
    else:  # sonnet
        cost = count * (1500 * 3.00 + 900 * 15.00) / 1_000_000
    return f"~${cost:.4f} USD"


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Enriquece productos thin con el pipeline de 4 agentes de IA"
    )
    p.add_argument("--limit", type=int, default=0,
                   help="Máximo de productos a procesar (0 = todos)")
    p.add_argument("--priority", action="store_true",
                   help="Procesar primero las categorías de mayor conversión")
    p.add_argument("--model", choices=["haiku", "sonnet"], default="haiku",
                   help="Modelo de Claude (haiku=rápido/barato, sonnet=mejor calidad)")
    p.add_argument("--resume", action="store_true",
                   help="Saltar productos que ya tienen is_ai_optimized: true")
    p.add_argument("--dry-run", action="store_true",
                   help="Mostrar cuántos productos procesaría sin hacer llamadas a la API")
    p.add_argument("--verbose", action="store_true",
                   help="Imprimir traza detallada de cada agente")
    return p.parse_args()


def main():
    args = parse_args()

    # ── Verificar API key ─────────────────────────────────────────────────────
    if not args.dry_run and not os.environ.get("ANTHROPIC_API_KEY"):
        print("ERROR: Variable de entorno ANTHROPIC_API_KEY no encontrada.")
        print("Exporta tu clave antes de ejecutar:")
        print("  export ANTHROPIC_API_KEY=sk-ant-...")
        print("  (o añádela a tu archivo .env)")
        sys.exit(1)

    # ── Seleccionar modelo ────────────────────────────────────────────────────
    model = PRIORITY_MODEL if args.model == "sonnet" else DEFAULT_MODEL

    # ── Cargar productos ──────────────────────────────────────────────────────
    print(f"\n{'='*60}")
    print("KS Promocionales — Enriquecimiento de Productos")
    print(f"{'='*60}")
    print(f"Archivo : {PRODUCTS_FILE}")
    print(f"Modelo  : {model}")

    products = load_products()
    print(f"Productos cargados: {len(products)}")

    # ── Seleccionar targets ───────────────────────────────────────────────────
    targets = select_targets(
        products,
        resume=args.resume,
        priority=args.priority,
        limit=args.limit,
    )

    print(f"Productos a enriquecer: {len(targets)}")
    print(f"Costo estimado: {estimate_cost(len(targets), model)}")
    print(f"Modo: {'priority ' if args.priority else ''}{'resume ' if args.resume else ''}{'dry-run' if args.dry_run else ''}")

    if args.dry_run:
        print("\n[dry-run] No se realizarán llamadas a la API.")
        # Mostrar distribución por categoría de los targets
        from collections import Counter
        cat_counts = Counter(products[i].get("categoryId", "?") for i in targets)
        print("\nTop 10 categorías en la cola:")
        for cat, count in cat_counts.most_common(10):
            print(f"  {cat:<30} {count:4d}")
        return

    if not targets:
        print("\nNo hay productos thin para enriquecer. ¡Todo está al día!")
        return

    # ── Pipeline ──────────────────────────────────────────────────────────────
    pipeline = ProductPipeline(model=model, verbose=args.verbose)
    evaluator = ContentEvaluator()

    stats = {
        "processed": 0,
        "passed":    0,
        "failed":    0,
        "errors":    0,
        "start":     time.time(),
    }

    print(f"\nIniciando enriquecimiento — guardando cada {SAVE_EVERY} productos…\n")

    for batch_start in range(0, len(targets), SAVE_EVERY):
        batch = targets[batch_start : batch_start + SAVE_EVERY]

        for idx in batch:
            product = products[idx]
            name    = product.get("name", "?")[:50]

            print(f"[{stats['processed']+1}/{len(targets)}] {name}", end="", flush=True)

            try:
                enriched = pipeline.enrich(product)
                products[idx] = enriched

                result = evaluator.evaluate(enriched)
                marker = "✓" if result.passed else "~"
                print(f"  {marker} score={result.score}")

                if result.passed:
                    stats["passed"] += 1
                else:
                    stats["failed"] += 1

            except Exception as e:
                print(f"  ✗ ERROR: {e}")
                # Marcar con score 0 para que quede en la cola del próximo run
                products[idx]["is_ai_optimized"] = False
                products[idx]["quality_score"]   = 0
                stats["errors"] += 1

            stats["processed"] += 1
            # Pausa entre productos para no saturar la cuota de Gemini
            time.sleep(10)

        # Guardar progreso del batch
        save_products(products)
        elapsed = time.time() - stats["start"]
        rate    = stats["processed"] / elapsed if elapsed > 0 else 0
        eta     = (len(targets) - stats["processed"]) / rate if rate > 0 else 0
        print(
            f"\n  ── Guardado ({stats['processed']}/{len(targets)}) "
            f"| {rate:.1f} prod/min "
            f"| ETA {eta/60:.1f} min ──\n"
        )

    # ── Resumen final ─────────────────────────────────────────────────────────
    elapsed_total = time.time() - stats["start"]
    print(f"\n{'='*60}")
    print(f"Completado en {elapsed_total/60:.1f} minutos")
    print(f"  Procesados : {stats['processed']}")
    print(f"  Pasaron ✓  : {stats['passed']}")
    print(f"  Score bajo ~: {stats['failed']}")
    print(f"  Errores ✗  : {stats['errors']}")
    print(f"\nArchivo actualizado: {PRODUCTS_FILE}")
    print(f"\nPróximo paso:")
    print(f"  npm run build   # para regenerar el sitemap con los nuevos productos")


if __name__ == "__main__":
    main()
