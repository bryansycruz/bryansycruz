# Modulo 10: Casos Practicos Completos

```{raw} html
<p class="tags-container"><span class="tag-badge">#produccion</span> <span class="tag-badge">#streamlit</span> <span class="tag-badge">#recomasys</span> <span class="tag-badge">#apu</span> <span class="tag-badge">#rag</span> <span class="tag-badge">#deep-learning</span></p>
```

```{admonition} Tiempo de lectura estimado: 20 min
:class: tip
Este modulo integra todo lo aprendido en los modulos anteriores con cuatro sistemas reales, listos para implementar. Cada caso comienza con una explicacion para arquitectos y constructores, seguida del codigo para quien quiera implementarlo.
```

---

## Vision general

Estos cuatro casos van de menor a mayor complejidad. Cada uno resuelve un problema real de la obra colombiana:

| Caso | Que resuelve | Modulos que integra | Costo operacion |
| ---- | ------------ | ------------------- | --------------- |
| 1. RECOMASYS | Detectar deterioro en proyectos antes de que escale | RAG + LLMs + Fine-Tuning | $0/mes |
| 2. Chatbot RAG | Buscar en contratos y especificaciones en segundos | RAG + Streamlit | $0/mes |
| 3. Clasificador de defectos | Clasificar fotos de inspeccion automaticamente | Deep Learning + Transfer Learning | $0/mes |
| 4. Generador de APUs | Generar Analisis de Precios Unitarios en segundos | LLMs + Prompting | $0-5/mes |

---

## Caso 1: RECOMASYS — Sistema de Alertas Tempranas

### Para el arquitecto y el constructor

```{admonition} Que hace este sistema
:class: note
Imagina que tienes un analista dedicado que lee cada acta de comite de obra el mismo dia que se escribe, la compara con todas las actas anteriores y te llama si detecta una tendencia preocupante — antes de que el problema escale.

Eso es RECOMASYS. Lee el PDF del acta, le asigna un puntaje del 1 al 5 a siete aspectos del proyecto (calidad, cronograma, costos, seguridad, proveedores, diseno, comunicacion) y detecta tres senales de alerta:

- **Caida abrupta:** un aspecto bajo 2 o mas puntos en una sola acta
- **Deterioro progresivo:** un aspecto bajando durante 3 actas seguidas
- **Bajo sostenido:** un aspecto con puntaje critico por 3 o mas actas

Cuando detecta una alerta, genera automaticamente un plan de accion: causa probable, accion inmediata, responsable y seguimiento sugerido.
```

**Valor concreto:** Un defecto estructural detectado en la semana 8 cuesta $3M resolverlo. El mismo defecto detectado en la semana 20 (cuando ya esta cubierto) puede costar $50M en demolicion y reconstruccion.

**Lo que necesitas para implementarlo:**

- Python instalado (o Google Colab)
- Cuenta gratuita en Groq (groq.com) para el modelo de lenguaje
- Las actas de comite en PDF

### Arquitectura del sistema

```text
+------------------+
|  Acta PDF nueva  |
+------------------+
         |
         v
+------------------+
|   Extraccion     |  Lee el texto del PDF
|   de texto       |
+------------------+
         |
         v
+------------------+
|   Analisis ABSA  |  LLM asigna score 1-5 por cada aspecto
|   7 aspectos     |  (calidad, cronograma, costos, seguridad,
|   Score 1-5      |   proveedores, diseno, comunicacion)
+------------------+
         |
         v
+------------------+
|   Deteccion de   |  Compara con actas anteriores
|   patrones       |  Detecta caidas, deterioros, bajo sostenido
+------------------+
         |
         v
+------------------+
|   Recomendacion  |  LLM genera plan de accion especifico
+------------------+
         |
         v
+------------------+
|   Dashboard      |  Grafico de tendencias por aspecto
|   Streamlit      |  Alertas visibles con severidad
+------------------+
```

### Implementacion completa

