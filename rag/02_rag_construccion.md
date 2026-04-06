# RAG aplicado a Construcción

En este capítulo construimos un sistema RAG completo para consultar actas, contratos y documentos técnicos de un proyecto.

---

## Sistema RAG paso a paso

### Paso 1 — Instalar dependencias

```bash
pip install sentence-transformers faiss-cpu PyPDF2 groq
```

### Paso 2 — Clase VectorStore

```python
import faiss
import numpy as np
import pickle
import PyPDF2
from sentence_transformers import SentenceTransformer

class VectorStoreRAG:
    def __init__(self):
        self.modelo = SentenceTransformer("all-MiniLM-L6-v2")
        self.dimension = 384
        self.index = faiss.IndexFlatL2(self.dimension)
        self.chunks = []
        self.metadatos = []

    def extraer_texto_pdf(self, ruta_pdf):
        with open(ruta_pdf, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            return "".join(page.extract_text() for page in reader.pages)

    def chunk_inteligente(self, texto, max_chars=800):
        parrafos = texto.split("\n\n")
        chunks, chunk_actual = [], ""
        for p in parrafos:
            if len(chunk_actual) + len(p) < max_chars:
                chunk_actual += p + "\n\n"
            else:
                if chunk_actual:
                    chunks.append(chunk_actual.strip())
                chunk_actual = p + "\n\n"
        if chunk_actual:
            chunks.append(chunk_actual.strip())
        return chunks

    def agregar_documento(self, ruta_pdf):
        texto = self.extraer_texto_pdf(ruta_pdf)
        chunks = self.chunk_inteligente(texto)
        embeddings = self.modelo.encode(chunks).astype("float32")
        self.index.add(embeddings)
        for i, chunk in enumerate(chunks):
            self.chunks.append(chunk)
            self.metadatos.append({"documento": ruta_pdf, "posicion": i})
        print(f"✅ {ruta_pdf}: {len(chunks)} fragmentos indexados")

    def buscar(self, pregunta, k=5):
        vec = self.modelo.encode([pregunta]).astype("float32")
        distancias, indices = self.index.search(vec, k)
        return [
            {
                "chunk": self.chunks[idx],
                "documento": self.metadatos[idx]["documento"],
                "score": 1 / (1 + distancias[0][i])
            }
            for i, idx in enumerate(indices[0])
        ]

    def guardar(self, carpeta="."):
        faiss.write_index(self.index, f"{carpeta}/faiss_index.pkl")
        with open(f"{carpeta}/chunks_store.pkl", "wb") as f:
            pickle.dump({"chunks": self.chunks, "metadatos": self.metadatos}, f)

    def cargar(self, carpeta="."):
        self.index = faiss.read_index(f"{carpeta}/faiss_index.pkl")
        with open(f"{carpeta}/chunks_store.pkl", "rb") as f:
            data = pickle.load(f)
            self.chunks = data["chunks"]
            self.metadatos = data["metadatos"]
        print(f"✅ Índice cargado: {len(self.chunks)} fragmentos")
```

### Paso 3 — Función de consulta RAG

```python
from groq import Groq

def consultar_rag(pregunta, rag_store, groq_api_key, k=5):
    # 1. Recuperar fragmentos relevantes
    resultados = rag_store.buscar(pregunta, k=k)

    # 2. Construir contexto
    contexto = "\n\n---\n\n".join([
        f"Fuente: {r['documento']}\n{r['chunk']}"
        for r in resultados
    ])

    # 3. Prompt al LLM
    prompt = f"""Eres un asistente especializado en gestión de proyectos
de construcción en Colombia.

Responde la pregunta basándote EXCLUSIVAMENTE en el siguiente contexto.
Si la información no está en el contexto, di:
"No encuentro esa información en los documentos disponibles."

CONTEXTO:
{contexto}

PREGUNTA: {pregunta}

INSTRUCCIONES:
- Cita el documento fuente al responder
- Sé técnico pero claro
- Prioriza información más reciente si hay conflictos"""

    # 4. Generar respuesta (Groq Llama — gratis)
    client = Groq(api_key=groq_api_key)
    respuesta = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1500,
        temperature=0.3
    )

    return {
        "respuesta": respuesta.choices[0].message.content,
        "fuentes": [
            {"documento": r["documento"], "relevancia": f"{r['score']:.0%}"}
            for r in resultados[:3]
        ]
    }
```

