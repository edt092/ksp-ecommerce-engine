"""
KS Promocionales — Agente Evaluador / Crítico
Detecta thin content antes de marcar un producto como is_ai_optimized.

Uso standalone (diagnóstico):
    python scripts/content_evaluator.py                    # analiza data/products.json
    python scripts/content_evaluator.py --show-failures 10 # muestra 10 productos que fallan
    python scripts/content_evaluator.py --show-passing  5  # muestra 5 que pasan

Uso desde código:
    from content_evaluator import ContentEvaluator
    evaluator = ContentEvaluator()
    result = evaluator.evaluate(product_dict)
    if result.passed:
        product['is_ai_optimized'] = True
        product['quality_score']   = result.score
"""

import re
import sys
import os
import json
from dataclasses import dataclass, field

# ── Huellas digitales de plantillas conocidas ─────────────────────────────────
# Añadir aquí cuando el pipeline genere nuevas plantillas reconocibles.
TEMPLATE_FINGERPRINTS: list[str] = [
    # Plantilla básica del daily-scraper.py (build_product)
    "que tus clientes conservarán. Personalización incluida sin costo adicional.",
    "personalizado con tu logo corporativo. Ideal para regalos empresariales",
    # Plantillas del generador_seo_avanzado.py (promo-scraper legacy)
    "lo último en tendencias de productos promocionales",
    "Ser el primero en ofrecer algo novedoso posiciona",
    "posiciona a tu marca como innovadora y a la vanguardia",
    "el elemento sorpresa que todo marketero busca",
    "tu marca demuestra que está atenta a las últimas tendencias",
    "Este artículo de última generación",
    "del café en una oportunidad de",
    "tu marca estar presente en el",
]

# Patrones regex — repetición de palabras clave en ventana corta
FILLER_REGEX: list[str] = [
    r'\b(innovador|único|premium|exclusivo|personalizado)\b.{0,50}\1',
    r'(tu marca|su marca).{0,60}(tu marca|su marca)',
    r'\b(calidad)\b.{0,40}\1',
]

# seoTitle por defecto que genera el scraper — si no cambió, es plantilla
_DEFAULT_SEO_TITLE_SUFFIX = "| KS Promocionales Ecuador"


@dataclass
class EvalResult:
    passed: bool
    score: int                      # 0–100
    reasons: list[str] = field(default_factory=list)
    feedback: str = ""              # instrucción concisa para el agente Copywriter en retry

    def summary(self) -> str:
        status = "PASA ✓" if self.passed else "FALLA ✗"
        return f"[{status}] score={self.score}/100  razones={len(self.reasons)}"


