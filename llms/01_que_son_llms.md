# ¿Qué son los LLMs?

```{admonition} Definición rápida
:class: tip
**Large Language Models (LLMs)** son modelos de IA entrenados en billones de palabras para entender y generar lenguaje natural. Son la tecnología detrás de ChatGPT, Claude y Gemini.

"Large" se refiere a su tamaño: de 70.000 millones a más de 1 billón de parámetros.
```

## ¿Cómo funcionan?

Un LLM predice la siguiente palabra más probable dado un contexto:

```
Entrada: "El edificio tiene [___] pisos"

1. Tokenización:
 ["El", "edificio", "tiene", "[___]", "pisos"]

2. Atención (self-attention):
 "edificio" presta atención a: "tiene" (alta), "pisos" (alta)

3. Predicción:
 {"diez": 35%, "cinco": 28%, "veinte": 15%, ...}

Salida: "El edificio tiene diez pisos"
```

---

## Evolución histórica

```
2017 Transformers inventados (Google)
2018 BERT — 340M parámetros
2020 GPT-3 — 175B parámetros ¡Revolución!
2022 ChatGPT lanzado Adopción masiva
2023 GPT-4, Claude 3, Llama 3
2024 Claude 3.5, GPT-4 Turbo, Llama 3.3 70B
2025 Claude Sonnet 4.6, modelos multimodales avanzados
```

---

## Modelos más importantes para construcción

| Modelo | Empresa | Ventajas para AEC | Costo |
|--------|---------|-------------------|-------|
| **Claude Sonnet 4.6** | Anthropic | Contexto 200K tokens, razonamiento profundo, excelente código | $3/1M tokens |
| **GPT-4 Turbo** | OpenAI | Multimodal (texto+imágenes), muy conocido | $10/1M tokens |
| **Gemini 1.5 Pro** | Google | Contexto 1M tokens, integración Google Workspace | $1.25/1M tokens |
| **Llama 3.3 70B** | Meta | **GRATIS**, open-source, se puede correr local | **GRATIS** |

---

## Capacidades clave

### Comprensión contextual — Análisis de actas

```python
import anthropic

client = anthropic.Anthropic(api_key="tu_api_key")

prompt = """Analiza esta acta de comité de obra:

"El contratista reporta avance del 67% en el nivel 5.
Se identificaron 3 columnas con segregación en concreto.
El supervisor exige demolición y refundición. El contratista
solicita reparación con resina epoxi para ahorrar 2 semanas."

Extrae:
1. Problema identificado
2. Propuesta del contratista
3. Riesgo de aceptar la propuesta
4. Recomendación técnica"""

respuesta = client.messages.create(
 model="claude-sonnet-4-6",
 max_tokens=1000,
 messages=[{"role": "user", "content": prompt}]
)

print(respuesta.content[0].text)
```

**Salida generada:**
```
1. PROBLEMA: Segregación de concreto en 3 columnas del nivel 5.
 Indica deficiencia en colocación o vibrado. Afecta integridad estructural.

2. PROPUESTA DEL CONTRATISTA:
 Reparación con resina epoxi en lugar de demolición.
 Objetivo: ahorrar 2 semanas de cronograma.

3. RIESGO:
 - Reparación superficial no resuelve segregación interna.
 - Compromete capacidad estructural a largo plazo.
 - Responsabilidad legal si falla en el futuro.
 - Incumple NSR-10 para elementos críticos.

4. RECOMENDACIÓN:
 RECHAZAR la propuesta. Exigir ensayos no destructivos
 (esclerometría + ultrasonido). Si resistencia < 80% f'c
  DEMOLER y REFUNDIR. Documentar con sustento técnico.
```

### Razonamiento financiero multi-paso

```python
prompt = """Un proyecto tiene:
- 120 apartamentos a $250M COP c/u
- Costo construcción: $150M por apto
- Gastos generales: 12% del costo
- Financiación: 18% anual, 24 meses

Calcula: utilidad bruta, utilidad neta, margen neto y el
precio mínimo de venta para lograr 15% de margen neto."""
```

---

## Limitaciones importantes

```{warning}
**Alucinaciones:** Los LLMs pueden inventar datos con total confianza.

Para datos específicos de tu proyecto (costos, fechas, medidas),
**SIEMPRE inclúyelos en el prompt**. No asumas que el modelo los conoce.

**Fecha de corte:** Los modelos no conocen eventos recientes más allá
de su fecha de entrenamiento. Para precios actuales de materiales,
combínalos con búsqueda web o proporciona los datos tú mismo.

**Confidencialidad:** No envíes contratos, datos financieros sensibles
o información personal a APIs públicas sin revisar los términos de servicio.
```

| Limitación | Solución |
|-----------|----------|
| Inventa datos de tu proyecto | Incluye los datos en el prompt |
| Información desactualizada | Proporciona precios/normas actuales |
| Datos confidenciales | Usa modelos locales (Llama) o contratos enterprise |
| Cálculos estructurales críticos | Siempre verifica con ingeniero responsable |

---

```{admonition} Libros recomendados
:class: seealso
- **Generative Deep Learning** — capítulos 8-9 (Transformers, GPT)
- [Anthropic Documentation](https://docs.anthropic.com/)
- [Prompt Engineering Guide](https://www.promptingguide.ai/) — gratis en línea
```

**Siguiente:** [Uso de APIs de LLMs ](02_apis_llms.md)