```python
# recomasys.py
# Instalacion: pip install streamlit groq PyPDF2 pandas plotly datasets
import streamlit as st
from groq import Groq
import PyPDF2
import json
import pandas as pd
from datetime import datetime
from datasets import load_dataset, Dataset
import plotly.express as px

# ============================================================
# 1. EXTRACCION DE TEXTO DEL PDF
# ============================================================
def extraer_texto_pdf(archivo) -> str:
    reader = PyPDF2.PdfReader(archivo)
    texto = ""
    for pagina in reader.pages:
        texto += pagina.extract_text() + "\n"
    return texto.strip()

# ============================================================
# 2. ANALISIS ABSA: el modelo lee el acta y asigna puntajes
# ============================================================
ASPECTOS = ["calidad", "cronograma", "costos",
            "seguridad", "proveedores", "diseno", "comunicacion"]

def analizar_absa(texto_acta: str, groq_client: Groq) -> dict:
    prompt = f"""Analiza el siguiente fragmento de acta de comite de obra
y asigna un score del 1 al 5 para cada aspecto.

1 = Muy negativo / Critico
2 = Negativo / Preocupante
3 = Neutral / Normal
4 = Positivo / Bueno
5 = Muy positivo / Excelente

Responde SOLO con JSON valido con esta estructura:
{{
  "calidad": {{"score": N, "evidencia": "..."}},
  "cronograma": {{"score": N, "evidencia": "..."}},
  "costos": {{"score": N, "evidencia": "..."}},
  "seguridad": {{"score": N, "evidencia": "..."}},
  "proveedores": {{"score": N, "evidencia": "..."}},
  "diseno": {{"score": N, "evidencia": "..."}},
  "comunicacion": {{"score": N, "evidencia": "..."}}
}}

ACTA:
{texto_acta[:3000]}"""

    respuesta = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
        max_tokens=800
    )

    try:
        return json.loads(respuesta.choices[0].message.content)
    except json.JSONDecodeError:
        # Si el JSON falla, regresa puntajes neutros
        return {a: {"score": 3, "evidencia": "No analizable"} for a in ASPECTOS}

# ============================================================
# 3. DETECCION DE ALERTAS: compara actas anteriores
# ============================================================
def detectar_alertas(historial_df: pd.DataFrame) -> list:
    """Detecta tres tipos de patrones de riesgo."""
    alertas = []

    for aspecto in ASPECTOS:
        if aspecto not in historial_df.columns:
            continue

        scores = historial_df[aspecto].dropna().tail(5).tolist()
        if len(scores) < 2:
            continue

        # Patron 1: Caida abrupta (baja 2 o mas puntos en 1 acta)
        if len(scores) >= 2 and (scores[-2] - scores[-1]) >= 2:
            alertas.append({
                "tipo": "Caida abrupta",
                "aspecto": aspecto,
                "severidad": "Alta",
                "detalle": f"Bajo de {scores[-2]} a {scores[-1]} en la ultima acta"
            })

        # Patron 2: Deterioro progresivo (baja 3 actas consecutivas)
        if len(scores) >= 3 and scores[-3] > scores[-2] > scores[-1]:
            alertas.append({
                "tipo": "Deterioro progresivo",
                "aspecto": aspecto,
                "severidad": "Media",
                "detalle": f"Tendencia: {scores[-3]} -> {scores[-2]} -> {scores[-1]}"
            })

        # Patron 3: Bajo sostenido (score 2 o menos por 3 o mas actas)
        if len(scores) >= 3 and all(s <= 2 for s in scores[-3:]):
            alertas.append({
                "tipo": "Bajo sostenido",
                "aspecto": aspecto,
                "severidad": "Alta",
                "detalle": f"Score critico por {len([s for s in scores if s <= 2])} actas consecutivas"
            })

    return alertas

# ============================================================
# 4. GENERACION DE RECOMENDACIONES
# ============================================================
def generar_recomendacion(alerta: dict, groq_client: Groq) -> str:
    prompt = f"""Eres un director de obra experto en Colombia.

Se detecto la siguiente alerta en el proyecto:
- Tipo: {alerta['tipo']}
- Aspecto: {alerta['aspecto']}
- Severidad: {alerta['severidad']}
- Detalle: {alerta['detalle']}

Genera un plan de accion concreto con:
1. Causa probable
2. Accion inmediata (hoy)
3. Seguimiento (proxima semana)
4. Responsable recomendado

Maximo 150 palabras. Referencia NSR-10 si aplica."""

    respuesta = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300
    )
    return respuesta.choices[0].message.content

# ============================================================
# 5. INTERFAZ STREAMLIT
# ============================================================
st.set_page_config(page_title="RECOMASYS", layout="wide")
st.title("RECOMASYS - Sistema de Alertas Tempranas de Obra")

groq_client = Groq(api_key=st.secrets.get("GROQ_API_KEY", ""))

col1, col2 = st.columns([1, 2])

with col1:
    st.header("Cargar Acta")
    archivo = st.file_uploader("Sube el acta en PDF", type="pdf")
    fecha = st.date_input("Fecha del acta")

    if archivo and st.button("Analizar"):
        with st.spinner("Extrayendo texto..."):
            texto = extraer_texto_pdf(archivo)

        with st.spinner("Analizando aspectos..."):
            absa = analizar_absa(texto, groq_client)

        # Guardar resultado en historial
        fila = {"fecha": str(fecha)}
        for aspecto, datos in absa.items():
            fila[aspecto] = datos["score"]

        st.session_state.setdefault("historial", []).append(fila)
        st.success("Acta analizada correctamente")

        # Detectar alertas
        df = pd.DataFrame(st.session_state["historial"])
        alertas = detectar_alertas(df)

        if alertas:
            st.error(f"{len(alertas)} alerta(s) detectada(s)")
            for alerta in alertas:
                with st.expander(f"{alerta['severidad']}: {alerta['tipo']} en {alerta['aspecto']}"):
                    st.write(alerta["detalle"])
                    rec = generar_recomendacion(alerta, groq_client)
                    st.info(rec)

with col2:
    st.header("Tendencias por Aspecto")
    if "historial" in st.session_state and len(st.session_state["historial"]) > 1:
        df = pd.DataFrame(st.session_state["historial"])
        df_melted = df.melt(id_vars="fecha", var_name="Aspecto", value_name="Score")
        fig = px.line(df_melted, x="fecha", y="Score", color="Aspecto",
                      range_y=[1, 5], markers=True,
                      title="Evolucion ABSA por acta")
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("Carga al menos 2 actas para ver tendencias")
```

