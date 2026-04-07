# Librerías esenciales de Python para ML

```{admonition} Las librerías son como herramientas en una obra
:class: tip
- **NumPy** = Calculadora de ingeniero (cálculos rápidos y precisos)
- **Pandas** = Hoja de cálculo Excel potenciada (organizar datos)
- **Scikit-learn** = Software de diseño estructural (modelos ML)
- **Matplotlib / Seaborn** = Planos y renders (visualizar resultados)
- **TensorFlow / PyTorch** = Software BIM completo (proyectos muy complejos)

No necesitas todas siempre. Para un proyecto residencial pequeño, no necesitas BIM completo.
```

---

## Tabla resumen

| Librería | Propósito | ¿Cuándo usarla? |
|----------|-----------|-----------------|
| **Scikit-learn** | Algoritmos ML clásicos | Siempre (es la base) |
| **Pandas** | Manipulación de tablas y CSVs | Siempre |
| **NumPy** | Cálculos numéricos y matrices | Siempre |
| **Matplotlib** | Gráficos científicos | Visualización |
| **Seaborn** | Gráficos estadísticos | Análisis exploratorio |
| **TensorFlow / Keras** | Deep Learning | Redes neuronales, imágenes |
| **PyTorch** | Deep Learning flexible | Investigación, modelos custom |
| **XGBoost** | Gradient Boosting | Tablas de datos complejos |
| **Prophet** | Series de tiempo | Predicciones temporales |

---

## Scikit-learn - La navaja suiza del ML

```python
# Modelos de clasificación
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC

# Modelos de regresión
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor

# Clustering
from sklearn.cluster import KMeans, DBSCAN

# Preprocesamiento
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline

# Métricas
from sklearn.metrics import accuracy_score, r2_score, mean_absolute_error
```

### Ejemplo completo con Pipeline

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
import pandas as pd

df = pd.read_csv("proyectos_historicos.csv")
X = df[["area_m2", "pisos", "zona"]]
y = df["costo_total"]

# Pipeline: preprocesa y entrena en un solo paso
pipeline = Pipeline([
 ("scaler", StandardScaler()),
 ("modelo", RandomForestRegressor(n_estimators=100))
])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
pipeline.fit(X_train, y_train)

# Predecir nuevo proyecto: 1500 m², 6 pisos, zona norte
prediccion = pipeline.predict([[1500, 6, 1]])
print(f"Costo estimado: ${prediccion[0]:,.0f} COP")
```

---

## Pandas - Excel con superpoderes

```python
import pandas as pd

# Leer datos
df = pd.read_csv("proyectos.csv")
df = pd.read_excel("costos.xlsx", sheet_name="2024")

# Explorar
df.head(10) # primeras 10 filas
df.info() # tipos de datos y nulos
df.describe() # estadísticas básicas

# Filtrar
df_2024 = df[df["año"] == 2024]
df_caros = df[df["costo"] > 5_000_000]

# Agrupar y agregar
df.groupby("zona")["costo"].mean()
df.groupby(["zona", "tipo"])["area"].sum()

# Crear nuevas columnas
df["costo_por_m2"] = df["costo"] / df["area"]

# Exportar
df.to_csv("resultado.csv", index=False)
df.to_excel("informe.xlsx", sheet_name="Resultados")
```

### Caso práctico - Análisis de avance por piso

```python
df = pd.read_csv("edificio_cumbre_elementos.csv")

# Calcular estadísticas por piso
stats = df.groupby("nivel").agg({
 "cantidad": "sum",
 "costo": "mean",
 "avance": "mean"
})

# Identificar pisos con bajo avance
pisos_atrasados = stats[stats["avance"] < 0.70]
print(f" Pisos con retraso: {list(pisos_atrasados.index)}")
```

---

## NumPy - Cálculos numéricos rápidos

```python
import numpy as np

# Operaciones vectorizadas (100× más rápido que loops)
costos = np.array([2.5, 4.2, 3.8, 5.1])
costos_con_iva = costos * 1.19 # aplica a todos de una sola vez

# Estadísticas
np.mean(costos)
np.median(costos)
np.std(costos)
np.percentile(costos, 75)

# Simulación de variabilidad de costos (Monte Carlo)
np.random.seed(42)
costo_base = 5_000_000
simulaciones = np.random.normal(
 loc=costo_base,
 scale=costo_base * 0.15, # ±15% de variabilidad
 size=1000
)

print(f"Costo promedio simulado: ${simulaciones.mean():,.0f}")
p25, p75 = np.percentile(simulaciones, [2.5, 97.5])
print(f"Rango 95%: ${p25:,.0f} - ${p75:,.0f}")
```

---

## Instalación rápida

```bash
pip install scikit-learn pandas numpy matplotlib seaborn
```

Para Deep Learning (Módulo 2):
```bash
pip install tensorflow torch torchvision
```

Para Series de tiempo:
```bash
pip install prophet xgboost
```

---

```{admonition} Libros recomendados
:class: seealso
- **Hands-on Machine Learning** (Aurélien Géron) - capítulos 1-6
- **Python for Data Analysis** (Wes McKinney) - creador de Pandas
- **Python Data Science Handbook** (Jake VanderPlas) - gratis en línea
```
