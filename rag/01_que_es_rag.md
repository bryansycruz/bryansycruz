# ¿Qué es RAG?

```{admonition} El problema que RAG resuelve
:class: warning
Los LLMs solo saben lo que vieron durante su entrenamiento. No conocen **tus contratos**, **tus actas** ni **tus planos específicos**.

RAG les da acceso a **tus documentos propios**.
```

## Definición

**RAG** (Retrieval-Augmented Generation) combina tres pasos:

1. **Retrieval** Buscar fragmentos relevantes en tus documentos
2. **Augmented** Enriquecer el prompt del LLM con esos fragmentos
3. **Generation** El LLM genera una respuesta fundamentada en tus docs

---

## Sin RAG vs Con RAG

**Sin RAG:**
```
Usuario: "¿Qué dice el contrato sobre penalidades por retraso?"

LLM: "Los contratos típicamente incluyen cláusulas de penalización..."
  Respuesta genérica, no de TU contrato específico
```

**Con RAG:**
```
Usuario: "¿Qué dice el contrato sobre penalidades por retraso?"

RAG:
1. Busca en "contrato_edificio_cumbre.pdf"
2. Encuentra Cláusula 8.3
3. Pasa el texto al LLM

LLM: "Según la Cláusula 8.3 de tu contrato:
 'Penalidad: 0.5% del valor mensual por cada día de retraso,
 máximo 10% del valor total del contrato.'

 Para el Edificio Cumbre ($18.000M COP), esto equivale a:
 - Por día: $90M COP
 - Máximo total: $1.800M COP"
```

---

## Arquitectura RAG

```

 FASE 1: INDEXACIÓN (se hace una vez)


PDFs · Word · Actas · Contratos · Planos
 
 [Chunking] dividir en fragmentos de ~500 palabras
 
 [Embeddings] convertir cada fragmento a vector numérico
 
 [Base de datos vectorial] guardar vectores en FAISS / Chroma


 FASE 2: CONSULTA (cada pregunta)


Pregunta: "¿Qué dice el acta sobre calidad?"
 
 [Embed la pregunta] convertir pregunta a vector
 
 [Búsqueda por similitud] encontrar fragmentos más parecidos
 
 [Top 5 fragmentos] recuperar texto relevante
 

Prompt al LLM:

Contexto:
[Frag 1: "...calidad concreto"]
[Frag 2: "...cilindros prueba"]
[Frag 3: "...rechazo lote 45"]

Pregunta: ¿Qué dice el acta
sobre calidad?

 
 Respuesta fundamentada en TUS documentos
```

---

## ¿Por qué necesitas RAG en construcción?

| Problema | Cómo RAG lo resuelve |
|----------|---------------------|
| Contrato de 200 páginas | Encuentra la cláusula exacta en segundos |
| 50 actas de comité | Resume tendencias y detecta problemas recurrentes |
| Especificaciones técnicas | Responde preguntas específicas citando la fuente |
| Normativa NSR-10 | Consultas precisas sobre artículos específicos |
| Histórico de proveedores | Compara calidad y tiempos de entrega pasados |

---

## Analogía para ingenieros

```{admonition} RAG es como un asistente con acceso a tu archivo técnico
:class: note
**Sin RAG:** El asistente solo sabe teoría general de construcción.
Pregunta: "¿Qué dice MI contrato sobre penalidades?"
Respuesta: "Los contratos típicamente dicen..."

**Con RAG:** El asistente tiene acceso a todo tu archivo digital.
Pregunta: "¿Qué dice MI contrato sobre penalidades?"
Asistente: [busca en archivo] [encuentra Cláusula 8.3] [cita textualmente]

Es como tener un pasante que lee 10.000 documentos en 2 segundos y
encuentra exactamente lo que necesitas.
```

---

## Componentes técnicos

### Chunking — Fragmentar documentos

Los LLMs tienen límite de tokens, no puedes pasar 100 páginas completas:

```python
def chunk_por_parrafos(texto, max_chars=800):
 """Divide el texto por párrafos sin romper oraciones"""
 parrafos = texto.split("\n\n")
 chunks = []
 chunk_actual = ""

 for parrafo in parrafos:
 if len(chunk_actual) + len(parrafo) < max_chars:
 chunk_actual += parrafo + "\n\n"
 else:
 if chunk_actual:
 chunks.append(chunk_actual.strip())
 chunk_actual = parrafo + "\n\n"

 if chunk_actual:
 chunks.append(chunk_actual.strip())

 return chunks
```

### Embeddings — Vectorizar texto

Convierten texto en números que capturan el significado semántico:

```python
from sentence_transformers import SentenceTransformer

modelo = SentenceTransformer("all-MiniLM-L6-v2")

textos = [
 "El concreto debe tener f'c = 28 MPa",
 "La resistencia del hormigón es 4000 PSI", # mismo significado
 "Mañana lloverá en Medellín" # distinto tema
]

embeddings = modelo.encode(textos)
# Textos 1 y 2 tienen alta similitud (0.87)
# Texto 3 tiene baja similitud con los anteriores (0.12)
```

### Bases de datos vectoriales

| BD | Tipo | Escalabilidad | Costo | Uso recomendado |
|----|------|---------------|-------|-----------------|
| **FAISS** | Local | Millones de docs | Gratis | Prototipo y uso propio |
| **Chroma** | Local/Cloud | Millones | Gratis | Desarrollo |
| **Pinecone** | Cloud | Billones | $$ | Producción |
| **Qdrant** | Cloud/Docker | Billones | $ | Alto rendimiento |

---

```{admonition} Libros recomendados
:class: seealso
- **Generative Deep Learning** — capítulo 10 (RAG Systems)
- [LangChain RAG Guide](https://python.langchain.com/docs/use_cases/question_answering/) — gratis en línea
- [FAISS Documentation](https://github.com/facebookresearch/faiss/wiki)
```

**Siguiente:** [Implementar RAG en proyectos de construcción ](02_rag_construccion.md)