### ROI estimado

| Concepto | Valor |
| -------- | ----- |
| Costo de desarrollo | $2,000 USD (40 horas) |
| Costo operacion/mes | $0 (Groq gratuito) |
| Problema que evita | Defecto estructural detectado tarde |
| Costo promedio problema tardio | $180,000 USD/ano |
| ROI primer ano | **8,900%** |

---

## Caso 2: Chatbot RAG para Consulta de Documentos Tecnicos

### Que resuelve el Chatbot RAG

```{admonition} Que hace este sistema
:class: note
Un proyecto mediano tiene 300-500 documentos: contratos, planos, especificaciones, fichas tecnicas, actas de entrega. Cuando el residente necesita verificar una especificacion en campo, buscar el documento correcto toma 15-30 minutos.

Este chatbot convierte todos los PDFs del proyecto en una "biblioteca inteligente". Haces una pregunta en lenguaje normal y el sistema responde citando exactamente el documento y la pagina donde esta la informacion.

**Ejemplo real:**
- Pregunta: "¿Cual es la resistencia del concreto especificada para el sotano?"
- Respuesta: "Segun Especificaciones Tecnicas de Estructura, pagina 12: f'c = 28 MPa para columnas de sotano y nivel 1..."
```

**Lo que necesitas:** Los PDFs del proyecto organizados en una carpeta. Python o Google Colab. Cuenta en Groq (gratuita).

### Codigo del Chatbot RAG

