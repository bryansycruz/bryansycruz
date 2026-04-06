# Tipos de Machine Learning

Existen tres formas principales en que una máquina puede aprender. Cada una es útil para diferentes problemas en construcción.

---

## 1 · Aprendizaje Supervisado

```{admonition} ¿Qué es?
:class: tip
Se enseña al algoritmo con datos que **ya tienen la respuesta correcta**. Es como estudiar con un examen resuelto.
```

**Úsalo cuando:** tienes datos históricos con resultados conocidos.

| Tipo | Pregunta que responde | Ejemplo en obra |
|------|-----------------------|-----------------|
| **Clasificación** | ¿A qué categoría pertenece? | ¿Este material es defectuoso o no? |
| **Regresión** | ¿Qué número esperar? | ¿Cuánto costará este proyecto? |

### Ejemplo: Clasificar calidad de soldaduras

```python
# Datos de entrenamiento — ya sabemos si son buenas o malas
soldaduras = [
    {"temperatura": 450, "tiempo": 30, "presion": 80, "calidad": "BUENA"},
    {"temperatura": 380, "tiempo": 15, "presion": 60, "calidad": "MALA"},
    {"temperatura": 470, "tiempo": 35, "presion": 85, "calidad": "BUENA"},
]

# El algoritmo aprende el patrón...

# Nueva soldadura sin etiqueta:
nueva = {"temperatura": 460, "tiempo": 32, "presion": 82}
prediccion = modelo.predict(nueva)
# → "BUENA" (90% confianza)
```

**Algoritmos más usados:**
- `LinearRegression` — predecir números (costo, tiempo, cantidad)
- `LogisticRegression` — clasificar (aprobado / rechazado)
- `RandomForest` — problemas complejos con muchas variables

---

## 2 · Aprendizaje No Supervisado

```{admonition} ¿Qué es?
:class: tip
El algoritmo recibe datos **sin etiquetas** y debe encontrar patrones por sí solo. Es como organizar piezas de LEGO sin instrucciones.
```

**Úsalo cuando:** no tienes respuestas previas y quieres descubrir grupos o anomalías.

**Casos en construcción:**
- Agrupar proyectos similares para análisis comparativo
- Detectar gastos o consumos inusuales
- Simplificar datos complejos de sensores IoT

### Ejemplo: Agrupar proveedores

```python
proveedores = [
    {"precio": 150, "entrega_dias": 3, "calidad": 4.2},
    {"precio": 145, "entrega_dias": 2, "calidad": 4.5},
    {"precio": 90,  "entrega_dias": 8, "calidad": 3.1},
    # ... 97 proveedores más
]

# K-Means los agrupa automáticamente:
# Grupo 1: "Premium"    → caros, rápidos, excelente calidad
# Grupo 2: "Económicos" → baratos, lentos, calidad variable
# Grupo 3: "Balanceados"→ precio medio, tiempos medios, buena calidad
```

---

## 3 · Aprendizaje por Refuerzo

```{admonition} ¿Qué es?
:class: tip
El algoritmo aprende mediante **ensayo y error**, recibiendo recompensas por buenas decisiones y penalizaciones por malas. Es como entrenar a un perro.
```

**Úsalo cuando:** necesitas optimizar procesos dinámicos en tiempo real.

**Casos en construcción:**
- Optimizar rutas de grúas torre
- Ajustar cronogramas dinámicamente
- Controlar uso de maquinaria pesada

### Ejemplo: Optimización de grúa torre

```
Episodio 1:   Ruta A→B→C→D  →  45 min  →  Recompensa: -45
Episodio 2:   Ruta A→D→C→B  →  38 min  →  Recompensa: -38 ✓ mejor
...
Episodio 10.000: Ruta óptima →  28 min  →  Recompensa: -28 ✓ excelente
```

---

## Comparación rápida

```{admonition} 🏗️ Analogía para cimentaciones
:class: note
Los tres tipos de aprendizaje son como tres formas de aprender a diseñar una cimentación:

1. **Supervisado** → Curso donde el profesor muestra 100 casos con sus cálculos correctos.
2. **No supervisado** → Te dan 1000 planos mezclados y debes agruparlos por tipo sin ayuda.
3. **Por refuerzo** → Diseñas en un simulador: si falla, pierdes puntos; si resiste, ganas. Repites 10.000 veces.
```

| | Supervisado | No supervisado | Por refuerzo |
|--|-------------|----------------|--------------|
| **¿Necesita etiquetas?** | ✅ Sí | ❌ No | ❌ No |
| **¿Qué produce?** | Predicción / Clasificación | Grupos / Anomalías | Política de acción |
| **Dificultad** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Más usado en AEC** | ✅ Sí | ✅ Sí | Casos avanzados |

---

**Siguiente:** [Pipeline completo de ML →](03_pipeline_ml.md)
