# Tipos de Machine Learning

```{admonition} Tiempo de lectura estimado: 12 min
:class: tip
En este módulo aprenderás los tres paradigmas de aprendizaje, la teoría detrás de los algoritmos principales y cuándo aplicar cada uno en proyectos de construcción.
```

Existen tres formas principales en que una máquina puede aprender. Cada una responde a un tipo diferente de problema.

---

## 1. Aprendizaje Supervisado

```{admonition} ¿Qué es?
:class: tip
Se entrena el modelo con datos que **ya tienen la respuesta correcta** (etiquetas). El algoritmo aprende a mapear entradas `X` a salidas `y` minimizando el error sobre los ejemplos conocidos.
```

### Teoría

El aprendizaje supervisado busca encontrar una función `f` tal que `f(X) ≈ y`. Matemáticamente:

```text
Dado: conjunto de pares (X_1, y_1), (X_2, y_2), ..., (X_n, y_n)
Objetivo: encontrar f tal que f(X_i) ≈ y_i para todo i
          y que generalice bien a nuevos X no vistos
```

Se divide en dos grandes familias:

| Tipo | ¿Qué predice? | Salida | Ejemplo en obra |
| ---- | ------------- | ------ | --------------- |
| **Regresión** | Un número continuo | Costo, días, m³ | ¿Cuánto costará este proyecto? |
| **Clasificación** | Una categoría | Sí/No, A/B/C | ¿Este elemento es defectuoso? |

**Úsalo cuando:** tienes datos históricos con resultados conocidos y etiquetados.

---

### Algoritmos principales

#### Regresión Lineal

**Teoría:** Modela la relación entre las variables de entrada y la salida como una línea (o hiperplano en múltiples dimensiones). La ecuación es:

```text
ŷ = W_0 + W_1·x_1 + W_2·x_2 + ... + W_n·x_n
```

Donde `W_i` son los coeficientes que el modelo aprende minimizando el MSE (Error Cuadrático Medio).

**Cuándo usarlo:** cuando la relación entre variables es aproximadamente lineal y necesitas interpretabilidad (puedes leer directamente cuánto aporta cada variable).

**Uso en construcción:** predicción de costos, estimación de consumo de materiales, proyección de plazos.

```python
from sklearn.linear_model import LinearRegression
import pandas as pd

# Datos: proyectos históricos
df = pd.read_csv("proyectos_historicos.csv")
X = df[["area_m2", "pisos", "acabado_premium"]]
y = df["costo_millones_cop"]

modelo = LinearRegression()
modelo.fit(X, y)

# Interpretar: cada m² adicional agrega X millones al costo
for col, coef in zip(X.columns, modelo.coef_):
    print(f"  {col}: {coef:.2f} millones/unidad")

# Predecir proyecto nuevo: 1200 m², 6 pisos, acabado premium
nuevo = [[1200, 6, 1]]
print(f"\nCosto estimado: ${modelo.predict(nuevo)[0]:.0f}M COP")
```

---

#### Random Forest (Bosque Aleatorio)

**Teoría:** Construye cientos de árboles de decisión, cada uno entrenado con una muestra aleatoria de los datos y variables. La predicción final es el promedio (regresión) o voto mayoritario (clasificación) de todos los árboles. Esta técnica se llama *ensemble* (conjunto).

```text
Árbol 1: predice $4.800M
Árbol 2: predice $5.100M
Árbol 3: predice $4.950M
...
Árbol 100: predice $4.900M

Predicción final = promedio = $4.962M
```

La aleatoriedad hace que cada árbol cometa errores diferentes, y al promediar, los errores se cancelan. Esto reduce el sobreajuste (overfitting).

**Cuándo usarlo:** cuando tienes muchas variables de entrada, relaciones no lineales, o cuando la Regresión Lineal no da buenos resultados. Es robusto ante valores atípicos y variables irrelevantes.

**Uso en construcción:** estimación de costos complejos, detección de retrasos, análisis de riesgo de proyectos.

```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

modelo_rf = RandomForestRegressor(
    n_estimators=200,    # 200 árboles en el bosque
    max_depth=10,        # profundidad máxima de cada árbol
    random_state=42
)
modelo_rf.fit(X_train, y_train)

y_pred = modelo_rf.predict(X_test)
print(f"MAE: ${mean_absolute_error(y_test, y_pred):.0f}M")
print(f"R²: {r2_score(y_test, y_pred):.2f}")

# Importancia de cada variable
for col, imp in zip(X.columns, modelo_rf.feature_importances_):
    print(f"  {col}: {imp:.1%} de importancia")
```

---

#### Regresión Logística

**Teoría:** A pesar del nombre, es un algoritmo de **clasificación**. Aplica la función sigmoide para transformar una combinación lineal de variables en una probabilidad entre 0 y 1:

```text
P(y=1) = 1 / (1 + e^(-z))    donde z = W_0 + W_1·x_1 + ...
```

Si la probabilidad supera un umbral (por defecto 0.5), clasifica como positivo.