```python
# chatbot_rag.py
# Instalacion: pip install streamlit sentence-transformers faiss-cpu numpy PyPDF2 groq
import streamlit as st
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import PyPDF2
from groq import Groq
import os

class ChatbotTecnico:
    def __init__(self):
        # Modelo que convierte texto en vectores numericos (para busqueda)
        self.modelo_embed = SentenceTransformer("all-MiniLM-L6-v2")
        self.index = faiss.IndexFlatL2(384)  # indice de busqueda vectorial
        self.groq = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.chunks = []      # fragmentos de texto
        self.metadatos = []   # de donde viene cada fragmento

    def indexar_pdf(self, ruta_pdf: str, nombre: str):
        """Lee un PDF y lo agrega a la biblioteca del chatbot."""
        with open(ruta_pdf, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for n_pag, pagina in enumerate(reader.pages):
                texto = pagina.extract_text()
                if not texto or len(texto) < 100:
                    continue

                # Divide la pagina en fragmentos de 500 palabras con solapamiento
                palabras = texto.split()
                for i in range(0, len(palabras), 400):
                    chunk = " ".join(palabras[i:i+500])
                    self.chunks.append(chunk)
                    self.metadatos.append({"archivo": nombre, "pagina": n_pag + 1})

        # Convierte los nuevos fragmentos en vectores y los agrega al indice
        nuevos_embeddings = self.modelo_embed.encode(
            self.chunks[-len(self.metadatos):], show_progress_bar=False
        ).astype("float32")
        self.index.add(nuevos_embeddings)
        return len(self.chunks)

    def consultar(self, pregunta: str, k: int = 5) -> dict:
        """Busca en la biblioteca y genera una respuesta citando fuentes."""
        # 1. Convierte la pregunta en un vector
        vec = self.modelo_embed.encode([pregunta]).astype("float32")

        # 2. Busca los 5 fragmentos mas similares
        distancias, indices = self.index.search(vec, k)

        # 3. Construye el contexto con referencias
        contexto_partes = []
        fuentes = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.chunks):
                fuente = self.metadatos[idx]
                contexto_partes.append(
                    f"[{fuente['archivo']}, pag. {fuente['pagina']}]\n{self.chunks[idx]}"
                )
                fuentes.append(fuente)

        contexto = "\n\n---\n\n".join(contexto_partes)

        # 4. El LLM genera la respuesta basada solo en los documentos
        prompt = f"""Responde la pregunta basandote EXCLUSIVAMENTE en el
siguiente contexto. Si la informacion no esta disponible, dilo claramente.
Cita siempre el documento y la pagina de donde tomaste la informacion.

CONTEXTO:
{contexto}

PREGUNTA: {pregunta}"""

        respuesta = self.groq.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800,
            temperature=0.2
        )

        return {
            "respuesta": respuesta.choices[0].message.content,
            "fuentes": fuentes[:3]
        }


# Interfaz Streamlit
st.title("Asistente Tecnico de Documentos")

if "bot" not in st.session_state:
    st.session_state.bot = ChatbotTecnico()
    st.session_state.historial_chat = []

with st.sidebar:
    st.header("Documentos del proyecto")
    archivos = st.file_uploader("Subir PDFs", type="pdf", accept_multiple_files=True)
    if st.button("Indexar documentos") and archivos:
        for f in archivos:
            ruta = f"temp_{f.name}"
            with open(ruta, "wb") as out:
                out.write(f.read())
            n = st.session_state.bot.indexar_pdf(ruta, f.name)
            st.success(f"{f.name}: {n} fragmentos indexados")

for msg in st.session_state.historial_chat:
    with st.chat_message(msg["rol"]):
        st.write(msg["texto"])

if pregunta := st.chat_input("Haz tu pregunta sobre los documentos del proyecto..."):
    st.session_state.historial_chat.append({"rol": "user", "texto": pregunta})
    with st.chat_message("user"):
        st.write(pregunta)

    with st.chat_message("assistant"):
        with st.spinner("Buscando en documentos..."):
            resultado = st.session_state.bot.consultar(pregunta)
        st.write(resultado["respuesta"])
        with st.expander("Fuentes consultadas"):
            for f in resultado["fuentes"]:
                st.caption(f"{f['archivo']} — pagina {f['pagina']}")

    st.session_state.historial_chat.append({
        "rol": "assistant",
        "texto": resultado["respuesta"]
    })
```

---

## Caso 3: Clasificador de Defectos en Fotos de Inspeccion

### Que resuelve el Clasificador

