# Transfer Learning — Aprendizaje por Transferencia

```{admonition} ¿Por qué es revolucionario?
:class: tip
**Entrenar desde cero:**
- ❌ Necesitas 100.000+ imágenes
- ❌ Requiere GPUs costosas
- ❌ Toma días o semanas

**Con Transfer Learning:**
- ✅ Solo necesitas 100 – 1.000 imágenes
- ✅ Funciona en laptop o Colab
- ✅ Tarda minutos u horas
```

## ¿Qué es?

**Transfer Learning** consiste en reutilizar un modelo **ya entrenado en millones de imágenes** (como ImageNet con 14M de fotos) y adaptarlo a tu problema específico con solo cientos de imágenes.

```{admonition} 🏗️ Analogía para arquitectos
:class: note
Es como contratar un arquitecto que ya diseñó 1.000 edificios y pedirle que diseñe *tu* proyecto específico. No parte de cero — usa toda su experiencia acumulada.

Transfer Learning = usar un "AutoCAD de Deep Learning" ya entrenado, y solo ajustarlo para tu problema.
```

---

## Modelos pre-entrenados populares

| Modelo | Parámetros | Velocidad | Precisión | Uso recomendado |
|--------|-----------|-----------|-----------|-----------------|
| **MobileNetV2** | 3.5 M | ⚡⚡⚡ Muy rápida | ⭐⭐ Buena | Apps móviles, inspecciones en terreno |
| **EfficientNetB0** | 5.3 M | ⚡⚡ Rápida | ⭐⭐⭐ Excelente | **Balance ideal para construcción** |
| **ResNet50** | 25 M | ⚡ Media | ⭐⭐⭐ Excelente | Análisis detallado en oficina |
| **VGG16** | 138 M | 🐢 Lenta | ⭐⭐ Buena | Solo si tienes GPU potente |

---

## Implementación: Clasificar materiales en fotos de obra

**Categorías:** Concreto · Acero · Madera · Ladrillo · Vidrio

```python
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras import layers, models
import tensorflow as tf

# 1. Cargar modelo pre-entrenado (sin la capa final)
modelo_base = EfficientNetB0(
    weights="imagenet",    # pesos entrenados en 14M imágenes
    include_top=False,     # sin la capa de clasificación original
    input_shape=(224, 224, 3)
)

# 2. Congelar las capas base (no reentrenar)
modelo_base.trainable = False

# 3. Agregar capas para nuestro problema específico
modelo = models.Sequential([
    modelo_base,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation="relu"),
    layers.Dropout(0.5),
    layers.Dense(5, activation="softmax")  # 5 categorías de materiales
])

# 4. Compilar y entrenar solo las capas nuevas
modelo.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

modelo.fit(datos_entrenamiento, epochs=10, validation_data=datos_validacion)
```

---

## Data Augmentation — Más datos sin más fotos

**Problema:** Solo tienes 200 fotos de grietas pero necesitas más datos.

**Solución:** Generar variaciones realistas de las fotos existentes.

```python
from tensorflow.keras.preprocessing.image import ImageDataGenerator

datagen = ImageDataGenerator(
    rescale=1./255,           # normalizar píxeles a 0-1
    rotation_range=20,        # rotar hasta 20°
    width_shift_range=0.2,    # desplazar horizontalmente
    height_shift_range=0.2,   # desplazar verticalmente
    zoom_range=0.2,           # zoom aleatorio
    horizontal_flip=True,     # voltear horizontalmente
    validation_split=0.2
)

# Cargar imágenes desde carpetas:
# datos/
#   concreto/  foto1.jpg  foto2.jpg ...
#   acero/     foto1.jpg  foto2.jpg ...
#   madera/    ...

datos = datagen.flow_from_directory(
    "datos/",
    target_size=(224, 224),
    batch_size=32,
    class_mode="categorical"
)

# Resultado: 200 fotos originales → miles de variaciones realistas
```

---

## Uso en producción

```python
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np

modelo = load_model("clasificador_materiales_v1.h5")

def clasificar_material(ruta_imagen):
    img = image.load_img(ruta_imagen, target_size=(224, 224))
    arr = image.img_to_array(img) / 255.0
    arr = np.expand_dims(arr, axis=0)

    predicciones = modelo.predict(arr)
    clases = ["concreto", "acero", "madera", "ladrillo", "vidrio"]

    material = clases[np.argmax(predicciones)]
    confianza = np.max(predicciones)
    return material, confianza

# Usar
material, conf = clasificar_material("foto_inspeccion.jpg")
print(f"Material: {material} — Confianza: {conf:.1%}")
```

---

```{admonition} 📚 Libros recomendados
:class: seealso
- **Hands-on Machine Learning** — capítulo 14 (CNNs con Transfer Learning)
- **Generative Deep Learning** — capítulo 4
- [Keras Applications](https://keras.io/api/applications/) — catálogo de modelos pre-entrenados
```
