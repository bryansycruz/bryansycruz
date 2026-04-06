# APIs de LLMs — Uso programático

En este capítulo verás cómo conectarte a los principales modelos desde Python para automatizar tareas de construcción.

---

## Anthropic Claude (recomendado)

```python
import anthropic

client = anthropic.Anthropic(api_key="tu_api_key_aqui")

# Consulta básica
respuesta = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1000,
    messages=[
        {"role": "user",
         "content": "¿Cuál es la diferencia entre concreto armado y pretensado?"}
    ]
)

print(respuesta.content[0].text)
```

### Conversación con historial (multi-turno)

```python
conversacion = []

def preguntar(pregunta):
    conversacion.append({"role": "user", "content": pregunta})

    respuesta = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        messages=conversacion
    )

    texto = respuesta.content[0].text
    conversacion.append({"role": "assistant", "content": texto})
    return texto

# Claude recuerda todo el contexto anterior
r1 = preguntar("¿Qué es el momento flector?")
r2 = preguntar("¿Cómo se calcula en una viga simplemente apoyada con carga uniforme?")
r3 = preguntar("Dame un ejemplo numérico: viga de 6m, carga 5 kN/m")
```

---

## Groq — Llama 3.3 GRATIS y ultra-rápido

```python
from groq import Groq

client = Groq(api_key="tu_api_key_groq")  # cuenta gratis en groq.com

respuesta = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {"role": "user",
         "content": "Resume esta acta de comité: [pega el texto aquí]"}
    ],
    max_tokens=1000
)

print(respuesta.choices[0].message.content)
```

```{admonition} 💡 ¿Por qué Groq para empezar?
:class: tip
- Capa gratuita generosa (millones de tokens por día)
- Velocidad extremadamente rápida
- Llama 3.3 70B es excelente para tareas de construcción
- Ideal para prototipos y aprendizaje
```

---

## OpenAI GPT

```python
from openai import OpenAI

client = OpenAI(api_key="tu_api_key")

respuesta = client.chat.completions.create(
    model="gpt-4-turbo",
    messages=[
        {"role": "system",
         "content": "Eres un ingeniero civil experto en estructuras."},
        {"role": "user",
         "content": "Explica el diseño de una losa aligerada"}
    ],
    max_tokens=1500
)

print(respuesta.choices[0].message.content)
```

---

## Caso práctico: Analizar especificaciones técnicas en PDF

```python
import anthropic
import PyPDF2

def analizar_especificacion(pdf_path):
    # 1. Leer PDF
    with open(pdf_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        texto = "".join(page.extract_text() for page in reader.pages)

    # 2. Analizar con Claude
    client = anthropic.Anthropic(api_key="tu_api_key")

    prompt = f"""Analiza esta especificación técnica y extrae:

1. Alcance del trabajo
2. Materiales especificados (marca, norma, características)
3. Procedimientos constructivos clave
4. Criterios de aceptación / rechazo
5. Posibles conflictos o ambigüedades
6. Normativa referenciada

Especificación:
{texto}"""

    respuesta = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}]
    )

    return respuesta.content[0].text

# Usar
analisis = analizar_especificacion("especificacion_concreto.pdf")
print(analisis)
```

---

## Caso práctico: Generador de especificaciones técnicas

```python
import anthropic
from docx import Document

class GeneradorEspecificaciones:
    def __init__(self, api_key):
        self.client = anthropic.Anthropic(api_key=api_key)

    def generar(self, tipo_elemento, parametros):
        params_texto = "\n".join(f"- {k}: {v}" for k, v in parametros.items())

        prompt = f"""Genera una especificación técnica detallada para:

Elemento: {tipo_elemento}
Parámetros:
{params_texto}

Incluye:
1. Descripción general
2. Materiales requeridos
3. Procedimiento constructivo
4. Control de calidad
5. Normativa aplicable (NSR-10 Colombia)
6. Tolerancias

Formato: profesional y conciso."""

        respuesta = self.client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=3000,
            messages=[{"role": "user", "content": prompt}]
        )
        return respuesta.content[0].text

    def exportar_word(self, contenido, nombre_archivo):
        doc = Document()
        doc.add_heading("Especificación Técnica", 0)
        for parrafo in contenido.split("\n\n"):
            doc.add_paragraph(parrafo)
        doc.save(nombre_archivo)
        print(f"✅ Guardado: {nombre_archivo}")

# Uso
gen = GeneradorEspecificaciones(api_key="tu_api_key")

spec = gen.generar("columna", {
    "sección": "40×40 cm",
    "altura": "3.5 m",
    "carga axial": "120 toneladas",
    "f'c": "28 MPa"
})

gen.exportar_word(spec, "spec_columna_C1.docx")
```

---

## Comparación de APIs

| | Anthropic Claude | Groq (Llama) | OpenAI GPT |
| -- | --------------- | ----------- | ---------- |
| **Costo** | $3/1M tokens | **Gratis** | $10/1M tokens |
| **Velocidad** | Rápida | ⚡ Muy rápida | Rápida |
| **Contexto** | 200K tokens | 32K tokens | 128K tokens |
| **Calidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Para empezar** | ✅ | ✅✅ Ideal | ✅ |

---

```{admonition} 🔑 ¿Dónde consigo las API keys?
:class: note
- **Anthropic:** [console.anthropic.com](https://console.anthropic.com)
- **Groq (gratis):** [console.groq.com](https://console.groq.com)
- **OpenAI:** [platform.openai.com](https://platform.openai.com)

**Buena práctica:** Guarda las keys en variables de entorno, nunca en el código:
```bash
export ANTHROPIC_API_KEY="<tu-clave-anthropic>"
export GROQ_API_KEY="<tu-clave-groq>"
```