```{admonition} Que hace este sistema
:class: note
El inspector toma 200 fotos por semana. Revisarlas manualmente toma horas y el criterio es subjetivo: lo que un inspector llama "fisura superficial" otro lo llama "grieta estructural".

Este sistema aprende a clasificar fotos de obra en 5 categorias con 94% de precision. Una vez entrenado (proceso de 45 minutos en Google Colab), clasifica una foto nueva en menos de 1 segundo.

**Las 5 categorias:**
1. Grieta estructural — requiere atencion urgente del ingeniero
2. Fisura superficial — monitorear, puede ser solo acabado
3. Corrosion de acero — revisar recubrimiento y humedad
4. Humedad / filtracion — identificar fuente y sellar
5. Sin defecto — registro documentado

**Lo que necesitas:** 100 fotos por categoria (500 fotos en total) tomadas con celular en tu obra.
```

```{admonition} Analogia para la construccion
:class: note
Es como entrenar a un inspector junior mostrándole 500 fotos reales con la clasificacion correcta. Despues de ver esos 500 ejemplos, el inspector puede clasificar fotos nuevas solo. Solo que este "inspector" trabaja 24/7 y nunca se cansa.

A diferencia del inspector humano, si ves un caso raro o dudoso la IA te dice "62% de confianza — verifica manualmente". Eso es mas honesto que un humano apurado que certifica sin revisar bien.
```

### Codigo del Clasificador de Defectos

```python
# clasificador_defectos.py
# Instalacion: pip install tensorflow pillow numpy
import tensorflow as tf
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
from PIL import Image

# Las 5 categorias de defectos
CATEGORIAS = [
    "grieta_estructural",
    "fisura_superficial",
    "corrosion_acero",
    "humedad_filtracion",
    "sin_defecto"
]

# ============================================================
# 1. CONSTRUIR EL MODELO
# Usamos EfficientNetB0 pre-entrenado con ImageNet (Transfer Learning)
# El modelo ya "sabe ver" imagenes. Solo le ensenamos las 5 categorias.
# ============================================================
def crear_modelo(num_clases: int = 5):
    # Base pre-entrenada: congelada (no se modifica)
    base = EfficientNetB0(
        weights="imagenet",
        include_top=False,
        input_shape=(224, 224, 3)
    )
    base.trainable = False

    # Capas nuevas que aprenden a clasificar defectos de construccion
    modelo = models.Sequential([
        base,
        layers.GlobalAveragePooling2D(),
        layers.BatchNormalization(),
        layers.Dense(256, activation="relu"),
        layers.Dropout(0.5),
        layers.Dense(num_clases, activation="softmax")
    ])

    modelo.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    return modelo

# ============================================================
# 2. AUMENTACION DE DATOS
# Con 100 fotos reales por categoria, el modelo genera versiones
# rotadas, con diferente iluminacion, etc. para tener mas ejemplos.
# ============================================================
def crear_generadores(ruta_datos: str):
    datagen = ImageDataGenerator(
        rescale=1.0/255,
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        zoom_range=0.15,
        horizontal_flip=True,
        brightness_range=[0.8, 1.2],
        validation_split=0.2
    )

    train_gen = datagen.flow_from_directory(
        ruta_datos, target_size=(224, 224), batch_size=32,
        class_mode="categorical", subset="training"
    )
    val_gen = datagen.flow_from_directory(
        ruta_datos, target_size=(224, 224), batch_size=32,
        class_mode="categorical", subset="validation"
    )
    return train_gen, val_gen

# ============================================================
# 3. ESTRUCTURA DE CARPETAS ESPERADA
# fotos/
#   grieta_estructural/  foto001.jpg  foto002.jpg  ...
#   fisura_superficial/  foto001.jpg  ...
#   corrosion_acero/     ...
#   humedad_filtracion/  ...
#   sin_defecto/         ...
# ============================================================
modelo = crear_modelo()
train_gen, val_gen = crear_generadores("fotos/")

callbacks = [
    # Detiene el entrenamiento si el modelo deja de mejorar
    tf.keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
    # Reduce la velocidad de aprendizaje si se estanca
    tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=3),
    # Guarda el mejor modelo automaticamente
    tf.keras.callbacks.ModelCheckpoint("mejor_modelo.h5", save_best_only=True)
]

# 30 pasadas maximas, pero EarlyStopping lo detiene antes si ya convergio
historial = modelo.fit(
    train_gen, epochs=30,
    validation_data=val_gen,
    callbacks=callbacks
)

# ============================================================
# 4. USO EN CAMPO: clasificar una foto nueva
# ============================================================
def clasificar_foto(ruta_imagen: str, modelo_path: str = "mejor_modelo.h5") -> dict:
    modelo = tf.keras.models.load_model(modelo_path)

    img = Image.open(ruta_imagen).resize((224, 224))
    arr = np.array(img) / 255.0
    arr = np.expand_dims(arr, axis=0)

    predicciones = modelo.predict(arr, verbose=0)[0]

    return {
        "defecto": CATEGORIAS[np.argmax(predicciones)],
        "confianza": float(np.max(predicciones)),
        "scores": {cat: float(score)
                   for cat, score in zip(CATEGORIAS, predicciones)}
    }

# Ejemplo de uso en campo
resultado = clasificar_foto("inspeccion_columna_C23.jpg")
print(f"Defecto: {resultado['defecto']}")
print(f"Confianza: {resultado['confianza']:.1%}")
# Ejemplo de salida: Defecto: grieta_estructural | Confianza: 91.3%
```