class ContentEvaluator:
    """
    Evalúa la calidad del contenido de un producto y decide si debe recibir
    is_ai_optimized: true.

    Puntuación de partida: 100. Se descuentan penalizaciones por cada defecto.
    Un producto pasa si score >= PASS_THRESHOLD (defecto 60).

    Los pesos de cada penalización están documentados en línea para facilitar
    ajustes según el comportamiento real del pipeline.
    """

    # ── Umbrales de longitud ──────────────────────────────────────────────────
    MIN_STORY_NET_LEN   = 350   # chars netos (sin el nombre del producto)
    MIN_SHORT_DESC_LEN  = 100   # chars totales
    MIN_SEO_DESC_LEN    = 100   # chars totales
    MIN_UNIQUE_SENTENCES = 3    # oraciones únicas en el story

    # ── Score mínimo para pasar ───────────────────────────────────────────────
    PASS_THRESHOLD = 60

    def evaluate(self, product: dict) -> EvalResult:
        score    = 100
        reasons  = []
        name     = product.get("name", "").strip()
        story    = product.get("story", "") or ""
        short    = product.get("shortDescription", "") or ""
        seo_desc = product.get("seoDescription", "") or ""
        seo_title = product.get("seoTitle", "") or ""

        # ── 1. Detección de plantilla (penalización fuerte) ───────────────────
        # Un solo hit confirma que el texto no fue escrito por el pipeline de IA.
        template_hit = None
        for fp in TEMPLATE_FINGERPRINTS:
            if fp in story or fp in short:
                template_hit = fp
                break

        if template_hit:
            score -= 45
            reasons.append(f"Plantilla detectada: «{template_hit[:70]}…»")

        # ── 2. Longitud neta del story ────────────────────────────────────────
        # Descontamos el nombre del producto porque lo repite el template.
        story_net = story.replace(name, "").strip() if name else story.strip()
        story_net_len = len(story_net)

        if story_net_len < self.MIN_STORY_NET_LEN:
            # Penalización proporcional: máximo -25 si está completamente vacío
            deficit = self.MIN_STORY_NET_LEN - story_net_len
            penalty = min(25, deficit // 14)
            score  -= penalty
            reasons.append(
                f"Story neta muy corta: {story_net_len} chars "
                f"(mínimo {self.MIN_STORY_NET_LEN}, penalización -{penalty})"
            )

        # ── 3. Longitud shortDescription ──────────────────────────────────────
        if len(short) < self.MIN_SHORT_DESC_LEN:
            score -= 15
            reasons.append(
                f"shortDescription corta: {len(short)} chars "
                f"(mínimo {self.MIN_SHORT_DESC_LEN})"
            )

        # ── 4. Longitud seoDescription ────────────────────────────────────────
        if len(seo_desc) < self.MIN_SEO_DESC_LEN:
            score -= 10
            reasons.append(
                f"seoDescription corta: {len(seo_desc)} chars "
                f"(mínimo {self.MIN_SEO_DESC_LEN})"
            )

        # ── 5. Variedad de oraciones ──────────────────────────────────────────
        sentences = [
            s.strip()
            for s in re.split(r"[.!?]+", story)
            if len(s.strip()) > 20
        ]
        unique_count = len(set(sentences))
        if unique_count < self.MIN_UNIQUE_SENTENCES:
            score -= 15
            reasons.append(
                f"Pocas oraciones únicas: {unique_count} "
                f"(mínimo {self.MIN_UNIQUE_SENTENCES})"
            )

        # ── 6. Patrones de relleno ────────────────────────────────────────────
        for pattern in FILLER_REGEX:
            if re.search(pattern, story, re.IGNORECASE):
                score -= 8
                reasons.append(f"Relleno detectado (regex: {pattern[:45]}…)")
                break  # una penalización por tipo

        # ── 7. seoTitle sin diferenciación ───────────────────────────────────
        if seo_title.endswith(_DEFAULT_SEO_TITLE_SUFFIX):
            expected = f"{name} Personalizado {_DEFAULT_SEO_TITLE_SUFFIX}"
            if seo_title == expected:
                score -= 5
                reasons.append("seoTitle es el título por defecto del scraper")

        # ── Normalizar y construir resultado ─────────────────────────────────
        score  = max(0, min(100, score))
        passed = score >= self.PASS_THRESHOLD

        feedback = self._build_feedback(reasons, story_net_len, len(short))

        return EvalResult(passed=passed, score=score, reasons=reasons, feedback=feedback)

    # ── Helpers ───────────────────────────────────────────────────────────────

    def _build_feedback(
        self, reasons: list[str], story_len: int, short_len: int
    ) -> str:
        """
        Genera una instrucción concisa para el agente Copywriter cuando hay retry.
        Solo incluye los problemas reales detectados.
        """
        parts = []
        if any("Plantilla" in r for r in reasons):
            parts.append(
                "El texto contiene frases de plantilla genérica. "
                "Reescribe completamente con detalles específicos del producto."
            )
        if story_len < self.MIN_STORY_NET_LEN:
            parts.append(
                f"El story tiene {story_len} caracteres útiles; necesita al menos "
                f"{self.MIN_STORY_NET_LEN}. Añade casos de uso reales, contexto de "
                "uso corporativo y beneficios concretos."
            )
        if short_len < self.MIN_SHORT_DESC_LEN:
            parts.append(
                f"La shortDescription tiene {short_len} caracteres; necesita al menos "
                f"{self.MIN_SHORT_DESC_LEN}. Sé más específico sobre el producto."
            )
        if any("oraciones" in r for r in reasons):
            parts.append(
                "El story tiene pocas oraciones distintas. Varía la estructura "
                "de las frases y añade más perspectivas."
            )
        return " ".join(parts) if parts else "Mejora la originalidad y especificidad del contenido."


# ── Modo CLI — diagnóstico sobre products.json ───────────────────────────────

def _parse_args():
    import argparse
    p = argparse.ArgumentParser(description="Diagnóstico de calidad de contenido")
    p.add_argument("--file", default=None, help="Ruta al products.json (default: data/products.json)")
    p.add_argument("--show-failures", type=int, default=0, metavar="N",
                   help="Mostrar N productos que fallan con sus razones")
    p.add_argument("--show-passing", type=int, default=0, metavar="N",
                   help="Mostrar N productos que pasan")
    return p.parse_args()


def main():
    args = _parse_args()

    root = os.path.join(os.path.dirname(__file__), "..")
    path = args.file or os.path.join(root, "data", "products.json")

    with open(path, encoding="utf-8") as f:
        products = json.load(f)

    evaluator  = ContentEvaluator()
    passed_list = []
    failed_list = []
    buckets     = {(0, 40): 0, (40, 60): 0, (60, 80): 0, (80, 101): 0}

    for p in products:
        result = evaluator.evaluate(p)
        for (lo, hi), _ in buckets.items():
            if lo <= result.score < hi:
                buckets[(lo, hi)] += 1
        if result.passed:
            passed_list.append((p, result))
        else:
            failed_list.append((p, result))

    total  = len(products)
    passed = len(passed_list)
    failed = len(failed_list)

    print(f"\nTotal  : {total}")
    print(f"Pasan  : {passed} ({passed/total*100:.1f}%)")
    print(f"Fallan : {failed} ({failed/total*100:.1f}%)")
    print("\nDistribución de scores:")
    for (lo, hi), count in buckets.items():
        bar   = "#" * (count // max(1, total // 60))
        label = f"{lo:3d}–{hi-1:3d}"
        print(f"  {label}: {count:5d}  {bar}")

    if args.show_failures:
        print(f"\n-- {args.show_failures} productos que FALLAN ---------------------------------")
        for p, result in failed_list[: args.show_failures]:
            print(f"\n  {p['slug'][:55]}  score={result.score}")
            for r in result.reasons:
                print(f"    • {r}")

    if args.show_passing:
        print(f"\n-- {args.show_passing} productos que PASAN ----------------------------------")
        for p, result in passed_list[: args.show_passing]:
            print(f"\n  {p['slug'][:55]}  score={result.score}")
            story_preview = (p.get("story") or "")[:100]
            print(f"    story: {story_preview}…")


if __name__ == "__main__":
    main()