### Paso 4 — Uso completo

```python
import os

# Crear e indexar
rag = VectorStoreRAG()
rag.agregar_documento("actas/comite_2024-01.pdf")
rag.agregar_documento("actas/comite_2024-02.pdf")
rag.agregar_documento("contratos/contrato_edificio_cumbre.pdf")
rag.agregar_documento("specs/especificacion_concreto.pdf")
rag.guardar()

# Consultar
resultado = consultar_rag(
    pregunta="¿Qué problemas de calidad se reportaron en los últimos comités?",
    rag_store=rag,
    groq_api_key=os.getenv("GROQ_API_KEY")
)

print(resultado["respuesta"])
print("\n📎 Fuentes consultadas:")
for f in resultado["fuentes"]:
    print(f"  - {f['documento']} (relevancia: {f['relevancia']})")
```

**Salida ejemplo:**
```
Según las actas de comité consultadas:

Se reportaron 2 problemas de calidad:

1. **Segregación en concreto** (acta 2024-02, Nivel 5)
   - Detectada en columnas C23-C25 durante inspección visual
   - Se ordenó demolición y refundición (Cláusula 12.3 del contrato)

2. **Fisuras en losa** (acta 2024-02, Nivel 7 zona norte)
   - Fisuras capilares en patrón de mapa
   - Causa probable: exceso de agua en mezcla
   - Pendiente resultado de ensayo de esclerometría

📎 Fuentes consultadas:
  - actas/comite_2024-02.pdf (relevancia: 94%)
  - specs/especificacion_concreto.pdf (relevancia: 71%)
```

---

## Interfaz con Streamlit

```python
import streamlit as st

st.title("🏗️ Asistente RAG para Gestión de Obra")
st.caption("Consulta inteligente de actas, contratos y documentos técnicos")

if "rag" not in st.session_state:
    st.session_state.rag = VectorStoreRAG()
    try:
        st.session_state.rag.cargar()
        st.success(f"✅ {len(st.session_state.rag.chunks)} fragmentos cargados")
    except:
        st.warning("⚠️ Sin índice. Carga documentos en el panel lateral.")

with st.sidebar:
    st.header("📁 Documentos")
    archivos = st.file_uploader("Subir PDFs", type="pdf", accept_multiple_files=True)
    if st.button("Indexar documentos") and archivos:
        for archivo in archivos:
            ruta = f"temp_{archivo.name}"
            with open(ruta, "wb") as f:
                f.write(archivo.read())
            st.session_state.rag.agregar_documento(ruta)
        st.session_state.rag.guardar()
        st.success("✅ Indexación completa")

pregunta = st.text_input(
    "Haz tu pregunta:",
    placeholder="¿Qué problemas se reportaron en el último comité?"
)

if pregunta:
    with st.spinner("Buscando en documentos..."):
        resultado = consultar_rag(
            pregunta=pregunta,
            rag_store=st.session_state.rag,
            groq_api_key=st.secrets["GROQ_API_KEY"]
        )

    st.markdown("### Respuesta")
    st.write(resultado["respuesta"])

    with st.expander("📎 Fuentes consultadas"):
        for f in resultado["fuentes"]:
            st.markdown(f"- **{f['documento']}** — relevancia: {f['relevancia']}")
```

Para ejecutar:
```bash
streamlit run app_rag.py
```

---

```{admonition} 📚 Recursos
:class: seealso
- [Sentence Transformers](https://www.sbert.net/) — modelos de embeddings
- [FAISS](https://github.com/facebookresearch/faiss/wiki) — base de datos vectorial
- [Groq Console](https://console.groq.com) — Llama gratis
- [Streamlit Docs](https://docs.streamlit.io) — crear apps interactivas
```