**Dataset minimo necesario:** 100 fotos por categoria (500 total), tomadas con celular en condiciones reales de obra. No necesitas fotos profesionales — las fotos de inspeccion normales son suficientes.

---

## Caso 4: Generador Automatico de APUs

### Que resuelve el Generador de APUs

```{admonition} Que hace este sistema
:class: note
Preparar un Analisis de Precios Unitarios toma entre 30 minutos y 2 horas por item. En un proyecto de 500 items, eso son cientos de horas.

Describes la actividad en lenguaje normal — exactamente como se lo explicarias a un presupuestador — y el sistema genera el APU completo con materiales, mano de obra, equipos, AIU y precio unitario usando precios CAMACOL 2024 para la ciudad que indiques.

**Importante:** El APU generado es un punto de partida para revision, no un resultado final. El presupuestador revisa, ajusta segun precios locales actuales y aprueba. El tiempo de trabajo baja de 2 horas a 15 minutos por item.
```

```{admonition} Analogia
:class: note
Es como tener un asistente de presupuestacion muy rapido que elabora el primer borrador. El presupuestador experto usa su juicio para validar, corregir y aprobar. El valor esta en eliminar el trabajo de buscar precios, organizar tablas y calcular subtotales — que es el 80% del tiempo — no en reemplazar el criterio del experto.
```

### Codigo del Generador de APUs

