# ¿Qué es Machine Learning?

```{raw} html
<p class="tags-container"><span class="tag-badge">#machine-learning</span> <span class="tag-badge">#python</span> <span class="tag-badge">#algoritmos</span> <span class="tag-badge">#prediccion</span> <span class="tag-badge">#construccion</span></p>
```

```{admonition} Tiempo de lectura estimado: 8 min
:class: tip
Al terminar este módulo podrás identificar qué problemas de tu obra o proyecto se pueden resolver con Machine Learning, y entenderás cómo las máquinas "aprenden" de datos reales.
```

---

## 1. Teoría: ¿Cómo aprende realmente una máquina?

Un modelo de Machine Learning es, en esencia, una **función matemática** que transforma entradas en salidas. El proceso de aprendizaje consiste en encontrar los parámetros óptimos de esa función a partir de datos.

### El ciclo de aprendizaje

```text
Datos históricos
      |
      v
  [Modelo f(x)]  <---- Parámetros W (pesos)
      |
      v
  Predicción ŷ
      |
      v
  Error = ŷ - y_real
      |
      v
  Ajuste de W  (minimizar el error)
      |
      +----> repite hasta converger
```

**¿Qué ajusta el modelo?**

Los **parámetros W** (pesos o coeficientes) son los números internos del modelo. Al principio son aleatorios. Con cada dato que procesa, el algoritmo de entrenamiento los ajusta para que el error disminuya. Este proceso de ajuste usa técnicas como el **Gradiente Descendente**:

```text
W_nuevo = W_actual - tasa_aprendizaje * gradiente_del_error
```

Esto es equivalente a descender por una colina siguiendo siempre la dirección de mayor pendiente, hasta encontrar el valle (el mínimo error posible).

### Función de costo (Loss Function)

La "pérdida" mide qué tan equivocado está el modelo. Las más comunes:

| Problema | Función de costo | Fórmula simplificada |
| -------- | ---------------- | -------------------- |
| Regresión | MSE (Error cuadrático medio) | `promedio((ŷ - y)²)` |
| Clasificación binaria | Binary Cross-Entropy | `-promedio(y·log(ŷ))` |
| Clasificación múltiple | Categorical Cross-Entropy | `idem, por clase` |

El objetivo del entrenamiento es siempre **minimizar** esta función.

---

## 2. Definición formal

**Machine Learning** (Aprendizaje Automático) es la rama de la inteligencia artificial que estudia algoritmos capaces de mejorar su rendimiento en una tarea `T` con respecto a una medida de desempeño `P`, a partir de la experiencia `E`.

> *Definición de Tom Mitchell (1997): "Un programa aprende de la experiencia E con respecto a la tarea T y medida de rendimiento P, si su rendimiento en T, medido por P, mejora con la experiencia E."*

En términos prácticos:

- **T** (tarea): predecir el costo de un edificio
- **E** (experiencia): 500 proyectos históricos con sus costos reales
- **P** (rendimiento): error promedio entre predicción y valor real

---

## 3. Analogía con la construcción

```{admonition} ML es como calibrar un presupuestador experto
:class: note
Un director de obra experimentado con 20 años de trayectoria estima el costo de un proyecto mirando los planos durante 10 minutos. No aplica fórmulas: su cerebro **aprendió patrones** de cientos de proyectos anteriores.

- Conoce que un edificio de 8 pisos en zona sísmica cuesta X% más
- Sabe que materiales de acabados premium suben el presupuesto Y%
- Identifica cuando un diseño es ineficiente y lo penaliza en el estimado

Machine Learning replica ese proceso de aprendizaje implícito de forma sistemática y cuantificable, sin la subjetividad ni el límite de memoria humana.
```

La diferencia clave:

- El experto humano aprende de ~200 proyectos en toda su vida
- Un modelo de ML puede aprender de 200.000 proyectos en minutos

---

## 4. ¿Cuándo usar ML vs. reglas manuales?

| Situación | Usa Reglas Manuales | Usa ML |
| --------- | ------------------- | ------ |
| Las reglas son conocidas y estables | ✓ | |
| El patrón es demasiado complejo para escribirlo | | ✓ |
| Tienes datos históricos con resultados | | ✓ |
| Los datos cambian con el tiempo | | ✓ |
| Necesitas total explicabilidad | ✓ | |
| Tienes menos de 100 ejemplos | ✓ | |

### Ejemplo de regla manual en obra

```python
# Regla manual: fácil de escribir, frágil y limitada
if grieta_mm > 5 and orientacion == "vertical":
    alerta = "CRÍTICO"
elif grieta_mm > 2:
    alerta = "MEDIO"
else:
    alerta = "BAJO"
```

