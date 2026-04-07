# Pipeline de Machine Learning

Construir un modelo de ML no es solo "usar un algoritmo". Es un **proceso de 6 pasos** que va desde el problema hasta la solución en producción.

```{admonition} Analogía: Construir un modelo de ML es como construir un edificio
:class: note
1. **Recolectar datos** = Estudios de suelo (sin datos buenos, el edificio colapsa)
2. **Preprocesar** = Limpiar el terreno (quitar escombros, nivelar)
3. **Explorar** = Planos y maquetas (visualizar antes de construir)
4. **Entrenar** = Construcción (levantar la estructura)
5. **Evaluar** = Inspecciones (¿cumple especificaciones?)
6. **Desplegar** = Entrega y uso (los habitantes usan el edificio)

Si saltamos algún paso, el proyecto falla. Igual con ML.
```

---

## Paso 1 · Recolectar los datos

En construcción, los datos pueden venir de:

| Fuente | Ejemplos |
|--------|----------|
| **ERP / Software** | SAP, SINCO — costos, materiales, mano de obra |
| **Hojas de cálculo** | Excel con históricos de proyectos |
| **IoT / Sensores** | Temperatura, humedad, vibración de maquinaria |
| **Apps móviles** | AppSheet, formularios de inspección |
| **BIM** | Modelos Revit exportados como CSV |
| **Documentos** | PDFs de actas y contratos |

```python
import pandas as pd
from google.cloud import bigquery

# Desde Excel
df = pd.read_excel("historico_proyectos.xlsx")

# Desde CSV de Revit
df = pd.read_csv("elementos_estructurales.csv")

# Desde BigQuery
client = bigquery.Client()
df = client.query("SELECT * FROM proyectos.edificio_cumbre").to_dataframe()
```

---

## Paso 2 · Preprocesar los datos

**Problemas comunes en datos de construcción:**

- Valores faltantes (`$2,500` vs `2500` vs `$2.5K`)
- Duplicados (mismo proveedor con nombres diferentes)
- Errores de digitación (`cemento` vs `cemneto`)
- Escalas diferentes (metros vs pies, pesos vs dólares)

```python
import pandas as pd

df = pd.read_csv("proyectos.csv")

# 1. Eliminar duplicados
df = df.drop_duplicates()

# 2. Rellenar valores faltantes con el promedio
df["costo"].fillna(df["costo"].mean(), inplace=True)

# 3. Convertir tipos de datos
df["fecha_inicio"] = pd.to_datetime(df["fecha_inicio"])
df["costo"] = df["costo"].str.replace("$", "").str.replace(",", "").astype(float)

# 4. Normalizar escalas
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
df[["area_m2", "pisos", "costo"]] = scaler.fit_transform(df[["area_m2", "pisos", "costo"]])
```

---

## Paso 3 · Explorar los datos (EDA)

Antes de entrenar cualquier modelo, visualiza lo que tienes.

```python
import matplotlib.pyplot as plt
import seaborn as sns

# Distribución de costos
df["costo"].hist(bins=30)
plt.xlabel("Costo (millones COP)")
plt.title("Distribución de costos de proyectos")
plt.show()

# Relación área vs costo
plt.scatter(df["area_m2"], df["costo"])
plt.xlabel("Área (m²)")
plt.ylabel("Costo ($)")
plt.show()

# Matriz de correlación
sns.heatmap(df.corr(), annot=True, cmap="coolwarm")
plt.show()
```

**Hallazgos típicos en construcción:**
- `"El área explica el 85% de la variación del costo"` variable importante
- `"Proyectos en Zona X cuestan 30% más"` crear variable zona_premium
- `"5 proyectos tienen costo negativo"` error de digitación, corregir

---

## Paso 4 · Entrenar el modelo

```python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor

# Separar variables de entrada (X) y salida (y)
X = df[["area_m2", "pisos", "zona_norte", "tipo_concreto"]]
y = df["costo_total"]

# Dividir: 80% entrenamiento, 20% prueba
X_train, X_test, y_train, y_test = train_test_split(
 X, y, test_size=0.2, random_state=42
)

# Crear y entrenar el modelo
modelo = RandomForestRegressor(n_estimators=100, random_state=42)
modelo.fit(X_train, y_train)
```

**¿Qué algoritmo usar?**

| Problema | Algoritmo recomendado |
|----------|-----------------------|
| Predecir costo (número) | `LinearRegression`, `RandomForestRegressor` |
| Clasificar (aprobado/rechazado) | `LogisticRegression`, `SVM` |
| Agrupar proyectos similares | `KMeans`, `DBSCAN` |
| Detectar anomalías en gastos | `IsolationForest` |
| Predecir serie de tiempo | `ARIMA`, `Prophet` |

---

## Paso 5 · Evaluar el modelo

```{warning}
Un modelo que funciona perfecto en entrenamiento pero mal en datos nuevos tiene **sobreajuste (overfitting)**. Es como memorizar un examen sin entender el tema.

Señal de alerta: precisión entrenamiento 98%, precisión prueba 65% diferencia > 20% = problema.
```

```python
from sklearn.metrics import mean_absolute_error, r2_score
import numpy as np

y_pred = modelo.predict(X_test)

# Error promedio en las mismas unidades
mae = mean_absolute_error(y_test, y_pred)
print(f"Error promedio: ${mae:,.0f} COP")

# R² — qué porcentaje de variación explica el modelo
r2 = r2_score(y_test, y_pred)
print(f"R²: {r2:.2f} ({r2*100:.1f}% de varianza explicada)")
# R² = 0.85 muy bueno
# R² < 0.50 modelo pobre, necesita mejoras
```

---

## Paso 6 · Desplegar el modelo

```python
import joblib

# Guardar el modelo entrenado
joblib.dump(modelo, "modelo_costos_v1.pkl")

# Cargar y usar después
modelo_cargado = joblib.load("modelo_costos_v1.pkl")

nuevo_proyecto = [[1200, 5, 1, 1]] # área, pisos, zona, tipo
prediccion = modelo_cargado.predict(nuevo_proyecto)
print(f"Costo estimado: ${prediccion[0]:,.0f} COP")
```

**Opciones de despliegue:**

| Opción | Tecnología | Cuándo usarla |
|--------|-----------|---------------|
| Script local | Python + Joblib | Uso propio, pruebas |
| API web | FastAPI | Integrar con otras apps |
| App interactiva | Streamlit | Compartir con el equipo de obra |
| Nube | Google Cloud Run / AWS Lambda | Producción y escala |

---

**Siguiente:** [Librerías esenciales ](04_librerias.md)