**Cuándo usarlo:** clasificación binaria con datos tabulares, cuando necesitas la probabilidad de que algo ocurra (no solo sí/no), y cuando la interpretabilidad es importante.

**Uso en construcción:** ¿Este elemento pasará o fallará el control de calidad? ¿Este proyecto tendrá retraso? ¿Este proveedor cumplirá el plazo?

```python
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

# Clasificar: ¿la soldadura es BUENA (1) o MALA (0)?
X_sold = df[["temperatura", "tiempo_seg", "presion_bar"]]
y_sold = df["calidad_ok"]  # 1=buena, 0=mala

modelo_log = LogisticRegression()
modelo_log.fit(X_train, y_train)

# No solo predice la clase, también la probabilidad
proba = modelo_log.predict_proba([[460, 32, 82]])[0]
print(f"Probabilidad MALA: {proba[0]:.1%}")
print(f"Probabilidad BUENA: {proba[1]:.1%}")

# Reporte completo
y_pred = modelo_log.predict(X_test)
print(classification_report(y_test, y_pred, target_names=["MALA", "BUENA"]))
```

---

### Analogía: supervisado en obra

```{admonition} Aprendizaje supervisado en obra
:class: note
Es como un **programa de formación de residentes** donde cada aprendiz recibe:

1. 500 fichas de proyectos pasados con todos sus datos (área, pisos, zona, materiales)
2. El costo real final de cada uno (la "respuesta correcta")

El residente estudia esas fichas hasta que puede estimar el costo de un proyecto nuevo solo con mirar los planos. El modelo de ML hace exactamente lo mismo, pero con miles de fichas y en segundos.
```

---

## 2. Aprendizaje No Supervisado

```{admonition} ¿Qué es?
:class: tip
El algoritmo recibe datos **sin etiquetas** y debe descubrir estructura oculta por sí solo: grupos naturales, anomalías, o representaciones compactas.
```

### Fundamento teórico

No hay una función objetivo `y` que aprender. En cambio, el algoritmo busca minimizar alguna medida de disimilitud interna o maximizar la cohesión de grupos:

```text
Dado: conjunto de puntos X_1, X_2, ..., X_n  (sin etiquetas)
Objetivo: encontrar grupos o patrones que minimicen
          la distancia intra-grupo y maximicen la inter-grupo
```

**Úsalo cuando:** no tienes respuestas previas y quieres descubrir patrones o detectar anomalías.

---

### Algoritmos no supervisados

#### K-Means (Agrupamiento)

**Teoría:** Divide los datos en `k` grupos asignando cada punto al centroide más cercano, luego recalcula los centroides, y repite hasta que no haya cambios:

```text
1. Inicializa k centroides aleatoriamente
2. Asigna cada punto al centroide más cercano (distancia euclidiana)
3. Recalcula cada centroide como el promedio de sus puntos
4. Repite 2-3 hasta convergencia
```

**Cuándo usarlo:** para segmentar proyectos, proveedores, o zonas geográficas en grupos naturales. Requiere definir `k` de antemano.

**Uso en construcción:** segmentación de proveedores por perfil de riesgo, agrupación de proyectos similares para benchmarking, clasificación de zonas de obra por comportamiento.

```python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# Datos de proveedores
df_prov = pd.DataFrame({
    "precio_index":    [1.5, 1.4, 0.9, 0.85, 1.2, 1.1, 0.7],
    "dias_entrega":    [2, 3, 8, 9, 5, 6, 12],
    "score_calidad":   [4.5, 4.3, 3.1, 3.0, 3.8, 3.7, 2.5],
})

# Normalizar: cada variable debe tener igual peso
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df_prov)

# Encontrar 3 grupos
kmeans = KMeans(n_clusters=3, random_state=42)
df_prov["grupo"] = kmeans.fit_predict(X_scaled)

# Interpretar grupos
print(df_prov.groupby("grupo").mean().round(2))
# Grupo 0: "Premium"    - caros, rápidos, excelente calidad
# Grupo 1: "Estándar"   - precio medio, tiempos medios
# Grupo 2: "Económicos" - baratos, lentos, calidad menor
```

---

#### Isolation Forest (Detección de Anomalías)

**Teoría:** Aísla puntos anómalos construyendo árboles aleatorios. Los puntos raros se aíslan con muy pocos cortes porque están lejos del resto. El "puntaje de anomalía" es inversamente proporcional a la profundidad media del árbol donde el punto queda aislado.

**Cuándo usarlo:** para detectar valores inusuales en series de gastos, consumos, o rendimientos sin necesidad de datos etiquetados.

**Uso en construcción:** detección de facturación inusual, gastos fuera de patrón, consumos de materiales anómalos.

```python
from sklearn.ensemble import IsolationForest

# Gastos semanales de obra por capítulo
df_gastos = pd.read_csv("gastos_semanales.csv")
X_gastos = df_gastos[["mano_obra", "materiales", "equipos"]]

modelo_iso = IsolationForest(contamination=0.05, random_state=42)
df_gastos["anomalia"] = modelo_iso.fit_predict(X_gastos)
# -1 = anomalía, 1 = normal

anomalias = df_gastos[df_gastos["anomalia"] == -1]
print(f"Semanas con gastos inusuales: {len(anomalias)}")
print(anomalias[["semana", "mano_obra", "materiales", "equipos"]])
```

