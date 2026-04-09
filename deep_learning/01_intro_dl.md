# ¿Qué es Deep Learning?

```{raw} html
<p class="tags-container"><span class="tag-badge">#deep-learning</span> <span class="tag-badge">#redes-neuronales</span> <span class="tag-badge">#vision-artificial</span> <span class="tag-badge">#defectos</span> <span class="tag-badge">#transfer-learning</span></p>
```

```{admonition} ¿Cuándo usar Deep Learning?
:class: tip
**Úsalo cuando tienes:**
- Datos no estructurados: imágenes, audio, video, texto
- Miles o millones de ejemplos
- Patrones muy complejos que humanos no pueden definir
- Acceso a GPU (o Google Colab)

**NO lo uses cuando:**
- Tienes menos de 10.000 filas - usa ML clásico (Módulo 1)
- Necesitas explicar el razonamiento del modelo
- No tienes tiempo ni GPU - el entrenamiento toma horas o días
```

## Definición

**Deep Learning** es una subrama de ML que usa **redes neuronales artificiales con múltiples capas** para aprender representaciones complejas directamente de los datos.

**Diferencia clave con ML clásico:**

| | ML Clásico | Deep Learning |
|--|-----------|---------------|
| **Features** | Tú las diseñas manualmente | La red las aprende sola |
| **Datos** | Cientos a miles | Miles a millones |
| **Hardware** | CPU (laptop) | GPU (o Colab gratis) |
| **Interpretabilidad** | Alta | Baja ("caja negra") |

---

## Analogía para constructoras

```{admonition} DL es como un inspector con 30 años de experiencia
:class: note
Un inspector novato necesita una lista de verificación de 200 reglas:
*"Si la grieta es vertical y mide >5mm problema estructural..."*

Un inspector con 30 años **ve el muro** y **automáticamente sabe** si algo está mal, sin poder explicar exactamente por qué. Su cerebro aprendió patrones complejos de miles de inspecciones.

Deep Learning funciona igual: aprende patrones directamente de miles de fotos sin que tú definas las reglas.
```

---

## Casos de uso en construcción

| Caso | Arquitectura | Descripción |
|------|-------------|-------------|
| **Detección de grietas** | CNN | Clasificar fotos de muros como defectuosos o no |
| **Segmentación de planos** | Mask R-CNN | Identificar paredes, ventanas, puertas en PDFs |
| **Predicción de consumo** | LSTM | Consumo eléctrico de edificios por semana |
| **OCR de actas** | Transformer | Extraer texto de documentos escaneados |
| **Renders conceptuales** | Diffusion | Generar visualizaciones desde texto |
| **Seguridad en obra** | YOLO | Detectar cascos y chalecos en tiempo real |

---

## Arquitecturas principales

### 1. Redes Densas (Fully Connected)
Para datos tabulares y series de tiempo:
```
Entrada Capa Oculta 1 Capa Oculta 2 Salida
(3 vars) (64 neuronas) (32 neuronas) (1 pred.)
```

### 2. Redes Convolucionales — CNN
Para imágenes (detección de defectos):
```
Imagen Conv2D MaxPool Conv2D MaxPool Dense Salida
 (filtros) (reducir) (filtros) (reducir) (clasi.)
```

### 3. Redes Recurrentes — LSTM
Para series de tiempo y texto:
```
Secuencia temporal LSTM LSTM Dense Predicción
(consumo día 1-30) (mem.) (día siguiente)
```

### 4. Transformers
Para procesamiento de lenguaje (actas, contratos):
```
Texto Embeddings Multi-Head Attention Feed Forward Salida
```

---

## Ejemplo práctico: Detectar grietas en muros

**Problema:** ¿Esta foto de muro tiene grietas? (Sí / No)

**Dataset:**
- 5.000 fotos CON grietas
- 5.000 fotos SIN grietas

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Construir la red CNN
modelo = keras.Sequential([
 layers.Input(shape=(224, 224, 3)), # imagen 224×224 RGB

 layers.Conv2D(32, kernel_size=3, activation="relu"),
 layers.MaxPooling2D(pool_size=2),

 layers.Conv2D(64, kernel_size=3, activation="relu"),
 layers.MaxPooling2D(pool_size=2),

 layers.Conv2D(128, kernel_size=3, activation="relu"),
 layers.MaxPooling2D(pool_size=2),

 layers.Flatten(),
 layers.Dense(128, activation="relu"),
 layers.Dropout(0.5), # evitar sobreajuste
 layers.Dense(1, activation="sigmoid") # 0=sin grieta, 1=con grieta
])

modelo.compile(
 optimizer="adam",
 loss="binary_crossentropy",
 metrics=["accuracy"]
)

# Entrenar
modelo.fit(
 imagenes_entrenamiento,
 etiquetas_entrenamiento,
 epochs=20,
 validation_split=0.2,
 batch_size=32
)

# Usar en producción
foto = cargar_imagen("muro_inspeccion.jpg")
resultado = modelo.predict(foto)
if resultado > 0.5:
 print(" GRIETA DETECTADA")
else:
 print(" Muro en buen estado")
```

---

## Casos de éxito reales en construcción

| Proyecto | Modelo | Dataset | Resultado |
|----------|--------|---------|-----------|
| Detección grietas en puentes (U. Illinois) | ResNet50 | 10.000 fotos | 96% precisión vs 78% inspector humano |
| Planos PDF BIM (Autodesk) | Mask R-CNN | 50.000 planos | Conversión automática |
| Seguridad en obra (SmartCam) | YOLO | Cámaras en tiempo real | Alertas de casco/chaleco |

---

```{admonition} Libros recomendados
:class: seealso
- **Hands-on Machine Learning** (Géron) — capítulos 10-14
- **Generative Deep Learning** (David Foster) — capítulos 1-3
```

**Siguiente:** [Transfer Learning ](02_transfer_learning.md)
