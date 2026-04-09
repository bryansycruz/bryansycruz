# Módulo 8: System Prompts Avanzados

```{admonition} Tiempo de lectura estimado: 10 min
:class: tip
Aprenderás a diseñar system prompts robustos para asistentes especializados en construcción, y las técnicas avanzadas de prompting que marcan la diferencia entre una respuesta genérica y una respuesta técnica precisa.
```

---

## 1. Teoría: ¿Qué es un System Prompt?

Un **system prompt** es el conjunto de instrucciones persistentes que se envían al LLM antes de cualquier conversación con el usuario. Define la "personalidad", el rol, el comportamiento y los límites del modelo para toda la sesión.

### Diferencia entre system prompt y user prompt

```text
+---------------------------+
|      SYSTEM PROMPT        |  <-- Se envía UNA VEZ, persiste en toda la sesión
|  "Eres un ingeniero..."   |      El usuario no lo ve directamente
+---------------------------+
           |
           v
+---------------------------+
|       USER PROMPT         |  <-- Cada mensaje del usuario
|  "¿Cuánto cuesta X?"      |
+---------------------------+
           |
           v
+---------------------------+
|      RESPUESTA LLM        |  <-- Condicionada por ambos
+---------------------------+
```

### Por qué importa el system prompt

El mismo modelo con diferentes system prompts se comporta completamente diferente:

```python
import anthropic

client = anthropic.Anthropic()

# System prompt genérico
respuesta_generica = client.messages.create(
    model="claude-sonnet-4-6",
    system="Eres un asistente útil.",
    messages=[{"role": "user",
               "content": "¿Cuánto cuesta una columna de concreto?"}]
)
# Respuesta: "El costo de una columna varía según el país y el mercado..."

# System prompt especializado
respuesta_especializada = client.messages.create(
    model="claude-sonnet-4-6",
    system="""Eres un presupuestador experto en Colombia con 15 años de
experiencia en proyectos residenciales de Bogotá y Medellín.
Usa precios CAMACOL 2024. Responde siempre con: costo/m, rango
de variación y principales factores que afectan el precio.""",
    messages=[{"role": "user",
               "content": "¿Cuánto cuesta una columna de concreto?"}]
)
# Respuesta: "Columna de concreto 40x40 f'c=28MPa, altura 3.5m:
#            - Materiales: $380.000 - $420.000/m
#            - Mano de obra: $95.000 - $120.000/m
#            - Total: $475.000 - $540.000/m
#            Principales variaciones: zona sísmica, acabado, ..."
```

---

## 2. Analogía con la construcción

```{admonition} System Prompt = Especificaciones técnicas del proyecto
:class: note
Las especificaciones técnicas de un proyecto definen cómo deben ejecutarse todos los trabajos: materiales a usar, procesos a seguir, tolerancias aceptables, y qué está prohibido.

Un residente de obra que trabaja sin especificaciones toma decisiones arbitrarias. Uno que las tiene claras actúa de forma consistente y predecible.

El system prompt es exactamente eso: las "especificaciones técnicas" que definen cómo debe comportarse el LLM en cada situación.
```

---

## 3. Estructura de un system prompt efectivo

Un buen system prompt tiene cuatro componentes:

### Componente 1: Identidad

Define quién es el asistente con precisión. No basta con "eres un experto" — especifica experiencia, contexto y empresa:

```text
Eres el asistente de IA del Edificio Cumbre, proyecto residencial
de 12 pisos en Medellín (Colombia). Tienes acceso a los datos de
avance, costos y calidad del proyecto actualizados al día anterior.
```

### Componente 2: Capacidades

Lista explícita de qué puede y no puede hacer el asistente:

```text
CAPACIDADES:
- Consultar avance de obra por nivel y actividad (via BigQuery)
- Leer actas de comité de los últimos 6 meses (via Google Drive)
- Calcular variaciones de presupuesto por capítulo
- Identificar proveedores con incumplimientos recurrentes
```

### Componente 3: Comportamiento y formato

Define cómo debe responder, incluyendo prioridades y formato de salida:

```text
COMPORTAMIENTO:
- Prioriza SIEMPRE: seguridad > cronograma > costos
- Sé directo: conclusión primero, contexto después
- Cita la normativa NSR-10 cuando sea relevante
- Máximo 3 recomendaciones priorizadas por consulta
- Si no tienes datos suficientes, dilo explícitamente

FORMATO DE ALERTAS:
TIPO: [Retraso / Sobrecosto / Calidad / Seguridad]
SEVERIDAD: [Alta / Media / Baja]
IMPACTO: [cuantificado en días o COP]
ACCION: [específica con responsable y plazo]
```

### Componente 4: Restricciones

Lo que el asistente jamás debe hacer:

```text
RESTRICCIONES:
- No apruebes cambios estructurales ni de diseño
- No autorices pagos superiores a $50M COP sin aprobación
- No compartas información de costos con terceros no autorizados
- No tomes decisiones de personal
```

---

## 4. System prompt completo para residente de obra

