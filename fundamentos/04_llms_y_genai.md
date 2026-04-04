# LLMs e IA Generativa

## ¿Qué son los Large Language Models (LLMs)?

Los LLMs son redes neuronales de tipo **Transformer** entrenadas con cantidades masivas de texto. Existen modelos comerciales y de código abierto con distintas capacidades.

### ¿Cómo funcionan (simplificado)?

```
"El concreto de 4000 PSI tiene una resistencia de" → [LLM] → "28 MPa aproximadamente"
```

El modelo no "sabe" ingeniería — ha aprendido **patrones estadísticos** de billones de palabras. Predice la siguiente palabra más probable dada una secuencia de entrada.

### Arquitectura Transformer (vista de alto nivel)

```
       Entrada (tokens)
            │
    ┌───────▼───────┐
    │   Embedding    │  ← Convierte palabras a vectores numéricos
    │   + Posición   │
    └───────┬───────┘
            │
    ┌───────▼───────┐
    │  Self-Attention│  ← "¿Qué palabras son relevantes entre sí?"
    │  (multi-head)  │
    └───────┬───────┘
            │  × N capas
    ┌───────▼───────┐
    │  Feed-Forward  │  ← Procesamiento no-lineal
    └───────┬───────┘
            │
    ┌───────▼───────┐
    │   Predicción   │  ← Siguiente token más probable
    └───────────────┘
```

## Conceptos clave

### Tokens
Los LLMs no leen palabras completas — dividen el texto en **tokens** (subpalabras).

| Texto | Tokens |
|-------|--------|
| "concreto reforzado" | ["con", "cre", "to", " refor", "zado"] |
| "3000 PSI" | ["300", "0", " PSI"] |

### Contexto (Context Window)
La cantidad de texto que el modelo puede "recordar" en una conversación. Modelos actuales manejan entre 8K y 200K tokens (~150 a 3,000 páginas).

### Temperature
Controla qué tan "creativo" es el modelo:
- **Temperature = 0**: Respuestas deterministas y conservadoras.
- **Temperature = 1**: Respuestas más variadas y creativas.

Para aplicaciones AEC técnicas, generalmente usamos **temperature baja** (0-0.3).

## IA Generativa más allá del texto

| Modalidad | Tecnología | Aplicación AEC |
|-----------|-----------|----------------|
| **Texto** | LLMs | Chatbots técnicos, resumen de especificaciones |
| **Imágenes** | Difusión (DALL-E, Midjourney) | Renders conceptuales, visualización de diseños |
| **Código** | Code LLMs | Generación de scripts IFC, automatización BIM |
| **3D** | NeRF, modelos generativos 3D | Reconstrucción de geometría desde fotos |

## RAG: Retrieval Augmented Generation

Una técnica fundamental para usar LLMs en contextos especializados como la construcción.

```
        Pregunta del usuario
               │
    ┌──────────▼──────────┐
    │  Buscar en base de  │  ← Documentos técnicos, normativas,
    │  conocimiento (RAG) │    especificaciones del proyecto
    └──────────┬──────────┘
               │ contexto relevante
    ┌──────────▼──────────┐
    │    LLM genera       │  ← Respuesta basada en documentos
    │    respuesta        │    reales, no solo su entrenamiento
    └─────────────────────┘
```

**¿Por qué es importante para AEC?**
- Los LLMs no conocen las especificaciones de TU proyecto.
- RAG permite "alimentar" al modelo con documentos específicos: planos, presupuestos, actas de obra, NSR-10.
- La respuesta se basa en **datos reales**, reduciendo alucinaciones.

## Prompt Engineering para AEC

La calidad de la respuesta depende de la calidad de la pregunta. Algunos principios:

### Malo
> "¿Cuánto cuesta un muro?"

### Bueno
> "Actúa como un ingeniero de presupuestos en Colombia. Estima el costo por m² de un muro en concreto reforzado de 4000 PSI, espesor 20cm, con refuerzo #4 @ 20cm en ambas caras. Incluye: concreto, acero, formaleta, mano de obra. Responde en pesos colombianos (COP) con precios de 2024."

### Principios clave
1. **Rol**: Define quién es el modelo ("Actúa como ingeniero estructural").
2. **Contexto**: Proporciona datos específicos del proyecto.
3. **Formato**: Indica cómo quieres la respuesta (tabla, lista, JSON).
4. **Restricciones**: Define límites (normativa, zona geográfica, año de precios).

## Para reflexionar

> *"Los LLMs no reemplazan al ingeniero — amplifican su capacidad. Un ingeniero con IA puede revisar 100 especificaciones en el tiempo que antes revisaba 5."*

En el siguiente capítulo veremos cómo los **Agentes de IA** llevan esto un paso más allá, permitiendo que el LLM tome acciones y use herramientas.
