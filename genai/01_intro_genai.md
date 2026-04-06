# ✨ IA Generativa

```{admonition} ¿Qué diferencia a la IA Generativa del ML tradicional?
:class: tip
- **ML tradicional:** Analiza y predice → *"¿Hay una grieta?"*
- **IA Generativa:** Crea contenido nuevo → *"Genera un render del edificio"*
```

## Definición

**IA Generativa** es una rama de IA que **crea contenido nuevo** — texto, imágenes, código, audio, modelos 3D — aprendiendo los patrones de datos existentes.

---

## ¿Qué puede generar?

| Tipo | Modelos | Uso en construcción |
|------|---------|---------------------|
| **Texto** | Claude, GPT-4, Llama | Actas, especificaciones, propuestas |
| **Imágenes** | DALL-E, Midjourney, Stable Diffusion | Renders, conceptos arquitectónicos |
| **Código** | GitHub Copilot, Claude | Scripts de automatización y análisis |
| **3D** | TripoSR | Prototipos y alternativas de diseño |
| **Audio** | Whisper | Transcripción de reuniones de obra |
| **Video** | Runway | Marketing, walkthroughs de proyectos |

---

## Analogía para arquitectos

```{admonition} 🏗️ GenAI es como un pasante ultra-capacitado
:class: note
Le dices: *"Necesito un edificio residencial de 8 pisos, moderno, para clima cálido, presupuesto medio."*

En lugar de darte 1 opción, en 5 minutos te genera 10 propuestas conceptuales. Tú escoges la que te gusta, pides variaciones ("más ventanas", "menos altura"), y refinan el diseño juntos.

No reemplaza al arquitecto titular — pero acelera 100× la fase de concepto.
```

---

## Arquitecturas fundamentales

### 1. Transformers — La base de todo

Inventado por Google en 2017. El componente clave es el **mecanismo de atención**:

```
Frase: "El edificio es muy [___]"

Atención analiza:
- "edificio" → relacionado con: alto, moderno, grande
- "muy"      → indica intensificador
- Contexto   → construcción

Predicción: "alto" (65%), "grande" (20%), "moderno" (10%)
```

### 2. GANs — Redes Generativas Adversariales

Dos redes compitiendo entre sí:

```
Generador:      "Aquí está un render de edificio"
Discriminador:  "Es falso, las sombras no corresponden"
Generador:      "Ok, corrijo las sombras..."
Discriminador:  "Ahora las sombras no coinciden con el sol"
...
(1.000.000 iteraciones después)
Discriminador:  "No puedo distinguirlo de un render real" ✓
```

### 3. Modelos de Difusión — Los más potentes hoy

Aprenden a "limpiar" imágenes del ruido hacia contenido:

```
Entrenamiento:
Imagen real → + ruido → + más ruido → ... → ruido puro

Generación:
Ruido puro  → - ruido → - más ruido → ... → imagen nueva
```

---

## Ejemplo: Generar especificaciones técnicas con IA

```python
import anthropic

client = anthropic.Anthropic(api_key="tu_api_key")

prompt = """Genera una especificación técnica para fundaciones de un
edificio de 8 pisos en zona sísmica:
- Tipo de suelo: arcilla
- Carga estimada: 150 toneladas/columna
- Normativa: NSR-10 Colombia"""

mensaje = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=2000,
    messages=[{"role": "user", "content": prompt}]
)

print(mensaje.content[0].text)
```

**Salida generada (fragmento):**
```
ESPECIFICACIONES TÉCNICAS - SISTEMA DE FUNDACIÓN

1. ALCANCE
   Sistema de fundación profunda mediante pilotes para edificio de 8 pisos...

2. DISEÑO ESTRUCTURAL
   - Tipo: Pilotes perforados de concreto reforzado
   - Diámetro: 0.80 m  |  Profundidad: 18-22 m
   - Capacidad portante: 180 ton/pilote
   - f'c: 28 MPa (4000 PSI)
   - Acero: 12 varillas #8 + espirales #4 @ 15 cm

3. CONSIDERACIONES SÍSMICAS (NSR-10)
   - Zona: Alta amenaza sísmica  |  Coeficiente Aa: 0.25
   ...
```

---

## Prompting efectivo

La diferencia entre una respuesta genérica y una respuesta técnica precisa está en cómo formulas la pregunta.

❌ **Malo:**
```
"Explica las fundaciones"
```

✅ **Bueno:**
```
"Actúa como ingeniero civil especialista en fundaciones.

Explica los 3 tipos principales de fundaciones (superficiales,
profundas, especiales) para un edificio de 15 pisos en Bogotá:

1. Descripción técnica de cada tipo
2. Ventajas y desventajas
3. Rango de costos aproximados por m²
4. Normativa NSR-10 aplicable

Formato: tabla comparativa + recomendación fundamentada.
Audiencia: director de obra sin formación en estructuras."
```

**Técnicas clave:**

| Técnica | Descripción | Ejemplo |
|---------|-------------|---------|
| **Role prompting** | Define el rol del modelo | *"Actúa como ingeniero estructural"* |
| **Few-shot** | Da ejemplos de entrada-salida | *"Entrada: X → Salida: Y. Ahora para Z..."* |
| **Chain-of-thought** | Pide razonamiento paso a paso | *"Explica paso a paso tu razonamiento"* |
| **Formato específico** | Pide tabla, JSON, lista | *"Responde en tabla comparativa"* |
| **Constraints** | Limita longitud o nivel | *"Máximo 200 palabras, nivel técnico medio"* |

---

```{admonition} 📚 Libros recomendados
:class: seealso
- **Generative Deep Learning** (David Foster) — libro completo
- **Hands-on Machine Learning** — capítulos 15-17
```

**Siguiente:** [Prompting avanzado →](02_prompting.md)
