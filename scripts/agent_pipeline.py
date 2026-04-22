"""
KS Promocionales — Pipeline de 4 Agentes de IA
Transforma un producto con contenido de plantilla en uno con contenido genuino.

Arquitectura:
    Investigador → Copywriter → Especialista SEO → Evaluador (Crítico)
                                      ↑                    |
                                      └──── retry (max 2) ──┘

Cada agente es una llamada independiente a la API de Anthropic con un
system prompt especializado y prompt caching sobre el contexto de marca.

Dependencias:
    pip install anthropic
    ANTHROPIC_API_KEY en variables de entorno o .env

Uso desde código:
    from agent_pipeline import ProductPipeline
    pipeline = ProductPipeline()
    enriched = pipeline.enrich(product_dict)
    # enriched tiene story, shortDescription, seoTitle, seoDescription actualizados
    # y los campos is_ai_optimized, quality_score, last_ai_update añadidos
"""

import os
import json
import time
import re
from datetime import datetime, timezone
from typing import Optional

import anthropic

from content_evaluator import ContentEvaluator, EvalResult

# ── Configuración del modelo ──────────────────────────────────────────────────
DEFAULT_MODEL  = "claude-haiku-4-5"   # rápido y económico (equivalente a Flash)
PRIORITY_MODEL = "claude-sonnet-4-6"  # mayor calidad (equivalente a Pro)

MAX_RETRIES    = 2    # reintentos del loop Copywriter → Evaluador
REQUEST_DELAY  = 0.5  # segundos entre llamadas a la API

# ── Contexto de marca (inyectado en todos los agentes vía system prompt) ──────
BRAND_CONTEXT = """
KS Promocionales es una empresa ecuatoriana especializada en artículos
promocionales y regalos corporativos personalizados para empresas en Ecuador
y Colombia. Sus clientes son directores de marketing, gerentes de RRHH y
emprendedores que quieren fortalecer su marca a través de regalos de calidad.
Todos los productos se personalizan con el logo o mensaje de la empresa cliente.
El tono de la marca es profesional pero cercano. Los productos se envían a
Quito, Guayaquil, Cuenca, Bogotá y Medellín.
""".strip()

# ── System prompts estables (cacheados por Anthropic) ─────────────────────────
_SYS_INVESTIGADOR = f"""Eres un analista de mercado especializado en productos promocionales B2B
para Latinoamérica. Tu tarea es investigar un producto y producir contexto útil
para un copywriter.

Contexto de marca:
{BRAND_CONTEXT}"""

_SYS_COPYWRITER = f"""Eres un copywriter especializado en marketing B2B para empresas
latinoamericanas. Escribes con un tono profesional pero cercano.

Contexto de marca:
{BRAND_CONTEXT}

PROHIBIDO usar estas frases (son frases de plantilla detectadas):
- "que tus clientes conservarán"
- "Personalización incluida sin costo adicional"
- "lo último en tendencias"
- "posiciona a tu marca como innovadora"
- "el elemento sorpresa que todo marketero busca"
- cualquier variante de "Destaca tu marca con [nombre del producto]"

Responde ÚNICAMENTE con un objeto JSON válido con estas claves:
"story", "shortDescription", "features" (array), "useCases" (array)"""

_SYS_SEO = """Eres un especialista en SEO para e-commerce de productos
promocionales en Ecuador y Colombia."""