---

### Analogía: no supervisado en obra

```{admonition} Aprendizaje no supervisado en obra
:class: note
Es como darle a un **nuevo director de contratos** todos los expedientes de proveedores de los últimos 10 años **sin decirle cómo clasificarlos**. Él solo identifica que naturalmente hay tres tipos: los confiables-caros, los mediocres-baratos, y los que tienen tiempos impredecibles.

Nadie le dijo que existían esos tres grupos — él los descubrió solos en los datos.
```

---

## 3. Aprendizaje por Refuerzo

```{admonition} ¿Qué es?
:class: tip
El agente aprende mediante **ensayo y error** interactuando con un entorno. Recibe recompensas por buenas acciones y penalizaciones por malas. El objetivo es maximizar la recompensa acumulada a largo plazo.
```

### Fundamento del ciclo agente-entorno

El aprendizaje por refuerzo se basa en el ciclo **Agente - Entorno**:

```text
Estado actual (S_t)
      |
      v
  [Agente]  -->  Acción (A_t)
      |               |
      |               v
      |         [Entorno]
      |               |
      +<-- Recompensa (R_t) + Nuevo estado (S_t+1)
```

El agente aprende una **política** `π(s)` que indica qué acción tomar en cada estado para maximizar la recompensa futura descontada:

```text
G_t = R_t + γ·R_{t+1} + γ²·R_{t+2} + ...
```

Donde `γ` (gamma) es el factor de descuento: cuánto valoramos las recompensas futuras vs. las inmediatas.

**Úsalo cuando:** necesitas optimizar decisiones secuenciales en un entorno dinámico donde la recompensa depende de múltiples acciones encadenadas.

---

### Algoritmo: Q-Learning

**Teoría:** Aprende una tabla `Q(s, a)` que estima la recompensa esperada de tomar la acción `a` en el estado `s`. Se actualiza con cada experiencia:

```text
Q(s, a) = Q(s, a) + α · [R + γ · max Q(s', a') - Q(s, a)]
```

**Cuándo usarlo:** optimización de rutas, secuenciación de actividades, gestión dinámica de recursos.

**Uso en construcción:** optimizar la ruta y secuencia de una grúa torre para minimizar tiempos muertos, ajustar cronogramas ante imprevistos, asignar cuadrillas dinámicamente.

```python
# Conceptual: simulador de planificación de grúa torre
# (requiere framework como Gym de OpenAI para implementación completa)

class SimuladorGrua:
    def __init__(self):
        self.posicion = "almacen"
        self.tiempo_total = 0

    def mover(self, destino):
        tiempos = {"almacen-nivel3": 5, "nivel3-almacen": 5,
                   "almacen-nivel7": 8, "nivel7-almacen": 8}
        clave = f"{self.posicion}-{destino}"
        self.tiempo_total += tiempos.get(clave, 10)
        self.posicion = destino
        recompensa = -tiempos.get(clave, 10)  # menos tiempo = mejor
        return recompensa

# Tras 10.000 episodios de entrenamiento, el agente aprende
# la secuencia óptima de movimientos que minimiza tiempos muertos
```

---

### Analogía: por refuerzo en obra

```{admonition} Aprendizaje por refuerzo en obra
:class: note
Es como **entrenar a un operador de grúa en un simulador**. Sin instrucciones previas, intenta diferentes movimientos. Cuando hace una secuencia eficiente (pocas esperas, cargas bien coordinadas), recibe puntos. Cuando hace movimientos ineficientes (grúa vacía, esperas largas), pierde puntos.

Después de simular 10.000 turnos, el operador virtual ha descubierto por sí solo la secuencia óptima de movimientos — una que ningún experto humano habría podido calcular manualmente.
```

---

## 4. Comparación y criterios de elección

| | Supervisado | No supervisado | Por refuerzo |
| -- | ----------- | -------------- | ------------ |
| **¿Necesita etiquetas?** | Sí | No | No (solo recompensas) |
| **¿Qué produce?** | Predicción / Clase | Grupos / Anomalías | Política de acción |
| **Volumen de datos** | Cientos a miles | Cientos a miles | Millones de interacciones |
| **Tiempo de entrenamiento** | Minutos a horas | Minutos | Horas a días |
| **Más usado en AEC** | Sí (estimación, QC) | Sí (segmentación) | Proyectos avanzados |
| **Complejidad de implementación** | Baja | Media | Alta |

```{admonition} ¿Qué usar en mi proyecto?
:class: note
**¿Tengo datos históricos con respuestas conocidas?** → Supervisado

**¿Quiero descubrir segmentos o anomalías sin etiquetas?** → No supervisado

**¿Necesito optimizar decisiones secuenciales en tiempo real?** → Por refuerzo

Para el 90% de los casos en construcción, el aprendizaje **supervisado** es suficiente y más práctico.
```

---

**Siguiente:** [Pipeline completo de ML](03_pipeline_ml.md)