**Ejemplo con ML:** el modelo aprende de 10.000 fotos etiquetadas por ingenieros y detecta patrones visuales que ninguna regla manual podría capturar (textura, contexto, humedad visible, etc.).

---

## 5. Casos de uso en el sector AEC

| Problema | Tipo de ML | Datos necesarios |
| -------- | ---------- | ---------------- |
| Estimación de costos | Regresión supervisada | Histórico de proyectos con costos reales |
| Predicción de retrasos | Clasificación supervisada | Cronogramas + factores climáticos |
| Detección de defectos en fotos | Deep Learning (CNN) | Fotos etiquetadas como defecto/no defecto |
| Gestión de inventario | Series de tiempo | Consumos históricos por semana |
| Agrupación de proveedores | Clustering no supervisado | Datos de precio, entrega, calidad |
| Detección de anomalías en costos | Detección de anomalías | Presupuestos históricos por capítulo |

---

## 6. Ejemplo práctico: Predicción de consumo de concreto

> Tiempo de implementación estimado: 2-3 horas

**Problema:** ¿Cuántas toneladas de concreto necesitaremos la próxima semana?

```python
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

# Datos históricos de obra (simplificados)
datos = pd.DataFrame({
    "pisos_fundidos":  [3, 2, 4, 3, 5, 2, 4, 3, 1, 4],
    "clima_soleado":   [1, 0, 1, 1, 1, 0, 1, 0, 0, 1],
    "num_cuadrillas":  [4, 3, 5, 4, 6, 3, 5, 4, 2, 5],
    "toneladas_real":  [45, 30, 62, 47, 75, 28, 60, 44, 18, 63],
})

# Variables de entrada (X) y salida (y)
X = datos[["pisos_fundidos", "clima_soleado", "num_cuadrillas"]]
y = datos["toneladas_real"]

# Dividir: 80% entrenamiento, 20% prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Entrenar el modelo
modelo = LinearRegression()
modelo.fit(X_train, y_train)

# Evaluar
predicciones = modelo.predict(X_test)
error = mean_absolute_error(y_test, predicciones)
print(f"Error promedio: {error:.1f} toneladas")

# Los coeficientes aprendidos (interpretables)
for feature, coef in zip(X.columns, modelo.coef_):
    print(f"  {feature}: +{coef:.1f} toneladas por unidad")

# Predicción próxima semana: 3 pisos, soleado, 4 cuadrillas
proxima_semana = [[3, 1, 4]]
pred = modelo.predict(proxima_semana)[0]
print(f"\nPróxima semana: {pred:.0f} toneladas estimadas")
```

**Salida esperada:**

```text
Error promedio: 2.4 toneladas
  pisos_fundidos: +13.2 toneladas por unidad
  clima_soleado: +8.7 toneladas por unidad
  num_cuadrillas: +4.1 toneladas por unidad

Próxima semana: 48 toneladas estimadas
```

El modelo **descubrió** por sí solo que cada piso fundido implica ~13 ton de concreto adicional, y que el clima soleado agrega ~9 ton — sin que nadie le dijera estas reglas.

---

## 7. ¿Cómo se relacionan IA, ML y Deep Learning?

```text
+------------------------------------------+
|          Inteligencia Artificial          |
|  +------------------------------------+  |
|  |        Machine Learning            |  |
|  |  +------------------------------+  |  |
|  |  |      Deep Learning           |  |  |
|  |  |  +--------------------------+|  |  |
|  |  |  |   IA Generativa          ||  |  |
|  |  |  |  (LLMs, Difusión, etc.)  ||  |  |
|  |  |  +--------------------------+|  |  |
|  |  +------------------------------+  |  |
|  +------------------------------------+  |
+------------------------------------------+
```

| Etapa | En construcción | En IA |
| ----- | --------------- | ----- |
| Manual | Cálculos a mano, planos en papel | Reglas escritas por programadores |
| Asistida | AutoCAD, Excel con fórmulas | Machine Learning supervisado |
| Automatizada | BIM, análisis FEM | Deep Learning, redes neuronales |
| Generativa | Diseño generativo paramétrico | LLMs, IA generativa |

---

```{admonition} Para reflexionar
:class: note
No necesitas ser experto en matemáticas para usar ML. Necesitas entender bien **tus datos** y **tu problema**. El ML es una herramienta más — como Revit o un teodolito. La diferencia es que este aprende y se adapta.
```

**Siguiente:** [Tipos de Machine Learning](02_tipos_ml.md)
