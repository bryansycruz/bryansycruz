# Agentes de IA

```{raw} html
<p class="tags-container"><span class="tag-badge">#agentes-ia</span> <span class="tag-badge">#react</span> <span class="tag-badge">#langchain</span> <span class="tag-badge">#automatizacion</span> <span class="tag-badge">#crewai</span></p>
```

## De "responder preguntas" a "ejecutar tareas"

Un LLM estándar solo genera texto. Un **Agente de IA** puede:
- Razonar sobre un problema
- Decidir qué herramientas usar
- Ejecutar acciones
- Evaluar resultados
- Iterar hasta completar la tarea

### Analogía AEC

| Concepto | LLM sin agente | Agente de IA |
|----------|---------------|--------------|
| Analogía | Un consultor al teléfono que solo responde preguntas | Un residente de obra que revisa planos, consulta normativas, toma mediciones y reporta |
| Ejemplo | "El acero de refuerzo #4 tiene 1.27cm de diámetro" | Abre el modelo IFC → extrae cantidades de acero → compara con presupuesto → genera reporte de diferencias |

## Arquitectura de un agente

```
                    ┌──────────────────┐
                    │     Usuario      │
                    │  "Revisa si el   │
                    │   presupuesto    │
                    │   cuadra con     │
                    │   el modelo BIM" │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │     LLM Core     │
                    │   (Razonamiento) │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
      ┌──────────────┐ ┌──────────┐ ┌──────────────┐
      │ Herramienta 1│ │Herram. 2 │ │ Herramienta 3│
      │ Leer archivo │ │ Calcular │ │ Consultar BD │
      │ IFC/Excel    │ │ cantidades│ │ de costos   │
      └──────────────┘ └──────────┘ └──────────────┘
```

## Componentes clave

### 1. Planificación (Planning)
El agente descompone una tarea compleja en pasos:

```
Tarea: "Genera el APU de una columna de 30x30 en concreto de 4000 PSI"

Plan del agente:
  1. Calcular volumen de concreto (0.3 × 0.3 × h)
  2. Estimar acero de refuerzo (cuantía mínima NSR-10)
  3. Calcular formaleta (perímetro × altura)
  4. Consultar precios unitarios vigentes
  5. Armar tabla de APU
```

### 2. Memoria
- **Corto plazo**: El contexto de la conversación actual.
- **Largo plazo**: Bases de datos vectoriales con documentos del proyecto (RAG).

### 3. Herramientas (Tools)
Las acciones que el agente puede ejecutar:

| Herramienta | Descripción | Ejemplo AEC |
|-------------|-------------|-------------|
| Búsqueda web | Consultar información en línea | Buscar precios actualizados de materiales |
| Lectura de archivos | Leer documentos | Leer modelo IFC, hojas de cálculo |
| Cálculo | Ejecutar código Python | Calcular cantidades de obra |
| Base de datos | Consultar/escribir en BD | Consultar histórico de costos |
| API externa | Llamar servicios web | Consultar clima para programación |

### 4. Reflexión (Self-evaluation)
El agente evalúa su propia respuesta:

```
"¿Mi cálculo de acero cumple con la cuantía mínima de la NSR-10 (1%)?"
  → Si no cumple → Recalcular
  → Si cumple → Continuar al siguiente paso
```

## Frameworks populares para agentes

| Framework | Descripción | Caso de uso |
|-----------|-------------|-------------|
| **LangChain** | Framework general para cadenas de LLM | Chatbots RAG, agentes con herramientas |
| **Agent SDKs** | SDKs oficiales de proveedores LLM | Agentes autónomos con herramientas |
| **CrewAI** | Múltiples agentes colaborando | Equipos de agentes especializados |
| **AutoGen** | Framework de Microsoft | Agentes conversacionales multi-turno |

## Niveles de autonomía

```
Nivel 1: Chatbot        → Responde preguntas (solo texto)
Nivel 2: RAG            → Responde con documentos del proyecto
Nivel 3: Herramientas   → Ejecuta cálculos y consultas
Nivel 4: Agente simple  → Planifica y ejecuta tareas de varios pasos
Nivel 5: Multi-agente   → Varios agentes colaboran en tareas complejas
```

## Consideraciones para AEC

```{warning}
Los agentes de IA son herramientas poderosas, pero en la industria de la construcción debemos tener en cuenta:

- **Verificación humana**: Siempre verificar cálculos estructurales. La IA no reemplaza al ingeniero responsable.
- **Normativas**: Los agentes deben estar configurados con las normativas locales (NSR-10, NTC, etc.).
- **Responsabilidad profesional**: El profesional firma, no la IA.
```

En el siguiente notebook, construiremos un agente básico paso a paso.