```python
import anthropic

SYSTEM_PROMPT_OBRA = """Eres el asistente de IA del residente de obra del
Edificio Cumbre (Medellín, Colombia). El proyecto es un edificio residencial
de 12 pisos con 96 apartamentos. Avance actual: 68%.

IDENTIDAD:
- Rol: Asistente del residente de obra
- Proyecto: Edificio Cumbre, Medellín
- Empresa constructora: Constructora XYZ
- Vigencia de datos: actualizados al dia anterior

CAPACIDADES:
- Consultar avance por nivel y actividad
- Analizar variaciones de cronograma y presupuesto
- Revisar historial de calidad e inspecciones
- Identificar riesgos y alertas tempranas
- Generar minutas y actas de seguimiento

COMPORTAMIENTO:
- Prioriza siempre: seguridad > cronograma > costos
- Conclusion primero, contexto despues
- Cita NSR-10 cuando aplique estructuralmente
- Maximo 3 recomendaciones priorizadas
- Si no tienes datos suficientes, dilo explicitamente
- Usa COP (pesos colombianos) en todos los montos

FORMATO DE ALERTAS:
ALERTA [Tipo]: [descripcion breve]
- Severidad: Alta / Media / Baja
- Impacto: [cuantificado]
- Responsable: [cargo]
- Accion: [especifica con plazo]

RESTRICCIONES:
- No apruebes cambios estructurales
- No autorices pagos superiores a $50M COP
- No compartas informacion confidencial con externos
- No tomes decisiones de contratacion o despido"""


def consultar_obra(pregunta: str, historial: list = None):
    """Consulta al asistente de obra con historial de conversacion."""
    client = anthropic.Anthropic()

    mensajes = historial or []
    mensajes.append({"role": "user", "content": pregunta})

    respuesta = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        system=SYSTEM_PROMPT_OBRA,
        messages=mensajes
    )

    texto = respuesta.content[0].text
    mensajes.append({"role": "assistant", "content": texto})
    return texto, mensajes


# Ejemplo de conversacion multi-turno
historial = []

r1, historial = consultar_obra("¿Cuáles son los niveles con mayor retraso?", historial)
print("R1:", r1)

r2, historial = consultar_obra("¿Qué proveedor es responsable de ese retraso?", historial)
print("R2:", r2)  # Claude recuerda el contexto del nivel mencionado antes
```

---

## 5. Técnicas avanzadas de prompting

### Chain-of-Thought (Razonamiento paso a paso)

Útil cuando el problema requiere análisis estructurado:

```python
PROMPT_ANALISIS_RIESGO = """Analiza el siguiente hallazgo de inspección
paso a paso:

1. Identifica el tipo de problema (estructural, acabados, instalaciones)
2. Evalúa la normativa aplicable (NSR-10, NTC, Decreto 945)
3. Estima el impacto en cronograma y costo
4. Propón la solución técnica más adecuada
5. Asigna severidad: Alta / Media / Baja
6. Indica el nivel de confianza de tu análisis (%)

Hallazgo: {hallazgo}"""
```

### Few-Shot Learning (Aprendizaje con ejemplos)

Cuando necesitas que el modelo replique un formato exacto:

```python
PROMPT_CLASIFICACION_ACTA = """Clasifica el hallazgo de inspección con este formato exacto.

EJEMPLO 1:
Hallazgo: "Concreto de 3 columnas en nivel 5 presenta segregacion visible"
Clasificacion:
- Aspecto: Calidad estructural
- Score: 1/5
- Sentimiento: Critico
- Accion: Demolicion y refundicion inmediata

EJEMPLO 2:
Hallazgo: "Cilindros de prueba alcanzan 31 MPa, supera especificacion de 28 MPa"
Clasificacion:
- Aspecto: Calidad estructural
- Score: 5/5
- Sentimiento: Positivo
- Accion: Ninguna requerida

Ahora clasifica:
Hallazgo: "{hallazgo_nuevo}"
Clasificacion:"""
```

### Structured Output (Salidas JSON)

Cuando el output alimentará otro sistema:

```python
import json

PROMPT_JSON = """Analiza el acta de comité y extrae la información
en formato JSON estricto con esta estructura:

{
  "fecha": "YYYY-MM-DD",
  "nivel_avance": 0-100,
  "problemas": [
    {
      "tipo": "calidad|cronograma|costo|seguridad",
      "descripcion": "string",
      "severidad": "alta|media|baja",
      "responsable": "string",
      "plazo_dias": number
    }
  ],
  "acuerdos": ["string"],
  "proxima_reunion": "YYYY-MM-DD"
}

ACTA: {texto_acta}

Responde SOLO con el JSON, sin texto adicional."""

respuesta = client.messages.create(
    model="claude-sonnet-4-6",
    system="Eres un extractor de datos preciso. Responde solo con JSON válido.",
    messages=[{"role": "user", "content": PROMPT_JSON.format(texto_acta=acta)}]
)

datos = json.loads(respuesta.content[0].text)
```

---

## 6. Evaluar y mejorar tus prompts

Un buen prompt se mide. Usa este ciclo:

```text
1. Escribe el prompt inicial
2. Prueba con 10-20 casos reales
3. Identifica patrones de fallo
4. Agrega ejemplos (few-shot) o restricciones
5. Repite hasta tener >90% de respuestas correctas
```

```python
# Evaluador básico de prompts
def evaluar_prompt(prompt: str, casos: list[dict]) -> dict:
    """
    casos: lista de {'input': '...', 'esperado': '...', 'criterio': fn}
    """
    resultados = []
    for caso in casos:
        respuesta = llamar_llm(prompt, caso["input"])
        correcto = caso["criterio"](respuesta)
        resultados.append({
            "input": caso["input"],
            "correcto": correcto,
            "respuesta": respuesta[:100]
        })

    accuracy = sum(r["correcto"] for r in resultados) / len(resultados)
    print(f"Accuracy: {accuracy:.1%} ({sum(r['correcto'] for r in resultados)}/{len(resultados)})")
    return resultados
```

---

```{admonition} Recursos
:class: seealso
- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
```

**Siguiente:** [Fine-Tuning de Modelos](../fine_tuning/01_fine_tuning.md)