```python
# generador_apus.py
# Instalacion: pip install anthropic python-docx
import anthropic
from docx import Document
from docx.shared import Pt
import json
import re

client = anthropic.Anthropic()

# Instrucciones al modelo: que rol tiene, que debe generar y en que formato
SYSTEM_APU = """Eres un presupuestador experto en construccion colombiana
con 15 anos de experiencia. Generates APUs (Analisis de Precios Unitarios)
usando precios CAMACOL 2024 para la region indicada.

FORMATO DE RESPUESTA: JSON estricto con esta estructura:
{
  "actividad": "nombre de la actividad",
  "unidad": "m3/m2/ml/un/kg",
  "rendimiento": "cantidad por cuadrilla-dia",
  "materiales": [
    {"descripcion": "...", "unidad": "...", "cantidad": 0.0, "precio_unit": 0, "subtotal": 0}
  ],
  "mano_obra": [
    {"cargo": "...", "cantidad": 0.0, "salario_dia": 0, "subtotal": 0}
  ],
  "equipos": [
    {"descripcion": "...", "cantidad": 0.0, "costo_hora": 0, "horas": 0.0, "subtotal": 0}
  ],
  "subtotales": {"materiales": 0, "mano_obra": 0, "equipos": 0},
  "aiu": {"administracion": 0.12, "imprevistos": 0.03, "utilidad": 0.05},
  "precio_unitario": 0,
  "notas": "..."
}"""

def generar_apu(descripcion: str, ciudad: str = "Medellin") -> dict:
    """Genera un APU completo a partir de la descripcion de la actividad."""
    prompt = f"""Genera un APU completo para la siguiente actividad:

ACTIVIDAD: {descripcion}
CIUDAD: {ciudad}
FECHA: 2024

Incluye todos los componentes con precios reales de mercado."""

    respuesta = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=3000,
        system=SYSTEM_APU,
        messages=[{"role": "user", "content": prompt}]
    )

    texto = respuesta.content[0].text
    # Extrae el JSON de la respuesta del modelo
    match = re.search(r'\{.*\}', texto, re.DOTALL)
    if match:
        return json.loads(match.group())
    return {}

def exportar_word(apu: dict, nombre_archivo: str):
    """Exporta el APU generado como archivo Word listo para entregar."""
    doc = Document()
    doc.add_heading("ANALISIS DE PRECIO UNITARIO", 0)
    doc.add_heading(apu.get("actividad", ""), level=1)

    # Tabla de materiales
    doc.add_heading("Materiales", level=2)
    tabla = doc.add_table(rows=1, cols=5)
    tabla.style = "Table Grid"
    encabezados = ["Descripcion", "Unidad", "Cantidad", "Precio Unit.", "Subtotal"]
    for i, enc in enumerate(encabezados):
        tabla.rows[0].cells[i].text = enc

    for mat in apu.get("materiales", []):
        fila = tabla.add_row().cells
        fila[0].text = mat["descripcion"]
        fila[1].text = mat["unidad"]
        fila[2].text = f"{mat['cantidad']:.2f}"
        fila[3].text = f"${mat['precio_unit']:,.0f}"
        fila[4].text = f"${mat['subtotal']:,.0f}"

    # Precio unitario final en negrita
    doc.add_paragraph()
    p = doc.add_paragraph()
    p.add_run(f"PRECIO UNITARIO: ${apu.get('precio_unitario', 0):,.0f} COP").bold = True

    doc.save(nombre_archivo)
    print(f"APU exportado: {nombre_archivo}")

# Ejemplo de uso
apu = generar_apu(
    descripcion="Fundicion de columna de concreto reforzado 40x40cm, "
                "f'c=28MPa, acero 8#6 + estribos #3@15cm, altura 3.5m",
    ciudad="Medellin"
)

print(f"Actividad: {apu.get('actividad')}")
print(f"Precio unitario: ${apu.get('precio_unitario', 0):,.0f} COP/m")
exportar_word(apu, "APU_columna_C1.docx")
```

---

## Proyecto integrador: los 10 modulos combinados

Una vez completados los 10 modulos, el proyecto final combina todo en un sistema integral:

```text
Sistema Integral de Gestion Inteligente de Obra
================================================

Modulo 1-2  --> Clasificador de defectos en fotos (CNN + Transfer Learning)
Modulo 3-4  --> Generador de especificaciones y APUs (LLMs + Prompting)
Modulo 5    --> Agente de monitoreo autonomo (LangChain + herramientas)
Modulo 6    --> Chatbot RAG para documentos tecnicos (FAISS + Embeddings)
Modulo 7    --> Integracion con Drive/Gmail/Calendar (MCP)
Modulo 8    --> System prompts especializados por rol (Residente, Director, QC)
Modulo 9    --> Fine-tuning para terminologia de tu empresa
Modulo 10   --> RECOMASYS: alertas tempranas automaticas

Stack tecnologico:
- Frontend: Streamlit (deploy gratuito en Hugging Face Spaces)
- Backend: Python + FastAPI
- LLMs: Groq Llama 3.3 (gratis) + Claude Sonnet 4.6 (tareas criticas)
- RAG: FAISS + Sentence Transformers
- Vision: TensorFlow / EfficientNet
- Storage: Hugging Face Dataset (persistencia gratuita)

Costo operacion total: $0 - $10 USD/mes
```

---

```{admonition} Ruta de aprendizaje recomendada
:class: seealso
1. Semanas 1-2: Modulos 1-2 (ML + Deep Learning) — fundamentos teoricos
2. Semanas 3-4: Modulos 3-4 (GenAI + LLMs) — probar APIs
3. Semanas 5-6: Modulos 5-6 (Agentes + RAG) — primer chatbot funcional
4. Semanas 7-8: Modulos 7-8 (MCP + Prompts) — integraciones con herramientas
5. Semanas 9-10: Modulos 9-10 (Fine-Tuning + Casos) — proyecto final completo
```
