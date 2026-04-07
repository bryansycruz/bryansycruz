# Ingeniería de Prompts

```{admonition} ¿Qué es un prompt?
:class: tip
Un **prompt** es la instrucción que le das a un modelo de IA. La calidad de la respuesta depende casi completamente de qué tan bien formules tu pregunta.

La ingeniería de prompts es la habilidad de escribir instrucciones claras, específicas y estructuradas para obtener resultados útiles y precisos.
```

---

## Estructura de un prompt efectivo

Un buen prompt para uso profesional en construcción tiene estas partes:

```
[ROL] "Actúa como ingeniero civil con 15 años de experiencia"
[CONTEXTO] "Estoy revisando un edificio de 8 pisos en zona sísmica"
[TAREA] "Genera una especificación técnica para las columnas"
[FORMATO] "Formato: tabla + recomendación. Máximo 300 palabras"
[RESTRICCIONES] "Normativa NSR-10, nivel técnico intermedio"
```

---

## Técnicas con ejemplos AEC

### Role Prompting

```python
prompt = """Actúa como director de obra con 20 años de experiencia
en proyectos residenciales en Colombia.

Tengo un retraso de 3 semanas en el nivel 8 por lluvias continuas.
¿Cuáles son mis opciones para recuperar el tiempo sin incrementar
significativamente el costo?"""
```

### Chain-of-Thought (razonamiento paso a paso)

```python
prompt = """Un proyecto tiene:
- 120 apartamentos
- Precio venta: $250M COP por apto
- Costo construcción: $150M COP por apto
- Gastos generales: 12% del costo
- Financiación: 18% anual, plazo 24 meses

Calcula paso a paso:
1. Utilidad bruta
2. Costos financieros
3. Utilidad neta
4. Margen neto
5. Precio mínimo para lograr 15% de margen"""
```

### Few-Shot (con ejemplos)

```python
prompt = """Clasifica cada hallazgo de inspección según su nivel de
riesgo: CRÍTICO, ALTO, MEDIO, BAJO.

Ejemplo:
Hallazgo: "Grieta vertical > 5mm en columna estructural"
Clasificación: CRÍTICO — riesgo estructural inmediato

Hallazgo: "Pintura desprendida en zona común"
Clasificación: BAJO — estética, sin riesgo

Ahora clasifica:
Hallazgo: "Fisuras capilares en losa del nivel 7"
Clasificación:"""
```

---

## System Prompts — Personalidad permanente del modelo

Un **system prompt** define el comportamiento del modelo para toda la conversación. Es ideal para crear asistentes especializados en tu proyecto.

```python
import anthropic

SYSTEM_PROMPT = """Eres un asistente de IA especializado en gestión de
proyectos de construcción en Colombia.

TU ROL:
- Analizar datos de avance de obra
- Detectar alertas tempranas (retrasos, sobrecostos, conflictos)
- Recomendar acciones correctivas basadas en mejores prácticas

TU CONOCIMIENTO INCLUYE:
- Normativa NSR-10
- Gestión de contratos FIDIC
- Análisis de valor ganado (Earned Value)
- Resolución de conflictos en obra

DIRECTRICES:
1. Sé conciso pero completo
2. Prioriza seguridad sobre costos
3. Cita normativa cuando sea relevante
4. Sugiere máximo 3 acciones priorizadas
5. Usa términos técnicos colombianos

NUNCA:
- Inventes datos que no estén en el contexto
- Recomiendes acciones ilegales o inseguras"""

client = anthropic.Anthropic(api_key="tu_api_key")

respuesta = client.messages.create(
 model="claude-sonnet-4-6",
 max_tokens=2000,
 system=SYSTEM_PROMPT,
 messages=[
 {"role": "user",
 "content": "El nivel 8 lleva 3 semanas de retraso, ¿qué hago?"}
 ]
)

print(respuesta.content[0].text)
```

---

## Generación de código técnico

La IA puede escribir scripts completos para análisis de obra:

```python
prompt = """Escribe un script Python que:
1. Lea un CSV de Revit con columnas: elemento, nivel, cantidad, costo_unitario
2. Calcule el costo total por nivel
3. Identifique el nivel más costoso
4. Genere un gráfico de barras con matplotlib
5. Exporte resultados a Excel

El CSV tiene esta estructura:
elemento,nivel,cantidad,costo_unitario
Columna C1,Nivel 1,20,850000
Viga V1,Nivel 1,45,320000"""
```

---

## Errores comunes y cómo evitarlos

```{warning}
**Alucinaciones:** Los modelos pueden inventar datos que suenan reales.

Pregunta riesgosa:
"¿Cuál fue el costo del Edificio Cumbre en Medellín?"
 El modelo podría inventar una cifra si no tiene esa información.

Pregunta segura:
"Dado que el costo fue $18.000M COP y el plazo fue 24 meses,
calcula el flujo de caja mensual estimado."

**Regla:** Para datos específicos de tu proyecto, siempre proporciónalos
en el prompt. No asumas que el modelo los conoce.
```

| Error | Causa | Solución |
|-------|-------|----------|
| Respuesta demasiado genérica | Prompt vago | Agrega contexto específico del proyecto |
| Información inventada | El modelo no conoce tus datos | Incluye los datos en el prompt |
| Formato inadecuado | No especificaste el formato | Pide explícitamente tabla, lista, JSON |
| Respuesta muy larga | Sin límite de longitud | Añade "máximo N palabras" |

---

```{admonition} Tip para colombianos en construcción
:class: note
Incluye siempre la normativa local en tus prompts: **NSR-10**, **NTC**, **Decreto 945**, etc. Los modelos conocen estas normas y pueden citarlas correctamente cuando se las mencionas.
```