class ProductPipeline:
    """
    Orquesta los 4 agentes para enriquecer un producto con contenido genuino.

    Args:
        model: modelo de Anthropic a usar (default: claude-haiku-4-5)
        verbose: imprimir trazas de cada agente
    """

    def __init__(self, model: str = DEFAULT_MODEL, verbose: bool = False):
        self.client    = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
        self.model     = model
        self.verbose   = verbose
        self.evaluator = ContentEvaluator()

    # ── API pública ───────────────────────────────────────────────────────────

    def enrich(self, product: dict) -> dict:
        """
        Toma un producto (tal como está en products.json) y retorna una copia
        con los campos de contenido actualizados y los campos de calidad añadidos.
        No modifica el dict original.
        """
        p = dict(product)  # shallow copy — no modifica el original

        name     = p.get("name", "")
        category = p.get("categoryId", "")

        self._log(f"\n{'─'*60}")
        self._log(f"Producto : {name[:55]}")
        self._log(f"Categoría: {category}")

        # ── Agente 1: Investigador ────────────────────────────────────────────
        research = self._agent_investigador(name, category)
        self._log(f"[1-Investigador] {len(research)} chars de contexto")

        # ── Loop Copywriter → Evaluador (max MAX_RETRIES + 1 intentos) ───────
        feedback: Optional[str] = None
        last_result: Optional[EvalResult] = None
        copy: dict = {}
        seo: dict = {}

        for attempt in range(MAX_RETRIES + 1):
            # ── Agente 2: Copywriter ──────────────────────────────────────────
            copy = self._agent_copywriter(name, category, research, feedback)
            self._log(
                f"[2-Copywriter] intento {attempt+1} | "
                f"story={len(copy.get('story',''))} "
                f"short={len(copy.get('shortDescription',''))}"
            )

            # ── Agente 3: Especialista SEO ────────────────────────────────────
            seo = self._agent_seo(name, category, copy)
            self._log(
                f"[3-SEO] title={len(seo.get('seoTitle',''))} "
                f"desc={len(seo.get('seoDescription',''))}"
            )

            # Combinar copy + seo en el producto candidato
            candidate = {**p, **copy, **seo}

            # ── Agente 4: Evaluador (Crítico) ─────────────────────────────────
            result = self.evaluator.evaluate(candidate)
            last_result = result
            self._log(f"[4-Evaluador] {result.summary()}")

            if result.passed:
                break

            if attempt < MAX_RETRIES:
                feedback = result.feedback
                self._log(f"  → Retry {attempt+2}/{MAX_RETRIES+1}: {feedback[:80]}…")
                time.sleep(REQUEST_DELAY)
            else:
                self._log(f"  → Agotados reintentos. Guardando con score={result.score}")

        # Aplicar el mejor candidato al producto
        p.update(copy)
        p.update(seo)

        # Campos de metadatos de calidad
        p["is_ai_optimized"] = last_result.passed if last_result else False
        p["quality_score"]   = last_result.score  if last_result else 0
        p["last_ai_update"]  = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        return p

    # ── Agentes internos ──────────────────────────────────────────────────────

    def _agent_investigador(self, name: str, category: str) -> str:
        """
        Genera contexto de uso real del producto para que el Copywriter
        tenga material concreto con qué trabajar.
        """
        user_prompt = f"""Producto: {name}
Categoría en catálogo: {category}

Produce un párrafo de 150–200 palabras que responda:
1. ¿Para qué se usa este tipo de producto en el mundo corporativo?
2. ¿Qué tipo de empresas lo regalan y en qué ocasiones?
3. ¿Por qué un cliente de Ecuador o Colombia elegiría este producto para
   fortalecer su marca?
4. Un detalle específico o dato interesante sobre el producto.

Responde SOLO con el párrafo de investigación, sin títulos ni listas."""

        return self._call_api(_SYS_INVESTIGADOR, user_prompt, max_tokens=350)

    def _agent_copywriter(
        self,
        name: str,
        category: str,
        research: str,
        feedback: Optional[str],
    ) -> dict:
        """
        Escribe story y shortDescription únicos y específicos al producto.
        Si hay feedback del Evaluador, lo incorpora.
        Returns: dict con keys 'story', 'shortDescription', 'features', 'useCases'
        """
        feedback_block = ""
        if feedback:
            feedback_block = f"""
CORRECCIONES del evaluador (intento anterior fallido):
{feedback}

Aplica estas correcciones en este nuevo intento.
"""

        user_prompt = f"""Producto: {name}
Categoría: {category}

Investigación de mercado (úsala como base):
{research}
{feedback_block}
Escribe el contenido del producto siguiendo estas reglas ESTRICTAS:
- story: 2–3 párrafos (mínimo 400 caracteres en total). Cuenta por qué este
  producto es valioso para las empresas, cómo funciona en el mundo real, qué
  lo hace memorable. USA el contexto de investigación — no inventes datos.
- shortDescription: 1 oración de 120–160 caracteres que capture la esencia
  del producto para una empresa cliente en Ecuador o Colombia.
- features: lista de 4 características ESPECÍFICAS de este tipo de producto
  (no genéricas como "calidad premium" sin contexto).
- useCases: lista de 3 casos de uso corporativos concretos."""

        raw = self._call_api(_SYS_COPYWRITER, user_prompt, max_tokens=700)
        return self._parse_json(raw, fallback_product_name=name)

    def _agent_seo(self, name: str, category: str, copy: dict) -> dict:
        """
        Optimiza seoTitle y seoDescription para búsquedas locales EC/CO.
        Returns: dict con keys 'seoTitle', 'seoDescription', 'keywords'
        """
        story_preview = (copy.get("story") or "")[:300]

        user_prompt = f"""Producto: {name}
Categoría: {category}
Contenido generado (resumen):
{story_preview}

Crea los metadatos SEO siguiendo estas reglas:
- seoTitle: máximo 60 caracteres. Incluye el nombre del producto y una
  palabra clave geográfica (Ecuador o Colombia). No termines con
  "| KS Promocionales Ecuador" a menos que quepan todos los elementos.
  Ejemplo de formato: "{name} Personalizado | Ecuador y Colombia"
- seoDescription: 130–155 caracteres. Menciona personalización, uno de los
  países (Ecuador o Colombia), y una acción (cotiza, solicita, pide).
  Debe ser diferente a la shortDescription.
- keywords: string con 4–6 términos separados por coma. Incluir el nombre
  del producto, categoría, y al menos una ciudad (Quito, Guayaquil, Bogotá
  o Medellín).

Responde ÚNICAMENTE con un objeto JSON válido con estas claves:
"seoTitle", "seoDescription", "keywords"

Verifica que seoTitle tenga como máximo 60 caracteres antes de responder."""

        raw = self._call_api(_SYS_SEO, user_prompt, max_tokens=300)
        return self._parse_json(raw, fallback_product_name=name)

    # ── Utilidades ────────────────────────────────────────────────────────────

    def _call_api(self, system: str, user_prompt: str, max_tokens: int = 500) -> str:
        """Llama a la API de Anthropic con reintentos y backoff exponencial.
        Usa cache_control en el system prompt para reducir costos en retries."""
        MAX_ATTEMPTS = 5
        last_error = None

        for attempt in range(MAX_ATTEMPTS):
            try:
                time.sleep(REQUEST_DELAY)
                response = self.client.messages.create(
                    model=self.model,
                    max_tokens=max(max_tokens, 500),
                    system=[{
                        "type": "text",
                        "text": system,
                        "cache_control": {"type": "ephemeral"},
                    }],
                    messages=[{"role": "user", "content": user_prompt}],
                )
                return response.content[0].text.strip()

            except anthropic.RateLimitError as e:
                last_error = e
                wait = 20 * (attempt + 1)
                if attempt < MAX_ATTEMPTS - 1:
                    print(f"\n  [429] Rate limit. Esperando {wait}s…", flush=True)
                    time.sleep(wait)
                else:
                    break

            except anthropic.APIStatusError as e:
                last_error = e
                if e.status_code >= 500:
                    wait = 30 * (2 ** attempt)
                    if attempt < MAX_ATTEMPTS - 1:
                        print(
                            f"\n  [{e.status_code}] Error del servidor. "
                            f"Esperando {wait}s antes de reintentar ({attempt+2}/{MAX_ATTEMPTS})…",
                            flush=True,
                        )
                        time.sleep(wait)
                    else:
                        break
                else:
                    raise  # 4xx no recuperables — propagar inmediatamente

            except Exception as e:
                last_error = e
                if attempt == MAX_ATTEMPTS - 1:
                    break
                self._log(f"  [Error] {e} — reintentando…")
                time.sleep(10)

        raise RuntimeError(
            f"API de Anthropic falló después de {MAX_ATTEMPTS} intentos: {last_error}"
        )

    def _parse_json(self, raw: str, fallback_product_name: str = "") -> dict:
        """
        Extrae el primer bloque JSON de la respuesta del modelo.
        Si falla el parsing, retorna un dict vacío para que el Evaluador
        detecte el fallo y dispare el retry.
        """
        # Quitar wrapper ```json ... ``` si lo hay
        match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", raw)
        if match:
            raw = match.group(1).strip()
        else:
            # Extraer desde la primera { hasta la última }
            start = raw.find('{')
            end   = raw.rfind('}')
            if start != -1 and end > start:
                raw = raw[start:end + 1]

        try:
            return json.loads(raw)
        except (json.JSONDecodeError, ValueError):
            self._log(f"  [ParseError] No se pudo parsear JSON: {raw[:80]}…")
            return {}

    def _log(self, msg: str):
        if self.verbose:
            print(msg)
